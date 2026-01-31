/**
 * Control Commands
 * 
 * Commands for controlling the Ralph execution loop:
 * - StartLoopCommand: Start the task execution loop
 * - StopLoopCommand: Stop the execution loop
 * - PauseLoopCommand: Pause the execution loop
 * - ResumeLoopCommand: Resume a paused loop
 * - RunSingleStepCommand: Execute a single task step
 */

import { BaseCommand } from './baseCommand';
import { CommandResult, CommandContext, CommandNames } from './types';

/**
 * Command to start the task execution loop.
 */
export class StartLoopCommand extends BaseCommand {
    public readonly name = CommandNames.START_LOOP;
    public readonly description = 'Start the Ralph task execution loop';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.startLoop();
        return this.success('Loop started successfully');
    }
}

/**
 * Command to stop the task execution loop.
 */
export class StopLoopCommand extends BaseCommand {
    public readonly name = CommandNames.STOP_LOOP;
    public readonly description = 'Stop the Ralph task execution loop';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.stopLoop();
        return this.success('Loop stopped successfully');
    }
}

/**
 * Command to pause the task execution loop.
 */
export class PauseLoopCommand extends BaseCommand {
    public readonly name = CommandNames.PAUSE_LOOP;
    public readonly description = 'Pause the Ralph task execution loop';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        this.context.pauseLoop();
        return this.success('Loop paused successfully');
    }
}

/**
 * Command to resume a paused task execution loop.
 */
export class ResumeLoopCommand extends BaseCommand {
    public readonly name = CommandNames.RESUME_LOOP;
    public readonly description = 'Resume the paused Ralph task execution loop';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        this.context.resumeLoop();
        return this.success('Loop resumed successfully');
    }
}

/**
 * Command to run a single task step.
 */
export class RunSingleStepCommand extends BaseCommand {
    public readonly name = CommandNames.RUN_SINGLE_STEP;
    public readonly description = 'Execute a single task step';

    constructor(context: CommandContext) {
        super(context);
    }

    protected async doExecute(): Promise<CommandResult> {
        await this.context.runSingleStep();
        return this.success('Single step executed successfully');
    }
}

/**
 * Factory functions for creating control commands.
 */
export const createStartLoopCommand = (context: CommandContext): StartLoopCommand => new StartLoopCommand(context);
export const createStopLoopCommand = (context: CommandContext): StopLoopCommand => new StopLoopCommand(context);
export const createPauseLoopCommand = (context: CommandContext): PauseLoopCommand => new PauseLoopCommand(context);
export const createResumeLoopCommand = (context: CommandContext): ResumeLoopCommand => new ResumeLoopCommand(context);
export const createRunSingleStepCommand = (context: CommandContext): RunSingleStepCommand => new RunSingleStepCommand(context);
