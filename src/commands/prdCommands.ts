/**
 * PRD Commands
 * 
 * Commands for PRD and settings management:
 * - GeneratePrdCommand: Generate a new PRD from description
 * - UpdateRequirementsCommand: Update task requirements
 * - UpdateSettingsCommand: Update Ralph settings
 */

import { BaseCommand, UndoableCommand } from './baseCommand';
import { CommandResult, CommandContext, CommandNames } from './types';
import { TaskRequirements, RalphSettings } from '../types';

/**
 * Command to generate a PRD from a description.
 */
export class GeneratePrdCommand extends BaseCommand {
    public readonly name = CommandNames.GENERATE_PRD;
    public readonly description = 'Generate a PRD file from a task description';

    private readonly taskDescription: string;

    constructor(context: CommandContext, taskDescription: string) {
        super(context);
        this.taskDescription = taskDescription;
    }

    protected async doExecute(): Promise<CommandResult> {
        if (!this.taskDescription || this.taskDescription.trim().length === 0) {
            return this.failure('Task description cannot be empty');
        }

        await this.context.generatePrdFromDescription(this.taskDescription);
        return this.success('PRD generation initiated', { description: this.taskDescription });
    }
}

/**
 * Command to update task requirements.
 * This command is undoable - the previous requirements are captured and can be restored.
 */
export class UpdateRequirementsCommand extends UndoableCommand {
    public readonly name = CommandNames.UPDATE_REQUIREMENTS;
    public readonly description = 'Update task execution requirements';

    private readonly newRequirements: TaskRequirements;

    constructor(context: CommandContext, requirements: TaskRequirements) {
        super(context);
        this.newRequirements = requirements;
    }

    protected async doExecute(): Promise<CommandResult> {
        // Capture current state for undo
        const previousRequirements = this.context.getRequirements();
        this.captureState(previousRequirements);

        this.context.setRequirements(this.newRequirements);
        return this.success('Requirements updated successfully', { 
            previous: previousRequirements,
            current: this.newRequirements 
        });
    }

    protected async doUndo(): Promise<CommandResult> {
        const previousRequirements = this.previousState as TaskRequirements;
        if (!previousRequirements) {
            return this.failure('Cannot undo - no previous state captured');
        }

        this.context.setRequirements(previousRequirements);
        return this.success('Requirements restored to previous values', { requirements: previousRequirements });
    }
}

/**
 * Command to update Ralph settings.
 * This command is undoable - the previous settings are captured and can be restored.
 */
export class UpdateSettingsCommand extends UndoableCommand {
    public readonly name = CommandNames.UPDATE_SETTINGS;
    public readonly description = 'Update Ralph configuration settings';

    private readonly newSettings: RalphSettings;

    constructor(context: CommandContext, settings: RalphSettings) {
        super(context);
        this.newSettings = settings;
    }

    protected async doExecute(): Promise<CommandResult> {
        // Capture current state for undo
        const previousSettings = this.context.getSettings();
        this.captureState(previousSettings);

        this.context.setSettings(this.newSettings);
        return this.success('Settings updated successfully', {
            previous: previousSettings,
            current: this.newSettings
        });
    }

    protected async doUndo(): Promise<CommandResult> {
        const previousSettings = this.previousState as RalphSettings;
        if (!previousSettings) {
            return this.failure('Cannot undo - no previous state captured');
        }

        this.context.setSettings(previousSettings);
        return this.success('Settings restored to previous values', { settings: previousSettings });
    }
}

/**
 * Factory functions for creating PRD commands.
 */
export const createGeneratePrdCommand = (context: CommandContext, taskDescription: string): GeneratePrdCommand => 
    new GeneratePrdCommand(context, taskDescription);

export const createUpdateRequirementsCommand = (context: CommandContext, requirements: TaskRequirements): UpdateRequirementsCommand => 
    new UpdateRequirementsCommand(context, requirements);

export const createUpdateSettingsCommand = (context: CommandContext, settings: RalphSettings): UpdateSettingsCommand => 
    new UpdateSettingsCommand(context, settings);
