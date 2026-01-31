/**
 * Task Message Handler
 * 
 * Handles task management messages: skipTask, retryTask, completeAllTasks, resetAllTasks, reorderTasks.
 * These commands modify task states and ordering.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    TaskMessage,
    ReorderTasksMessage,
    TASK_COMMANDS,
    isTaskMessage
} from './types';

/**
 * Handler for task management messages.
 * 
 * Responsible for:
 * - Skipping the current task
 * - Retrying a failed/blocked task
 * - Marking all tasks as complete
 * - Resetting all tasks to pending
 * - Reordering tasks via drag-and-drop
 */
export class TaskMessageHandler implements IMessageHandler {
    /**
     * List of commands this handler processes.
     */
    public readonly handledCommands: ReadonlyArray<string> = TASK_COMMANDS;

    /**
     * Check if this handler can process the given message.
     */
    public canHandle(message: BaseWebviewMessage): boolean {
        return isTaskMessage(message);
    }

    /**
     * Process task management messages and emit appropriate events.
     */
    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isTaskMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'skipTask':
                context.emit('skipTask');
                break;
            case 'retryTask':
                context.emit('retryTask');
                break;
            case 'completeAllTasks':
                context.emit('completeAllTasks');
                break;
            case 'resetAllTasks':
                context.emit('resetAllTasks');
                break;
            case 'reorderTasks': {
                const reorderMsg = message as ReorderTasksMessage;
                if (reorderMsg.taskIds && reorderMsg.taskIds.length > 0) {
                    context.emit('reorderTasks', { taskIds: reorderMsg.taskIds });
                }
                break;
            }
        }
    }
}

/**
 * Factory function to create a TaskMessageHandler instance.
 */
export function createTaskMessageHandler(): IMessageHandler {
    return new TaskMessageHandler();
}
