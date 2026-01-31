/**
 * Control Message Handler
 * 
 * Handles workflow control messages: start, stop, pause, resume, next, refresh.
 * These are the primary execution control commands for the Ralph loop.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    ControlMessage,
    CONTROL_COMMANDS,
    isControlMessage
} from './types';

/**
 * Handler for workflow control messages.
 * 
 * Responsible for:
 * - Starting the task execution loop
 * - Stopping the execution
 * - Pausing and resuming execution
 * - Advancing to the next step
 * - Refreshing the panel content
 */
export class ControlMessageHandler implements IMessageHandler {
    /**
     * List of commands this handler processes.
     */
    public readonly handledCommands: ReadonlyArray<string> = CONTROL_COMMANDS;

    /**
     * Check if this handler can process the given message.
     */
    public canHandle(message: BaseWebviewMessage): boolean {
        return isControlMessage(message);
    }

    /**
     * Process control messages and emit appropriate events.
     */
    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isControlMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'start':
                context.emit('start');
                break;
            case 'stop':
                context.emit('stop');
                break;
            case 'pause':
                context.emit('pause');
                break;
            case 'resume':
                context.emit('resume');
                break;
            case 'next':
                context.emit('next');
                break;
            case 'refresh':
                context.refresh?.();
                break;
        }
    }
}

/**
 * Factory function to create a ControlMessageHandler instance.
 */
export function createControlMessageHandler(): IMessageHandler {
    return new ControlMessageHandler();
}
