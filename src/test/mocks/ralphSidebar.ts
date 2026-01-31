/**
 * Mock implementation of RalphSidebarProvider for testing.
 */

import {
    TaskCompletion,
    TaskRequirements,
    LogLevel,
    IRalphUI
} from '../../types';
import { MockDisposable, MockUri, MockWebviewView } from './vscode';

export type MockSidebarEventType =
    | 'start' | 'stop' | 'pause' | 'resume' | 'next' | 'refresh'
    | 'generatePrd' | 'requirementsChanged' | 'settingsChanged'
    | 'skipTask' | 'retryTask' | 'completeAllTasks' | 'resetAllTasks'
    | 'reorderTasks' | 'exportData' | 'exportLog' | 'openPanel';

export type MockSidebarEventHandler = (data?: unknown) => void;

export interface MockSidebarLogEntry {
    message: string;
    level: LogLevel;
    timestamp: number;
}

/**
 * Mock implementation of RalphSidebarProvider for unit testing.
 * Provides the same interface as RalphSidebarProvider without VS Code dependencies.
 */
export class MockRalphSidebarProvider implements IRalphUI {
    private disposed = false;
    private visible = true;
    private view: MockWebviewView | null = null;
    private html = '';
    private logs: MockSidebarLogEntry[] = [];
    private postedMessages: object[] = [];
    private messageQueue: object[] = [];
    private eventHandlers = new Map<MockSidebarEventType, Set<MockSidebarEventHandler>>();

    // State tracking
    private hasPrd = false;
    private lastStatus = '';
    private lastIteration = 0;
    private lastCurrentTask = '';
    private lastCountdown = 0;
    private lastProgress = 0;
    private isPrdGenerating = false;

    readonly extensionUri: MockUri;

    constructor(extensionUri?: MockUri) {
        this.extensionUri = extensionUri ?? MockUri.file('/test/extension');
    }

    // Simulate webview resolution
    resolveWebviewView(webviewView: MockWebviewView): void {
        if (this.disposed) { return; }
        this.view = webviewView;
        this.visible = webviewView.visible;
        this.initializeSidebar();
    }

    private async initializeSidebar(): Promise<void> {
        // Check if PRD exists (simulated)
        this.hasPrd = true; // Default to true for testing
        await this.updateHtml();
    }

    private async updateHtml(): Promise<void> {
        this.html = `<html><body>
            <div class="sidebar-status">${this.lastStatus}</div>
            <div class="sidebar-progress">${this.lastProgress}%</div>
            <button class="btn-start" ${this.hasPrd ? '' : 'disabled'}>Start</button>
            <button class="btn-stop">Stop</button>
        </body></html>`;
    }

    // IRalphUI implementation
    updateStatus(status: string, iteration: number, currentTask: string, history: TaskCompletion[]): void {
        if (this.disposed) { return; }
        this.lastStatus = status;
        this.lastIteration = iteration;
        this.lastCurrentTask = currentTask;
        this.safePostMessage({ type: 'update', status, iteration, taskInfo: currentTask });
    }

    updateCountdown(seconds: number): void {
        if (this.disposed) { return; }
        this.lastCountdown = seconds;
        this.safePostMessage({ type: 'countdown', seconds });
    }

    updateHistory(history: TaskCompletion[]): void {
        if (this.disposed) { return; }
        this.safePostMessage({ type: 'history', history });
    }

    updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number): void {
        if (this.disposed) { return; }
        this.safePostMessage({ type: 'timing', startTime, taskHistory, pendingTasks });
    }

    async updateStats(): Promise<void> {
        if (this.disposed) { return; }
        // Simulated stats update
        this.safePostMessage({ type: 'stats', completed: 0, pending: 0, total: 0, progress: this.lastProgress, nextTask: null });
    }

    async refresh(): Promise<void> {
        if (this.disposed) { return; }
        await this.updateHtml();
    }

    addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        if (this.disposed) { return; }
        const level: LogLevel = typeof highlightOrLevel === 'string' 
            ? highlightOrLevel 
            : highlightOrLevel ? 'success' : 'info';
        this.logs.push({ message, level, timestamp: Date.now() });
        this.safePostMessage({ type: 'log', message, highlight: level === 'success', level });
    }

    showPrdGenerating(): void {
        if (this.disposed) { return; }
        this.isPrdGenerating = true;
        this.safePostMessage({ type: 'prdGenerating' });
    }

    hidePrdGenerating(): void {
        if (this.disposed) { return; }
        this.isPrdGenerating = false;
        this.safePostMessage({ type: 'prdComplete' });
    }

    // Event handling
    on(event: MockSidebarEventType, handler: MockSidebarEventHandler): MockDisposable {
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

    emit(event: MockSidebarEventType, data?: unknown): void {
        if (this.disposed) { return; }
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    dispose(): void {
        if (this.disposed) { return; }
        this.disposed = true;
        this.eventHandlers.clear();
        this.view?.dispose();
        this.view = null;
    }

    // Message handling
    private safePostMessage(message: object): boolean {
        if (this.disposed || !this.view) {
            return false;
        }
        if (!this.visible) {
            this.messageQueue.push(message);
            return false;
        }
        this.postedMessages.push(message);
        return true;
    }

    private flushMessageQueue(): void {
        if (!this.visible || this.disposed || !this.view) { return; }
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()!;
            this.postedMessages.push(message);
        }
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Check if the sidebar is disposed */
    get isDisposed(): boolean {
        return this.disposed;
    }

    /** Check if the sidebar is visible */
    get isVisible(): boolean {
        return this.visible;
    }

    /** Set visibility (for testing message queueing) */
    setVisible(visible: boolean): void {
        const wasHidden = !this.visible;
        this.visible = visible;
        if (visible && wasHidden) {
            this.flushMessageQueue();
        }
    }

    /** Check if PRD exists */
    getHasPrd(): boolean {
        return this.hasPrd;
    }

    /** Set PRD existence state */
    setHasPrd(hasPrd: boolean): void {
        this.hasPrd = hasPrd;
        this.updateHtml();
    }

    /** Get all posted messages */
    getPostedMessages(): object[] {
        return [...this.postedMessages];
    }

    /** Get queued messages */
    getQueuedMessages(): object[] {
        return [...this.messageQueue];
    }

    /** Get the last posted message */
    getLastPostedMessage<T extends object>(): T | undefined {
        return this.postedMessages[this.postedMessages.length - 1] as T;
    }

    /** Clear posted messages */
    clearMessages(): void {
        this.postedMessages = [];
        this.messageQueue = [];
    }

    /** Get all log entries */
    getLogs(): MockSidebarLogEntry[] {
        return [...this.logs];
    }

    /** Clear log entries */
    clearLogs(): void {
        this.logs = [];
    }

    /** Get the last status */
    getLastStatus(): string {
        return this.lastStatus;
    }

    /** Get the last iteration */
    getLastIteration(): number {
        return this.lastIteration;
    }

    /** Get the last current task */
    getLastCurrentTask(): string {
        return this.lastCurrentTask;
    }

    /** Get the last countdown */
    getLastCountdown(): number {
        return this.lastCountdown;
    }

    /** Set progress (for testing) */
    setProgress(progress: number): void {
        this.lastProgress = progress;
    }

    /** Get progress */
    getProgress(): number {
        return this.lastProgress;
    }

    /** Check if PRD is generating */
    getIsPrdGenerating(): boolean {
        return this.isPrdGenerating;
    }

    /** Get the current HTML */
    getHtml(): string {
        return this.html;
    }

    /** Simulate receiving a message from webview */
    simulateWebviewMessage(message: object): void {
        const cmd = (message as { command?: string }).command;
        if (cmd) {
            this.emit(cmd as MockSidebarEventType, message);
        }
    }

    /** Get the mock webview view */
    getView(): MockWebviewView | null {
        return this.view;
    }

    /** Get event handler count */
    getEventHandlerCount(event: MockSidebarEventType): number {
        return this.eventHandlers.get(event)?.size ?? 0;
    }

    /** Reset all state */
    reset(): void {
        this.disposed = false;
        this.visible = true;
        this.logs = [];
        this.postedMessages = [];
        this.messageQueue = [];
        this.lastStatus = '';
        this.lastIteration = 0;
        this.lastCurrentTask = '';
        this.lastCountdown = 0;
        this.lastProgress = 0;
        this.isPrdGenerating = false;
        this.hasPrd = false;
        this.eventHandlers.clear();
    }
}

/**
 * Factory function to create a MockRalphSidebarProvider with default configuration.
 */
export function createMockRalphSidebarProvider(options?: {
    hasPrd?: boolean;
    visible?: boolean;
}): MockRalphSidebarProvider {
    const provider = new MockRalphSidebarProvider();
    const view = new MockWebviewView('ralph.sidebarView', 'Ralph');
    provider.resolveWebviewView(view);
    
    if (options?.hasPrd !== undefined) {
        provider.setHasPrd(options.hasPrd);
    }
    if (options?.visible !== undefined) {
        provider.setVisible(options.visible);
    }
    return provider;
}
