/**
 * Mock implementation of RalphPanel for testing.
 */

import {
    TaskCompletion,
    TaskRequirements,
    PanelState,
    DEFAULT_PANEL_STATE,
    DEFAULT_REQUIREMENTS,
    LogLevel,
    IRalphUI
} from '../../types';
import { MockDisposable, MockExtensionContext, MockWebviewPanel } from './vscode';

export type MockPanelEventType =
    | 'start' | 'stop' | 'pause' | 'resume' | 'next' | 'refresh'
    | 'generatePrd' | 'requirementsChanged' | 'settingsChanged'
    | 'skipTask' | 'retryTask' | 'completeAllTasks' | 'resetAllTasks'
    | 'reorderTasks' | 'exportData' | 'exportLog' | 'openPanel';

export type MockPanelEventHandler = (data?: unknown) => void;

export interface MockLogEntry {
    message: string;
    level: LogLevel;
    timestamp: number;
}

/**
 * Mock implementation of RalphPanel for unit testing.
 * Provides the same interface as RalphPanel without VS Code dependencies.
 */
export class MockRalphPanel implements IRalphUI {
    private disposed = false;
    private visible = true;
    private panelState: PanelState;
    private html = '';
    private logs: MockLogEntry[] = [];
    private postedMessages: object[] = [];
    private eventHandlers = new Map<MockPanelEventType, Set<MockPanelEventHandler>>();
    private onDisposeCallback?: () => void;

    // State tracking for assertions
    private lastStatus = '';
    private lastIteration = 0;
    private lastCurrentTask = '';
    private lastHistory: TaskCompletion[] = [];
    private lastCountdown = 0;
    private lastSessionTiming?: { startTime: number; taskHistory: TaskCompletion[]; pendingTasks: number };
    private isPrdGenerating = false;
    private toastMessages: Array<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }> = [];
    private isLoading = false;

    readonly mockPanel: MockWebviewPanel;
    readonly mockContext: MockExtensionContext;

    constructor(
        panel?: MockWebviewPanel,
        context?: MockExtensionContext
    ) {
        this.mockPanel = panel ?? new MockWebviewPanel('ralphPanel', 'Ralph', 1);
        this.mockContext = context ?? new MockExtensionContext();
        this.panelState = this.restoreState();
    }

    private restoreState(): PanelState {
        const stored = this.mockContext.workspaceState.get<PanelState>('ralph.panelState');
        if (stored) {
            return {
                collapsedSections: Array.isArray(stored.collapsedSections) ? stored.collapsedSections : [],
                scrollPosition: typeof stored.scrollPosition === 'number' ? stored.scrollPosition : 0,
                requirements: this.validateRequirements(stored.requirements)
            };
        }
        return { ...DEFAULT_PANEL_STATE };
    }

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

    // IRalphUI implementation
    updateStatus(status: string, iteration: number, currentTask: string, history: TaskCompletion[]): void {
        if (this.disposed) { return; }
        this.lastStatus = status;
        this.lastIteration = iteration;
        this.lastCurrentTask = currentTask;
        this.lastHistory = [...history];
        this.postMessage({ type: 'update', status, iteration, taskInfo: currentTask });
    }

    updateCountdown(seconds: number): void {
        if (this.disposed) { return; }
        this.lastCountdown = seconds;
        this.postMessage({ type: 'countdown', seconds });
    }

    updateHistory(history: TaskCompletion[]): void {
        if (this.disposed) { return; }
        this.lastHistory = [...history];
        this.postMessage({ type: 'history', history });
    }

    updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number): void {
        if (this.disposed) { return; }
        this.lastSessionTiming = { startTime, taskHistory: [...taskHistory], pendingTasks };
        this.postMessage({ type: 'timing', startTime, taskHistory, pendingTasks });
    }

    async updateStats(): Promise<void> {
        if (this.disposed) { return; }
        // In mock, we just post a stats update message
        this.postMessage({ type: 'stats', completed: 0, pending: 0, total: 0, progress: 0, nextTask: null });
    }

    async refresh(): Promise<void> {
        if (this.disposed) { return; }
        // Simulate HTML regeneration
        this.html = '<html>Refreshed</html>';
    }

    addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        if (this.disposed) { return; }
        const level: LogLevel = typeof highlightOrLevel === 'string' 
            ? highlightOrLevel 
            : highlightOrLevel ? 'success' : 'info';
        this.logs.push({ message, level, timestamp: Date.now() });
        this.postMessage({ type: 'log', message, highlight: level === 'success', level });
    }

    showPrdGenerating(): void {
        if (this.disposed) { return; }
        this.isPrdGenerating = true;
        this.postMessage({ type: 'prdGenerating' });
    }

    hidePrdGenerating(): void {
        if (this.disposed) { return; }
        this.isPrdGenerating = false;
        this.postMessage({ type: 'prdComplete' });
    }

    // Toast methods
    showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
        if (this.disposed) { return; }
        this.toastMessages.push({ message, type });
        this.postMessage({ type: 'toast', message, toastType: type });
    }

    showSuccessToast(message: string): void {
        this.showToast(message, 'success');
    }

    showErrorToast(message: string): void {
        this.showToast(message, 'error');
    }

    showWarningToast(message: string): void {
        this.showToast(message, 'warning');
    }

    showInfoToast(message: string): void {
        this.showToast(message, 'info');
    }

    // Loading state methods
    showLoading(): void {
        if (this.disposed) { return; }
        this.isLoading = true;
        this.postMessage({ type: 'loading', isLoading: true });
    }

    hideLoading(): void {
        if (this.disposed) { return; }
        this.isLoading = false;
        this.postMessage({ type: 'loading', isLoading: false });
    }

    // Event handling
    on(event: MockPanelEventType, handler: MockPanelEventHandler): MockDisposable {
        if (this.disposed) {
            return new MockDisposable();
        }
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);
        return new MockDisposable(() => {
            this.eventHandlers.get(event)?.delete(handler);
        });
    }

    emit(event: MockPanelEventType, data?: unknown): void {
        if (this.disposed) { return; }
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    onDispose(callback: () => void): void {
        this.onDisposeCallback = callback;
    }

    // Panel control
    reveal(): void {
        if (this.disposed) { return; }
        this.visible = true;
        this.mockPanel.reveal();
    }

    dispose(): void {
        if (this.disposed) { return; }
        this.disposed = true;
        this.eventHandlers.clear();
        this.onDisposeCallback?.();
        this.mockPanel.dispose();
    }

    // State management
    updatePanelState(state: Partial<PanelState>): void {
        if (this.disposed) { return; }
        if (state.collapsedSections !== undefined) {
            this.panelState.collapsedSections = state.collapsedSections;
        }
        if (state.scrollPosition !== undefined) {
            this.panelState.scrollPosition = state.scrollPosition;
        }
        if (state.requirements !== undefined) {
            this.panelState.requirements = state.requirements;
        }
        this.saveState();
    }

    getSavedRequirements(): TaskRequirements {
        return { ...this.panelState.requirements };
    }

    private async saveState(): Promise<void> {
        await this.mockContext.workspaceState.update('ralph.panelState', this.panelState);
    }

    private postMessage(message: object): boolean {
        if (this.disposed) { return false; }
        this.postedMessages.push(message);
        return true;
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Check if the panel is disposed */
    get isDisposed(): boolean {
        return this.disposed;
    }

    /** Check if the panel is visible */
    get isVisible(): boolean {
        return this.visible;
    }

    /** Get all posted messages */
    getPostedMessages(): object[] {
        return [...this.postedMessages];
    }

    /** Get the last posted message */
    getLastPostedMessage<T extends object>(): T | undefined {
        return this.postedMessages[this.postedMessages.length - 1] as T;
    }

    /** Get messages of a specific type */
    getMessagesByType<T extends object>(type: string): T[] {
        return this.postedMessages.filter(m => (m as { type?: string }).type === type) as T[];
    }

    /** Clear posted messages */
    clearMessages(): void {
        this.postedMessages = [];
    }

    /** Get all log entries */
    getLogs(): MockLogEntry[] {
        return [...this.logs];
    }

    /** Get the last log entry */
    getLastLog(): MockLogEntry | undefined {
        return this.logs[this.logs.length - 1];
    }

    /** Clear log entries */
    clearLogs(): void {
        this.logs = [];
    }

    /** Get the last status update */
    getLastStatus(): { status: string; iteration: number; currentTask: string } {
        return {
            status: this.lastStatus,
            iteration: this.lastIteration,
            currentTask: this.lastCurrentTask
        };
    }

    /** Get the last countdown value */
    getLastCountdown(): number {
        return this.lastCountdown;
    }

    /** Get the last history */
    getLastHistory(): TaskCompletion[] {
        return [...this.lastHistory];
    }

    /** Get the last session timing */
    getLastSessionTiming() {
        return this.lastSessionTiming ? { ...this.lastSessionTiming } : undefined;
    }

    /** Check if PRD is generating */
    getIsPrdGenerating(): boolean {
        return this.isPrdGenerating;
    }

    /** Get all toast messages */
    getToastMessages(): Array<{ message: string; type: string }> {
        return [...this.toastMessages];
    }

    /** Check if loading indicator is shown */
    getIsLoading(): boolean {
        return this.isLoading;
    }

    /** Get current panel state */
    getPanelState(): PanelState {
        return { ...this.panelState };
    }

    /** Set visibility (for testing) */
    setVisible(visible: boolean): void {
        this.visible = visible;
    }

    /** Simulate receiving a message from webview */
    simulateWebviewMessage(message: object): void {
        const cmd = (message as { command?: string }).command;
        if (cmd) {
            this.emit(cmd as MockPanelEventType, message);
        }
    }

    /** Get the current HTML */
    getHtml(): string {
        return this.html;
    }

    /** Set HTML (for testing) */
    setHtml(html: string): void {
        this.html = html;
    }

    /** Get registered event handler count for an event */
    getEventHandlerCount(event: MockPanelEventType): number {
        return this.eventHandlers.get(event)?.size ?? 0;
    }

    /** Check if an event has handlers */
    hasEventHandlers(event: MockPanelEventType): boolean {
        return (this.eventHandlers.get(event)?.size ?? 0) > 0;
    }

    /** Reset all state (for test cleanup) */
    reset(): void {
        this.disposed = false;
        this.visible = true;
        this.logs = [];
        this.postedMessages = [];
        this.toastMessages = [];
        this.lastStatus = '';
        this.lastIteration = 0;
        this.lastCurrentTask = '';
        this.lastHistory = [];
        this.lastCountdown = 0;
        this.lastSessionTiming = undefined;
        this.isPrdGenerating = false;
        this.isLoading = false;
        this.panelState = { ...DEFAULT_PANEL_STATE };
        this.eventHandlers.clear();
    }
}

/**
 * Factory function to create a MockRalphPanel with default configuration.
 */
export function createMockRalphPanel(options?: {
    panelState?: Partial<PanelState>;
    visible?: boolean;
}): MockRalphPanel {
    const context = new MockExtensionContext();
    if (options?.panelState) {
        context.workspaceState.update('ralph.panelState', {
            ...DEFAULT_PANEL_STATE,
            ...options.panelState
        });
    }
    const panel = new MockRalphPanel(undefined, context);
    if (options?.visible !== undefined) {
        panel.setVisible(options.visible);
    }
    return panel;
}
