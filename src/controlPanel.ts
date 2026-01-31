import * as path from 'path';
import * as vscode from 'vscode';
import { getTaskStatsAsync, getNextTaskAsync, readPRDAsync, parseTasksAsync, discoverPrdRootsAsync, getWorkspaceRoot, getAggregatedStatsAsync } from './fileUtils';
import { TaskCompletion, TaskRequirements, RalphSettings, IRalphUI, WebviewError, PanelState, DEFAULT_PANEL_STATE, DEFAULT_REQUIREMENTS, LogLevel, ProjectInfo } from './types';
import { logError, log } from './logger';
import { getSettings } from './config';
import { getLogo } from './webview';
import { WebviewBuilder } from './webviewBuilder';
import {
    PanelEventType,
    PanelEventData,
    PanelEventHandler,
    MessageHandlerContext,
    processMessageWithValidation,
    formatValidationError
} from './messageHandlers';

/** Storage key for panel state in workspaceState */
export const PANEL_STATE_KEY = 'ralph.panelState';

/** Webview panel type identifier used for serialization */
export const PANEL_VIEW_TYPE = 'ralphPanel';

// Re-export types from messageHandlers for backward compatibility
export { PanelEventType, PanelEventData, PanelEventHandler } from './messageHandlers';

export class RalphPanel implements IRalphUI {
    private readonly panel: vscode.WebviewPanel;
    private readonly context: vscode.ExtensionContext;
    private disposables: vscode.Disposable[] = [];
    private isDisposed = false;
    private isVisible = true;
    private readonly messageQueue: object[] = [];
    private panelState: PanelState;

    private readonly eventHandlers = new Map<PanelEventType, Set<PanelEventHandler>>();

    private onDisposeCallback?: () => void;

    constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this.panel = panel;
        this.context = context;
        this.isVisible = panel.visible;
        this.panelState = this.restoreState();
        this.initializeHtml();
        this.setupMessageHandler();
        this.setupVisibilityHandler();
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }

    private async initializeHtml(): Promise<void> {
        this.panel.webview.html = await RalphPanel.generateHtmlAsync(this.panelState);
    }

    /**
     * Restores panel state from workspace storage.
     */
    private restoreState(): PanelState {
        const stored = this.context.workspaceState.get<PanelState>(PANEL_STATE_KEY);
        if (stored) {
            log(`Restored panel state: ${stored.collapsedSections.length} collapsed sections, scroll position ${stored.scrollPosition}, requirements: ${JSON.stringify(stored.requirements || {})}`);
            return {
                collapsedSections: Array.isArray(stored.collapsedSections) ? stored.collapsedSections : [],
                scrollPosition: typeof stored.scrollPosition === 'number' ? stored.scrollPosition : 0,
                requirements: this.validateRequirements(stored.requirements)
            };
        }
        return { ...DEFAULT_PANEL_STATE };
    }

    /**
     * Validates and normalizes a requirements object.
     * Returns DEFAULT_REQUIREMENTS if the input is invalid.
     */
    private validateRequirements(requirements: unknown): TaskRequirements {
        if (!requirements || typeof requirements !== 'object') {
            return { ...DEFAULT_REQUIREMENTS };
        }
        const req = requirements as Record<string, unknown>;
        return {
            runTests: typeof req.runTests === 'boolean' ? req.runTests : false,
            runLinting: typeof req.runLinting === 'boolean' ? req.runLinting : false,
            runTypeCheck: typeof req.runTypeCheck === 'boolean' ? req.runTypeCheck : false,
            writeTests: typeof req.writeTests === 'boolean' ? req.writeTests : false,
            updateDocs: typeof req.updateDocs === 'boolean' ? req.updateDocs : false,
            commitChanges: typeof req.commitChanges === 'boolean' ? req.commitChanges : false
        };
    }

    /**
     * Saves the current panel state to workspace storage.
     */
    private async saveState(): Promise<void> {
        if (this.isDisposed) {
            return;
        }
        try {
            await this.context.workspaceState.update(PANEL_STATE_KEY, this.panelState);
            log(`Saved panel state: ${this.panelState.collapsedSections.length} collapsed sections, scroll position ${this.panelState.scrollPosition}, requirements saved`);
        } catch (error) {
            logError('Failed to save panel state', error);
        }
    }

    /**
     * Updates the panel state and persists it.
     */
    public updatePanelState(state: Partial<PanelState>): void {
        if (this.isDisposed) {
            return;
        }
        
        let changed = false;
        
        if (state.collapsedSections !== undefined) {
            this.panelState.collapsedSections = state.collapsedSections;
            changed = true;
        }
        
        if (state.scrollPosition !== undefined) {
            this.panelState.scrollPosition = state.scrollPosition;
            changed = true;
        }

        if (state.requirements !== undefined) {
            this.panelState.requirements = state.requirements;
            changed = true;
        }
        
        if (changed) {
            this.saveState();
        }
    }

    /**
     * Gets the current saved requirements from panel state.
     */
    public getSavedRequirements(): TaskRequirements {
        return { ...this.panelState.requirements };
    }

    on(event: PanelEventType, handler: PanelEventHandler): vscode.Disposable {
        if (this.isDisposed) {
            // Return a no-op disposable for disposed panels
            return { dispose: () => {} };
        }
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);

        return {
            dispose: () => {
                this.eventHandlers.get(event)?.delete(handler);
            }
        };
    }

    private emit(event: PanelEventType, data?: PanelEventData): void {
        if (this.isDisposed) {
            return;
        }
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    private setupMessageHandler(): void {
        this.panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message),
            null,
            this.disposables
        );
    }

    private setupVisibilityHandler(): void {
        this.panel.onDidChangeViewState(
            (e) => {
                const wasVisible = this.isVisible;
                this.isVisible = e.webviewPanel.visible;

                // Flush queued messages when panel becomes visible
                if (this.isVisible && !wasVisible) {
                    this.flushMessageQueue();
                }
            },
            null,
            this.disposables
        );
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message && this.isPanelAvailable()) {
                try {
                    this.panel.webview.postMessage(message);
                } catch (error) {
                    logError('Failed to post queued message to webview', error);
                }
            }
        }
    }

    /**
     * Creates the message handler context for processing webview messages.
     */
    private createMessageHandlerContext(): MessageHandlerContext {
        return {
            emit: (event: PanelEventType, data?: PanelEventData) => this.emit(event, data),
            updatePanelState: (state) => this.updatePanelState(state),
            refresh: () => this.refresh(),
            handleWebviewError: (error) => this.handleWebviewError(error),
            refreshHistory: () => this.updateCompletionHistory(),
            refreshSessionStats: () => this.updateSessionStats()
        };
    }

    private handleMessage(message: unknown): void {
        // Use the message handler registry with runtime validation
        const context = this.createMessageHandlerContext();
        const result = processMessageWithValidation(message, context, (validationResult) => {
            // Log validation errors with full details
            logError(`Invalid webview message received: ${formatValidationError(validationResult)}`);
        });
        
        if (!result.success) {
            if (result.validated) {
                // Message was valid but no handler found (shouldn't happen normally)
                log(`Unhandled webview message: ${(message as { command?: string })?.command || 'unknown'}`);
            }
            // If !result.validated, error was already logged in the callback
        }
    }

    private handleWebviewError(error: WebviewError): void {
        const location = error.lineno > 0 ? ` at line ${error.lineno}:${error.colno}` : '';
        const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
        logError(`Webview script error${location}${source}: ${error.message}`, error.stack ? { stack: error.stack } : undefined);
    }

    public static createPanel(extensionUri: vscode.Uri): vscode.WebviewPanel {
        const column = vscode.ViewColumn.Two;
        const panel = vscode.window.createWebviewPanel(
            PANEL_VIEW_TYPE, 'Ralph', column,
            { enableScripts: true, retainContextWhenHidden: true }
        );
        panel.iconPath = vscode.Uri.joinPath(extensionUri, 'icon.png');
        return panel;
    }

    /**
     * Configures an existing webview panel for use as a Ralph panel.
     * Used during deserialization to restore a panel after VS Code restart.
     */
    public static configurePanel(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): void {
        panel.webview.options = { enableScripts: true };
        panel.iconPath = vscode.Uri.joinPath(extensionUri, 'icon.png');
    }

    public reveal(): void {
        if (this.isDisposed) {
            return;
        }
        this.panel.reveal(vscode.ViewColumn.Two);
    }

    private isPanelAvailable(): boolean {
        return !this.isDisposed && this.panel && this.panel.webview !== undefined;
    }

    private safePostMessage(message: object): boolean {
        if (!this.isPanelAvailable()) {
            return false;
        }

        // Queue message if panel is hidden
        if (!this.isVisible) {
            this.messageQueue.push(message);
            return true;
        }

        try {
            this.panel.webview.postMessage(message);
            return true;
        } catch (error) {
            logError('Failed to post message to webview', error);
            return false;
        }
    }

    public onDispose(callback: () => void): void {
        this.onDisposeCallback = callback;
    }

    public async refresh(): Promise<void> {
        if (this.isDisposed) {
            return;
        }
        this.panel.webview.html = await RalphPanel.generateHtmlAsync(this.panelState);
    }

    public updateStatus(status: string, iteration: number, taskInfo: string, _history: TaskCompletion[]): void {
        this.safePostMessage({ type: 'update', status, iteration, taskInfo });
    }

    public updateCountdown(seconds: number): void {
        this.safePostMessage({ type: 'countdown', seconds });
    }

    public updateHistory(history: TaskCompletion[]): void {
        this.safePostMessage({ type: 'history', history });
    }

    public updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number): void {
        this.safePostMessage({ type: 'timing', startTime, taskHistory, pendingTasks });
    }

    public async updateStats(): Promise<void> {
        const stats = await getTaskStatsAsync();
        const nextTask = await getNextTaskAsync();
        const allTasks = await parseTasksAsync();
        const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        this.safePostMessage({
            type: 'stats',
            completed: stats.completed,
            pending: stats.pending,
            total: stats.total,
            progress,
            nextTask: nextTask?.description || null,
            tasks: allTasks
        });

        // Also update aggregated stats if multi-project workspace
        await this.updateAggregatedStats();
        
        // Also update completion history
        await this.updateCompletionHistory();
        
        // Also update session stats dashboard
        await this.updateSessionStats();
    }

    /**
     * Updates the aggregated statistics section in the webview.
     * This provides an overview of task progress across all projects in multi-root workspaces.
     */
    public async updateAggregatedStats(): Promise<void> {
        const aggregatedStats = await getAggregatedStatsAsync();
        const currentProject = getWorkspaceRoot();

        this.safePostMessage({
            type: 'aggregatedStats',
            projects: aggregatedStats.projects,
            totalTasks: aggregatedStats.totalTasks,
            totalCompleted: aggregatedStats.totalCompleted,
            totalPending: aggregatedStats.totalPending,
            overallProgress: aggregatedStats.overallProgress,
            projectCount: aggregatedStats.projectCount,
            currentProject
        });
    }

    /**
     * Updates the completion history section in the webview.
     * This displays historical task completion data over time.
     */
    public async updateCompletionHistory(): Promise<void> {
        const { getHistoryStorage } = await import('./historyStorage.js');
        const historyStorage = getHistoryStorage();
        
        if (!historyStorage) {
            // No history storage available - send empty data
            this.safePostMessage({
                type: 'completionHistory',
                stats: { totalTasks: 0, totalDuration: 0, averageDuration: 0, uniqueProjects: 0, uniqueSessions: 0, oldestRecord: null, newestRecord: null },
                dailySummaries: []
            });
            return;
        }

        try {
            const stats = await historyStorage.getOverallStats();
            const dailySummaries = await historyStorage.getDailySummaries(30);

            this.safePostMessage({
                type: 'completionHistory',
                stats,
                dailySummaries
            });
        } catch (error) {
            logError('Failed to update completion history', error);
        }
    }

    /**
     * Updates the session statistics dashboard in the webview.
     * This displays current session performance metrics.
     */
    public async updateSessionStats(): Promise<void> {
        const { getHistoryStorage } = await import('./historyStorage.js');
        const historyStorage = getHistoryStorage();
        
        if (!historyStorage) {
            // No history storage available - send empty session data
            this.safePostMessage({
                type: 'sessionStats',
                sessionId: '',
                sessionStartTime: 0,
                tasksCompleted: 0,
                totalDuration: 0,
                averageDuration: 0,
                fastestTask: null,
                slowestTask: null,
                currentStreak: 0,
                timeSinceLastCompletion: null,
                tasksPerHour: 0,
                completedTasks: [],
                projectsWorkedOn: 0
            });
            return;
        }

        try {
            const sessionStats = await historyStorage.getSessionStats();
            this.safePostMessage({
                type: 'sessionStats',
                ...sessionStats
            });
        } catch (error) {
            logError('Failed to update session stats', error);
        }
    }

    public static async generateHtmlAsync(panelState?: PanelState): Promise<string> {
        const stats = await getTaskStatsAsync();
        const nextTask = await getNextTaskAsync();
        const allTasks = await parseTasksAsync();
        const prd = await readPRDAsync();
        const hasPrd = !!prd;
        
        // Fetch projects info
        const projectRoots = await discoverPrdRootsAsync();
        const projects: ProjectInfo[] = projectRoots.map(root => ({
            name: path.basename(root),
            path: root
        }));
        const currentProject = getWorkspaceRoot();
        
        // Get requirements from panel state or use defaults
        const requirements = panelState?.requirements || DEFAULT_REQUIREMENTS;
        
        // Get settings from VS Code configuration
        const settings = getSettings();

        // Use WebviewBuilder to generate HTML
        return WebviewBuilder.buildHtml({
            hasPrd,
            nextTask,
            allTasks,
            totalTasks: stats.total,
            panelState: panelState || DEFAULT_PANEL_STATE,
            requirements,
            settings,
            projects,
            currentProject
        });
    }

    public addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        // Support both legacy boolean (highlight = success) and new LogLevel types
        let level: LogLevel;
        let highlight: boolean;
        
        if (typeof highlightOrLevel === 'boolean') {
            highlight = highlightOrLevel;
            level = highlightOrLevel ? 'success' : 'info';
        } else {
            level = highlightOrLevel;
            highlight = highlightOrLevel === 'success';
        }
        
        this.safePostMessage({ type: 'log', message, highlight, level });
    }

    public showPrdGenerating(): void {
        this.safePostMessage({ type: 'prdGenerating' });
    }

    public hidePrdGenerating(): void {
        this.safePostMessage({ type: 'prdComplete' });
    }

    /**
     * Shows a toast notification in the webview.
     * @param type - Toast type: 'success', 'error', 'warning', or 'info'
     * @param message - The message to display
     * @param title - Optional title
     * @param duration - Duration in ms before auto-dismiss (0 = no auto-dismiss)
     */
    public showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string, duration?: number): void {
        this.safePostMessage({
            type: 'toast',
            toastType: type,
            message,
            title: title || '',
            duration,
            dismissible: true
        });
    }

    /**
     * Shows an error toast notification.
     */
    public showErrorToast(message: string, title?: string): void {
        this.showToast('error', message, title || 'Error', 8000);
    }

    /**
     * Shows a success toast notification.
     */
    public showSuccessToast(message: string, title?: string): void {
        this.showToast('success', message, title);
    }

    /**
     * Shows a warning toast notification.
     */
    public showWarningToast(message: string, title?: string): void {
        this.showToast('warning', message, title || 'Warning', 6000);
    }

    /**
     * Shows an info toast notification.
     */
    public showInfoToast(message: string, title?: string): void {
        this.showToast('info', message, title);
    }

    /**
     * Sends a report completion message to the webview.
     * @param report - The generated productivity report
     * @param exported - Whether the report was exported to a file
     * @param format - The export format used
     */
    public sendReportComplete(report: object, exported?: boolean, format?: string): void {
        this.safePostMessage({ 
            type: 'reportComplete', 
            report,
            exported,
            format
        });
    }

    /**
     * Sends a report error message to the webview.
     * @param message - The error message
     */
    public sendReportError(message: string): void {
        this.safePostMessage({ 
            type: 'reportError', 
            message 
        });
    }

    /**
     * Shows skeleton loaders for content areas.
     * Call this before async operations that may take time.
     */
    public showLoading(): void {
        this.safePostMessage({ type: 'loading', isLoading: true });
    }

    /**
     * Hides skeleton loaders and shows actual content.
     * Call this after async operations complete.
     */
    public hideLoading(): void {
        this.safePostMessage({ type: 'loading', isLoading: false });
    }

    private dispose(): void {
        if (this.isDisposed) { return; }
        this.isDisposed = true;

        this.onDisposeCallback?.();

        this.eventHandlers.clear();

        this.panel.dispose();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}

export class RalphSidebarProvider implements vscode.WebviewViewProvider, IRalphUI {
    private _view?: vscode.WebviewView;
    private _isVisible = false;
    private _isDisposed = false;
    private readonly _messageQueue: object[] = [];
    private _disposables: vscode.Disposable[] = [];
    private _currentStatus = 'idle';
    private _currentIteration = 0;
    private _currentTask = '';
    private _progress = 0;
    private _completedTasks = 0;
    private _totalTasks = 0;
    private _countdown = 0;
    private _logs: Array<{ message: string; highlight: boolean; level?: LogLevel }> = [];
    private _isPrdGenerating = false;
    private _hasPrd = false;
    private readonly _eventHandlers = new Map<PanelEventType, Set<PanelEventHandler>>();

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) { }

    public on(event: PanelEventType, handler: PanelEventHandler): vscode.Disposable {
        if (this._isDisposed) {
            // Return a no-op disposable for disposed sidebar
            return { dispose: () => {} };
        }
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, new Set());
        }
        this._eventHandlers.get(event)!.add(handler);

        return {
            dispose: () => {
                this._eventHandlers.get(event)?.delete(handler);
            }
        };
    }

    private emit(event: PanelEventType, data?: PanelEventData): void {
        if (this._isDisposed) {
            return;
        }
        this._eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void {
        this._view = webviewView;
        this._isVisible = webviewView.visible;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // Initialize PRD availability and render
        this.initializeSidebar();

        // Setup visibility change handler
        this._disposables.push(
            webviewView.onDidChangeVisibility(() => {
                const wasVisible = this._isVisible;
                this._isVisible = webviewView.visible;

                // Flush queued messages when view becomes visible
                if (this._isVisible && !wasVisible) {
                    this.flushMessageQueue();
                }
            })
        );

        // Cleanup on dispose
        this._disposables.push(
            webviewView.onDidDispose(() => {
                this._isDisposed = true;
                this._eventHandlers.clear();
                this._disposables.forEach(d => d.dispose());
                this._disposables = [];
            })
        );

        webviewView.webview.onDidReceiveMessage(message => {
            this.handleSidebarMessage(message);
        });
    }

    /**
     * Creates the message handler context for processing sidebar webview messages.
     */
    private createSidebarMessageHandlerContext(): MessageHandlerContext {
        return {
            emit: (event: PanelEventType, data?: PanelEventData) => this.emit(event, data),
            handleWebviewError: (error) => this.handleWebviewError(error)
        };
    }

    /**
     * Handle messages received from the sidebar webview.
     */
    private handleSidebarMessage(message: unknown): void {
        // Use the message handler registry with runtime validation
        const context = this.createSidebarMessageHandlerContext();
        const result = processMessageWithValidation(message, context, (validationResult) => {
            // Log validation errors with full details
            logError(`Invalid sidebar message received: ${formatValidationError(validationResult)}`);
        });
        
        if (!result.success) {
            if (result.validated) {
                // Message was valid but no handler found
                log(`Unhandled sidebar message: ${(message as { command?: string })?.command || 'unknown'}`);
            }
            // If !result.validated, error was already logged in the callback
        }
    }

    private flushMessageQueue(): void {
        while (this._messageQueue.length > 0) {
            const message = this._messageQueue.shift();
            if (message && this.isViewAvailable()) {
                try {
                    this._view!.webview.postMessage(message);
                } catch {
                    // Ignore errors when posting queued messages
                }
            }
        }
    }

    private async initializeSidebar(): Promise<void> {
        if (this._isDisposed) {
            return;
        }
        // Check for PRD availability
        const prd = await readPRDAsync();
        
        // Check again after async operation in case view was disposed
        if (this._isDisposed) {
            return;
        }
        
        this._hasPrd = !!prd;
        
        // Initial render
        if (this._view) {
            this._view.webview.html = this.getHtml();
        }
    }

    private getHtml(): string {
        // Determine status: waiting takes precedence when countdown is active during running
        const isWaiting = this._currentStatus === 'running' && this._countdown > 0;
        const statusClass = isWaiting ? 'waiting' :
            this._currentStatus === 'running' ? 'running' :
            this._currentStatus === 'paused' ? 'paused' : 'idle';
        const statusText = isWaiting ? 'Waiting' :
            this._currentStatus === 'running' ? 'Running' :
            this._currentStatus === 'paused' ? 'Paused' : 'Ready';

        const isRunning = this._currentStatus === 'running' && !isWaiting;
        const isPaused = this._currentStatus === 'paused';
        const isIdle = this._currentStatus === 'idle';
        const isActive = this._currentStatus !== 'idle';
        const canStart = isIdle && this._hasPrd;

        const recentLogs = this._logs.slice(-5);
        const logsHtml = recentLogs.map(log => {
            const levelClass = log.level || (log.highlight ? 'success' : 'info');
            return `<div class="log-entry ${levelClass}" data-level="${levelClass}">${this.escapeHtml(log.message)}</div>`;
        }).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ralph</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background: var(--vscode-sideBar-background);
            padding: 12px;
            margin: 0;
        }
        .container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .logo { flex-shrink: 0; }
        .title-area { flex: 1; min-width: 0; }
        h2 { margin: 0; font-size: 14px; font-weight: 600; }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            margin-top: 4px;
        }
        .status-badge.idle {
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }
        .status-badge.running {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
        }
        .status-badge.paused {
            background: rgba(251, 191, 36, 0.2);
            color: #fbbf24;
        }
        .status-badge.waiting {
            background: rgba(124, 58, 237, 0.2);
            color: #a78bfa;
        }
        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
        }
        .status-badge.running .status-dot {
            animation: pulse 1.5s ease-in-out infinite;
        }
        .status-badge.waiting .status-dot {
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }

        .progress-section {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 10px;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            font-size: 11px;
        }
        .progress-label { color: var(--vscode-descriptionForeground); }
        .progress-value { font-weight: 600; }
        .progress-percentage {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 2px;
            margin: 8px 0;
        }
        .progress-percentage-value {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #7c3aed, #2563eb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
        }
        .progress-percentage-symbol {
            font-size: 16px;
            font-weight: 600;
            color: var(--vscode-descriptionForeground);
        }
        .progress-percentage-complete {
            background: linear-gradient(135deg, #22c55e, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .progress-bar {
            height: 4px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #2563eb);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        
        .task-info {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 8px;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .task-info strong {
            color: var(--vscode-foreground);
        }

        .countdown-section {
            display: ${this._countdown > 0 ? 'flex' : 'none'};
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: rgba(124, 58, 237, 0.1);
            border-radius: 6px;
            font-size: 11px;
        }
        .countdown-value {
            font-weight: 600;
            color: #7c3aed;
        }

        .controls {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: opacity 0.15s, background 0.15s;
            flex: 1;
            min-width: 0;
        }
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-primary {
            background: linear-gradient(135deg, #7c3aed, #2563eb);
            color: white;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; }
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .btn-secondary:hover:not(:disabled) {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .btn-danger {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }
        .btn-danger:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.3);
        }

        .logs-section {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 8px;
            max-height: 120px;
            overflow-y: auto;
        }
        .logs-header {
            font-size: 10px;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 6px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .log-entry {
            font-size: 10px;
            line-height: 1.4;
            padding: 2px 0;
            color: var(--vscode-descriptionForeground);
            word-break: break-word;
        }
        .log-entry.highlight,
        .log-entry.success {
            color: #22c55e;
            font-weight: 500;
        }
        .log-entry.info {
            color: var(--vscode-textLink-foreground);
        }
        .log-entry.warning {
            color: #f59e0b;
            font-weight: 500;
        }
        .log-entry.error {
            color: #ef4444;
            font-weight: 500;
        }
        .no-logs {
            font-size: 10px;
            color: var(--vscode-disabledForeground);
            font-style: italic;
        }

        .prd-generating {
            display: ${this._isPrdGenerating ? 'flex' : 'none'};
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: rgba(236, 72, 153, 0.1);
            border-radius: 6px;
            font-size: 11px;
            color: #ec4899;
        }
        .spinner {
            width: 12px;
            height: 12px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .open-panel-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px;
            border: 1px dashed var(--vscode-focusBorder);
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            background: transparent;
            color: var(--vscode-textLink-foreground);
            transition: background 0.15s;
        }
        .open-panel-btn:hover {
            background: var(--vscode-list-hoverBackground);
        }

        /* ================================================================
           Focus Indicators for Keyboard Users
           ================================================================ */

        /* Focus outline for all interactive elements */
        .btn:focus-visible,
        .open-panel-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 2px;
        }

        /* Enhanced focus for primary buttons */
        .btn-primary:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-sideBar-background),
                        0 0 0 4px #7c3aed;
        }

        /* Enhanced focus for secondary buttons */
        .btn-secondary:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-sideBar-background),
                        0 0 0 4px var(--vscode-focusBorder, #007acc);
        }

        /* Enhanced focus for danger buttons */
        .btn-danger:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-sideBar-background),
                        0 0 0 4px #ef4444;
        }

        /* Focus for open panel button */
        .open-panel-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 2px;
            background: var(--vscode-list-hoverBackground);
        }

        /* Screen Reader Announcer - visually hidden but accessible */
        .sr-announcer {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* ================================================================
           High Contrast Theme Support
           Styles for VS Code high contrast themes (dark and light)
           ================================================================ */

        /* High Contrast Dark Theme */
        body.vscode-high-contrast {
            --hc-border: var(--vscode-contrastBorder, #6fc3df);
            --hc-active-border: var(--vscode-contrastActiveBorder, #f38518);
            --hc-focus: var(--vscode-focusBorder, #f38518);
        }

        body.vscode-high-contrast .status-badge {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .status-badge.running,
        body.vscode-high-contrast .status-badge.waiting {
            border-color: var(--hc-active-border);
            color: var(--vscode-foreground);
            background: transparent;
        }

        body.vscode-high-contrast .status-badge.paused {
            border-color: var(--vscode-editorWarning-foreground, #cca700);
            color: var(--vscode-editorWarning-foreground, #cca700);
        }

        body.vscode-high-contrast .progress-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .progress-bar {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .progress-fill {
            background: var(--hc-active-border);
        }

        body.vscode-high-contrast .progress-percentage-value {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .progress-percentage-complete {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-terminal-ansiGreen, #89d185);
        }

        body.vscode-high-contrast .countdown-section {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .countdown-value {
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .prd-generating {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .btn {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .btn:hover:not(:disabled) {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .btn:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast .btn-primary {
            background: transparent;
            color: var(--vscode-foreground);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .btn-secondary {
            background: transparent;
        }

        body.vscode-high-contrast .btn-danger {
            background: transparent;
            color: var(--vscode-errorForeground, #f48771);
            border-color: var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .logs-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .open-panel-btn {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .open-panel-btn:hover {
            border-color: var(--hc-active-border);
            background: transparent;
        }

        body.vscode-high-contrast .open-panel-btn:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            background: transparent;
        }

        /* High Contrast Light Theme */
        body.vscode-high-contrast-light {
            --hc-border: var(--vscode-contrastBorder, #0f4a85);
            --hc-active-border: var(--vscode-contrastActiveBorder, #b5200d);
            --hc-focus: var(--vscode-focusBorder, #0f4a85);
        }

        body.vscode-high-contrast-light .status-badge {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .status-badge.running,
        body.vscode-high-contrast-light .status-badge.waiting {
            border-color: var(--hc-active-border);
            color: var(--vscode-foreground);
            background: transparent;
        }

        body.vscode-high-contrast-light .status-badge.paused {
            border-color: var(--vscode-editorWarning-foreground, #7a6400);
            color: var(--vscode-editorWarning-foreground, #7a6400);
        }

        body.vscode-high-contrast-light .progress-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .progress-bar {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .progress-fill {
            background: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .progress-percentage-value {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .progress-percentage-complete {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-terminal-ansiGreen, #116329);
        }

        body.vscode-high-contrast-light .countdown-section {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .countdown-value {
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .prd-generating {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .btn {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .btn:hover:not(:disabled) {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .btn:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast-light .btn-primary {
            background: transparent;
            color: var(--vscode-foreground);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .btn-secondary {
            background: transparent;
        }

        body.vscode-high-contrast-light .btn-danger {
            background: transparent;
            color: var(--vscode-errorForeground, #b5200d);
            border-color: var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .logs-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .open-panel-btn {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .open-panel-btn:hover {
            border-color: var(--hc-active-border);
            background: transparent;
        }

        body.vscode-high-contrast-light .open-panel-btn:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            background: transparent;
        }
    </style>
</head>
<body>
    <div id="srAnnouncer" class="sr-announcer" role="status" aria-live="assertive" aria-atomic="true"></div>
    <div class="container" role="main" aria-label="Ralph sidebar panel">
        <div class="header" role="banner">
            <div class="logo" aria-hidden="true">${getLogo(32)}</div>
            <div class="title-area">
                <h2>Ralph</h2>
                <div class="status-badge ${statusClass}" role="status" aria-live="polite" aria-label="Automation status: ${statusText}">
                    <span class="status-dot" aria-hidden="true"></span>
                    <span>${statusText}</span>
                    ${this._currentIteration > 0 ? `<span aria-label="Iteration ${this._currentIteration}">• #${this._currentIteration}</span>` : ''}
                </div>
            </div>
        </div>

        <div class="progress-section" id="progressSection" role="region" aria-label="Task progress">
            <div class="progress-header">
                <span class="progress-label" id="progressLabel">Task Progress</span>
                <span class="progress-value" id="progressText" aria-label="Tasks completed: ${this._completedTasks} of ${this._totalTasks}">${this._completedTasks}/${this._totalTasks} tasks</span>
            </div>
            <div class="progress-percentage" aria-hidden="true">
                <span class="progress-percentage-value${this._progress === 100 ? ' progress-percentage-complete' : ''}" id="progressPercentage">${this._progress}</span>
                <span class="progress-percentage-symbol">%</span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuenow="${this._progress}" aria-valuemin="0" aria-valuemax="100" aria-labelledby="progressLabel">
                <div class="progress-fill" id="progressFill" style="width: ${this._progress}%"></div>
            </div>
            ${this._currentTask ? `<div class="task-info" id="taskInfo" role="status" aria-live="polite"><strong>Current:</strong> ${this.escapeHtml(this._currentTask)}</div>` : '<div class="task-info" id="taskInfo" role="status" aria-live="polite"></div>'}
        </div>

        <div class="countdown-section" id="countdown" role="timer" aria-live="polite" aria-label="Countdown to next task">
            <span aria-hidden="true">⏱️</span><span> Next task in</span>
            <span class="countdown-value" id="countdownValue">${this._countdown}s</span>
        </div>

        <div class="prd-generating" id="prdGenerating" role="status" aria-live="polite" aria-label="Generating PRD">
            <div class="spinner" aria-hidden="true"></div>
            <span>Generating PRD...</span>
        </div>

        <div class="controls" role="toolbar" aria-label="Automation controls">
            <button class="btn btn-primary" onclick="send('start')" ${!canStart ? 'disabled' : ''} title="${!this._hasPrd ? 'Create a PRD first' : 'Start automation'}" aria-label="${!this._hasPrd ? 'Start automation (requires PRD)' : 'Start automation'}">
                <span aria-hidden="true">▶</span> Start
            </button>
            <button class="btn btn-secondary" onclick="send('pause')" ${!isRunning ? 'disabled' : ''} style="${isPaused ? 'display:none' : ''}" aria-label="Pause automation">
                <span aria-hidden="true">⏸</span> Pause
            </button>
            <button class="btn btn-secondary" onclick="send('resume')" ${!isPaused ? 'disabled' : ''} style="${!isPaused ? 'display:none' : ''}" aria-label="Resume automation">
                <span aria-hidden="true">▶</span> Resume
            </button>
            <button class="btn btn-danger" onclick="send('stop')" ${!isActive ? 'disabled' : ''} aria-label="Stop automation">
                <span aria-hidden="true">⏹</span> Stop
            </button>
        </div>

        <div class="controls" role="toolbar" aria-label="Additional controls">
            <button class="btn btn-secondary" onclick="send('next')" style="flex: 1;" aria-label="Execute single step">
                <span aria-hidden="true">⏭</span> Step
            </button>
        </div>

        <div class="logs-section" role="log" aria-label="Recent activity log" aria-live="polite">
            <div class="logs-header" id="logsHeader">Recent Activity</div>
            ${recentLogs.length > 0 ? logsHtml : '<div class="no-logs" role="status">No activity yet</div>'}
        </div>

        <button class="open-panel-btn" onclick="openPanel()" aria-label="Open full control panel">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Open Full Control Panel
        </button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function send(cmd) { vscode.postMessage({ command: cmd }); }
        function openPanel() { vscode.postMessage({ command: 'openPanel' }); }

        // ====================================================================
        // Screen Reader Announcements
        // ====================================================================

        // Track previous state for announcing changes
        let previousCompletedCount = 0;

        /**
         * Announces a message to screen readers via the live region.
         * @param {string} message - The message to announce
         */
        function announceToScreenReader(message) {
            const announcer = document.getElementById('srAnnouncer');
            if (!announcer) return;

            // Clear previous content first to ensure the new message is announced
            announcer.textContent = '';

            // Use requestAnimationFrame to ensure the DOM update is processed
            requestAnimationFrame(function() {
                announcer.textContent = message;
            });
        }

        // Error Boundary - Catches and reports all script errors to the output channel
        function reportError(message, source, lineno, colno, error) {
            const errorInfo = {
                command: 'webviewError',
                error: {
                    message: message || 'Unknown error',
                    source: source || 'unknown',
                    lineno: lineno || 0,
                    colno: colno || 0,
                    stack: error && error.stack ? error.stack : ''
                }
            };
            try {
                vscode.postMessage(errorInfo);
            } catch (e) {
                console.error('Failed to report error to extension:', e);
            }
        }

        window.onerror = function(message, source, lineno, colno, error) {
            reportError(message, source, lineno, colno, error);
            return false;
        };

        window.onunhandledrejection = function(event) {
            const reason = event.reason;
            const message = reason instanceof Error ? reason.message : String(reason);
            const stack = reason instanceof Error ? reason.stack : '';
            reportError('Unhandled Promise rejection: ' + message, 'promise', 0, 0, { stack: stack });
        };

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    // Full refresh handled by extension
                    break;
                case 'countdown':
                    const countdownEl = document.getElementById('countdown');
                    const countdownValue = document.getElementById('countdownValue');
                    if (countdownEl && countdownValue) {
                        countdownEl.style.display = message.seconds > 0 ? 'flex' : 'none';
                        countdownValue.textContent = message.seconds + 's';
                    }
                    break;
                case 'prdGenerating':
                    const prdEl = document.getElementById('prdGenerating');
                    if (prdEl) prdEl.style.display = 'flex';
                    break;
                case 'prdComplete':
                    const prdCompleteEl = document.getElementById('prdGenerating');
                    if (prdCompleteEl) prdCompleteEl.style.display = 'none';
                    break;
                case 'stats':
                    const progressText = document.getElementById('progressText');
                    const progressPercentage = document.getElementById('progressPercentage');
                    const progressFill = document.getElementById('progressFill');
                    const taskInfo = document.getElementById('taskInfo');

                    // Announce task completions to screen readers
                    if (message.completed > previousCompletedCount && previousCompletedCount > 0) {
                        const tasksJustCompleted = message.completed - previousCompletedCount;
                        const announcement = tasksJustCompleted === 1
                            ? 'Task completed. ' + message.completed + ' of ' + message.total + ' tasks done.'
                            : tasksJustCompleted + ' tasks completed. ' + message.completed + ' of ' + message.total + ' tasks done.';
                        announceToScreenReader(announcement);
                    }
                    // Announce all tasks complete
                    if (message.pending === 0 && message.completed > 0 && previousCompletedCount > 0) {
                        announceToScreenReader('All ' + message.completed + ' tasks completed successfully!');
                    }
                    previousCompletedCount = message.completed;

                    if (progressText) {
                        progressText.textContent = message.completed + '/' + message.total + ' tasks';
                    }
                    if (progressPercentage) {
                        progressPercentage.textContent = message.progress;
                        if (message.progress === 100) {
                            progressPercentage.classList.add('progress-percentage-complete');
                        } else {
                            progressPercentage.classList.remove('progress-percentage-complete');
                        }
                    }
                    if (progressFill) {
                        progressFill.style.width = message.progress + '%';
                    }
                    if (taskInfo && message.nextTask) {
                        taskInfo.innerHTML = '<strong>Current:</strong> ' + escapeHtml(message.nextTask);
                    }
                    break;
            }
        });

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>`;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private isViewAvailable(): boolean {
        return !this._isDisposed && !!(this._view && this._view.webview);
    }

    private handleWebviewError(error: WebviewError): void {
        const location = error.lineno > 0 ? ` at line ${error.lineno}:${error.colno}` : '';
        const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
        logError(`Sidebar webview error${location}${source}: ${error.message}`, error.stack ? { stack: error.stack } : undefined);
    }

    private safePostMessage(message: object): boolean {
        if (!this.isViewAvailable()) {
            return false;
        }

        // Queue message if view is hidden
        if (!this._isVisible) {
            this._messageQueue.push(message);
            return true;
        }

        try {
            this._view!.webview.postMessage(message);
            return true;
        } catch {
            // Ignore errors when posting messages
            return false;
        }
    }

    private refreshHtml(): void {
        if (this.isViewAvailable()) {
            try {
                this._view!.webview.html = this.getHtml();
            } catch {
                // Ignore errors when refreshing webview
            }
        }
    }

    public updateStatus(status: string, iteration: number, currentTask: string, _history: TaskCompletion[]): void {
        if (this._isDisposed) {
            return;
        }
        this._currentStatus = status;
        this._currentIteration = iteration;
        this._currentTask = currentTask;
        this.refreshHtml();
    }

    public updateCountdown(seconds: number): void {
        if (this._isDisposed) {
            return;
        }
        this._countdown = seconds;
        this.safePostMessage({ type: 'countdown', seconds });
    }

    public updateHistory(_history: TaskCompletion[]): void {
        if (this._isDisposed) {
            return;
        }
        // History is displayed in the main panel, sidebar shows recent logs instead
        this.refreshHtml();
    }

    public updateSessionTiming(_startTime: number, _taskHistory: TaskCompletion[], _pendingTasks: number): void {
        if (this._isDisposed) {
            return;
        }
        // Session timing is displayed in the main panel
        this.refreshHtml();
    }

    public async updateStats(): Promise<void> {
        if (this._isDisposed) {
            return;
        }
        const stats = await getTaskStatsAsync();
        const nextTask = await getNextTaskAsync();
        
        // Check again after async operations in case view was disposed
        if (this._isDisposed) {
            return;
        }
        
        this._completedTasks = stats.completed;
        this._totalTasks = stats.total;
        this._progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        
        // Send dynamic update for faster UI response
        this.safePostMessage({
            type: 'stats',
            completed: stats.completed,
            pending: stats.pending,
            total: stats.total,
            progress: this._progress,
            nextTask: nextTask?.description || null
        });
        
        this.refreshHtml();
    }

    public async refresh(): Promise<void> {
        if (this._isDisposed) {
            return;
        }
        const prd = await readPRDAsync();
        
        // Check again after async operation in case view was disposed
        if (this._isDisposed) {
            return;
        }
        
        this._hasPrd = !!prd;
        this._isPrdGenerating = false;
        this.refreshHtml();
    }

    public addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        if (this._isDisposed) {
            return;
        }
        
        // Support both legacy boolean (highlight = success) and new LogLevel types
        let level: LogLevel;
        let highlight: boolean;
        
        if (typeof highlightOrLevel === 'boolean') {
            highlight = highlightOrLevel;
            level = highlightOrLevel ? 'success' : 'info';
        } else {
            level = highlightOrLevel;
            highlight = highlightOrLevel === 'success';
        }
        
        this._logs.push({ message, highlight, level });
        // Keep only the last 50 logs to avoid memory issues
        if (this._logs.length > 50) {
            this._logs = this._logs.slice(-50);
        }
        this.refreshHtml();
    }

    public showPrdGenerating(): void {
        if (this._isDisposed) {
            return;
        }
        this._isPrdGenerating = true;
        this.safePostMessage({ type: 'prdGenerating' });
        this.refreshHtml();
    }

    public hidePrdGenerating(): void {
        if (this._isDisposed) {
            return;
        }
        this._isPrdGenerating = false;
        this.safePostMessage({ type: 'prdComplete' });
        this.refreshHtml();
    }

    public dispose(): void {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this._eventHandlers.clear();
        this._messageQueue.length = 0;
        this._disposables.forEach(d => d.dispose());
        this._disposables = [];
    }
}
