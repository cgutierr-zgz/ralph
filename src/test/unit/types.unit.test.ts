import * as assert from 'assert';
import {
    LoopExecutionState,
    TaskStatus,
    DEFAULT_CONFIG,
    DEFAULT_REQUIREMENTS,
    DEFAULT_SETTINGS,
    REVIEW_COUNTDOWN_SECONDS,
    INACTIVITY_TIMEOUT_MS,
    INACTIVITY_CHECK_INTERVAL_MS,
    WebviewError,
    PanelState,
    DEFAULT_PANEL_STATE,
    IRalphUI,
    LogLevel
} from '../../types';

describe('Types', () => {
    describe('LoopExecutionState enum', () => {
        it('should have IDLE state', () => {
            assert.strictEqual(LoopExecutionState.IDLE, 'IDLE');
        });

        it('should have RUNNING state', () => {
            assert.strictEqual(LoopExecutionState.RUNNING, 'RUNNING');
        });
    });

    describe('TaskStatus enum', () => {
        it('should have PENDING status', () => {
            assert.strictEqual(TaskStatus.PENDING, 'PENDING');
        });

        it('should have IN_PROGRESS status', () => {
            assert.strictEqual(TaskStatus.IN_PROGRESS, 'IN_PROGRESS');
        });

        it('should have COMPLETE status', () => {
            assert.strictEqual(TaskStatus.COMPLETE, 'COMPLETE');
        });

        it('should have BLOCKED status', () => {
            assert.strictEqual(TaskStatus.BLOCKED, 'BLOCKED');
        });
    });

    describe('DEFAULT_CONFIG', () => {
        it('should have default PRD path', () => {
            assert.strictEqual(DEFAULT_CONFIG.files.prdPath, 'PRD.md');
        });

        it('should have default progress path', () => {
            assert.strictEqual(DEFAULT_CONFIG.files.progressPath, 'progress.txt');
        });

        it('should have files object', () => {
            assert.ok(DEFAULT_CONFIG.files);
            assert.ok(typeof DEFAULT_CONFIG.files === 'object');
        });

        it('should have prompt object', () => {
            assert.ok(DEFAULT_CONFIG.prompt);
            assert.ok(typeof DEFAULT_CONFIG.prompt === 'object');
        });

        it('should have empty customTemplate by default', () => {
            assert.strictEqual(DEFAULT_CONFIG.prompt.customTemplate, '');
        });

        it('should have empty customPrdGenerationTemplate by default', () => {
            assert.strictEqual(DEFAULT_CONFIG.prompt.customPrdGenerationTemplate, '');
        });
    });

    describe('DEFAULT_REQUIREMENTS', () => {
        it('should have runTests set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.runTests, false);
        });

        it('should have runLinting set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.runLinting, false);
        });

        it('should have runTypeCheck set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.runTypeCheck, false);
        });

        it('should have writeTests set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.writeTests, false);
        });

        it('should have updateDocs set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.updateDocs, false);
        });

        it('should have commitChanges set to false', () => {
            assert.strictEqual(DEFAULT_REQUIREMENTS.commitChanges, false);
        });

        it('should have all expected properties', () => {
            const expectedKeys = ['runTests', 'runLinting', 'runTypeCheck', 'writeTests', 'updateDocs', 'commitChanges'];
            const actualKeys = Object.keys(DEFAULT_REQUIREMENTS);
            expectedKeys.forEach(key => {
                assert.ok(actualKeys.includes(key), `Missing property: ${key}`);
            });
        });
    });

    describe('DEFAULT_SETTINGS', () => {
        it('should have maxIterations set to 50', () => {
            assert.strictEqual(DEFAULT_SETTINGS.maxIterations, 50);
        });
    });

    describe('Constants', () => {
        it('REVIEW_COUNTDOWN_SECONDS should be 12', () => {
            assert.strictEqual(REVIEW_COUNTDOWN_SECONDS, 12);
        });

        it('INACTIVITY_TIMEOUT_MS should be 60000 (60 seconds)', () => {
            assert.strictEqual(INACTIVITY_TIMEOUT_MS, 60_000);
        });

        it('INACTIVITY_CHECK_INTERVAL_MS should be 10000 (10 seconds)', () => {
            assert.strictEqual(INACTIVITY_CHECK_INTERVAL_MS, 10_000);
        });
    });

    describe('WebviewError interface', () => {
        it('should allow creating a valid WebviewError object', () => {
            const error: WebviewError = {
                message: 'Test error',
                source: 'test.js',
                lineno: 10,
                colno: 5
            };
            assert.strictEqual(error.message, 'Test error');
            assert.strictEqual(error.source, 'test.js');
            assert.strictEqual(error.lineno, 10);
            assert.strictEqual(error.colno, 5);
        });

        it('should allow optional stack property', () => {
            const errorWithStack: WebviewError = {
                message: 'Test error',
                source: 'test.js',
                lineno: 10,
                colno: 5,
                stack: 'Error: Test error\n    at test.js:10:5'
            };
            assert.strictEqual(errorWithStack.stack, 'Error: Test error\n    at test.js:10:5');
        });

        it('should allow undefined stack property', () => {
            const errorWithoutStack: WebviewError = {
                message: 'Test error',
                source: 'test.js',
                lineno: 10,
                colno: 5
            };
            assert.strictEqual(errorWithoutStack.stack, undefined);
        });
    });

    describe('PanelState interface', () => {
        it('should allow creating a valid PanelState object', () => {
            const state: PanelState = {
                collapsedSections: ['reqContent'],
                scrollPosition: 100,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.deepStrictEqual(state.collapsedSections, ['reqContent']);
            assert.strictEqual(state.scrollPosition, 100);
        });

        it('should allow empty collapsedSections array', () => {
            const state: PanelState = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.deepStrictEqual(state.collapsedSections, []);
        });

        it('should allow multiple collapsed sections', () => {
            const state: PanelState = {
                collapsedSections: ['section1', 'section2', 'section3'],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(state.collapsedSections.length, 3);
        });

        it('should allow zero scroll position', () => {
            const state: PanelState = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(state.scrollPosition, 0);
        });

        it('should allow positive scroll position', () => {
            const state: PanelState = {
                collapsedSections: [],
                scrollPosition: 500,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(state.scrollPosition, 500);
        });

        it('should allow custom requirements', () => {
            const state: PanelState = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: {
                    runTests: true,
                    runLinting: true,
                    runTypeCheck: false,
                    writeTests: true,
                    updateDocs: false,
                    commitChanges: false
                }
            };
            assert.strictEqual(state.requirements.runTests, true);
            assert.strictEqual(state.requirements.runLinting, true);
            assert.strictEqual(state.requirements.writeTests, true);
        });
    });

    describe('DEFAULT_PANEL_STATE', () => {
        it('should have empty collapsedSections', () => {
            assert.deepStrictEqual(DEFAULT_PANEL_STATE.collapsedSections, []);
        });

        it('should have zero scrollPosition', () => {
            assert.strictEqual(DEFAULT_PANEL_STATE.scrollPosition, 0);
        });

        it('should have default requirements', () => {
            assert.deepStrictEqual(DEFAULT_PANEL_STATE.requirements, DEFAULT_REQUIREMENTS);
        });

        it('should have all expected properties', () => {
            const expectedProperties = ['collapsedSections', 'scrollPosition', 'requirements'];
            const actualKeys = Object.keys(DEFAULT_PANEL_STATE);
            expectedProperties.forEach(key => {
                assert.ok(actualKeys.includes(key), `Missing property: ${key}`);
            });
        });
    });

    describe('IRalphUI interface', () => {
        it('should require hidePrdGenerating method', () => {
            // Create a mock that implements IRalphUI
            const mockUI: IRalphUI = {
                updateStatus: () => {},
                updateCountdown: () => {},
                updateHistory: () => {},
                updateSessionTiming: () => {},
                updateStats: () => {},
                refresh: () => {},
                addLog: () => {},
                showPrdGenerating: () => {},
                hidePrdGenerating: () => {}
            };
            
            // Verify the method exists
            assert.strictEqual(typeof mockUI.hidePrdGenerating, 'function');
        });

        it('should have all required methods', () => {
            const requiredMethods = [
                'updateStatus',
                'updateCountdown',
                'updateHistory',
                'updateSessionTiming',
                'updateStats',
                'refresh',
                'addLog',
                'showPrdGenerating',
                'hidePrdGenerating'
            ];
            
            const mockUI: IRalphUI = {
                updateStatus: () => {},
                updateCountdown: () => {},
                updateHistory: () => {},
                updateSessionTiming: () => {},
                updateStats: () => {},
                refresh: () => {},
                addLog: () => {},
                showPrdGenerating: () => {},
                hidePrdGenerating: () => {}
            };
            
            requiredMethods.forEach(method => {
                assert.strictEqual(typeof (mockUI as unknown as Record<string, unknown>)[method], 'function', `Method ${method} should exist`);
            });
        });

        it('should accept LogLevel as second parameter in addLog', () => {
            const mockUI: IRalphUI = {
                updateStatus: () => {},
                updateCountdown: () => {},
                updateHistory: () => {},
                updateSessionTiming: () => {},
                updateStats: () => {},
                refresh: () => {},
                addLog: (_message: string, _highlightOrLevel?: boolean | LogLevel) => {},
                showPrdGenerating: () => {},
                hidePrdGenerating: () => {}
            };
            
            // Test that addLog can be called with LogLevel
            mockUI.addLog('test message', 'info');
            mockUI.addLog('test message', 'warning');
            mockUI.addLog('test message', 'error');
            mockUI.addLog('test message', 'success');
            mockUI.addLog('test message', true); // legacy boolean
            mockUI.addLog('test message'); // no second param
            
            assert.ok(true, 'addLog should accept all LogLevel types');
        });
    });

    describe('LogLevel type', () => {
        it('should accept info level', () => {
            const level: LogLevel = 'info';
            assert.strictEqual(level, 'info');
        });

        it('should accept warning level', () => {
            const level: LogLevel = 'warning';
            assert.strictEqual(level, 'warning');
        });

        it('should accept error level', () => {
            const level: LogLevel = 'error';
            assert.strictEqual(level, 'error');
        });

        it('should accept success level', () => {
            const level: LogLevel = 'success';
            assert.strictEqual(level, 'success');
        });
    });
});

// Import discriminated union types for testing
import {
    // Command constants
    CONTROL_COMMANDS,
    TASK_COMMANDS,
    PRD_COMMANDS,
    EXPORT_COMMANDS,
    STATE_COMMANDS,
    PROJECT_COMMANDS,
    ALL_INCOMING_COMMANDS,
    OUTGOING_MESSAGE_TYPES,
    // Type aliases
    ControlCommandType,
    TaskCommandType,
    PrdCommandType,
    ExportCommandType,
    StateCommandType,
    IncomingCommandType,
    OutgoingMessageType,
    // Individual message types
    StartMessage,
    StopMessage,
    PauseMessage,
    ResumeMessage,
    NextMessage,
    RefreshMessage,
    SkipTaskMessage,
    RetryTaskMessage,
    CompleteAllTasksMessage,
    ResetAllTasksMessage,
    ReorderTasksMessage,
    GeneratePrdMessage,
    RequirementsChangedMessage,
    SettingsChangedMessage,
    ExportDataMessage,
    ExportLogMessage,
    PanelStateChangedMessage,
    WebviewErrorMessage,
    OpenPanelMessage,
    // Union types
    ControlMessage,
    TaskMessage,
    PrdMessage,
    ExportMessage,
    StateMessage,
    IncomingWebviewMessage,
    // Outgoing message types
    UpdateMessage,
    CountdownMessage,
    HistoryMessage,
    TimingMessage,
    StatsMessage,
    LogMessage,
    PrdGeneratingMessage,
    PrdCompleteMessage,
    ToastType,
    ToastMessage,
    LoadingMessage,
    ErrorMessage,
    OutgoingExtensionMessage,
    // Type guards
    isIncomingWebviewMessage,
    isOutgoingExtensionMessage,
    isControlMessage,
    isTaskMessage,
    isPrdMessage,
    isExportMessage,
    isStateMessage,
    BaseWebviewMessage
} from '../../messageHandlers/types';

describe('Discriminated Union Message Types', () => {
    // ========================================================================
    // Command Constants Tests
    // ========================================================================
    
    describe('Command Constants', () => {
        describe('CONTROL_COMMANDS', () => {
            it('should contain all control commands', () => {
                assert.deepStrictEqual(CONTROL_COMMANDS, ['start', 'stop', 'pause', 'resume', 'next', 'refresh']);
            });

            it('should be a readonly array', () => {
                assert.strictEqual(CONTROL_COMMANDS.length, 6);
            });

            it('should include start command', () => {
                assert.ok(CONTROL_COMMANDS.includes('start'));
            });

            it('should include stop command', () => {
                assert.ok(CONTROL_COMMANDS.includes('stop'));
            });

            it('should include pause command', () => {
                assert.ok(CONTROL_COMMANDS.includes('pause'));
            });

            it('should include resume command', () => {
                assert.ok(CONTROL_COMMANDS.includes('resume'));
            });

            it('should include next command', () => {
                assert.ok(CONTROL_COMMANDS.includes('next'));
            });

            it('should include refresh command', () => {
                assert.ok(CONTROL_COMMANDS.includes('refresh'));
            });
        });

        describe('TASK_COMMANDS', () => {
            it('should contain all task commands', () => {
                assert.deepStrictEqual(TASK_COMMANDS, ['skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'reorderTasks']);
            });

            it('should have 5 task commands', () => {
                assert.strictEqual(TASK_COMMANDS.length, 5);
            });
        });

        describe('PRD_COMMANDS', () => {
            it('should contain all PRD commands', () => {
                assert.deepStrictEqual(PRD_COMMANDS, ['generatePrd', 'requirementsChanged', 'settingsChanged']);
            });

            it('should have 3 PRD commands', () => {
                assert.strictEqual(PRD_COMMANDS.length, 3);
            });
        });

        describe('EXPORT_COMMANDS', () => {
            it('should contain all export commands', () => {
                assert.deepStrictEqual(EXPORT_COMMANDS, ['exportData', 'exportLog']);
            });

            it('should have 2 export commands', () => {
                assert.strictEqual(EXPORT_COMMANDS.length, 2);
            });
        });

        describe('STATE_COMMANDS', () => {
            it('should contain all state commands', () => {
                assert.deepStrictEqual(STATE_COMMANDS, ['panelStateChanged', 'webviewError', 'openPanel', 'refreshHistory', 'refreshSessionStats']);
            });

            it('should have 5 state commands', () => {
                assert.strictEqual(STATE_COMMANDS.length, 5);
            });
        });

        describe('ALL_INCOMING_COMMANDS', () => {
            it('should contain all commands from all categories', () => {
                assert.strictEqual(ALL_INCOMING_COMMANDS.length, 
                    CONTROL_COMMANDS.length + 
                    TASK_COMMANDS.length + 
                    PRD_COMMANDS.length + 
                    EXPORT_COMMANDS.length + 
                    STATE_COMMANDS.length +
                    PROJECT_COMMANDS.length
                );
            });

            it('should include all control commands', () => {
                CONTROL_COMMANDS.forEach(cmd => {
                    assert.ok((ALL_INCOMING_COMMANDS as readonly string[]).includes(cmd), `Missing control command: ${cmd}`);
                });
            });

            it('should include all task commands', () => {
                TASK_COMMANDS.forEach(cmd => {
                    assert.ok((ALL_INCOMING_COMMANDS as readonly string[]).includes(cmd), `Missing task command: ${cmd}`);
                });
            });

            it('should have 22 total commands', () => {
                assert.strictEqual(ALL_INCOMING_COMMANDS.length, 22);
            });
        });

        describe('OUTGOING_MESSAGE_TYPES', () => {
            it('should contain all outgoing message types', () => {
                assert.deepStrictEqual(OUTGOING_MESSAGE_TYPES, [
                    'update',
                    'countdown',
                    'history',
                    'timing',
                    'stats',
                    'log',
                    'prdGenerating',
                    'prdComplete',
                    'toast',
                    'loading',
                    'error'
                ]);
            });

            it('should have 11 outgoing message types', () => {
                assert.strictEqual(OUTGOING_MESSAGE_TYPES.length, 11);
            });
        });
    });

    // ========================================================================
    // Incoming Message Type Tests
    // ========================================================================

    describe('Incoming Message Types', () => {
        describe('Control Messages', () => {
            it('should create valid StartMessage', () => {
                const msg: StartMessage = { command: 'start' };
                assert.strictEqual(msg.command, 'start');
            });

            it('should create valid StopMessage', () => {
                const msg: StopMessage = { command: 'stop' };
                assert.strictEqual(msg.command, 'stop');
            });

            it('should create valid PauseMessage', () => {
                const msg: PauseMessage = { command: 'pause' };
                assert.strictEqual(msg.command, 'pause');
            });

            it('should create valid ResumeMessage', () => {
                const msg: ResumeMessage = { command: 'resume' };
                assert.strictEqual(msg.command, 'resume');
            });

            it('should create valid NextMessage', () => {
                const msg: NextMessage = { command: 'next' };
                assert.strictEqual(msg.command, 'next');
            });

            it('should create valid RefreshMessage', () => {
                const msg: RefreshMessage = { command: 'refresh' };
                assert.strictEqual(msg.command, 'refresh');
            });

            it('should allow ControlMessage union type', () => {
                const msgs: ControlMessage[] = [
                    { command: 'start' },
                    { command: 'stop' },
                    { command: 'pause' },
                    { command: 'resume' },
                    { command: 'next' },
                    { command: 'refresh' }
                ];
                assert.strictEqual(msgs.length, 6);
            });
        });

        describe('Task Messages', () => {
            it('should create valid SkipTaskMessage', () => {
                const msg: SkipTaskMessage = { command: 'skipTask' };
                assert.strictEqual(msg.command, 'skipTask');
            });

            it('should create valid RetryTaskMessage', () => {
                const msg: RetryTaskMessage = { command: 'retryTask' };
                assert.strictEqual(msg.command, 'retryTask');
            });

            it('should create valid CompleteAllTasksMessage', () => {
                const msg: CompleteAllTasksMessage = { command: 'completeAllTasks' };
                assert.strictEqual(msg.command, 'completeAllTasks');
            });

            it('should create valid ResetAllTasksMessage', () => {
                const msg: ResetAllTasksMessage = { command: 'resetAllTasks' };
                assert.strictEqual(msg.command, 'resetAllTasks');
            });

            it('should create valid ReorderTasksMessage with taskIds', () => {
                const msg: ReorderTasksMessage = { command: 'reorderTasks', taskIds: ['task-1', 'task-2', 'task-3'] };
                assert.strictEqual(msg.command, 'reorderTasks');
                assert.deepStrictEqual(msg.taskIds, ['task-1', 'task-2', 'task-3']);
            });

            it('should require taskIds in ReorderTasksMessage', () => {
                const msg: ReorderTasksMessage = { command: 'reorderTasks', taskIds: [] };
                assert.ok(Array.isArray(msg.taskIds));
            });
        });

        describe('PRD Messages', () => {
            it('should create valid GeneratePrdMessage with taskDescription', () => {
                const msg: GeneratePrdMessage = { command: 'generatePrd', taskDescription: 'Build a todo app' };
                assert.strictEqual(msg.command, 'generatePrd');
                assert.strictEqual(msg.taskDescription, 'Build a todo app');
            });

            it('should create valid RequirementsChangedMessage', () => {
                const msg: RequirementsChangedMessage = {
                    command: 'requirementsChanged',
                    requirements: {
                        runTests: true,
                        runLinting: false,
                        runTypeCheck: true,
                        writeTests: false,
                        updateDocs: true,
                        commitChanges: false
                    }
                };
                assert.strictEqual(msg.command, 'requirementsChanged');
                assert.strictEqual(msg.requirements.runTests, true);
            });

            it('should create valid SettingsChangedMessage', () => {
                const msg: SettingsChangedMessage = {
                    command: 'settingsChanged',
                    settings: { maxIterations: 100 }
                };
                assert.strictEqual(msg.command, 'settingsChanged');
                assert.strictEqual(msg.settings.maxIterations, 100);
            });
        });

        describe('Export Messages', () => {
            it('should create valid ExportDataMessage', () => {
                const msg: ExportDataMessage = { command: 'exportData' };
                assert.strictEqual(msg.command, 'exportData');
            });

            it('should create ExportDataMessage with format', () => {
                const jsonMsg: ExportDataMessage = { command: 'exportData', format: 'json' };
                const csvMsg: ExportDataMessage = { command: 'exportData', format: 'csv' };
                assert.strictEqual(jsonMsg.format, 'json');
                assert.strictEqual(csvMsg.format, 'csv');
            });

            it('should create valid ExportLogMessage with entries', () => {
                const msg: ExportLogMessage = {
                    command: 'exportLog',
                    entries: [
                        { time: '10:00:00', level: 'info', message: 'Started' },
                        { time: '10:00:01', level: 'success', message: 'Completed' }
                    ]
                };
                assert.strictEqual(msg.command, 'exportLog');
                assert.strictEqual(msg.entries.length, 2);
            });
        });

        describe('State Messages', () => {
            it('should create valid PanelStateChangedMessage', () => {
                const msg: PanelStateChangedMessage = {
                    command: 'panelStateChanged',
                    collapsedSections: ['timeline', 'log'],
                    scrollPosition: 150
                };
                assert.strictEqual(msg.command, 'panelStateChanged');
                assert.deepStrictEqual(msg.collapsedSections, ['timeline', 'log']);
                assert.strictEqual(msg.scrollPosition, 150);
            });

            it('should allow optional properties in PanelStateChangedMessage', () => {
                const msg: PanelStateChangedMessage = { command: 'panelStateChanged' };
                assert.strictEqual(msg.command, 'panelStateChanged');
                assert.strictEqual(msg.collapsedSections, undefined);
            });

            it('should create valid WebviewErrorMessage', () => {
                const msg: WebviewErrorMessage = {
                    command: 'webviewError',
                    error: {
                        message: 'Script error',
                        source: 'scripts.js',
                        lineno: 42,
                        colno: 10,
                        stack: 'Error stack trace'
                    }
                };
                assert.strictEqual(msg.command, 'webviewError');
                assert.strictEqual(msg.error?.message, 'Script error');
            });

            it('should create valid OpenPanelMessage', () => {
                const msg: OpenPanelMessage = { command: 'openPanel' };
                assert.strictEqual(msg.command, 'openPanel');
            });
        });

        describe('IncomingWebviewMessage Union', () => {
            it('should accept all control messages', () => {
                const messages: IncomingWebviewMessage[] = [
                    { command: 'start' },
                    { command: 'stop' },
                    { command: 'pause' },
                    { command: 'resume' },
                    { command: 'next' },
                    { command: 'refresh' }
                ];
                assert.strictEqual(messages.length, 6);
            });

            it('should accept all task messages', () => {
                const messages: IncomingWebviewMessage[] = [
                    { command: 'skipTask' },
                    { command: 'retryTask' },
                    { command: 'completeAllTasks' },
                    { command: 'resetAllTasks' },
                    { command: 'reorderTasks', taskIds: [] }
                ];
                assert.strictEqual(messages.length, 5);
            });

            it('should accept all PRD messages', () => {
                const messages: IncomingWebviewMessage[] = [
                    { command: 'generatePrd', taskDescription: 'test' },
                    { command: 'requirementsChanged', requirements: { runTests: false, runLinting: false, runTypeCheck: false, writeTests: false, updateDocs: false, commitChanges: false } },
                    { command: 'settingsChanged', settings: { maxIterations: 50 } }
                ];
                assert.strictEqual(messages.length, 3);
            });

            it('should enable exhaustive switch handling', () => {
                function handleMessage(msg: IncomingWebviewMessage): string {
                    switch (msg.command) {
                        case 'start': return 'starting';
                        case 'stop': return 'stopping';
                        case 'pause': return 'pausing';
                        case 'resume': return 'resuming';
                        case 'next': return 'stepping';
                        case 'refresh': return 'refreshing';
                        case 'skipTask': return 'skipping';
                        case 'retryTask': return 'retrying';
                        case 'completeAllTasks': return 'completing all';
                        case 'resetAllTasks': return 'resetting all';
                        case 'reorderTasks': return `reordering ${msg.taskIds.length} tasks`;
                        case 'generatePrd': return `generating prd: ${msg.taskDescription}`;
                        case 'requirementsChanged': return 'requirements changed';
                        case 'settingsChanged': return `max iterations: ${msg.settings.maxIterations}`;
                        case 'exportData': return 'exporting data';
                        case 'exportLog': return `exporting ${msg.entries.length} entries`;
                        case 'generateReport': return `generating ${msg.period} report`;
                        case 'switchProject': return `switching to ${msg.projectPath}`;
                        case 'panelStateChanged': return 'state changed';
                        case 'webviewError': return 'error occurred';
                        case 'openPanel': return 'opening panel';
                        case 'refreshHistory': return 'refreshing history';
                        case 'refreshSessionStats': return 'refreshing session stats';
                    }
                }

                assert.strictEqual(handleMessage({ command: 'start' }), 'starting');
                assert.strictEqual(handleMessage({ command: 'generatePrd', taskDescription: 'test' }), 'generating prd: test');
                assert.strictEqual(handleMessage({ command: 'reorderTasks', taskIds: ['a', 'b'] }), 'reordering 2 tasks');
            });
        });
    });

    // ========================================================================
    // Outgoing Message Type Tests
    // ========================================================================

    describe('Outgoing Message Types', () => {
        describe('Status Update Messages', () => {
            it('should create valid UpdateMessage', () => {
                const msg: UpdateMessage = {
                    type: 'update',
                    status: 'running',
                    iteration: 5,
                    taskInfo: 'Building feature X'
                };
                assert.strictEqual(msg.type, 'update');
                assert.strictEqual(msg.status, 'running');
                assert.strictEqual(msg.iteration, 5);
                assert.strictEqual(msg.taskInfo, 'Building feature X');
            });

            it('should create valid CountdownMessage', () => {
                const msg: CountdownMessage = { type: 'countdown', seconds: 10 };
                assert.strictEqual(msg.type, 'countdown');
                assert.strictEqual(msg.seconds, 10);
            });

            it('should create valid HistoryMessage', () => {
                const msg: HistoryMessage = {
                    type: 'history',
                    history: [
                        { taskDescription: 'Task 1', completedAt: Date.now(), duration: 1000, iteration: 1 }
                    ]
                };
                assert.strictEqual(msg.type, 'history');
                assert.strictEqual(msg.history.length, 1);
            });

            it('should create valid TimingMessage', () => {
                const msg: TimingMessage = {
                    type: 'timing',
                    startTime: Date.now(),
                    taskHistory: [],
                    pendingTasks: 5
                };
                assert.strictEqual(msg.type, 'timing');
                assert.strictEqual(msg.pendingTasks, 5);
            });

            it('should create valid StatsMessage', () => {
                const msg: StatsMessage = {
                    type: 'stats',
                    completed: 3,
                    pending: 7,
                    total: 10,
                    progress: 30,
                    nextTask: 'Implement feature'
                };
                assert.strictEqual(msg.type, 'stats');
                assert.strictEqual(msg.completed, 3);
                assert.strictEqual(msg.progress, 30);
            });

            it('should allow null nextTask in StatsMessage', () => {
                const msg: StatsMessage = {
                    type: 'stats',
                    completed: 10,
                    pending: 0,
                    total: 10,
                    progress: 100,
                    nextTask: null
                };
                assert.strictEqual(msg.nextTask, null);
            });
        });

        describe('Logging Messages', () => {
            it('should create valid LogMessage', () => {
                const msg: LogMessage = {
                    type: 'log',
                    message: 'Task completed successfully',
                    highlight: true,
                    level: 'success'
                };
                assert.strictEqual(msg.type, 'log');
                assert.strictEqual(msg.highlight, true);
                assert.strictEqual(msg.level, 'success');
            });

            it('should allow level to be optional in LogMessage', () => {
                const msg: LogMessage = {
                    type: 'log',
                    message: 'Info message',
                    highlight: false
                };
                assert.strictEqual(msg.level, undefined);
            });
        });

        describe('PRD Messages', () => {
            it('should create valid PrdGeneratingMessage', () => {
                const msg: PrdGeneratingMessage = { type: 'prdGenerating' };
                assert.strictEqual(msg.type, 'prdGenerating');
            });

            it('should create valid PrdCompleteMessage', () => {
                const msg: PrdCompleteMessage = { type: 'prdComplete' };
                assert.strictEqual(msg.type, 'prdComplete');
            });
        });

        describe('Toast Messages', () => {
            it('should accept all ToastType values', () => {
                const types: ToastType[] = ['success', 'error', 'warning', 'info'];
                assert.strictEqual(types.length, 4);
            });

            it('should create valid ToastMessage', () => {
                const msg: ToastMessage = {
                    type: 'toast',
                    toastType: 'success',
                    message: 'Operation completed!',
                    title: 'Success',
                    duration: 5000,
                    dismissible: true
                };
                assert.strictEqual(msg.type, 'toast');
                assert.strictEqual(msg.toastType, 'success');
            });

            it('should allow optional properties in ToastMessage', () => {
                const msg: ToastMessage = {
                    type: 'toast',
                    toastType: 'info',
                    message: 'Info message'
                };
                assert.strictEqual(msg.title, undefined);
                assert.strictEqual(msg.duration, undefined);
            });
        });

        describe('Loading Messages', () => {
            it('should create valid LoadingMessage with isLoading true', () => {
                const msg: LoadingMessage = { type: 'loading', isLoading: true };
                assert.strictEqual(msg.type, 'loading');
                assert.strictEqual(msg.isLoading, true);
            });

            it('should create valid LoadingMessage with isLoading false', () => {
                const msg: LoadingMessage = { type: 'loading', isLoading: false };
                assert.strictEqual(msg.isLoading, false);
            });
        });

        describe('Error Messages', () => {
            it('should create valid ErrorMessage', () => {
                const msg: ErrorMessage = {
                    type: 'error',
                    message: 'Something went wrong',
                    code: 'ERR_001'
                };
                assert.strictEqual(msg.type, 'error');
                assert.strictEqual(msg.code, 'ERR_001');
            });

            it('should allow optional code in ErrorMessage', () => {
                const msg: ErrorMessage = {
                    type: 'error',
                    message: 'Generic error'
                };
                assert.strictEqual(msg.code, undefined);
            });
        });

        describe('OutgoingExtensionMessage Union', () => {
            it('should accept all outgoing message types', () => {
                const messages: OutgoingExtensionMessage[] = [
                    { type: 'update', status: 'idle', iteration: 0, taskInfo: '' },
                    { type: 'countdown', seconds: 5 },
                    { type: 'history', history: [] },
                    { type: 'timing', startTime: 0, taskHistory: [], pendingTasks: 0 },
                    { type: 'stats', completed: 0, pending: 0, total: 0, progress: 0, nextTask: null },
                    { type: 'log', message: '', highlight: false },
                    { type: 'prdGenerating' },
                    { type: 'prdComplete' },
                    { type: 'toast', toastType: 'info', message: '' },
                    { type: 'loading', isLoading: false },
                    { type: 'error', message: '' }
                ];
                assert.strictEqual(messages.length, 11);
            });

            it('should enable exhaustive switch handling', () => {
                function handleOutgoing(msg: OutgoingExtensionMessage): string {
                    switch (msg.type) {
                        case 'update': return `status: ${msg.status}`;
                        case 'countdown': return `seconds: ${msg.seconds}`;
                        case 'history': return `history entries: ${msg.history.length}`;
                        case 'timing': return `pending: ${msg.pendingTasks}`;
                        case 'stats': return `progress: ${msg.progress}%`;
                        case 'log': return `log: ${msg.message}`;
                        case 'prdGenerating': return 'generating';
                        case 'prdComplete': return 'complete';
                        case 'toast': return `toast: ${msg.toastType}`;
                        case 'loading': return `loading: ${msg.isLoading}`;
                        case 'error': return `error: ${msg.message}`;
                    }
                }

                assert.strictEqual(handleOutgoing({ type: 'countdown', seconds: 10 }), 'seconds: 10');
                assert.strictEqual(handleOutgoing({ type: 'prdGenerating' }), 'generating');
            });
        });
    });

    // ========================================================================
    // Type Guard Tests
    // ========================================================================

    describe('Type Guards', () => {
        describe('isIncomingWebviewMessage', () => {
            it('should return true for valid control messages', () => {
                assert.strictEqual(isIncomingWebviewMessage({ command: 'start' }), true);
                assert.strictEqual(isIncomingWebviewMessage({ command: 'stop' }), true);
                assert.strictEqual(isIncomingWebviewMessage({ command: 'pause' }), true);
            });

            it('should return true for valid task messages', () => {
                assert.strictEqual(isIncomingWebviewMessage({ command: 'skipTask' }), true);
                assert.strictEqual(isIncomingWebviewMessage({ command: 'reorderTasks', taskIds: [] }), true);
            });

            it('should return true for valid PRD messages', () => {
                assert.strictEqual(isIncomingWebviewMessage({ command: 'generatePrd', taskDescription: 'test' }), true);
            });

            it('should return false for invalid commands', () => {
                assert.strictEqual(isIncomingWebviewMessage({ command: 'invalidCommand' }), false);
                assert.strictEqual(isIncomingWebviewMessage({ command: '' }), false);
            });

            it('should return false for non-object values', () => {
                assert.strictEqual(isIncomingWebviewMessage(null), false);
                assert.strictEqual(isIncomingWebviewMessage(undefined), false);
                assert.strictEqual(isIncomingWebviewMessage('start'), false);
                assert.strictEqual(isIncomingWebviewMessage(123), false);
            });

            it('should return false for objects without command', () => {
                assert.strictEqual(isIncomingWebviewMessage({}), false);
                assert.strictEqual(isIncomingWebviewMessage({ type: 'update' }), false);
            });
        });

        describe('isOutgoingExtensionMessage', () => {
            it('should return true for valid outgoing messages', () => {
                assert.strictEqual(isOutgoingExtensionMessage({ type: 'update', status: '', iteration: 0, taskInfo: '' }), true);
                assert.strictEqual(isOutgoingExtensionMessage({ type: 'countdown', seconds: 0 }), true);
                assert.strictEqual(isOutgoingExtensionMessage({ type: 'prdGenerating' }), true);
            });

            it('should return false for invalid types', () => {
                assert.strictEqual(isOutgoingExtensionMessage({ type: 'invalidType' }), false);
                assert.strictEqual(isOutgoingExtensionMessage({ type: '' }), false);
            });

            it('should return false for non-object values', () => {
                assert.strictEqual(isOutgoingExtensionMessage(null), false);
                assert.strictEqual(isOutgoingExtensionMessage(undefined), false);
            });

            it('should return false for objects without type', () => {
                assert.strictEqual(isOutgoingExtensionMessage({}), false);
                assert.strictEqual(isOutgoingExtensionMessage({ command: 'start' }), false);
            });
        });

        describe('isControlMessage', () => {
            it('should return true for control commands', () => {
                const msg: BaseWebviewMessage = { command: 'start' };
                assert.strictEqual(isControlMessage(msg), true);
            });

            it('should return false for non-control commands', () => {
                const msg: BaseWebviewMessage = { command: 'skipTask' };
                assert.strictEqual(isControlMessage(msg), false);
            });
        });

        describe('isTaskMessage', () => {
            it('should return true for task commands', () => {
                const msg: BaseWebviewMessage = { command: 'skipTask' };
                assert.strictEqual(isTaskMessage(msg), true);
            });

            it('should return false for non-task commands', () => {
                const msg: BaseWebviewMessage = { command: 'start' };
                assert.strictEqual(isTaskMessage(msg), false);
            });
        });

        describe('isPrdMessage', () => {
            it('should return true for PRD commands', () => {
                const msg: BaseWebviewMessage = { command: 'generatePrd' };
                assert.strictEqual(isPrdMessage(msg), true);
            });

            it('should return false for non-PRD commands', () => {
                const msg: BaseWebviewMessage = { command: 'start' };
                assert.strictEqual(isPrdMessage(msg), false);
            });
        });

        describe('isExportMessage', () => {
            it('should return true for export commands', () => {
                const msg: BaseWebviewMessage = { command: 'exportData' };
                assert.strictEqual(isExportMessage(msg), true);
            });

            it('should return false for non-export commands', () => {
                const msg: BaseWebviewMessage = { command: 'start' };
                assert.strictEqual(isExportMessage(msg), false);
            });
        });

        describe('isStateMessage', () => {
            it('should return true for state commands', () => {
                const msg: BaseWebviewMessage = { command: 'panelStateChanged' };
                assert.strictEqual(isStateMessage(msg), true);
            });

            it('should return false for non-state commands', () => {
                const msg: BaseWebviewMessage = { command: 'start' };
                assert.strictEqual(isStateMessage(msg), false);
            });
        });
    });

    // ========================================================================
    // Discriminant Property Tests
    // ========================================================================

    describe('Discriminant Properties', () => {
        it('should use command as discriminant for incoming messages', () => {
            const msg: IncomingWebviewMessage = { command: 'start' };
            assert.ok('command' in msg);
        });

        it('should use type as discriminant for outgoing messages', () => {
            const msg: OutgoingExtensionMessage = { type: 'countdown', seconds: 5 };
            assert.ok('type' in msg);
        });

        it('should enable type narrowing based on command', () => {
            const msg: IncomingWebviewMessage = { command: 'generatePrd', taskDescription: 'test' };
            if (msg.command === 'generatePrd') {
                // TypeScript should know taskDescription exists here
                assert.strictEqual(msg.taskDescription, 'test');
            }
        });

        it('should enable type narrowing based on type', () => {
            const msg: OutgoingExtensionMessage = { type: 'countdown', seconds: 10 };
            if (msg.type === 'countdown') {
                // TypeScript should know seconds exists here
                assert.strictEqual(msg.seconds, 10);
            }
        });
    });

    // ========================================================================
    // Readonly Properties Tests
    // ========================================================================

    describe('Readonly Properties', () => {
        it('should have readonly command in incoming messages', () => {
            const msg: StartMessage = { command: 'start' };
            // TypeScript would error if we tried to reassign
            assert.strictEqual(msg.command, 'start');
        });

        it('should have readonly type in outgoing messages', () => {
            const msg: CountdownMessage = { type: 'countdown', seconds: 5 };
            // TypeScript would error if we tried to reassign
            assert.strictEqual(msg.type, 'countdown');
        });

        it('should have readonly taskIds in ReorderTasksMessage', () => {
            const msg: ReorderTasksMessage = { command: 'reorderTasks', taskIds: ['a', 'b'] };
            assert.deepStrictEqual(msg.taskIds, ['a', 'b']);
        });
    });
});

// Import strict null check utilities from types.ts
import {
    taskHasDependencies,
    taskHasAcceptanceCriteria,
    getTaskDependencies,
    getTaskAcceptanceCriteria,
    webviewErrorHasStack,
    getWebviewErrorStack,
    isValidPanelState,
    normalizePanelState,
    isValidTaskRequirements,
    normalizeTaskRequirements,
    isValidRalphSettings,
    normalizeRalphSettings,
    Task
} from '../../types';

describe('Strict Null Check Utilities', () => {
    // ========================================================================
    // Task Type Guards
    // ========================================================================

    describe('taskHasDependencies', () => {
        it('returns true when task has non-empty dependencies', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                dependencies: ['Task A', 'Task B']
            };
            assert.strictEqual(taskHasDependencies(task), true);
        });

        it('returns false when task has empty dependencies', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                dependencies: []
            };
            assert.strictEqual(taskHasDependencies(task), false);
        });

        it('returns false when task has undefined dependencies', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test'
            };
            assert.strictEqual(taskHasDependencies(task), false);
        });

        it('narrows type correctly', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                dependencies: ['Dep']
            };
            if (taskHasDependencies(task)) {
                // TypeScript should know dependencies is string[] here
                assert.strictEqual(task.dependencies.length, 1);
            }
        });
    });

    describe('taskHasAcceptanceCriteria', () => {
        it('returns true when task has non-empty acceptance criteria', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                acceptanceCriteria: ['Criterion 1', 'Criterion 2']
            };
            assert.strictEqual(taskHasAcceptanceCriteria(task), true);
        });

        it('returns false when task has empty acceptance criteria', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                acceptanceCriteria: []
            };
            assert.strictEqual(taskHasAcceptanceCriteria(task), false);
        });

        it('returns false when task has undefined acceptance criteria', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test'
            };
            assert.strictEqual(taskHasAcceptanceCriteria(task), false);
        });
    });

    describe('getTaskDependencies', () => {
        it('returns dependencies when defined', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                dependencies: ['Dep1', 'Dep2']
            };
            assert.deepStrictEqual(getTaskDependencies(task), ['Dep1', 'Dep2']);
        });

        it('returns empty array when dependencies undefined', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test'
            };
            assert.deepStrictEqual(getTaskDependencies(task), []);
        });
    });

    describe('getTaskAcceptanceCriteria', () => {
        it('returns acceptance criteria when defined', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test',
                acceptanceCriteria: ['AC1', 'AC2']
            };
            assert.deepStrictEqual(getTaskAcceptanceCriteria(task), ['AC1', 'AC2']);
        });

        it('returns empty array when acceptance criteria undefined', () => {
            const task: Task = {
                id: '1',
                description: 'Test',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test'
            };
            assert.deepStrictEqual(getTaskAcceptanceCriteria(task), []);
        });
    });

    // ========================================================================
    // WebviewError Type Guards
    // ========================================================================

    describe('webviewErrorHasStack', () => {
        it('returns true when error has non-empty stack', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1,
                stack: 'Error: at test.js:1:1'
            };
            assert.strictEqual(webviewErrorHasStack(error), true);
        });

        it('returns false when error has empty stack', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1,
                stack: ''
            };
            assert.strictEqual(webviewErrorHasStack(error), false);
        });

        it('returns false when error has undefined stack', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1
            };
            assert.strictEqual(webviewErrorHasStack(error), false);
        });
    });

    describe('getWebviewErrorStack', () => {
        it('returns stack when defined', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1,
                stack: 'Error: at test.js:1:1'
            };
            assert.strictEqual(getWebviewErrorStack(error), 'Error: at test.js:1:1');
        });

        it('returns default when stack undefined', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1
            };
            assert.strictEqual(getWebviewErrorStack(error, 'No stack'), 'No stack');
        });

        it('returns empty string by default when stack undefined', () => {
            const error: WebviewError = {
                message: 'Error',
                source: 'test.js',
                lineno: 1,
                colno: 1
            };
            assert.strictEqual(getWebviewErrorStack(error), '');
        });
    });

    // ========================================================================
    // PanelState Validation
    // ========================================================================

    describe('isValidPanelState', () => {
        it('returns true for valid PanelState', () => {
            const state: PanelState = {
                collapsedSections: ['section1'],
                scrollPosition: 100,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(isValidPanelState(state), true);
        });

        it('returns false for null', () => {
            assert.strictEqual(isValidPanelState(null), false);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isValidPanelState(undefined), false);
        });

        it('returns false when collapsedSections is not array', () => {
            const state = {
                collapsedSections: 'not-array',
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(isValidPanelState(state), false);
        });

        it('returns false when scrollPosition is not number', () => {
            const state = {
                collapsedSections: [],
                scrollPosition: 'not-number',
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            assert.strictEqual(isValidPanelState(state), false);
        });

        it('returns false when requirements is null', () => {
            const state = {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: null
            };
            assert.strictEqual(isValidPanelState(state), false);
        });
    });

    describe('normalizePanelState', () => {
        it('returns default for null', () => {
            const result = normalizePanelState(null);
            assert.deepStrictEqual(result.collapsedSections, []);
            assert.strictEqual(result.scrollPosition, 0);
        });

        it('returns default for undefined', () => {
            const result = normalizePanelState(undefined);
            assert.deepStrictEqual(result.collapsedSections, []);
            assert.strictEqual(result.scrollPosition, 0);
        });

        it('preserves valid properties', () => {
            const partial = { collapsedSections: ['sec1'], scrollPosition: 50 };
            const result = normalizePanelState(partial);
            assert.deepStrictEqual(result.collapsedSections, ['sec1']);
            assert.strictEqual(result.scrollPosition, 50);
        });

        it('fills in missing properties with defaults', () => {
            const partial = { collapsedSections: ['sec1'] };
            const result = normalizePanelState(partial);
            assert.deepStrictEqual(result.collapsedSections, ['sec1']);
            assert.strictEqual(result.scrollPosition, 0);
        });

        it('replaces invalid collapsedSections with empty array', () => {
            const partial = { collapsedSections: 'invalid' as unknown as string[] };
            const result = normalizePanelState(partial);
            assert.deepStrictEqual(result.collapsedSections, []);
        });

        it('replaces invalid scrollPosition with 0', () => {
            const partial = { scrollPosition: 'invalid' as unknown as number };
            const result = normalizePanelState(partial);
            assert.strictEqual(result.scrollPosition, 0);
        });
    });

    // ========================================================================
    // TaskRequirements Validation
    // ========================================================================

    describe('isValidTaskRequirements', () => {
        it('returns true for valid TaskRequirements', () => {
            assert.strictEqual(isValidTaskRequirements(DEFAULT_REQUIREMENTS), true);
        });

        it('returns false for null', () => {
            assert.strictEqual(isValidTaskRequirements(null), false);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isValidTaskRequirements(undefined), false);
        });

        it('returns false when property is not boolean', () => {
            const req = { ...DEFAULT_REQUIREMENTS, runTests: 'yes' };
            assert.strictEqual(isValidTaskRequirements(req), false);
        });

        it('returns false when property is missing', () => {
            const req = { runTests: true, runLinting: true };
            assert.strictEqual(isValidTaskRequirements(req), false);
        });
    });

    describe('normalizeTaskRequirements', () => {
        it('returns default for null', () => {
            const result = normalizeTaskRequirements(null);
            assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
        });

        it('returns default for undefined', () => {
            const result = normalizeTaskRequirements(undefined);
            assert.deepStrictEqual(result, DEFAULT_REQUIREMENTS);
        });

        it('preserves valid properties', () => {
            const partial = { runTests: true, runLinting: true };
            const result = normalizeTaskRequirements(partial);
            assert.strictEqual(result.runTests, true);
            assert.strictEqual(result.runLinting, true);
            assert.strictEqual(result.runTypeCheck, false); // default
        });

        it('replaces invalid properties with defaults', () => {
            const partial = { runTests: 'invalid' as unknown as boolean };
            const result = normalizeTaskRequirements(partial);
            assert.strictEqual(result.runTests, false); // default
        });
    });

    // ========================================================================
    // RalphSettings Validation
    // ========================================================================

    describe('isValidRalphSettings', () => {
        it('returns true for valid RalphSettings', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: 50 }), true);
        });

        it('returns true for zero maxIterations', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: 0 }), true);
        });

        it('returns false for null', () => {
            assert.strictEqual(isValidRalphSettings(null), false);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isValidRalphSettings(undefined), false);
        });

        it('returns false for non-number maxIterations', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: 'fifty' }), false);
        });

        it('returns false for negative maxIterations', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: -1 }), false);
        });

        it('returns false for NaN maxIterations', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: NaN }), false);
        });

        it('returns false for Infinity maxIterations', () => {
            assert.strictEqual(isValidRalphSettings({ maxIterations: Infinity }), false);
        });
    });

    describe('normalizeRalphSettings', () => {
        it('returns default for null', () => {
            const result = normalizeRalphSettings(null);
            assert.deepStrictEqual(result, DEFAULT_SETTINGS);
        });

        it('returns default for undefined', () => {
            const result = normalizeRalphSettings(undefined);
            assert.deepStrictEqual(result, DEFAULT_SETTINGS);
        });

        it('preserves valid maxIterations', () => {
            const result = normalizeRalphSettings({ maxIterations: 100 });
            assert.strictEqual(result.maxIterations, 100);
        });

        it('replaces invalid maxIterations with default', () => {
            const result = normalizeRalphSettings({ maxIterations: 'invalid' as unknown as number });
            assert.strictEqual(result.maxIterations, 50); // default
        });

        it('replaces negative maxIterations with default', () => {
            const result = normalizeRalphSettings({ maxIterations: -10 });
            assert.strictEqual(result.maxIterations, 50); // default
        });

        it('replaces NaN maxIterations with default', () => {
            const result = normalizeRalphSettings({ maxIterations: NaN });
            assert.strictEqual(result.maxIterations, 50); // default
        });
    });
});
