/**
 * Message Handlers Module
 * 
 * This module provides a clean architecture for handling webview messages.
 * Message handlers are organized by feature area for better maintainability:
 * 
 * - ControlMessageHandler: Workflow control (start, stop, pause, resume, next)
 * - TaskMessageHandler: Task management (skip, retry, complete all, reset all, reorder)
 * - PrdMessageHandler: PRD and settings (generate PRD, requirements, settings)
 * - ExportMessageHandler: Data export (export data, export log)
 * - StateMessageHandler: State management (panel state, webview errors)
 * 
 * @example
 * ```typescript
 * import { processMessage, getMessageHandlerRegistry } from './messageHandlers';
 * 
 * // Process a message using the registry
 * const handled = processMessage(message, context);
 * 
 * // Or use the registry directly
 * const registry = getMessageHandlerRegistry();
 * const handler = registry.findHandler(message.command);
 * if (handler) {
 *   handler.handle(message, context);
 * }
 * ```
 */

// Command constants
export {
    CONTROL_COMMANDS,
    TASK_COMMANDS,
    PRD_COMMANDS,
    EXPORT_COMMANDS,
    PROJECT_COMMANDS,
    STATE_COMMANDS,
    ALL_INCOMING_COMMANDS,
    OUTGOING_MESSAGE_TYPES,
    ControlCommandType,
    TaskCommandType,
    PrdCommandType,
    ExportCommandType,
    ProjectCommandType,
    StateCommandType,
    IncomingCommandType,
    OutgoingMessageType
} from './types';

// Incoming message types (webview → extension)
export {
    BaseWebviewMessage,
    StartMessage,
    StopMessage,
    PauseMessage,
    ResumeMessage,
    NextMessage,
    RefreshMessage,
    ControlMessage,
    SkipTaskMessage,
    RetryTaskMessage,
    CompleteAllTasksMessage,
    ResetAllTasksMessage,
    ReorderTasksMessage,
    TaskMessage,
    GeneratePrdMessage,
    RequirementsChangedMessage,
    SettingsChangedMessage,
    PrdMessage,
    ExportDataMessage,
    ExportLogMessage,
    ExportMessage,
    SwitchProjectMessage,
    ProjectMessage,
    PanelStateChangedMessage,
    WebviewErrorMessage,
    OpenPanelMessage,
    StateMessage,
    IncomingWebviewMessage,
    WebviewMessage
} from './types';

// Outgoing message types (extension → webview)
export {
    BaseOutgoingMessage,
    UpdateMessage,
    CountdownMessage,
    HistoryMessage,
    TimingMessage,
    StatsMessage,
    LogMessage,
    PrdGeneratingMessage,
    PrdCompleteMessage,
    ToastType,
    ToastMessage,
    LoadingMessage,
    ErrorMessage,
    OutgoingExtensionMessage
} from './types';

// Type guards
export {
    isIncomingWebviewMessage,
    isOutgoingExtensionMessage,
    isControlMessage,
    isTaskMessage,
    isPrdMessage,
    isExportMessage,    isProjectMessage,    isStateMessage
} from './types';

// Runtime validation
export {
    MessageValidationResult,
    PropertyValidationError,
    validationSuccess,
    validationFailure,
    createPropertyError,
    isNonEmptyString,
    isStringArray,
    isNonEmptyStringArray,
    isValidTaskRequirements,
    isValidRalphSettings,
    isValidWebviewError,
    isValidLogEntry,
    isValidLogEntryArray,
    validateStartMessage,
    validateStopMessage,
    validatePauseMessage,
    validateResumeMessage,
    validateNextMessage,
    validateRefreshMessage,
    validateSkipTaskMessage,
    validateRetryTaskMessage,
    validateCompleteAllTasksMessage,
    validateResetAllTasksMessage,
    validateReorderTasksMessage,
    validateGeneratePrdMessage,
    validateRequirementsChangedMessage,
    validateSettingsChangedMessage,
    validateExportDataMessage,
    validateExportLogMessage,
    validatePanelStateChangedMessage,
    validateWebviewErrorMessage,
    validateOpenPanelMessage,
    MESSAGE_VALIDATORS,
    validateIncomingMessage,
    validateAndExtractMessage,
    formatValidationError
} from './types';

// Panel event types
export {
    PanelEventType,
    PanelEventData,
    PanelEventHandler,
    MessageHandlerContext,
    IMessageHandler,
    MessageHandlerFactory,
    MessageHandlerRegistry
} from './types';

// Individual handlers
export { ControlMessageHandler, createControlMessageHandler } from './controlMessageHandler';
export { TaskMessageHandler, createTaskMessageHandler } from './taskMessageHandler';
export { PrdMessageHandler, createPrdMessageHandler } from './prdMessageHandler';
export { ExportMessageHandler, createExportMessageHandler } from './exportMessageHandler';
export { StateMessageHandler, createStateMessageHandler } from './stateMessageHandler';

// Registry
export {
    DefaultMessageHandlerRegistry,
    getMessageHandlerRegistry,
    createMessageHandlerRegistry,
    processMessage,
    processMessageWithValidation,
    ProcessMessageResult,
    isHandledCommand,
    getHandledCommands
} from './registry';

// Schema-based type generation
export {
    // Schema primitive and complex types
    SchemaPrimitiveType,
    SchemaComplexType,
    SchemaType,
    // Schema definitions
    BaseSchema,
    StringSchema,
    NumberSchema,
    BooleanSchema,
    NullSchema,
    UndefinedSchema,
    ArraySchema,
    ObjectSchema,
    UnionSchema,
    RefSchema,
    LiteralSchema,
    PropertySchema,
    // Message schema definitions
    MessageSchema,
    MessageSchemaCollection,
    // Schema helper functions
    stringSchema,
    literalSchema,
    enumSchema,
    numberSchema,
    integerSchema,
    booleanSchema,
    arraySchema,
    objectSchema,
    refSchema,
    optional,
    // Schema property accessors
    isRefSchema,
    isLiteralSchema,
    isBaseSchema,
    isSchemaOptional,
    isSchemaReadonly,
    getSchemaDescription,
    // Schema collections
    SHARED_DEFINITIONS,
    INCOMING_MESSAGE_SCHEMAS,
    OUTGOING_MESSAGE_SCHEMAS,
    // Type generation utilities
    generateTypeString,
    generateInterfaceDeclaration,
    generateTypeFile,
    // Validator generation
    GeneratedValidator,
    generateValidator,
    generateMessageValidators,
    // Type guard generation
    createMessageTypeGuard,
    createAllTypeGuards,
    // Schema introspection
    getDiscriminants,
    getMessagesByCategory,
    getMessageSchema,
    hasMessage,
    getMessageProperties,
    getRequiredProperties,
    // Pre-generated validators
    INCOMING_MESSAGE_VALIDATORS,
    OUTGOING_MESSAGE_VALIDATORS,
    INCOMING_TYPE_GUARDS,
    OUTGOING_TYPE_GUARDS,
    // Convenience functions
    validateIncomingMessageFromSchema,
    validateOutgoingMessageFromSchema
} from './schemaTypes';
