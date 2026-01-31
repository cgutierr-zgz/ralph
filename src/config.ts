import * as vscode from 'vscode';
import { RalphConfig, RalphSettings, DEFAULT_CONFIG, DEFAULT_SETTINGS } from './types';

export function getConfig(resource?: vscode.Uri): RalphConfig {
    const config = vscode.workspace.getConfiguration('ralph', resource);

    return {
        files: {
            prdPath: config.get<string>('files.prdPath', DEFAULT_CONFIG.files.prdPath),
            progressPath: config.get<string>('files.progressPath', DEFAULT_CONFIG.files.progressPath)
        },
        prompt: {
            customTemplate: config.get<string>('prompt.customTemplate', DEFAULT_CONFIG.prompt.customTemplate),
            customPrdGenerationTemplate: config.get<string>('prompt.customPrdGenerationTemplate', DEFAULT_CONFIG.prompt.customPrdGenerationTemplate)
        }
    };
}

/**
 * Gets Ralph settings from VS Code configuration.
 */
export function getSettings(): RalphSettings {
    const config = vscode.workspace.getConfiguration('ralph');
    return {
        maxIterations: config.get<number>('settings.maxIterations', DEFAULT_SETTINGS.maxIterations)
    };
}

/**
 * Updates Ralph settings in VS Code configuration.
 * Settings are stored at the workspace level if a workspace is open,
 * otherwise at the global (user) level.
 */
export async function updateSettings(settings: RalphSettings): Promise<void> {
    const config = vscode.workspace.getConfiguration('ralph');
    
    // Use workspace configuration target if a workspace is open, otherwise use global
    const target = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;
    
    await config.update('settings.maxIterations', settings.maxIterations, target);
}
