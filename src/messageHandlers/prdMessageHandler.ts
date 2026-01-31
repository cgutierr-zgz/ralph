/**
 * PRD Message Handler
 * 
 * Handles PRD and settings-related messages: generatePrd, requirementsChanged, settingsChanged.
 * These commands manage project requirements and configuration.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    PrdMessage,
    GeneratePrdMessage,
    RequirementsChangedMessage,
    SettingsChangedMessage,
    PRD_COMMANDS,
    isPrdMessage
} from './types';

/**
 * Handler for PRD and settings messages.
 * 
 * Responsible for:
 * - Generating a new PRD from task description
 * - Updating task requirements (checkboxes)
 * - Updating extension settings
 */
export class PrdMessageHandler implements IMessageHandler {
    /**
     * List of commands this handler processes.
     */
    public readonly handledCommands: ReadonlyArray<string> = PRD_COMMANDS;

    /**
     * Check if this handler can process the given message.
     */
    public canHandle(message: BaseWebviewMessage): boolean {
        return isPrdMessage(message);
    }

    /**
     * Process PRD and settings messages and emit appropriate events.
     */
    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isPrdMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'generatePrd': {
                const genMsg = message as GeneratePrdMessage;
                if (genMsg.taskDescription) {
                    context.emit('generatePrd', { taskDescription: genMsg.taskDescription });
                }
                break;
            }
            case 'requirementsChanged': {
                const reqMsg = message as RequirementsChangedMessage;
                if (reqMsg.requirements) {
                    // Persist requirements to panel state if available
                    context.updatePanelState?.({ requirements: reqMsg.requirements });
                    context.emit('requirementsChanged', { requirements: reqMsg.requirements });
                }
                break;
            }
            case 'settingsChanged': {
                const settingsMsg = message as SettingsChangedMessage;
                if (settingsMsg.settings) {
                    context.emit('settingsChanged', { settings: settingsMsg.settings });
                }
                break;
            }
        }
    }
}

/**
 * Factory function to create a PrdMessageHandler instance.
 */
export function createPrdMessageHandler(): IMessageHandler {
    return new PrdMessageHandler();
}
