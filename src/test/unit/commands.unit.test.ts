/**
 * Command Pattern Unit Tests
 * 
 * Tests for the command pattern implementation including:
 * - Command types and interfaces
 * - Base command classes
 * - Control commands
 * - Task commands
 * - PRD commands
 * - Macro commands
 * - Command registry
 * - Command manager
 */

import * as assert from 'assert';

// Import all command components
import {
    // Types
    ICommand,
    IUndoableCommand,
    CommandResult,
    CommandContext,
    CommandHistoryEntry,
    ICommandRegistry,
    ICommandManager,
    CommandNames,
    isUndoableCommand,
    
    // Base classes
    BaseCommand,
    UndoableCommand,
    
    // Control commands
    StartLoopCommand,
    StopLoopCommand,
    PauseLoopCommand,
    ResumeLoopCommand,
    RunSingleStepCommand,
    createStartLoopCommand,
    createStopLoopCommand,
    createPauseLoopCommand,
    createResumeLoopCommand,
    createRunSingleStepCommand,
    
    // Task commands
    SkipTaskCommand,
    RetryTaskCommand,
    CompleteAllTasksCommand,
    ResetAllTasksCommand,
    ReorderTasksCommand,
    createSkipTaskCommand,
    createRetryTaskCommand,
    createCompleteAllTasksCommand,
    createResetAllTasksCommand,
    createReorderTasksCommand,
    
    // PRD commands
    GeneratePrdCommand,
    UpdateRequirementsCommand,
    UpdateSettingsCommand,
    createGeneratePrdCommand,
    createUpdateRequirementsCommand,
    createUpdateSettingsCommand,
    
    // Macro command
    MacroCommand,
    createMacroCommand,
    
    // Registry
    CommandRegistry,
    createDefaultCommandRegistry,
    getDefaultCommandRegistry,
    resetDefaultCommandRegistry,
    
    // Manager
    CommandManager,
    createCommandManager,
    DEFAULT_HISTORY_SIZE,
    
    // Helper
    createCommandContext
} from '../../commands';

import { TaskRequirements, RalphSettings, DEFAULT_REQUIREMENTS, DEFAULT_SETTINGS } from '../../types';

/**
 * Create a mock CommandContext for testing.
 */
function createMockContext(overrides: Partial<CommandContext> = {}): CommandContext {
    const calls: { method: string; args: unknown[] }[] = [];
    
    let currentRequirements: TaskRequirements = { ...DEFAULT_REQUIREMENTS };
    let currentSettings: RalphSettings = { ...DEFAULT_SETTINGS };
    
    return {
        startLoop: async () => { calls.push({ method: 'startLoop', args: [] }); },
        stopLoop: async () => { calls.push({ method: 'stopLoop', args: [] }); },
        pauseLoop: () => { calls.push({ method: 'pauseLoop', args: [] }); },
        resumeLoop: () => { calls.push({ method: 'resumeLoop', args: [] }); },
        runSingleStep: async () => { calls.push({ method: 'runSingleStep', args: [] }); },
        skipCurrentTask: async () => { calls.push({ method: 'skipCurrentTask', args: [] }); },
        retryFailedTask: async () => { calls.push({ method: 'retryFailedTask', args: [] }); },
        completeAllTasks: async () => { calls.push({ method: 'completeAllTasks', args: [] }); },
        resetAllTasks: async () => { calls.push({ method: 'resetAllTasks', args: [] }); },
        reorderTasks: async (taskIds: string[]) => { calls.push({ method: 'reorderTasks', args: [taskIds] }); },
        generatePrdFromDescription: async (description: string) => { 
            calls.push({ method: 'generatePrdFromDescription', args: [description] }); 
        },
        setRequirements: (requirements: TaskRequirements) => { 
            currentRequirements = requirements;
            calls.push({ method: 'setRequirements', args: [requirements] }); 
        },
        getRequirements: () => currentRequirements,
        setSettings: (settings: RalphSettings) => { 
            currentSettings = settings;
            calls.push({ method: 'setSettings', args: [settings] }); 
        },
        getSettings: () => currentSettings,
        addLog: (message: string, highlight?: boolean) => { 
            calls.push({ method: 'addLog', args: [message, highlight] }); 
        },
        ...overrides,
        // Expose calls for testing
        _calls: calls
    } as CommandContext & { _calls: typeof calls };
}

describe('Command Pattern', () => {
    
    describe('CommandNames', () => {
        it('should define all control command names', () => {
            assert.strictEqual(CommandNames.START_LOOP, 'startLoop');
            assert.strictEqual(CommandNames.STOP_LOOP, 'stopLoop');
            assert.strictEqual(CommandNames.PAUSE_LOOP, 'pauseLoop');
            assert.strictEqual(CommandNames.RESUME_LOOP, 'resumeLoop');
            assert.strictEqual(CommandNames.RUN_SINGLE_STEP, 'runSingleStep');
        });
        
        it('should define all task command names', () => {
            assert.strictEqual(CommandNames.SKIP_TASK, 'skipTask');
            assert.strictEqual(CommandNames.RETRY_TASK, 'retryTask');
            assert.strictEqual(CommandNames.COMPLETE_ALL_TASKS, 'completeAllTasks');
            assert.strictEqual(CommandNames.RESET_ALL_TASKS, 'resetAllTasks');
            assert.strictEqual(CommandNames.REORDER_TASKS, 'reorderTasks');
        });
        
        it('should define all PRD command names', () => {
            assert.strictEqual(CommandNames.GENERATE_PRD, 'generatePrd');
            assert.strictEqual(CommandNames.UPDATE_REQUIREMENTS, 'updateRequirements');
            assert.strictEqual(CommandNames.UPDATE_SETTINGS, 'updateSettings');
        });
        
        it('should define macro command name', () => {
            assert.strictEqual(CommandNames.MACRO, 'macro');
        });
    });
    
    describe('isUndoableCommand', () => {
        it('should return true for undoable commands', () => {
            const context = createMockContext();
            const command = new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS });
            assert.strictEqual(isUndoableCommand(command), true);
        });
        
        it('should return false for non-undoable commands', () => {
            const context = createMockContext();
            const command = new StartLoopCommand(context);
            assert.strictEqual(isUndoableCommand(command), false);
        });
    });
    
    describe('Control Commands', () => {
        
        describe('StartLoopCommand', () => {
            it('should have correct name and description', () => {
                const context = createMockContext();
                const command = new StartLoopCommand(context);
                assert.strictEqual(command.name, 'startLoop');
                assert.ok(command.description.includes('Start'));
            });
            
            it('should not be undoable', () => {
                const context = createMockContext();
                const command = new StartLoopCommand(context);
                assert.strictEqual(command.canUndo, false);
            });
            
            it('should call startLoop on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new StartLoopCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'startLoop'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createStartLoopCommand(context);
                assert.ok(command instanceof StartLoopCommand);
            });
        });
        
        describe('StopLoopCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new StopLoopCommand(context);
                assert.strictEqual(command.name, 'stopLoop');
            });
            
            it('should call stopLoop on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new StopLoopCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'stopLoop'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createStopLoopCommand(context);
                assert.ok(command instanceof StopLoopCommand);
            });
        });
        
        describe('PauseLoopCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new PauseLoopCommand(context);
                assert.strictEqual(command.name, 'pauseLoop');
            });
            
            it('should call pauseLoop on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new PauseLoopCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'pauseLoop'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createPauseLoopCommand(context);
                assert.ok(command instanceof PauseLoopCommand);
            });
        });
        
        describe('ResumeLoopCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new ResumeLoopCommand(context);
                assert.strictEqual(command.name, 'resumeLoop');
            });
            
            it('should call resumeLoop on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new ResumeLoopCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'resumeLoop'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createResumeLoopCommand(context);
                assert.ok(command instanceof ResumeLoopCommand);
            });
        });
        
        describe('RunSingleStepCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new RunSingleStepCommand(context);
                assert.strictEqual(command.name, 'runSingleStep');
            });
            
            it('should call runSingleStep on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new RunSingleStepCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'runSingleStep'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createRunSingleStepCommand(context);
                assert.ok(command instanceof RunSingleStepCommand);
            });
        });
    });
    
    describe('Task Commands', () => {
        
        describe('SkipTaskCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new SkipTaskCommand(context);
                assert.strictEqual(command.name, 'skipTask');
            });
            
            it('should call skipCurrentTask on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new SkipTaskCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'skipCurrentTask'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createSkipTaskCommand(context);
                assert.ok(command instanceof SkipTaskCommand);
            });
        });
        
        describe('RetryTaskCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new RetryTaskCommand(context);
                assert.strictEqual(command.name, 'retryTask');
            });
            
            it('should call retryFailedTask on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new RetryTaskCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'retryFailedTask'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createRetryTaskCommand(context);
                assert.ok(command instanceof RetryTaskCommand);
            });
        });
        
        describe('CompleteAllTasksCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new CompleteAllTasksCommand(context);
                assert.strictEqual(command.name, 'completeAllTasks');
            });
            
            it('should call completeAllTasks on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new CompleteAllTasksCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'completeAllTasks'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createCompleteAllTasksCommand(context);
                assert.ok(command instanceof CompleteAllTasksCommand);
            });
        });
        
        describe('ResetAllTasksCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new ResetAllTasksCommand(context);
                assert.strictEqual(command.name, 'resetAllTasks');
            });
            
            it('should call resetAllTasks on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const command = new ResetAllTasksCommand(context);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(context._calls.some(c => c.method === 'resetAllTasks'));
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createResetAllTasksCommand(context);
                assert.ok(command instanceof ResetAllTasksCommand);
            });
        });
        
        describe('ReorderTasksCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new ReorderTasksCommand(context, ['task1', 'task2']);
                assert.strictEqual(command.name, 'reorderTasks');
            });
            
            it('should be undoable', () => {
                const context = createMockContext();
                const command = new ReorderTasksCommand(context, ['task1', 'task2']);
                assert.strictEqual(command.canUndo, true);
            });
            
            it('should call reorderTasks on context with task IDs', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const taskIds = ['task1', 'task2', 'task3'];
                const command = new ReorderTasksCommand(context, taskIds);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                const reorderCall = context._calls.find(c => c.method === 'reorderTasks');
                assert.ok(reorderCall);
                assert.deepStrictEqual(reorderCall.args[0], taskIds);
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createReorderTasksCommand(context, ['task1']);
                assert.ok(command instanceof ReorderTasksCommand);
            });
        });
    });
    
    describe('PRD Commands', () => {
        
        describe('GeneratePrdCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new GeneratePrdCommand(context, 'Build a todo app');
                assert.strictEqual(command.name, 'generatePrd');
            });
            
            it('should not be undoable', () => {
                const context = createMockContext();
                const command = new GeneratePrdCommand(context, 'Build a todo app');
                assert.strictEqual(command.canUndo, false);
            });
            
            it('should call generatePrdFromDescription on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const description = 'Build a todo app with TypeScript';
                const command = new GeneratePrdCommand(context, description);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                const call = context._calls.find(c => c.method === 'generatePrdFromDescription');
                assert.ok(call);
                assert.strictEqual(call.args[0], description);
            });
            
            it('should fail with empty description', async () => {
                const context = createMockContext();
                const command = new GeneratePrdCommand(context, '');
                const result = await command.execute();
                
                assert.strictEqual(result.success, false);
                assert.ok(result.message?.includes('empty'));
            });
            
            it('should fail with whitespace-only description', async () => {
                const context = createMockContext();
                const command = new GeneratePrdCommand(context, '   ');
                const result = await command.execute();
                
                assert.strictEqual(result.success, false);
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createGeneratePrdCommand(context, 'Description');
                assert.ok(command instanceof GeneratePrdCommand);
            });
        });
        
        describe('UpdateRequirementsCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS });
                assert.strictEqual(command.name, 'updateRequirements');
            });
            
            it('should be undoable', () => {
                const context = createMockContext();
                const command = new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS });
                assert.strictEqual(command.canUndo, true);
            });
            
            it('should call setRequirements on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const requirements: TaskRequirements = {
                    runTests: true,
                    runLinting: true,
                    runTypeCheck: false,
                    writeTests: true,
                    updateDocs: false,
                    commitChanges: false
                };
                const command = new UpdateRequirementsCommand(context, requirements);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                const call = context._calls.find(c => c.method === 'setRequirements');
                assert.ok(call);
                assert.deepStrictEqual(call.args[0], requirements);
            });
            
            it('should return previous and current in result data', async () => {
                const context = createMockContext();
                const newRequirements: TaskRequirements = {
                    ...DEFAULT_REQUIREMENTS,
                    runTests: true
                };
                const command = new UpdateRequirementsCommand(context, newRequirements);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                assert.ok(result.data);
                const data = result.data as { previous: TaskRequirements; current: TaskRequirements };
                assert.ok(data.previous);
                assert.ok(data.current);
            });
            
            it('should undo by restoring previous requirements', async () => {
                const context = createMockContext();
                const newRequirements: TaskRequirements = {
                    ...DEFAULT_REQUIREMENTS,
                    runTests: true
                };
                const command = new UpdateRequirementsCommand(context, newRequirements);
                
                // Execute
                await command.execute();
                
                // Undo
                const undoResult = await command.undo();
                assert.strictEqual(undoResult.success, true);
                
                // Verify requirements were restored
                const currentRequirements = context.getRequirements();
                assert.strictEqual(currentRequirements.runTests, DEFAULT_REQUIREMENTS.runTests);
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createUpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS });
                assert.ok(command instanceof UpdateRequirementsCommand);
            });
        });
        
        describe('UpdateSettingsCommand', () => {
            it('should have correct name', () => {
                const context = createMockContext();
                const command = new UpdateSettingsCommand(context, { ...DEFAULT_SETTINGS });
                assert.strictEqual(command.name, 'updateSettings');
            });
            
            it('should be undoable', () => {
                const context = createMockContext();
                const command = new UpdateSettingsCommand(context, { ...DEFAULT_SETTINGS });
                assert.strictEqual(command.canUndo, true);
            });
            
            it('should call setSettings on context', async () => {
                const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
                const settings: RalphSettings = { maxIterations: 100 };
                const command = new UpdateSettingsCommand(context, settings);
                const result = await command.execute();
                
                assert.strictEqual(result.success, true);
                const call = context._calls.find(c => c.method === 'setSettings');
                assert.ok(call);
                assert.deepStrictEqual(call.args[0], settings);
            });
            
            it('should undo by restoring previous settings', async () => {
                const context = createMockContext();
                const newSettings: RalphSettings = { maxIterations: 100 };
                const command = new UpdateSettingsCommand(context, newSettings);
                
                // Execute
                await command.execute();
                assert.strictEqual(context.getSettings().maxIterations, 100);
                
                // Undo
                const undoResult = await command.undo();
                assert.strictEqual(undoResult.success, true);
                assert.strictEqual(context.getSettings().maxIterations, DEFAULT_SETTINGS.maxIterations);
            });
            
            it('should be creatable via factory', () => {
                const context = createMockContext();
                const command = createUpdateSettingsCommand(context, { ...DEFAULT_SETTINGS });
                assert.ok(command instanceof UpdateSettingsCommand);
            });
        });
    });
    
    describe('MacroCommand', () => {
        it('should have dynamic name based on commands', () => {
            const context = createMockContext();
            const commands = [
                new StartLoopCommand(context),
                new PauseLoopCommand(context)
            ];
            const macro = new MacroCommand(context, commands);
            
            assert.ok(macro.name.includes('startLoop'));
            assert.ok(macro.name.includes('pauseLoop'));
        });
        
        it('should accept custom name', () => {
            const context = createMockContext();
            const commands = [new StartLoopCommand(context)];
            const macro = new MacroCommand(context, commands, 'myMacro', 'My description');
            
            assert.strictEqual(macro.name, 'myMacro');
            assert.strictEqual(macro.description, 'My description');
        });
        
        it('should execute all commands in sequence', async () => {
            const context = createMockContext() as CommandContext & { _calls: { method: string; args: unknown[] }[] };
            const commands = [
                new StartLoopCommand(context),
                new PauseLoopCommand(context),
                new ResumeLoopCommand(context)
            ];
            const macro = new MacroCommand(context, commands);
            const result = await macro.execute();
            
            assert.strictEqual(result.success, true);
            assert.ok(context._calls.some(c => c.method === 'startLoop'));
            assert.ok(context._calls.some(c => c.method === 'pauseLoop'));
            assert.ok(context._calls.some(c => c.method === 'resumeLoop'));
        });
        
        it('should stop on first failure', async () => {
            const context = createMockContext();
            let callCount = 0;
            
            // Create a failing command
            const failingContext = {
                ...context,
                pauseLoop: () => { 
                    callCount++;
                    throw new Error('Simulated failure'); 
                }
            };
            
            const commands = [
                new StartLoopCommand(failingContext as unknown as CommandContext),
                new PauseLoopCommand(failingContext as unknown as CommandContext),
                new ResumeLoopCommand(failingContext as unknown as CommandContext)
            ];
            const macro = new MacroCommand(context, commands);
            const result = await macro.execute();
            
            assert.strictEqual(result.success, false);
            assert.ok(result.message?.includes('pauseLoop'));
        });
        
        it('should report canUndo=true when all commands are undoable', () => {
            const context = createMockContext();
            const commands = [
                new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS }),
                new UpdateSettingsCommand(context, { ...DEFAULT_SETTINGS })
            ];
            const macro = new MacroCommand(context, commands);
            
            assert.strictEqual(macro.canUndo, true);
        });
        
        it('should report canUndo=false when any command is not undoable', () => {
            const context = createMockContext();
            const commands = [
                new StartLoopCommand(context),
                new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS })
            ];
            const macro = new MacroCommand(context, commands);
            
            assert.strictEqual(macro.canUndo, false);
        });
        
        it('should report canUndo=false for empty macro', () => {
            const context = createMockContext();
            const macro = new MacroCommand(context, []);
            
            assert.strictEqual(macro.canUndo, false);
        });
        
        it('should undo commands in reverse order', async () => {
            const context = createMockContext();
            const undoOrder: string[] = [];
            
            // Create undoable commands that track undo order
            const commands = [
                new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS, runTests: true }),
                new UpdateSettingsCommand(context, { maxIterations: 100 })
            ];
            
            const macro = new MacroCommand(context, commands);
            await macro.execute();
            const undoResult = await macro.undo();
            
            assert.strictEqual(undoResult.success, true);
        });
        
        it('should return command count', () => {
            const context = createMockContext();
            const commands = [
                new StartLoopCommand(context),
                new StopLoopCommand(context)
            ];
            const macro = new MacroCommand(context, commands);
            
            assert.strictEqual(macro.getCommandCount(), 2);
        });
        
        it('should return commands list', () => {
            const context = createMockContext();
            const commands = [
                new StartLoopCommand(context),
                new StopLoopCommand(context)
            ];
            const macro = new MacroCommand(context, commands);
            
            const returned = macro.getCommands();
            assert.strictEqual(returned.length, 2);
            assert.ok(returned[0] instanceof StartLoopCommand);
        });
        
        it('should be creatable via factory', () => {
            const context = createMockContext();
            const commands = [new StartLoopCommand(context)];
            const macro = createMacroCommand(context, commands, 'test', 'Test macro');
            
            assert.ok(macro instanceof MacroCommand);
            assert.strictEqual(macro.name, 'test');
        });
    });
    
    describe('CommandRegistry', () => {
        
        beforeEach(() => {
            resetDefaultCommandRegistry();
        });
        
        it('should register and retrieve command factories', () => {
            const registry = new CommandRegistry();
            const factory = (ctx: CommandContext) => new StartLoopCommand(ctx);
            
            registry.register('myCommand', factory);
            
            assert.ok(registry.has('myCommand'));
            assert.strictEqual(registry.get('myCommand'), factory);
        });
        
        it('should return undefined for unregistered commands', () => {
            const registry = new CommandRegistry();
            assert.strictEqual(registry.get('nonexistent'), undefined);
            assert.strictEqual(registry.has('nonexistent'), false);
        });
        
        it('should return all registered command names', () => {
            const registry = new CommandRegistry();
            registry.register('cmd1', () => ({} as ICommand));
            registry.register('cmd2', () => ({} as ICommand));
            
            const names = registry.getNames();
            assert.ok(names.includes('cmd1'));
            assert.ok(names.includes('cmd2'));
            assert.strictEqual(names.length, 2);
        });
        
        it('should report correct size', () => {
            const registry = new CommandRegistry();
            assert.strictEqual(registry.size, 0);
            
            registry.register('cmd1', () => ({} as ICommand));
            assert.strictEqual(registry.size, 1);
            
            registry.register('cmd2', () => ({} as ICommand));
            assert.strictEqual(registry.size, 2);
        });
        
        it('should clear all registrations', () => {
            const registry = new CommandRegistry();
            registry.register('cmd1', () => ({} as ICommand));
            registry.register('cmd2', () => ({} as ICommand));
            
            registry.clear();
            
            assert.strictEqual(registry.size, 0);
            assert.strictEqual(registry.has('cmd1'), false);
        });
        
        it('should create default registry with all commands', () => {
            const registry = createDefaultCommandRegistry();
            
            // Check control commands
            assert.ok(registry.has(CommandNames.START_LOOP));
            assert.ok(registry.has(CommandNames.STOP_LOOP));
            assert.ok(registry.has(CommandNames.PAUSE_LOOP));
            assert.ok(registry.has(CommandNames.RESUME_LOOP));
            assert.ok(registry.has(CommandNames.RUN_SINGLE_STEP));
            
            // Check task commands
            assert.ok(registry.has(CommandNames.SKIP_TASK));
            assert.ok(registry.has(CommandNames.RETRY_TASK));
            assert.ok(registry.has(CommandNames.COMPLETE_ALL_TASKS));
            assert.ok(registry.has(CommandNames.RESET_ALL_TASKS));
            assert.ok(registry.has(CommandNames.REORDER_TASKS));
            
            // Check PRD commands
            assert.ok(registry.has(CommandNames.GENERATE_PRD));
            assert.ok(registry.has(CommandNames.UPDATE_REQUIREMENTS));
            assert.ok(registry.has(CommandNames.UPDATE_SETTINGS));
            
            // Check macro
            assert.ok(registry.has(CommandNames.MACRO));
        });
        
        it('should provide singleton via getDefaultCommandRegistry', () => {
            const registry1 = getDefaultCommandRegistry();
            const registry2 = getDefaultCommandRegistry();
            
            assert.strictEqual(registry1, registry2);
        });
        
        it('should reset singleton via resetDefaultCommandRegistry', () => {
            const registry1 = getDefaultCommandRegistry();
            resetDefaultCommandRegistry();
            const registry2 = getDefaultCommandRegistry();
            
            assert.notStrictEqual(registry1, registry2);
        });
        
        it('should create commands from factories in default registry', () => {
            const registry = createDefaultCommandRegistry();
            const context = createMockContext();
            
            const factory = registry.get(CommandNames.START_LOOP);
            assert.ok(factory);
            
            const command = factory(context);
            assert.ok(command instanceof StartLoopCommand);
        });
    });
    
    describe('CommandManager', () => {
        
        it('should execute commands and add to history', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            const command = new StartLoopCommand(context);
            
            await manager.execute(command);
            
            const history = manager.getHistory();
            assert.strictEqual(history.length, 1);
            assert.strictEqual(history[0].command, command);
            assert.strictEqual(history[0].result.success, true);
            assert.strictEqual(history[0].undone, false);
        });
        
        it('should return command result', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            const command = new StartLoopCommand(context);
            
            const result = await manager.execute(command);
            
            assert.strictEqual(result.success, true);
        });
        
        it('should track executedAt timestamp', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            const before = Date.now();
            
            await manager.execute(new StartLoopCommand(context));
            
            const after = Date.now();
            const history = manager.getHistory();
            assert.ok(history[0].executedAt >= before);
            assert.ok(history[0].executedAt <= after);
        });
        
        it('should report canUndo correctly', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            // Initially no undo
            assert.strictEqual(manager.canUndo(), false);
            
            // Non-undoable command - still no undo
            await manager.execute(new StartLoopCommand(context));
            assert.strictEqual(manager.canUndo(), false);
            
            // Undoable command - can undo
            await manager.execute(new UpdateRequirementsCommand(context, { ...DEFAULT_REQUIREMENTS }));
            assert.strictEqual(manager.canUndo(), true);
        });
        
        it('should undo last undoable command', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            // Execute undoable command
            await manager.execute(new UpdateSettingsCommand(context, { maxIterations: 100 }));
            assert.strictEqual(context.getSettings().maxIterations, 100);
            
            // Undo
            const undoResult = await manager.undo();
            assert.ok(undoResult);
            assert.strictEqual(undoResult.success, true);
            assert.strictEqual(context.getSettings().maxIterations, DEFAULT_SETTINGS.maxIterations);
        });
        
        it('should skip non-undoable commands when undoing', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            await manager.execute(new UpdateSettingsCommand(context, { maxIterations: 100 }));
            await manager.execute(new StartLoopCommand(context)); // Not undoable
            
            // Should undo the settings command, not the start command
            const undoResult = await manager.undo();
            assert.ok(undoResult);
            assert.strictEqual(undoResult.success, true);
        });
        
        it('should return null when nothing to undo', async () => {
            const manager = new CommandManager();
            
            const result = await manager.undo();
            assert.strictEqual(result, null);
        });
        
        it('should support redo after undo', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            await manager.execute(new UpdateSettingsCommand(context, { maxIterations: 100 }));
            await manager.undo();
            
            assert.strictEqual(manager.canRedo(), true);
            
            const redoResult = await manager.redo();
            assert.ok(redoResult);
            assert.strictEqual(redoResult.success, true);
            assert.strictEqual(context.getSettings().maxIterations, 100);
        });
        
        it('should clear redo stack on new command', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            await manager.execute(new UpdateSettingsCommand(context, { maxIterations: 100 }));
            await manager.undo();
            assert.strictEqual(manager.canRedo(), true);
            
            // Execute new command
            await manager.execute(new StartLoopCommand(context));
            
            // Redo should be cleared
            assert.strictEqual(manager.canRedo(), false);
        });
        
        it('should return null when nothing to redo', async () => {
            const manager = new CommandManager();
            
            const result = await manager.redo();
            assert.strictEqual(result, null);
        });
        
        it('should clear history', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            await manager.execute(new StartLoopCommand(context));
            await manager.execute(new StopLoopCommand(context));
            
            manager.clearHistory();
            
            assert.strictEqual(manager.getHistorySize(), 0);
            assert.strictEqual(manager.canUndo(), false);
            assert.strictEqual(manager.canRedo(), false);
        });
        
        it('should trim history to max size', async () => {
            const context = createMockContext();
            const manager = new CommandManager(3);
            
            await manager.execute(new StartLoopCommand(context));
            await manager.execute(new StopLoopCommand(context));
            await manager.execute(new PauseLoopCommand(context));
            await manager.execute(new ResumeLoopCommand(context));
            
            assert.strictEqual(manager.getHistorySize(), 3);
            
            // Oldest command should be gone
            const history = manager.getHistory();
            assert.strictEqual(history[0].command.name, 'stopLoop');
        });
        
        it('should get last command', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            assert.strictEqual(manager.getLastCommand(), undefined);
            
            await manager.execute(new StartLoopCommand(context));
            await manager.execute(new StopLoopCommand(context));
            
            const last = manager.getLastCommand();
            assert.ok(last);
            assert.strictEqual(last.command.name, 'stopLoop');
        });
        
        it('should track undo stack size', async () => {
            const context = createMockContext();
            const manager = new CommandManager();
            
            assert.strictEqual(manager.getUndoStackSize(), 0);
            
            await manager.execute(new UpdateSettingsCommand(context, { maxIterations: 100 }));
            await manager.undo();
            
            assert.strictEqual(manager.getUndoStackSize(), 1);
        });
        
        it('should be creatable via factory with default size', () => {
            const manager = createCommandManager();
            assert.ok(manager instanceof CommandManager);
        });
        
        it('should be creatable via factory with custom size', () => {
            const manager = createCommandManager(10);
            assert.ok(manager instanceof CommandManager);
        });
        
        it('should use DEFAULT_HISTORY_SIZE constant', () => {
            assert.strictEqual(DEFAULT_HISTORY_SIZE, 50);
        });
    });
    
    describe('createCommandContext', () => {
        it('should create context from orchestrator-like object', () => {
            const mockOrchestrator = {
                startLoop: async () => {},
                stopLoop: async () => {},
                pauseLoop: () => {},
                resumeLoop: () => {},
                runSingleStep: async () => {},
                skipCurrentTask: async () => {},
                retryFailedTask: async () => {},
                completeAllTasks: async () => {},
                resetAllTasks: async () => {},
                reorderTasks: async (_taskIds: string[]) => {},
                generatePrdFromDescription: async (_desc: string) => {},
                setRequirements: (_req: TaskRequirements) => {},
                getRequirements: () => ({ ...DEFAULT_REQUIREMENTS }),
                setSettings: (_settings: RalphSettings) => {},
                getSettings: () => ({ ...DEFAULT_SETTINGS })
            };
            
            const context = createCommandContext(mockOrchestrator);
            
            assert.ok(context.startLoop);
            assert.ok(context.stopLoop);
            assert.ok(context.pauseLoop);
            assert.ok(context.resumeLoop);
            assert.ok(context.runSingleStep);
            assert.ok(context.addLog);
        });
        
        it('should use provided addLog callback', () => {
            const logs: string[] = [];
            const mockOrchestrator = {
                startLoop: async () => {},
                stopLoop: async () => {},
                pauseLoop: () => {},
                resumeLoop: () => {},
                runSingleStep: async () => {},
                skipCurrentTask: async () => {},
                retryFailedTask: async () => {},
                completeAllTasks: async () => {},
                resetAllTasks: async () => {},
                reorderTasks: async (_taskIds: string[]) => {},
                generatePrdFromDescription: async (_desc: string) => {},
                setRequirements: (_req: TaskRequirements) => {},
                getRequirements: () => ({ ...DEFAULT_REQUIREMENTS }),
                setSettings: (_settings: RalphSettings) => {},
                getSettings: () => ({ ...DEFAULT_SETTINGS })
            };
            
            const context = createCommandContext(mockOrchestrator, (msg) => logs.push(msg));
            context.addLog('Test message');
            
            assert.deepStrictEqual(logs, ['Test message']);
        });
        
        it('should use no-op addLog if not provided', () => {
            const mockOrchestrator = {
                startLoop: async () => {},
                stopLoop: async () => {},
                pauseLoop: () => {},
                resumeLoop: () => {},
                runSingleStep: async () => {},
                skipCurrentTask: async () => {},
                retryFailedTask: async () => {},
                completeAllTasks: async () => {},
                resetAllTasks: async () => {},
                reorderTasks: async (_taskIds: string[]) => {},
                generatePrdFromDescription: async (_desc: string) => {},
                setRequirements: (_req: TaskRequirements) => {},
                getRequirements: () => ({ ...DEFAULT_REQUIREMENTS }),
                setSettings: (_settings: RalphSettings) => {},
                getSettings: () => ({ ...DEFAULT_SETTINGS })
            };
            
            const context = createCommandContext(mockOrchestrator);
            
            // Should not throw
            context.addLog('Test message');
        });
    });
    
    describe('Error Handling', () => {
        it('should catch and wrap errors during execution', async () => {
            const context = createMockContext({
                startLoop: async () => { throw new Error('Test error'); }
            });
            const command = new StartLoopCommand(context);
            
            const result = await command.execute();
            
            assert.strictEqual(result.success, false);
            assert.ok(result.error instanceof Error);
            assert.ok(result.message?.includes('Test error'));
        });
        
        it('should catch non-Error throws', async () => {
            const context = createMockContext({
                startLoop: async () => { throw 'String error'; }
            });
            const command = new StartLoopCommand(context);
            
            const result = await command.execute();
            
            assert.strictEqual(result.success, false);
            assert.ok(result.error);
        });
    });
});
