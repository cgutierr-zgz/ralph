import * as vscode from 'vscode';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

import { Task, TaskStatus } from './types';
import { getConfig } from './config';
import { logError } from './logger';

let activeWorkspaceRoot: string | null = null;

/**
 * Sets the active workspace root folder.
 * Used for multi-root workspace support.
 */
export function setActiveWorkspaceFolder(root: string | null) {
    activeWorkspaceRoot = root;
}

/**
 * Scans all workspace folders to find those containing a PRD file.
 */
export async function discoverPrdRootsAsync(): Promise<string[]> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) { return []; }

    const roots: string[] = [];
    for (const folder of folders) {
        const config = getConfig(folder.uri);
        const prdPath = path.join(folder.uri.fsPath, config.files.prdPath);
        try {
            await fsPromises.access(prdPath);
            roots.push(folder.uri.fsPath);
        } catch {
            // PRD file not found in this root
        }
    }
    return roots;
}

export function getWorkspaceRoot(): string | null {
    if (activeWorkspaceRoot) {
        return activeWorkspaceRoot;
    }
    
    // Fallback logic
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }
    return null;
}

export async function readPRDAsync(): Promise<string | null> {
    const root = getWorkspaceRoot();
    if (!root) { return null; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    try {
        await fsPromises.access(prdPath);
        return await fsPromises.readFile(prdPath, 'utf-8');
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            logError('Failed to read PRD.md', error);
        }
        return null;
    }
}

export async function readProgressAsync(): Promise<string> {
    const root = getWorkspaceRoot();
    if (!root) { return ''; }
    const config = getConfig(vscode.Uri.file(root));

    const progressPath = path.join(root, config.files.progressPath);
    try {
        await fsPromises.access(progressPath);
        return await fsPromises.readFile(progressPath, 'utf-8');
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            logError('Failed to read progress.txt', error);
        }
        return '';
    }
}

export async function appendProgressAsync(entry: string): Promise<boolean> {
    const root = getWorkspaceRoot();
    if (!root) { return false; }
    const config = getConfig(vscode.Uri.file(root));

    const progressPath = path.join(root, config.files.progressPath);
    try {
        const timestamp = new Date().toISOString();
        const formattedEntry = `[${timestamp}] ${entry}\n`;
        await fsPromises.appendFile(progressPath, formattedEntry, 'utf-8');
        return true;
    } catch (error) {
        logError('Failed to append to progress.txt', error);
        return false;
    }
}

export async function ensureProgressFileAsync(): Promise<boolean> {
    const root = getWorkspaceRoot();
    if (!root) { return false; }
    const config = getConfig(vscode.Uri.file(root));

    const progressPath = path.join(root, config.files.progressPath);
    try {
        await fsPromises.access(progressPath);
        return true;
    } catch {
        // File doesn't exist, create it
        try {
            await fsPromises.writeFile(progressPath, '# Progress Log\n\n', 'utf-8');
            return true;
        } catch (error) {
            logError('Failed to create progress.txt', error);
            return false;
        }
    }
}

function parseTasksFromContent(content: string): Task[] {
    const tasks: Task[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = /^[-*]\s*\[([ x~!s])\]\s*(.+)$/im.exec(line);

        if (match) {
            const marker = match[1].toLowerCase();
            const fullDescription = match[2].trim();
            
            // Extract dependencies
            const description = fullDescription;
            const dependencies: string[] = [];
            
            const depMatch = /\(depends on:\s*([^)]+)\)/i.exec(fullDescription);
            if (depMatch) {
                // Parse dependencies string: "Task A", 'Task B', Task C
                const depString = depMatch[1];
                // Split by comma and clean quotes
                dependencies.push(...depString.split(',').map(d => d.trim().replace(/^['"]|['"]$/g, '')));
                
                // Remove dependency string from description for cleaner display? 
                // Currently keeping it to match original raw content behavior, 
                // but for visualization we use the extracted array.
            }

            // Extract acceptance criteria using [AC: criterion1; criterion2] syntax
            const acceptanceCriteria: string[] = [];
            const acMatch = /\[AC:\s*([^\]]+)\]/i.exec(fullDescription);
            if (acMatch) {
                // Split by semicolon and clean up whitespace
                acceptanceCriteria.push(...acMatch[1].split(';').map(c => c.trim()).filter(c => c.length > 0));
            }

            let status: TaskStatus;
            switch (marker) {
                case 'x':
                    status = TaskStatus.COMPLETE;
                    break;
                case '~':
                    status = TaskStatus.IN_PROGRESS;
                    break;
                case '!':
                    status = TaskStatus.BLOCKED;
                    break;
                case 's':
                    status = TaskStatus.SKIPPED;
                    break;
                default:
                    status = TaskStatus.PENDING;
            }

            tasks.push({
                id: `task-${i + 1}`,
                description,
                status,
                lineNumber: i + 1,
                rawLine: line,
                dependencies,
                acceptanceCriteria: acceptanceCriteria.length > 0 ? acceptanceCriteria : undefined
            });
        }
    }

    return tasks;
}

export async function parseTasksAsync(): Promise<Task[]> {
    const content = await readPRDAsync();
    if (!content) { return []; }
    return parseTasksFromContent(content);
}

export async function reorderTasksAsync(orderedTaskIds: string[]): Promise<boolean> {
    const root = getWorkspaceRoot();
    if (!root) { return false; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    let content: string;
    
    try {
        content = await fsPromises.readFile(prdPath, 'utf-8');
    } catch (error) {
        logError('Failed to read PRD.md for reordering', error);
        return false;
    }

    const tasks = parseTasksFromContent(content);
    // Map ID to Task
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    // Verify all provided IDs exist
    if (!orderedTaskIds.every(id => taskMap.has(id))) {
        logError('Reorder failed: One or more task IDs not found', new Error('Invalid task IDs'));
        return false;
    }

    // Get the tasks that are being reordered
    const tasksToReorder = orderedTaskIds.map(id => taskMap.get(id)!);

    // Get their original line numbers (slots in the file), sorted ascending
    // These are the lines we will overwrite with the new order
    const sortedLineNumbers = tasksToReorder.map(t => t.lineNumber).sort((a, b) => a - b);

    // Get the raw lines of the tasks in their NEW order
    const newLinesOfText = tasksToReorder.map(t => t.rawLine);

    const lines = content.split('\n');
    
    // Replace the content at the slot positions
    for (let i = 0; i < sortedLineNumbers.length; i++) {
        const lineNum = sortedLineNumbers[i]; // 1-based
        const newLineContent = newLinesOfText[i];
        lines[lineNum - 1] = newLineContent;
    }

    const newContent = lines.join('\n');

    try {
        await fsPromises.writeFile(prdPath, newContent, 'utf-8');
        return true;
    } catch (error) {
        logError('Failed to write reordered tasks to PRD.md', error);
        return false;
    }
}

export async function getNextTaskAsync(): Promise<Task | null> {
    const tasks = await parseTasksAsync();
    return tasks.find(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS) || null;
}

export async function getTaskStatsAsync(): Promise<{ total: number; completed: number; pending: number }> {
    const tasks = await parseTasksAsync();
    return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === TaskStatus.COMPLETE).length,
        pending: tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS).length
    };
}

/**
 * Gets aggregated task statistics across all projects in the workspace.
 * This function scans all discovered PRD roots and aggregates their stats.
 */
export async function getAggregatedStatsAsync(): Promise<{
    projects: Array<{ name: string; path: string; total: number; completed: number; pending: number; progress: number }>;
    totalTasks: number;
    totalCompleted: number;
    totalPending: number;
    overallProgress: number;
    projectCount: number;
}> {
    const roots = await discoverPrdRootsAsync();
    
    if (roots.length === 0) {
        return {
            projects: [],
            totalTasks: 0,
            totalCompleted: 0,
            totalPending: 0,
            overallProgress: 0,
            projectCount: 0
        };
    }

    const projects: Array<{ name: string; path: string; total: number; completed: number; pending: number; progress: number }> = [];
    let totalTasks = 0;
    let totalCompleted = 0;
    let totalPending = 0;

    // Save current active root
    const previousRoot = activeWorkspaceRoot;

    for (const root of roots) {
        // Temporarily switch to this root to read its PRD
        activeWorkspaceRoot = root;
        
        const config = getConfig(vscode.Uri.file(root));
        const prdPath = path.join(root, config.files.prdPath);
        
        try {
            const content = await fsPromises.readFile(prdPath, 'utf-8');
            const tasks = parseTasksFromContent(content);
            
            const completed = tasks.filter(t => t.status === TaskStatus.COMPLETE).length;
            const pending = tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS).length;
            const total = tasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            projects.push({
                name: path.basename(root),
                path: root,
                total,
                completed,
                pending,
                progress
            });

            totalTasks += total;
            totalCompleted += completed;
            totalPending += pending;
        } catch {
            // Skip projects with read errors
        }
    }

    // Restore previous active root
    activeWorkspaceRoot = previousRoot;

    const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return {
        projects,
        totalTasks,
        totalCompleted,
        totalPending,
        overallProgress,
        projectCount: projects.length
    };
}

export async function markTaskAsSkippedAsync(lineNumber: number): Promise<boolean> {
    const root = getWorkspaceRoot();
    if (!root) { return false; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    try {
        const content = await fsPromises.readFile(prdPath, 'utf-8');
        const lines = content.split('\n');
        
        if (lineNumber < 1 || lineNumber > lines.length) {
            return false;
        }

        const lineIndex = lineNumber - 1;
        const line = lines[lineIndex];
        
        // Match any task marker (including potentially already changed ones)
        const match = /^(\s*[-*]\s*)\[([ x~!s]?)\](\s*.+)$/i.exec(line);
        if (match) {
            // Replace marker with [s]
             // match[1] is prefix with indent (e.g. "  - "), match[2] is state char, match[3] is description
            // Construct new line preserving indentation
            // We can just replace the bracket part
            
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[s]');
            lines[lineIndex] = newLine;
            
            await fsPromises.writeFile(prdPath, lines.join('\n'), 'utf-8');
            return true;
        }
        return false;
    } catch (error) {
        logError('Failed to mark task as skipped', error);
        return false;
    }
}

/**
 * Gets the first blocked (failed) task from the PRD.
 * Blocked tasks are marked with [!] in the PRD.md file.
 */
export async function getFirstBlockedTaskAsync(): Promise<Task | null> {
    const tasks = await parseTasksAsync();
    return tasks.find(t => t.status === TaskStatus.BLOCKED) || null;
}

/**
 * Marks a blocked task as pending (retrying it).
 * Changes the [!] marker back to [ ] in the PRD.md file.
 */
export async function markTaskAsPendingAsync(lineNumber: number): Promise<boolean> {
    const root = getWorkspaceRoot();
    if (!root) { return false; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    try {
        const content = await fsPromises.readFile(prdPath, 'utf-8');
        const lines = content.split('\n');
        
        if (lineNumber < 1 || lineNumber > lines.length) {
            return false;
        }

        const lineIndex = lineNumber - 1;
        const line = lines[lineIndex];
        
        // Match any task marker
        const match = /^(\s*[-*]\s*)\[([ x~!s]?)\](\s*.+)$/i.exec(line);
        if (match) {
            // Replace marker with [ ] (pending)
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            lines[lineIndex] = newLine;
            
            await fsPromises.writeFile(prdPath, lines.join('\n'), 'utf-8');
            return true;
        }
        return false;
    } catch (error) {
        logError('Failed to mark task as pending (retry)', error);
        return false;
    }
}

/**
 * Marks all pending, in-progress, blocked, and skipped tasks as complete.
 * Returns the count of tasks that were marked as complete.
 */
export async function markAllTasksAsCompleteAsync(): Promise<number> {
    const root = getWorkspaceRoot();
    if (!root) { return 0; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    try {
        const content = await fsPromises.readFile(prdPath, 'utf-8');
        const lines = content.split('\n');
        
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Match any non-complete task marker (pending, in-progress, blocked, skipped)
            const match = /^(\s*[-*]\s*)\[([  ~!s])\](\s*.+)$/i.exec(line);
            if (match) {
                // Replace marker with [x] (complete)
                lines[i] = line.replace(/\[([  ~!s])\]/i, '[x]');
                count++;
            }
        }

        if (count > 0) {
            await fsPromises.writeFile(prdPath, lines.join('\n'), 'utf-8');
        }
        return count;
    } catch (error) {
        logError('Failed to mark all tasks as complete', error);
        return 0;
    }
}

/**
 * Resets all tasks to pending status.
 * Changes [x], [~], [!], and [s] markers back to [ ] in the PRD.md file.
 * Returns the count of tasks that were reset.
 */
export async function resetAllTasksAsync(): Promise<number> {
    const root = getWorkspaceRoot();
    if (!root) { return 0; }
    const config = getConfig(vscode.Uri.file(root));

    const prdPath = path.join(root, config.files.prdPath);
    try {
        const content = await fsPromises.readFile(prdPath, 'utf-8');
        const lines = content.split('\n');
        
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Match any non-pending task marker (complete, in-progress, blocked, skipped)
            const match = /^(\s*[-*]\s*)\[([x~!s])\](\s*.+)$/i.exec(line);
            if (match) {
                // Replace marker with [ ] (pending)
                lines[i] = line.replace(/\[([x~!s])\]/i, '[ ]');
                count++;
            }
        }

        if (count > 0) {
            await fsPromises.writeFile(prdPath, lines.join('\n'), 'utf-8');
        }
        return count;
    } catch (error) {
        logError('Failed to reset all tasks', error);
        return 0;
    }
}
