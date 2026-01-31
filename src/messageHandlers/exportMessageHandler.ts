/**
 * Export Message Handler
 * 
 * Handles data export messages: exportData, exportLog, generateReport.
 * These commands export timeline and log data to files, and generate productivity reports.
 */

import { 
    IMessageHandler, 
    BaseWebviewMessage, 
    MessageHandlerContext, 
    ExportMessage,
    ExportDataMessage,
    ExportLogMessage,
    GenerateReportMessage,
    EXPORT_COMMANDS,
    isExportMessage
} from './types';

/**
 * Handler for data export messages.
 * 
 * Responsible for:
 * - Exporting timeline data as JSON/CSV
 * - Exporting activity log to file
 * - Generating productivity reports
 */
export class ExportMessageHandler implements IMessageHandler {
    /**
     * List of commands this handler processes.
     */
    public readonly handledCommands: ReadonlyArray<string> = EXPORT_COMMANDS;

    /**
     * Check if this handler can process the given message.
     */
    public canHandle(message: BaseWebviewMessage): boolean {
        return isExportMessage(message);
    }

    /**
     * Process export messages and emit appropriate events.
     */
    public handle(message: BaseWebviewMessage, context: MessageHandlerContext): void {
        if (!isExportMessage(message)) {
            return;
        }

        switch (message.command) {
            case 'exportData': {
                const exportMsg = message as ExportDataMessage;
                context.emit('exportData', { format: exportMsg.format });
                break;
            }
            case 'exportLog': {
                const logMsg = message as ExportLogMessage;
                context.emit('exportLog', { entries: logMsg.entries });
                break;
            }
            case 'generateReport': {
                const reportMsg = message as GenerateReportMessage;
                context.emit('generateReport', { 
                    period: reportMsg.period,
                    format: reportMsg.format,
                    customStartDate: reportMsg.customStartDate,
                    customEndDate: reportMsg.customEndDate
                });
                break;
            }
        }
    }
}

/**
 * Factory function to create an ExportMessageHandler instance.
 */
export function createExportMessageHandler(): IMessageHandler {
    return new ExportMessageHandler();
}
