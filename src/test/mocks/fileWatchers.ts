/**
 * Mock implementation of file watchers for testing.
 */

import { MockUri } from './vscode';

export type MockPrdChangeCallback = (newContent: string) => void;
export type MockActivityCallback = () => void;
export type MockPrdCreatedCallback = () => void;

/**
 * Mock implementation of PrdWatcher for unit testing.
 */
export class MockPrdWatcher {
    private enabled = false;
    private isStarted = false;
    private lastContent = '';
    private callback: MockPrdChangeCallback | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    start(initialContent: string, callback: MockPrdChangeCallback): void {
        this.recordCall('start', [initialContent, callback]);
        this.isStarted = true;
        this.lastContent = initialContent;
        this.callback = callback;
    }

    enable(): void {
        this.recordCall('enable', []);
        this.enabled = true;
    }

    disable(): void {
        this.recordCall('disable', []);
        this.enabled = false;
    }

    dispose(): void {
        this.recordCall('dispose', []);
        this.isStarted = false;
        this.enabled = false;
        this.callback = null;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Simulate a file change */
    simulateChange(newContent: string): void {
        if (!this.isStarted || !this.enabled || !this.callback) { return; }
        if (newContent !== this.lastContent) {
            this.lastContent = newContent;
            this.callback(newContent);
        }
    }

    /** Check if watcher is started */
    getIsStarted(): boolean {
        return this.isStarted;
    }

    /** Check if watcher is enabled */
    getIsEnabled(): boolean {
        return this.enabled;
    }

    /** Get last content */
    getLastContent(): string {
        return this.lastContent;
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
        this.enabled = false;
        this.isStarted = false;
        this.lastContent = '';
        this.callback = null;
        this.methodCalls = [];
    }
}

/**
 * Mock implementation of ActivityWatcher for unit testing.
 */
export class MockActivityWatcher {
    private isStarted = false;
    private callback: MockActivityCallback | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    start(callback: MockActivityCallback): void {
        this.recordCall('start', [callback]);
        this.isStarted = true;
        this.callback = callback;
    }

    dispose(): void {
        this.recordCall('dispose', []);
        this.isStarted = false;
        this.callback = null;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Simulate activity detection */
    simulateActivity(): void {
        if (!this.isStarted || !this.callback) { return; }
        this.callback();
    }

    /** Check if watcher is started */
    getIsStarted(): boolean {
        return this.isStarted;
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
        this.isStarted = false;
        this.callback = null;
        this.methodCalls = [];
    }
}

/**
 * Mock implementation of PrdCreatedWatcher for unit testing.
 */
export class MockPrdCreatedWatcher {
    private isStarted = false;
    private callback: MockPrdCreatedCallback | null = null;
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    start(callback: MockPrdCreatedCallback): void {
        this.recordCall('start', [callback]);
        this.isStarted = true;
        this.callback = callback;
    }

    dispose(): void {
        this.recordCall('dispose', []);
        this.isStarted = false;
        this.callback = null;
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Simulate PRD creation */
    simulatePrdCreated(): void {
        if (!this.isStarted || !this.callback) { return; }
        this.callback();
    }

    /** Check if watcher is started */
    getIsStarted(): boolean {
        return this.isStarted;
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
        this.isStarted = false;
        this.callback = null;
        this.methodCalls = [];
    }
}

/**
 * Mock implementation of FileWatcherManager for unit testing.
 */
export class MockFileWatcherManager {
    readonly prdWatcher = new MockPrdWatcher();
    readonly activityWatcher = new MockActivityWatcher();
    readonly prdCreatedWatcher = new MockPrdCreatedWatcher();
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    startPrdWatcher(initialContent: string, callback: MockPrdChangeCallback): void {
        this.recordCall('startPrdWatcher', [initialContent, callback]);
        this.prdWatcher.start(initialContent, callback);
    }

    enablePrdWatcher(): void {
        this.recordCall('enablePrdWatcher', []);
        this.prdWatcher.enable();
    }

    disablePrdWatcher(): void {
        this.recordCall('disablePrdWatcher', []);
        this.prdWatcher.disable();
    }

    startActivityWatcher(callback: MockActivityCallback): void {
        this.recordCall('startActivityWatcher', [callback]);
        this.activityWatcher.start(callback);
    }

    startPrdCreatedWatcher(callback: MockPrdCreatedCallback): void {
        this.recordCall('startPrdCreatedWatcher', [callback]);
        this.prdCreatedWatcher.start(callback);
    }

    dispose(): void {
        this.recordCall('dispose', []);
        this.prdWatcher.dispose();
        this.activityWatcher.dispose();
        this.prdCreatedWatcher.dispose();
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

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
        this.prdWatcher.reset();
        this.activityWatcher.reset();
        this.prdCreatedWatcher.reset();
        this.methodCalls = [];
    }
}

/**
 * Factory functions.
 */
export function createMockPrdWatcher(): MockPrdWatcher {
    return new MockPrdWatcher();
}

export function createMockActivityWatcher(): MockActivityWatcher {
    return new MockActivityWatcher();
}

export function createMockPrdCreatedWatcher(): MockPrdCreatedWatcher {
    return new MockPrdCreatedWatcher();
}

export function createMockFileWatcherManager(): MockFileWatcherManager {
    return new MockFileWatcherManager();
}
