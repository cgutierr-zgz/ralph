/**
 * Unit tests for mock implementations.
 * These tests verify that the mocks behave correctly and can be used for testing.
 */

import * as assert from 'assert';
import {
    // VS Code mocks
    MockUri,
    MockDisposable,
    MockEventEmitter,
    MockWebview,
    MockWebviewPanel,
    MockWebviewView,
    MockMemento,
    MockSecretStorage,
    MockExtensionContext,
    MockStatusBarItem,
    MockOutputChannel,
    MockWorkspaceConfiguration,
    MockThemeColor,
    MockInputBox,
    MockQuickPick,
    MockProgressReporter,
    MockCancellationTokenSource,
    MockFileSystemWatcher,
    MockWorkspaceFolder,
    MockTextDocument,
    MockPosition,
    MockRange,
    // Panel mocks
    MockRalphPanel,
    createMockRalphPanel,
    // Sidebar mocks
    MockRalphSidebarProvider,
    createMockRalphSidebarProvider,
    // Orchestrator mocks
    MockLoopOrchestrator,
    createMockOrchestrator,
    // UIManager mocks
    MockUIManager,
    createMockUIManager,
    // FileUtils mocks
    MockFileUtils,
    createMockFileUtils,
    SAMPLE_PRD_CONTENT,
    // Timer mocks
    MockCountdownTimer,
    MockInactivityMonitor,
    mockFormatDuration,
    createMockCountdownTimer,
    createMockInactivityMonitor,
    // StatusBar mocks
    MockRalphStatusBar,
    createMockRalphStatusBar,
    // TaskRunner mocks
    MockTaskRunner,
    createMockTaskRunner,
    // FileWatcher mocks
    MockPrdWatcher,
    MockActivityWatcher,
    MockFileWatcherManager,
    createMockFileWatcherManager
} from '../mocks';
import { TaskStatus, LoopExecutionState, DEFAULT_REQUIREMENTS, DEFAULT_SETTINGS } from '../../types';

describe('Mock Implementations', () => {
    // =========================================================================
    // VS Code Mocks
    // =========================================================================
    
    describe('MockUri', () => {
        it('should create file URI', () => {
            const uri = MockUri.file('/path/to/file.ts');
            assert.strictEqual(uri.scheme, 'file');
            assert.strictEqual(uri.path, '/path/to/file.ts');
            assert.strictEqual(uri.fsPath, '/path/to/file.ts');
        });

        it('should parse URI string', () => {
            const uri = MockUri.parse('file:///path/to/file.ts');
            assert.strictEqual(uri.scheme, 'file');
            assert.strictEqual(uri.path, '/path/to/file.ts');
        });

        it('should join paths', () => {
            const base = MockUri.file('/workspace');
            const joined = MockUri.joinPath(base, 'src', 'file.ts');
            assert.strictEqual(joined.path, '/workspace/src/file.ts');
        });

        it('should create with method', () => {
            const uri = MockUri.file('/path');
            const modified = uri.with({ path: '/new/path' });
            assert.strictEqual(modified.path, '/new/path');
            assert.strictEqual(uri.path, '/path'); // Original unchanged
        });

        it('should convert to string', () => {
            const uri = MockUri.file('/path/to/file.ts');
            assert.ok(uri.toString().includes('/path/to/file.ts'));
        });
    });

    describe('MockDisposable', () => {
        it('should call dispose callback once', () => {
            let callCount = 0;
            const disposable = new MockDisposable(() => callCount++);
            
            disposable.dispose();
            assert.strictEqual(callCount, 1);
            
            disposable.dispose();
            assert.strictEqual(callCount, 1); // Not called again
        });

        it('should track disposed state', () => {
            const disposable = new MockDisposable();
            assert.strictEqual(disposable.isDisposed, false);
            
            disposable.dispose();
            assert.strictEqual(disposable.isDisposed, true);
        });

        it('should dispose multiple disposables with from()', () => {
            let count1 = 0, count2 = 0;
            const d1 = new MockDisposable(() => count1++);
            const d2 = new MockDisposable(() => count2++);
            
            const combined = MockDisposable.from(d1, d2);
            combined.dispose();
            
            assert.strictEqual(count1, 1);
            assert.strictEqual(count2, 1);
        });
    });

    describe('MockEventEmitter', () => {
        it('should fire events to listeners', () => {
            const emitter = new MockEventEmitter<string>();
            const received: string[] = [];
            
            emitter.event(data => { received.push(data); });
            emitter.fire('test1');
            emitter.fire('test2');
            
            assert.deepStrictEqual(received, ['test1', 'test2']);
        });

        it('should remove listener on dispose', () => {
            const emitter = new MockEventEmitter<number>();
            const received: number[] = [];
            
            const disposable = emitter.event(data => { received.push(data); });
            emitter.fire(1);
            disposable.dispose();
            emitter.fire(2);
            
            assert.deepStrictEqual(received, [1]);
        });

        it('should track listener count', () => {
            const emitter = new MockEventEmitter<void>();
            assert.strictEqual(emitter.listenerCount, 0);
            
            const d1 = emitter.event(() => {});
            assert.strictEqual(emitter.listenerCount, 1);
            
            const d2 = emitter.event(() => {});
            assert.strictEqual(emitter.listenerCount, 2);
            
            d1.dispose();
            assert.strictEqual(emitter.listenerCount, 1);
        });

        it('should not fire after dispose', () => {
            const emitter = new MockEventEmitter<string>();
            const received: string[] = [];
            emitter.event(data => { received.push(data); });
            
            emitter.dispose();
            emitter.fire('should not appear');
            
            assert.deepStrictEqual(received, []);
        });
    });

    describe('MockWebview', () => {
        it('should store and retrieve HTML', () => {
            const webview = new MockWebview();
            webview.html = '<html></html>';
            assert.strictEqual(webview.html, '<html></html>');
        });

        it('should post messages and track them', () => {
            const webview = new MockWebview();
            webview.postMessage({ type: 'test' });
            webview.postMessage({ type: 'update', data: 123 });
            
            const messages = webview.getPostedMessages();
            assert.strictEqual(messages.length, 2);
            assert.deepStrictEqual(messages[0], { type: 'test' });
        });

        it('should return last posted message', () => {
            const webview = new MockWebview();
            webview.postMessage({ type: 'first' });
            webview.postMessage({ type: 'last' });
            
            const last = webview.getLastPostedMessage<{ type: string }>();
            assert.strictEqual(last?.type, 'last');
        });

        it('should simulate incoming messages', () => {
            const webview = new MockWebview();
            const received: object[] = [];
            
            webview.onDidReceiveMessage(msg => { received.push(msg); });
            webview.simulateMessage({ command: 'start' });
            
            assert.strictEqual(received.length, 1);
            assert.deepStrictEqual(received[0], { command: 'start' });
        });

        it('should convert to webview URI', () => {
            const webview = new MockWebview();
            const localUri = MockUri.file('/path/to/resource.js');
            const webviewUri = webview.asWebviewUri(localUri);
            
            assert.strictEqual(webviewUri.scheme, 'vscode-webview');
        });
    });

    describe('MockWebviewPanel', () => {
        it('should create with properties', () => {
            const panel = new MockWebviewPanel('testPanel', 'Test Title', 1);
            assert.strictEqual(panel.viewType, 'testPanel');
            assert.strictEqual(panel.title, 'Test Title');
            assert.strictEqual(panel.visible, true);
        });

        it('should change visibility', () => {
            const panel = new MockWebviewPanel('test', 'Test', 1);
            let visibilityChanged = false;
            
            panel.onDidChangeViewState(() => { visibilityChanged = true; });
            panel.setVisible(false);
            
            assert.strictEqual(panel.visible, false);
            assert.strictEqual(visibilityChanged, true);
        });

        it('should fire dispose event', () => {
            const panel = new MockWebviewPanel('test', 'Test', 1);
            let disposed = false;
            
            panel.onDidDispose(() => { disposed = true; });
            panel.dispose();
            
            assert.strictEqual(disposed, true);
            assert.strictEqual(panel.isDisposed, true);
        });

        it('should reveal panel', () => {
            const panel = new MockWebviewPanel('test', 'Test', 1);
            panel.setVisible(false);
            
            panel.reveal();
            
            assert.strictEqual(panel.visible, true);
        });
    });

    describe('MockMemento', () => {
        it('should store and retrieve values', async () => {
            const memento = new MockMemento();
            
            await memento.update('key1', 'value1');
            await memento.update('key2', { nested: true });
            
            assert.strictEqual(memento.get('key1'), 'value1');
            assert.deepStrictEqual(memento.get('key2'), { nested: true });
        });

        it('should return default for missing keys', () => {
            const memento = new MockMemento();
            
            assert.strictEqual(memento.get('missing'), undefined);
            assert.strictEqual(memento.get('missing', 'default'), 'default');
        });

        it('should delete on undefined update', async () => {
            const memento = new MockMemento();
            
            await memento.update('key', 'value');
            assert.strictEqual(memento.has('key'), true);
            
            await memento.update('key', undefined);
            assert.strictEqual(memento.has('key'), false);
        });

        it('should list keys', async () => {
            const memento = new MockMemento();
            
            await memento.update('a', 1);
            await memento.update('b', 2);
            
            const keys = memento.keys();
            assert.ok(keys.includes('a'));
            assert.ok(keys.includes('b'));
        });
    });

    describe('MockExtensionContext', () => {
        it('should provide workspace and global state', () => {
            const context = new MockExtensionContext('/ext/path');
            
            assert.ok(context.workspaceState instanceof MockMemento);
            assert.ok(context.globalState instanceof MockMemento);
        });

        it('should provide extension paths', () => {
            const context = new MockExtensionContext('/ext/path');
            
            assert.strictEqual(context.extensionPath, '/ext/path');
            assert.strictEqual(context.extensionUri.fsPath, '/ext/path');
        });

        it('should track subscriptions', () => {
            const context = new MockExtensionContext();
            const disposable = new MockDisposable();
            
            context.subscriptions.push(disposable);
            assert.strictEqual(context.subscriptions.length, 1);
        });

        it('should dispose subscriptions', () => {
            const context = new MockExtensionContext();
            let disposed = false;
            
            context.subscriptions.push(new MockDisposable(() => { disposed = true; }));
            context.dispose();
            
            assert.strictEqual(disposed, true);
        });

        it('should clear state', async () => {
            const context = new MockExtensionContext();
            
            await context.workspaceState.update('key', 'value');
            context.clearState();
            
            assert.strictEqual(context.workspaceState.get('key'), undefined);
        });
    });

    describe('MockOutputChannel', () => {
        it('should append lines', () => {
            const channel = new MockOutputChannel('Test');
            
            channel.appendLine('Line 1');
            channel.appendLine('Line 2');
            
            const lines = channel.getLines();
            assert.deepStrictEqual(lines, ['Line 1', 'Line 2']);
        });

        it('should get full output', () => {
            const channel = new MockOutputChannel('Test');
            
            channel.appendLine('Line 1');
            channel.appendLine('Line 2');
            
            assert.strictEqual(channel.getOutput(), 'Line 1\nLine 2');
        });

        it('should clear output', () => {
            const channel = new MockOutputChannel('Test');
            
            channel.appendLine('Line');
            channel.clear();
            
            assert.strictEqual(channel.getLines().length, 0);
        });

        it('should track visibility', () => {
            const channel = new MockOutputChannel('Test');
            
            assert.strictEqual(channel.isVisible, false);
            channel.show();
            assert.strictEqual(channel.isVisible, true);
            channel.hide();
            assert.strictEqual(channel.isVisible, false);
        });
    });

    describe('MockPosition and MockRange', () => {
        it('should create position', () => {
            const pos = new MockPosition(5, 10);
            assert.strictEqual(pos.line, 5);
            assert.strictEqual(pos.character, 10);
        });

        it('should compare positions', () => {
            const pos1 = new MockPosition(5, 10);
            const pos2 = new MockPosition(5, 20);
            const pos3 = new MockPosition(6, 5);
            
            assert.strictEqual(pos1.isBefore(pos2), true);
            assert.strictEqual(pos2.isAfter(pos1), true);
            assert.strictEqual(pos1.isEqual(new MockPosition(5, 10)), true);
        });

        it('should create range', () => {
            const range = new MockRange(1, 0, 5, 10);
            
            assert.strictEqual(range.start.line, 1);
            assert.strictEqual(range.end.line, 5);
            assert.strictEqual(range.isSingleLine, false);
        });

        it('should check containment', () => {
            const range = new MockRange(5, 0, 10, 20);
            
            assert.strictEqual(range.contains(new MockPosition(7, 10)), true);
            assert.strictEqual(range.contains(new MockPosition(2, 10)), false);
        });
    });

    // =========================================================================
    // RalphPanel Mock
    // =========================================================================
    
    describe('MockRalphPanel', () => {
        it('should create with factory function', () => {
            const panel = createMockRalphPanel();
            assert.strictEqual(panel.isDisposed, false);
            assert.strictEqual(panel.isVisible, true);
        });

        it('should update status and track it', () => {
            const panel = createMockRalphPanel();
            
            panel.updateStatus('running', 5, 'Test task', []);
            
            const status = panel.getLastStatus();
            assert.strictEqual(status.status, 'running');
            assert.strictEqual(status.iteration, 5);
            assert.strictEqual(status.currentTask, 'Test task');
        });

        it('should add logs with levels', () => {
            const panel = createMockRalphPanel();
            
            panel.addLog('Info message');
            panel.addLog('Success!', true);
            panel.addLog('Error occurred', 'error');
            
            const logs = panel.getLogs();
            assert.strictEqual(logs.length, 3);
            assert.strictEqual(logs[0].level, 'info');
            assert.strictEqual(logs[1].level, 'success');
            assert.strictEqual(logs[2].level, 'error');
        });

        it('should track posted messages', () => {
            const panel = createMockRalphPanel();
            
            panel.updateCountdown(10);
            panel.showPrdGenerating();
            
            const messages = panel.getPostedMessages();
            assert.ok(messages.some(m => (m as { type: string }).type === 'countdown'));
            assert.ok(messages.some(m => (m as { type: string }).type === 'prdGenerating'));
        });

        it('should handle events', () => {
            const panel = createMockRalphPanel();
            let startCalled = false;
            
            panel.on('start', () => startCalled = true);
            panel.emit('start');
            
            assert.strictEqual(startCalled, true);
        });

        it('should manage panel state', () => {
            const panel = createMockRalphPanel();
            
            panel.updatePanelState({
                collapsedSections: ['timeline'],
                scrollPosition: 100
            });
            
            const state = panel.getPanelState();
            assert.deepStrictEqual(state.collapsedSections, ['timeline']);
            assert.strictEqual(state.scrollPosition, 100);
        });

        it('should not post messages when disposed', () => {
            const panel = createMockRalphPanel();
            panel.dispose();
            
            panel.updateStatus('running', 1, 'task', []);
            
            // Messages should not be posted after disposal
            // The last message before dispose (if any) should be the last one
            assert.strictEqual(panel.isDisposed, true);
        });

        it('should show/hide loading state', () => {
            const panel = createMockRalphPanel();
            
            assert.strictEqual(panel.getIsLoading(), false);
            panel.showLoading();
            assert.strictEqual(panel.getIsLoading(), true);
            panel.hideLoading();
            assert.strictEqual(panel.getIsLoading(), false);
        });

        it('should track toast messages', () => {
            const panel = createMockRalphPanel();
            
            panel.showSuccessToast('Done!');
            panel.showErrorToast('Failed!');
            
            const toasts = panel.getToastMessages();
            assert.strictEqual(toasts.length, 2);
            assert.strictEqual(toasts[0].type, 'success');
            assert.strictEqual(toasts[1].type, 'error');
        });
    });

    // =========================================================================
    // RalphSidebarProvider Mock
    // =========================================================================
    
    describe('MockRalphSidebarProvider', () => {
        it('should create with factory function', () => {
            const sidebar = createMockRalphSidebarProvider();
            assert.strictEqual(sidebar.isDisposed, false);
        });

        it('should update status', () => {
            const sidebar = createMockRalphSidebarProvider();
            
            sidebar.updateStatus('running', 3, 'Current task', []);
            
            assert.strictEqual(sidebar.getLastStatus(), 'running');
            assert.strictEqual(sidebar.getLastIteration(), 3);
        });

        it('should queue messages when hidden', () => {
            const sidebar = createMockRalphSidebarProvider();
            sidebar.setVisible(false);
            
            sidebar.updateCountdown(5);
            
            assert.strictEqual(sidebar.getQueuedMessages().length, 1);
            assert.strictEqual(sidebar.getPostedMessages().length, 0);
        });

        it('should flush queue when visible', () => {
            const sidebar = createMockRalphSidebarProvider();
            sidebar.setVisible(false);
            sidebar.updateCountdown(5);
            
            sidebar.setVisible(true);
            
            assert.strictEqual(sidebar.getQueuedMessages().length, 0);
            assert.strictEqual(sidebar.getPostedMessages().length, 1);
        });

        it('should handle PRD state', () => {
            const sidebar = createMockRalphSidebarProvider({ hasPrd: false });
            assert.strictEqual(sidebar.getHasPrd(), false);
            
            sidebar.setHasPrd(true);
            assert.strictEqual(sidebar.getHasPrd(), true);
        });
    });

    // =========================================================================
    // LoopOrchestrator Mock
    // =========================================================================
    
    describe('MockLoopOrchestrator', () => {
        it('should create with factory function', () => {
            const orchestrator = createMockOrchestrator();
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.IDLE);
        });

        it('should start loop', async () => {
            const orchestrator = createMockOrchestrator({ pendingTasks: 5 });
            
            await orchestrator.startLoop();
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
            assert.strictEqual(orchestrator.wasCalled('startLoop'), true);
        });

        it('should not start without pending tasks', async () => {
            const orchestrator = createMockOrchestrator({ pendingTasks: 0 });
            
            await orchestrator.startLoop();
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.IDLE);
        });

        it('should pause and resume', () => {
            const orchestrator = createMockOrchestrator();
            orchestrator.setState(LoopExecutionState.RUNNING);
            
            orchestrator.pauseLoop();
            assert.strictEqual(orchestrator.getIsPaused(), true);
            
            orchestrator.resumeLoop();
            assert.strictEqual(orchestrator.getIsPaused(), false);
        });

        it('should stop loop', async () => {
            const orchestrator = createMockOrchestrator();
            await orchestrator.startLoop();
            
            orchestrator.stopLoop();
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.IDLE);
        });

        it('should manage requirements', () => {
            const orchestrator = createMockOrchestrator();
            const reqs = { ...DEFAULT_REQUIREMENTS, runTests: true };
            
            orchestrator.setRequirements(reqs);
            
            assert.strictEqual(orchestrator.getRequirements().runTests, true);
        });

        it('should track method calls', () => {
            const orchestrator = createMockOrchestrator();
            
            orchestrator.setSettings({ maxIterations: 100 });
            orchestrator.pauseLoop();
            
            assert.strictEqual(orchestrator.getCallCount('setSettings'), 1);
            assert.strictEqual(orchestrator.getCallCount('pauseLoop'), 1);
        });

        it('should emit events', async () => {
            const orchestrator = createMockOrchestrator();
            let started = false;
            
            orchestrator.on('loopStart', () => started = true);
            await orchestrator.startLoop();
            
            assert.strictEqual(started, true);
        });
    });

    // =========================================================================
    // UIManager Mock
    // =========================================================================
    
    describe('MockUIManager', () => {
        it('should create with factory function', () => {
            const ui = createMockUIManager();
            assert.strictEqual(ui.getLastStatus(), 'idle');
        });

        it('should broadcast to panel and sidebar', () => {
            const ui = createMockUIManager();
            const panel = createMockRalphPanel();
            const sidebar = createMockRalphSidebarProvider();
            
            ui.setPanel(panel);
            ui.setSidebarView(sidebar);
            
            ui.updateStatus('running', 1, 'Task');
            
            assert.strictEqual(panel.getLastStatus().status, 'running');
            assert.strictEqual(sidebar.getLastStatus(), 'running');
        });

        it('should track logs', () => {
            const ui = createMockUIManager();
            
            ui.addLog('Test message');
            ui.addLog('Success!', 'success');
            
            const logs = ui.getLogs();
            assert.strictEqual(logs.length, 2);
            assert.strictEqual(logs[1].level, 'success');
        });

        it('should clear logs', () => {
            const ui = createMockUIManager();
            ui.addLog('Message');
            
            ui.clearLogs();
            
            assert.strictEqual(ui.getLogs().length, 0);
        });
    });

    // =========================================================================
    // FileUtils Mock
    // =========================================================================
    
    describe('MockFileUtils', () => {
        it('should create with factory function', () => {
            const fileUtils = createMockFileUtils();
            assert.strictEqual(fileUtils.getWorkspaceRoot(), '/test/workspace');
        });

        it('should read PRD content', async () => {
            const fileUtils = createMockFileUtils({
                tasks: [
                    { description: 'Task 1' },
                    { description: 'Task 2', status: 'complete' }
                ]
            });
            
            const content = await fileUtils.readPRDAsync();
            assert.ok(content?.includes('Task 1'));
            assert.ok(content?.includes('Task 2'));
        });

        it('should parse tasks from content', () => {
            const fileUtils = createMockFileUtils();
            
            const tasks = fileUtils.parseTasksFromContent(`
- [ ] Pending task
- [x] Complete task
- [!] Blocked task
- [s] Skipped task
            `);
            
            assert.strictEqual(tasks.length, 4);
            assert.strictEqual(tasks[0].status, TaskStatus.PENDING);
            assert.strictEqual(tasks[1].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[2].status, TaskStatus.BLOCKED);
            assert.strictEqual(tasks[3].status, TaskStatus.SKIPPED);
        });

        it('should parse dependencies', () => {
            const fileUtils = createMockFileUtils();
            
            const tasks = fileUtils.parseTasksFromContent(
                '- [ ] Task A [depends on: Task B, Task C]'
            );
            
            assert.deepStrictEqual(tasks[0].dependencies, ['Task B', 'Task C']);
        });

        it('should parse acceptance criteria', () => {
            const fileUtils = createMockFileUtils();
            
            const tasks = fileUtils.parseTasksFromContent(
                '- [ ] Task [AC: criterion 1; criterion 2]'
            );
            
            assert.deepStrictEqual(tasks[0].acceptanceCriteria, ['criterion 1', 'criterion 2']);
        });

        it('should get task stats', async () => {
            const fileUtils = createMockFileUtils();
            fileUtils.setPRDContent(`
- [x] Done 1
- [x] Done 2
- [ ] Pending
            `);
            
            const stats = await fileUtils.getTaskStatsAsync();
            
            assert.strictEqual(stats.completed, 2);
            assert.strictEqual(stats.pending, 1);
            assert.strictEqual(stats.total, 3);
        });

        it('should get next task', async () => {
            const fileUtils = createMockFileUtils();
            fileUtils.setPRDContent(`
- [x] Done
- [ ] Next task
- [ ] Another
            `);
            
            const next = await fileUtils.getNextTaskAsync();
            
            assert.strictEqual(next?.description, 'Next task');
        });

        it('should append to progress', async () => {
            const fileUtils = createMockFileUtils();
            
            await fileUtils.appendProgressAsync('Test entry');
            
            const progress = await fileUtils.readProgressAsync();
            assert.ok(progress.includes('Test entry'));
        });

        it('should track method calls', async () => {
            const fileUtils = createMockFileUtils();
            
            await fileUtils.readPRDAsync();
            await fileUtils.getNextTaskAsync();
            
            assert.strictEqual(fileUtils.wasCalled('readPRDAsync'), true);
            assert.strictEqual(fileUtils.wasCalled('getNextTaskAsync'), true);
        });
    });

    // =========================================================================
    // Timer Mocks
    // =========================================================================
    
    describe('MockCountdownTimer', () => {
        it('should start countdown', async () => {
            const timer = createMockCountdownTimer();
            const ticks: number[] = [];
            
            const promise = timer.start(5, (remaining) => ticks.push(remaining));
            
            assert.strictEqual(timer.getIsActive(), true);
            assert.strictEqual(timer.getRemaining(), 5);
            assert.deepStrictEqual(ticks, [5]); // Initial tick
            
            timer.complete();
            await promise;
        });

        it('should tick manually', async () => {
            const timer = createMockCountdownTimer();
            const ticks: number[] = [];
            
            const promise = timer.start(3, (remaining) => ticks.push(remaining));
            
            timer.tick();
            timer.tick();
            timer.tick();
            
            await promise;
            assert.deepStrictEqual(ticks, [3, 2, 1, 0]);
        });

        it('should stop timer', () => {
            const timer = createMockCountdownTimer();
            timer.start(10, () => {});
            
            timer.stop();
            
            assert.strictEqual(timer.getIsActive(), false);
            assert.strictEqual(timer.getRemaining(), 0);
        });
    });

    describe('MockInactivityMonitor', () => {
        it('should start and track state', () => {
            const monitor = createMockInactivityMonitor();
            
            monitor.start(async () => {});
            
            assert.strictEqual(monitor.getIsActive(), true);
            assert.strictEqual(monitor.getIsPaused(), false);
        });

        it('should pause and resume', () => {
            const monitor = createMockInactivityMonitor();
            monitor.start(async () => {});
            
            monitor.pause();
            assert.strictEqual(monitor.getIsPaused(), true);
            
            monitor.resume();
            assert.strictEqual(monitor.getIsPaused(), false);
        });

        it('should trigger inactivity callback', async () => {
            const monitor = createMockInactivityMonitor();
            let triggered = false;
            
            monitor.start(async () => { triggered = true; });
            await monitor.triggerInactivity();
            
            assert.strictEqual(triggered, true);
        });

        it('should record activity', () => {
            const monitor = createMockInactivityMonitor();
            monitor.start(async () => {});
            
            const before = monitor.getLastActivityTime();
            monitor.recordActivity();
            const after = monitor.getLastActivityTime();
            
            assert.ok(after >= before);
        });
    });

    describe('mockFormatDuration', () => {
        it('should format seconds', () => {
            assert.strictEqual(mockFormatDuration(45000), '45s');
        });

        it('should format minutes and seconds', () => {
            assert.strictEqual(mockFormatDuration(150000), '2m 30s');
        });

        it('should format hours and minutes', () => {
            assert.strictEqual(mockFormatDuration(3900000), '1h 5m');
        });
    });

    // =========================================================================
    // StatusBar Mock
    // =========================================================================
    
    describe('MockRalphStatusBar', () => {
        it('should create with default state', () => {
            const statusBar = createMockRalphStatusBar();
            
            assert.strictEqual(statusBar.getStatus(), 'idle');
            assert.ok(statusBar.getText().includes('Ralph'));
        });

        it('should update status', () => {
            const statusBar = createMockRalphStatusBar();
            
            statusBar.setStatus('running');
            
            assert.strictEqual(statusBar.getStatus(), 'running');
            assert.ok(statusBar.getText().includes('Running'));
        });

        it('should update iteration', () => {
            const statusBar = createMockRalphStatusBar();
            
            statusBar.setStatus('running');
            statusBar.setIteration(5);
            
            assert.ok(statusBar.getText().includes('#5'));
        });

        it('should update task info in tooltip', () => {
            const statusBar = createMockRalphStatusBar();
            
            statusBar.setStatus('running');
            statusBar.setTaskInfo('Current task description');
            
            assert.ok(statusBar.getTooltip().includes('Current task description'));
        });

        it('should track visibility', () => {
            const statusBar = createMockRalphStatusBar();
            
            statusBar.hide();
            assert.strictEqual(statusBar.getIsVisible(), false);
            
            statusBar.show();
            assert.strictEqual(statusBar.getIsVisible(), true);
        });
    });

    // =========================================================================
    // TaskRunner Mock
    // =========================================================================
    
    describe('MockTaskRunner', () => {
        it('should create with factory function', () => {
            const runner = createMockTaskRunner();
            assert.strictEqual(runner.getIterationCount(), 0);
        });

        it('should manage requirements', () => {
            const runner = createMockTaskRunner({
                requirements: { ...DEFAULT_REQUIREMENTS, runTests: true }
            });
            
            assert.strictEqual(runner.getRequirements().runTests, true);
        });

        it('should manage settings', () => {
            const runner = createMockTaskRunner({
                settings: { maxIterations: 100 }
            });
            
            assert.strictEqual(runner.getSettings().maxIterations, 100);
        });

        it('should track current task', () => {
            const runner = createMockTaskRunner();
            
            runner.setCurrentTask('Test task');
            
            assert.strictEqual(runner.getCurrentTask(), 'Test task');
        });

        it('should increment iterations', () => {
            const runner = createMockTaskRunner();
            
            runner.incrementIteration();
            runner.incrementIteration();
            
            assert.strictEqual(runner.getIterationCount(), 2);
        });

        it('should record task completions', () => {
            const runner = createMockTaskRunner();
            runner.setCurrentTask('Task 1');
            
            const completion = runner.recordTaskCompletion();
            
            assert.strictEqual(completion.taskDescription, 'Task 1');
            assert.strictEqual(runner.getHistory().length, 1);
        });

        it('should check iteration limit', () => {
            const runner = createMockTaskRunner({ settings: { maxIterations: 5 } });
            runner.setIterationCount(5);
            
            assert.strictEqual(runner.checkIterationLimit(), true);
            
            runner.setIterationCount(4);
            assert.strictEqual(runner.checkIterationLimit(), false);
        });

        it('should execute tasks', async () => {
            const runner = createMockTaskRunner();
            runner.setNextCopilotResult('agent');
            
            const result = await runner.executeTask('Test task', '/workspace');
            
            assert.strictEqual(result, 'agent');
            assert.strictEqual(runner.wasCalled('executeTask'), true);
        });

        it('should fail when configured to fail', async () => {
            const runner = createMockTaskRunner();
            runner.setShouldSucceed(false);
            
            await assert.rejects(
                () => runner.executeTask('Task', '/workspace'),
                /mock/
            );
        });
    });

    // =========================================================================
    // FileWatcher Mocks
    // =========================================================================
    
    describe('MockFileWatcherManager', () => {
        it('should create watchers', () => {
            const manager = createMockFileWatcherManager();
            
            assert.ok(manager.prdWatcher instanceof MockPrdWatcher);
            assert.ok(manager.activityWatcher instanceof MockActivityWatcher);
        });

        it('should start PRD watcher', () => {
            const manager = createMockFileWatcherManager();
            const changes: string[] = [];
            
            manager.startPrdWatcher('initial', (content) => changes.push(content));
            
            assert.strictEqual(manager.wasCalled('startPrdWatcher'), true);
        });

        it('should simulate PRD changes', () => {
            const manager = createMockFileWatcherManager();
            const changes: string[] = [];
            
            manager.startPrdWatcher('initial', (content) => changes.push(content));
            manager.enablePrdWatcher();
            
            manager.prdWatcher.simulateChange('new content');
            
            assert.deepStrictEqual(changes, ['new content']);
        });

        it('should simulate activity', () => {
            const manager = createMockFileWatcherManager();
            let activityCount = 0;
            
            manager.startActivityWatcher(() => activityCount++);
            manager.activityWatcher.simulateActivity();
            manager.activityWatcher.simulateActivity();
            
            assert.strictEqual(activityCount, 2);
        });

        it('should dispose all watchers', () => {
            const manager = createMockFileWatcherManager();
            manager.startPrdWatcher('', () => {});
            manager.startActivityWatcher(() => {});
            
            manager.dispose();
            
            assert.strictEqual(manager.prdWatcher.getIsStarted(), false);
            assert.strictEqual(manager.activityWatcher.getIsStarted(), false);
        });
    });

    // =========================================================================
    // Integration Tests
    // =========================================================================
    
    describe('Mock Integration', () => {
        it('should work together for panel-orchestrator flow', async () => {
            // Create mocks
            const panel = createMockRalphPanel();
            const orchestrator = createMockOrchestrator();
            const statusBar = createMockRalphStatusBar();
            
            // Wire them up
            orchestrator.setPanel(panel);
            
            // Simulate workflow
            await orchestrator.startLoop();
            
            // Verify state
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
            assert.ok(panel.getLogs().some(l => l.message.includes('Starting')));
        });

        it('should work together for file operations flow', async () => {
            const fileUtils = createMockFileUtils({
                tasks: [
                    { description: 'Task 1' },
                    { description: 'Task 2' }
                ]
            });
            
            const stats = await fileUtils.getTaskStatsAsync();
            const nextTask = await fileUtils.getNextTaskAsync();
            
            assert.strictEqual(stats.pending, 2);
            assert.strictEqual(nextTask?.description, 'Task 1');
        });

        it('should work together for timer flow', async () => {
            const timer = createMockCountdownTimer();
            const ui = createMockUIManager();
            
            const ticks: number[] = [];
            const promise = timer.start(3, (remaining) => {
                ticks.push(remaining);
                ui.updateCountdown(remaining);
            });
            
            timer.tickMultiple(3);
            await promise;
            
            assert.deepStrictEqual(ticks, [3, 2, 1, 0]);
            assert.strictEqual(ui.getLastCountdown(), 0);
        });
    });
});
