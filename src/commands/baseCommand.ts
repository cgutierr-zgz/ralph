/**
 * Base Command Class
 * 
 * Provides a base implementation for all commands.
 * Concrete commands extend this class and implement the doExecute method.
 */

import { ICommand, CommandResult, CommandContext } from './types';
import { logError } from '../logger';

/**
 * Abstract base class for all commands.
 * Provides common functionality like error handling and logging.
 */
export abstract class BaseCommand implements ICommand {
    public abstract readonly name: string;
    public abstract readonly description: string;
    
    /**
     * Whether this command can be undone.
     * Override in subclasses to enable undo functionality.
     */
    public get canUndo(): boolean {
        return false;
    }

    protected readonly context: CommandContext;

    constructor(context: CommandContext) {
        this.context = context;
    }

    /**
     * Execute the command with error handling.
     */
    public async execute(): Promise<CommandResult> {
        try {
            return await this.doExecute();
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            logError(`Command "${this.name}" failed: ${err.message}`, error);
            return {
                success: false,
                message: `Command "${this.name}" failed: ${err.message}`,
                error: err
            };
        }
    }

    /**
     * Template method for subclasses to implement the actual execution logic.
     */
    protected abstract doExecute(): Promise<CommandResult>;

    /**
     * Create a successful result.
     */
    protected success(message?: string, data?: unknown): CommandResult {
        return { success: true, message, data };
    }

    /**
     * Create a failure result.
     */
    protected failure(message: string, error?: Error): CommandResult {
        return { success: false, message, error };
    }
}

/**
 * Abstract base class for undoable commands.
 */
export abstract class UndoableCommand extends BaseCommand {
    /**
     * Undoable commands can always be undone.
     */
    public get canUndo(): true {
        return true;
    }

    /**
     * State captured before execution for undo purposes.
     */
    protected previousState: unknown = null;

    /**
     * Undo the command with error handling.
     */
    public async undo(): Promise<CommandResult> {
        try {
            return await this.doUndo();
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            logError(`Undo of command "${this.name}" failed: ${err.message}`, error);
            return {
                success: false,
                message: `Undo of command "${this.name}" failed: ${err.message}`,
                error: err
            };
        }
    }

    /**
     * Template method for subclasses to implement the actual undo logic.
     */
    protected abstract doUndo(): Promise<CommandResult>;

    /**
     * Capture state before execution for undo.
     */
    protected captureState(state: unknown): void {
        this.previousState = state;
    }
}
