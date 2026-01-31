/**
 * Command Pattern Types
 * 
 * Defines interfaces for the command pattern implementation.
 * The command pattern encapsulates actions as objects, enabling:
 * - Decoupling between action triggers (UI) and action execution (orchestrator)
 * - Command history for undo/redo functionality
 * - Macro commands for batch operations
 * - Logging and auditing of all actions
 */

import { TaskRequirements, RalphSettings } from '../types';

/**
 * Result of a command execution.
 */
export interface CommandResult {
    /** Whether the command executed successfully */
    success: boolean;
    /** Optional message describing the result */
    message?: string;
    /** Optional data returned by the command */
    data?: unknown;
    /** Error information if the command failed */
    error?: Error;
}

/**
 * Base interface for all commands.
 * Commands encapsulate a single action and its parameters.
 */
export interface ICommand {
    /**
     * Unique identifier for this command type.
     */
    readonly name: string;
    
    /**
     * Human-readable description of what this command does.
     */
    readonly description: string;
    
    /**
     * Execute the command.
     * @returns A promise that resolves with the command result
     */
    execute(): Promise<CommandResult>;
    
    /**
     * Whether this command can be undone.
     */
    readonly canUndo: boolean;
}

/**
 * Interface for commands that support undo functionality.
 */
export interface IUndoableCommand extends ICommand {
    readonly canUndo: true;
    
    /**
     * Undo the effects of this command.
     * @returns A promise that resolves with the undo result
     */
    undo(): Promise<CommandResult>;
}

/**
 * Type guard to check if a command is undoable.
 */
export function isUndoableCommand(command: ICommand): command is IUndoableCommand {
    return command.canUndo === true && 'undo' in command && typeof (command as IUndoableCommand).undo === 'function';
}

/**
 * Entry in the command history.
 */
export interface CommandHistoryEntry {
    /** The command that was executed */
    command: ICommand;
    /** When the command was executed */
    executedAt: number;
    /** Result of the execution */
    result: CommandResult;
    /** Whether this command has been undone */
    undone: boolean;
}

/**
 * Interface for command execution context.
 * Provides access to the orchestrator and other dependencies.
 */
export interface CommandContext {
    /** Start the task execution loop */
    startLoop(): Promise<void>;
    /** Stop the task execution loop */
    stopLoop(): Promise<void>;
    /** Pause the task execution loop */
    pauseLoop(): void;
    /** Resume the task execution loop */
    resumeLoop(): void;
    /** Run a single task step */
    runSingleStep(): Promise<void>;
    /** Skip the current task */
    skipCurrentTask(): Promise<void>;
    /** Retry a failed task */
    retryFailedTask(): Promise<void>;
    /** Complete all pending tasks */
    completeAllTasks(): Promise<void>;
    /** Reset all tasks to pending */
    resetAllTasks(): Promise<void>;
    /** Reorder tasks by ID */
    reorderTasks(taskIds: string[]): Promise<void>;
    /** Generate PRD from description */
    generatePrdFromDescription(description: string): Promise<void>;
    /** Set task requirements */
    setRequirements(requirements: TaskRequirements): void;
    /** Get current requirements */
    getRequirements(): TaskRequirements;
    /** Set settings */
    setSettings(settings: RalphSettings): void;
    /** Get current settings */
    getSettings(): RalphSettings;
    /** Add a log entry */
    addLog(message: string, highlight?: boolean): void;
}

/**
 * Command factory function type.
 */
export type CommandFactory<T extends ICommand = ICommand> = (context: CommandContext, ...args: unknown[]) => T;

/**
 * Command registry for looking up commands by name.
 */
export interface ICommandRegistry {
    /** Register a command factory */
    register(name: string, factory: CommandFactory): void;
    /** Get a command factory by name */
    get(name: string): CommandFactory | undefined;
    /** Check if a command is registered */
    has(name: string): boolean;
    /** Get all registered command names */
    getNames(): ReadonlyArray<string>;
}

/**
 * Command manager interface for executing and tracking commands.
 */
export interface ICommandManager {
    /** Execute a command */
    execute(command: ICommand): Promise<CommandResult>;
    /** Undo the last undoable command */
    undo(): Promise<CommandResult | null>;
    /** Redo the last undone command */
    redo(): Promise<CommandResult | null>;
    /** Check if undo is available */
    canUndo(): boolean;
    /** Check if redo is available */
    canRedo(): boolean;
    /** Get the command history */
    getHistory(): ReadonlyArray<CommandHistoryEntry>;
    /** Clear the command history */
    clearHistory(): void;
}

/**
 * Command names constant for type safety and consistency.
 */
export const CommandNames = {
    // Control commands
    START_LOOP: 'startLoop',
    STOP_LOOP: 'stopLoop',
    PAUSE_LOOP: 'pauseLoop',
    RESUME_LOOP: 'resumeLoop',
    RUN_SINGLE_STEP: 'runSingleStep',
    
    // Task commands
    SKIP_TASK: 'skipTask',
    RETRY_TASK: 'retryTask',
    COMPLETE_ALL_TASKS: 'completeAllTasks',
    RESET_ALL_TASKS: 'resetAllTasks',
    REORDER_TASKS: 'reorderTasks',
    
    // PRD commands
    GENERATE_PRD: 'generatePrd',
    UPDATE_REQUIREMENTS: 'updateRequirements',
    UPDATE_SETTINGS: 'updateSettings',
    
    // Macro commands
    MACRO: 'macro'
} as const;

/**
 * Type for command names.
 */
export type CommandName = typeof CommandNames[keyof typeof CommandNames];
