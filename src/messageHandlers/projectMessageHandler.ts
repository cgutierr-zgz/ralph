/**
 * Project Message Handler
 * 
 * Handles project management messages: switchProject.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext,
    isProjectMessage,
    PROJECT_COMMANDS
} from './types';

export class ProjectMessageHandler implements IMessageHandler {
    public readonly handledCommands: ReadonlyArray<string> = PROJECT_COMMANDS;

    public canHandle(message: BaseWebviewMessage): boolean {
        return isProjectMessage(message);
    }

    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isProjectMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'switchProject':
                context.emit('switchProject', { projectPath: message.projectPath });
                break;
        }
    }
}

export function createProjectMessageHandler(): IMessageHandler {
    return new ProjectMessageHandler();
}
