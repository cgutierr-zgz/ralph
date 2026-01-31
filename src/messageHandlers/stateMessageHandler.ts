/**
 * State Message Handler
 * 
 * Handles state management messages: panelStateChanged, webviewError, openPanel.
 * These commands manage panel state persistence and error handling.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    StateMessage,
    PanelStateChangedMessage,
    WebviewErrorMessage,
    STATE_COMMANDS,
    isStateMessage
} from './types';
import * as vscode from 'vscode';

/**
 * Handler for state management messages.
 * 
 * Responsible for:
 * - Persisting collapsed sections and scroll position
 * - Handling webview script errors
 * - Opening the main panel from sidebar
 */
export class StateMessageHandler implements IMessageHandler {
    /**
     * List of commands this handler processes.
     */
    public readonly handledCommands: ReadonlyArray<string> = STATE_COMMANDS;

    /**
     * Check if this handler can process the given message.
     */
    public canHandle(message: BaseWebviewMessage): boolean {
        return isStateMessage(message);
    }

    /**
     * Process state messages and emit appropriate events.
     */
    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isStateMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'panelStateChanged': {
                const stateMsg = message as PanelStateChangedMessage;
                context.updatePanelState?.({
                    collapsedSections: stateMsg.collapsedSections,
                    scrollPosition: stateMsg.scrollPosition
                });
                break;
            }
            case 'webviewError': {
                const errorMsg = message as WebviewErrorMessage;
                if (errorMsg.error) {
                    context.handleWebviewError?.(errorMsg.error);
                }
                break;
            }
            case 'openPanel':
                vscode.commands.executeCommand('ralph.showPanel');
                break;
            case 'refreshHistory':
                context.refreshHistory?.();
                break;
            case 'refreshSessionStats':
                context.refreshSessionStats?.();
                break;
        }
    }
}

/**
 * Factory function to create a StateMessageHandler instance.
 */
export function createStateMessageHandler(): IMessageHandler {
    return new StateMessageHandler();
}
