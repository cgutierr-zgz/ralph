/**
 * Mock implementation of timer utilities for testing.
 */

export type MockCountdownTickCallback = (remaining: number) => void;
export type MockInactivityCallback = () => Promise<void>;

/**
 * Mock implementation of CountdownTimer for unit testing.
 */
export class MockCountdownTimer {
    private isActive = false;
    private remaining = 0;
    private onTick: MockCountdownTickCallback | null = null;
    private resolvePromise: (() => void) | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    start(seconds: number, onTick: MockCountdownTickCallback): Promise<void> {
        this.recordCall('start', [seconds, onTick]);
        this.isActive = true;
        this.remaining = seconds;
        this.onTick = onTick;
        
        // Immediately call with initial value
        onTick(seconds);

        return new Promise<void>((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    stop(): void {
        this.recordCall('stop', []);
        this.isActive = false;
        this.remaining = 0;
        this.onTick?.(0);
        this.resolvePromise?.();
        this.resolvePromise = null;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getRemaining(): number {
        return this.remaining;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Simulate a tick (decrement remaining and call callback) */
    tick(): void {
        if (!this.isActive || this.remaining <= 0) { return; }
        this.remaining--;
        this.onTick?.(this.remaining);
        
        if (this.remaining <= 0) {
            this.isActive = false;
            this.resolvePromise?.();
            this.resolvePromise = null;
        }
    }

    /** Simulate multiple ticks */
    tickMultiple(count: number): void {
        for (let i = 0; i < count; i++) {
            this.tick();
        }
    }

    /** Complete the countdown immediately */
    complete(): void {
        this.remaining = 0;
        this.isActive = false;
        this.onTick?.(0);
        this.resolvePromise?.();
        this.resolvePromise = null;
    }

    /** Get method calls */
    getMethodCalls(): Array<{ method: string; args: unknown[] }> {
        return [...this.methodCalls];
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
        this.isActive = false;
        this.remaining = 0;
        this.onTick = null;
        this.resolvePromise = null;
        this.methodCalls = [];
    }
}

/**
 * Mock implementation of InactivityMonitor for unit testing.
 */
export class MockInactivityMonitor {
    private isActive = false;
    private isPaused = false;
    private lastActivityTime = 0;
    private callback: MockInactivityCallback | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    start(callback: MockInactivityCallback): void {
        this.recordCall('start', [callback]);
        this.isActive = true;
        this.isPaused = false;
        this.lastActivityTime = Date.now();
        this.callback = callback;
    }

    stop(): void {
        this.recordCall('stop', []);
        this.isActive = false;
        this.isPaused = false;
    }

    pause(): void {
        this.recordCall('pause', []);
        this.isPaused = true;
    }

    resume(): void {
        this.recordCall('resume', []);
        this.isPaused = false;
        this.lastActivityTime = Date.now();
    }

    recordActivity(): void {
        this.recordCall('recordActivity', []);
        this.lastActivityTime = Date.now();
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getIsPaused(): boolean {
        return this.isPaused;
    }

    getLastActivityTime(): number {
        return this.lastActivityTime;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Trigger the inactivity callback */
    async triggerInactivity(): Promise<void> {
        if (!this.isActive || this.isPaused || !this.callback) { return; }
        this.isActive = false;
        await this.callback();
    }

    /** Get method calls */
    getMethodCalls(): Array<{ method: string; args: unknown[] }> {
        return [...this.methodCalls];
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
        this.isActive = false;
        this.isPaused = false;
        this.lastActivityTime = 0;
        this.callback = null;
        this.methodCalls = [];
    }
}

/**
 * Mock formatDuration function.
 */
export function mockFormatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
    if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
}

/**
 * Factory functions to create timer mocks.
 */
export function createMockCountdownTimer(): MockCountdownTimer {
    return new MockCountdownTimer();
}

export function createMockInactivityMonitor(): MockInactivityMonitor {
    return new MockInactivityMonitor();
}
