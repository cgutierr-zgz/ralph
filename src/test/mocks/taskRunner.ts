/**
 * Mock implementation of TaskRunner for testing.
 */

import {
    TaskCompletion,
    TaskRequirements,
    RalphSettings,
    DEFAULT_REQUIREMENTS,
    DEFAULT_SETTINGS
} from '../../types';

export type MockLogCallback = (message: string, highlight?: boolean) => void;
export type MockCopilotResult = 'agent' | 'chat' | 'clipboard';

/**
 * Mock implementation of TaskRunner for unit testing.
 */
export class MockTaskRunner {
    private requirements: TaskRequirements = { ...DEFAULT_REQUIREMENTS };
    private settings: RalphSettings = { ...DEFAULT_SETTINGS };
    private taskHistory: TaskCompletion[] = [];
    private taskStartTime = 0;
    private currentTaskDescription = '';
    private iterationCount = 0;
    private logCallback: MockLogCallback | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    // Simulated results
    private nextCopilotResult: MockCopilotResult = 'agent';
    private shouldSucceed = true;

    setLogCallback(callback: MockLogCallback): void {
        this.recordCall('setLogCallback', [callback]);
        this.logCallback = callback;
    }

    private log(message: string, highlight = false): void {
        this.logCallback?.(message, highlight);
    }

    setRequirements(requirements: TaskRequirements): void {
        this.recordCall('setRequirements', [requirements]);
        this.requirements = { ...requirements };
        this.log('Updated task requirements');
    }

    getRequirements(): TaskRequirements {
        return { ...this.requirements };
    }

    setSettings(settings: RalphSettings): void {
        this.recordCall('setSettings', [settings]);
        this.settings = { ...settings };
        this.log('Updated settings');
    }

    getSettings(): RalphSettings {
        return { ...this.settings };
    }

    getHistory(): TaskCompletion[] {
        return [...this.taskHistory];
    }

    getTaskHistory(): TaskCompletion[] {
        return [...this.taskHistory];
    }

    clearHistory(): void {
        this.recordCall('clearHistory', []);
        this.taskHistory = [];
    }

    getCurrentTask(): string {
        return this.currentTaskDescription;
    }

    setCurrentTask(description: string): void {
        this.recordCall('setCurrentTask', [description]);
        this.currentTaskDescription = description;
        this.taskStartTime = Date.now();
    }

    getIterationCount(): number {
        return this.iterationCount;
    }

    incrementIteration(): number {
        this.recordCall('incrementIteration', []);
        return ++this.iterationCount;
    }

    resetIterations(): void {
        this.recordCall('resetIterations', []);
        this.iterationCount = 0;
    }

    recordTaskCompletion(): TaskCompletion {
        this.recordCall('recordTaskCompletion', []);
        const duration = Date.now() - this.taskStartTime;
        const completion: TaskCompletion = {
            taskDescription: this.currentTaskDescription,
            completedAt: Date.now(),
            duration,
            iteration: this.iterationCount
        };
        this.taskHistory.push(completion);
        this.log(`✅ Task completed in ${Math.round(duration / 1000)}s!`, true);
        return completion;
    }

    checkIterationLimit(): boolean {
        this.recordCall('checkIterationLimit', []);
        return this.iterationCount >= this.settings.maxIterations;
    }

    async executeTask(taskDescription: string, workspaceRoot: string): Promise<MockCopilotResult> {
        this.recordCall('executeTask', [taskDescription, workspaceRoot]);
        
        if (!this.shouldSucceed) {
            throw new Error('Task execution failed (mock)');
        }

        this.setCurrentTask(taskDescription);
        this.incrementIteration();
        this.log(`📝 Executing: ${taskDescription}`);
        
        return this.nextCopilotResult;
    }

    async generatePrd(description: string, workspaceRoot: string): Promise<boolean> {
        this.recordCall('generatePrd', [description, workspaceRoot]);
        
        if (!this.shouldSucceed) {
            return false;
        }

        this.log(`📄 Generating PRD for: ${description}`);
        return true;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Set the result for the next executeTask call */
    setNextCopilotResult(result: MockCopilotResult): void {
        this.nextCopilotResult = result;
    }

    /** Set whether operations should succeed */
    setShouldSucceed(shouldSucceed: boolean): void {
        this.shouldSucceed = shouldSucceed;
    }

    /** Add a task completion to history */
    addTaskCompletion(completion: TaskCompletion): void {
        this.taskHistory.push(completion);
    }

    /** Get task start time */
    getTaskStartTime(): number {
        return this.taskStartTime;
    }

    /** Set task start time (for testing duration calculation) */
    setTaskStartTime(time: number): void {
        this.taskStartTime = time;
    }

    /** Set iteration count directly */
    setIterationCount(count: number): void {
        this.iterationCount = count;
    }

    /** Get method calls */
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

    /** Reset all state */
    reset(): void {
        this.requirements = { ...DEFAULT_REQUIREMENTS };
        this.settings = { ...DEFAULT_SETTINGS };
        this.taskHistory = [];
        this.taskStartTime = 0;
        this.currentTaskDescription = '';
        this.iterationCount = 0;
        this.logCallback = null;
        this.methodCalls = [];
        this.nextCopilotResult = 'agent';
        this.shouldSucceed = true;
    }
}

/**
 * Factory function to create a MockTaskRunner.
 */
export function createMockTaskRunner(options?: {
    requirements?: TaskRequirements;
    settings?: RalphSettings;
}): MockTaskRunner {
    const runner = new MockTaskRunner();
    if (options?.requirements) {
        runner.setRequirements(options.requirements);
    }
    if (options?.settings) {
        runner.setSettings(options.settings);
    }
    runner.clearMethodCalls(); // Clear setup calls
    return runner;
}
