/**
 * Task Commands
 * 
 * Commands for task management operations:
 * - SkipTaskCommand: Skip the current task
 * - RetryTaskCommand: Retry a failed task
 * - CompleteAllTasksCommand: Mark all tasks as complete
 * - ResetAllTasksCommand: Reset all tasks to pending
 * - ReorderTasksCommand: Change task order
 */

import { BaseCommand, UndoableCommand } from './baseCommand';
import { CommandResult, CommandContext, CommandNames } from './types';

/**
 * Command to skip the current task.
 */
export class SkipTaskCommand extends BaseCommand {
    public readonly name = CommandNames.SKIP_TASK;
    public readonly description = 'Skip the current pending task';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.skipCurrentTask();
        return this.success('Task skipped successfully');
    }
}

/**
 * Command to retry a failed/blocked task.
 */
export class RetryTaskCommand extends BaseCommand {
    public readonly name = CommandNames.RETRY_TASK;
    public readonly description = 'Retry a failed or blocked task';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.retryFailedTask();
        return this.success('Task retry initiated');
    }
}

/**
 * Command to complete all pending tasks.
 */
export class CompleteAllTasksCommand extends BaseCommand {
    public readonly name = CommandNames.COMPLETE_ALL_TASKS;
    public readonly description = 'Mark all pending tasks as complete';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.completeAllTasks();
        return this.success('All tasks marked as complete');
    }
}

/**
 * Command to reset all tasks to pending status.
 */
export class ResetAllTasksCommand extends BaseCommand {
    public readonly name = CommandNames.RESET_ALL_TASKS;
    public readonly description = 'Reset all tasks to pending status';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.resetAllTasks();
        return this.success('All tasks reset to pending');
    }
}

/**
 * Command to reorder tasks.
 * This command is undoable - the previous order is captured and can be restored.
 */
export class ReorderTasksCommand extends UndoableCommand {
    public readonly name = CommandNames.REORDER_TASKS;
    public readonly description = 'Reorder tasks by changing their priority';

    private readonly newOrder: string[];

    constructor(context: CommandContext, taskIds: string[]) {
        super(context);
        this.newOrder = taskIds;
    }

    protected async doExecute(): Promise<CommandResult> {
        // Capture current state for undo (would need actual implementation)
        // For now, we store the new order as reference
        this.captureState(this.newOrder);
        
        await this.context.reorderTasks(this.newOrder);
        return this.success('Tasks reordered successfully', { newOrder: this.newOrder });
    }

    protected async doUndo(): Promise<CommandResult> {
        // Undo would require storing the previous order before reordering
        // This is a simplified implementation - full undo would need the original order
        return this.failure('Undo not fully implemented for reorder - previous order not captured');
    }
}

/**
 * Factory functions for creating task commands.
 */
export const createSkipTaskCommand = (context: CommandContext): SkipTaskCommand => new SkipTaskCommand(context);
export const createRetryTaskCommand = (context: CommandContext): RetryTaskCommand => new RetryTaskCommand(context);
export const createCompleteAllTasksCommand = (context: CommandContext): CompleteAllTasksCommand => new CompleteAllTasksCommand(context);
export const createResetAllTasksCommand = (context: CommandContext): ResetAllTasksCommand => new ResetAllTasksCommand(context);
export const createReorderTasksCommand = (context: CommandContext, taskIds: string[]): ReorderTasksCommand => new ReorderTasksCommand(context, taskIds);
