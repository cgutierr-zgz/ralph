/**
 * Command Registry
 * 
 * Central registry for command factories.
 * Allows looking up and creating commands by name.
 */

import { ICommandRegistry, CommandFactory, CommandContext, CommandNames } from './types';
import {
    createStartLoopCommand,
    createStopLoopCommand,
    createPauseLoopCommand,
    createResumeLoopCommand,
    createRunSingleStepCommand
} from './controlCommands';
import {
    createSkipTaskCommand,
    createRetryTaskCommand,
    createCompleteAllTasksCommand,
    createResetAllTasksCommand,
    createReorderTasksCommand
} from './taskCommands';
import {
    createGeneratePrdCommand,
    createUpdateRequirementsCommand,
    createUpdateSettingsCommand
} from './prdCommands';
import { createMacroCommand } from './macroCommand';

/**
 * Default implementation of the command registry.
 */
export class CommandRegistry implements ICommandRegistry {
    private readonly factories = new Map<string, CommandFactory>();

    /**
     * Register a command factory.
     * @param name - The command name
     * @param factory - Factory function to create the command
     */
    public register(name: string, factory: CommandFactory): void {
        this.factories.set(name, factory);
    }

    /**
     * Get a command factory by name.
     * @param name - The command name
     * @returns The factory function, or undefined if not found
     */
    public get(name: string): CommandFactory | undefined {
        return this.factories.get(name);
    }

    /**
     * Check if a command is registered.
     * @param name - The command name
     * @returns True if the command is registered
     */
    public has(name: string): boolean {
        return this.factories.has(name);
    }

    /**
     * Get all registered command names.
     * @returns Array of command names
     */
    public getNames(): ReadonlyArray<string> {
        return Array.from(this.factories.keys());
    }

    /**
     * Get the number of registered commands.
     */
    public get size(): number {
        return this.factories.size;
    }

    /**
     * Clear all registered commands.
     */
    public clear(): void {
        this.factories.clear();
    }
}

/**
 * Create and configure a default command registry with all built-in commands.
 * @returns A configured CommandRegistry instance
 */
export function createDefaultCommandRegistry(): CommandRegistry {
    const registry = new CommandRegistry();

    // Register control commands
    registry.register(CommandNames.START_LOOP, createStartLoopCommand);
    registry.register(CommandNames.STOP_LOOP, createStopLoopCommand);
    registry.register(CommandNames.PAUSE_LOOP, createPauseLoopCommand);
    registry.register(CommandNames.RESUME_LOOP, createResumeLoopCommand);
    registry.register(CommandNames.RUN_SINGLE_STEP, createRunSingleStepCommand);

    // Register task commands
    registry.register(CommandNames.SKIP_TASK, createSkipTaskCommand);
    registry.register(CommandNames.RETRY_TASK, createRetryTaskCommand);
    registry.register(CommandNames.COMPLETE_ALL_TASKS, createCompleteAllTasksCommand);
    registry.register(CommandNames.RESET_ALL_TASKS, createResetAllTasksCommand);
    // Note: reorderTasks needs additional args, so use a wrapper
    registry.register(CommandNames.REORDER_TASKS, (context: CommandContext, taskIds?: unknown) => 
        createReorderTasksCommand(context, (taskIds as string[]) || [])
    );

    // Register PRD commands
    registry.register(CommandNames.GENERATE_PRD, (context: CommandContext, description?: unknown) => 
        createGeneratePrdCommand(context, (description as string) || '')
    );
    registry.register(CommandNames.UPDATE_REQUIREMENTS, (context: CommandContext, requirements?: unknown) => 
        createUpdateRequirementsCommand(context, requirements as import('../types').TaskRequirements)
    );
    registry.register(CommandNames.UPDATE_SETTINGS, (context: CommandContext, settings?: unknown) => 
        createUpdateSettingsCommand(context, settings as import('../types').RalphSettings)
    );

    // Register macro command
    registry.register(CommandNames.MACRO, (context: CommandContext, commands?: unknown, name?: unknown, description?: unknown) =>
        createMacroCommand(
            context,
            (commands as import('./types').ICommand[]) || [],
            name as string | undefined,
            description as string | undefined
        )
    );

    return registry;
}

/**
 * Singleton instance of the default command registry.
 */
let defaultRegistry: CommandRegistry | null = null;

/**
 * Get the default command registry singleton.
 * Creates it if it doesn't exist.
 */
export function getDefaultCommandRegistry(): CommandRegistry {
    if (!defaultRegistry) {
        defaultRegistry = createDefaultCommandRegistry();
    }
    return defaultRegistry;
}

/**
 * Reset the default command registry (useful for testing).
 */
export function resetDefaultCommandRegistry(): void {
    defaultRegistry = null;
}
