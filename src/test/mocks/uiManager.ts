/**
 * Mock implementation of UIManager for testing.
 */

import {
    TaskCompletion,
    IRalphUI,
    LogLevel
} from '../../types';

export type MockLoopStatus = 'idle' | 'running' | 'paused' | 'waiting';

/**
 * Mock implementation of UIManager for unit testing.
 */
export class MockUIManager {
    private panel: IRalphUI | null = null;
    private sidebarView: IRalphUI | null = null;
    private logs: Array<{ message: string; level: LogLevel }> = [];

    // State tracking
    private lastStatus: MockLoopStatus = 'idle';
    private lastIteration = 0;
    private lastTaskInfo = '';
    private lastHistory: TaskCompletion[] = [];
    private lastCountdown = 0;

    // Method call tracking
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    setPanel(panel: IRalphUI | null): void {
        this.recordCall('setPanel', [panel]);
        this.panel = panel;
    }

    getPanel(): IRalphUI | null {
        return this.panel;
    }

    setSidebarView(view: IRalphUI): void {
        this.recordCall('setSidebarView', [view]);
        this.sidebarView = view;
    }

    getSidebarView(): IRalphUI | null {
        return this.sidebarView;
    }

    updateStatus(status: MockLoopStatus, iteration: number, currentTask: string): void {
        this.recordCall('updateStatus', [status, iteration, currentTask]);
        this.lastStatus = status;
        this.lastIteration = iteration;
        this.lastTaskInfo = currentTask;
        this.panel?.updateStatus(status, iteration, currentTask, []);
        this.sidebarView?.updateStatus(status, iteration, currentTask, []);
    }

    setIteration(iteration: number): void {
        this.recordCall('setIteration', [iteration]);
        this.lastIteration = iteration;
    }

    setTaskInfo(info: string): void {
        this.recordCall('setTaskInfo', [info]);
        this.lastTaskInfo = info;
    }

    updateCountdown(seconds: number): void {
        this.recordCall('updateCountdown', [seconds]);
        this.lastCountdown = seconds;
        this.panel?.updateCountdown(seconds);
        this.sidebarView?.updateCountdown(seconds);
    }

    updateHistory(history: TaskCompletion[]): void {
        this.recordCall('updateHistory', [history]);
        this.lastHistory = [...history];
        this.panel?.updateHistory(history);
        this.sidebarView?.updateHistory(history);
    }

    updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number): void {
        this.recordCall('updateSessionTiming', [startTime, taskHistory, pendingTasks]);
        this.panel?.updateSessionTiming(startTime, taskHistory, pendingTasks);
        this.sidebarView?.updateSessionTiming(startTime, taskHistory, pendingTasks);
    }

    async updateStats(): Promise<void> {
        this.recordCall('updateStats', []);
        await this.panel?.updateStats();
        this.sidebarView?.updateStats();
    }

    async refresh(): Promise<void> {
        this.recordCall('refresh', []);
        await this.panel?.refresh();
        this.sidebarView?.refresh();
    }

    showPrdGenerating(): void {
        this.recordCall('showPrdGenerating', []);
        this.panel?.showPrdGenerating();
        this.sidebarView?.showPrdGenerating();
    }

    hidePrdGenerating(): void {
        this.recordCall('hidePrdGenerating', []);
        this.panel?.hidePrdGenerating();
        this.sidebarView?.hidePrdGenerating();
    }

    addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        this.recordCall('addLog', [message, highlightOrLevel]);
        const level: LogLevel = typeof highlightOrLevel === 'string' 
            ? highlightOrLevel 
            : highlightOrLevel ? 'success' : 'info';
        this.logs.push({ message, level });
        this.panel?.addLog(message, highlightOrLevel);
        this.sidebarView?.addLog(message, highlightOrLevel);
    }

    clearLogs(): void {
        this.recordCall('clearLogs', []);
        this.logs = [];
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Get all method calls */
    getMethodCalls(): Array<{ method: string; args: unknown[] }> {
        return [...this.methodCalls];
    }

    /** Get calls to a specific method */
    getCallsTo(method: string): unknown[][] {
        return this.methodCalls
            .filter(call => call.method === method)
            .map(call => call.args);
    }

    /** Check if a method was called */
    wasCalled(method: string): boolean {
        return this.methodCalls.some(call => call.method === method);
    }

    /** Get call count for a method */
    getCallCount(method: string): number {
        return this.methodCalls.filter(call => call.method === method).length;
    }

    /** Clear method call history */
    clearMethodCalls(): void {
        this.methodCalls = [];
    }

    /** Get all logs */
    getLogs(): Array<{ message: string; level: LogLevel }> {
        return [...this.logs];
    }

    /** Get the last status */
    getLastStatus(): MockLoopStatus {
        return this.lastStatus;
    }

    /** Get the last iteration */
    getLastIteration(): number {
        return this.lastIteration;
    }

    /** Get the last task info */
    getLastTaskInfo(): string {
        return this.lastTaskInfo;
    }

    /** Get the last countdown */
    getLastCountdown(): number {
        return this.lastCountdown;
    }

    /** Get the last history */
    getLastHistory(): TaskCompletion[] {
        return [...this.lastHistory];
    }

    /** Reset all state */
    reset(): void {
        this.panel = null;
        this.sidebarView = null;
        this.logs = [];
        this.lastStatus = 'idle';
        this.lastIteration = 0;
        this.lastTaskInfo = '';
        this.lastHistory = [];
        this.lastCountdown = 0;
        this.methodCalls = [];
    }
}

/**
 * Factory function to create a MockUIManager.
 */
export function createMockUIManager(): MockUIManager {
    return new MockUIManager();
}
