import { RalphStatusBar, LoopStatus } from './statusBar';
import { TaskCompletion, IRalphUI, LogLevel } from './types';
import { log } from './logger';

// ============================================================================
// Debounce and Throttle Utilities
// ============================================================================

/**
 * Default debounce delay for UI updates (milliseconds).
 * This provides a good balance between responsiveness and performance.
 */
export const UI_DEBOUNCE_DELAY = 100;

/**
 * Throttle delay for countdown updates (milliseconds).
 * Countdown should be responsive but not overwhelm the webview.
 */
export const COUNTDOWN_THROTTLE_DELAY = 250;

/**
 * Debounce delay for stats updates (milliseconds).
 * Stats updates can be more expensive, so we use a longer delay.
 */
export const STATS_DEBOUNCE_DELAY = 150;

/**
 * Debounce delay for history/timeline updates (milliseconds).
 */
export const HISTORY_DEBOUNCE_DELAY = 200;

/**
 * Creates a debounced version of a function.
 * The debounced function will only be called after the specified delay
 * has passed since the last invocation.
 * 
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function with flush and cancel methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => void) & { flush: () => void; cancel: () => void; pending: () => boolean } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: unknown = null;

    const debounced = function(this: unknown, ...args: Parameters<T>): void {
        lastArgs = args;
        lastThis = this;

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (lastArgs !== null) {
                fn.apply(lastThis, lastArgs);
                lastArgs = null;
                lastThis = null;
            }
        }, delay);
    };

    /**
     * Immediately invokes the debounced function if there's a pending call.
     */
    debounced.flush = function(): void {
        if (timeoutId !== null && lastArgs !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
            fn.apply(lastThis, lastArgs);
            lastArgs = null;
            lastThis = null;
        }
    };

    /**
     * Cancels any pending invocation.
     */
    debounced.cancel = function(): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastArgs = null;
            lastThis = null;
        }
    };

    /**
     * Returns whether there's a pending invocation.
     */
    debounced.pending = function(): boolean {
        return timeoutId !== null;
    };

    return debounced;
}

/**
 * Creates a throttled version of a function.
 * The throttled function will only be called at most once per delay period.
 * Leading calls are executed immediately, trailing calls are executed after delay.
 * 
 * @param fn - The function to throttle
 * @param delay - The minimum delay between calls in milliseconds
 * @returns A throttled version of the function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
    let lastTime = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: unknown = null;

    const throttled = function(this: unknown, ...args: Parameters<T>): void {
        const now = Date.now();
        const remaining = delay - (now - lastTime);

        lastArgs = args;
        lastThis = this;

        if (remaining <= 0 || remaining > delay) {
            // Execute immediately
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastTime = now;
            fn.apply(this, args);
            lastArgs = null;
            lastThis = null;
        } else if (timeoutId === null) {
            // Schedule trailing call
            timeoutId = setTimeout(() => {
                lastTime = Date.now();
                timeoutId = null;
                if (lastArgs !== null) {
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                    lastThis = null;
                }
            }, remaining);
        }
    };

    /**
     * Cancels any pending invocation.
     */
    throttled.cancel = function(): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastArgs = null;
        lastThis = null;
        lastTime = 0;
    };

    return throttled;
}

/**
 * Creates a debounced async function.
 * Only the last call within the delay period will be executed.
 * 
 * @param fn - The async function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the async function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => Promise<void>) & { flush: () => Promise<void>; cancel: () => void; pending: () => boolean } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: unknown = null;
    let pendingPromise: Promise<void> | null = null;
    let resolvePromise: (() => void) | null = null;

    const debounced = function(this: unknown, ...args: Parameters<T>): Promise<void> {
        lastArgs = args;
        lastThis = this;

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        if (pendingPromise === null) {
            pendingPromise = new Promise<void>((resolve) => {
                resolvePromise = resolve;
            });
        }

        timeoutId = setTimeout(async () => {
            timeoutId = null;
            if (lastArgs !== null) {
                try {
                    await fn.apply(lastThis, lastArgs);
                } finally {
                    lastArgs = null;
                    lastThis = null;
                    if (resolvePromise) {
                        resolvePromise();
                    }
                    pendingPromise = null;
                    resolvePromise = null;
                }
            }
        }, delay);

        return pendingPromise;
    };

    debounced.flush = async function(): Promise<void> {
        if (timeoutId !== null && lastArgs !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
            try {
                await fn.apply(lastThis, lastArgs);
            } finally {
                lastArgs = null;
                lastThis = null;
                if (resolvePromise) {
                    resolvePromise();
                }
                pendingPromise = null;
                resolvePromise = null;
            }
        }
    };

    debounced.cancel = function(): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastArgs = null;
        lastThis = null;
        if (resolvePromise) {
            resolvePromise();
        }
        pendingPromise = null;
        resolvePromise = null;
    };

    debounced.pending = function(): boolean {
        return timeoutId !== null;
    };

    return debounced;
}

// ============================================================================
// UIManager Class
// ============================================================================

export class UIManager {
    private panel: IRalphUI | null = null;
    private sidebarView: IRalphUI | null = null;
    private readonly statusBar: RalphStatusBar;
    private logs: string[] = [];

    // Debounced/throttled update functions
    private readonly debouncedUpdateHistory: ReturnType<typeof debounce>;
    private readonly debouncedUpdateSessionTiming: ReturnType<typeof debounce>;
    private readonly debouncedUpdateStats: ReturnType<typeof debounceAsync>;
    private readonly throttledUpdateCountdown: ReturnType<typeof throttle>;

    constructor(statusBar: RalphStatusBar) {
        this.statusBar = statusBar;
        
        // Initialize debounced update functions
        this.debouncedUpdateHistory = debounce(
            (history: TaskCompletion[]) => {
                this.panel?.updateHistory(history);
                this.sidebarView?.updateHistory(history);
            },
            HISTORY_DEBOUNCE_DELAY
        );

        this.debouncedUpdateSessionTiming = debounce(
            (startTime: number, taskHistory: TaskCompletion[], pendingTasks: number) => {
                this.panel?.updateSessionTiming(startTime, taskHistory, pendingTasks);
                this.sidebarView?.updateSessionTiming(startTime, taskHistory, pendingTasks);
            },
            HISTORY_DEBOUNCE_DELAY
        );

        this.debouncedUpdateStats = debounceAsync(
            async () => {
                await this.panel?.updateStats();
                this.sidebarView?.updateStats();
            },
            STATS_DEBOUNCE_DELAY
        );

        this.throttledUpdateCountdown = throttle(
            (seconds: number) => {
                this.panel?.updateCountdown(seconds);
                this.sidebarView?.updateCountdown(seconds);
            },
            COUNTDOWN_THROTTLE_DELAY
        );
    }

    setPanel(panel: IRalphUI | null): void {
        this.panel = panel;
        // Flush any pending updates when panel changes
        this.flushPendingUpdates();
    }

    setSidebarView(view: IRalphUI): void {
        this.sidebarView = view;
    }

    /**
     * Flushes all pending debounced updates immediately.
     * Useful when the panel changes or the extension is deactivating.
     */
    flushPendingUpdates(): void {
        this.debouncedUpdateHistory.flush();
        this.debouncedUpdateSessionTiming.flush();
        // Note: debouncedUpdateStats.flush() is async, we don't await here
        void this.debouncedUpdateStats.flush();
    }

    /**
     * Cancels all pending debounced updates.
     * Useful when stopping the loop or disposing the manager.
     */
    cancelPendingUpdates(): void {
        this.debouncedUpdateHistory.cancel();
        this.debouncedUpdateSessionTiming.cancel();
        this.debouncedUpdateStats.cancel();
        this.throttledUpdateCountdown.cancel();
    }

    /**
     * Returns whether there are any pending debounced updates.
     */
    hasPendingUpdates(): boolean {
        return (
            this.debouncedUpdateHistory.pending() ||
            this.debouncedUpdateSessionTiming.pending() ||
            this.debouncedUpdateStats.pending()
        );
    }

    updateStatus(status: LoopStatus, iteration: number, currentTask: string): void {
        this.statusBar.setStatus(status);
        this.panel?.updateStatus(status, iteration, currentTask, []);
        this.sidebarView?.updateStatus(status, iteration, currentTask, []);
    }

    setIteration(iteration: number): void {
        this.statusBar.setIteration(iteration);
    }

    setTaskInfo(info: string): void {
        this.statusBar.setTaskInfo(info);
    }

    /**
     * Updates the countdown display. Uses throttling to prevent overwhelming
     * the webview with too many updates per second.
     * 
     * @param seconds - The number of seconds remaining
     * @param immediate - If true, bypasses throttling for critical updates (e.g., 0 seconds)
     */
    updateCountdown(seconds: number, immediate: boolean = false): void {
        if (immediate || seconds === 0) {
            // Critical updates bypass throttling
            this.throttledUpdateCountdown.cancel();
            this.panel?.updateCountdown(seconds);
            this.sidebarView?.updateCountdown(seconds);
        } else {
            this.throttledUpdateCountdown(seconds);
        }
    }

    /**
     * Updates the task history timeline. Uses debouncing to batch rapid updates.
     * 
     * @param history - The task completion history
     * @param immediate - If true, bypasses debouncing for critical updates
     */
    updateHistory(history: TaskCompletion[], immediate: boolean = false): void {
        if (immediate) {
            this.debouncedUpdateHistory.flush();
            this.panel?.updateHistory(history);
            this.sidebarView?.updateHistory(history);
        } else {
            this.debouncedUpdateHistory(history);
        }
    }

    /**
     * Updates session timing information. Uses debouncing to batch rapid updates.
     * 
     * @param startTime - The session start timestamp
     * @param taskHistory - The task completion history
     * @param pendingTasks - Number of pending tasks
     * @param immediate - If true, bypasses debouncing
     */
    updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number, immediate: boolean = false): void {
        if (immediate) {
            this.debouncedUpdateSessionTiming.flush();
            this.panel?.updateSessionTiming(startTime, taskHistory, pendingTasks);
            this.sidebarView?.updateSessionTiming(startTime, taskHistory, pendingTasks);
        } else {
            this.debouncedUpdateSessionTiming(startTime, taskHistory, pendingTasks);
        }
    }

    /**
     * Updates the stats display. Uses debouncing to batch rapid updates.
     * 
     * @param immediate - If true, bypasses debouncing for critical updates
     * @returns A promise that resolves when the update completes
     */
    async updateStats(immediate: boolean = false): Promise<void> {
        if (immediate) {
            await this.debouncedUpdateStats.flush();
            await this.panel?.updateStats();
            this.sidebarView?.updateStats();
        } else {
            await this.debouncedUpdateStats();
        }
    }

    async refresh(): Promise<void> {
        await this.panel?.refresh();
        this.sidebarView?.refresh();
    }

    showPrdGenerating(): void {
        this.panel?.showPrdGenerating();
        this.sidebarView?.showPrdGenerating();
    }

    hidePrdGenerating(): void {
        this.panel?.hidePrdGenerating();
        this.sidebarView?.hidePrdGenerating();
    }

    addLog(message: string, highlightOrLevel: boolean | LogLevel = false): void {
        log(message);
        this.logs.push(message);
        this.panel?.addLog(message, highlightOrLevel);
        this.sidebarView?.addLog(message, highlightOrLevel);
    }

    clearLogs(): void {
        this.logs = [];
    }
}
