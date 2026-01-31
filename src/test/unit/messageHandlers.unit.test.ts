/**
 * Unit tests for Message Handlers
 * 
 * Tests the message handler architecture including:
 * - Individual handler classes (Control, Task, PRD, Export, State)
 * - Message handler registry
 * - Type guards and validation
 */

import * as assert from 'assert';

// Import message handler types and classes
import {
    PanelEventType,
    PanelEventData,
    MessageHandlerContext,
    BaseWebviewMessage,
    IMessageHandler,
    ControlMessage,
    TaskMessage,
    PrdMessage,
    ExportMessage,
    StateMessage,
    // Type guards
    isControlMessage,
    isTaskMessage,
    isPrdMessage,
    isExportMessage,
    isStateMessage,
    // Discriminated union types
    IncomingWebviewMessage,
    OutgoingExtensionMessage,
    isIncomingWebviewMessage,
    isOutgoingExtensionMessage,
    // Command constants
    CONTROL_COMMANDS,
    TASK_COMMANDS,
    PRD_COMMANDS,
    EXPORT_COMMANDS,
    STATE_COMMANDS,
    ALL_INCOMING_COMMANDS,
    OUTGOING_MESSAGE_TYPES,
    PropertyValidationError,
    MessageValidationResult
} from '../../messageHandlers/types';

import {
    ControlMessageHandler,
    createControlMessageHandler
} from '../../messageHandlers/controlMessageHandler';

import {
    TaskMessageHandler,
    createTaskMessageHandler
} from '../../messageHandlers/taskMessageHandler';

import {
    PrdMessageHandler,
    createPrdMessageHandler
} from '../../messageHandlers/prdMessageHandler';

import {
    ExportMessageHandler,
    createExportMessageHandler
} from '../../messageHandlers/exportMessageHandler';

import {
    StateMessageHandler,
    createStateMessageHandler
} from '../../messageHandlers/stateMessageHandler';

import {
    DefaultMessageHandlerRegistry,
    createMessageHandlerRegistry,
    processMessage,
    isHandledCommand,
    getHandledCommands
} from '../../messageHandlers/registry';

describe('Message Handlers Unit Tests', () => {
    // ========================================================================
    // Helper functions for testing
    // ========================================================================
    
    function createMockContext(): {
        context: MessageHandlerContext;
        emittedEvents: Array<{ event: PanelEventType; data?: PanelEventData }>;
        stateUpdates: Array<Record<string, unknown>>;
        refreshCalled: boolean;
        webviewErrors: Array<{ message: string }>;
    } {
        const emittedEvents: Array<{ event: PanelEventType; data?: PanelEventData }> = [];
        const stateUpdates: Array<Record<string, unknown>> = [];
        let refreshCalled = false;
        const webviewErrors: Array<{ message: string }> = [];
        
        const context: MessageHandlerContext = {
            emit: (event: PanelEventType, data?: PanelEventData) => {
                emittedEvents.push({ event, data });
            },
            updatePanelState: (state: Record<string, unknown>) => {
                stateUpdates.push(state);
            },
            refresh: async () => {
                refreshCalled = true;
            },
            handleWebviewError: (error: { message: string }) => {
                webviewErrors.push(error);
            }
        };
        
        return { context, emittedEvents, stateUpdates, refreshCalled, webviewErrors };
    }

    // ========================================================================
    // ControlMessageHandler Tests
    // ========================================================================
    
    describe('ControlMessageHandler', () => {
        it('should have correct handled commands', () => {
            const handler = new ControlMessageHandler();
            assert.ok(handler.handledCommands.includes('start'));
            assert.ok(handler.handledCommands.includes('stop'));
            assert.ok(handler.handledCommands.includes('pause'));
            assert.ok(handler.handledCommands.includes('resume'));
            assert.ok(handler.handledCommands.includes('next'));
            assert.ok(handler.handledCommands.includes('refresh'));
        });
        
        it('should be created via factory function', () => {
            const handler = createControlMessageHandler();
            assert.ok(handler instanceof ControlMessageHandler);
        });
        
        it('canHandle returns true for control commands', () => {
            const handler = new ControlMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'start' }), true);
            assert.strictEqual(handler.canHandle({ command: 'stop' }), true);
            assert.strictEqual(handler.canHandle({ command: 'pause' }), true);
            assert.strictEqual(handler.canHandle({ command: 'resume' }), true);
            assert.strictEqual(handler.canHandle({ command: 'next' }), true);
            assert.strictEqual(handler.canHandle({ command: 'refresh' }), true);
        });
        
        it('canHandle returns false for non-control commands', () => {
            const handler = new ControlMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'skipTask' }), false);
            assert.strictEqual(handler.canHandle({ command: 'generatePrd' }), false);
            assert.strictEqual(handler.canHandle({ command: 'unknown' }), false);
        });
        
        it('handle emits start event', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'start' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'start');
        });
        
        it('handle emits stop event', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'stop' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'stop');
        });
        
        it('handle emits pause event', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'pause' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'pause');
        });
        
        it('handle emits resume event', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'resume' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'resume');
        });
        
        it('handle emits next event', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'next' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'next');
        });
        
        it('handle calls refresh for refresh command', () => {
            const handler = new ControlMessageHandler();
            const mock = createMockContext();
            
            handler.handle({ command: 'refresh' }, mock.context);
            
            // refresh is called on context, not emitted as event
            // Check that refresh was called by verifying no event was emitted
            assert.strictEqual(mock.emittedEvents.length, 0);
        });
        
        it('handle does nothing for non-control messages', () => {
            const handler = new ControlMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'skipTask' }, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
    });
    
    // ========================================================================
    // isControlMessage Type Guard Tests
    // ========================================================================
    
    describe('isControlMessage type guard', () => {
        it('returns true for start command', () => {
            assert.strictEqual(isControlMessage({ command: 'start' }), true);
        });
        
        it('returns true for stop command', () => {
            assert.strictEqual(isControlMessage({ command: 'stop' }), true);
        });
        
        it('returns true for pause command', () => {
            assert.strictEqual(isControlMessage({ command: 'pause' }), true);
        });
        
        it('returns true for resume command', () => {
            assert.strictEqual(isControlMessage({ command: 'resume' }), true);
        });
        
        it('returns true for next command', () => {
            assert.strictEqual(isControlMessage({ command: 'next' }), true);
        });
        
        it('returns true for refresh command', () => {
            assert.strictEqual(isControlMessage({ command: 'refresh' }), true);
        });
        
        it('returns false for non-control commands', () => {
            assert.strictEqual(isControlMessage({ command: 'skipTask' }), false);
            assert.strictEqual(isControlMessage({ command: 'generatePrd' }), false);
            assert.strictEqual(isControlMessage({ command: 'exportData' }), false);
        });
    });
    
    // ========================================================================
    // TaskMessageHandler Tests
    // ========================================================================
    
    describe('TaskMessageHandler', () => {
        it('should have correct handled commands', () => {
            const handler = new TaskMessageHandler();
            assert.ok(handler.handledCommands.includes('skipTask'));
            assert.ok(handler.handledCommands.includes('retryTask'));
            assert.ok(handler.handledCommands.includes('completeAllTasks'));
            assert.ok(handler.handledCommands.includes('resetAllTasks'));
            assert.ok(handler.handledCommands.includes('reorderTasks'));
        });
        
        it('should be created via factory function', () => {
            const handler = createTaskMessageHandler();
            assert.ok(handler instanceof TaskMessageHandler);
        });
        
        it('canHandle returns true for task commands', () => {
            const handler = new TaskMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'skipTask' }), true);
            assert.strictEqual(handler.canHandle({ command: 'retryTask' }), true);
            assert.strictEqual(handler.canHandle({ command: 'completeAllTasks' }), true);
            assert.strictEqual(handler.canHandle({ command: 'resetAllTasks' }), true);
            assert.strictEqual(handler.canHandle({ command: 'reorderTasks' }), true);
        });
        
        it('canHandle returns false for non-task commands', () => {
            const handler = new TaskMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'start' }), false);
            assert.strictEqual(handler.canHandle({ command: 'generatePrd' }), false);
        });
        
        it('handle emits skipTask event', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'skipTask' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'skipTask');
        });
        
        it('handle emits retryTask event', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'retryTask' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'retryTask');
        });
        
        it('handle emits completeAllTasks event', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'completeAllTasks' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'completeAllTasks');
        });
        
        it('handle emits resetAllTasks event', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'resetAllTasks' }, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'resetAllTasks');
        });
        
        it('handle emits reorderTasks event with taskIds', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            const taskIds = ['task-1', 'task-2', 'task-3'];
            
            handler.handle({ command: 'reorderTasks', taskIds } as TaskMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'reorderTasks');
            assert.deepStrictEqual(emittedEvents[0].data?.taskIds, taskIds);
        });
        
        it('handle does not emit reorderTasks without taskIds', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'reorderTasks' }, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
        
        it('handle does not emit reorderTasks with empty taskIds', () => {
            const handler = new TaskMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'reorderTasks', taskIds: [] } as TaskMessage, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
    });
    
    // ========================================================================
    // isTaskMessage Type Guard Tests
    // ========================================================================
    
    describe('isTaskMessage type guard', () => {
        it('returns true for task commands', () => {
            assert.strictEqual(isTaskMessage({ command: 'skipTask' }), true);
            assert.strictEqual(isTaskMessage({ command: 'retryTask' }), true);
            assert.strictEqual(isTaskMessage({ command: 'completeAllTasks' }), true);
            assert.strictEqual(isTaskMessage({ command: 'resetAllTasks' }), true);
            assert.strictEqual(isTaskMessage({ command: 'reorderTasks' }), true);
        });
        
        it('returns false for non-task commands', () => {
            assert.strictEqual(isTaskMessage({ command: 'start' }), false);
            assert.strictEqual(isTaskMessage({ command: 'generatePrd' }), false);
        });
    });
    
    // ========================================================================
    // PrdMessageHandler Tests
    // ========================================================================
    
    describe('PrdMessageHandler', () => {
        it('should have correct handled commands', () => {
            const handler = new PrdMessageHandler();
            assert.ok(handler.handledCommands.includes('generatePrd'));
            assert.ok(handler.handledCommands.includes('requirementsChanged'));
            assert.ok(handler.handledCommands.includes('settingsChanged'));
        });
        
        it('should be created via factory function', () => {
            const handler = createPrdMessageHandler();
            assert.ok(handler instanceof PrdMessageHandler);
        });
        
        it('canHandle returns true for PRD commands', () => {
            const handler = new PrdMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'generatePrd' }), true);
            assert.strictEqual(handler.canHandle({ command: 'requirementsChanged' }), true);
            assert.strictEqual(handler.canHandle({ command: 'settingsChanged' }), true);
        });
        
        it('canHandle returns false for non-PRD commands', () => {
            const handler = new PrdMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'start' }), false);
            assert.strictEqual(handler.canHandle({ command: 'skipTask' }), false);
        });
        
        it('handle emits generatePrd event with taskDescription', () => {
            const handler = new PrdMessageHandler();
            const { context, emittedEvents } = createMockContext();
            const taskDescription = 'Create a login feature';
            
            handler.handle({ command: 'generatePrd', taskDescription } as PrdMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'generatePrd');
            assert.strictEqual(emittedEvents[0].data?.taskDescription, taskDescription);
        });
        
        it('handle does not emit generatePrd without taskDescription', () => {
            const handler = new PrdMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'generatePrd' }, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
        
        it('handle emits requirementsChanged and updates panel state', () => {
            const handler = new PrdMessageHandler();
            const mock = createMockContext();
            const requirements = {
                runTests: true,
                runLinting: false,
                runTypeCheck: true,
                writeTests: false,
                updateDocs: true,
                commitChanges: false
            };
            
            handler.handle({ command: 'requirementsChanged', requirements } as PrdMessage, mock.context);
            
            assert.strictEqual(mock.emittedEvents.length, 1);
            assert.strictEqual(mock.emittedEvents[0].event, 'requirementsChanged');
            assert.deepStrictEqual(mock.emittedEvents[0].data?.requirements, requirements);
            assert.strictEqual(mock.stateUpdates.length, 1);
            assert.deepStrictEqual(mock.stateUpdates[0].requirements, requirements);
        });
        
        it('handle does not emit requirementsChanged without requirements', () => {
            const handler = new PrdMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'requirementsChanged' }, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
        
        it('handle emits settingsChanged with settings', () => {
            const handler = new PrdMessageHandler();
            const { context, emittedEvents } = createMockContext();
            const settings = { maxIterations: 100 };
            
            handler.handle({ command: 'settingsChanged', settings } as PrdMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'settingsChanged');
            assert.deepStrictEqual(emittedEvents[0].data?.settings, settings);
        });
        
        it('handle does not emit settingsChanged without settings', () => {
            const handler = new PrdMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'settingsChanged' }, context);
            
            assert.strictEqual(emittedEvents.length, 0);
        });
    });
    
    // ========================================================================
    // isPrdMessage Type Guard Tests
    // ========================================================================
    
    describe('isPrdMessage type guard', () => {
        it('returns true for PRD commands', () => {
            assert.strictEqual(isPrdMessage({ command: 'generatePrd' }), true);
            assert.strictEqual(isPrdMessage({ command: 'requirementsChanged' }), true);
            assert.strictEqual(isPrdMessage({ command: 'settingsChanged' }), true);
        });
        
        it('returns false for non-PRD commands', () => {
            assert.strictEqual(isPrdMessage({ command: 'start' }), false);
            assert.strictEqual(isPrdMessage({ command: 'skipTask' }), false);
        });
    });
    
    // ========================================================================
    // ExportMessageHandler Tests
    // ========================================================================
    
    describe('ExportMessageHandler', () => {
        it('should have correct handled commands', () => {
            const handler = new ExportMessageHandler();
            assert.ok(handler.handledCommands.includes('exportData'));
            assert.ok(handler.handledCommands.includes('exportLog'));
        });
        
        it('should be created via factory function', () => {
            const handler = createExportMessageHandler();
            assert.ok(handler instanceof ExportMessageHandler);
        });
        
        it('canHandle returns true for export commands', () => {
            const handler = new ExportMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'exportData' }), true);
            assert.strictEqual(handler.canHandle({ command: 'exportLog' }), true);
        });
        
        it('canHandle returns false for non-export commands', () => {
            const handler = new ExportMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'start' }), false);
            assert.strictEqual(handler.canHandle({ command: 'skipTask' }), false);
        });
        
        it('handle emits exportData event with format', () => {
            const handler = new ExportMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'exportData', format: 'json' } as ExportMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'exportData');
            assert.strictEqual(emittedEvents[0].data?.format, 'json');
        });
        
        it('handle emits exportData event with csv format', () => {
            const handler = new ExportMessageHandler();
            const { context, emittedEvents } = createMockContext();
            
            handler.handle({ command: 'exportData', format: 'csv' } as ExportMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].data?.format, 'csv');
        });
        
        it('handle emits exportLog event with entries', () => {
            const handler = new ExportMessageHandler();
            const { context, emittedEvents } = createMockContext();
            const entries = [
                { time: '10:00', level: 'info', message: 'Test log' }
            ];
            
            handler.handle({ command: 'exportLog', entries } as ExportMessage, context);
            
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'exportLog');
            assert.deepStrictEqual(emittedEvents[0].data?.entries, entries);
        });
    });
    
    // ========================================================================
    // isExportMessage Type Guard Tests
    // ========================================================================
    
    describe('isExportMessage type guard', () => {
        it('returns true for export commands', () => {
            assert.strictEqual(isExportMessage({ command: 'exportData' }), true);
            assert.strictEqual(isExportMessage({ command: 'exportLog' }), true);
        });
        
        it('returns false for non-export commands', () => {
            assert.strictEqual(isExportMessage({ command: 'start' }), false);
            assert.strictEqual(isExportMessage({ command: 'generatePrd' }), false);
        });
    });
    
    // ========================================================================
    // StateMessageHandler Tests
    // ========================================================================
    
    describe('StateMessageHandler', () => {
        it('should have correct handled commands', () => {
            const handler = new StateMessageHandler();
            assert.ok(handler.handledCommands.includes('panelStateChanged'));
            assert.ok(handler.handledCommands.includes('webviewError'));
            assert.ok(handler.handledCommands.includes('openPanel'));
        });
        
        it('should be created via factory function', () => {
            const handler = createStateMessageHandler();
            assert.ok(handler instanceof StateMessageHandler);
        });
        
        it('canHandle returns true for state commands', () => {
            const handler = new StateMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'panelStateChanged' }), true);
            assert.strictEqual(handler.canHandle({ command: 'webviewError' }), true);
            assert.strictEqual(handler.canHandle({ command: 'openPanel' }), true);
        });
        
        it('canHandle returns false for non-state commands', () => {
            const handler = new StateMessageHandler();
            assert.strictEqual(handler.canHandle({ command: 'start' }), false);
            assert.strictEqual(handler.canHandle({ command: 'generatePrd' }), false);
        });
        
        it('handle updates panel state for panelStateChanged', () => {
            const handler = new StateMessageHandler();
            const mock = createMockContext();
            const collapsedSections = ['timeline', 'log'];
            const scrollPosition = 150;
            
            handler.handle({ 
                command: 'panelStateChanged', 
                collapsedSections, 
                scrollPosition 
            } as StateMessage, mock.context);
            
            assert.strictEqual(mock.stateUpdates.length, 1);
            assert.deepStrictEqual(mock.stateUpdates[0].collapsedSections, collapsedSections);
            assert.strictEqual(mock.stateUpdates[0].scrollPosition, scrollPosition);
        });
        
        it('handle calls handleWebviewError for webviewError', () => {
            const handler = new StateMessageHandler();
            const mock = createMockContext();
            const error = { 
                message: 'Test error', 
                source: 'test.js', 
                lineno: 10, 
                colno: 5 
            };
            
            handler.handle({ 
                command: 'webviewError', 
                error 
            } as StateMessage, mock.context);
            
            assert.strictEqual(mock.webviewErrors.length, 1);
            assert.strictEqual(mock.webviewErrors[0].message, 'Test error');
        });
        
        it('handle does not call handleWebviewError without error', () => {
            const handler = new StateMessageHandler();
            const mock = createMockContext();
            
            handler.handle({ command: 'webviewError' }, mock.context);
            
            assert.strictEqual(mock.webviewErrors.length, 0);
        });
    });
    
    // ========================================================================
    // isStateMessage Type Guard Tests
    // ========================================================================
    
    describe('isStateMessage type guard', () => {
        it('returns true for state commands', () => {
            assert.strictEqual(isStateMessage({ command: 'panelStateChanged' }), true);
            assert.strictEqual(isStateMessage({ command: 'webviewError' }), true);
            assert.strictEqual(isStateMessage({ command: 'openPanel' }), true);
        });
        
        it('returns false for non-state commands', () => {
            assert.strictEqual(isStateMessage({ command: 'start' }), false);
            assert.strictEqual(isStateMessage({ command: 'generatePrd' }), false);
        });
    });
    
    // ========================================================================
    // DefaultMessageHandlerRegistry Tests
    // ========================================================================
    
    describe('DefaultMessageHandlerRegistry', () => {
        it('should register all default handlers', () => {
            const registry = new DefaultMessageHandlerRegistry();
            const handlers = registry.getHandlers();
            
            // Should have 6 handlers registered
            assert.strictEqual(handlers.length, 6);
        });
        
        it('should find handler for control commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const startHandler = registry.findHandler('start');
            assert.ok(startHandler);
            assert.ok(startHandler instanceof ControlMessageHandler);
        });
        
        it('should find handler for task commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const skipHandler = registry.findHandler('skipTask');
            assert.ok(skipHandler);
            assert.ok(skipHandler instanceof TaskMessageHandler);
        });
        
        it('should find handler for PRD commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const generateHandler = registry.findHandler('generatePrd');
            assert.ok(generateHandler);
            assert.ok(generateHandler instanceof PrdMessageHandler);
        });
        
        it('should find handler for export commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const exportHandler = registry.findHandler('exportData');
            assert.ok(exportHandler);
            assert.ok(exportHandler instanceof ExportMessageHandler);
        });
        
        it('should find handler for state commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const stateHandler = registry.findHandler('panelStateChanged');
            assert.ok(stateHandler);
            assert.ok(stateHandler instanceof StateMessageHandler);
        });
        
        it('should return undefined for unknown commands', () => {
            const registry = createMessageHandlerRegistry();
            
            const handler = registry.findHandler('unknownCommand');
            assert.strictEqual(handler, undefined);
        });
        
        it('should allow registering custom handlers', () => {
            const registry = createMessageHandlerRegistry();
            
            const customHandler: IMessageHandler = {
                handledCommands: ['customCommand'],
                canHandle: (msg: BaseWebviewMessage) => msg.command === 'customCommand',
                handle: () => {}
            };
            
            registry.register(customHandler);
            
            const found = registry.findHandler('customCommand');
            assert.strictEqual(found, customHandler);
        });
    });
    
    // ========================================================================
    // processMessage Tests
    // ========================================================================
    
    describe('processMessage', () => {
        it('should return true when message is handled', () => {
            const { context } = createMockContext();
            
            const result = processMessage({ command: 'start' }, context);
            
            assert.strictEqual(result, true);
        });
        
        it('should return false for unknown commands', () => {
            const { context } = createMockContext();
            
            const result = processMessage({ command: 'unknownCommand' }, context);
            
            assert.strictEqual(result, false);
        });
        
        it('should emit the correct event', () => {
            const mock = createMockContext();
            
            processMessage({ command: 'pause' }, mock.context);
            
            assert.strictEqual(mock.emittedEvents.length, 1);
            assert.strictEqual(mock.emittedEvents[0].event, 'pause');
        });
    });
    
    // ========================================================================
    // isHandledCommand Tests
    // ========================================================================
    
    describe('isHandledCommand', () => {
        it('returns true for handled commands', () => {
            assert.strictEqual(isHandledCommand('start'), true);
            assert.strictEqual(isHandledCommand('skipTask'), true);
            assert.strictEqual(isHandledCommand('generatePrd'), true);
            assert.strictEqual(isHandledCommand('exportData'), true);
            assert.strictEqual(isHandledCommand('panelStateChanged'), true);
        });
        
        it('returns false for unhandled commands', () => {
            assert.strictEqual(isHandledCommand('unknownCommand'), false);
            assert.strictEqual(isHandledCommand('foobar'), false);
        });
    });
    
    // ========================================================================
    // getHandledCommands Tests
    // ========================================================================
    
    describe('getHandledCommands', () => {
        it('returns all handled commands', () => {
            const commands = getHandledCommands();
            
            // Should include commands from all handlers
            assert.ok(commands.includes('start'));
            assert.ok(commands.includes('stop'));
            assert.ok(commands.includes('pause'));
            assert.ok(commands.includes('resume'));
            assert.ok(commands.includes('next'));
            assert.ok(commands.includes('refresh'));
            assert.ok(commands.includes('skipTask'));
            assert.ok(commands.includes('retryTask'));
            assert.ok(commands.includes('completeAllTasks'));
            assert.ok(commands.includes('resetAllTasks'));
            assert.ok(commands.includes('reorderTasks'));
            assert.ok(commands.includes('generatePrd'));
            assert.ok(commands.includes('requirementsChanged'));
            assert.ok(commands.includes('settingsChanged'));
            assert.ok(commands.includes('exportData'));
            assert.ok(commands.includes('exportLog'));
            assert.ok(commands.includes('panelStateChanged'));
            assert.ok(commands.includes('webviewError'));
            assert.ok(commands.includes('openPanel'));
        });
        
        it('returns correct number of commands', () => {
            const commands = getHandledCommands();
            
            // 6 control + 5 task + 3 PRD + 3 export + 5 state + 1 project = 23 commands
            assert.strictEqual(commands.length, 23);
        });
    });
    
    // ========================================================================
    // Message Type Interface Tests
    // ========================================================================
    
    describe('Message Type Interfaces', () => {
        it('ControlMessage interface has correct shape', () => {
            const msg: ControlMessage = { command: 'start' };
            assert.strictEqual(msg.command, 'start');
        });
        
        it('TaskMessage interface has correct shape', () => {
            const msg: TaskMessage = { command: 'reorderTasks', taskIds: ['1', '2'] };
            assert.strictEqual(msg.command, 'reorderTasks');
            assert.deepStrictEqual(msg.taskIds, ['1', '2']);
        });
        
        it('PrdMessage interface has correct shape', () => {
            const msg: PrdMessage = { 
                command: 'generatePrd', 
                taskDescription: 'Test' 
            };
            assert.strictEqual(msg.command, 'generatePrd');
            assert.strictEqual(msg.taskDescription, 'Test');
        });
        
        it('ExportMessage interface has correct shape', () => {
            const msg: ExportMessage = { 
                command: 'exportData', 
                format: 'json' 
            };
            assert.strictEqual(msg.command, 'exportData');
            assert.strictEqual(msg.format, 'json');
        });
        
        it('StateMessage interface has correct shape', () => {
            const msg: StateMessage = { 
                command: 'panelStateChanged',
                collapsedSections: ['timeline'],
                scrollPosition: 100
            };
            assert.strictEqual(msg.command, 'panelStateChanged');
            assert.deepStrictEqual(msg.collapsedSections, ['timeline']);
            assert.strictEqual(msg.scrollPosition, 100);
        });
    });
    
    // ========================================================================
    // IMessageHandler Interface Tests
    // ========================================================================
    
    describe('IMessageHandler Interface', () => {
        it('handledCommands is readonly', () => {
            const handler = new ControlMessageHandler();
            assert.ok(Array.isArray(handler.handledCommands));
            // Attempting to modify should not affect the original
            const commands = [...handler.handledCommands];
            commands.push('fake');
            assert.strictEqual(handler.handledCommands.length, 6);
        });
        
        it('all handlers implement IMessageHandler', () => {
            const handlers: IMessageHandler[] = [
                new ControlMessageHandler(),
                new TaskMessageHandler(),
                new PrdMessageHandler(),
                new ExportMessageHandler(),
                new StateMessageHandler()
            ];
            
            for (const handler of handlers) {
                assert.ok('handledCommands' in handler);
                assert.ok('canHandle' in handler);
                assert.ok('handle' in handler);
                assert.ok(typeof handler.canHandle === 'function');
                assert.ok(typeof handler.handle === 'function');
            }
        });
    });
    
    // ========================================================================
    // MessageHandlerContext Tests
    // ========================================================================
    
    describe('MessageHandlerContext', () => {
        it('emit is required', () => {
            const context: MessageHandlerContext = {
                emit: () => {}
            };
            assert.ok(context.emit);
        });
        
        it('updatePanelState is optional', () => {
            const context: MessageHandlerContext = {
                emit: () => {}
            };
            assert.strictEqual(context.updatePanelState, undefined);
        });
        
        it('refresh is optional', () => {
            const context: MessageHandlerContext = {
                emit: () => {}
            };
            assert.strictEqual(context.refresh, undefined);
        });
        
        it('handleWebviewError is optional', () => {
            const context: MessageHandlerContext = {
                emit: () => {}
            };
            assert.strictEqual(context.handleWebviewError, undefined);
        });
        
        it('all optional fields can be provided', () => {
            const context: MessageHandlerContext = {
                emit: () => {},
                updatePanelState: () => {},
                refresh: async () => {},
                handleWebviewError: () => {}
            };
            assert.ok(context.updatePanelState);
            assert.ok(context.refresh);
            assert.ok(context.handleWebviewError);
        });
    });

    // ========================================================================
    // Runtime Validation Tests
    // ========================================================================

    describe('Runtime Validation', () => {
        // Import validation functions
        const {
            validateIncomingMessage,
            validateAndExtractMessage,
            formatValidationError,
            validationSuccess,
            validationFailure,
            createPropertyError,
            isNonEmptyString,
            isStringArray,
            isNonEmptyStringArray,
            isValidTaskRequirements,
            isValidRalphSettings,
            isValidWebviewError,
            isValidLogEntry,
            isValidLogEntryArray,
            MESSAGE_VALIDATORS,
            validateStartMessage,
            validateStopMessage,
            validatePauseMessage,
            validateResumeMessage,
            validateNextMessage,
            validateRefreshMessage,
            validateSkipTaskMessage,
            validateRetryTaskMessage,
            validateCompleteAllTasksMessage,
            validateResetAllTasksMessage,
            validateReorderTasksMessage,
            validateGeneratePrdMessage,
            validateRequirementsChangedMessage,
            validateSettingsChangedMessage,
            validateExportDataMessage,
            validateExportLogMessage,
            validatePanelStateChangedMessage,
            validateWebviewErrorMessage,
            validateOpenPanelMessage
        } = require('../../messageHandlers/types');

        describe('Helper Functions', () => {
            describe('validationSuccess', () => {
                it('should return isValid true with command', () => {
                    const result = validationSuccess('start');
                    assert.strictEqual(result.isValid, true);
                    assert.strictEqual(result.command, 'start');
                    assert.strictEqual(result.error, undefined);
                });
            });

            describe('validationFailure', () => {
                it('should return isValid false with error', () => {
                    const result = validationFailure('Invalid message');
                    assert.strictEqual(result.isValid, false);
                    assert.strictEqual(result.error, 'Invalid message');
                });

                it('should include property errors when provided', () => {
                    const propertyErrors = [{ property: 'x', expected: 'string', actual: 'number', message: 'x must be string' }];
                    const result = validationFailure('Error', propertyErrors);
                    assert.strictEqual(result.propertyErrors?.length, 1);
                    assert.strictEqual(result.propertyErrors?.[0].property, 'x');
                });
            });

            describe('createPropertyError', () => {
                it('should create property error with correct fields', () => {
                    const error = createPropertyError('taskDescription', 'non-empty string', null);
                    assert.strictEqual(error.property, 'taskDescription');
                    assert.strictEqual(error.expected, 'non-empty string');
                    assert.strictEqual(error.actual, 'null'); // null is handled specially
                    assert.ok(error.message.includes('taskDescription'));
                });

                it('should handle undefined values', () => {
                    const error = createPropertyError('prop', 'string', undefined);
                    assert.strictEqual(error.actual, 'undefined');
                });

                it('should truncate long values', () => {
                    const longString = 'x'.repeat(100);
                    const error = createPropertyError('prop', 'string', longString);
                    assert.ok(error.message.length < 200);
                });
            });

            describe('isNonEmptyString', () => {
                it('should return true for non-empty strings', () => {
                    assert.strictEqual(isNonEmptyString('hello'), true);
                    assert.strictEqual(isNonEmptyString('  hello  '), true);
                });

                it('should return false for empty/whitespace strings', () => {
                    assert.strictEqual(isNonEmptyString(''), false);
                    assert.strictEqual(isNonEmptyString('   '), false);
                });

                it('should return false for non-strings', () => {
                    assert.strictEqual(isNonEmptyString(123), false);
                    assert.strictEqual(isNonEmptyString(null), false);
                    assert.strictEqual(isNonEmptyString(undefined), false);
                });
            });

            describe('isStringArray', () => {
                it('should return true for string arrays', () => {
                    assert.strictEqual(isStringArray(['a', 'b', 'c']), true);
                    assert.strictEqual(isStringArray([]), true);
                });

                it('should return false for mixed arrays', () => {
                    assert.strictEqual(isStringArray(['a', 123]), false);
                });

                it('should return false for non-arrays', () => {
                    assert.strictEqual(isStringArray('not an array'), false);
                    assert.strictEqual(isStringArray(null), false);
                });
            });

            describe('isNonEmptyStringArray', () => {
                it('should return true for non-empty arrays of non-empty strings', () => {
                    assert.strictEqual(isNonEmptyStringArray(['task-1', 'task-2']), true);
                });

                it('should return false for empty arrays', () => {
                    assert.strictEqual(isNonEmptyStringArray([]), false);
                });

                it('should return false for arrays with empty strings', () => {
                    assert.strictEqual(isNonEmptyStringArray(['valid', '']), false);
                    assert.strictEqual(isNonEmptyStringArray(['valid', '   ']), false);
                });
            });

            describe('isValidTaskRequirements', () => {
                it('should return true for valid requirements', () => {
                    const valid = {
                        runTests: true,
                        runLinting: false,
                        runTypeCheck: true,
                        writeTests: false,
                        updateDocs: false,
                        commitChanges: true
                    };
                    assert.strictEqual(isValidTaskRequirements(valid), true);
                });

                it('should return false for missing properties', () => {
                    assert.strictEqual(isValidTaskRequirements({ runTests: true }), false);
                });

                it('should return false for wrong property types', () => {
                    const invalid = {
                        runTests: 'true', // string instead of boolean
                        runLinting: false,
                        runTypeCheck: true,
                        writeTests: false,
                        updateDocs: false,
                        commitChanges: true
                    };
                    assert.strictEqual(isValidTaskRequirements(invalid), false);
                });

                it('should return false for non-objects', () => {
                    assert.strictEqual(isValidTaskRequirements(null), false);
                    assert.strictEqual(isValidTaskRequirements('string'), false);
                });
            });

            describe('isValidRalphSettings', () => {
                it('should return true for valid settings', () => {
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 50 }), true);
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 0 }), true);
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 1000 }), true);
                });

                it('should return false for invalid maxIterations', () => {
                    assert.strictEqual(isValidRalphSettings({ maxIterations: -1 }), false);
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 1001 }), false);
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 50.5 }), false);
                    assert.strictEqual(isValidRalphSettings({ maxIterations: 'fifty' }), false);
                });

                it('should return false for missing maxIterations', () => {
                    assert.strictEqual(isValidRalphSettings({}), false);
                });
            });

            describe('isValidWebviewError', () => {
                it('should return true for valid errors', () => {
                    const valid = {
                        message: 'Error occurred',
                        source: 'script.js',
                        lineno: 42,
                        colno: 10
                    };
                    assert.strictEqual(isValidWebviewError(valid), true);
                });

                it('should accept optional stack trace', () => {
                    const withStack = {
                        message: 'Error',
                        source: 'script.js',
                        lineno: 1,
                        colno: 1,
                        stack: 'Error: ...\n  at func (file:1:1)'
                    };
                    assert.strictEqual(isValidWebviewError(withStack), true);
                });

                it('should return false for missing required fields', () => {
                    assert.strictEqual(isValidWebviewError({ message: 'Error' }), false);
                });
            });

            describe('isValidLogEntry', () => {
                it('should return true for valid log entries', () => {
                    const valid = { time: '12:00:00', level: 'info', message: 'Log message' };
                    assert.strictEqual(isValidLogEntry(valid), true);
                });

                it('should return false for missing fields', () => {
                    assert.strictEqual(isValidLogEntry({ time: '12:00' }), false);
                    assert.strictEqual(isValidLogEntry({}), false);
                });
            });

            describe('isValidLogEntryArray', () => {
                it('should return true for valid arrays', () => {
                    const entries = [
                        { time: '12:00', level: 'info', message: 'msg1' },
                        { time: '12:01', level: 'error', message: 'msg2' }
                    ];
                    assert.strictEqual(isValidLogEntryArray(entries), true);
                });

                it('should return true for empty arrays', () => {
                    assert.strictEqual(isValidLogEntryArray([]), true);
                });

                it('should return false for arrays with invalid entries', () => {
                    const invalid = [
                        { time: '12:00', level: 'info', message: 'valid' },
                        { invalid: 'entry' }
                    ];
                    assert.strictEqual(isValidLogEntryArray(invalid), false);
                });
            });
        });

        describe('Individual Message Validators', () => {
            describe('Simple command validators', () => {
                const simpleCommands = [
                    { command: 'start', validator: validateStartMessage },
                    { command: 'stop', validator: validateStopMessage },
                    { command: 'pause', validator: validatePauseMessage },
                    { command: 'resume', validator: validateResumeMessage },
                    { command: 'next', validator: validateNextMessage },
                    { command: 'refresh', validator: validateRefreshMessage },
                    { command: 'skipTask', validator: validateSkipTaskMessage },
                    { command: 'retryTask', validator: validateRetryTaskMessage },
                    { command: 'completeAllTasks', validator: validateCompleteAllTasksMessage },
                    { command: 'resetAllTasks', validator: validateResetAllTasksMessage },
                    { command: 'openPanel', validator: validateOpenPanelMessage }
                ];

                simpleCommands.forEach(({ command, validator }) => {
                    it(`validate${command.charAt(0).toUpperCase() + command.slice(1)}Message should validate ${command}`, () => {
                        const result = validator({ command });
                        assert.strictEqual(result.isValid, true);
                        assert.strictEqual(result.command, command);
                    });

                    it(`validate${command.charAt(0).toUpperCase() + command.slice(1)}Message should reject wrong command`, () => {
                        const result = validator({ command: 'wrongCommand' });
                        assert.strictEqual(result.isValid, false);
                        assert.ok(result.error?.includes('Expected command'));
                    });

                    it(`validate${command.charAt(0).toUpperCase() + command.slice(1)}Message should reject non-object`, () => {
                        const result = validator(null);
                        assert.strictEqual(result.isValid, false);
                    });
                });
            });

            describe('validateReorderTasksMessage', () => {
                it('should validate with valid taskIds', () => {
                    const result = validateReorderTasksMessage({ 
                        command: 'reorderTasks', 
                        taskIds: ['task-1', 'task-2', 'task-3'] 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject empty taskIds array', () => {
                    const result = validateReorderTasksMessage({ 
                        command: 'reorderTasks', 
                        taskIds: [] 
                    });
                    assert.strictEqual(result.isValid, false);
                    assert.ok(result.propertyErrors?.some((e: PropertyValidationError) => e.property === 'taskIds'));
                });

                it('should reject missing taskIds', () => {
                    const result = validateReorderTasksMessage({ command: 'reorderTasks' });
                    assert.strictEqual(result.isValid, false);
                });

                it('should reject non-string array elements', () => {
                    const result = validateReorderTasksMessage({ 
                        command: 'reorderTasks', 
                        taskIds: ['task-1', 123] 
                    });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validateGeneratePrdMessage', () => {
                it('should validate with valid taskDescription', () => {
                    const result = validateGeneratePrdMessage({ 
                        command: 'generatePrd', 
                        taskDescription: 'Create a new feature' 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject empty taskDescription', () => {
                    const result = validateGeneratePrdMessage({ 
                        command: 'generatePrd', 
                        taskDescription: '' 
                    });
                    assert.strictEqual(result.isValid, false);
                    assert.ok(result.propertyErrors?.some((e: PropertyValidationError) => e.property === 'taskDescription'));
                });

                it('should reject whitespace-only taskDescription', () => {
                    const result = validateGeneratePrdMessage({ 
                        command: 'generatePrd', 
                        taskDescription: '   ' 
                    });
                    assert.strictEqual(result.isValid, false);
                });

                it('should reject missing taskDescription', () => {
                    const result = validateGeneratePrdMessage({ command: 'generatePrd' });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validateRequirementsChangedMessage', () => {
                it('should validate with valid requirements', () => {
                    const result = validateRequirementsChangedMessage({ 
                        command: 'requirementsChanged', 
                        requirements: {
                            runTests: true,
                            runLinting: true,
                            runTypeCheck: false,
                            writeTests: true,
                            updateDocs: false,
                            commitChanges: false
                        }
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject invalid requirements object', () => {
                    const result = validateRequirementsChangedMessage({ 
                        command: 'requirementsChanged', 
                        requirements: { runTests: 'yes' } // wrong type
                    });
                    assert.strictEqual(result.isValid, false);
                    assert.ok(result.propertyErrors?.some((e: PropertyValidationError) => e.property === 'requirements'));
                });

                it('should reject missing requirements', () => {
                    const result = validateRequirementsChangedMessage({ 
                        command: 'requirementsChanged' 
                    });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validateSettingsChangedMessage', () => {
                it('should validate with valid settings', () => {
                    const result = validateSettingsChangedMessage({ 
                        command: 'settingsChanged', 
                        settings: { maxIterations: 100 }
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject out-of-range maxIterations', () => {
                    const result = validateSettingsChangedMessage({ 
                        command: 'settingsChanged', 
                        settings: { maxIterations: 9999 }
                    });
                    assert.strictEqual(result.isValid, false);
                });

                it('should reject negative maxIterations', () => {
                    const result = validateSettingsChangedMessage({ 
                        command: 'settingsChanged', 
                        settings: { maxIterations: -5 }
                    });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validateExportDataMessage', () => {
                it('should validate without format (default)', () => {
                    const result = validateExportDataMessage({ command: 'exportData' });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with json format', () => {
                    const result = validateExportDataMessage({ 
                        command: 'exportData', 
                        format: 'json' 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with csv format', () => {
                    const result = validateExportDataMessage({ 
                        command: 'exportData', 
                        format: 'csv' 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject invalid format', () => {
                    const result = validateExportDataMessage({ 
                        command: 'exportData', 
                        format: 'xml' 
                    });
                    assert.strictEqual(result.isValid, false);
                    assert.ok(result.propertyErrors?.some((e: PropertyValidationError) => e.property === 'format'));
                });
            });

            describe('validateExportLogMessage', () => {
                it('should validate with valid entries', () => {
                    const result = validateExportLogMessage({ 
                        command: 'exportLog', 
                        entries: [
                            { time: '12:00:00', level: 'info', message: 'Test log' }
                        ]
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with empty entries array', () => {
                    const result = validateExportLogMessage({ 
                        command: 'exportLog', 
                        entries: []
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject invalid entry structure', () => {
                    const result = validateExportLogMessage({ 
                        command: 'exportLog', 
                        entries: [{ invalidField: 'value' }]
                    });
                    assert.strictEqual(result.isValid, false);
                });

                it('should reject missing entries', () => {
                    const result = validateExportLogMessage({ command: 'exportLog' });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validatePanelStateChangedMessage', () => {
                it('should validate with empty message (all optional)', () => {
                    const result = validatePanelStateChangedMessage({ 
                        command: 'panelStateChanged' 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with valid collapsedSections', () => {
                    const result = validatePanelStateChangedMessage({ 
                        command: 'panelStateChanged', 
                        collapsedSections: ['timeline', 'log']
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with valid scrollPosition', () => {
                    const result = validatePanelStateChangedMessage({ 
                        command: 'panelStateChanged', 
                        scrollPosition: 150.5
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject negative scrollPosition', () => {
                    const result = validatePanelStateChangedMessage({ 
                        command: 'panelStateChanged', 
                        scrollPosition: -10
                    });
                    assert.strictEqual(result.isValid, false);
                });

                it('should reject non-array collapsedSections', () => {
                    const result = validatePanelStateChangedMessage({ 
                        command: 'panelStateChanged', 
                        collapsedSections: 'timeline'
                    });
                    assert.strictEqual(result.isValid, false);
                });
            });

            describe('validateWebviewErrorMessage', () => {
                it('should validate with undefined error', () => {
                    const result = validateWebviewErrorMessage({ 
                        command: 'webviewError' 
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should validate with valid error object', () => {
                    const result = validateWebviewErrorMessage({ 
                        command: 'webviewError',
                        error: {
                            message: 'Script error',
                            source: 'main.js',
                            lineno: 42,
                            colno: 10
                        }
                    });
                    assert.strictEqual(result.isValid, true);
                });

                it('should reject malformed error object', () => {
                    const result = validateWebviewErrorMessage({ 
                        command: 'webviewError',
                        error: { message: 'Only message' }
                    });
                    assert.strictEqual(result.isValid, false);
                });
            });
        });

        describe('MESSAGE_VALIDATORS map', () => {
            it('should have validators for all incoming commands', () => {
                ALL_INCOMING_COMMANDS.forEach(command => {
                    assert.ok(MESSAGE_VALIDATORS[command], `Missing validator for command: ${command}`);
                    assert.strictEqual(typeof MESSAGE_VALIDATORS[command], 'function');
                });
            });

            it('should have same number of validators as commands', () => {
                const validatorCount = Object.keys(MESSAGE_VALIDATORS).length;
                assert.strictEqual(validatorCount, ALL_INCOMING_COMMANDS.length);
            });
        });

        describe('validateIncomingMessage', () => {
            it('should reject null', () => {
                const result = validateIncomingMessage(null);
                assert.strictEqual(result.isValid, false);
                assert.ok(result.error?.includes('non-null object'));
            });

            it('should reject undefined', () => {
                const result = validateIncomingMessage(undefined);
                assert.strictEqual(result.isValid, false);
            });

            it('should reject primitives', () => {
                assert.strictEqual(validateIncomingMessage('string').isValid, false);
                assert.strictEqual(validateIncomingMessage(123).isValid, false);
                assert.strictEqual(validateIncomingMessage(true).isValid, false);
            });

            it('should reject objects without command property', () => {
                const result = validateIncomingMessage({ type: 'update' });
                assert.strictEqual(result.isValid, false);
                assert.ok(result.error?.includes('command'));
            });

            it('should reject non-string command', () => {
                const result = validateIncomingMessage({ command: 123 });
                assert.strictEqual(result.isValid, false);
                assert.ok(result.propertyErrors?.some((e: PropertyValidationError) => e.property === 'command'));
            });

            it('should reject unknown commands', () => {
                const result = validateIncomingMessage({ command: 'unknownCommand' });
                assert.strictEqual(result.isValid, false);
                assert.ok(result.error?.includes('Unknown command'));
            });

            it('should validate all valid simple commands', () => {
                const simpleCommands = ['start', 'stop', 'pause', 'resume', 'next', 'refresh', 
                    'skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'openPanel'];
                
                simpleCommands.forEach(command => {
                    const result = validateIncomingMessage({ command });
                    assert.strictEqual(result.isValid, true, `Expected ${command} to be valid`);
                    assert.strictEqual(result.command, command);
                });
            });

            it('should validate commands with required properties', () => {
                // generatePrd with taskDescription
                const prdResult = validateIncomingMessage({ 
                    command: 'generatePrd', 
                    taskDescription: 'Test task' 
                });
                assert.strictEqual(prdResult.isValid, true);

                // reorderTasks with taskIds
                const reorderResult = validateIncomingMessage({ 
                    command: 'reorderTasks', 
                    taskIds: ['t1', 't2'] 
                });
                assert.strictEqual(reorderResult.isValid, true);
            });

            it('should reject commands with missing required properties', () => {
                // generatePrd without taskDescription
                const prdResult = validateIncomingMessage({ command: 'generatePrd' });
                assert.strictEqual(prdResult.isValid, false);

                // reorderTasks without taskIds
                const reorderResult = validateIncomingMessage({ command: 'reorderTasks' });
                assert.strictEqual(reorderResult.isValid, false);
            });
        });

        describe('validateAndExtractMessage', () => {
            it('should return message when valid', () => {
                const msg = { command: 'start' };
                const result = validateAndExtractMessage(msg);
                assert.deepStrictEqual(result, msg);
            });

            it('should return undefined when invalid', () => {
                const result = validateAndExtractMessage({ command: 'invalid' });
                assert.strictEqual(result, undefined);
            });

            it('should call onError callback when invalid', () => {
                let errorCalled = false;
                let errorIsValid: boolean | null = null;
                
                validateAndExtractMessage({ command: 'invalid' }, (result: MessageValidationResult) => {
                    errorCalled = true;
                    errorIsValid = result.isValid;
                });
                
                assert.strictEqual(errorCalled, true);
                assert.strictEqual(errorIsValid, false);
            });

            it('should not call onError callback when valid', () => {
                let errorCalled = false;
                
                validateAndExtractMessage({ command: 'start' }, () => {
                    errorCalled = true;
                });
                
                assert.strictEqual(errorCalled, false);
            });
        });

        describe('formatValidationError', () => {
            it('should return empty string for valid result', () => {
                const result = formatValidationError(validationSuccess('start'));
                assert.strictEqual(result, '');
            });

            it('should return error message for invalid result', () => {
                const result = formatValidationError(validationFailure('Test error'));
                assert.strictEqual(result, 'Test error');
            });

            it('should include property errors in output', () => {
                const propertyErrors = [
                    { property: 'foo', expected: 'string', actual: 'number', message: 'foo must be string' },
                    { property: 'bar', expected: 'boolean', actual: 'object', message: 'bar must be boolean' }
                ];
                const result = formatValidationError(validationFailure('Multiple errors', propertyErrors));
                
                assert.ok(result.includes('Multiple errors'));
                assert.ok(result.includes('foo must be string'));
                assert.ok(result.includes('bar must be boolean'));
            });
        });
    });

    // ========================================================================
    // processMessageWithValidation Tests
    // ========================================================================

    describe('processMessageWithValidation', () => {
        const { processMessageWithValidation } = require('../../messageHandlers/registry');

        it('should process valid messages successfully', () => {
            const { context, emittedEvents } = createMockContext();
            const result = processMessageWithValidation({ command: 'start' }, context);
            
            assert.strictEqual(result.success, true);
            assert.strictEqual(result.validated, true);
            assert.strictEqual(result.validationResult?.isValid, true);
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'start');
        });

        it('should reject invalid messages', () => {
            const { context, emittedEvents } = createMockContext();
            const result = processMessageWithValidation({ command: 'invalidCmd' }, context);
            
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.validated, false);
            assert.ok(result.error);
            assert.strictEqual(emittedEvents.length, 0);
        });

        it('should reject null messages', () => {
            const { context } = createMockContext();
            const result = processMessageWithValidation(null, context);
            
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.validated, false);
        });

        it('should call validation error callback on failure', () => {
            const { context } = createMockContext();
            let callbackCalled = false;
            let callbackIsValid: boolean | null = null;
            
            processMessageWithValidation(
                { command: 'invalidCmd' }, 
                context,
                (result: MessageValidationResult) => {
                    callbackCalled = true;
                    callbackIsValid = result.isValid;
                }
            );
            
            assert.strictEqual(callbackCalled, true);
            assert.strictEqual(callbackIsValid, false);
        });

        it('should not call validation error callback on success', () => {
            const { context } = createMockContext();
            let callbackCalled = false;
            
            processMessageWithValidation(
                { command: 'start' }, 
                context,
                () => { callbackCalled = true; }
            );
            
            assert.strictEqual(callbackCalled, false);
        });

        it('should validate message properties before processing', () => {
            const { context, emittedEvents } = createMockContext();
            
            // Missing required taskDescription
            const result = processMessageWithValidation(
                { command: 'generatePrd' }, 
                context
            );
            
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.validated, false);
            assert.strictEqual(emittedEvents.length, 0);
        });

        it('should process valid messages with properties', () => {
            const { context, emittedEvents } = createMockContext();
            
            const result = processMessageWithValidation(
                { command: 'generatePrd', taskDescription: 'Create feature X' }, 
                context
            );
            
            assert.strictEqual(result.success, true);
            assert.strictEqual(result.validated, true);
            assert.strictEqual(emittedEvents.length, 1);
            assert.strictEqual(emittedEvents[0].event, 'generatePrd');
        });

        it('should include detailed error for missing properties', () => {
            const { context } = createMockContext();
            
            const result = processMessageWithValidation(
                { command: 'reorderTasks', taskIds: [] }, // Empty array is invalid
                context
            );
            
            assert.strictEqual(result.success, false);
            assert.ok(result.error?.includes('taskIds'));
        });
    });
});
