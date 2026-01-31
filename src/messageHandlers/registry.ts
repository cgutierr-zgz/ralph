/**
 * Message Handler Registry
 * 
 * Provides a centralized registry for all message handlers.
 * Allows finding and invoking the appropriate handler for each message.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    MessageHandlerRegistry,
    validateIncomingMessage,
    formatValidationError,
    MessageValidationResult
} from './types';
import { createControlMessageHandler } from './controlMessageHandler';
import { createTaskMessageHandler } from './taskMessageHandler';
import { createPrdMessageHandler } from './prdMessageHandler';
import { createExportMessageHandler } from './exportMessageHandler';
import { createProjectMessageHandler } from './projectMessageHandler';
import { createStateMessageHandler } from './stateMessageHandler';

/**
 * Default message handler registry implementation.
 * 
 * This registry maintains a list of all message handlers and provides
 * methods to find the appropriate handler for a given command.
 */
export class DefaultMessageHandlerRegistry implements MessageHandlerRegistry {
    private readonly handlers: IMessageHandler[] = [];
    private readonly commandMap = new Map<string, IMessageHandler>();

    constructor() {
        // Register all default handlers
        this.register(createControlMessageHandler());
        this.register(createTaskMessageHandler());
        this.register(createPrdMessageHandler());
        this.register(createExportMessageHandler());
        this.register(createProjectMessageHandler());
        this.register(createStateMessageHandler());
    }

    /**
     * Get all registered handlers.
     */
    public getHandlers(): ReadonlyArray<IMessageHandler> {
        return this.handlers;
    }

    /**
     * Find a handler for a specific command.
     * Uses a cached map for O(1) lookup.
     */
    public findHandler(command: string): IMessageHandler | undefined {
        return this.commandMap.get(command);
    }

    /**
     * Register a new handler.
     * Adds to the handler list and updates the command map.
     */
    public register(handler: IMessageHandler): void {
        this.handlers.push(handler);
        
        // Cache command-to-handler mapping for fast lookup
        for (const command of handler.handledCommands) {
            this.commandMap.set(command, handler);
        }
    }
}

/**
 * Singleton instance of the message handler registry.
 */
let registryInstance: MessageHandlerRegistry | null = null;

/**
 * Get the singleton message handler registry.
 * Creates it on first access.
 */
export function getMessageHandlerRegistry(): MessageHandlerRegistry {
    if (!registryInstance) {
        registryInstance = new DefaultMessageHandlerRegistry();
    }
    return registryInstance;
}

/**
 * Create a fresh message handler registry (for testing).
 */
export function createMessageHandlerRegistry(): MessageHandlerRegistry {
    return new DefaultMessageHandlerRegistry();
}

/**
 * Result of processing a message with validation.
 */
export interface ProcessMessageResult {
    /** Whether the message was successfully processed */
    readonly success: boolean;
    /** Whether the message passed validation */
    readonly validated: boolean;
    /** The validation result (if validation was performed) */
    readonly validationResult?: MessageValidationResult;
    /** Error message if processing failed */
    readonly error?: string;
}

/**
 * Process a message using the registered handlers.
 * 
 * @param message - The message to process
 * @param context - The context for message handling
 * @returns True if a handler processed the message, false otherwise
 */
export function processMessage(message: BaseWebviewMessage, context: MessageHandlerContext): boolean {
    const registry = getMessageHandlerRegistry();
    const handler = registry.findHandler(message.command);
    
    if (handler) {
        handler.handle(message, context);
        return true;
    }
    
    return false;
}

/**
 * Process a message with runtime validation before handling.
 * 
 * This function performs comprehensive validation of the message structure
 * and properties before passing it to the appropriate handler. If validation
 * fails, an error is logged and the message is not processed.
 * 
 * @param message - The raw message from the webview (type unknown)
 * @param context - The context for message handling
 * @param onValidationError - Optional callback for validation errors
 * @returns A ProcessMessageResult with validation and processing status
 * 
 * @example
 * ```typescript
 * const result = processMessageWithValidation(rawMessage, context, (validationResult) => {
 *     logError(`Invalid message: ${formatValidationError(validationResult)}`);
 * });
 * 
 * if (!result.success) {
 *     if (!result.validated) {
 *         // Message failed validation
 *         showToast({ type: 'error', message: 'Invalid message received' });
 *     }
 * }
 * ```
 */
export function processMessageWithValidation(
    message: unknown,
    context: MessageHandlerContext,
    onValidationError?: (result: MessageValidationResult) => void
): ProcessMessageResult {
    // Validate the message structure and properties
    const validationResult = validateIncomingMessage(message);
    
    if (!validationResult.isValid) {
        // Call the error callback if provided
        onValidationError?.(validationResult);
        
        return {
            success: false,
            validated: false,
            validationResult,
            error: formatValidationError(validationResult)
        };
    }
    
    // Message is valid, process it
    const validMessage = message as BaseWebviewMessage;
    const registry = getMessageHandlerRegistry();
    const handler = registry.findHandler(validMessage.command);
    
    if (handler) {
        handler.handle(validMessage, context);
        return {
            success: true,
            validated: true,
            validationResult
        };
    }
    
    // No handler found (shouldn't happen if validation passed and handlers are complete)
    return {
        success: false,
        validated: true,
        validationResult,
        error: `No handler found for command: ${validMessage.command}`
    };
}

/**
 * Check if a command is handled by any registered handler.
 */
export function isHandledCommand(command: string): boolean {
    const registry = getMessageHandlerRegistry();
    return registry.findHandler(command) !== undefined;
}

/**
 * Get all commands that are handled by registered handlers.
 */
export function getHandledCommands(): string[] {
    const registry = getMessageHandlerRegistry();
    const commands: string[] = [];
    
    for (const handler of registry.getHandlers()) {
        commands.push(...handler.handledCommands);
    }
    
    return commands;
}
