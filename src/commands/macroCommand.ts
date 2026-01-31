/**
 * Macro Command
 * 
 * A composite command that executes multiple commands in sequence.
 * Useful for batch operations or complex workflows.
 */

import { BaseCommand } from './baseCommand';
import { ICommand, CommandResult, CommandContext, CommandNames, isUndoableCommand, IUndoableCommand } from './types';

/**
 * A command that executes multiple sub-commands in sequence.
 * If any command fails, execution stops and the macro reports failure.
 */
export class MacroCommand extends BaseCommand {
    public readonly name: string;
    public readonly description: string;

    private readonly commands: ICommand[];
    private executedCommands: ICommand[] = [];
    private _canUndo: boolean;

    /**
     * Create a new MacroCommand.
     * @param context - The command context
     * @param commands - Array of commands to execute in sequence
     * @param name - Optional custom name for this macro
     * @param description - Optional custom description for this macro
     */
    constructor(
        context: CommandContext,
        commands: ICommand[],
        name?: string,
        description?: string
    ) {
        super(context);
        this.commands = commands;
        this.name = name || `${CommandNames.MACRO}:${commands.map(c => c.name).join('+')}`;
        this.description = description || `Execute ${commands.length} commands: ${commands.map(c => c.name).join(', ')}`;
        // Calculate canUndo based on whether all commands are undoable
        this._canUndo = this.commands.length > 0 && this.commands.every(cmd => cmd.canUndo);
    }

    /**
     * Check if this macro can be undone.
     * A macro can be undone if all its commands are undoable.
     */
    public get canUndo(): boolean {
        return this._canUndo;
    }

    protected async doExecute(): Promise<CommandResult> {
        this.executedCommands = [];
        const results: CommandResult[] = [];

        for (const command of this.commands) {
            const result = await command.execute();
            results.push(result);
            
            if (result.success) {
                this.executedCommands.push(command);
            } else {
                // Stop on first failure
                return this.failure(
                    `Macro failed at command "${command.name}": ${result.message}`,
                    result.error
                );
            }
        }

        return this.success(
            `Macro completed successfully: ${this.executedCommands.length} commands executed`,
            { results }
        );
    }

    /**
     * Undo all executed commands in reverse order.
     */
    public async undo(): Promise<CommandResult> {
        if (!this.canUndo) {
            return this.failure('This macro cannot be undone - not all commands are undoable');
        }

        const undoResults: CommandResult[] = [];
        
        // Undo in reverse order
        for (let i = this.executedCommands.length - 1; i >= 0; i--) {
            const command = this.executedCommands[i];
            if (isUndoableCommand(command)) {
                const result = await (command as IUndoableCommand).undo();
                undoResults.push(result);
                
                if (!result.success) {
                    return this.failure(
                        `Macro undo failed at command "${command.name}": ${result.message}`,
                        result.error
                    );
                }
            }
        }

        this.executedCommands = [];
        return this.success(
            `Macro undo completed successfully: ${undoResults.length} commands undone`,
            { undoResults }
        );
    }

    /**
     * Get the list of commands in this macro.
     */
    public getCommands(): ReadonlyArray<ICommand> {
        return this.commands;
    }

    /**
     * Get the count of commands in this macro.
     */
    public getCommandCount(): number {
        return this.commands.length;
    }
}

/**
 * Factory function to create a MacroCommand.
 */
export function createMacroCommand(
    context: CommandContext,
    commands: ICommand[],
    name?: string,
    description?: string
): MacroCommand {
    return new MacroCommand(context, commands, name, description);
}
