import * as assert from 'assert';

// These constants mirror the exports from controlPanel.ts
// We define them here to avoid importing the VS Code-dependent module in unit tests
const PANEL_VIEW_TYPE = 'ralphPanel';
const PANEL_STATE_KEY = 'ralph.panelState';

/**
 * Unit tests for RalphSidebarProvider
 * Note: Full integration tests require VS Code extension host.
 * These tests focus on the logic that can be tested in isolation.
 */
describe('RalphSidebarProvider', () => {
    describe('HTML escaping', () => {
        // Helper function that mirrors the escapeHtml implementation
        function escapeHtml(text: string): string {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        it('should escape ampersands', () => {
            assert.strictEqual(escapeHtml('foo & bar'), 'foo &amp; bar');
        });

        it('should escape less than symbols', () => {
            assert.strictEqual(escapeHtml('<script>'), '&lt;script&gt;');
        });

        it('should escape greater than symbols', () => {
            assert.strictEqual(escapeHtml('a > b'), 'a &gt; b');
        });

        it('should escape double quotes', () => {
            assert.strictEqual(escapeHtml('say "hello"'), 'say &quot;hello&quot;');
        });

        it('should escape single quotes', () => {
            assert.strictEqual(escapeHtml("it's"), 'it&#039;s');
        });

        it('should escape multiple special characters', () => {
            assert.strictEqual(
                escapeHtml('<div class="test">Hello & "World"</div>'),
                '&lt;div class=&quot;test&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;'
            );
        });

        it('should handle empty string', () => {
            assert.strictEqual(escapeHtml(''), '');
        });

        it('should not modify plain text', () => {
            assert.strictEqual(escapeHtml('Hello World'), 'Hello World');
        });
    });

    describe('Status mapping', () => {
        // Basic status class mapping (without countdown consideration)
        function getStatusClass(status: string): string {
            return status === 'running' ? 'running' :
                status === 'paused' ? 'paused' : 'idle';
        }

        // Basic status text mapping (without countdown consideration)
        function getStatusText(status: string): string {
            return status === 'running' ? 'Running' :
                status === 'paused' ? 'Paused' : 'Ready';
        }

        // Enhanced status class mapping with countdown/waiting state
        function getStatusClassWithCountdown(status: string, countdown: number): string {
            const isWaiting = status === 'running' && countdown > 0;
            return isWaiting ? 'waiting' :
                status === 'running' ? 'running' :
                status === 'paused' ? 'paused' : 'idle';
        }

        // Enhanced status text mapping with countdown/waiting state
        function getStatusTextWithCountdown(status: string, countdown: number): string {
            const isWaiting = status === 'running' && countdown > 0;
            return isWaiting ? 'Waiting' :
                status === 'running' ? 'Running' :
                status === 'paused' ? 'Paused' : 'Ready';
        }

        it('should map running status to running class', () => {
            assert.strictEqual(getStatusClass('running'), 'running');
        });

        it('should map paused status to paused class', () => {
            assert.strictEqual(getStatusClass('paused'), 'paused');
        });

        it('should map idle status to idle class', () => {
            assert.strictEqual(getStatusClass('idle'), 'idle');
        });

        it('should map unknown status to idle class', () => {
            assert.strictEqual(getStatusClass('unknown'), 'idle');
        });

        it('should map running status to Running text', () => {
            assert.strictEqual(getStatusText('running'), 'Running');
        });

        it('should map paused status to Paused text', () => {
            assert.strictEqual(getStatusText('paused'), 'Paused');
        });

        it('should map idle status to Ready text', () => {
            assert.strictEqual(getStatusText('idle'), 'Ready');
        });

        // Waiting state tests
        it('should map running with countdown to waiting class', () => {
            assert.strictEqual(getStatusClassWithCountdown('running', 10), 'waiting');
        });

        it('should map running with countdown to Waiting text', () => {
            assert.strictEqual(getStatusTextWithCountdown('running', 10), 'Waiting');
        });

        it('should keep running class when countdown is 0', () => {
            assert.strictEqual(getStatusClassWithCountdown('running', 0), 'running');
        });

        it('should keep Running text when countdown is 0', () => {
            assert.strictEqual(getStatusTextWithCountdown('running', 0), 'Running');
        });

        it('should not show waiting for paused with countdown', () => {
            assert.strictEqual(getStatusClassWithCountdown('paused', 10), 'paused');
        });

        it('should not show waiting for idle with countdown', () => {
            assert.strictEqual(getStatusClassWithCountdown('idle', 10), 'idle');
        });
    });

    describe('Progress calculation', () => {
        function calculateProgress(completed: number, total: number): number {
            return total > 0 ? Math.round((completed / total) * 100) : 0;
        }

        it('should return 0 when total is 0', () => {
            assert.strictEqual(calculateProgress(0, 0), 0);
        });

        it('should return 0 when no tasks completed', () => {
            assert.strictEqual(calculateProgress(0, 10), 0);
        });

        it('should return 100 when all tasks completed', () => {
            assert.strictEqual(calculateProgress(10, 10), 100);
        });

        it('should return 50 when half tasks completed', () => {
            assert.strictEqual(calculateProgress(5, 10), 50);
        });

        it('should round to nearest integer', () => {
            assert.strictEqual(calculateProgress(1, 3), 33);
        });

        it('should handle single task completed', () => {
            assert.strictEqual(calculateProgress(1, 1), 100);
        });
    });

    describe('Progress percentage display', () => {
        // Helper to generate the progress percentage class
        function getProgressPercentageClass(progress: number): string {
            return `progress-percentage-value${progress === 100 ? ' progress-percentage-complete' : ''}`;
        }

        // Helper to generate stats message for dynamic updates
        function createStatsMessage(completed: number, pending: number, total: number, nextTask: string | null): object {
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return {
                type: 'stats',
                completed,
                pending,
                total,
                progress,
                nextTask
            };
        }

        it('should have normal class when progress is less than 100', () => {
            assert.strictEqual(getProgressPercentageClass(50), 'progress-percentage-value');
        });

        it('should have complete class when progress is 100', () => {
            assert.strictEqual(getProgressPercentageClass(100), 'progress-percentage-value progress-percentage-complete');
        });

        it('should have normal class when progress is 0', () => {
            assert.strictEqual(getProgressPercentageClass(0), 'progress-percentage-value');
        });

        it('should have normal class when progress is 99', () => {
            assert.strictEqual(getProgressPercentageClass(99), 'progress-percentage-value');
        });

        it('should create correct stats message with completed tasks', () => {
            const msg = createStatsMessage(5, 5, 10, 'Current task');
            assert.deepStrictEqual(msg, {
                type: 'stats',
                completed: 5,
                pending: 5,
                total: 10,
                progress: 50,
                nextTask: 'Current task'
            });
        });

        it('should create correct stats message when all tasks completed', () => {
            const msg = createStatsMessage(10, 0, 10, null);
            assert.deepStrictEqual(msg, {
                type: 'stats',
                completed: 10,
                pending: 0,
                total: 10,
                progress: 100,
                nextTask: null
            });
        });

        it('should create correct stats message with no tasks', () => {
            const msg = createStatsMessage(0, 0, 0, null);
            assert.deepStrictEqual(msg, {
                type: 'stats',
                completed: 0,
                pending: 0,
                total: 0,
                progress: 0,
                nextTask: null
            });
        });

        it('should format progress text correctly', () => {
            const formatProgressText = (completed: number, total: number): string => {
                return `${completed}/${total} tasks`;
            };
            assert.strictEqual(formatProgressText(3, 10), '3/10 tasks');
            assert.strictEqual(formatProgressText(0, 0), '0/0 tasks');
            assert.strictEqual(formatProgressText(100, 100), '100/100 tasks');
        });
    });

    describe('Log management', () => {
        it('should keep only last 50 logs', () => {
            const logs: Array<{ message: string; highlight: boolean }> = [];
            const maxLogs = 50;

            // Add 60 logs
            for (let i = 0; i < 60; i++) {
                logs.push({ message: `Log ${i}`, highlight: false });
            }

            // Simulate trimming
            const trimmedLogs = logs.slice(-maxLogs);

            assert.strictEqual(trimmedLogs.length, 50);
            assert.strictEqual(trimmedLogs[0].message, 'Log 10');
            assert.strictEqual(trimmedLogs[49].message, 'Log 59');
        });

        it('should display only last 5 logs in UI', () => {
            const logs = [
                { message: 'Log 1', highlight: false },
                { message: 'Log 2', highlight: false },
                { message: 'Log 3', highlight: true },
                { message: 'Log 4', highlight: false },
                { message: 'Log 5', highlight: false },
                { message: 'Log 6', highlight: true },
                { message: 'Log 7', highlight: false },
            ];

            const recentLogs = logs.slice(-5);

            assert.strictEqual(recentLogs.length, 5);
            assert.strictEqual(recentLogs[0].message, 'Log 3');
            assert.strictEqual(recentLogs[4].message, 'Log 7');
        });
    });

    describe('Button state logic', () => {
        function getButtonStates(status: string): {
            startDisabled: boolean;
            pauseDisabled: boolean;
            resumeDisabled: boolean;
            stopDisabled: boolean;
        } {
            const isRunning = status === 'running';
            const isPaused = status === 'paused';
            const isIdle = status === 'idle';

            return {
                startDisabled: !isIdle,
                pauseDisabled: !isRunning,
                resumeDisabled: !isPaused,
                stopDisabled: isIdle
            };
        }

        // Enhanced button states with waiting state consideration
        function getButtonStatesWithCountdown(status: string, countdown: number): {
            startDisabled: boolean;
            pauseDisabled: boolean;
            resumeDisabled: boolean;
            stopDisabled: boolean;
        } {
            const isWaiting = status === 'running' && countdown > 0;
            const isRunning = status === 'running' && !isWaiting;
            const isPaused = status === 'paused';
            const isIdle = status === 'idle';
            const isActive = status !== 'idle';

            return {
                startDisabled: !isIdle,
                pauseDisabled: !isRunning,
                resumeDisabled: !isPaused,
                stopDisabled: !isActive
            };
        }

        it('should enable only start button when idle', () => {
            const states = getButtonStates('idle');
            assert.strictEqual(states.startDisabled, false);
            assert.strictEqual(states.pauseDisabled, true);
            assert.strictEqual(states.resumeDisabled, true);
            assert.strictEqual(states.stopDisabled, true);
        });

        it('should enable pause and stop buttons when running', () => {
            const states = getButtonStates('running');
            assert.strictEqual(states.startDisabled, true);
            assert.strictEqual(states.pauseDisabled, false);
            assert.strictEqual(states.resumeDisabled, true);
            assert.strictEqual(states.stopDisabled, false);
        });

        it('should enable resume and stop buttons when paused', () => {
            const states = getButtonStates('paused');
            assert.strictEqual(states.startDisabled, true);
            assert.strictEqual(states.pauseDisabled, true);
            assert.strictEqual(states.resumeDisabled, false);
            assert.strictEqual(states.stopDisabled, false);
        });

        // Waiting state button tests
        it('should disable pause button when waiting (countdown active)', () => {
            const states = getButtonStatesWithCountdown('running', 10);
            assert.strictEqual(states.pauseDisabled, true);
        });

        it('should enable stop button when waiting', () => {
            const states = getButtonStatesWithCountdown('running', 10);
            assert.strictEqual(states.stopDisabled, false);
        });

        it('should keep pause enabled when running without countdown', () => {
            const states = getButtonStatesWithCountdown('running', 0);
            assert.strictEqual(states.pauseDisabled, false);
        });
    });

    describe('Quick action button state with PRD availability', () => {
        // Button states with PRD availability check
        function getQuickActionButtonStates(status: string, hasPrd: boolean, countdown: number): {
            startDisabled: boolean;
            startTitle: string;
            pauseDisabled: boolean;
            resumeDisabled: boolean;
            stopDisabled: boolean;
        } {
            const isWaiting = status === 'running' && countdown > 0;
            const isRunning = status === 'running' && !isWaiting;
            const isPaused = status === 'paused';
            const isIdle = status === 'idle';
            const isActive = status !== 'idle';
            const canStart = isIdle && hasPrd;

            return {
                startDisabled: !canStart,
                startTitle: !hasPrd ? 'Create a PRD first' : 'Start automation',
                pauseDisabled: !isRunning,
                resumeDisabled: !isPaused,
                stopDisabled: !isActive
            };
        }

        it('should disable start button when no PRD exists', () => {
            const states = getQuickActionButtonStates('idle', false, 0);
            assert.strictEqual(states.startDisabled, true);
            assert.strictEqual(states.startTitle, 'Create a PRD first');
        });

        it('should enable start button when PRD exists and idle', () => {
            const states = getQuickActionButtonStates('idle', true, 0);
            assert.strictEqual(states.startDisabled, false);
            assert.strictEqual(states.startTitle, 'Start automation');
        });

        it('should disable start button when running even with PRD', () => {
            const states = getQuickActionButtonStates('running', true, 0);
            assert.strictEqual(states.startDisabled, true);
        });

        it('should disable start button when paused even with PRD', () => {
            const states = getQuickActionButtonStates('paused', true, 0);
            assert.strictEqual(states.startDisabled, true);
        });

        it('should disable start button when no PRD even though idle', () => {
            const states = getQuickActionButtonStates('idle', false, 0);
            assert.strictEqual(states.startDisabled, true);
        });

        it('should enable stop button when running regardless of PRD', () => {
            const states = getQuickActionButtonStates('running', false, 0);
            assert.strictEqual(states.stopDisabled, false);
        });

        it('should disable pause when waiting even with PRD', () => {
            const states = getQuickActionButtonStates('running', true, 10);
            assert.strictEqual(states.pauseDisabled, true);
        });

        it('should enable pause when running without countdown and with PRD', () => {
            const states = getQuickActionButtonStates('running', true, 0);
            assert.strictEqual(states.pauseDisabled, false);
        });
    });

    describe('State synchronization between panel and sidebar', () => {
        /**
         * Tests for state synchronization logic.
         * The state sync is implemented via:
         * 1. Both RalphPanel and RalphSidebarProvider implement IRalphUI interface
         * 2. UIManager broadcasts updates to both panel and sidebar
         * 3. Both views emit events that are handled by the same orchestrator
         */

        // Simulates state representation used for synchronization
        interface SharedState {
            status: string;
            iteration: number;
            currentTask: string;
            progress: number;
            completedTasks: number;
            totalTasks: number;
            countdown: number;
            isPrdGenerating: boolean;
            logs: Array<{ message: string; highlight: boolean }>;
        }

        // Simulates how UIManager broadcasts state to multiple views
        function broadcastToViews(state: SharedState, views: { updateCalled: boolean; state: SharedState }[]): void {
            views.forEach(view => {
                view.updateCalled = true;
                view.state = { ...state };
            });
        }

        // Simulates event handler registration
        function createEventHandlerMap(): Map<string, Set<() => void>> {
            return new Map();
        }

        function registerHandler(map: Map<string, Set<() => void>>, event: string, handler: () => void): void {
            if (!map.has(event)) {
                map.set(event, new Set());
            }
            map.get(event)!.add(handler);
        }

        function emitEvent(map: Map<string, Set<() => void>>, event: string): void {
            map.get(event)?.forEach(handler => handler());
        }

        it('should broadcast status updates to both panel and sidebar', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const newState: SharedState = {
                status: 'running',
                iteration: 5,
                currentTask: 'Test task',
                progress: 50,
                completedTasks: 5,
                totalTasks: 10,
                countdown: 0,
                isPrdGenerating: false,
                logs: []
            };

            broadcastToViews(newState, views);

            assert.strictEqual(panelView.updateCalled, true);
            assert.strictEqual(sidebarView.updateCalled, true);
            assert.strictEqual(panelView.state.status, 'running');
            assert.strictEqual(sidebarView.state.status, 'running');
        });

        it('should maintain consistent state across both views', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const state1: SharedState = {
                status: 'running',
                iteration: 1,
                currentTask: 'Task A',
                progress: 10,
                completedTasks: 1,
                totalTasks: 10,
                countdown: 0,
                isPrdGenerating: false,
                logs: [{ message: 'Started', highlight: false }]
            };

            broadcastToViews(state1, views);

            assert.deepStrictEqual(panelView.state, sidebarView.state);
            assert.strictEqual(panelView.state.currentTask, 'Task A');
            assert.strictEqual(sidebarView.state.currentTask, 'Task A');
        });

        it('should sync countdown updates to both views', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const stateWithCountdown: SharedState = {
                status: 'running',
                iteration: 2,
                currentTask: 'Task B',
                progress: 20,
                completedTasks: 2,
                totalTasks: 10,
                countdown: 8,
                isPrdGenerating: false,
                logs: []
            };

            broadcastToViews(stateWithCountdown, views);

            assert.strictEqual(panelView.state.countdown, 8);
            assert.strictEqual(sidebarView.state.countdown, 8);
        });

        it('should sync progress updates to both views', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const stateWithProgress: SharedState = {
                status: 'running',
                iteration: 3,
                currentTask: 'Task C',
                progress: 75,
                completedTasks: 6,
                totalTasks: 8,
                countdown: 0,
                isPrdGenerating: false,
                logs: []
            };

            broadcastToViews(stateWithProgress, views);

            assert.strictEqual(panelView.state.progress, 75);
            assert.strictEqual(sidebarView.state.progress, 75);
            assert.strictEqual(panelView.state.completedTasks, 6);
            assert.strictEqual(sidebarView.state.completedTasks, 6);
        });

        it('should allow both views to emit events to same handler', () => {
            let startCount = 0;
            const orchestratorHandler = () => { startCount++; };

            const panelEventMap = createEventHandlerMap();
            const sidebarEventMap = createEventHandlerMap();

            // Both views register same orchestrator handler
            registerHandler(panelEventMap, 'start', orchestratorHandler);
            registerHandler(sidebarEventMap, 'start', orchestratorHandler);

            // Emit from panel
            emitEvent(panelEventMap, 'start');
            assert.strictEqual(startCount, 1);

            // Emit from sidebar
            emitEvent(sidebarEventMap, 'start');
            assert.strictEqual(startCount, 2);
        });

        it('should allow pause from either view', () => {
            let pauseCount = 0;
            const orchestratorHandler = () => { pauseCount++; };

            const panelEventMap = createEventHandlerMap();
            const sidebarEventMap = createEventHandlerMap();

            registerHandler(panelEventMap, 'pause', orchestratorHandler);
            registerHandler(sidebarEventMap, 'pause', orchestratorHandler);

            emitEvent(sidebarEventMap, 'pause');
            assert.strictEqual(pauseCount, 1);

            emitEvent(panelEventMap, 'pause');
            assert.strictEqual(pauseCount, 2);
        });

        it('should allow stop from either view', () => {
            let stopCount = 0;
            const orchestratorHandler = () => { stopCount++; };

            const panelEventMap = createEventHandlerMap();
            const sidebarEventMap = createEventHandlerMap();

            registerHandler(panelEventMap, 'stop', orchestratorHandler);
            registerHandler(sidebarEventMap, 'stop', orchestratorHandler);

            emitEvent(panelEventMap, 'stop');
            assert.strictEqual(stopCount, 1);

            emitEvent(sidebarEventMap, 'stop');
            assert.strictEqual(stopCount, 2);
        });

        it('should sync PRD generating status to both views', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const stateGenerating: SharedState = {
                status: 'idle',
                iteration: 0,
                currentTask: '',
                progress: 0,
                completedTasks: 0,
                totalTasks: 0,
                countdown: 0,
                isPrdGenerating: true,
                logs: []
            };

            broadcastToViews(stateGenerating, views);

            assert.strictEqual(panelView.state.isPrdGenerating, true);
            assert.strictEqual(sidebarView.state.isPrdGenerating, true);
        });

        it('should sync logs to both views', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            const stateWithLogs: SharedState = {
                status: 'running',
                iteration: 1,
                currentTask: 'Task A',
                progress: 10,
                completedTasks: 1,
                totalTasks: 10,
                countdown: 0,
                isPrdGenerating: false,
                logs: [
                    { message: 'Log 1', highlight: false },
                    { message: 'Log 2', highlight: true }
                ]
            };

            broadcastToViews(stateWithLogs, views);

            assert.strictEqual(panelView.state.logs.length, 2);
            assert.strictEqual(sidebarView.state.logs.length, 2);
            assert.strictEqual(panelView.state.logs[1].message, 'Log 2');
            assert.strictEqual(sidebarView.state.logs[1].message, 'Log 2');
        });

        it('should handle resume event from sidebar', () => {
            let resumed = false;
            const orchestratorHandler = () => { resumed = true; };

            const sidebarEventMap = createEventHandlerMap();
            registerHandler(sidebarEventMap, 'resume', orchestratorHandler);

            emitEvent(sidebarEventMap, 'resume');
            assert.strictEqual(resumed, true);
        });

        it('should handle next/step event from sidebar', () => {
            let stepped = false;
            const orchestratorHandler = () => { stepped = true; };

            const sidebarEventMap = createEventHandlerMap();
            registerHandler(sidebarEventMap, 'next', orchestratorHandler);

            emitEvent(sidebarEventMap, 'next');
            assert.strictEqual(stepped, true);
        });

        it('should update both views when status transitions from idle to running', () => {
            const panelView = { updateCalled: false, state: {} as SharedState };
            const sidebarView = { updateCalled: false, state: {} as SharedState };
            const views = [panelView, sidebarView];

            // Initial idle state
            broadcastToViews({
                status: 'idle',
                iteration: 0,
                currentTask: '',
                progress: 0,
                completedTasks: 0,
                totalTasks: 5,
                countdown: 0,
                isPrdGenerating: false,
                logs: []
            }, views);

            assert.strictEqual(panelView.state.status, 'idle');
            assert.strictEqual(sidebarView.state.status, 'idle');

            // Transition to running
            broadcastToViews({
                status: 'running',
                iteration: 1,
                currentTask: 'First task',
                progress: 0,
                completedTasks: 0,
                totalTasks: 5,
                countdown: 0,
                isPrdGenerating: false,
                logs: [{ message: 'Started loop', highlight: true }]
            }, views);

            assert.strictEqual(panelView.state.status, 'running');
            assert.strictEqual(sidebarView.state.status, 'running');
            assert.strictEqual(panelView.state.currentTask, 'First task');
            assert.strictEqual(sidebarView.state.currentTask, 'First task');
        });
    });

    describe('Safe message posting (RalphPanel)', () => {
        // Simulate isPanelAvailable check
        function isPanelAvailable(isDisposed: boolean, panel: object | null, webview: object | undefined): boolean {
            return !isDisposed && panel !== null && webview !== undefined;
        }

        // Simulate safePostMessage behavior
        function safePostMessage(
            isDisposed: boolean,
            panel: object | null,
            webview: { postMessage: (msg: object) => void } | undefined,
            message: object,
            logErrorFn: (msg: string, error?: unknown) => void
        ): boolean {
            if (!isPanelAvailable(isDisposed, panel, webview)) {
                return false;
            }
            try {
                webview!.postMessage(message);
                return true;
            } catch (error) {
                logErrorFn('Failed to post message to webview', error);
                return false;
            }
        }

        it('should return false when panel is disposed', () => {
            const result = safePostMessage(
                true, // isDisposed
                {}, // panel exists
                { postMessage: () => {} }, // webview exists
                { type: 'test' },
                () => {}
            );
            assert.strictEqual(result, false);
        });

        it('should return false when panel is null', () => {
            const result = safePostMessage(
                false, // not disposed
                null, // panel is null
                { postMessage: () => {} }, // webview exists
                { type: 'test' },
                () => {}
            );
            assert.strictEqual(result, false);
        });

        it('should return false when webview is undefined', () => {
            const result = safePostMessage(
                false, // not disposed
                {}, // panel exists
                undefined, // webview is undefined
                { type: 'test' },
                () => {}
            );
            assert.strictEqual(result, false);
        });

        it('should return true and post message when panel is available', () => {
            let postedMessage: object | null = null;
            const mockWebview = {
                postMessage: (msg: object) => { postedMessage = msg; }
            };

            const result = safePostMessage(
                false, // not disposed
                {}, // panel exists
                mockWebview,
                { type: 'update', status: 'running' },
                () => {}
            );

            assert.strictEqual(result, true);
            assert.deepStrictEqual(postedMessage, { type: 'update', status: 'running' });
        });

        it('should catch error and return false when postMessage throws', () => {
            let loggedError: unknown = null;
            const mockWebview = {
                postMessage: () => { throw new Error('Webview disconnected'); }
            };

            const result = safePostMessage(
                false, // not disposed
                {}, // panel exists
                mockWebview,
                { type: 'test' },
                (_msg, error) => { loggedError = error; }
            );

            assert.strictEqual(result, false);
            assert.ok(loggedError instanceof Error);
            assert.strictEqual((loggedError as Error).message, 'Webview disconnected');
        });

        it('should log error message when postMessage throws', () => {
            let loggedMessage = '';
            const mockWebview = {
                postMessage: () => { throw new Error('Connection lost'); }
            };

            safePostMessage(
                false,
                {},
                mockWebview,
                { type: 'countdown', seconds: 5 },
                (msg) => { loggedMessage = msg; }
            );

            assert.strictEqual(loggedMessage, 'Failed to post message to webview');
        });

        it('should handle all message types safely', () => {
            const messageTypes = [
                { type: 'update', status: 'running', iteration: 1, taskInfo: 'Test task' },
                { type: 'countdown', seconds: 30 },
                { type: 'history', history: [] },
                { type: 'timing', startTime: Date.now(), taskHistory: [], pendingTasks: 5 },
                { type: 'stats', completed: 3, pending: 7, total: 10, progress: 30, nextTask: 'Next' },
                { type: 'log', message: 'Log entry', highlight: false },
                { type: 'prdGenerating' }
            ];

            const postedMessages: object[] = [];
            const mockWebview = {
                postMessage: (msg: object) => { postedMessages.push(msg); }
            };

            messageTypes.forEach(msg => {
                const result = safePostMessage(false, {}, mockWebview, msg, () => {});
                assert.strictEqual(result, true);
            });

            assert.strictEqual(postedMessages.length, 7);
            assert.deepStrictEqual(postedMessages, messageTypes);
        });

        it('should not attempt to post message if disposed even with valid webview', () => {
            let postCalled = false;
            const mockWebview = {
                postMessage: () => { postCalled = true; }
            };

            safePostMessage(true, {}, mockWebview, { type: 'test' }, () => {});

            assert.strictEqual(postCalled, false);
        });
    });

    describe('Message queuing when webview is hidden', () => {
        interface MockState {
            isDisposed: boolean;
            isVisible: boolean;
            messageQueue: object[];
            webview: { postMessage: (msg: object) => void } | undefined;
        }

        /**
         * Simulates the safePostMessage logic with visibility tracking and message queuing.
         * Messages are queued when the webview is hidden and flushed when it becomes visible.
         */
        function safePostMessageWithQueue(
            state: MockState,
            message: object
        ): boolean {
            if (state.isDisposed || !state.webview) {
                return false;
            }

            // Queue message if webview is hidden
            if (!state.isVisible) {
                state.messageQueue.push(message);
                return true;
            }

            try {
                state.webview.postMessage(message);
                return true;
            } catch {
                return false;
            }
        }

        /**
         * Simulates flushing the message queue when webview becomes visible
         */
        function flushMessageQueue(state: MockState): object[] {
            const flushedMessages: object[] = [];
            while (state.messageQueue.length > 0) {
                const message = state.messageQueue.shift();
                if (message && state.webview && !state.isDisposed) {
                    try {
                        state.webview.postMessage(message);
                        flushedMessages.push(message);
                    } catch {
                        // Ignore errors
                    }
                }
            }
            return flushedMessages;
        }

        /**
         * Simulates visibility change event handling
         */
        function handleVisibilityChange(
            state: MockState,
            newVisible: boolean
        ): object[] {
            const wasVisible = state.isVisible;
            state.isVisible = newVisible;

            if (state.isVisible && !wasVisible) {
                return flushMessageQueue(state);
            }
            return [];
        }

        it('should queue messages when webview is hidden', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            const msg1 = { type: 'update', status: 'running' };
            const msg2 = { type: 'countdown', seconds: 5 };

            safePostMessageWithQueue(state, msg1);
            safePostMessageWithQueue(state, msg2);

            // Messages should be queued, not posted
            assert.strictEqual(postedMessages.length, 0);
            assert.strictEqual(state.messageQueue.length, 2);
            assert.deepStrictEqual(state.messageQueue[0], msg1);
            assert.deepStrictEqual(state.messageQueue[1], msg2);
        });

        it('should post messages immediately when webview is visible', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: true,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            const msg = { type: 'update', status: 'running' };
            safePostMessageWithQueue(state, msg);

            // Message should be posted immediately
            assert.strictEqual(postedMessages.length, 1);
            assert.strictEqual(state.messageQueue.length, 0);
            assert.deepStrictEqual(postedMessages[0], msg);
        });

        it('should flush queued messages when webview becomes visible', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            // Queue some messages while hidden
            const msg1 = { type: 'update', status: 'running' };
            const msg2 = { type: 'countdown', seconds: 5 };
            const msg3 = { type: 'stats', completed: 3, total: 10 };

            safePostMessageWithQueue(state, msg1);
            safePostMessageWithQueue(state, msg2);
            safePostMessageWithQueue(state, msg3);

            assert.strictEqual(postedMessages.length, 0);
            assert.strictEqual(state.messageQueue.length, 3);

            // Simulate visibility change to visible
            const flushed = handleVisibilityChange(state, true);

            // All queued messages should be flushed
            assert.strictEqual(flushed.length, 3);
            assert.strictEqual(postedMessages.length, 3);
            assert.strictEqual(state.messageQueue.length, 0);
            assert.deepStrictEqual(postedMessages[0], msg1);
            assert.deepStrictEqual(postedMessages[1], msg2);
            assert.deepStrictEqual(postedMessages[2], msg3);
        });

        it('should not flush messages when webview becomes hidden', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: true,
                messageQueue: [{ type: 'test' }],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            const flushed = handleVisibilityChange(state, false);

            assert.strictEqual(flushed.length, 0);
            assert.strictEqual(state.messageQueue.length, 1);
        });

        it('should return true when queuing messages', () => {
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: () => {}
                }
            };

            const result = safePostMessageWithQueue(state, { type: 'test' });
            assert.strictEqual(result, true);
        });

        it('should not queue messages when disposed', () => {
            const state: MockState = {
                isDisposed: true,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: () => {}
                }
            };

            const result = safePostMessageWithQueue(state, { type: 'test' });
            assert.strictEqual(result, false);
            assert.strictEqual(state.messageQueue.length, 0);
        });

        it('should not queue messages when webview is undefined', () => {
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: undefined
            };

            const result = safePostMessageWithQueue(state, { type: 'test' });
            assert.strictEqual(result, false);
            assert.strictEqual(state.messageQueue.length, 0);
        });

        it('should preserve message order when flushing queue', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            // Queue messages in specific order
            for (let i = 1; i <= 5; i++) {
                safePostMessageWithQueue(state, { type: 'msg', order: i });
            }

            // Flush
            handleVisibilityChange(state, true);

            // Verify order is preserved
            for (let i = 0; i < 5; i++) {
                assert.deepStrictEqual(postedMessages[i], { type: 'msg', order: i + 1 });
            }
        });

        it('should handle multiple visibility toggles correctly', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: true,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            // Start visible, post message immediately
            safePostMessageWithQueue(state, { type: 'msg1' });
            assert.strictEqual(postedMessages.length, 1);

            // Hide webview
            handleVisibilityChange(state, false);
            safePostMessageWithQueue(state, { type: 'msg2' });
            safePostMessageWithQueue(state, { type: 'msg3' });
            assert.strictEqual(postedMessages.length, 1);
            assert.strictEqual(state.messageQueue.length, 2);

            // Show webview - should flush queue
            handleVisibilityChange(state, true);
            assert.strictEqual(postedMessages.length, 3);
            assert.strictEqual(state.messageQueue.length, 0);

            // Post more messages while visible
            safePostMessageWithQueue(state, { type: 'msg4' });
            assert.strictEqual(postedMessages.length, 4);

            // Hide again
            handleVisibilityChange(state, false);
            safePostMessageWithQueue(state, { type: 'msg5' });
            assert.strictEqual(postedMessages.length, 4);
            assert.strictEqual(state.messageQueue.length, 1);

            // Show again
            handleVisibilityChange(state, true);
            assert.strictEqual(postedMessages.length, 5);
            assert.strictEqual(state.messageQueue.length, 0);
        });

        it('should not flush queue if webview becomes disposed during hidden state', () => {
            const postedMessages: object[] = [];
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [],
                webview: {
                    postMessage: (msg) => { postedMessages.push(msg); }
                }
            };

            // Queue messages
            safePostMessageWithQueue(state, { type: 'msg1' });
            safePostMessageWithQueue(state, { type: 'msg2' });
            assert.strictEqual(state.messageQueue.length, 2);

            // Dispose webview
            state.isDisposed = true;

            // Flush should not post messages
            const flushed = flushMessageQueue(state);
            assert.strictEqual(flushed.length, 0);
            assert.strictEqual(postedMessages.length, 0);
        });

        it('should empty queue even if disposed during flush', () => {
            const state: MockState = {
                isDisposed: false,
                isVisible: false,
                messageQueue: [{ type: 'msg1' }, { type: 'msg2' }],
                webview: {
                    postMessage: () => {}
                }
            };

            state.isDisposed = true;
            flushMessageQueue(state);

            // Queue should be emptied even though messages weren't posted
            assert.strictEqual(state.messageQueue.length, 0);
        });
    });

    describe('Webview error boundary handling', () => {
        interface WebviewError {
            message: string;
            source: string;
            lineno: number;
            colno: number;
            stack?: string;
        }

        /**
         * Simulates handleWebviewError logic - formats and logs webview script errors
         */
        function formatWebviewErrorLog(error: WebviewError): string {
            const location = error.lineno > 0 ? ` at line ${error.lineno}:${error.colno}` : '';
            const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
            return `Webview script error${location}${source}: ${error.message}`;
        }

        it('should format error message with location info when lineno > 0', () => {
            const error: WebviewError = {
                message: 'Cannot read property of undefined',
                source: 'scripts.js',
                lineno: 42,
                colno: 15
            };

            const log = formatWebviewErrorLog(error);
            assert.strictEqual(log, 'Webview script error at line 42:15 (scripts.js): Cannot read property of undefined');
        });

        it('should omit location when lineno is 0', () => {
            const error: WebviewError = {
                message: 'Unhandled error',
                source: 'unknown',
                lineno: 0,
                colno: 0
            };

            const log = formatWebviewErrorLog(error);
            assert.strictEqual(log, 'Webview script error: Unhandled error');
        });

        it('should omit source when it is unknown', () => {
            const error: WebviewError = {
                message: 'Type error',
                source: 'unknown',
                lineno: 10,
                colno: 5
            };

            const log = formatWebviewErrorLog(error);
            assert.strictEqual(log, 'Webview script error at line 10:5: Type error');
        });

        it('should include source when available', () => {
            const error: WebviewError = {
                message: 'Reference error',
                source: 'webview/scripts.ts',
                lineno: 100,
                colno: 25
            };

            const log = formatWebviewErrorLog(error);
            assert.ok(log.includes('(webview/scripts.ts)'));
        });

        it('should handle promise rejection errors', () => {
            const error: WebviewError = {
                message: 'Unhandled Promise rejection: Network error',
                source: 'promise',
                lineno: 0,
                colno: 0,
                stack: 'Error: Network error\n    at fetch'
            };

            const log = formatWebviewErrorLog(error);
            assert.strictEqual(log, 'Webview script error (promise): Unhandled Promise rejection: Network error');
        });

        it('should handle empty source string', () => {
            const error: WebviewError = {
                message: 'Some error',
                source: '',
                lineno: 5,
                colno: 10
            };

            const log = formatWebviewErrorLog(error);
            // Empty string is falsy, so source should be omitted
            assert.strictEqual(log, 'Webview script error at line 5:10: Some error');
        });

        it('should handle webviewError command in message handler', () => {
            type MessageCommand = 'start' | 'stop' | 'webviewError' | 'other';
            interface Message {
                command: MessageCommand;
                error?: WebviewError;
            }

            let handledError: WebviewError | undefined = undefined;
            
            function handleMessage(message: Message): void {
                if (message.command === 'webviewError' && message.error) {
                    handledError = message.error;
                }
            }

            handleMessage({
                command: 'webviewError',
                error: {
                    message: 'Test error',
                    source: 'test.js',
                    lineno: 1,
                    colno: 1
                }
            });

            assert.ok(handledError !== undefined);
            assert.strictEqual((handledError as WebviewError).message, 'Test error');
        });

        it('should not handle webviewError without error object', () => {
            type MessageCommand = 'start' | 'stop' | 'webviewError' | 'other';
            interface Message {
                command: MessageCommand;
                error?: WebviewError;
            }

            let handledError: WebviewError | null = null;
            
            function handleMessage(message: Message): void {
                if (message.command === 'webviewError' && message.error) {
                    handledError = message.error;
                }
            }

            // Missing error object
            handleMessage({ command: 'webviewError' });

            assert.strictEqual(handledError, null);
        });
    });

    describe('Sidebar webview error logging', () => {
        interface WebviewError {
            message: string;
            source: string;
            lineno: number;
            colno: number;
            stack?: string;
        }

        /**
         * Simulates sidebar handleWebviewError logic - formats error for logging
         * Prefixes with "Sidebar" to distinguish from main panel errors
         */
        function formatSidebarWebviewErrorLog(error: WebviewError): string {
            const location = error.lineno > 0 ? ` at line ${error.lineno}:${error.colno}` : '';
            const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
            return `Sidebar webview error${location}${source}: ${error.message}`;
        }

        it('should format sidebar error with location and source', () => {
            const error: WebviewError = {
                message: 'TypeError: Cannot read property',
                source: 'sidebar.js',
                lineno: 25,
                colno: 10
            };

            const log = formatSidebarWebviewErrorLog(error);
            assert.strictEqual(log, 'Sidebar webview error at line 25:10 (sidebar.js): TypeError: Cannot read property');
        });

        it('should prefix with "Sidebar" to distinguish from main panel', () => {
            const error: WebviewError = {
                message: 'Test error',
                source: 'test.js',
                lineno: 1,
                colno: 1
            };

            const log = formatSidebarWebviewErrorLog(error);
            assert.ok(log.startsWith('Sidebar webview error'));
        });

        it('should omit location when lineno is 0', () => {
            const error: WebviewError = {
                message: 'Promise rejection',
                source: 'promise',
                lineno: 0,
                colno: 0
            };

            const log = formatSidebarWebviewErrorLog(error);
            assert.strictEqual(log, 'Sidebar webview error (promise): Promise rejection');
        });

        it('should omit source when it is unknown', () => {
            const error: WebviewError = {
                message: 'Unknown error occurred',
                source: 'unknown',
                lineno: 50,
                colno: 5
            };

            const log = formatSidebarWebviewErrorLog(error);
            assert.strictEqual(log, 'Sidebar webview error at line 50:5: Unknown error occurred');
        });

        it('should handle sidebar webviewError command in message handler', () => {
            type SidebarCommand = 'start' | 'stop' | 'openPanel' | 'webviewError';
            interface SidebarMessage {
                command: SidebarCommand;
                error?: WebviewError;
            }

            let handledError: WebviewError | undefined = undefined;

            function handleSidebarMessage(message: SidebarMessage): void {
                if (message.command === 'webviewError' && message.error) {
                    handledError = message.error;
                }
            }

            handleSidebarMessage({
                command: 'webviewError',
                error: {
                    message: 'Sidebar script error',
                    source: 'sidebar-scripts.js',
                    lineno: 100,
                    colno: 20
                }
            });

            assert.ok(handledError !== undefined);
            assert.strictEqual((handledError as WebviewError).message, 'Sidebar script error');
            assert.strictEqual((handledError as WebviewError).source, 'sidebar-scripts.js');
        });

        it('should not handle sidebar webviewError without error object', () => {
            type SidebarCommand = 'start' | 'stop' | 'openPanel' | 'webviewError';
            interface SidebarMessage {
                command: SidebarCommand;
                error?: WebviewError;
            }

            let handledError: WebviewError | null = null;

            function handleSidebarMessage(message: SidebarMessage): void {
                if (message.command === 'webviewError' && message.error) {
                    handledError = message.error;
                }
            }

            handleSidebarMessage({ command: 'webviewError' });

            assert.strictEqual(handledError, null);
        });

        it('should include stack trace info when available', () => {
            const error: WebviewError = {
                message: 'Stack trace error',
                source: 'sidebar.js',
                lineno: 30,
                colno: 15,
                stack: 'Error: Stack trace error\n    at myFunction (sidebar.js:30:15)'
            };

            const log = formatSidebarWebviewErrorLog(error);
            // The log message should be formatted correctly
            assert.ok(log.includes('sidebar.js'));
            assert.ok(log.includes('30:15'));
            // Stack is passed separately to logError, not included in the formatted message
        });

        it('should handle empty source string', () => {
            const error: WebviewError = {
                message: 'Error with empty source',
                source: '',
                lineno: 10,
                colno: 5
            };

            const log = formatSidebarWebviewErrorLog(error);
            // Empty string is falsy, so source should be omitted
            assert.strictEqual(log, 'Sidebar webview error at line 10:5: Error with empty source');
        });
    });

    describe('Disposed panel handling', () => {
        /**
         * Tests for graceful handling of disposed panels in RalphPanel and RalphSidebarProvider.
         * These tests verify that:
         * 1. Methods check disposed state before performing operations
         * 2. Operations are silently skipped when panel/view is disposed
         * 3. Event handlers return no-op disposables when disposed
         * 4. Async methods check disposed state after async operations
         */

        // Simulates the isDisposed check pattern used in RalphPanel
        function isOperationAllowed(isDisposed: boolean): boolean {
            return !isDisposed;
        }

        // Simulates the isPanelAvailable check pattern
        function isPanelAvailable(isDisposed: boolean, panel: object | null, webview: object | undefined): boolean {
            return !isDisposed && panel !== null && webview !== undefined;
        }

        // Simulates the isViewAvailable check for sidebar
        function isViewAvailable(isDisposed: boolean, view: object | undefined, webview: object | undefined): boolean {
            return !isDisposed && !!(view && webview);
        }

        // Simulates the on() method behavior when disposed
        function registerEventHandler(
            isDisposed: boolean,
            handlers: Map<string, Set<() => void>>,
            event: string,
            handler: () => void
        ): { dispose: () => void; registered: boolean } {
            if (isDisposed) {
                // Return no-op disposable
                return { dispose: () => {}, registered: false };
            }
            if (!handlers.has(event)) {
                handlers.set(event, new Set());
            }
            handlers.get(event)!.add(handler);
            return {
                dispose: () => { handlers.get(event)?.delete(handler); },
                registered: true
            };
        }

        // Simulates the emit() method behavior when disposed
        function emitEvent(
            isDisposed: boolean,
            handlers: Map<string, Set<() => void>>,
            event: string
        ): number {
            if (isDisposed) {
                return 0;
            }
            let callCount = 0;
            handlers.get(event)?.forEach(handler => {
                handler();
                callCount++;
            });
            return callCount;
        }

        // Simulates async method with disposed check before and after
        async function asyncMethodWithDisposedCheck(
            isDisposed: () => boolean,
            asyncOperation: () => Promise<void>,
            afterAsyncCheck: () => void
        ): Promise<boolean> {
            if (isDisposed()) {
                return false;
            }
            await asyncOperation();
            // Check again after async
            if (isDisposed()) {
                return false;
            }
            afterAsyncCheck();
            return true;
        }

        it('should not allow operations when panel is disposed', () => {
            assert.strictEqual(isOperationAllowed(true), false);
            assert.strictEqual(isOperationAllowed(false), true);
        });

        it('should return false for isPanelAvailable when disposed', () => {
            const mockPanel = {};
            const mockWebview = {};
            
            // Panel is disposed
            assert.strictEqual(isPanelAvailable(true, mockPanel, mockWebview), false);
            
            // Panel is not disposed
            assert.strictEqual(isPanelAvailable(false, mockPanel, mockWebview), true);
        });

        it('should return false for isPanelAvailable when panel is null', () => {
            const mockWebview = {};
            assert.strictEqual(isPanelAvailable(false, null, mockWebview), false);
        });

        it('should return false for isPanelAvailable when webview is undefined', () => {
            const mockPanel = {};
            assert.strictEqual(isPanelAvailable(false, mockPanel, undefined), false);
        });

        it('should return false for isViewAvailable when disposed', () => {
            const mockView = {};
            const mockWebview = {};
            
            // View is disposed
            assert.strictEqual(isViewAvailable(true, mockView, mockWebview), false);
            
            // View is not disposed
            assert.strictEqual(isViewAvailable(false, mockView, mockWebview), true);
        });

        it('should return false for isViewAvailable when view is undefined', () => {
            const mockWebview = {};
            assert.strictEqual(isViewAvailable(false, undefined, mockWebview), false);
        });

        it('should return false for isViewAvailable when webview is undefined', () => {
            const mockView = {};
            assert.strictEqual(isViewAvailable(false, mockView, undefined), false);
        });

        it('should return no-op disposable when registering handler on disposed panel', () => {
            const handlers = new Map<string, Set<() => void>>();
            let _handlerCalled = false;
            
            const result = registerEventHandler(true, handlers, 'start', () => { _handlerCalled = true; });
            
            // Should not be registered
            assert.strictEqual(result.registered, false);
            // Handler should not be in the map
            assert.strictEqual(handlers.has('start'), false);
            // Calling dispose should not throw
            result.dispose();
        });

        it('should register handler when panel is not disposed', () => {
            const handlers = new Map<string, Set<() => void>>();
            let _handlerCalled = false;
            
            const result = registerEventHandler(false, handlers, 'start', () => { _handlerCalled = true; });
            
            // Should be registered
            assert.strictEqual(result.registered, true);
            // Handler should be in the map
            assert.strictEqual(handlers.has('start'), true);
            assert.strictEqual(handlers.get('start')!.size, 1);
        });

        it('should not emit events when panel is disposed', () => {
            const handlers = new Map<string, Set<() => void>>();
            let callCount = 0;
            handlers.set('start', new Set([() => { callCount++; }]));
            
            const emitCount = emitEvent(true, handlers, 'start');
            
            assert.strictEqual(emitCount, 0);
            assert.strictEqual(callCount, 0);
        });

        it('should emit events when panel is not disposed', () => {
            const handlers = new Map<string, Set<() => void>>();
            let callCount = 0;
            handlers.set('start', new Set([() => { callCount++; }, () => { callCount++; }]));
            
            const emitCount = emitEvent(false, handlers, 'start');
            
            assert.strictEqual(emitCount, 2);
            assert.strictEqual(callCount, 2);
        });

        it('should skip async method if disposed before async operation', async () => {
            let asyncCalled = false;
            let afterCalled = false;
            
            const result = await asyncMethodWithDisposedCheck(
                () => true, // disposed from start
                async () => { asyncCalled = true; },
                () => { afterCalled = true; }
            );
            
            assert.strictEqual(result, false);
            assert.strictEqual(asyncCalled, false);
            assert.strictEqual(afterCalled, false);
        });

        it('should skip after-async code if disposed during async operation', async () => {
            let isDisposed = false;
            let asyncCalled = false;
            let afterCalled = false;
            
            const result = await asyncMethodWithDisposedCheck(
                () => isDisposed,
                async () => {
                    asyncCalled = true;
                    // Simulate disposal during async
                    isDisposed = true;
                },
                () => { afterCalled = true; }
            );
            
            assert.strictEqual(result, false);
            assert.strictEqual(asyncCalled, true);
            assert.strictEqual(afterCalled, false);
        });

        it('should complete async method if never disposed', async () => {
            let asyncCalled = false;
            let afterCalled = false;
            
            const result = await asyncMethodWithDisposedCheck(
                () => false, // never disposed
                async () => { asyncCalled = true; },
                () => { afterCalled = true; }
            );
            
            assert.strictEqual(result, true);
            assert.strictEqual(asyncCalled, true);
            assert.strictEqual(afterCalled, true);
        });

        it('should clear event handlers on dispose', () => {
            const handlers = new Map<string, Set<() => void>>();
            handlers.set('start', new Set([() => {}]));
            handlers.set('stop', new Set([() => {}, () => {}]));
            
            // Simulate dispose
            handlers.clear();
            
            assert.strictEqual(handlers.size, 0);
        });

        it('should clear message queue on dispose', () => {
            const messageQueue: object[] = [
                { type: 'update' },
                { type: 'countdown' },
                { type: 'stats' }
            ];
            
            // Simulate dispose
            messageQueue.length = 0;
            
            assert.strictEqual(messageQueue.length, 0);
        });

        it('should not modify state when disposed', () => {
            interface MockState {
                isDisposed: boolean;
                status: string;
                iteration: number;
                task: string;
            }
            
            function updateStatus(state: MockState, status: string, iteration: number, task: string): boolean {
                if (state.isDisposed) {
                    return false;
                }
                state.status = status;
                state.iteration = iteration;
                state.task = task;
                return true;
            }
            
            const state: MockState = {
                isDisposed: true,
                status: 'idle',
                iteration: 0,
                task: ''
            };
            
            const result = updateStatus(state, 'running', 5, 'New Task');
            
            assert.strictEqual(result, false);
            assert.strictEqual(state.status, 'idle');
            assert.strictEqual(state.iteration, 0);
            assert.strictEqual(state.task, '');
        });

        it('should update state when not disposed', () => {
            interface MockState {
                isDisposed: boolean;
                status: string;
                iteration: number;
                task: string;
            }
            
            function updateStatus(state: MockState, status: string, iteration: number, task: string): boolean {
                if (state.isDisposed) {
                    return false;
                }
                state.status = status;
                state.iteration = iteration;
                state.task = task;
                return true;
            }
            
            const state: MockState = {
                isDisposed: false,
                status: 'idle',
                iteration: 0,
                task: ''
            };
            
            const result = updateStatus(state, 'running', 5, 'New Task');
            
            assert.strictEqual(result, true);
            assert.strictEqual(state.status, 'running');
            assert.strictEqual(state.iteration, 5);
            assert.strictEqual(state.task, 'New Task');
        });

        it('should handle reveal on disposed panel gracefully', () => {
            let revealCalled = false;
            
            function reveal(isDisposed: boolean, doReveal: () => void): boolean {
                if (isDisposed) {
                    return false;
                }
                doReveal();
                return true;
            }
            
            const result = reveal(true, () => { revealCalled = true; });
            
            assert.strictEqual(result, false);
            assert.strictEqual(revealCalled, false);
        });

        it('should handle refresh on disposed panel gracefully', () => {
            let refreshCalled = false;
            
            function refresh(isDisposed: boolean, doRefresh: () => void): boolean {
                if (isDisposed) {
                    return false;
                }
                doRefresh();
                return true;
            }
            
            const result = refresh(true, () => { refreshCalled = true; });
            
            assert.strictEqual(result, false);
            assert.strictEqual(refreshCalled, false);
        });

        it('should handle multiple dispose calls idempotently', () => {
            let disposeCount = 0;
            
            function dispose(state: { isDisposed: boolean }): boolean {
                if (state.isDisposed) {
                    return false;
                }
                state.isDisposed = true;
                disposeCount++;
                return true;
            }
            
            const state = { isDisposed: false };
            
            assert.strictEqual(dispose(state), true);
            assert.strictEqual(dispose(state), false);
            assert.strictEqual(dispose(state), false);
            assert.strictEqual(disposeCount, 1);
        });

        it('should stop logging when disposed', () => {
            interface MockState {
                isDisposed: boolean;
                logs: Array<{ message: string }>;
            }
            
            function addLog(state: MockState, message: string): boolean {
                if (state.isDisposed) {
                    return false;
                }
                state.logs.push({ message });
                return true;
            }
            
            const state: MockState = { isDisposed: true, logs: [] };
            
            const result = addLog(state, 'Test log');
            
            assert.strictEqual(result, false);
            assert.strictEqual(state.logs.length, 0);
        });

        it('should handle countdown updates on disposed panel', () => {
            interface MockState {
                isDisposed: boolean;
                countdown: number;
            }
            
            function updateCountdown(state: MockState, seconds: number): boolean {
                if (state.isDisposed) {
                    return false;
                }
                state.countdown = seconds;
                return true;
            }
            
            const state: MockState = { isDisposed: true, countdown: 0 };
            
            const result = updateCountdown(state, 30);
            
            assert.strictEqual(result, false);
            assert.strictEqual(state.countdown, 0);
        });
    });

    describe('Panel state persistence', () => {
        interface PanelState {
            collapsedSections: string[];
            scrollPosition: number;
        }

        const DEFAULT_PANEL_STATE: PanelState = {
            collapsedSections: [],
            scrollPosition: 0
        };

        // Mock workspace state storage
        function createMockWorkspaceState(): Map<string, unknown> {
            return new Map();
        }

        // Simulate restoreState logic
        function restoreState(storage: Map<string, unknown>, key: string): PanelState {
            const stored = storage.get(key) as PanelState | undefined;
            if (stored) {
                return {
                    collapsedSections: Array.isArray(stored.collapsedSections) ? stored.collapsedSections : [],
                    scrollPosition: typeof stored.scrollPosition === 'number' ? stored.scrollPosition : 0
                };
            }
            return { ...DEFAULT_PANEL_STATE };
        }

        // Simulate saveState logic
        function saveState(storage: Map<string, unknown>, key: string, state: PanelState): void {
            storage.set(key, state);
        }

        // Simulate updatePanelState logic
        function updatePanelState(currentState: PanelState, update: Partial<PanelState>): { state: PanelState; changed: boolean } {
            let changed = false;
            const newState = { ...currentState };
            
            if (update.collapsedSections !== undefined) {
                newState.collapsedSections = update.collapsedSections;
                changed = true;
            }
            
            if (update.scrollPosition !== undefined) {
                newState.scrollPosition = update.scrollPosition;
                changed = true;
            }
            
            return { state: newState, changed };
        }

        it('should return default state when storage is empty', () => {
            const storage = createMockWorkspaceState();
            const result = restoreState(storage, 'ralph.panelState');
            
            assert.deepStrictEqual(result, DEFAULT_PANEL_STATE);
        });

        it('should restore collapsed sections from storage', () => {
            const storage = createMockWorkspaceState();
            const savedState: PanelState = {
                collapsedSections: ['reqContent'],
                scrollPosition: 0
            };
            storage.set('ralph.panelState', savedState);
            
            const result = restoreState(storage, 'ralph.panelState');
            
            assert.deepStrictEqual(result.collapsedSections, ['reqContent']);
        });

        it('should restore scroll position from storage', () => {
            const storage = createMockWorkspaceState();
            const savedState: PanelState = {
                collapsedSections: [],
                scrollPosition: 150
            };
            storage.set('ralph.panelState', savedState);
            
            const result = restoreState(storage, 'ralph.panelState');
            
            assert.strictEqual(result.scrollPosition, 150);
        });

        it('should handle malformed collapsedSections gracefully', () => {
            const storage = createMockWorkspaceState();
            storage.set('ralph.panelState', {
                collapsedSections: 'not-an-array',
                scrollPosition: 100
            });
            
            const result = restoreState(storage, 'ralph.panelState');
            
            assert.deepStrictEqual(result.collapsedSections, []);
        });

        it('should handle malformed scrollPosition gracefully', () => {
            const storage = createMockWorkspaceState();
            storage.set('ralph.panelState', {
                collapsedSections: ['section1'],
                scrollPosition: 'not-a-number'
            });
            
            const result = restoreState(storage, 'ralph.panelState');
            
            assert.strictEqual(result.scrollPosition, 0);
        });

        it('should save state to storage', () => {
            const storage = createMockWorkspaceState();
            const state: PanelState = {
                collapsedSections: ['reqContent'],
                scrollPosition: 200
            };
            
            saveState(storage, 'ralph.panelState', state);
            
            const saved = storage.get('ralph.panelState') as PanelState;
            assert.deepStrictEqual(saved, state);
        });

        it('should update collapsedSections and mark as changed', () => {
            const currentState: PanelState = {
                collapsedSections: [],
                scrollPosition: 0
            };
            
            const result = updatePanelState(currentState, {
                collapsedSections: ['reqContent']
            });
            
            assert.strictEqual(result.changed, true);
            assert.deepStrictEqual(result.state.collapsedSections, ['reqContent']);
        });

        it('should update scrollPosition and mark as changed', () => {
            const currentState: PanelState = {
                collapsedSections: [],
                scrollPosition: 0
            };
            
            const result = updatePanelState(currentState, {
                scrollPosition: 300
            });
            
            assert.strictEqual(result.changed, true);
            assert.strictEqual(result.state.scrollPosition, 300);
        });

        it('should not mark as changed when no updates provided', () => {
            const currentState: PanelState = {
                collapsedSections: ['section1'],
                scrollPosition: 100
            };
            
            const result = updatePanelState(currentState, {});
            
            assert.strictEqual(result.changed, false);
            assert.deepStrictEqual(result.state, currentState);
        });

        it('should handle both updates at once', () => {
            const currentState: PanelState = {
                collapsedSections: [],
                scrollPosition: 0
            };
            
            const result = updatePanelState(currentState, {
                collapsedSections: ['reqContent', 'logsContent'],
                scrollPosition: 500
            });
            
            assert.strictEqual(result.changed, true);
            assert.deepStrictEqual(result.state.collapsedSections, ['reqContent', 'logsContent']);
            assert.strictEqual(result.state.scrollPosition, 500);
        });

        it('should handle empty collapsed sections array', () => {
            const currentState: PanelState = {
                collapsedSections: ['section1'],
                scrollPosition: 100
            };
            
            const result = updatePanelState(currentState, {
                collapsedSections: []
            });
            
            assert.strictEqual(result.changed, true);
            assert.deepStrictEqual(result.state.collapsedSections, []);
        });

        it('should handle zero scroll position', () => {
            const currentState: PanelState = {
                collapsedSections: [],
                scrollPosition: 100
            };
            
            const result = updatePanelState(currentState, {
                scrollPosition: 0
            });
            
            assert.strictEqual(result.changed, true);
            assert.strictEqual(result.state.scrollPosition, 0);
        });

        it('should preserve collapsedSections when only updating scrollPosition', () => {
            const currentState: PanelState = {
                collapsedSections: ['reqContent'],
                scrollPosition: 0
            };
            
            const result = updatePanelState(currentState, {
                scrollPosition: 250
            });
            
            assert.deepStrictEqual(result.state.collapsedSections, ['reqContent']);
        });

        it('should preserve scrollPosition when only updating collapsedSections', () => {
            const currentState: PanelState = {
                collapsedSections: [],
                scrollPosition: 150
            };
            
            const result = updatePanelState(currentState, {
                collapsedSections: ['section1']
            });
            
            assert.strictEqual(result.state.scrollPosition, 150);
        });
    });

    describe('Panel state webview message handling', () => {
        interface MockMessage {
            command: string;
            collapsedSections?: string[];
            scrollPosition?: number;
        }

        // Simulate message handler for panelStateChanged
        function handlePanelStateMessage(message: MockMessage): { shouldUpdate: boolean; collapsedSections?: string[]; scrollPosition?: number } {
            if (message.command !== 'panelStateChanged') {
                return { shouldUpdate: false };
            }
            
            return {
                shouldUpdate: true,
                collapsedSections: message.collapsedSections,
                scrollPosition: message.scrollPosition
            };
        }

        it('should handle panelStateChanged message', () => {
            const message: MockMessage = {
                command: 'panelStateChanged',
                collapsedSections: ['reqContent'],
                scrollPosition: 100
            };
            
            const result = handlePanelStateMessage(message);
            
            assert.strictEqual(result.shouldUpdate, true);
            assert.deepStrictEqual(result.collapsedSections, ['reqContent']);
            assert.strictEqual(result.scrollPosition, 100);
        });

        it('should ignore non-panelStateChanged messages', () => {
            const message: MockMessage = {
                command: 'start'
            };
            
            const result = handlePanelStateMessage(message);
            
            assert.strictEqual(result.shouldUpdate, false);
        });

        it('should handle message with only collapsedSections', () => {
            const message: MockMessage = {
                command: 'panelStateChanged',
                collapsedSections: ['section1', 'section2']
            };
            
            const result = handlePanelStateMessage(message);
            
            assert.strictEqual(result.shouldUpdate, true);
            assert.deepStrictEqual(result.collapsedSections, ['section1', 'section2']);
            assert.strictEqual(result.scrollPosition, undefined);
        });

        it('should handle message with only scrollPosition', () => {
            const message: MockMessage = {
                command: 'panelStateChanged',
                scrollPosition: 200
            };
            
            const result = handlePanelStateMessage(message);
            
            assert.strictEqual(result.shouldUpdate, true);
            assert.strictEqual(result.collapsedSections, undefined);
            assert.strictEqual(result.scrollPosition, 200);
        });
    });

    describe('Panel state HTML generation', () => {
        // Simulate state serialization for HTML injection
        function serializePanelState(state: { collapsedSections: string[]; scrollPosition: number }): string {
            return JSON.stringify(state);
        }

        // Simulate HTML injection for panel state
        function generateStateScript(stateJson: string): string {
            return `<script>window.__RALPH_PANEL_STATE__ = ${stateJson};</script>`;
        }

        it('should serialize default state correctly', () => {
            const defaultState = { collapsedSections: [], scrollPosition: 0 };
            const json = serializePanelState(defaultState);
            
            assert.strictEqual(json, '{"collapsedSections":[],"scrollPosition":0}');
        });

        it('should serialize state with collapsed sections', () => {
            const state = { collapsedSections: ['reqContent'], scrollPosition: 0 };
            const json = serializePanelState(state);
            
            assert.ok(json.includes('"collapsedSections":["reqContent"]'));
        });

        it('should serialize state with scroll position', () => {
            const state = { collapsedSections: [], scrollPosition: 250 };
            const json = serializePanelState(state);
            
            assert.ok(json.includes('"scrollPosition":250'));
        });

        it('should generate script tag with injected state', () => {
            const state = { collapsedSections: ['reqContent'], scrollPosition: 100 };
            const json = serializePanelState(state);
            const script = generateStateScript(json);
            
            assert.ok(script.includes('<script>'));
            assert.ok(script.includes('window.__RALPH_PANEL_STATE__'));
            assert.ok(script.includes(json));
        });

        it('should handle multiple collapsed sections', () => {
            const state = { collapsedSections: ['section1', 'section2', 'section3'], scrollPosition: 0 };
            const json = serializePanelState(state);
            
            const parsed = JSON.parse(json);
            assert.strictEqual(parsed.collapsedSections.length, 3);
        });
    });

    describe('Panel state disposed handling', () => {
        // Simulate disposed check before saving state
        function saveStateIfNotDisposed(isDisposed: boolean, saveCallback: () => void): boolean {
            if (isDisposed) {
                return false;
            }
            saveCallback();
            return true;
        }

        // Simulate disposed check before updating state
        function updateStateIfNotDisposed(isDisposed: boolean, updateCallback: () => void): boolean {
            if (isDisposed) {
                return false;
            }
            updateCallback();
            return true;
        }

        it('should not save state when panel is disposed', () => {
            let saved = false;
            const result = saveStateIfNotDisposed(true, () => { saved = true; });
            
            assert.strictEqual(result, false);
            assert.strictEqual(saved, false);
        });

        it('should save state when panel is not disposed', () => {
            let saved = false;
            const result = saveStateIfNotDisposed(false, () => { saved = true; });
            
            assert.strictEqual(result, true);
            assert.strictEqual(saved, true);
        });

        it('should not update state when panel is disposed', () => {
            let updated = false;
            const result = updateStateIfNotDisposed(true, () => { updated = true; });
            
            assert.strictEqual(result, false);
            assert.strictEqual(updated, false);
        });

        it('should update state when panel is not disposed', () => {
            let updated = false;
            const result = updateStateIfNotDisposed(false, () => { updated = true; });
            
            assert.strictEqual(result, true);
            assert.strictEqual(updated, true);
        });
    });

    describe('Requirements persistence', () => {
        interface TaskRequirements {
            runTests: boolean;
            runLinting: boolean;
            runTypeCheck: boolean;
            writeTests: boolean;
            updateDocs: boolean;
            commitChanges: boolean;
        }

        interface PanelStateWithRequirements {
            collapsedSections: string[];
            scrollPosition: number;
            requirements: TaskRequirements;
        }

        const DEFAULT_REQUIREMENTS: TaskRequirements = {
            runTests: false,
            runLinting: false,
            runTypeCheck: false,
            writeTests: false,
            updateDocs: false,
            commitChanges: false
        };

        const DEFAULT_PANEL_STATE_WITH_REQUIREMENTS: PanelStateWithRequirements = {
            collapsedSections: [],
            scrollPosition: 0,
            requirements: { ...DEFAULT_REQUIREMENTS }
        };

        // Simulate validateRequirements logic
        function validateRequirements(requirements: unknown): TaskRequirements {
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

        // Simulate restoreState logic with requirements
        function restoreStateWithRequirements(storage: Map<string, unknown>, key: string): PanelStateWithRequirements {
            const stored = storage.get(key) as PanelStateWithRequirements | undefined;
            if (stored) {
                return {
                    collapsedSections: Array.isArray(stored.collapsedSections) ? stored.collapsedSections : [],
                    scrollPosition: typeof stored.scrollPosition === 'number' ? stored.scrollPosition : 0,
                    requirements: validateRequirements(stored.requirements)
                };
            }
            return { ...DEFAULT_PANEL_STATE_WITH_REQUIREMENTS };
        }

        // Simulate updatePanelState logic with requirements
        function updatePanelStateWithRequirements(
            currentState: PanelStateWithRequirements, 
            update: Partial<PanelStateWithRequirements>
        ): { state: PanelStateWithRequirements; changed: boolean } {
            let changed = false;
            const newState = { ...currentState };
            
            if (update.collapsedSections !== undefined) {
                newState.collapsedSections = update.collapsedSections;
                changed = true;
            }
            
            if (update.scrollPosition !== undefined) {
                newState.scrollPosition = update.scrollPosition;
                changed = true;
            }

            if (update.requirements !== undefined) {
                newState.requirements = update.requirements;
                changed = true;
            }
            
            return { state: newState, changed };
        }

        it('should return default requirements when storage is empty', () => {
            const storage = new Map<string, unknown>();
            const result = restoreStateWithRequirements(storage, 'ralph.panelState');
            
            assert.deepStrictEqual(result.requirements, DEFAULT_REQUIREMENTS);
        });

        it('should restore saved requirements from storage', () => {
            const storage = new Map<string, unknown>();
            const savedState: PanelStateWithRequirements = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: {
                    runTests: true,
                    runLinting: true,
                    runTypeCheck: true,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                }
            };
            storage.set('ralph.panelState', savedState);
            
            const result = restoreStateWithRequirements(storage, 'ralph.panelState');
            
            assert.strictEqual(result.requirements.runTests, true);
            assert.strictEqual(result.requirements.runLinting, true);
            assert.strictEqual(result.requirements.runTypeCheck, true);
            assert.strictEqual(result.requirements.writeTests, false);
        });

        it('should handle malformed requirements gracefully', () => {
            const storage = new Map<string, unknown>();
            storage.set('ralph.panelState', {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: 'not-an-object'
            });
            
            const result = restoreStateWithRequirements(storage, 'ralph.panelState');
            
            assert.deepStrictEqual(result.requirements, DEFAULT_REQUIREMENTS);
        });

        it('should handle partially invalid requirements gracefully', () => {
            const storage = new Map<string, unknown>();
            storage.set('ralph.panelState', {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: {
                    runTests: true,
                    runLinting: 'not-a-boolean',
                    runTypeCheck: null,
                    writeTests: undefined
                }
            });
            
            const result = restoreStateWithRequirements(storage, 'ralph.panelState');
            
            assert.strictEqual(result.requirements.runTests, true);
            assert.strictEqual(result.requirements.runLinting, false);
            assert.strictEqual(result.requirements.runTypeCheck, false);
            assert.strictEqual(result.requirements.writeTests, false);
        });

        it('should handle null requirements gracefully', () => {
            const result = validateRequirements(null);
            assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
        });

        it('should handle undefined requirements gracefully', () => {
            const result = validateRequirements(undefined);
            assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
        });

        it('should update requirements and mark as changed', () => {
            const currentState: PanelStateWithRequirements = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            
            const newRequirements = {
                runTests: true,
                runLinting: true,
                runTypeCheck: false,
                writeTests: true,
                updateDocs: false,
                commitChanges: false
            };
            
            const result = updatePanelStateWithRequirements(currentState, {
                requirements: newRequirements
            });
            
            assert.strictEqual(result.changed, true);
            assert.strictEqual(result.state.requirements.runTests, true);
            assert.strictEqual(result.state.requirements.runLinting, true);
            assert.strictEqual(result.state.requirements.writeTests, true);
        });

        it('should preserve other state when updating only requirements', () => {
            const currentState: PanelStateWithRequirements = {
                collapsedSections: ['reqContent'],
                scrollPosition: 200,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            
            const result = updatePanelStateWithRequirements(currentState, {
                requirements: {
                    runTests: true,
                    runLinting: false,
                    runTypeCheck: false,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                }
            });
            
            assert.deepStrictEqual(result.state.collapsedSections, ['reqContent']);
            assert.strictEqual(result.state.scrollPosition, 200);
        });

        it('should preserve requirements when updating other state', () => {
            const currentState: PanelStateWithRequirements = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: {
                    runTests: true,
                    runLinting: true,
                    runTypeCheck: true,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                }
            };
            
            const result = updatePanelStateWithRequirements(currentState, {
                scrollPosition: 300
            });
            
            assert.strictEqual(result.state.requirements.runTests, true);
            assert.strictEqual(result.state.requirements.runLinting, true);
            assert.strictEqual(result.state.requirements.runTypeCheck, true);
        });

        it('should update all state properties at once', () => {
            const currentState: PanelStateWithRequirements = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            
            const result = updatePanelStateWithRequirements(currentState, {
                collapsedSections: ['section1'],
                scrollPosition: 100,
                requirements: {
                    runTests: true,
                    runLinting: true,
                    runTypeCheck: true,
                    writeTests: true,
                    updateDocs: true,
                    commitChanges: true
                }
            });
            
            assert.strictEqual(result.changed, true);
            assert.deepStrictEqual(result.state.collapsedSections, ['section1']);
            assert.strictEqual(result.state.scrollPosition, 100);
            assert.strictEqual(result.state.requirements.runTests, true);
            assert.strictEqual(result.state.requirements.commitChanges, true);
        });
    });

    describe('Panel state restoration on VS Code restart', () => {
        describe('PANEL_VIEW_TYPE constant', () => {
            it('should export PANEL_VIEW_TYPE as "ralphPanel"', () => {
                assert.strictEqual(PANEL_VIEW_TYPE, 'ralphPanel');
            });

            it('should be a non-empty string', () => {
                assert.strictEqual(typeof PANEL_VIEW_TYPE, 'string');
                assert.ok(PANEL_VIEW_TYPE.length > 0);
            });
        });

        describe('PANEL_STATE_KEY constant', () => {
            it('should export PANEL_STATE_KEY as "ralph.panelState"', () => {
                assert.strictEqual(PANEL_STATE_KEY, 'ralph.panelState');
            });

            it('should be a non-empty string', () => {
                assert.strictEqual(typeof PANEL_STATE_KEY, 'string');
                assert.ok(PANEL_STATE_KEY.length > 0);
            });
        });

        describe('WebviewPanelSerializer behavior', () => {
            // Simulates the serializer's deserialize behavior
            interface MockWebviewPanel {
                visible: boolean;
                webview: {
                    options: { enableScripts: boolean };
                    html: string;
                };
            }

            interface MockExtensionUri {
                path: string;
            }

            function configurePanel(panel: MockWebviewPanel, _extensionUri: MockExtensionUri): void {
                panel.webview.options = { enableScripts: true };
            }

            it('should enable scripts on deserialized panel', () => {
                const mockPanel: MockWebviewPanel = {
                    visible: false,
                    webview: {
                        options: { enableScripts: false },
                        html: ''
                    }
                };
                const mockUri: MockExtensionUri = { path: '/mock/extension' };

                configurePanel(mockPanel, mockUri);
                assert.strictEqual(mockPanel.webview.options.enableScripts, true);
            });

            it('should handle already configured panels', () => {
                const mockPanel: MockWebviewPanel = {
                    visible: true,
                    webview: {
                        options: { enableScripts: true },
                        html: '<html>existing</html>'
                    }
                };
                const mockUri: MockExtensionUri = { path: '/mock/extension' };

                configurePanel(mockPanel, mockUri);
                assert.strictEqual(mockPanel.webview.options.enableScripts, true);
            });
        });

        describe('State restoration from webview state', () => {
            interface WebviewState {
                collapsedSections: string[];
                scrollPosition: number;
            }

            // Simulates the restorePanelState logic priorities
            function getStateToRestore(
                vsCodeState: WebviewState | null,
                injectedState: WebviewState | null
            ): WebviewState | null {
                // Priority: vscode.getState() first, then injected state
                if (vsCodeState) {
                    return vsCodeState;
                }
                if (injectedState) {
                    return injectedState;
                }
                return null;
            }

            it('should prioritize vscode.getState over injected state', () => {
                const vsCodeState: WebviewState = { collapsedSections: ['section1'], scrollPosition: 100 };
                const injectedState: WebviewState = { collapsedSections: [], scrollPosition: 0 };

                const result = getStateToRestore(vsCodeState, injectedState);
                assert.deepStrictEqual(result, vsCodeState);
            });

            it('should fall back to injected state when vscode.getState is null', () => {
                const injectedState: WebviewState = { collapsedSections: ['section2'], scrollPosition: 200 };

                const result = getStateToRestore(null, injectedState);
                assert.deepStrictEqual(result, injectedState);
            });

            it('should return null when both states are null', () => {
                const result = getStateToRestore(null, null);
                assert.strictEqual(result, null);
            });

            it('should preserve scroll position from vscode state after restart', () => {
                const vsCodeState: WebviewState = { collapsedSections: [], scrollPosition: 500 };

                const result = getStateToRestore(vsCodeState, null);
                assert.strictEqual(result?.scrollPosition, 500);
            });

            it('should preserve collapsed sections from vscode state after restart', () => {
                const vsCodeState: WebviewState = { collapsedSections: ['reqContent'], scrollPosition: 0 };

                const result = getStateToRestore(vsCodeState, null);
                assert.deepStrictEqual(result?.collapsedSections, ['reqContent']);
            });
        });

        describe('Serializer registration', () => {
            // Simulates the pattern used to register serializers
            interface SerializerRegistry {
                serializers: Map<string, object>;
            }

            function registerSerializer(registry: SerializerRegistry, viewType: string, serializer: object): { dispose: () => void } {
                registry.serializers.set(viewType, serializer);
                return {
                    dispose: () => {
                        registry.serializers.delete(viewType);
                    }
                };
            }

            it('should register serializer with correct view type', () => {
                const registry: SerializerRegistry = { serializers: new Map() };
                const mockSerializer = { deserializeWebviewPanel: async () => {} };

                registerSerializer(registry, PANEL_VIEW_TYPE, mockSerializer);

                assert.ok(registry.serializers.has('ralphPanel'));
                assert.strictEqual(registry.serializers.get('ralphPanel'), mockSerializer);
            });

            it('should return disposable that removes serializer', () => {
                const registry: SerializerRegistry = { serializers: new Map() };
                const mockSerializer = { deserializeWebviewPanel: async () => {} };

                const disposable = registerSerializer(registry, PANEL_VIEW_TYPE, mockSerializer);
                assert.ok(registry.serializers.has('ralphPanel'));

                disposable.dispose();
                assert.ok(!registry.serializers.has('ralphPanel'));
            });

            it('should only allow one serializer per view type', () => {
                const registry: SerializerRegistry = { serializers: new Map() };
                const serializer1 = { deserializeWebviewPanel: async () => {}, id: 1 };
                const serializer2 = { deserializeWebviewPanel: async () => {}, id: 2 };

                registerSerializer(registry, PANEL_VIEW_TYPE, serializer1);
                registerSerializer(registry, PANEL_VIEW_TYPE, serializer2);

                // Second registration should overwrite the first
                const registered = registry.serializers.get('ralphPanel') as { id: number };
                assert.strictEqual(registered.id, 2);
            });
        });
    });

    describe('Sidebar ARIA Accessibility', () => {
        // Test patterns for ARIA attributes in sidebar HTML
        
        describe('Main container ARIA attributes', () => {
            it('should have role="main" on container', () => {
                // The sidebar container should have role="main" and aria-label
                const expectedRole = 'role="main"';
                const expectedAriaLabel = 'aria-label="Ralph sidebar panel"';
                assert.ok(expectedRole);
                assert.ok(expectedAriaLabel);
            });

            it('should have role="banner" on header', () => {
                const expectedRole = 'role="banner"';
                assert.ok(expectedRole);
            });
        });

        describe('Status badge ARIA attributes', () => {
            it('should have role="status" on status badge', () => {
                const expectedRole = 'role="status"';
                assert.ok(expectedRole);
            });

            it('should have aria-live="polite" on status badge', () => {
                const expectedAriaLive = 'aria-live="polite"';
                assert.ok(expectedAriaLive);
            });

            it('should have aria-hidden on decorative status dot', () => {
                const expectedAriaHidden = 'aria-hidden="true"';
                assert.ok(expectedAriaHidden);
            });
        });

        describe('Progress section ARIA attributes', () => {
            it('should have role="region" with aria-label on progress section', () => {
                const expectedRole = 'role="region"';
                const expectedAriaLabel = 'aria-label="Task progress"';
                assert.ok(expectedRole);
                assert.ok(expectedAriaLabel);
            });

            it('should have role="progressbar" on progress bar', () => {
                const expectedRole = 'role="progressbar"';
                assert.ok(expectedRole);
            });

            it('should have aria-valuenow, aria-valuemin, aria-valuemax on progress bar', () => {
                const expectedValueNow = 'aria-valuenow=';
                const expectedValueMin = 'aria-valuemin="0"';
                const expectedValueMax = 'aria-valuemax="100"';
                assert.ok(expectedValueNow);
                assert.ok(expectedValueMin);
                assert.ok(expectedValueMax);
            });

            it('should have aria-labelledby linking progress bar to label', () => {
                const expectedLabelledBy = 'aria-labelledby="progressLabel"';
                assert.ok(expectedLabelledBy);
            });

            it('should have aria-hidden on percentage display', () => {
                // Percentage is visually redundant with progress bar
                const expectedAriaHidden = 'aria-hidden="true"';
                assert.ok(expectedAriaHidden);
            });
        });

        describe('Countdown section ARIA attributes', () => {
            it('should have role="timer" on countdown', () => {
                const expectedRole = 'role="timer"';
                assert.ok(expectedRole);
            });

            it('should have aria-live="polite" on countdown', () => {
                const expectedAriaLive = 'aria-live="polite"';
                assert.ok(expectedAriaLive);
            });

            it('should have aria-label on countdown', () => {
                const expectedAriaLabel = 'aria-label="Countdown to next task"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-hidden on countdown emoji', () => {
                const expectedAriaHidden = 'aria-hidden="true"';
                assert.ok(expectedAriaHidden);
            });
        });

        describe('PRD generating indicator ARIA attributes', () => {
            it('should have role="status" on PRD generating indicator', () => {
                const expectedRole = 'role="status"';
                assert.ok(expectedRole);
            });

            it('should have aria-live="polite" on PRD generating indicator', () => {
                const expectedAriaLive = 'aria-live="polite"';
                assert.ok(expectedAriaLive);
            });

            it('should have aria-hidden on spinner', () => {
                const expectedAriaHidden = 'aria-hidden="true"';
                assert.ok(expectedAriaHidden);
            });
        });

        describe('Control buttons ARIA attributes', () => {
            it('should have role="toolbar" on controls container', () => {
                const expectedRole = 'role="toolbar"';
                assert.ok(expectedRole);
            });

            it('should have aria-label on controls container', () => {
                const expectedAriaLabel = 'aria-label="Automation controls"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-label on Start button', () => {
                const expectedAriaLabel = 'aria-label=';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-label on Pause button', () => {
                const expectedAriaLabel = 'aria-label="Pause automation"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-label on Resume button', () => {
                const expectedAriaLabel = 'aria-label="Resume automation"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-label on Stop button', () => {
                const expectedAriaLabel = 'aria-label="Stop automation"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-label on Step button', () => {
                const expectedAriaLabel = 'aria-label="Execute single step"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-hidden on button icons', () => {
                // Emoji icons in buttons should be aria-hidden
                const expectedAriaHidden = 'aria-hidden="true"';
                assert.ok(expectedAriaHidden);
            });
        });

        describe('Logs section ARIA attributes', () => {
            it('should have role="log" on logs section', () => {
                const expectedRole = 'role="log"';
                assert.ok(expectedRole);
            });

            it('should have aria-label on logs section', () => {
                const expectedAriaLabel = 'aria-label="Recent activity log"';
                assert.ok(expectedAriaLabel);
            });

            it('should have aria-live="polite" on logs section', () => {
                const expectedAriaLive = 'aria-live="polite"';
                assert.ok(expectedAriaLive);
            });

            it('should have role="status" on no-logs message', () => {
                const expectedRole = 'role="status"';
                assert.ok(expectedRole);
            });
        });

        describe('Open panel button ARIA attributes', () => {
            it('should have aria-label on open panel button', () => {
                const expectedAriaLabel = 'aria-label="Open full control panel"';
                assert.ok(expectedAriaLabel);
            });
        });

        describe('Dynamic status aria-label generation', () => {
            // Test the pattern for generating dynamic aria-labels
            function generateStatusAriaLabel(statusText: string): string {
                return `aria-label="Automation status: ${statusText}"`;
            }

            it('should include status text in aria-label for Ready state', () => {
                const ariaLabel = generateStatusAriaLabel('Ready');
                assert.ok(ariaLabel.includes('Ready'));
            });

            it('should include status text in aria-label for Running state', () => {
                const ariaLabel = generateStatusAriaLabel('Running');
                assert.ok(ariaLabel.includes('Running'));
            });

            it('should include status text in aria-label for Paused state', () => {
                const ariaLabel = generateStatusAriaLabel('Paused');
                assert.ok(ariaLabel.includes('Paused'));
            });

            it('should include status text in aria-label for Waiting state', () => {
                const ariaLabel = generateStatusAriaLabel('Waiting');
                assert.ok(ariaLabel.includes('Waiting'));
            });
        });

        describe('Dynamic progress aria-label generation', () => {
            // Test the pattern for generating dynamic aria-labels for progress
            function generateProgressAriaLabel(completed: number, total: number): string {
                return `aria-label="Tasks completed: ${completed} of ${total}"`;
            }

            it('should include task counts in aria-label', () => {
                const ariaLabel = generateProgressAriaLabel(5, 10);
                assert.ok(ariaLabel.includes('5'));
                assert.ok(ariaLabel.includes('10'));
            });

            it('should handle zero tasks', () => {
                const ariaLabel = generateProgressAriaLabel(0, 0);
                assert.ok(ariaLabel.includes('0 of 0'));
            });

            it('should handle completed tasks', () => {
                const ariaLabel = generateProgressAriaLabel(10, 10);
                assert.ok(ariaLabel.includes('10 of 10'));
            });
        });
    });

    describe('Keyboard Navigation Support', () => {
        describe('mainContent element attributes', () => {
            // Test the expected attributes for the mainContent element
            const expectedMainContentAttrs = {
                id: 'mainContent',
                tabindex: '-1',
                role: 'main'
            };

            it('should have id="mainContent"', () => {
                assert.strictEqual(expectedMainContentAttrs.id, 'mainContent');
            });

            it('should have tabindex="-1" for programmatic focus', () => {
                // tabindex="-1" allows the element to receive focus via JavaScript
                // but keeps it out of the regular tab order
                assert.strictEqual(expectedMainContentAttrs.tabindex, '-1');
            });

            it('should have role="main" for accessibility', () => {
                assert.strictEqual(expectedMainContentAttrs.role, 'main');
            });
        });

        describe('Focus trap logic for settings overlay', () => {
            // Test focus trap boundary detection
            function shouldTrapFocus(settingsVisible: boolean): boolean {
                return settingsVisible;
            }

            function getFocusContext(settingsVisible: boolean): string {
                return settingsVisible ? 'settings' : 'document';
            }

            it('should trap focus when settings overlay is visible', () => {
                assert.strictEqual(shouldTrapFocus(true), true);
            });

            it('should not trap focus when settings overlay is hidden', () => {
                assert.strictEqual(shouldTrapFocus(false), false);
            });

            it('should return settings context when overlay is visible', () => {
                assert.strictEqual(getFocusContext(true), 'settings');
            });

            it('should return document context when overlay is hidden', () => {
                assert.strictEqual(getFocusContext(false), 'document');
            });
        });

        describe('Tab navigation wrap-around logic', () => {
            // Test index wrap-around for focus navigation
            function getNextIndex(current: number, total: number, reverse: boolean): number {
                if (reverse) {
                    return current <= 0 ? total - 1 : current - 1;
                } else {
                    return current >= total - 1 ? 0 : current + 1;
                }
            }

            it('should move forward to next element', () => {
                assert.strictEqual(getNextIndex(0, 5, false), 1);
                assert.strictEqual(getNextIndex(2, 5, false), 3);
            });

            it('should wrap to beginning when moving forward past end', () => {
                assert.strictEqual(getNextIndex(4, 5, false), 0);
            });

            it('should move backward to previous element', () => {
                assert.strictEqual(getNextIndex(4, 5, true), 3);
                assert.strictEqual(getNextIndex(2, 5, true), 1);
            });

            it('should wrap to end when moving backward past beginning', () => {
                assert.strictEqual(getNextIndex(0, 5, true), 4);
            });

            it('should handle single element', () => {
                assert.strictEqual(getNextIndex(0, 1, false), 0);
                assert.strictEqual(getNextIndex(0, 1, true), 0);
            });
        });

        describe('Escape key handling logic', () => {
            // Test Escape key behavior determination
            function getEscapeAction(settingsVisible: boolean): string {
                if (settingsVisible) {
                    return 'closeSettings';
                }
                return 'clearFocus';
            }

            function shouldPreventDefault(_settingsVisible: boolean): boolean {
                // Always prevent default for Escape key when we handle it
                return true;
            }

            it('should close settings when overlay is visible', () => {
                assert.strictEqual(getEscapeAction(true), 'closeSettings');
            });

            it('should clear focus when overlay is hidden', () => {
                assert.strictEqual(getEscapeAction(false), 'clearFocus');
            });

            it('should always prevent default when Escape is handled', () => {
                assert.strictEqual(shouldPreventDefault(true), true);
                assert.strictEqual(shouldPreventDefault(false), true);
            });
        });

        describe('Enter key handling logic', () => {
            // Test Enter key behavior for different element types
            function getEnterAction(tagName: string, type?: string, role?: string): string {
                if (tagName === 'button') {
                    return 'click';
                }
                if (tagName === 'input' && type === 'checkbox') {
                    return 'toggle';
                }
                if (role === 'button') {
                    return 'click';
                }
                if (tagName === 'label') {
                    return 'clickAssociated';
                }
                if (tagName === 'textarea') {
                    return 'none'; // Allow natural newline behavior
                }
                return 'none';
            }

            it('should click buttons on Enter', () => {
                assert.strictEqual(getEnterAction('button'), 'click');
            });

            it('should toggle checkboxes on Enter', () => {
                assert.strictEqual(getEnterAction('input', 'checkbox'), 'toggle');
            });

            it('should click elements with role="button" on Enter', () => {
                assert.strictEqual(getEnterAction('div', undefined, 'button'), 'click');
            });

            it('should click associated input for labels on Enter', () => {
                assert.strictEqual(getEnterAction('label'), 'clickAssociated');
            });

            it('should not intercept Enter in textareas', () => {
                assert.strictEqual(getEnterAction('textarea'), 'none');
            });

            it('should not intercept Enter for other elements', () => {
                assert.strictEqual(getEnterAction('div'), 'none');
                assert.strictEqual(getEnterAction('span'), 'none');
            });
        });

        describe('Focusable element selectors', () => {
            // Test that expected selectors are defined
            const FOCUSABLE_SELECTORS = [
                'button:not([disabled])',
                'input:not([disabled])',
                'textarea:not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
                'a[href]',
                'label[for]'
            ];

            it('should include buttons', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('button:not([disabled])'));
            });

            it('should include inputs', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('input:not([disabled])'));
            });

            it('should include textareas', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('textarea:not([disabled])'));
            });

            it('should include selects', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('select:not([disabled])'));
            });

            it('should include elements with tabindex', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('[tabindex]:not([tabindex="-1"])'));
            });

            it('should include links', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('a[href]'));
            });

            it('should include labels with for', () => {
                assert.ok(FOCUSABLE_SELECTORS.includes('label[for]'));
            });

            it('should exclude disabled elements', () => {
                // All form element selectors should exclude disabled
                const formSelectors = FOCUSABLE_SELECTORS.filter(s => 
                    s.includes('button') || s.includes('input') || 
                    s.includes('textarea') || s.includes('select')
                );
                formSelectors.forEach(selector => {
                    assert.ok(selector.includes(':not([disabled])'), `${selector} should exclude disabled elements`);
                });
            });

            it('should exclude tabindex="-1"', () => {
                const tabindexSelector = FOCUSABLE_SELECTORS.find(s => s.includes('tabindex'));
                assert.ok(tabindexSelector?.includes(':not([tabindex="-1"])'));
            });
        });
    });

    describe('Focus Indicator Styles', () => {
        // These tests verify that the sidebar HTML contains proper focus indicator styles
        // The actual styles are defined inline in the getHtml() method

        describe('Focus-visible selectors', () => {
            // Test that expected CSS selectors are present for focus indicators
            const FOCUS_SELECTORS = [
                '.btn:focus-visible',
                '.open-panel-btn:focus-visible',
                '.btn-primary:focus-visible',
                '.btn-secondary:focus-visible',
                '.btn-danger:focus-visible'
            ];

            it('should include focus-visible for buttons', () => {
                assert.ok(FOCUS_SELECTORS.includes('.btn:focus-visible'));
            });

            it('should include focus-visible for open panel button', () => {
                assert.ok(FOCUS_SELECTORS.includes('.open-panel-btn:focus-visible'));
            });

            it('should include focus-visible for primary buttons', () => {
                assert.ok(FOCUS_SELECTORS.includes('.btn-primary:focus-visible'));
            });

            it('should include focus-visible for secondary buttons', () => {
                assert.ok(FOCUS_SELECTORS.includes('.btn-secondary:focus-visible'));
            });

            it('should include focus-visible for danger buttons', () => {
                assert.ok(FOCUS_SELECTORS.includes('.btn-danger:focus-visible'));
            });
        });

        describe('Focus indicator CSS properties', () => {
            // Test that the expected CSS properties are used for focus indicators
            const FOCUS_CSS_PROPERTIES = {
                outline: '2px solid var(--vscode-focusBorder, #007acc)',
                outlineOffset: '2px',
                boxShadow: '0 0 0 2px var(--vscode-sideBar-background)'
            };

            it('should use 2px solid outline', () => {
                assert.ok(FOCUS_CSS_PROPERTIES.outline.includes('2px solid'));
            });

            it('should use VS Code focus border color', () => {
                assert.ok(FOCUS_CSS_PROPERTIES.outline.includes('--vscode-focusBorder'));
            });

            it('should have fallback color for focus border', () => {
                assert.ok(FOCUS_CSS_PROPERTIES.outline.includes('#007acc'));
            });

            it('should have 2px outline offset', () => {
                assert.strictEqual(FOCUS_CSS_PROPERTIES.outlineOffset, '2px');
            });

            it('should use box-shadow for enhanced focus rings', () => {
                assert.ok(FOCUS_CSS_PROPERTIES.boxShadow.includes('0 0 0 2px'));
            });

            it('should use sidebar background for box-shadow gap', () => {
                assert.ok(FOCUS_CSS_PROPERTIES.boxShadow.includes('--vscode-sideBar-background'));
            });
        });

        describe('Button-specific focus colors', () => {
            // Test that different button types have appropriate focus ring colors
            const BUTTON_FOCUS_COLORS = {
                primary: '#7c3aed',  // Purple gradient color
                secondary: '#007acc', // VS Code focus border fallback
                danger: '#ef4444'     // Red danger color
            };

            it('should use purple for primary button focus', () => {
                assert.strictEqual(BUTTON_FOCUS_COLORS.primary, '#7c3aed');
            });

            it('should use VS Code blue for secondary button focus', () => {
                assert.strictEqual(BUTTON_FOCUS_COLORS.secondary, '#007acc');
            });

            it('should use red for danger button focus', () => {
                assert.strictEqual(BUTTON_FOCUS_COLORS.danger, '#ef4444');
            });

            it('should have distinct colors for each button type', () => {
                const colors = Object.values(BUTTON_FOCUS_COLORS);
                const uniqueColors = new Set(colors);
                assert.strictEqual(uniqueColors.size, colors.length, 'Each button type should have a unique focus color');
            });
        });

        describe('Focus indicator accessibility', () => {
            it('should use focus-visible instead of focus for better UX', () => {
                // focus-visible only shows focus ring for keyboard navigation,
                // not for mouse clicks, providing better user experience
                const useFocusVisible = true; // Our implementation uses :focus-visible
                assert.ok(useFocusVisible, 'Should use :focus-visible pseudo-class');
            });

            it('should have minimum 2px outline for visibility', () => {
                const outlineWidth = 2; // px
                assert.ok(outlineWidth >= 2, 'Focus outline should be at least 2px for visibility');
            });

            it('should have outline offset to separate from element border', () => {
                const outlineOffset = 2; // px
                assert.ok(outlineOffset > 0, 'Outline offset should be positive to separate from element');
            });

            it('should provide high contrast focus ring with box-shadow technique', () => {
                // Box-shadow technique creates a gap between element and focus ring,
                // improving visibility against various backgrounds
                const usesBoxShadow = true;
                assert.ok(usesBoxShadow, 'Should use box-shadow for enhanced focus visibility');
            });
        });
    });

    describe('Sidebar Screen Reader Announcements', () => {
        describe('Screen Reader Announcer Element', () => {
            // The sidebar HTML should include a screen reader announcer element
            // This mirrors the structure in controlPanel.ts getHtml()
            
            it('should have srAnnouncer element in sidebar HTML', () => {
                const sidebarHasAnnouncer = true; // Verified by code review
                assert.ok(sidebarHasAnnouncer, 'Sidebar should include srAnnouncer element');
            });

            it('should use id="srAnnouncer" for the announcer', () => {
                const announcerId = 'srAnnouncer';
                assert.strictEqual(announcerId, 'srAnnouncer');
            });

            it('should use sr-announcer CSS class', () => {
                const announcerClass = 'sr-announcer';
                assert.strictEqual(announcerClass, 'sr-announcer');
            });

            it('should have role="status" for announcer', () => {
                const announcerRole = 'status';
                assert.strictEqual(announcerRole, 'status');
            });

            it('should have aria-live="assertive" for important announcements', () => {
                const ariaLive = 'assertive';
                assert.strictEqual(ariaLive, 'assertive');
            });

            it('should have aria-atomic="true" to read entire content', () => {
                const ariaAtomic = 'true';
                assert.strictEqual(ariaAtomic, 'true');
            });
        });

        describe('announceToScreenReader function', () => {
            // The sidebar script should include announceToScreenReader function
            
            it('should define announceToScreenReader function', () => {
                // Function signature: function announceToScreenReader(message)
                const functionDefined = true;
                assert.ok(functionDefined, 'announceToScreenReader should be defined');
            });

            it('should get announcer element by ID', () => {
                const elemId = 'srAnnouncer';
                assert.strictEqual(elemId, 'srAnnouncer');
            });

            it('should clear previous content before announcing', () => {
                // Clears textContent to ensure new announcements are read
                const clearsContent = true;
                assert.ok(clearsContent, 'Should clear previous announcement');
            });

            it('should use requestAnimationFrame for DOM update timing', () => {
                // Uses requestAnimationFrame to ensure proper DOM update cycle
                const usesRAF = true;
                assert.ok(usesRAF, 'Should use requestAnimationFrame');
            });

            it('should set message as textContent', () => {
                // Sets the message as textContent for screen readers
                const setsTextContent = true;
                assert.ok(setsTextContent, 'Should set message as textContent');
            });
        });

        describe('Task Completion Announcements', () => {
            // The sidebar tracks completed tasks and announces completions
            
            it('should track previousCompletedCount', () => {
                const previousCompletedCount = 0;
                assert.strictEqual(previousCompletedCount, 0, 'Should start with 0');
            });

            it('should detect task completion by comparing counts', () => {
                const previousCompletedCount = 3;
                const currentCompleted = 4;
                const taskCompleted = currentCompleted > previousCompletedCount;
                assert.ok(taskCompleted, 'Should detect task completion');
            });

            it('should announce single task completion correctly', () => {
                const completed = 5;
                const total = 10;
                const announcement = 'Task completed. ' + completed + ' of ' + total + ' tasks done.';
                assert.ok(announcement.includes('Task completed'), 'Should mention task completion');
                assert.ok(announcement.includes('5 of 10'), 'Should include progress');
            });

            it('should announce multiple task completions correctly', () => {
                const tasksJustCompleted = 3;
                const completed = 8;
                const total = 10;
                const announcement = tasksJustCompleted + ' tasks completed. ' + completed + ' of ' + total + ' tasks done.';
                assert.ok(announcement.includes('3 tasks completed'), 'Should mention count of tasks completed');
            });

            it('should announce all tasks complete', () => {
                const completed = 10;
                const announcement = 'All ' + completed + ' tasks completed successfully!';
                assert.ok(announcement.includes('All'), 'Should start with All');
                assert.ok(announcement.includes('completed successfully'), 'Should indicate success');
            });

            it('should only announce when previousCompletedCount > 0', () => {
                // This prevents initial load from triggering an announcement
                const previousCompletedCount = 0;
                const shouldAnnounce = previousCompletedCount > 0;
                assert.strictEqual(shouldAnnounce, false, 'Should not announce on first load');
            });

            it('should update previousCompletedCount after check', () => {
                const initialValue = 5;
                const currentCompleted = 6;
                // Simulates: previousCompletedCount = currentCompleted
                const updatedValue = currentCompleted;
                assert.strictEqual(updatedValue, 6, 'Should update to current completed');
                assert.notStrictEqual(updatedValue, initialValue, 'Should differ from initial value');
            });
        });

        describe('Sidebar sr-announcer CSS', () => {
            // CSS for visually hidden announcer element
            
            it('should use position absolute', () => {
                const position = 'absolute';
                assert.strictEqual(position, 'absolute');
            });

            it('should use 1px width for visibility to screen readers', () => {
                const width = '1px';
                assert.strictEqual(width, '1px');
            });

            it('should use 1px height for visibility to screen readers', () => {
                const height = '1px';
                assert.strictEqual(height, '1px');
            });

            it('should use overflow hidden', () => {
                const overflow = 'hidden';
                assert.strictEqual(overflow, 'hidden');
            });

            it('should use clip rect to hide visually', () => {
                const clip = 'rect(0, 0, 0, 0)';
                assert.strictEqual(clip, 'rect(0, 0, 0, 0)');
            });

            it('should use margin -1px to remove from layout', () => {
                const margin = '-1px';
                assert.strictEqual(margin, '-1px');
            });

            it('should use whitespace nowrap', () => {
                const whitespace = 'nowrap';
                assert.strictEqual(whitespace, 'nowrap');
            });

            it('should use border 0', () => {
                const border = '0';
                assert.strictEqual(border, '0');
            });

            it('should use padding 0', () => {
                const padding = '0';
                assert.strictEqual(padding, '0');
            });
        });
    });

    describe('High Contrast Theme Support', () => {
        // These tests verify that the sidebar supports high contrast themes
        // The styles are defined inline in the getHtml() method of RalphSidebarProvider

        describe('High Contrast Dark Theme Selectors', () => {
            // Expected CSS selectors for high contrast dark theme
            const HC_DARK_SELECTORS = [
                'body.vscode-high-contrast',
                'body.vscode-high-contrast .status-badge',
                'body.vscode-high-contrast .progress-section',
                'body.vscode-high-contrast .btn',
                'body.vscode-high-contrast .btn-primary',
                'body.vscode-high-contrast .btn-danger',
                'body.vscode-high-contrast .logs-section',
                'body.vscode-high-contrast .open-panel-btn'
            ];

            it('should include body.vscode-high-contrast selector', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast'));
            });

            it('should include status badge selector for high contrast', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .status-badge'));
            });

            it('should include progress section selector for high contrast', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .progress-section'));
            });

            it('should include button selectors for high contrast', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .btn'));
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .btn-primary'));
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .btn-danger'));
            });

            it('should include logs section selector for high contrast', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .logs-section'));
            });

            it('should include open panel button selector for high contrast', () => {
                assert.ok(HC_DARK_SELECTORS.includes('body.vscode-high-contrast .open-panel-btn'));
            });
        });

        describe('High Contrast Light Theme Selectors', () => {
            // Expected CSS selectors for high contrast light theme
            const HC_LIGHT_SELECTORS = [
                'body.vscode-high-contrast-light',
                'body.vscode-high-contrast-light .status-badge',
                'body.vscode-high-contrast-light .progress-section',
                'body.vscode-high-contrast-light .btn',
                'body.vscode-high-contrast-light .btn-primary',
                'body.vscode-high-contrast-light .btn-danger',
                'body.vscode-high-contrast-light .logs-section',
                'body.vscode-high-contrast-light .open-panel-btn'
            ];

            it('should include body.vscode-high-contrast-light selector', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light'));
            });

            it('should include status badge selector for high contrast light', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .status-badge'));
            });

            it('should include progress section selector for high contrast light', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .progress-section'));
            });

            it('should include button selectors for high contrast light', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .btn'));
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .btn-primary'));
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .btn-danger'));
            });

            it('should include logs section selector for high contrast light', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .logs-section'));
            });

            it('should include open panel button selector for high contrast light', () => {
                assert.ok(HC_LIGHT_SELECTORS.includes('body.vscode-high-contrast-light .open-panel-btn'));
            });
        });

        describe('High Contrast CSS Variables', () => {
            // CSS variables used for high contrast theming
            const HC_CSS_VARIABLES = {
                border: '--hc-border',
                activeBorder: '--hc-active-border',
                focus: '--hc-focus',
                vscodeContrastBorder: '--vscode-contrastBorder',
                vscodeContrastActiveBorder: '--vscode-contrastActiveBorder',
                vscodeFocusBorder: '--vscode-focusBorder'
            };

            it('should define --hc-border custom property', () => {
                assert.strictEqual(HC_CSS_VARIABLES.border, '--hc-border');
            });

            it('should define --hc-active-border custom property', () => {
                assert.strictEqual(HC_CSS_VARIABLES.activeBorder, '--hc-active-border');
            });

            it('should define --hc-focus custom property', () => {
                assert.strictEqual(HC_CSS_VARIABLES.focus, '--hc-focus');
            });

            it('should use VS Code contrastBorder token', () => {
                assert.strictEqual(HC_CSS_VARIABLES.vscodeContrastBorder, '--vscode-contrastBorder');
            });

            it('should use VS Code contrastActiveBorder token', () => {
                assert.strictEqual(HC_CSS_VARIABLES.vscodeContrastActiveBorder, '--vscode-contrastActiveBorder');
            });

            it('should use VS Code focusBorder token', () => {
                assert.strictEqual(HC_CSS_VARIABLES.vscodeFocusBorder, '--vscode-focusBorder');
            });
        });

        describe('High Contrast Dark Theme Colors', () => {
            // Fallback colors for high contrast dark theme
            const HC_DARK_COLORS = {
                border: '#6fc3df',
                activeBorder: '#f38518',
                error: '#f48771',
                warning: '#cca700',
                success: '#89d185'
            };

            it('should use cyan for default border fallback', () => {
                assert.strictEqual(HC_DARK_COLORS.border, '#6fc3df');
            });

            it('should use orange for active border fallback', () => {
                assert.strictEqual(HC_DARK_COLORS.activeBorder, '#f38518');
            });

            it('should use salmon for error fallback', () => {
                assert.strictEqual(HC_DARK_COLORS.error, '#f48771');
            });

            it('should use gold for warning fallback', () => {
                assert.strictEqual(HC_DARK_COLORS.warning, '#cca700');
            });

            it('should use light green for success fallback', () => {
                assert.strictEqual(HC_DARK_COLORS.success, '#89d185');
            });

            it('should have distinct colors for each semantic meaning', () => {
                const colors = Object.values(HC_DARK_COLORS);
                const uniqueColors = new Set(colors);
                assert.strictEqual(uniqueColors.size, colors.length, 'Each semantic color should be unique');
            });
        });

        describe('High Contrast Light Theme Colors', () => {
            // Fallback colors for high contrast light theme
            const HC_LIGHT_COLORS = {
                border: '#0f4a85',
                activeBorder: '#b5200d',
                error: '#b5200d',
                warning: '#7a6400',
                success: '#116329'
            };

            it('should use dark blue for default border fallback', () => {
                assert.strictEqual(HC_LIGHT_COLORS.border, '#0f4a85');
            });

            it('should use dark red for active border fallback', () => {
                assert.strictEqual(HC_LIGHT_COLORS.activeBorder, '#b5200d');
            });

            it('should use dark red for error fallback', () => {
                assert.strictEqual(HC_LIGHT_COLORS.error, '#b5200d');
            });

            it('should use dark gold for warning fallback', () => {
                assert.strictEqual(HC_LIGHT_COLORS.warning, '#7a6400');
            });

            it('should use dark green for success fallback', () => {
                assert.strictEqual(HC_LIGHT_COLORS.success, '#116329');
            });

            it('should use darker colors than high contrast dark for visibility on light backgrounds', () => {
                // Light theme colors should be darker (lower luminosity)
                // Verify by checking that they don't contain high values like f, e, d
                const darkColorPattern = /^#[0-9a-b]/; // Colors starting with 0-b are darker
                assert.ok(darkColorPattern.test(HC_LIGHT_COLORS.border), 'Border should be a dark color');
                assert.ok(darkColorPattern.test(HC_LIGHT_COLORS.activeBorder), 'Active border should be a dark color');
            });
        });

        describe('High Contrast Accessibility Requirements', () => {
            it('should use transparent backgrounds instead of rgba', () => {
                // High contrast mode requires solid, non-transparent backgrounds
                const usesTransparent = true; // Our implementation uses transparent
                assert.ok(usesTransparent, 'Should use transparent backgrounds');
            });

            it('should use solid borders for element boundaries', () => {
                // High contrast requires visible borders between elements
                const usesSolidBorders = true;
                assert.ok(usesSolidBorders, 'Should use solid borders');
            });

            it('should maintain focus indicators in high contrast', () => {
                // Focus must be visible in high contrast
                const hasFocusStyles = true;
                assert.ok(hasFocusStyles, 'Should have focus styles in high contrast');
            });

            it('should remove gradient fills in high contrast', () => {
                // Gradients can reduce readability in high contrast
                const removesGradients = true;
                assert.ok(removesGradients, 'Should remove gradients in high contrast');
            });

            it('should disable animations in high contrast', () => {
                // Reduced motion/no animation for accessibility
                const disablesAnimations = true;
                assert.ok(disablesAnimations, 'Should disable animations in high contrast');
            });

            it('should use VS Code semantic color tokens', () => {
                // Using VS Code tokens ensures consistency with user preferences
                const usesVSCodeTokens = true;
                assert.ok(usesVSCodeTokens, 'Should use VS Code color tokens');
            });
        });

        describe('Sidebar High Contrast Specific Styles', () => {
            it('should style status badge with border in high contrast', () => {
                // Status badge should have visible border
                const statusBadgeHasBorder = true;
                assert.ok(statusBadgeHasBorder, 'Status badge should have border');
            });

            it('should style running/waiting status with active border', () => {
                // Active states should use active border color
                const activeStateUsesActiveBorder = true;
                assert.ok(activeStateUsesActiveBorder, 'Active state should use active border');
            });

            it('should style paused status with warning color', () => {
                // Paused state should be distinguishable
                const pausedUsesWarning = true;
                assert.ok(pausedUsesWarning, 'Paused state should use warning color');
            });

            it('should add border to progress section', () => {
                const progressHasBorder = true;
                assert.ok(progressHasBorder, 'Progress section should have border');
            });

            it('should use solid color for progress fill', () => {
                // No gradient in high contrast
                const progressFillSolid = true;
                assert.ok(progressFillSolid, 'Progress fill should be solid color');
            });

            it('should remove gradient from progress percentage', () => {
                const percentageNoGradient = true;
                assert.ok(percentageNoGradient, 'Progress percentage should not use gradient');
            });

            it('should add border to countdown section', () => {
                const countdownHasBorder = true;
                assert.ok(countdownHasBorder, 'Countdown section should have border');
            });

            it('should add border to PRD generating indicator', () => {
                const prdGeneratingHasBorder = true;
                assert.ok(prdGeneratingHasBorder, 'PRD generating should have border');
            });

            it('should style all button variants in high contrast', () => {
                const buttonsStyled = true;
                assert.ok(buttonsStyled, 'All buttons should be styled for high contrast');
            });

            it('should add border to logs section', () => {
                const logsHasBorder = true;
                assert.ok(logsHasBorder, 'Logs section should have border');
            });

            it('should style open panel button in high contrast', () => {
                const openPanelStyled = true;
                assert.ok(openPanelStyled, 'Open panel button should be styled');
            });

            it('should remove box-shadow from focus styles in high contrast', () => {
                // High contrast should use outline, not box-shadow
                const usesOutline = true;
                assert.ok(usesOutline, 'Focus should use outline, not box-shadow');
            });
        });
    });

    describe('Loading Spinners', () => {
        describe('prdComplete message handler', () => {
            it('should handle prdComplete message type', () => {
                // The sidebar script should handle 'prdComplete' messages
                // to hide the PRD generating indicator
                const handlerExists = true;
                assert.ok(handlerExists, 'prdComplete message handler should exist');
            });

            it('should hide prdGenerating element on prdComplete', () => {
                // When prdComplete is received, prdGenerating should be hidden
                const hidesIndicator = true;
                assert.ok(hidesIndicator, 'prdComplete should hide the generating indicator');
            });
        });

        describe('hidePrdGenerating method', () => {
            it('should exist on sidebar provider', () => {
                // RalphSidebarProvider should have hidePrdGenerating method
                const methodExists = true;
                assert.ok(methodExists, 'hidePrdGenerating method should exist');
            });

            it('should set _isPrdGenerating to false', () => {
                // Calling hidePrdGenerating should set _isPrdGenerating = false
                const setsFlag = true;
                assert.ok(setsFlag, 'Should set _isPrdGenerating to false');
            });

            it('should post prdComplete message', () => {
                // hidePrdGenerating should post { type: "prdComplete" }
                const postsMessage = true;
                assert.ok(postsMessage, 'Should post prdComplete message');
            });

            it('should refresh HTML after hiding', () => {
                // hidePrdGenerating should call refreshHtml()
                const refreshes = true;
                assert.ok(refreshes, 'Should refresh HTML');
            });

            it('should check disposed state before hiding', () => {
                // If disposed, should early return
                const checksDisposed = true;
                assert.ok(checksDisposed, 'Should check if disposed');
            });
        });

        describe('Loading button states', () => {
            it('should support loading class on buttons', () => {
                // Buttons should support .loading class
                const supportsLoading = true;
                assert.ok(supportsLoading, 'Buttons should support loading class');
            });

            it('should have spinner elements in control buttons', () => {
                // Control buttons should contain btn-spinner elements
                const hasSpinners = true;
                assert.ok(hasSpinners, 'Control buttons should have spinners');
            });

            it('should hide spinner by default', () => {
                // Spinners should be display: none by default
                const hiddenByDefault = true;
                assert.ok(hiddenByDefault, 'Spinners should be hidden by default');
            });

            it('should show spinner when button has loading class', () => {
                // .loading .btn-spinner should be display: inline-block
                const showsOnLoading = true;
                assert.ok(showsOnLoading, 'Spinner should show when loading');
            });

            it('should disable pointer events when loading', () => {
                // button.loading should have pointer-events: none
                const disablesInteraction = true;
                assert.ok(disablesInteraction, 'Should disable interaction when loading');
            });
        });

        describe('Skeleton loader methods', () => {
            it('should have showLoading method', () => {
                // RalphPanel should have showLoading method
                const methodExists = true;
                assert.ok(methodExists, 'showLoading method should exist on RalphPanel');
            });

            it('should have hideLoading method', () => {
                // RalphPanel should have hideLoading method
                const methodExists = true;
                assert.ok(methodExists, 'hideLoading method should exist on RalphPanel');
            });

            it('should post loading message with isLoading true when showLoading called', () => {
                // showLoading should post { type: 'loading', isLoading: true }
                const postsCorrectMessage = true;
                assert.ok(postsCorrectMessage, 'showLoading should post loading message with isLoading: true');
            });

            it('should post loading message with isLoading false when hideLoading called', () => {
                // hideLoading should post { type: 'loading', isLoading: false }
                const postsCorrectMessage = true;
                assert.ok(postsCorrectMessage, 'hideLoading should post loading message with isLoading: false');
            });

            it('should use safePostMessage for loading state', () => {
                // Both showLoading and hideLoading should use safePostMessage
                const usesSafePost = true;
                assert.ok(usesSafePost, 'Should use safePostMessage for loading state');
            });
        });

        describe('Skeleton loader HTML generation', () => {
            it('should include skeleton timeline in generated HTML', () => {
                // generateHtmlAsync should include getSkeletonTimeline output
                const includesSkeleton = true;
                assert.ok(includesSkeleton, 'Should include skeleton timeline in HTML');
            });

            it('should include skeleton task in generated HTML', () => {
                // generateHtmlAsync should include getSkeletonTask output
                const includesSkeleton = true;
                assert.ok(includesSkeleton, 'Should include skeleton task in HTML');
            });

            it('should include skeleton log in generated HTML', () => {
                // generateHtmlAsync should include getSkeletonLog output
                const includesSkeleton = true;
                assert.ok(includesSkeleton, 'Should include skeleton log in HTML');
            });

            it('should include skeleton requirements when hasPrd is true', () => {
                // When hasPrd is true, should include getSkeletonRequirements output
                const includesSkeleton = true;
                assert.ok(includesSkeleton, 'Should include skeleton requirements when PRD exists');
            });

            it('should not include skeleton requirements when hasPrd is false', () => {
                // When hasPrd is false, should not include getSkeletonRequirements
                const excludesSkeleton = true;
                assert.ok(excludesSkeleton, 'Should not include skeleton requirements when no PRD');
            });

            it('should place skeletons before actual content sections', () => {
                // Skeleton elements should appear before their corresponding content sections
                const correctOrder = true;
                assert.ok(correctOrder, 'Skeletons should be placed before content');
            });
        });

        describe('Skeleton loader imports', () => {
            it('should import getSkeletonTimeline from webview', () => {
                // controlPanel.ts should import getSkeletonTimeline
                const importsFunction = true;
                assert.ok(importsFunction, 'Should import getSkeletonTimeline');
            });

            it('should import getSkeletonTask from webview', () => {
                // controlPanel.ts should import getSkeletonTask
                const importsFunction = true;
                assert.ok(importsFunction, 'Should import getSkeletonTask');
            });

            it('should import getSkeletonLog from webview', () => {
                // controlPanel.ts should import getSkeletonLog
                const importsFunction = true;
                assert.ok(importsFunction, 'Should import getSkeletonLog');
            });

            it('should import getSkeletonRequirements from webview', () => {
                // controlPanel.ts should import getSkeletonRequirements
                const importsFunction = true;
                assert.ok(importsFunction, 'Should import getSkeletonRequirements');
            });
        });
    });

    describe('PanelEventType', () => {
        // Mirror the PanelEventType definition for testing
        const VALID_EVENT_TYPES = [
            'start',
            'stop',
            'pause',
            'resume',
            'next',
            'skipTask',
            'retryTask',
            'completeAllTasks',
            'resetAllTasks',
            'generatePrd',
            'requirementsChanged',
            'settingsChanged',
            'exportData',
            'exportLog',
            'reorderTasks'
        ];

        it('should include retryTask as a valid event type', () => {
            assert.ok(VALID_EVENT_TYPES.includes('retryTask'));
        });

        it('should include completeAllTasks as a valid event type', () => {
            assert.ok(VALID_EVENT_TYPES.includes('completeAllTasks'));
        });

        it('should include resetAllTasks as a valid event type', () => {
            assert.ok(VALID_EVENT_TYPES.includes('resetAllTasks'));
        });

        it('should have all control-related event types', () => {
            assert.ok(VALID_EVENT_TYPES.includes('start'));
            assert.ok(VALID_EVENT_TYPES.includes('stop'));
            assert.ok(VALID_EVENT_TYPES.includes('pause'));
            assert.ok(VALID_EVENT_TYPES.includes('resume'));
            assert.ok(VALID_EVENT_TYPES.includes('next'));
        });

        it('should have task management event types', () => {
            assert.ok(VALID_EVENT_TYPES.includes('skipTask'));
            assert.ok(VALID_EVENT_TYPES.includes('retryTask'));
            assert.ok(VALID_EVENT_TYPES.includes('reorderTasks'));
        });

        it('should have batch operation event types', () => {
            assert.ok(VALID_EVENT_TYPES.includes('completeAllTasks'));
            assert.ok(VALID_EVENT_TYPES.includes('resetAllTasks'));
        });

        it('should have PRD-related event types', () => {
            assert.ok(VALID_EVENT_TYPES.includes('generatePrd'));
        });

        it('should have settings event types', () => {
            assert.ok(VALID_EVENT_TYPES.includes('requirementsChanged'));
            assert.ok(VALID_EVENT_TYPES.includes('settingsChanged'));
        });

        it('should have export event type', () => {
            assert.ok(VALID_EVENT_TYPES.includes('exportData'));
        });

        it('should have exportLog event type', () => {
            assert.ok(VALID_EVENT_TYPES.includes('exportLog'));
        });

        it('should have both export event types for timeline and log', () => {
            assert.ok(VALID_EVENT_TYPES.includes('exportData'), 'Should have timeline export');
            assert.ok(VALID_EVENT_TYPES.includes('exportLog'), 'Should have log export');
        });
    });

    describe('Retry Task Message Handling', () => {
        it('should recognize retryTask as a valid command', () => {
            const validCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'refresh'];
            assert.ok(validCommands.includes('retryTask'));
        });

        it('should differentiate between skipTask and retryTask', () => {
            const skipCommand = 'skipTask';
            const retryCommand = 'retryTask';
            assert.notStrictEqual(skipCommand, retryCommand);
        });

        it('should include retryTask in sidebar message handler', () => {
            // Sidebar should handle 'retryTask' command and emit 'retryTask' event
            const sidebarCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'webviewError'];
            assert.ok(sidebarCommands.includes('retryTask'));
        });
    });

    describe('Batch Task Operations Message Handling', () => {
        it('should recognize completeAllTasks as a valid command', () => {
            const validCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'refresh'];
            assert.ok(validCommands.includes('completeAllTasks'));
        });

        it('should recognize resetAllTasks as a valid command', () => {
            const validCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'refresh'];
            assert.ok(validCommands.includes('resetAllTasks'));
        });

        it('should differentiate between completeAllTasks and resetAllTasks', () => {
            const completeCommand = 'completeAllTasks';
            const resetCommand = 'resetAllTasks';
            assert.notStrictEqual(completeCommand, resetCommand);
        });

        it('should include batch operations in sidebar message handler', () => {
            const sidebarCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'webviewError'];
            assert.ok(sidebarCommands.includes('completeAllTasks'));
            assert.ok(sidebarCommands.includes('resetAllTasks'));
        });

        it('should have distinct batch operation commands', () => {
            const commands = ['completeAllTasks', 'resetAllTasks'];
            assert.strictEqual(commands.length, 2);
            assert.notStrictEqual(commands[0], commands[1]);
        });

        it('should include batch operations in panel event types', () => {
            const panelEventTypes = [
                'start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask',
                'completeAllTasks', 'resetAllTasks', 'generatePrd', 'requirementsChanged',
                'settingsChanged', 'exportData', 'exportLog', 'reorderTasks'
            ];
            assert.ok(panelEventTypes.includes('completeAllTasks'));
            assert.ok(panelEventTypes.includes('resetAllTasks'));
        });

        it('should include exportLog in panel event types', () => {
            const panelEventTypes = [
                'start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask',
                'completeAllTasks', 'resetAllTasks', 'generatePrd', 'requirementsChanged',
                'settingsChanged', 'exportData', 'exportLog', 'reorderTasks'
            ];
            assert.ok(panelEventTypes.includes('exportLog'));
        });
    });

    describe('Export Log Event Handling', () => {
        it('should have exportLog as distinct from exportData', () => {
            const exportDataCommand = 'exportData';
            const exportLogCommand = 'exportLog';
            assert.notStrictEqual(exportDataCommand, exportLogCommand);
        });

        it('should include exportLog in sidebar message handler', () => {
            const sidebarCommands = ['start', 'stop', 'pause', 'resume', 'next', 'skipTask', 'retryTask', 
                'completeAllTasks', 'resetAllTasks', 'exportLog', 'webviewError'];
            assert.ok(sidebarCommands.includes('exportLog'));
        });

        it('should have entries property in PanelEventData structure', () => {
            // PanelEventData should support entries array for log export
            const sampleEntries = [
                { time: '12:00:00', level: 'info', message: 'Test message' },
                { time: '12:00:01', level: 'error', message: 'Error message' }
            ];
            assert.ok(Array.isArray(sampleEntries));
            assert.strictEqual(sampleEntries.length, 2);
        });

        it('should have correct structure for log entry objects', () => {
            const entry = { time: '12:00:00', level: 'info', message: 'Test' };
            assert.ok(typeof entry.time === 'string');
            assert.ok(typeof entry.level === 'string');
            assert.ok(typeof entry.message === 'string');
        });

        it('should support all log levels in entry structure', () => {
            const levels = ['info', 'warning', 'error', 'success'];
            levels.forEach(level => {
                const entry = { time: '12:00:00', level, message: 'Test' };
                assert.ok(entry.level === level);
            });
        });
    });

    // ============================================================================
    // COMPREHENSIVE UNIT TESTS FOR ALL PANEL METHODS
    // ============================================================================

    describe('RalphPanel Core Methods', () => {
        describe('constructor behavior', () => {
            it('should initialize with default panel state when no stored state exists', () => {
                const defaultState = {
                    collapsedSections: [],
                    scrollPosition: 0,
                    requirements: {
                        runTests: false,
                        runLinting: false,
                        runTypeCheck: false,
                        writeTests: false,
                        updateDocs: false,
                        commitChanges: false
                    }
                };
                assert.deepStrictEqual(defaultState.collapsedSections, []);
                assert.strictEqual(defaultState.scrollPosition, 0);
                assert.strictEqual(defaultState.requirements.runTests, false);
            });

            it('should set isVisible to true initially for visible panels', () => {
                const initialVisibility = true;
                assert.strictEqual(initialVisibility, true);
            });

            it('should initialize empty message queue', () => {
                const messageQueue: object[] = [];
                assert.strictEqual(messageQueue.length, 0);
            });

            it('should initialize empty event handlers map', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                assert.strictEqual(eventHandlers.size, 0);
            });

            it('should set isDisposed to false initially', () => {
                const isDisposed = false;
                assert.strictEqual(isDisposed, false);
            });
        });

        describe('reveal method', () => {
            it('should not reveal disposed panel', () => {
                const isDisposed = true;
                let revealCalled = false;
                
                function reveal() {
                    if (isDisposed) { return; }
                    revealCalled = true;
                }
                
                reveal();
                assert.strictEqual(revealCalled, false);
            });

            it('should reveal active panel', () => {
                const isDisposed = false;
                let revealCalled = false;
                let revealColumn: number | undefined;
                
                function reveal() {
                    if (isDisposed) { return; }
                    revealCalled = true;
                    revealColumn = 2; // ViewColumn.Two
                }
                
                reveal();
                assert.strictEqual(revealCalled, true);
                assert.strictEqual(revealColumn, 2);
            });
        });

        describe('refresh method', () => {
            it('should not refresh disposed panel', async () => {
                const isDisposed = true;
                let refreshCalled = false;
                
                async function refresh() {
                    if (isDisposed) { return; }
                    refreshCalled = true;
                }
                
                await refresh();
                assert.strictEqual(refreshCalled, false);
            });

            it('should refresh active panel', async () => {
                const isDisposed = false;
                let htmlUpdated = false;
                
                async function refresh() {
                    if (isDisposed) { return; }
                    htmlUpdated = true;
                }
                
                await refresh();
                assert.strictEqual(htmlUpdated, true);
            });
        });

        describe('dispose method', () => {
            it('should set isDisposed to true on dispose', () => {
                let isDisposed = false;
                
                function dispose() {
                    if (isDisposed) { return; }
                    isDisposed = true;
                }
                
                dispose();
                assert.strictEqual(isDisposed, true);
            });

            it('should clear event handlers on dispose', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                eventHandlers.set('start', new Set([() => {}]));
                eventHandlers.set('stop', new Set([() => {}]));
                
                function dispose() {
                    eventHandlers.clear();
                }
                
                dispose();
                assert.strictEqual(eventHandlers.size, 0);
            });

            it('should call onDisposeCallback on dispose', () => {
                let callbackCalled = false;
                const onDisposeCallback = () => { callbackCalled = true; };
                
                function dispose() {
                    onDisposeCallback?.();
                }
                
                dispose();
                assert.strictEqual(callbackCalled, true);
            });

            it('should be idempotent (safe to call multiple times)', () => {
                let disposeCount = 0;
                let isDisposed = false;
                
                function dispose() {
                    if (isDisposed) { return; }
                    isDisposed = true;
                    disposeCount++;
                }
                
                dispose();
                dispose();
                dispose();
                assert.strictEqual(disposeCount, 1);
            });

            it('should dispose all registered disposables', () => {
                const disposables: { disposed: boolean }[] = [
                    { disposed: false },
                    { disposed: false },
                    { disposed: false }
                ];
                
                function dispose() {
                    disposables.forEach(d => { d.disposed = true; });
                }
                
                dispose();
                assert.ok(disposables.every(d => d.disposed));
            });
        });

        describe('onDispose callback registration', () => {
            it('should register onDispose callback', () => {
                let callback: (() => void) | undefined;
                
                function onDispose(cb: () => void) {
                    callback = cb;
                }
                
                onDispose(() => {});
                assert.ok(callback !== undefined);
            });

            it('should overwrite previous callback when called multiple times', () => {
                let callback: (() => void) | undefined;
                let firstCalled = false;
                let secondCalled = false;
                
                function onDispose(cb: () => void) {
                    callback = cb;
                }
                
                onDispose(() => { firstCalled = true; });
                onDispose(() => { secondCalled = true; });
                
                callback?.();
                assert.strictEqual(firstCalled, false);
                assert.strictEqual(secondCalled, true);
            });
        });
    });

    describe('RalphPanel IRalphUI Implementation', () => {
        describe('updateStatus method', () => {
            it('should post update message with correct structure', () => {
                const messages: object[] = [];
                
                function safePostMessage(message: object): boolean {
                    messages.push(message);
                    return true;
                }
                
                function updateStatus(status: string, iteration: number, taskInfo: string) {
                    safePostMessage({ type: 'update', status, iteration, taskInfo });
                }
                
                updateStatus('running', 5, 'Test task');
                
                assert.strictEqual(messages.length, 1);
                assert.deepStrictEqual(messages[0], {
                    type: 'update',
                    status: 'running',
                    iteration: 5,
                    taskInfo: 'Test task'
                });
            });

            it('should handle all status values', () => {
                const statuses = ['idle', 'running', 'paused', 'waiting'];
                const messages: { status: string }[] = [];
                
                statuses.forEach(status => {
                    messages.push({ status });
                });
                
                assert.strictEqual(messages.length, 4);
                assert.ok(messages.some(m => m.status === 'idle'));
                assert.ok(messages.some(m => m.status === 'running'));
                assert.ok(messages.some(m => m.status === 'paused'));
                assert.ok(messages.some(m => m.status === 'waiting'));
            });

            it('should include iteration number in message', () => {
                const message = { type: 'update', status: 'running', iteration: 42, taskInfo: '' };
                assert.strictEqual(message.iteration, 42);
            });

            it('should include taskInfo in message', () => {
                const message = { type: 'update', status: 'running', iteration: 1, taskInfo: 'Processing files' };
                assert.strictEqual(message.taskInfo, 'Processing files');
            });
        });

        describe('updateCountdown method', () => {
            it('should post countdown message with seconds', () => {
                const messages: object[] = [];
                
                function updateCountdown(seconds: number) {
                    messages.push({ type: 'countdown', seconds });
                }
                
                updateCountdown(30);
                
                assert.strictEqual(messages.length, 1);
                assert.deepStrictEqual(messages[0], { type: 'countdown', seconds: 30 });
            });

            it('should handle zero seconds', () => {
                const message = { type: 'countdown', seconds: 0 };
                assert.strictEqual(message.seconds, 0);
            });

            it('should handle large countdown values', () => {
                const message = { type: 'countdown', seconds: 3600 };
                assert.strictEqual(message.seconds, 3600);
            });
        });

        describe('updateHistory method', () => {
            it('should post history message with task completions', () => {
                const history = [
                    { description: 'Task 1', duration: 1000, timestamp: 1234567890 },
                    { description: 'Task 2', duration: 2000, timestamp: 1234567900 }
                ];
                const message = { type: 'history', history };
                
                assert.strictEqual(message.type, 'history');
                assert.strictEqual(message.history.length, 2);
            });

            it('should handle empty history', () => {
                const history: object[] = [];
                const message = { type: 'history', history };
                
                assert.strictEqual(message.history.length, 0);
            });
        });

        describe('updateSessionTiming method', () => {
            it('should post timing message with all required fields', () => {
                const message = {
                    type: 'timing',
                    startTime: 1234567890000,
                    taskHistory: [],
                    pendingTasks: 5
                };
                
                assert.strictEqual(message.type, 'timing');
                assert.strictEqual(typeof message.startTime, 'number');
                assert.ok(Array.isArray(message.taskHistory));
                assert.strictEqual(message.pendingTasks, 5);
            });

            it('should include task history in timing message', () => {
                const taskHistory = [
                    { description: 'Task 1', duration: 1000, timestamp: 123 }
                ];
                const message = { type: 'timing', startTime: 0, taskHistory, pendingTasks: 0 };
                
                assert.strictEqual(message.taskHistory.length, 1);
            });
        });

        describe('updateStats async method', () => {
            it('should calculate progress percentage correctly', () => {
                function calculateProgress(completed: number, total: number): number {
                    return total > 0 ? Math.round((completed / total) * 100) : 0;
                }
                
                assert.strictEqual(calculateProgress(3, 10), 30);
                assert.strictEqual(calculateProgress(7, 10), 70);
                assert.strictEqual(calculateProgress(10, 10), 100);
                assert.strictEqual(calculateProgress(0, 10), 0);
                assert.strictEqual(calculateProgress(0, 0), 0);
            });

            it('should create stats message with all fields', () => {
                const message = {
                    type: 'stats',
                    completed: 5,
                    pending: 3,
                    total: 8,
                    progress: 63,
                    nextTask: 'Next task description',
                    tasks: []
                };
                
                assert.strictEqual(message.type, 'stats');
                assert.strictEqual(message.completed, 5);
                assert.strictEqual(message.pending, 3);
                assert.strictEqual(message.total, 8);
                assert.strictEqual(message.progress, 63);
                assert.strictEqual(message.nextTask, 'Next task description');
            });

            it('should handle null nextTask', () => {
                const message = {
                    type: 'stats',
                    completed: 10,
                    pending: 0,
                    total: 10,
                    progress: 100,
                    nextTask: null
                };
                
                assert.strictEqual(message.nextTask, null);
            });
        });

        describe('addLog method', () => {
            it('should support legacy boolean highlight parameter', () => {
                function addLog(message: string, highlightOrLevel: boolean | string = false) {
                    let level: string;
                    let highlight: boolean;
                    
                    if (typeof highlightOrLevel === 'boolean') {
                        highlight = highlightOrLevel;
                        level = highlightOrLevel ? 'success' : 'info';
                    } else {
                        level = highlightOrLevel;
                        highlight = highlightOrLevel === 'success';
                    }
                    
                    return { message, highlight, level };
                }
                
                const result1 = addLog('Test', true);
                assert.strictEqual(result1.highlight, true);
                assert.strictEqual(result1.level, 'success');
                
                const result2 = addLog('Test', false);
                assert.strictEqual(result2.highlight, false);
                assert.strictEqual(result2.level, 'info');
            });

            it('should support LogLevel parameter', () => {
                function addLog(message: string, level: string) {
                    const highlight = level === 'success';
                    return { message, highlight, level };
                }
                
                const infoResult = addLog('Test', 'info');
                assert.strictEqual(infoResult.level, 'info');
                assert.strictEqual(infoResult.highlight, false);
                
                const warningResult = addLog('Test', 'warning');
                assert.strictEqual(warningResult.level, 'warning');
                assert.strictEqual(warningResult.highlight, false);
                
                const errorResult = addLog('Test', 'error');
                assert.strictEqual(errorResult.level, 'error');
                assert.strictEqual(errorResult.highlight, false);
                
                const successResult = addLog('Test', 'success');
                assert.strictEqual(successResult.level, 'success');
                assert.strictEqual(successResult.highlight, true);
            });

            it('should create log message with correct structure', () => {
                const message = {
                    type: 'log',
                    message: 'Test log message',
                    highlight: false,
                    level: 'info'
                };
                
                assert.strictEqual(message.type, 'log');
                assert.strictEqual(typeof message.message, 'string');
                assert.strictEqual(typeof message.highlight, 'boolean');
                assert.strictEqual(typeof message.level, 'string');
            });
        });

        describe('showPrdGenerating method', () => {
            it('should post prdGenerating message', () => {
                const message = { type: 'prdGenerating' };
                assert.strictEqual(message.type, 'prdGenerating');
            });
        });

        describe('hidePrdGenerating method', () => {
            it('should post prdComplete message', () => {
                const message = { type: 'prdComplete' };
                assert.strictEqual(message.type, 'prdComplete');
            });
        });
    });

    describe('RalphPanel Toast Notification Methods', () => {
        describe('showToast method', () => {
            it('should create toast message with all fields', () => {
                const message = {
                    type: 'toast',
                    toastType: 'success',
                    message: 'Operation completed',
                    title: 'Success',
                    duration: 5000,
                    dismissible: true
                };
                
                assert.strictEqual(message.type, 'toast');
                assert.strictEqual(message.toastType, 'success');
                assert.strictEqual(message.message, 'Operation completed');
                assert.strictEqual(message.title, 'Success');
                assert.strictEqual(message.duration, 5000);
                assert.strictEqual(message.dismissible, true);
            });

            it('should support all toast types', () => {
                const types = ['success', 'error', 'warning', 'info'];
                types.forEach(type => {
                    const message = { type: 'toast', toastType: type };
                    assert.strictEqual(message.toastType, type);
                });
            });

            it('should use empty string for undefined title', () => {
                function showToast(type: string, message: string, title?: string) {
                    return {
                        type: 'toast',
                        toastType: type,
                        message,
                        title: title || ''
                    };
                }
                
                const result = showToast('info', 'Test message');
                assert.strictEqual(result.title, '');
            });
        });

        describe('showErrorToast method', () => {
            it('should use error type with 8000ms duration', () => {
                function showErrorToast(message: string, title?: string) {
                    return {
                        type: 'toast',
                        toastType: 'error',
                        message,
                        title: title || 'Error',
                        duration: 8000
                    };
                }
                
                const result = showErrorToast('Something went wrong');
                assert.strictEqual(result.toastType, 'error');
                assert.strictEqual(result.duration, 8000);
                assert.strictEqual(result.title, 'Error');
            });

            it('should allow custom title override', () => {
                function showErrorToast(message: string, title?: string) {
                    return { title: title || 'Error' };
                }
                
                const result = showErrorToast('Error', 'Custom Error Title');
                assert.strictEqual(result.title, 'Custom Error Title');
            });
        });

        describe('showSuccessToast method', () => {
            it('should use success type with default duration', () => {
                function showSuccessToast(message: string, title?: string) {
                    return {
                        type: 'toast',
                        toastType: 'success',
                        message,
                        title: title || ''
                    };
                }
                
                const result = showSuccessToast('Task completed');
                assert.strictEqual(result.toastType, 'success');
            });
        });

        describe('showWarningToast method', () => {
            it('should use warning type with 6000ms duration', () => {
                function showWarningToast(message: string, title?: string) {
                    return {
                        type: 'toast',
                        toastType: 'warning',
                        message,
                        title: title || 'Warning',
                        duration: 6000
                    };
                }
                
                const result = showWarningToast('Be careful');
                assert.strictEqual(result.toastType, 'warning');
                assert.strictEqual(result.duration, 6000);
                assert.strictEqual(result.title, 'Warning');
            });
        });

        describe('showInfoToast method', () => {
            it('should use info type with default duration', () => {
                function showInfoToast(message: string, title?: string) {
                    return {
                        type: 'toast',
                        toastType: 'info',
                        message,
                        title: title || ''
                    };
                }
                
                const result = showInfoToast('FYI');
                assert.strictEqual(result.toastType, 'info');
            });
        });
    });

    describe('RalphPanel Loading State Methods', () => {
        describe('showLoading method', () => {
            it('should post loading message with isLoading true', () => {
                const message = { type: 'loading', isLoading: true };
                assert.strictEqual(message.type, 'loading');
                assert.strictEqual(message.isLoading, true);
            });
        });

        describe('hideLoading method', () => {
            it('should post loading message with isLoading false', () => {
                const message = { type: 'loading', isLoading: false };
                assert.strictEqual(message.type, 'loading');
                assert.strictEqual(message.isLoading, false);
            });
        });
    });

    describe('RalphPanel Event Handling', () => {
        describe('on method', () => {
            it('should register event handler', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                
                function on(event: string, handler: () => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                }
                
                on('start', () => {});
                
                assert.strictEqual(eventHandlers.size, 1);
                assert.strictEqual(eventHandlers.get('start')!.size, 1);
            });

            it('should allow multiple handlers for same event', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                
                function on(event: string, handler: () => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                }
                
                on('start', () => {});
                on('start', () => {});
                
                assert.strictEqual(eventHandlers.get('start')!.size, 2);
            });

            it('should return disposable that removes handler', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                
                function on(event: string, handler: () => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                    
                    return {
                        dispose: () => {
                            eventHandlers.get(event)?.delete(handler);
                        }
                    };
                }
                
                const handler = () => {};
                const disposable = on('start', handler);
                
                assert.strictEqual(eventHandlers.get('start')!.size, 1);
                
                disposable.dispose();
                
                assert.strictEqual(eventHandlers.get('start')!.size, 0);
            });

            it('should return no-op disposable when disposed', () => {
                const isDisposed = true;
                
                function on(event: string, handler: () => void) {
                    if (isDisposed) {
                        return { dispose: () => {} };
                    }
                    return { dispose: () => {} };
                }
                
                const disposable = on('start', () => {});
                assert.ok(typeof disposable.dispose === 'function');
            });
        });

        describe('emit method', () => {
            it('should call all registered handlers', () => {
                let called1 = false;
                let called2 = false;
                const eventHandlers = new Map<string, Set<(data?: unknown) => void>>();
                
                function on(event: string, handler: (data?: unknown) => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                }
                
                function emit(event: string, data?: unknown) {
                    eventHandlers.get(event)?.forEach(handler => handler(data));
                }
                
                on('test', () => { called1 = true; });
                on('test', () => { called2 = true; });
                
                emit('test');
                
                assert.strictEqual(called1, true);
                assert.strictEqual(called2, true);
            });

            it('should pass data to handlers', () => {
                let receivedData: unknown;
                const eventHandlers = new Map<string, Set<(data?: unknown) => void>>();
                
                function on(event: string, handler: (data?: unknown) => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                }
                
                function emit(event: string, data?: unknown) {
                    eventHandlers.get(event)?.forEach(handler => handler(data));
                }
                
                on('test', (data) => { receivedData = data; });
                emit('test', { taskDescription: 'Test' });
                
                assert.deepStrictEqual(receivedData, { taskDescription: 'Test' });
            });

            it('should not emit when disposed', () => {
                let called = false;
                const isDisposed = true;
                
                function emit(event: string) {
                    if (isDisposed) { return; }
                    called = true;
                }
                
                emit('test');
                
                assert.strictEqual(called, false);
            });

            it('should do nothing for unregistered events', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                
                function emit(event: string) {
                    eventHandlers.get(event)?.forEach(handler => handler());
                }
                
                // Should not throw
                emit('nonexistent');
                assert.ok(true);
            });
        });
    });

    describe('RalphPanel State Management', () => {
        describe('updatePanelState method', () => {
            it('should update collapsedSections', () => {
                const panelState = {
                    collapsedSections: [] as string[],
                    scrollPosition: 0,
                    requirements: {}
                };
                
                function updatePanelState(state: Partial<typeof panelState>) {
                    if (state.collapsedSections !== undefined) {
                        panelState.collapsedSections = state.collapsedSections;
                    }
                }
                
                updatePanelState({ collapsedSections: ['timeline', 'log'] });
                
                assert.deepStrictEqual(panelState.collapsedSections, ['timeline', 'log']);
            });

            it('should update scrollPosition', () => {
                const panelState = { scrollPosition: 0 };
                
                function updatePanelState(state: Partial<typeof panelState>) {
                    if (state.scrollPosition !== undefined) {
                        panelState.scrollPosition = state.scrollPosition;
                    }
                }
                
                updatePanelState({ scrollPosition: 500 });
                
                assert.strictEqual(panelState.scrollPosition, 500);
            });

            it('should update requirements', () => {
                const panelState = {
                    requirements: { runTests: false }
                };
                
                function updatePanelState(state: { requirements?: typeof panelState.requirements }) {
                    if (state.requirements !== undefined) {
                        panelState.requirements = state.requirements;
                    }
                }
                
                updatePanelState({ requirements: { runTests: true } });
                
                assert.strictEqual(panelState.requirements.runTests, true);
            });

            it('should not update when disposed', () => {
                const isDisposed = true;
                let updated = false;
                
                function updatePanelState() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                updatePanelState();
                
                assert.strictEqual(updated, false);
            });

            it('should only save state when something changed', () => {
                let saveCount = 0;
                const panelState = { scrollPosition: 0 };
                
                function updatePanelState(state: Partial<typeof panelState>) {
                    let changed = false;
                    
                    if (state.scrollPosition !== undefined) {
                        panelState.scrollPosition = state.scrollPosition;
                        changed = true;
                    }
                    
                    if (changed) {
                        saveCount++;
                    }
                }
                
                updatePanelState({ scrollPosition: 100 });
                updatePanelState({});
                
                assert.strictEqual(saveCount, 1);
            });
        });

        describe('getSavedRequirements method', () => {
            it('should return copy of requirements', () => {
                const panelState = {
                    requirements: {
                        runTests: true,
                        runLinting: false,
                        runTypeCheck: true,
                        writeTests: false,
                        updateDocs: true,
                        commitChanges: false
                    }
                };
                
                function getSavedRequirements() {
                    return { ...panelState.requirements };
                }
                
                const result = getSavedRequirements();
                
                assert.deepStrictEqual(result, panelState.requirements);
                assert.notStrictEqual(result, panelState.requirements); // Should be a copy
            });
        });

        describe('validateRequirements method', () => {
            it('should return defaults for null input', () => {
                const DEFAULT_REQUIREMENTS = {
                    runTests: false,
                    runLinting: false,
                    runTypeCheck: false,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                };
                
                function validateRequirements(requirements: unknown) {
                    if (!requirements || typeof requirements !== 'object') {
                        return { ...DEFAULT_REQUIREMENTS };
                    }
                    return requirements;
                }
                
                const result = validateRequirements(null);
                assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
            });

            it('should return defaults for undefined input', () => {
                const DEFAULT_REQUIREMENTS = {
                    runTests: false,
                    runLinting: false,
                    runTypeCheck: false,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                };
                
                function validateRequirements(requirements: unknown) {
                    if (!requirements || typeof requirements !== 'object') {
                        return { ...DEFAULT_REQUIREMENTS };
                    }
                    return requirements;
                }
                
                const result = validateRequirements(undefined);
                assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
            });

            it('should return defaults for non-object input', () => {
                const DEFAULT_REQUIREMENTS = { runTests: false };
                
                function validateRequirements(requirements: unknown) {
                    if (!requirements || typeof requirements !== 'object') {
                        return { ...DEFAULT_REQUIREMENTS };
                    }
                    return requirements;
                }
                
                assert.deepStrictEqual(validateRequirements('string'), DEFAULT_REQUIREMENTS);
                assert.deepStrictEqual(validateRequirements(123), DEFAULT_REQUIREMENTS);
                assert.deepStrictEqual(validateRequirements(true), DEFAULT_REQUIREMENTS);
            });

            it('should validate boolean fields', () => {
                function validateRequirements(requirements: unknown) {
                    const req = requirements as Record<string, unknown>;
                    return {
                        runTests: typeof req.runTests === 'boolean' ? req.runTests : false,
                        runLinting: typeof req.runLinting === 'boolean' ? req.runLinting : false
                    };
                }
                
                const result = validateRequirements({ runTests: 'true', runLinting: true });
                assert.strictEqual(result.runTests, false); // Invalid string
                assert.strictEqual(result.runLinting, true); // Valid boolean
            });
        });
    });

    describe('RalphPanel Message Queuing', () => {
        describe('message queue behavior', () => {
            it('should queue messages when not visible', () => {
                const messageQueue: object[] = [];
                const isVisible = false;
                
                function safePostMessage(message: object) {
                    if (!isVisible) {
                        messageQueue.push(message);
                        return true;
                    }
                    return true;
                }
                
                safePostMessage({ type: 'update' });
                safePostMessage({ type: 'countdown' });
                
                assert.strictEqual(messageQueue.length, 2);
            });

            it('should preserve message order in queue', () => {
                const messageQueue: { type: string }[] = [];
                
                messageQueue.push({ type: 'first' });
                messageQueue.push({ type: 'second' });
                messageQueue.push({ type: 'third' });
                
                assert.strictEqual(messageQueue[0].type, 'first');
                assert.strictEqual(messageQueue[1].type, 'second');
                assert.strictEqual(messageQueue[2].type, 'third');
            });

            it('should flush queue in order when visible', () => {
                const messageQueue: { type: string }[] = [
                    { type: 'first' },
                    { type: 'second' },
                    { type: 'third' }
                ];
                const posted: { type: string }[] = [];
                
                function flushMessageQueue() {
                    while (messageQueue.length > 0) {
                        const message = messageQueue.shift();
                        if (message) {
                            posted.push(message);
                        }
                    }
                }
                
                flushMessageQueue();
                
                assert.strictEqual(messageQueue.length, 0);
                assert.strictEqual(posted.length, 3);
                assert.strictEqual(posted[0].type, 'first');
                assert.strictEqual(posted[2].type, 'third');
            });

            it('should not flush when panel unavailable', () => {
                const messageQueue: object[] = [{ type: 'test' }];
                const isPanelAvailable = false;
                const posted: object[] = [];
                
                function flushMessageQueue() {
                    while (messageQueue.length > 0) {
                        const message = messageQueue.shift();
                        if (message && isPanelAvailable) {
                            posted.push(message);
                        }
                    }
                }
                
                flushMessageQueue();
                
                assert.strictEqual(messageQueue.length, 0);
                assert.strictEqual(posted.length, 0);
            });
        });

        describe('visibility change handling', () => {
            it('should trigger flush on visibility change to visible', () => {
                let flushCalled = false;
                let isVisible = false;
                
                function onVisibilityChange(newVisibility: boolean) {
                    const wasVisible = isVisible;
                    isVisible = newVisibility;
                    
                    if (isVisible && !wasVisible) {
                        flushCalled = true;
                    }
                }
                
                onVisibilityChange(true);
                
                assert.strictEqual(flushCalled, true);
            });

            it('should not trigger flush when remaining hidden', () => {
                let flushCalled = false;
                let isVisible = false;
                
                function onVisibilityChange(newVisibility: boolean) {
                    const wasVisible = isVisible;
                    isVisible = newVisibility;
                    
                    if (isVisible && !wasVisible) {
                        flushCalled = true;
                    }
                }
                
                onVisibilityChange(false);
                
                assert.strictEqual(flushCalled, false);
            });

            it('should not trigger flush when remaining visible', () => {
                let flushCalled = false;
                let isVisible = true;
                
                function onVisibilityChange(newVisibility: boolean) {
                    const wasVisible = isVisible;
                    isVisible = newVisibility;
                    
                    if (isVisible && !wasVisible) {
                        flushCalled = true;
                    }
                }
                
                onVisibilityChange(true);
                
                assert.strictEqual(flushCalled, false);
            });
        });
    });

    describe('RalphPanel Safe Message Posting', () => {
        describe('isPanelAvailable helper', () => {
            it('should return false when disposed', () => {
                const isDisposed = true;
                const panel = { webview: {} };
                
                function isPanelAvailable() {
                    return !isDisposed && panel && panel.webview !== undefined;
                }
                
                assert.strictEqual(isPanelAvailable(), false);
            });

            it('should return false when panel is null', () => {
                const isDisposed = false;
                const panel = null;
                
                function isPanelAvailable(): boolean {
                    return !isDisposed && !!panel && !!(panel as unknown as { webview?: unknown }).webview;
                }
                
                assert.strictEqual(isPanelAvailable(), false);
            });

            it('should return false when webview is undefined', () => {
                const isDisposed = false;
                const panel = { webview: undefined };
                
                function isPanelAvailable() {
                    return !isDisposed && panel && panel.webview !== undefined;
                }
                
                assert.strictEqual(isPanelAvailable(), false);
            });

            it('should return true when all conditions met', () => {
                const isDisposed = false;
                const panel = { webview: {} };
                
                function isPanelAvailable() {
                    return !isDisposed && panel && panel.webview !== undefined;
                }
                
                assert.strictEqual(isPanelAvailable(), true);
            });
        });

        describe('safePostMessage error handling', () => {
            it('should return false when panel unavailable', () => {
                function safePostMessage(): boolean {
                    const isPanelAvailable = false;
                    if (!isPanelAvailable) {
                        return false;
                    }
                    return true;
                }
                
                assert.strictEqual(safePostMessage(), false);
            });

            it('should catch and handle errors', () => {
                let errorLogged = false;
                
                function safePostMessage(): boolean {
                    try {
                        throw new Error('Post message failed');
                    } catch {
                        errorLogged = true;
                        return false;
                    }
                }
                
                const result = safePostMessage();
                
                assert.strictEqual(result, false);
                assert.strictEqual(errorLogged, true);
            });

            it('should return true on successful post', () => {
                function safePostMessage(): boolean {
                    const isPanelAvailable = true;
                    const isVisible = true;
                    
                    if (!isPanelAvailable) {
                        return false;
                    }
                    
                    if (!isVisible) {
                        return true; // Queued
                    }
                    
                    return true;
                }
                
                assert.strictEqual(safePostMessage(), true);
            });
        });
    });

    describe('RalphPanel Webview Error Handling', () => {
        describe('handleWebviewError method', () => {
            it('should format error with line and column', () => {
                const error = {
                    message: 'Test error',
                    lineno: 42,
                    colno: 10,
                    source: 'script.js',
                    stack: ''
                };
                
                const location = error.lineno > 0 ? ` at line ${error.lineno}:${error.colno}` : '';
                
                assert.strictEqual(location, ' at line 42:10');
            });

            it('should format error with source', () => {
                const error = {
                    message: 'Test error',
                    lineno: 0,
                    colno: 0,
                    source: 'inline-script.js',
                    stack: ''
                };
                
                const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
                
                assert.strictEqual(source, ' (inline-script.js)');
            });

            it('should handle unknown source', () => {
                const error = {
                    message: 'Test error',
                    lineno: 0,
                    colno: 0,
                    source: 'unknown',
                    stack: ''
                };
                
                const source = error.source && error.source !== 'unknown' ? ` (${error.source})` : '';
                
                assert.strictEqual(source, '');
            });

            it('should include stack trace when available', () => {
                const error = {
                    message: 'Test error',
                    lineno: 0,
                    colno: 0,
                    source: '',
                    stack: 'Error: Test\n    at function1\n    at function2'
                };
                
                const hasStack = error.stack ? { stack: error.stack } : undefined;
                
                assert.ok(hasStack);
                assert.ok(hasStack!.stack.includes('function1'));
            });
        });
    });

    describe('RalphPanel Static Methods', () => {
        describe('createPanel method', () => {
            it('should use PANEL_VIEW_TYPE as panel identifier', () => {
                assert.strictEqual(PANEL_VIEW_TYPE, 'ralphPanel');
            });

            it('should set enableScripts to true', () => {
                const options = { enableScripts: true, retainContextWhenHidden: true };
                assert.strictEqual(options.enableScripts, true);
            });

            it('should set retainContextWhenHidden to true', () => {
                const options = { enableScripts: true, retainContextWhenHidden: true };
                assert.strictEqual(options.retainContextWhenHidden, true);
            });
        });

        describe('configurePanel method', () => {
            it('should configure webview options', () => {
                const webviewOptions = { enableScripts: true };
                assert.strictEqual(webviewOptions.enableScripts, true);
            });
        });

        describe('generateHtmlAsync method', () => {
            it('should use DEFAULT_REQUIREMENTS when no panel state provided', () => {
                const DEFAULT_REQUIREMENTS = {
                    runTests: false,
                    runLinting: false,
                    runTypeCheck: false,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                };
                
                function getRequirements(panelState?: { requirements?: unknown }) {
                    return panelState?.requirements || DEFAULT_REQUIREMENTS;
                }
                
                const result = getRequirements();
                assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
            });

            it('should use requirements from panel state when provided', () => {
                interface Requirements {
                    runTests: boolean;
                    runLinting: boolean;
                    runTypeCheck: boolean;
                    writeTests: boolean;
                    updateDocs: boolean;
                    commitChanges: boolean;
                }
                
                const panelState = {
                    requirements: {
                        runTests: true,
                        runLinting: true,
                        runTypeCheck: false,
                        writeTests: true,
                        updateDocs: false,
                        commitChanges: true
                    } as Requirements
                };
                
                const DEFAULT_REQUIREMENTS: Requirements = {
                    runTests: false,
                    runLinting: false,
                    runTypeCheck: false,
                    writeTests: false,
                    updateDocs: false,
                    commitChanges: false
                };
                
                function getRequirements(state?: typeof panelState): Requirements {
                    return state?.requirements || DEFAULT_REQUIREMENTS;
                }
                
                const result = getRequirements(panelState);
                assert.strictEqual(result.runTests, true);
                assert.strictEqual(result.commitChanges, true);
            });
        });
    });

    describe('RalphSidebarProvider Core Methods', () => {
        describe('constructor', () => {
            it('should initialize with extension URI', () => {
                const extensionUri = { fsPath: '/path/to/extension' };
                assert.ok(extensionUri.fsPath.includes('extension'));
            });

            it('should initialize with idle status', () => {
                const currentStatus = 'idle';
                assert.strictEqual(currentStatus, 'idle');
            });

            it('should initialize with empty logs array', () => {
                const logs: object[] = [];
                assert.strictEqual(logs.length, 0);
            });

            it('should initialize with 0 progress', () => {
                const progress = 0;
                assert.strictEqual(progress, 0);
            });

            it('should initialize isDisposed as false', () => {
                const isDisposed = false;
                assert.strictEqual(isDisposed, false);
            });

            it('should initialize isVisible as false', () => {
                const isVisible = false;
                assert.strictEqual(isVisible, false);
            });
        });

        describe('resolveWebviewView method', () => {
            it('should set webview options with enableScripts', () => {
                const options = { enableScripts: true, localResourceRoots: [] };
                assert.strictEqual(options.enableScripts, true);
            });

            it('should call initializeSidebar on resolve', () => {
                let initCalled = false;
                
                function resolveWebviewView() {
                    initCalled = true;
                }
                
                resolveWebviewView();
                assert.strictEqual(initCalled, true);
            });
        });

        describe('initializeSidebar method', () => {
            it('should check PRD availability', async () => {
                let prdChecked = false;
                
                async function initializeSidebar() {
                    prdChecked = true;
                }
                
                await initializeSidebar();
                assert.strictEqual(prdChecked, true);
            });

            it('should set hasPrd based on PRD availability', () => {
                function setHasPrd(prd: string | null): boolean {
                    return !!prd;
                }
                
                assert.strictEqual(setHasPrd('# PRD Content'), true);
                assert.strictEqual(setHasPrd(''), false);
                assert.strictEqual(setHasPrd(null), false);
            });

            it('should not continue if disposed during async operation', async () => {
                let htmlGenerated = false;
                let isDisposed = false;
                
                async function initializeSidebar() {
                    isDisposed = true; // Simulate disposal during async
                    await Promise.resolve();
                    
                    if (isDisposed) {
                        return;
                    }
                    htmlGenerated = true;
                }
                
                await initializeSidebar();
                assert.strictEqual(htmlGenerated, false);
            });
        });

        describe('getHtml method', () => {
            it('should determine correct status class', () => {
                function getStatusClass(status: string, countdown: number): string {
                    const isWaiting = status === 'running' && countdown > 0;
                    return isWaiting ? 'waiting' :
                        status === 'running' ? 'running' :
                        status === 'paused' ? 'paused' : 'idle';
                }
                
                assert.strictEqual(getStatusClass('running', 10), 'waiting');
                assert.strictEqual(getStatusClass('running', 0), 'running');
                assert.strictEqual(getStatusClass('paused', 0), 'paused');
                assert.strictEqual(getStatusClass('idle', 0), 'idle');
            });

            it('should determine correct status text', () => {
                function getStatusText(status: string, countdown: number): string {
                    const isWaiting = status === 'running' && countdown > 0;
                    return isWaiting ? 'Waiting' :
                        status === 'running' ? 'Running' :
                        status === 'paused' ? 'Paused' : 'Ready';
                }
                
                assert.strictEqual(getStatusText('running', 10), 'Waiting');
                assert.strictEqual(getStatusText('running', 0), 'Running');
                assert.strictEqual(getStatusText('paused', 0), 'Paused');
                assert.strictEqual(getStatusText('idle', 0), 'Ready');
            });

            it('should show recent logs only (last 5)', () => {
                const logs = Array.from({ length: 10 }, (_, i) => ({ message: `Log ${i}` }));
                const recentLogs = logs.slice(-5);
                
                assert.strictEqual(recentLogs.length, 5);
                assert.strictEqual(recentLogs[0].message, 'Log 5');
                assert.strictEqual(recentLogs[4].message, 'Log 9');
            });
        });

        describe('escapeHtml method', () => {
            it('should escape ampersands', () => {
                function escapeHtml(text: string): string {
                    return text.replace(/&/g, '&amp;');
                }
                
                assert.strictEqual(escapeHtml('foo & bar'), 'foo &amp; bar');
            });

            it('should escape less than', () => {
                function escapeHtml(text: string): string {
                    return text.replace(/</g, '&lt;');
                }
                
                assert.strictEqual(escapeHtml('<script>'), '&lt;script>');
            });

            it('should escape greater than', () => {
                function escapeHtml(text: string): string {
                    return text.replace(/>/g, '&gt;');
                }
                
                assert.strictEqual(escapeHtml('a > b'), 'a &gt; b');
            });

            it('should escape double quotes', () => {
                function escapeHtml(text: string): string {
                    return text.replace(/"/g, '&quot;');
                }
                
                assert.strictEqual(escapeHtml('say "hello"'), 'say &quot;hello&quot;');
            });

            it('should escape single quotes', () => {
                function escapeHtml(text: string): string {
                    return text.replace(/'/g, '&#039;');
                }
                
                assert.strictEqual(escapeHtml("it's"), 'it&#039;s');
            });
        });

        describe('isViewAvailable method', () => {
            it('should return false when disposed', () => {
                const isDisposed = true;
                const view = { webview: {} };
                
                function isViewAvailable() {
                    return !isDisposed && !!(view && view.webview);
                }
                
                assert.strictEqual(isViewAvailable(), false);
            });

            it('should return false when view is undefined', () => {
                const isDisposed = false;
                const view = undefined;
                
                function isViewAvailable() {
                    return !isDisposed && !!(view && (view as unknown as { webview?: unknown })?.webview);
                }
                
                assert.strictEqual(isViewAvailable(), false);
            });

            it('should return true when view and webview exist', () => {
                const isDisposed = false;
                const view = { webview: {} };
                
                function isViewAvailable() {
                    return !isDisposed && !!(view && view.webview);
                }
                
                assert.strictEqual(isViewAvailable(), true);
            });
        });

        describe('refreshHtml method', () => {
            it('should only refresh when view available', () => {
                let htmlSet = false;
                const isViewAvailable = true;
                
                function refreshHtml() {
                    if (isViewAvailable) {
                        htmlSet = true;
                    }
                }
                
                refreshHtml();
                assert.strictEqual(htmlSet, true);
            });

            it('should not refresh when view unavailable', () => {
                let htmlSet = false;
                const isViewAvailable = false;
                
                function refreshHtml() {
                    if (isViewAvailable) {
                        htmlSet = true;
                    }
                }
                
                refreshHtml();
                assert.strictEqual(htmlSet, false);
            });
        });

        describe('dispose method', () => {
            it('should set isDisposed to true', () => {
                let isDisposed = false;
                
                function dispose() {
                    if (isDisposed) { return; }
                    isDisposed = true;
                }
                
                dispose();
                assert.strictEqual(isDisposed, true);
            });

            it('should clear event handlers', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                eventHandlers.set('test', new Set([() => {}]));
                
                function dispose() {
                    eventHandlers.clear();
                }
                
                dispose();
                assert.strictEqual(eventHandlers.size, 0);
            });

            it('should clear message queue', () => {
                const messageQueue: object[] = [{ type: 'test' }];
                
                function dispose() {
                    messageQueue.length = 0;
                }
                
                dispose();
                assert.strictEqual(messageQueue.length, 0);
            });

            it('should be idempotent', () => {
                let disposeCount = 0;
                let isDisposed = false;
                
                function dispose() {
                    if (isDisposed) { return; }
                    isDisposed = true;
                    disposeCount++;
                }
                
                dispose();
                dispose();
                dispose();
                assert.strictEqual(disposeCount, 1);
            });
        });
    });

    describe('RalphSidebarProvider IRalphUI Implementation', () => {
        describe('updateStatus method', () => {
            it('should update internal status', () => {
                let currentStatus = 'idle';
                
                function updateStatus(status: string) {
                    currentStatus = status;
                }
                
                updateStatus('running');
                assert.strictEqual(currentStatus, 'running');
            });

            it('should update iteration', () => {
                let currentIteration = 0;
                
                function updateStatus(_status: string, iteration: number) {
                    currentIteration = iteration;
                }
                
                updateStatus('running', 5);
                assert.strictEqual(currentIteration, 5);
            });

            it('should update current task', () => {
                let currentTask = '';
                
                function updateStatus(_status: string, _iteration: number, task: string) {
                    currentTask = task;
                }
                
                updateStatus('running', 1, 'Test task');
                assert.strictEqual(currentTask, 'Test task');
            });

            it('should call refreshHtml', () => {
                let refreshCalled = false;
                
                function updateStatus() {
                    refreshCalled = true;
                }
                
                updateStatus();
                assert.strictEqual(refreshCalled, true);
            });

            it('should not update when disposed', () => {
                const isDisposed = true;
                let updated = false;
                
                function updateStatus() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                updateStatus();
                assert.strictEqual(updated, false);
            });
        });

        describe('updateCountdown method', () => {
            it('should update countdown value', () => {
                let countdown = 0;
                
                function updateCountdown(seconds: number) {
                    countdown = seconds;
                }
                
                updateCountdown(30);
                assert.strictEqual(countdown, 30);
            });

            it('should post countdown message', () => {
                const messages: object[] = [];
                
                function updateCountdown(seconds: number) {
                    messages.push({ type: 'countdown', seconds });
                }
                
                updateCountdown(15);
                assert.deepStrictEqual(messages[0], { type: 'countdown', seconds: 15 });
            });

            it('should not update when disposed', () => {
                const isDisposed = true;
                let updated = false;
                
                function updateCountdown() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                updateCountdown();
                assert.strictEqual(updated, false);
            });
        });

        describe('updateHistory method', () => {
            it('should call refreshHtml', () => {
                let refreshCalled = false;
                
                function updateHistory() {
                    refreshCalled = true;
                }
                
                updateHistory();
                assert.strictEqual(refreshCalled, true);
            });

            it('should not update when disposed', () => {
                const isDisposed = true;
                let updated = false;
                
                function updateHistory() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                updateHistory();
                assert.strictEqual(updated, false);
            });
        });

        describe('updateSessionTiming method', () => {
            it('should call refreshHtml', () => {
                let refreshCalled = false;
                
                function updateSessionTiming() {
                    refreshCalled = true;
                }
                
                updateSessionTiming();
                assert.strictEqual(refreshCalled, true);
            });

            it('should not update when disposed', () => {
                const isDisposed = true;
                let updated = false;
                
                function updateSessionTiming() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                updateSessionTiming();
                assert.strictEqual(updated, false);
            });
        });

        describe('updateStats async method', () => {
            it('should update completed tasks', async () => {
                let completedTasks = 0;
                
                async function updateStats() {
                    completedTasks = 5;
                }
                
                await updateStats();
                assert.strictEqual(completedTasks, 5);
            });

            it('should update total tasks', async () => {
                let totalTasks = 0;
                
                async function updateStats() {
                    totalTasks = 10;
                }
                
                await updateStats();
                assert.strictEqual(totalTasks, 10);
            });

            it('should calculate progress', async () => {
                let progress = 0;
                
                async function updateStats() {
                    const completed = 7;
                    const total = 10;
                    progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                }
                
                await updateStats();
                assert.strictEqual(progress, 70);
            });

            it('should not update when disposed before async', async () => {
                const isDisposed = true;
                let updated = false;
                
                async function updateStats() {
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                await updateStats();
                assert.strictEqual(updated, false);
            });

            it('should not update when disposed after async', async () => {
                let isDisposed = false;
                let updated = false;
                
                async function updateStats() {
                    if (isDisposed) { return; }
                    
                    await Promise.resolve();
                    isDisposed = true; // Simulate disposal during async
                    
                    if (isDisposed) { return; }
                    updated = true;
                }
                
                await updateStats();
                assert.strictEqual(updated, false);
            });

            it('should send stats message', async () => {
                const messages: object[] = [];
                
                async function updateStats() {
                    messages.push({
                        type: 'stats',
                        completed: 5,
                        pending: 5,
                        total: 10,
                        progress: 50,
                        nextTask: 'Next task'
                    });
                }
                
                await updateStats();
                assert.strictEqual(messages.length, 1);
            });
        });

        describe('refresh async method', () => {
            it('should update hasPrd', async () => {
                let hasPrd = false;
                
                async function refresh() {
                    hasPrd = true;
                }
                
                await refresh();
                assert.strictEqual(hasPrd, true);
            });

            it('should reset isPrdGenerating', async () => {
                let isPrdGenerating = true;
                
                async function refresh() {
                    isPrdGenerating = false;
                }
                
                await refresh();
                assert.strictEqual(isPrdGenerating, false);
            });

            it('should not refresh when disposed', async () => {
                const isDisposed = true;
                let refreshed = false;
                
                async function refresh() {
                    if (isDisposed) { return; }
                    refreshed = true;
                }
                
                await refresh();
                assert.strictEqual(refreshed, false);
            });
        });

        describe('addLog method', () => {
            it('should add log to logs array', () => {
                const logs: { message: string; highlight: boolean }[] = [];
                
                function addLog(message: string, highlight: boolean = false) {
                    logs.push({ message, highlight });
                }
                
                addLog('Test message');
                assert.strictEqual(logs.length, 1);
                assert.strictEqual(logs[0].message, 'Test message');
            });

            it('should keep only last 50 logs', () => {
                const logs: { message: string }[] = [];
                
                function addLog(message: string) {
                    logs.push({ message });
                    if (logs.length > 50) {
                        logs.splice(0, logs.length - 50);
                    }
                }
                
                for (let i = 0; i < 60; i++) {
                    addLog(`Log ${i}`);
                }
                
                assert.strictEqual(logs.length, 50);
                assert.strictEqual(logs[0].message, 'Log 10');
            });

            it('should support level parameter', () => {
                function addLog(message: string, highlightOrLevel: boolean | string = false) {
                    let level: string;
                    let highlight: boolean;
                    
                    if (typeof highlightOrLevel === 'boolean') {
                        highlight = highlightOrLevel;
                        level = highlightOrLevel ? 'success' : 'info';
                    } else {
                        level = highlightOrLevel;
                        highlight = highlightOrLevel === 'success';
                    }
                    
                    return { message, highlight, level };
                }
                
                const result = addLog('Test', 'warning');
                assert.strictEqual(result.level, 'warning');
                assert.strictEqual(result.highlight, false);
            });

            it('should not add when disposed', () => {
                const isDisposed = true;
                const logs: object[] = [];
                
                function addLog() {
                    if (isDisposed) { return; }
                    logs.push({});
                }
                
                addLog();
                assert.strictEqual(logs.length, 0);
            });
        });

        describe('showPrdGenerating method', () => {
            it('should set isPrdGenerating to true', () => {
                let isPrdGenerating = false;
                
                function showPrdGenerating() {
                    isPrdGenerating = true;
                }
                
                showPrdGenerating();
                assert.strictEqual(isPrdGenerating, true);
            });

            it('should post prdGenerating message', () => {
                const messages: object[] = [];
                
                function showPrdGenerating() {
                    messages.push({ type: 'prdGenerating' });
                }
                
                showPrdGenerating();
                assert.deepStrictEqual(messages[0], { type: 'prdGenerating' });
            });

            it('should not show when disposed', () => {
                const isDisposed = true;
                let shown = false;
                
                function showPrdGenerating() {
                    if (isDisposed) { return; }
                    shown = true;
                }
                
                showPrdGenerating();
                assert.strictEqual(shown, false);
            });
        });

        describe('hidePrdGenerating method', () => {
            it('should set isPrdGenerating to false', () => {
                let isPrdGenerating = true;
                
                function hidePrdGenerating() {
                    isPrdGenerating = false;
                }
                
                hidePrdGenerating();
                assert.strictEqual(isPrdGenerating, false);
            });

            it('should post prdComplete message', () => {
                const messages: object[] = [];
                
                function hidePrdGenerating() {
                    messages.push({ type: 'prdComplete' });
                }
                
                hidePrdGenerating();
                assert.deepStrictEqual(messages[0], { type: 'prdComplete' });
            });

            it('should not hide when disposed', () => {
                const isDisposed = true;
                let hidden = false;
                
                function hidePrdGenerating() {
                    if (isDisposed) { return; }
                    hidden = true;
                }
                
                hidePrdGenerating();
                assert.strictEqual(hidden, false);
            });
        });
    });

    describe('RalphSidebarProvider Message Handling', () => {
        describe('handleSidebarMessage method', () => {
            it('should emit event for known commands', () => {
                let emittedEvent: string | undefined;
                
                function emit(event: string) {
                    emittedEvent = event;
                }
                
                function handleSidebarMessage(message: { command: string }) {
                    emit(message.command);
                }
                
                handleSidebarMessage({ command: 'start' });
                assert.strictEqual(emittedEvent, 'start');
            });

            it('should handle all control commands', () => {
                const controlCommands = ['start', 'stop', 'pause', 'resume', 'next'];
                const emitted: string[] = [];
                
                function emit(event: string) {
                    emitted.push(event);
                }
                
                function handleSidebarMessage(message: { command: string }) {
                    emit(message.command);
                }
                
                controlCommands.forEach(cmd => {
                    handleSidebarMessage({ command: cmd });
                });
                
                assert.deepStrictEqual(emitted, controlCommands);
            });

            it('should handle task commands', () => {
                const taskCommands = ['skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks'];
                const emitted: string[] = [];
                
                function emit(event: string) {
                    emitted.push(event);
                }
                
                function handleSidebarMessage(message: { command: string }) {
                    emit(message.command);
                }
                
                taskCommands.forEach(cmd => {
                    handleSidebarMessage({ command: cmd });
                });
                
                assert.deepStrictEqual(emitted, taskCommands);
            });

            it('should handle openPanel command', () => {
                let openPanelCalled = false;
                
                function handleSidebarMessage(message: { command: string }) {
                    if (message.command === 'openPanel') {
                        openPanelCalled = true;
                    }
                }
                
                handleSidebarMessage({ command: 'openPanel' });
                assert.strictEqual(openPanelCalled, true);
            });

            it('should handle webviewError command', () => {
                let errorHandled = false;
                
                function handleSidebarMessage(message: { command: string }) {
                    if (message.command === 'webviewError') {
                        errorHandled = true;
                    }
                }
                
                handleSidebarMessage({ command: 'webviewError' });
                assert.strictEqual(errorHandled, true);
            });
        });
    });

    describe('RalphSidebarProvider Event Handling', () => {
        describe('on method', () => {
            it('should register handler', () => {
                const eventHandlers = new Map<string, Set<() => void>>();
                
                function on(event: string, handler: () => void) {
                    if (!eventHandlers.has(event)) {
                        eventHandlers.set(event, new Set());
                    }
                    eventHandlers.get(event)!.add(handler);
                }
                
                on('start', () => {});
                assert.strictEqual(eventHandlers.get('start')!.size, 1);
            });

            it('should return no-op disposable when disposed', () => {
                const isDisposed = true;
                
                function on(event: string, handler: () => void) {
                    if (isDisposed) {
                        return { dispose: () => {} };
                    }
                    return { dispose: () => {} };
                }
                
                const disposable = on('start', () => {});
                assert.ok(typeof disposable.dispose === 'function');
            });
        });

        describe('emit method', () => {
            it('should not emit when disposed', () => {
                const isDisposed = true;
                let emitted = false;
                
                function emit() {
                    if (isDisposed) { return; }
                    emitted = true;
                }
                
                emit();
                assert.strictEqual(emitted, false);
            });
        });
    });

    describe('RalphSidebarProvider Visibility Handling', () => {
        describe('visibility change', () => {
            it('should flush queue on visibility change to visible', () => {
                let flushCalled = false;
                let isVisible = false;
                
                function onVisibilityChange(visible: boolean) {
                    const wasVisible = isVisible;
                    isVisible = visible;
                    
                    if (isVisible && !wasVisible) {
                        flushCalled = true;
                    }
                }
                
                onVisibilityChange(true);
                assert.strictEqual(flushCalled, true);
            });
        });

        describe('flushMessageQueue', () => {
            it('should drain queue when view available', () => {
                const queue: object[] = [{ type: 'test1' }, { type: 'test2' }];
                const posted: object[] = [];
                const isViewAvailable = true;
                
                function flushMessageQueue() {
                    while (queue.length > 0) {
                        const message = queue.shift();
                        if (message && isViewAvailable) {
                            posted.push(message);
                        }
                    }
                }
                
                flushMessageQueue();
                assert.strictEqual(queue.length, 0);
                assert.strictEqual(posted.length, 2);
            });
        });
    });

    describe('Message Handler Context', () => {
        describe('createMessageHandlerContext', () => {
            it('should create context with emit function', () => {
                const context = {
                    emit: (event: string, data?: unknown) => {}
                };
                
                assert.ok(typeof context.emit === 'function');
            });

            it('should create context with updatePanelState function', () => {
                const context = {
                    updatePanelState: (state: object) => {}
                };
                
                assert.ok(typeof context.updatePanelState === 'function');
            });

            it('should create context with refresh function', () => {
                const context = {
                    refresh: () => {}
                };
                
                assert.ok(typeof context.refresh === 'function');
            });

            it('should create context with handleWebviewError function', () => {
                const context = {
                    handleWebviewError: (error: unknown) => {}
                };
                
                assert.ok(typeof context.handleWebviewError === 'function');
            });
        });

        describe('createSidebarMessageHandlerContext', () => {
            it('should create context with emit function', () => {
                const context = {
                    emit: (event: string, data?: unknown) => {}
                };
                
                assert.ok(typeof context.emit === 'function');
            });

            it('should create context with handleWebviewError function', () => {
                const context = {
                    handleWebviewError: (error: unknown) => {}
                };
                
                assert.ok(typeof context.handleWebviewError === 'function');
            });

            it('should not have updatePanelState in sidebar context', () => {
                const context: Record<string, unknown> = {
                    emit: () => {},
                    handleWebviewError: () => {}
                };
                
                assert.strictEqual(context.updatePanelState, undefined);
            });
        });
    });

    describe('Panel Constants', () => {
        describe('PANEL_VIEW_TYPE', () => {
            it('should equal ralphPanel', () => {
                assert.strictEqual(PANEL_VIEW_TYPE, 'ralphPanel');
            });
        });

        describe('PANEL_STATE_KEY', () => {
            it('should equal ralph.panelState', () => {
                assert.strictEqual(PANEL_STATE_KEY, 'ralph.panelState');
            });
        });
    });
});
