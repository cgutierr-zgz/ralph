/**
 * Commands Module
 * 
 * Exports all command pattern components for panel actions.
 * 
 * The command pattern provides:
 * - Encapsulation of actions as objects
 * - Decoupling between UI triggers and action execution
 * - Command history for undo/redo functionality
 * - Macro commands for batch operations
 * - Consistent logging and error handling
 * 
 * @example
 * ```typescript
 * import { 
 *   createCommandManager, 
 *   createStartLoopCommand, 
 *   CommandContext 
 * } from './commands';
 * 
 * // Create a command context from the orchestrator
 * const context: CommandContext = {
 *   startLoop: () => orchestrator.startLoop(),
 *   stopLoop: () => orchestrator.stopLoop(),
 *   // ... other methods
 * };
 * 
 * // Create and execute a command
 * const manager = createCommandManager();
 * const command = createStartLoopCommand(context);
 * const result = await manager.execute(command);
 * 
 * // Undo if needed
 * if (manager.canUndo()) {
 *   await manager.undo();
 * }
 * ```
 */

// Types
export {
    // Core interfaces
    ICommand,
    IUndoableCommand,
    CommandResult,
    CommandContext,
    CommandHistoryEntry,
    ICommandRegistry,
    ICommandManager,
    CommandFactory,
    
    // Constants
    CommandNames,
    CommandName,
    
    // Type guards
    isUndoableCommand
} from './types';

// Base classes
export { BaseCommand, UndoableCommand } from './baseCommand';

// Control commands
export {
    StartLoopCommand,
    StopLoopCommand,
    PauseLoopCommand,
    ResumeLoopCommand,
    RunSingleStepCommand,
    createStartLoopCommand,
    createStopLoopCommand,
    createPauseLoopCommand,
    createResumeLoopCommand,
    createRunSingleStepCommand
} from './controlCommands';

// Task commands
export {
    SkipTaskCommand,
    RetryTaskCommand,
    CompleteAllTasksCommand,
    ResetAllTasksCommand,
    ReorderTasksCommand,
    createSkipTaskCommand,
    createRetryTaskCommand,
    createCompleteAllTasksCommand,
    createResetAllTasksCommand,
    createReorderTasksCommand
} from './taskCommands';

// PRD commands
export {
    GeneratePrdCommand,
    UpdateRequirementsCommand,
    UpdateSettingsCommand,
    createGeneratePrdCommand,
    createUpdateRequirementsCommand,
    createUpdateSettingsCommand
} from './prdCommands';

// Macro command
export { MacroCommand, createMacroCommand } from './macroCommand';

// Registry
export {
    CommandRegistry,
    createDefaultCommandRegistry,
    getDefaultCommandRegistry,
    resetDefaultCommandRegistry
} from './commandRegistry';

// Manager
export {
    CommandManager,
    createCommandManager,
    DEFAULT_HISTORY_SIZE
} from './commandManager';

/**
 * Create a CommandContext from a LoopOrchestrator instance.
 * This bridges the command pattern with the existing orchestrator.
 * 
 * @param orchestrator - The orchestrator instance
 * @param addLog - Optional log callback
 * @returns A CommandContext for creating commands
 */
export function createCommandContext(
    orchestrator: {
        startLoop(): Promise<void>;
        stopLoop(): Promise<void>;
        pauseLoop(): void;
        resumeLoop(): void;
        runSingleStep(): Promise<void>;
        skipCurrentTask(): Promise<void>;
        retryFailedTask(): Promise<void>;
        completeAllTasks(): Promise<void>;
        resetAllTasks(): Promise<void>;
        reorderTasks(taskIds: string[]): Promise<void>;
        generatePrdFromDescription(description: string): Promise<void>;
        setRequirements(requirements: import('../types').TaskRequirements): void;
        getRequirements(): import('../types').TaskRequirements;
        setSettings(settings: import('../types').RalphSettings): void;
        getSettings(): import('../types').RalphSettings;
    },
    addLog?: (message: string, highlight?: boolean) => void
): import('./types').CommandContext {
    return {
        startLoop: () => orchestrator.startLoop(),
        stopLoop: () => orchestrator.stopLoop(),
        pauseLoop: () => orchestrator.pauseLoop(),
        resumeLoop: () => orchestrator.resumeLoop(),
        runSingleStep: () => orchestrator.runSingleStep(),
        skipCurrentTask: () => orchestrator.skipCurrentTask(),
        retryFailedTask: () => orchestrator.retryFailedTask(),
        completeAllTasks: () => orchestrator.completeAllTasks(),
        resetAllTasks: () => orchestrator.resetAllTasks(),
        reorderTasks: (taskIds: string[]) => orchestrator.reorderTasks(taskIds),
        generatePrdFromDescription: (description: string) => orchestrator.generatePrdFromDescription(description),
        setRequirements: (requirements) => orchestrator.setRequirements(requirements),
        getRequirements: () => orchestrator.getRequirements(),
        setSettings: (settings) => orchestrator.setSettings(settings),
        getSettings: () => orchestrator.getSettings(),
        addLog: addLog || (() => { /* no-op */ })
    };
}
