/**
 * Mock implementation of LoopOrchestrator for testing.
 */

import {
    TaskCompletion,
    TaskRequirements,
    RalphSettings,
    DEFAULT_REQUIREMENTS,
    DEFAULT_SETTINGS,
    IRalphUI,
    LoopExecutionState
} from '../../types';

export type MockOrchestratorEventType = 
    | 'stateChange' | 'taskComplete' | 'loopStart' | 'loopStop' 
    | 'loopPause' | 'loopResume' | 'error';

export type MockOrchestratorEventHandler = (data?: unknown) => void;

export interface MockOrchestratorOptions {
    initialRequirements?: TaskRequirements;
    initialSettings?: RalphSettings;
    hasPrd?: boolean;
    pendingTasks?: number;
}

/**
 * Mock implementation of LoopOrchestrator for unit testing.
 */
export class MockLoopOrchestrator {
    private state: LoopExecutionState = LoopExecutionState.IDLE;
    private isPaused = false;
    private sessionStartTime = 0;
    private requirements: TaskRequirements;
    private settings: RalphSettings;
    private panel: IRalphUI | null = null;
    private sidebarView: IRalphUI | null = null;
    private taskHistory: TaskCompletion[] = [];
    private iterationCount = 0;
    private currentTask = '';
    private hasPrd: boolean;
    private pendingTasks: number;

    private eventHandlers = new Map<MockOrchestratorEventType, Set<MockOrchestratorEventHandler>>();
    private logs: Array<{ message: string; highlight?: boolean }> = [];

    // Tracking for assertions
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    constructor(options?: MockOrchestratorOptions) {
        this.requirements = options?.initialRequirements ?? { ...DEFAULT_REQUIREMENTS };
        this.settings = options?.initialSettings ?? { ...DEFAULT_SETTINGS };
        this.hasPrd = options?.hasPrd ?? true;
        this.pendingTasks = options?.pendingTasks ?? 5;
    }

    // Panel and Sidebar management
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

    // Requirements management
    setRequirements(requirements: TaskRequirements): void {
        this.recordCall('setRequirements', [requirements]);
        this.requirements = { ...requirements };
    }

    getRequirements(): TaskRequirements {
        return { ...this.requirements };
    }

    // Settings management
    setSettings(settings: RalphSettings): void {
        this.recordCall('setSettings', [settings]);
        this.settings = { ...settings };
    }

    getSettings(): RalphSettings {
        return { ...this.settings };
    }

    // History management
    getHistory(): TaskCompletion[] {
        return [...this.taskHistory];
    }

    clearHistory(): void {
        this.recordCall('clearHistory', []);
        this.taskHistory = [];
    }

    addTaskCompletion(completion: TaskCompletion): void {
        this.taskHistory.push(completion);
    }

    // Loop control
    async startLoop(): Promise<void> {
        this.recordCall('startLoop', []);
        
        if (this.state === LoopExecutionState.RUNNING) {
            this.addLog('Loop is already running');
            return;
        }

        if (!this.hasPrd) {
            this.addLog('No PRD file found');
            return;
        }

        if (this.pendingTasks === 0) {
            this.addLog('No pending tasks found. Add tasks to PRD.md first.');
            return;
        }

        this.state = LoopExecutionState.RUNNING;
        this.isPaused = false;
        this.iterationCount = 0;
        this.sessionStartTime = Date.now();

        this.addLog('🚀 Starting Ralph loop...');
        this.emitEvent('loopStart');
        this.emitEvent('stateChange', { state: this.state, isPaused: this.isPaused });
        
        this.updateUI('running');
    }

    stopLoop(): void {
        this.recordCall('stopLoop', []);
        
        if (this.state !== LoopExecutionState.RUNNING) {
            return;
        }

        this.state = LoopExecutionState.IDLE;
        this.isPaused = false;
        
        this.addLog('⏹️ Loop stopped');
        this.emitEvent('loopStop');
        this.emitEvent('stateChange', { state: this.state, isPaused: this.isPaused });
        
        this.updateUI('idle');
    }

    pauseLoop(): void {
        this.recordCall('pauseLoop', []);
        
        if (this.state !== LoopExecutionState.RUNNING || this.isPaused) {
            return;
        }

        this.isPaused = true;
        this.addLog('⏸️ Loop paused');
        this.emitEvent('loopPause');
        this.emitEvent('stateChange', { state: this.state, isPaused: this.isPaused });
        
        this.updateUI('paused');
    }

    resumeLoop(): void {
        this.recordCall('resumeLoop', []);
        
        if (!this.isPaused) {
            return;
        }

        this.isPaused = false;
        this.addLog('▶️ Loop resumed');
        this.emitEvent('loopResume');
        this.emitEvent('stateChange', { state: this.state, isPaused: this.isPaused });
        
        this.updateUI('running');
    }

    async runSingleStep(): Promise<void> {
        this.recordCall('runSingleStep', []);
        this.iterationCount++;
        this.addLog(`📝 Running step ${this.iterationCount}`);
    }

    // Task operations
    async skipCurrentTask(): Promise<void> {
        this.recordCall('skipCurrentTask', []);
        this.addLog('⏭️ Skipped current task');
        this.pendingTasks = Math.max(0, this.pendingTasks - 1);
    }

    async retryFailedTask(): Promise<void> {
        this.recordCall('retryFailedTask', []);
        this.addLog('🔄 Retrying failed task');
    }

    async completeAllTasks(): Promise<void> {
        this.recordCall('completeAllTasks', []);
        this.addLog('✅ Completed all tasks');
        this.pendingTasks = 0;
    }

    async resetAllTasks(): Promise<void> {
        this.recordCall('resetAllTasks', []);
        this.addLog('🔄 Reset all tasks');
        this.pendingTasks = 5;
    }

    async reorderTasks(taskOrder: string[]): Promise<void> {
        this.recordCall('reorderTasks', [taskOrder]);
        this.addLog(`📋 Reordered tasks: ${taskOrder.join(', ')}`);
    }

    async switchProject(projectPath: string): Promise<void> {
        this.recordCall('switchProject', [projectPath]);
        const wasRunning = this.state === LoopExecutionState.RUNNING;
        const wasPaused = this.isPaused;
        
        // Clear history for the new project context
        this.taskHistory = [];
        
        this.addLog(`📂 Switched to project: ${projectPath.split('/').pop() || projectPath}`);
        
        // If loop was running, continue on new project
        if (wasRunning) {
            if (!wasPaused) {
                // Remain running on new project
                this.updateUI('running');
            } else {
                // Remain paused on new project
                this.updateUI('paused');
            }
        } else {
            this.updateUI('idle');
        }
    }

    // State queries
    getState(): LoopExecutionState {
        return this.state;
    }

    getIsPaused(): boolean {
        return this.isPaused;
    }

    isRunning(): boolean {
        return this.state === LoopExecutionState.RUNNING && !this.isPaused;
    }

    getIterationCount(): number {
        return this.iterationCount;
    }

    getCurrentTask(): string {
        return this.currentTask;
    }

    getSessionStartTime(): number {
        return this.sessionStartTime;
    }

    // Event handling
    on(event: MockOrchestratorEventType, handler: MockOrchestratorEventHandler): { dispose: () => void } {
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

    private emitEvent(event: MockOrchestratorEventType, data?: unknown): void {
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    // Logging
    private addLog(message: string, highlight?: boolean): void {
        this.logs.push({ message, highlight });
        this.panel?.addLog(message, highlight ?? false);
        this.sidebarView?.addLog(message, highlight ?? false);
    }

    // UI updates
    private updateUI(status: string): void {
        this.panel?.updateStatus(status, this.iterationCount, this.currentTask, this.taskHistory);
        this.sidebarView?.updateStatus(status, this.iterationCount, this.currentTask, this.taskHistory);
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Get all method calls for verification */
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
    getLogs(): Array<{ message: string; highlight?: boolean }> {
        return [...this.logs];
    }

    /** Clear logs */
    clearLogs(): void {
        this.logs = [];
    }

    /** Set state directly (for testing) */
    setState(state: LoopExecutionState): void {
        this.state = state;
    }

    /** Set paused state directly (for testing) */
    setIsPaused(isPaused: boolean): void {
        this.isPaused = isPaused;
    }

    /** Set current task (for testing) */
    setCurrentTask(task: string): void {
        this.currentTask = task;
    }

    /** Set iteration count (for testing) */
    setIterationCount(count: number): void {
        this.iterationCount = count;
    }

    /** Set pending tasks count (for testing) */
    setPendingTasks(count: number): void {
        this.pendingTasks = count;
    }

    /** Set PRD existence (for testing) */
    setHasPrd(hasPrd: boolean): void {
        this.hasPrd = hasPrd;
    }

    /** Reset all state */
    reset(): void {
        this.state = LoopExecutionState.IDLE;
        this.isPaused = false;
        this.sessionStartTime = 0;
        this.requirements = { ...DEFAULT_REQUIREMENTS };
        this.settings = { ...DEFAULT_SETTINGS };
        this.taskHistory = [];
        this.iterationCount = 0;
        this.currentTask = '';
        this.logs = [];
        this.methodCalls = [];
        this.eventHandlers.clear();
    }
}

/**
 * Factory function to create a MockLoopOrchestrator with default configuration.
 */
export function createMockOrchestrator(options?: MockOrchestratorOptions): MockLoopOrchestrator {
    return new MockLoopOrchestrator(options);
}
