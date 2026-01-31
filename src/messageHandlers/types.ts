/**
 * Message Handler Types
 * 
 * Defines interfaces and types for the message handler architecture.
 * Message handlers are organized by feature area to improve code organization
 * and maintainability.
 * 
 * This module provides comprehensive discriminated union types for all
 * webview messages (incoming from webview → extension) and extension messages
 * (outgoing from extension → webview).
 */

import { TaskRequirements, RalphSettings, WebviewError, LogLevel, Task, TaskCompletion } from '../types';

// ============================================================================
// COMMAND CONSTANTS
// ============================================================================

/**
 * All valid control command strings.
 */
export const CONTROL_COMMANDS = ['start', 'stop', 'pause', 'resume', 'next', 'refresh'] as const;
export type ControlCommandType = typeof CONTROL_COMMANDS[number];

/**
 * All valid task command strings.
 */
export const TASK_COMMANDS = ['skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'reorderTasks'] as const;
export type TaskCommandType = typeof TASK_COMMANDS[number];

/**
 * All valid PRD command strings.
 */
export const PRD_COMMANDS = ['generatePrd', 'requirementsChanged', 'settingsChanged'] as const;
export type PrdCommandType = typeof PRD_COMMANDS[number];

/**
 * All valid export command strings.
 */
export const EXPORT_COMMANDS = ['exportData', 'exportLog', 'generateReport'] as const;
export type ExportCommandType = typeof EXPORT_COMMANDS[number];

/**
 * All valid project command strings.
 */
export const PROJECT_COMMANDS = ['switchProject'] as const;
export type ProjectCommandType = typeof PROJECT_COMMANDS[number];

/**
 * All valid state command strings.
 */
export const STATE_COMMANDS = ['panelStateChanged', 'webviewError', 'openPanel', 'refreshHistory', 'refreshSessionStats'] as const;
export type StateCommandType = typeof STATE_COMMANDS[number];

/**
 * All valid incoming commands (webview → extension).
 */
export const ALL_INCOMING_COMMANDS = [
    ...CONTROL_COMMANDS,
    ...TASK_COMMANDS,
    ...PRD_COMMANDS,
    ...EXPORT_COMMANDS,
    ...PROJECT_COMMANDS,
    ...STATE_COMMANDS
] as const;
export type IncomingCommandType = typeof ALL_INCOMING_COMMANDS[number];

// ============================================================================
// INCOMING MESSAGES (Webview → Extension)
// ============================================================================

/**
 * Base message structure received from webview.
 * All incoming messages must have a command property.
 */
export interface BaseWebviewMessage {
    readonly command: string;
}

// --- Control Messages ---

/** Start the automation loop */
export interface StartMessage {
    readonly command: 'start';
}

/** Stop the automation loop */
export interface StopMessage {
    readonly command: 'stop';
}

/** Pause the automation loop */
export interface PauseMessage {
    readonly command: 'pause';
}

/** Resume the automation loop */
export interface ResumeMessage {
    readonly command: 'resume';
}

/** Execute the next task (single step) */
export interface NextMessage {
    readonly command: 'next';
}

/** Refresh the panel content */
export interface RefreshMessage {
    readonly command: 'refresh';
}

/**
 * Discriminated union of all control flow messages.
 * Discriminant: `command` property
 */
export type ControlMessage = 
    | StartMessage
    | StopMessage
    | PauseMessage
    | ResumeMessage
    | NextMessage
    | RefreshMessage;

// --- Task Messages ---

/** Skip the current task */
export interface SkipTaskMessage {
    readonly command: 'skipTask';
}

/** Retry the first blocked/failed task */
export interface RetryTaskMessage {
    readonly command: 'retryTask';
}

/** Mark all tasks as complete */
export interface CompleteAllTasksMessage {
    readonly command: 'completeAllTasks';
}

/** Reset all tasks to pending */
export interface ResetAllTasksMessage {
    readonly command: 'resetAllTasks';
}

/** Reorder tasks with new priority */
export interface ReorderTasksMessage {
    readonly command: 'reorderTasks';
    readonly taskIds: string[];
}

/**
 * Discriminated union of all task management messages.
 * Discriminant: `command` property
 */
export type TaskMessage =
    | SkipTaskMessage
    | RetryTaskMessage
    | CompleteAllTasksMessage
    | ResetAllTasksMessage
    | ReorderTasksMessage;

// --- PRD Messages ---

/** Generate a new PRD from task description */
export interface GeneratePrdMessage {
    readonly command: 'generatePrd';
    readonly taskDescription: string;
}

/** User changed requirement checkbox selections */
export interface RequirementsChangedMessage {
    readonly command: 'requirementsChanged';
    readonly requirements: TaskRequirements;
}

/** User changed settings (e.g., max iterations) */
export interface SettingsChangedMessage {
    readonly command: 'settingsChanged';
    readonly settings: RalphSettings;
}

/**
 * Discriminated union of all PRD and settings messages.
 * Discriminant: `command` property
 */
export type PrdMessage =
    | GeneratePrdMessage
    | RequirementsChangedMessage
    | SettingsChangedMessage;

// --- Export Messages ---

/** Export timeline data (JSON or CSV) */
export interface ExportDataMessage {
    readonly command: 'exportData';
    readonly format?: 'json' | 'csv';
}

/** Export activity log entries */
export interface ExportLogMessage {
    readonly command: 'exportLog';
    readonly entries: Array<{ time: string; level: string; message: string }>;
}

/** Generate a productivity report */
export interface GenerateReportMessage {
    readonly command: 'generateReport';
    readonly period: 'today' | 'week' | 'month' | 'custom';
    readonly format: 'markdown' | 'html' | 'json';
    readonly customStartDate?: string;
    readonly customEndDate?: string;
}

/**
 * Discriminated union of all export messages.
 * Discriminant: `command` property
 */
export type ExportMessage =
    | ExportDataMessage
    | ExportLogMessage
    | GenerateReportMessage;

// --- State Messages ---

/** Panel state changed (collapsed sections, scroll position) */
export interface PanelStateChangedMessage {
    readonly command: 'panelStateChanged';
    readonly collapsedSections?: string[];
    readonly scrollPosition?: number;
}

/** Webview script error occurred */
export interface WebviewErrorMessage {
    readonly command: 'webviewError';
    readonly error?: WebviewError;
}

/** Open the main panel from sidebar */
export interface OpenPanelMessage {
    readonly command: 'openPanel';
}

/** Refresh the completion history section */
export interface RefreshHistoryMessage {
    readonly command: 'refreshHistory';
}

/** Refresh the session statistics dashboard */
export interface RefreshSessionStatsMessage {
    readonly command: 'refreshSessionStats';
}

/**
 * Discriminated union of all state management messages.
 * Discriminant: `command` property
 */
export type StateMessage =
    | PanelStateChangedMessage
    | WebviewErrorMessage
    | OpenPanelMessage
    | RefreshHistoryMessage
    | RefreshSessionStatsMessage;

/**
 * Switch the active project.
 */
export interface SwitchProjectMessage {
    readonly command: 'switchProject';
    readonly projectPath: string;
}

/**
 * Discriminated union of all project management messages.
 * Discriminant: `command` property
 */
export type ProjectMessage = SwitchProjectMessage;

/**
 * Discriminated union of ALL incoming webview messages.
 * This is the primary type for handling messages from webview to extension.
 * 
 * Discriminant: `command` property
 * 
 * @example
 * function handleMessage(message: IncomingWebviewMessage) {
 *     switch (message.command) {
 *         case 'start':
 *             // TypeScript knows this is StartMessage
 *             startLoop();
 *             break;
 *         case 'generatePrd':
 *             // TypeScript knows message.taskDescription exists
 *             generatePrd(message.taskDescription);
 *             break;
 *         // ... etc
 *     }
 * }
 */
export type IncomingWebviewMessage =
    | ControlMessage
    | TaskMessage
    | PrdMessage
    | ExportMessage
    | ProjectMessage
    | StateMessage;

/**
 * @deprecated Use IncomingWebviewMessage instead. Kept for backward compatibility.
 */
export type WebviewMessage = IncomingWebviewMessage;

// ============================================================================
// OUTGOING MESSAGES (Extension → Webview)
// ============================================================================

/**
 * All valid outgoing message types.
 */
export const OUTGOING_MESSAGE_TYPES = [
    'update',
    'countdown',
    'history',
    'timing',
    'stats',
    'log',
    'prdGenerating',
    'prdComplete',
    'toast',
    'loading',
    'error'
] as const;
export type OutgoingMessageType = typeof OUTGOING_MESSAGE_TYPES[number];

/**
 * Base message structure for outgoing messages.
 */
export interface BaseOutgoingMessage {
    readonly type: string;
}

// --- Status Update Messages ---

/** Update loop status, iteration count, and current task */
export interface UpdateMessage {
    readonly type: 'update';
    readonly status: string;
    readonly iteration: number;
    readonly taskInfo: string;
}

/** Update countdown timer display */
export interface CountdownMessage {
    readonly type: 'countdown';
    readonly seconds: number;
}

/** Update task completion history */
export interface HistoryMessage {
    readonly type: 'history';
    readonly history: TaskCompletion[];
}

/** Update session timing information */
export interface TimingMessage {
    readonly type: 'timing';
    readonly startTime: number;
    readonly taskHistory: TaskCompletion[];
    readonly pendingTasks: number;
}

/** Update task statistics */
export interface StatsMessage {
    readonly type: 'stats';
    readonly completed: number;
    readonly pending: number;
    readonly total: number;
    readonly progress: number;
    readonly nextTask: string | null;
    readonly tasks?: Task[];
}

// --- Logging Messages ---

/** Add a log entry to the activity log */
export interface LogMessage {
    readonly type: 'log';
    readonly message: string;
    readonly highlight: boolean;
    readonly level?: LogLevel;
}

// --- PRD Messages ---

/** PRD generation has started */
export interface PrdGeneratingMessage {
    readonly type: 'prdGenerating';
}

/** PRD generation has completed */
export interface PrdCompleteMessage {
    readonly type: 'prdComplete';
}

// --- Toast Notification Messages ---

/** Toast type variants */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Show a toast notification */
export interface ToastMessage {
    readonly type: 'toast';
    readonly toastType: ToastType;
    readonly message: string;
    readonly title?: string;
    readonly duration?: number;
    readonly dismissible?: boolean;
}

// --- Loading State Messages ---

/** Show/hide loading overlay */
export interface LoadingMessage {
    readonly type: 'loading';
    readonly isLoading: boolean;
}

// --- Error Messages ---

/** Display an error message */
export interface ErrorMessage {
    readonly type: 'error';
    readonly message: string;
    readonly code?: string;
}

/**
 * Discriminated union of ALL outgoing extension messages.
 * This is the primary type for sending messages from extension to webview.
 * 
 * Discriminant: `type` property
 * 
 * @example
 * function sendMessage(message: OutgoingExtensionMessage) {
 *     webview.postMessage(message);
 * }
 * 
 * // TypeScript validates the message structure
 * sendMessage({ type: 'update', status: 'running', iteration: 1, taskInfo: 'Task 1' });
 * sendMessage({ type: 'countdown', seconds: 10 });
 */
export type OutgoingExtensionMessage =
    | UpdateMessage
    | CountdownMessage
    | HistoryMessage
    | TimingMessage
    | StatsMessage
    | LogMessage
    | PrdGeneratingMessage
    | PrdCompleteMessage
    | ToastMessage
    | LoadingMessage
    | ErrorMessage;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a message is a valid incoming webview message.
 */
export function isIncomingWebviewMessage(msg: unknown): msg is IncomingWebviewMessage {
    if (typeof msg !== 'object' || msg === null) {
        return false;
    }
    const { command } = msg as { command?: unknown };
    return typeof command === 'string' && (ALL_INCOMING_COMMANDS as readonly string[]).includes(command);
}

/**
 * Type guard to check if a message is a valid outgoing extension message.
 */
export function isOutgoingExtensionMessage(msg: unknown): msg is OutgoingExtensionMessage {
    if (typeof msg !== 'object' || msg === null) {
        return false;
    }
    const { type } = msg as { type?: unknown };
    return typeof type === 'string' && (OUTGOING_MESSAGE_TYPES as readonly string[]).includes(type);
}

/**
 * Type guard for control messages.
 */
export function isControlMessage(msg: BaseWebviewMessage): msg is ControlMessage {
    return (CONTROL_COMMANDS as readonly string[]).includes(msg.command);
}

/**
 * Type guard for task messages.
 */
export function isTaskMessage(msg: BaseWebviewMessage): msg is TaskMessage {
    return (TASK_COMMANDS as readonly string[]).includes(msg.command);
}

/**
 * Type guard for PRD messages.
 */
export function isPrdMessage(msg: BaseWebviewMessage): msg is PrdMessage {
    return (PRD_COMMANDS as readonly string[]).includes(msg.command);
}

/**
 * Type guard for export messages.
 */
export function isExportMessage(msg: BaseWebviewMessage): msg is ExportMessage {
    return (EXPORT_COMMANDS as readonly string[]).includes(msg.command);
}

/**
 * Type guard for project messages.
 */
export function isProjectMessage(msg: BaseWebviewMessage): msg is ProjectMessage {
    return (PROJECT_COMMANDS as readonly string[]).includes(msg.command);
}

/**
 * Type guard for state messages.
 */
export function isStateMessage(msg: BaseWebviewMessage): msg is StateMessage {
    return (STATE_COMMANDS as readonly string[]).includes(msg.command);
}

// ============================================================================
// RUNTIME VALIDATION
// ============================================================================

/**
 * Result of validating a message at runtime.
 */
export interface MessageValidationResult {
    /** Whether the message is valid */
    readonly isValid: boolean;
    /** Error message if validation failed */
    readonly error?: string;
    /** The validated command (if valid) */
    readonly command?: string;
    /** Details about validation failures for specific properties */
    readonly propertyErrors?: ReadonlyArray<PropertyValidationError>;
}

/**
 * Details about a property validation failure.
 */
export interface PropertyValidationError {
    /** Name of the property that failed validation */
    readonly property: string;
    /** Expected type or constraint */
    readonly expected: string;
    /** Actual value received */
    readonly actual: string;
    /** Detailed error message */
    readonly message: string;
}

/**
 * Helper function to create a successful validation result.
 */
export function validationSuccess(command: string): MessageValidationResult {
    return { isValid: true, command };
}

/**
 * Helper function to create a failed validation result.
 */
export function validationFailure(
    error: string,
    propertyErrors?: ReadonlyArray<PropertyValidationError>
): MessageValidationResult {
    return { isValid: false, error, propertyErrors };
}

/**
 * Helper function to create a property validation error.
 */
export function createPropertyError(
    property: string,
    expected: string,
    actual: unknown
): PropertyValidationError {
    const actualType = actual === null ? 'null' : typeof actual;
    const actualValue = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
    return {
        property,
        expected,
        actual: actualType,
        message: `Property '${property}' expected ${expected}, got ${actualType}: ${actualValue.slice(0, 50)}`
    };
}

/**
 * Validate that a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate that a value is an array of strings.
 */
export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
}

/**
 * Validate that a value is a non-empty array of non-empty strings.
 */
export function isNonEmptyStringArray(value: unknown): value is string[] {
    return isStringArray(value) && value.length > 0 && value.every(s => s.trim().length > 0);
}

/**
 * Validate TaskRequirements object structure.
 */
export function isValidTaskRequirements(value: unknown): value is import('../types').TaskRequirements {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const req = value as Record<string, unknown>;
    return (
        typeof req.runTests === 'boolean' &&
        typeof req.runLinting === 'boolean' &&
        typeof req.runTypeCheck === 'boolean' &&
        typeof req.writeTests === 'boolean' &&
        typeof req.updateDocs === 'boolean' &&
        typeof req.commitChanges === 'boolean'
    );
}

/**
 * Validate RalphSettings object structure.
 */
export function isValidRalphSettings(value: unknown): value is import('../types').RalphSettings {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const settings = value as Record<string, unknown>;
    return (
        typeof settings.maxIterations === 'number' &&
        Number.isInteger(settings.maxIterations) &&
        settings.maxIterations >= 0 &&
        settings.maxIterations <= 1000
    );
}

/**
 * Validate WebviewError object structure.
 */
export function isValidWebviewError(value: unknown): value is import('../types').WebviewError {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const error = value as Record<string, unknown>;
    return (
        typeof error.message === 'string' &&
        typeof error.source === 'string' &&
        typeof error.lineno === 'number' &&
        typeof error.colno === 'number' &&
        (error.stack === undefined || typeof error.stack === 'string')
    );
}

/**
 * Validate log entry structure for export.
 */
export function isValidLogEntry(value: unknown): value is { time: string; level: string; message: string } {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const entry = value as Record<string, unknown>;
    return (
        typeof entry.time === 'string' &&
        typeof entry.level === 'string' &&
        typeof entry.message === 'string'
    );
}

/**
 * Validate an array of log entries.
 */
export function isValidLogEntryArray(value: unknown): value is Array<{ time: string; level: string; message: string }> {
    return Array.isArray(value) && value.every(isValidLogEntry);
}

// --- Individual Message Validators ---

/**
 * Validate a StartMessage.
 */
export function validateStartMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'start') {
        return validationFailure(`Expected command 'start', got '${msg.command}'`);
    }
    return validationSuccess('start');
}

/**
 * Validate a StopMessage.
 */
export function validateStopMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'stop') {
        return validationFailure(`Expected command 'stop', got '${msg.command}'`);
    }
    return validationSuccess('stop');
}

/**
 * Validate a PauseMessage.
 */
export function validatePauseMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'pause') {
        return validationFailure(`Expected command 'pause', got '${msg.command}'`);
    }
    return validationSuccess('pause');
}

/**
 * Validate a ResumeMessage.
 */
export function validateResumeMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'resume') {
        return validationFailure(`Expected command 'resume', got '${msg.command}'`);
    }
    return validationSuccess('resume');
}

/**
 * Validate a NextMessage.
 */
export function validateNextMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'next') {
        return validationFailure(`Expected command 'next', got '${msg.command}'`);
    }
    return validationSuccess('next');
}

/**
 * Validate a RefreshMessage.
 */
export function validateRefreshMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'refresh') {
        return validationFailure(`Expected command 'refresh', got '${msg.command}'`);
    }
    return validationSuccess('refresh');
}

/**
 * Validate a SkipTaskMessage.
 */
export function validateSkipTaskMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'skipTask') {
        return validationFailure(`Expected command 'skipTask', got '${msg.command}'`);
    }
    return validationSuccess('skipTask');
}

/**
 * Validate a RetryTaskMessage.
 */
export function validateRetryTaskMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'retryTask') {
        return validationFailure(`Expected command 'retryTask', got '${msg.command}'`);
    }
    return validationSuccess('retryTask');
}

/**
 * Validate a CompleteAllTasksMessage.
 */
export function validateCompleteAllTasksMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'completeAllTasks') {
        return validationFailure(`Expected command 'completeAllTasks', got '${msg.command}'`);
    }
    return validationSuccess('completeAllTasks');
}

/**
 * Validate a ResetAllTasksMessage.
 */
export function validateResetAllTasksMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'resetAllTasks') {
        return validationFailure(`Expected command 'resetAllTasks', got '${msg.command}'`);
    }
    return validationSuccess('resetAllTasks');
}

/**
 * Validate a ReorderTasksMessage.
 */
export function validateReorderTasksMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'reorderTasks') {
        return validationFailure(`Expected command 'reorderTasks', got '${msg.command}'`);
    }
    const { taskIds } = msg as { taskIds?: unknown };
    if (!isNonEmptyStringArray(taskIds)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('taskIds', 'non-empty array of strings', taskIds)
        ];
        return validationFailure('taskIds must be a non-empty array of strings', propertyErrors);
    }
    return validationSuccess('reorderTasks');
}

/**
 * Validate a GeneratePrdMessage.
 */
export function validateGeneratePrdMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'generatePrd') {
        return validationFailure(`Expected command 'generatePrd', got '${msg.command}'`);
    }
    const { taskDescription } = msg as { taskDescription?: unknown };
    if (!isNonEmptyString(taskDescription)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('taskDescription', 'non-empty string', taskDescription)
        ];
        return validationFailure('taskDescription must be a non-empty string', propertyErrors);
    }
    return validationSuccess('generatePrd');
}

/**
 * Validate a RequirementsChangedMessage.
 */
export function validateRequirementsChangedMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'requirementsChanged') {
        return validationFailure(`Expected command 'requirementsChanged', got '${msg.command}'`);
    }
    const { requirements } = msg as { requirements?: unknown };
    if (!isValidTaskRequirements(requirements)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('requirements', 'TaskRequirements object with boolean properties: runTests, runLinting, runTypeCheck, writeTests, updateDocs, commitChanges', requirements)
        ];
        return validationFailure('requirements must be a valid TaskRequirements object', propertyErrors);
    }
    return validationSuccess('requirementsChanged');
}

/**
 * Validate a SettingsChangedMessage.
 */
export function validateSettingsChangedMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'settingsChanged') {
        return validationFailure(`Expected command 'settingsChanged', got '${msg.command}'`);
    }
    const { settings } = msg as { settings?: unknown };
    if (!isValidRalphSettings(settings)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('settings', 'RalphSettings object with maxIterations (integer 0-1000)', settings)
        ];
        return validationFailure('settings must be a valid RalphSettings object', propertyErrors);
    }
    return validationSuccess('settingsChanged');
}

/**
 * Validate an ExportDataMessage.
 */
export function validateExportDataMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'exportData') {
        return validationFailure(`Expected command 'exportData', got '${msg.command}'`);
    }
    const { format } = msg as { format?: unknown };
    if (format !== undefined && format !== 'json' && format !== 'csv') {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('format', "'json' | 'csv' | undefined", format)
        ];
        return validationFailure("format must be 'json', 'csv', or undefined", propertyErrors);
    }
    return validationSuccess('exportData');
}

/**
 * Validate an ExportLogMessage.
 */
export function validateExportLogMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'exportLog') {
        return validationFailure(`Expected command 'exportLog', got '${msg.command}'`);
    }
    const { entries } = msg as { entries?: unknown };
    if (!isValidLogEntryArray(entries)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('entries', 'array of { time: string, level: string, message: string }', entries)
        ];
        return validationFailure('entries must be an array of log entry objects', propertyErrors);
    }
    return validationSuccess('exportLog');
}

/**
 * Validate a GenerateReportMessage.
 */
export function validateGenerateReportMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'generateReport') {
        return validationFailure(`Expected command 'generateReport', got '${msg.command}'`);
    }
    const { period, format, customStartDate, customEndDate } = msg as { 
        period?: unknown; 
        format?: unknown; 
        customStartDate?: unknown; 
        customEndDate?: unknown;
    };
    const propertyErrors: PropertyValidationError[] = [];
    
    const validPeriods = ['today', 'week', 'month', 'custom'];
    if (period !== undefined && (typeof period !== 'string' || !validPeriods.includes(period))) {
        propertyErrors.push(createPropertyError('period', 'one of: today, week, month, custom', period));
    }
    
    const validFormats = ['markdown', 'html', 'json'];
    if (format !== undefined && (typeof format !== 'string' || !validFormats.includes(format))) {
        propertyErrors.push(createPropertyError('format', 'one of: markdown, html, json', format));
    }
    
    if (customStartDate !== undefined && typeof customStartDate !== 'string') {
        propertyErrors.push(createPropertyError('customStartDate', 'string | undefined', customStartDate));
    }
    
    if (customEndDate !== undefined && typeof customEndDate !== 'string') {
        propertyErrors.push(createPropertyError('customEndDate', 'string | undefined', customEndDate));
    }
    
    if (propertyErrors.length > 0) {
        return validationFailure('Invalid generate report properties', propertyErrors);
    }
    return validationSuccess('generateReport');
}

/**
 * Validate a PanelStateChangedMessage.
 */
export function validatePanelStateChangedMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'panelStateChanged') {
        return validationFailure(`Expected command 'panelStateChanged', got '${msg.command}'`);
    }
    const { collapsedSections, scrollPosition } = msg as { collapsedSections?: unknown; scrollPosition?: unknown };
    const propertyErrors: PropertyValidationError[] = [];
    
    if (collapsedSections !== undefined && !isStringArray(collapsedSections)) {
        propertyErrors.push(createPropertyError('collapsedSections', 'array of strings | undefined', collapsedSections));
    }
    if (scrollPosition !== undefined && (typeof scrollPosition !== 'number' || !Number.isFinite(scrollPosition) || scrollPosition < 0)) {
        propertyErrors.push(createPropertyError('scrollPosition', 'non-negative number | undefined', scrollPosition));
    }
    
    if (propertyErrors.length > 0) {
        return validationFailure('Invalid panel state properties', propertyErrors);
    }
    return validationSuccess('panelStateChanged');
}

/**
 * Validate a WebviewErrorMessage.
 */
export function validateWebviewErrorMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'webviewError') {
        return validationFailure(`Expected command 'webviewError', got '${msg.command}'`);
    }
    const { error } = msg as { error?: unknown };
    if (error !== undefined && !isValidWebviewError(error)) {
        const propertyErrors: PropertyValidationError[] = [
            createPropertyError('error', 'WebviewError object with message, source, lineno, colno', error)
        ];
        return validationFailure('error must be a valid WebviewError object or undefined', propertyErrors);
    }
    return validationSuccess('webviewError');
}

export function validateSwitchProjectMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'switchProject') {
        return validationFailure(`Expected command 'switchProject', got '${msg.command}'`);
    }
    const m = msg as { path?: unknown };
    if (!m.path || typeof m.path !== 'string') {
        return validationFailure('path must be a non-empty string', [createPropertyError('path', 'string', m.path)]);
    }
    return validationSuccess('switchProject');
}

/**
 * Validate an OpenPanelMessage.
 */
export function validateOpenPanelMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'openPanel') {
        return validationFailure(`Expected command 'openPanel', got '${msg.command}'`);
    }
    return validationSuccess('openPanel');
}

/**
 * Validate a RefreshHistoryMessage.
 */
export function validateRefreshHistoryMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'refreshHistory') {
        return validationFailure(`Expected command 'refreshHistory', got '${msg.command}'`);
    }
    return validationSuccess('refreshHistory');
}

/**
 * Validate a RefreshSessionStatsMessage.
 */
export function validateRefreshSessionStatsMessage(msg: unknown): MessageValidationResult {
    if (!isBaseMessage(msg)) {
        return validationFailure('Message must be a non-null object with a command property');
    }
    if (msg.command !== 'refreshSessionStats') {
        return validationFailure(`Expected command 'refreshSessionStats', got '${msg.command}'`);
    }
    return validationSuccess('refreshSessionStats');
}

/**
 * Helper to check if a value is a base message (object with command property).
 */
function isBaseMessage(msg: unknown): msg is BaseWebviewMessage {
    return typeof msg === 'object' && msg !== null && 'command' in msg && typeof (msg as Record<string, unknown>).command === 'string';
}

/**
 * Map of command to validator function.
 */
export const MESSAGE_VALIDATORS: Readonly<Record<string, (msg: unknown) => MessageValidationResult>> = {
    start: validateStartMessage,
    stop: validateStopMessage,
    pause: validatePauseMessage,
    resume: validateResumeMessage,
    next: validateNextMessage,
    refresh: validateRefreshMessage,
    skipTask: validateSkipTaskMessage,
    retryTask: validateRetryTaskMessage,
    completeAllTasks: validateCompleteAllTasksMessage,
    resetAllTasks: validateResetAllTasksMessage,
    reorderTasks: validateReorderTasksMessage,
    generatePrd: validateGeneratePrdMessage,
    requirementsChanged: validateRequirementsChangedMessage,
    settingsChanged: validateSettingsChangedMessage,
    exportData: validateExportDataMessage,
    exportLog: validateExportLogMessage,
    generateReport: validateGenerateReportMessage,
    panelStateChanged: validatePanelStateChangedMessage,
    webviewError: validateWebviewErrorMessage,
    openPanel: validateOpenPanelMessage,
    switchProject: validateSwitchProjectMessage,
    refreshHistory: validateRefreshHistoryMessage,
    refreshSessionStats: validateRefreshSessionStatsMessage
};

/**
 * Comprehensive runtime validator for incoming webview messages.
 * 
 * Unlike the simple type guards (isIncomingWebviewMessage, isControlMessage, etc.),
 * this function performs deep validation of all message properties including:
 * - Command string presence and validity
 * - Required properties for each message type
 * - Property type validation (strings, numbers, booleans, objects, arrays)
 * - Nested object structure validation (TaskRequirements, RalphSettings, etc.)
 * - Range validation for numeric values
 * - Array element validation
 * 
 * @param msg - The message to validate (type unknown from webview)
 * @returns A MessageValidationResult with detailed error information if invalid
 * 
 * @example
 * ```typescript
 * const result = validateIncomingMessage(message);
 * if (!result.isValid) {
 *     logError(`Invalid message: ${result.error}`, result.propertyErrors);
 *     return;
 * }
 * // Safe to process the message
 * processValidatedMessage(message as IncomingWebviewMessage);
 * ```
 */
export function validateIncomingMessage(msg: unknown): MessageValidationResult {
    // Check basic structure
    if (typeof msg !== 'object' || msg === null) {
        return validationFailure('Message must be a non-null object');
    }
    
    const { command } = msg as Record<string, unknown>;
    
    // Check command property exists and is a string
    if (typeof command !== 'string') {
        return validationFailure('Message must have a string "command" property', [
            createPropertyError('command', 'string', command)
        ]);
    }
    
    // Check command is a known command
    if (!(ALL_INCOMING_COMMANDS as readonly string[]).includes(command)) {
        return validationFailure(`Unknown command: '${command}'`, [
            createPropertyError('command', `one of: ${ALL_INCOMING_COMMANDS.join(', ')}`, command)
        ]);
    }
    
    // Use the specific validator for this command
    const validator = MESSAGE_VALIDATORS[command];
    if (!validator) {
        // This shouldn't happen if MESSAGE_VALIDATORS is complete, but handle it gracefully
        return validationFailure(`No validator found for command: '${command}'`);
    }
    
    return validator(msg);
}

/**
 * Validate and extract a typed message if valid.
 * Returns undefined if validation fails.
 * 
 * @param msg - The message to validate
 * @param onError - Optional callback for validation errors
 * @returns The validated message cast to IncomingWebviewMessage, or undefined
 */
export function validateAndExtractMessage(
    msg: unknown,
    onError?: (result: MessageValidationResult) => void
): IncomingWebviewMessage | undefined {
    const result = validateIncomingMessage(msg);
    
    if (!result.isValid) {
        onError?.(result);
        return undefined;
    }
    
    return msg as IncomingWebviewMessage;
}

/**
 * Format a validation result as a human-readable error string.
 */
export function formatValidationError(result: MessageValidationResult): string {
    if (result.isValid) {
        return '';
    }
    
    let message = result.error || 'Unknown validation error';
    
    if (result.propertyErrors && result.propertyErrors.length > 0) {
        const propertyMessages = result.propertyErrors.map(e => `  - ${e.message}`);
        message += '\n' + propertyMessages.join('\n');
    }
    
    return message;
}

// ============================================================================
// PANEL EVENTS
// ============================================================================

/**
 * All valid panel event types that can be emitted by message handlers.
 */
export type PanelEventType =
    | 'start'
    | 'stop'
    | 'pause'
    | 'resume'
    | 'next'
    | 'skipTask'
    | 'retryTask'
    | 'completeAllTasks'
    | 'resetAllTasks'
    | 'generatePrd'
    | 'requirementsChanged'
    | 'settingsChanged'
    | 'exportData'
    | 'exportLog'
    | 'generateReport'
    | 'reorderTasks'
    | 'switchProject'
    | 'refreshSessionStats';

/**
 * Data associated with panel events.
 */
export interface PanelEventData {
    taskDescription?: string;
    requirements?: TaskRequirements;
    settings?: RalphSettings;
    format?: 'json' | 'csv' | 'markdown' | 'html';
    taskIds?: string[];
    entries?: Array<{ time: string; level: string; message: string }>;
    projectPath?: string;
    period?: 'today' | 'week' | 'month' | 'custom';
    customStartDate?: string;
    customEndDate?: string;
}

/**
 * Handler function for panel events.
 */
export type PanelEventHandler = (data?: PanelEventData) => void;

/**
 * Context provided to message handlers for emitting events and updating state.
 */
export interface MessageHandlerContext {
    /** Emit an event to registered handlers */
    emit: (event: PanelEventType, data?: PanelEventData) => void;
    /** Update panel state (for panel only) */
    updatePanelState?: (state: { collapsedSections?: string[]; scrollPosition?: number; requirements?: TaskRequirements }) => void;
    /** Refresh the panel HTML */
    refresh?: () => Promise<void>;
    /** Handle webview error logging */
    handleWebviewError?: (error: WebviewError) => void;
    /** Refresh the completion history section */
    refreshHistory?: () => Promise<void>;
    /** Refresh the session stats dashboard */
    refreshSessionStats?: () => Promise<void>;
    /** Log level for activity log */
    logLevel?: LogLevel;
}

/**
 * Interface for all message handlers.
 * Each handler is responsible for a specific feature area.
 */
export interface IMessageHandler {
    /** 
     * List of commands this handler can process.
     */
    readonly handledCommands: ReadonlyArray<string>;
    
    /**
     * Check if this handler can process the given message.
     * @param message - The message to check
     * @returns True if this handler can process the message
     */
    canHandle(message: BaseWebviewMessage): boolean;
    
    /**
     * Process the message and emit appropriate events.
     * @param message - The message to process
     * @param context - The context for emitting events and updating state
     */
    handle(message: BaseWebviewMessage, context: MessageHandlerContext): void;
}

/**
 * Factory function type for creating message handlers.
 */
export type MessageHandlerFactory = () => IMessageHandler;

/**
 * Registry of all available message handlers.
 */
export interface MessageHandlerRegistry {
    /** Get all registered handlers */
    getHandlers(): ReadonlyArray<IMessageHandler>;
    /** Find a handler for a specific command */
    findHandler(command: string): IMessageHandler | undefined;
    /** Register a new handler */
    register(handler: IMessageHandler): void;
}
