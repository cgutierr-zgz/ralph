/**
 * Command Manager
 * 
 * Manages command execution and maintains command history.
 * Supports undo/redo functionality for undoable commands.
 */

import { 
    ICommand, 
    ICommandManager, 
    CommandResult, 
    CommandHistoryEntry, 
    isUndoableCommand,
    IUndoableCommand 
} from './types';
import { log } from '../logger';

/**
 * Default maximum size for command history.
 */
export const DEFAULT_HISTORY_SIZE = 50;

/**
 * Default implementation of the command manager.
 */
export class CommandManager implements ICommandManager {
    private readonly history: CommandHistoryEntry[] = [];
    private undoStack: CommandHistoryEntry[] = [];
    private readonly maxHistorySize: number;

    /**
     * Create a new CommandManager.
     * @param maxHistorySize - Maximum number of commands to keep in history
     */
    constructor(maxHistorySize: number = DEFAULT_HISTORY_SIZE) {
        this.maxHistorySize = maxHistorySize;
    }

    /**
     * Execute a command and add it to the history.
     * @param command - The command to execute
     * @returns The result of the command execution
     */
    public async execute(command: ICommand): Promise<CommandResult> {
        log(`Executing command: ${command.name}`);
        
        const result = await command.execute();
        
        // Add to history
        const entry: CommandHistoryEntry = {
            command,
            executedAt: Date.now(),
            result,
            undone: false
        };
        
        this.history.push(entry);
        
        // Clear redo stack when a new command is executed
        this.undoStack = [];
        
        // Trim history if needed
        this.trimHistory();
        
        if (result.success) {
            log(`Command "${command.name}" completed successfully`);
        } else {
            log(`Command "${command.name}" failed: ${result.message}`);
        }
        
        return result;
    }

    /**
     * Undo the last undoable command.
     * @returns The result of the undo operation, or null if nothing to undo
     */
    public async undo(): Promise<CommandResult | null> {
        // Find the last successful, undoable, not-yet-undone command
        for (let i = this.history.length - 1; i >= 0; i--) {
            const entry = this.history[i];
            
            if (!entry.undone && entry.result.success && isUndoableCommand(entry.command)) {
                log(`Undoing command: ${entry.command.name}`);
                
                const result = await (entry.command as IUndoableCommand).undo();
                
                if (result.success) {
                    entry.undone = true;
                    this.undoStack.push(entry);
                    log(`Command "${entry.command.name}" undone successfully`);
                } else {
                    log(`Failed to undo command "${entry.command.name}": ${result.message}`);
                }
                
                return result;
            }
        }
        
        log('Nothing to undo');
        return null;
    }

    /**
     * Redo the last undone command.
     * @returns The result of the redo operation, or null if nothing to redo
     */
    public async redo(): Promise<CommandResult | null> {
        if (this.undoStack.length === 0) {
            log('Nothing to redo');
            return null;
        }
        
        const entry = this.undoStack.pop()!;
        log(`Redoing command: ${entry.command.name}`);
        
        const result = await entry.command.execute();
        
        if (result.success) {
            entry.undone = false;
            entry.result = result;
            entry.executedAt = Date.now();
            log(`Command "${entry.command.name}" redone successfully`);
        } else {
            log(`Failed to redo command "${entry.command.name}": ${result.message}`);
            // Put it back on undo stack if redo failed
            this.undoStack.push(entry);
        }
        
        return result;
    }

    /**
     * Check if undo is available.
     * @returns True if there are undoable commands in history
     */
    public canUndo(): boolean {
        return this.history.some(
            entry => !entry.undone && entry.result.success && isUndoableCommand(entry.command)
        );
    }

    /**
     * Check if redo is available.
     * @returns True if there are commands in the undo stack
     */
    public canRedo(): boolean {
        return this.undoStack.length > 0;
    }

    /**
     * Get the command history.
     * @returns Read-only array of command history entries
     */
    public getHistory(): ReadonlyArray<CommandHistoryEntry> {
        return this.history;
    }

    /**
     * Clear the command history and undo stack.
     */
    public clearHistory(): void {
        this.history.length = 0;
        this.undoStack.length = 0;
        log('Command history cleared');
    }

    /**
     * Get the number of commands in history.
     */
    public getHistorySize(): number {
        return this.history.length;
    }

    /**
     * Get the number of commands in the undo stack.
     */
    public getUndoStackSize(): number {
        return this.undoStack.length;
    }

    /**
     * Get the last executed command.
     */
    public getLastCommand(): CommandHistoryEntry | undefined {
        return this.history[this.history.length - 1];
    }

    /**
     * Trim history to max size, removing oldest entries.
     */
    private trimHistory(): void {
        while (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }
}

/**
 * Create a new CommandManager instance.
 * @param maxHistorySize - Maximum size of command history
 */
export function createCommandManager(maxHistorySize?: number): CommandManager {
    return new CommandManager(maxHistorySize);
}
