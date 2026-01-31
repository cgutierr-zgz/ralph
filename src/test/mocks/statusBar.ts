/**
 * Mock implementation of RalphStatusBar for testing.
 */

export type MockLoopStatus = 'idle' | 'running' | 'paused' | 'waiting';

/**
 * Mock implementation of RalphStatusBar for unit testing.
 */
export class MockRalphStatusBar {
    private status: MockLoopStatus = 'idle';
    private taskInfo = '';
    private iteration = 0;
    private isVisible = true;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    // Simulated status bar item properties
    text = '';
    tooltip = '';
    command: string | undefined;
    backgroundColor: object | undefined;

    constructor() {
        this.update();
    }

    setStatus(status: MockLoopStatus): void {
        this.recordCall('setStatus', [status]);
        this.status = status;
        this.update();
    }

    getStatus(): MockLoopStatus {
        return this.status;
    }

    setTaskInfo(info: string): void {
        this.recordCall('setTaskInfo', [info]);
        this.taskInfo = info;
        this.update();
    }

    getTaskInfo(): string {
        return this.taskInfo;
    }

    setIteration(n: number): void {
        this.recordCall('setIteration', [n]);
        this.iteration = n;
        this.update();
    }

    getIteration(): number {
        return this.iteration;
    }

    private update(): void {
        let icon: string;
        let text: string;
        let tooltip: string;

        switch (this.status) {
            case 'running':
                icon = '$(sync~spin)';
                text = `Ralph: Running #${this.iteration}`;
                tooltip = `Working on: ${this.taskInfo || 'Starting...'}\nClick to open control panel`;
                break;
            case 'paused':
                icon = '$(debug-pause)';
                text = 'Ralph: Paused';
                tooltip = 'Loop paused. Click to open control panel';
                break;
            case 'waiting':
                icon = '$(watch)';
                text = 'Ralph: Waiting';
                tooltip = `Waiting for you to accept changes\nTask: ${this.taskInfo}\nClick to open control panel`;
                break;
            default:
                icon = '$(rocket)';
                text = 'Ralph';
                tooltip = 'Click to open Ralph control panel';
        }

        this.text = `${icon} ${text}`;
        this.tooltip = tooltip;
        this.command = 'ralph.showPanel';

        this.backgroundColor = this.status === 'running'
            ? { id: 'statusBarItem.warningBackground' }
            : undefined;
    }

    show(): void {
        this.recordCall('show', []);
        this.isVisible = true;
    }

    hide(): void {
        this.recordCall('hide', []);
        this.isVisible = false;
    }

    dispose(): void {
        this.recordCall('dispose', []);
        this.isVisible = false;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Check if status bar is visible */
    getIsVisible(): boolean {
        return this.isVisible;
    }

    /** Get the displayed text */
    getText(): string {
        return this.text;
    }

    /** Get the tooltip */
    getTooltip(): string {
        return this.tooltip;
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

    /** Clear method call history */
    clearMethodCalls(): void {
        this.methodCalls = [];
    }

    /** Reset all state */
    reset(): void {
        this.status = 'idle';
        this.taskInfo = '';
        this.iteration = 0;
        this.isVisible = true;
        this.methodCalls = [];
        this.update();
    }
}

/**
 * Factory function to create a MockRalphStatusBar.
 */
export function createMockRalphStatusBar(): MockRalphStatusBar {
    return new MockRalphStatusBar();
}
