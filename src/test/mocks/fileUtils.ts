/**
 * Mock implementation of file utilities for testing.
 */

import { Task, TaskStatus, TaskCompletion, RalphConfig, DEFAULT_CONFIG } from '../../types';

export interface MockFileSystemState {
    files: Map<string, string>;
    workspaceRoot: string | null;
}

/**
 * Mock implementation of file utilities for unit testing.
 * Provides in-memory file system simulation.
 */
export class MockFileUtils {
    private files = new Map<string, string>();
    private workspaceRoot: string | null = '/test/workspace';
    private config: RalphConfig = { ...DEFAULT_CONFIG };
    private methodCalls: Array<{ method: string; args: unknown[] }> = [];

    constructor(initialState?: Partial<MockFileSystemState>) {
        if (initialState?.files) {
            this.files = new Map(initialState.files);
        }
        if (initialState?.workspaceRoot !== undefined) {
            this.workspaceRoot = initialState.workspaceRoot;
        }
    }

    // Workspace root
    getWorkspaceRoot(): string | null {
        this.recordCall('getWorkspaceRoot', []);
        return this.workspaceRoot;
    }

    setWorkspaceRoot(root: string | null): void {
        this.workspaceRoot = root;
    }

    // PRD operations
    async readPRDAsync(): Promise<string | null> {
        this.recordCall('readPRDAsync', []);
        if (!this.workspaceRoot) { return null; }
        const prdPath = `${this.workspaceRoot}/${this.config.files.prdPath}`;
        return this.files.get(prdPath) ?? null;
    }

    async writePRDAsync(content: string): Promise<boolean> {
        this.recordCall('writePRDAsync', [content]);
        if (!this.workspaceRoot) { return false; }
        const prdPath = `${this.workspaceRoot}/${this.config.files.prdPath}`;
        this.files.set(prdPath, content);
        return true;
    }

    // Progress operations
    async readProgressAsync(): Promise<string> {
        this.recordCall('readProgressAsync', []);
        if (!this.workspaceRoot) { return ''; }
        const progressPath = `${this.workspaceRoot}/${this.config.files.progressPath}`;
        return this.files.get(progressPath) ?? '';
    }

    async appendProgressAsync(entry: string): Promise<boolean> {
        this.recordCall('appendProgressAsync', [entry]);
        if (!this.workspaceRoot) { return false; }
        const progressPath = `${this.workspaceRoot}/${this.config.files.progressPath}`;
        const current = this.files.get(progressPath) ?? '';
        const timestamp = new Date().toISOString();
        this.files.set(progressPath, current + `[${timestamp}] ${entry}\n`);
        return true;
    }

    async ensureProgressFileAsync(): Promise<boolean> {
        this.recordCall('ensureProgressFileAsync', []);
        if (!this.workspaceRoot) { return false; }
        const progressPath = `${this.workspaceRoot}/${this.config.files.progressPath}`;
        if (!this.files.has(progressPath)) {
            this.files.set(progressPath, '# Progress Log\n\n');
        }
        return true;
    }

    // Task parsing
    parseTasksFromContent(content: string): Task[] {
        this.recordCall('parseTasksFromContent', [content]);
        const tasks: Task[] = [];
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const match = /^[-*]\s*\[([ x~!s])\]\s*(.+)$/im.exec(line);

            if (match) {
                const marker = match[1].toLowerCase();
                const fullDescription = match[2].trim();
                
                // Parse dependencies from [depends on: X, Y] syntax
                const depsMatch = /\[depends on:\s*([^\]]+)\]/i.exec(fullDescription);
                const dependencies = depsMatch 
                    ? depsMatch[1].split(',').map(d => d.trim()).filter(d => d)
                    : undefined;

                // Parse acceptance criteria from [AC: ...] syntax
                const acMatch = /\[AC:\s*([^\]]+)\]/i.exec(fullDescription);
                const acceptanceCriteria = acMatch
                    ? acMatch[1].split(';').map(c => c.trim()).filter(c => c)
                    : undefined;

                // Remove metadata from description
                let description = fullDescription
                    .replace(/\[depends on:[^\]]+\]/gi, '')
                    .replace(/\[AC:[^\]]+\]/gi, '')
                    .trim();

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
                    id: `task-${i}`,
                    description,
                    status,
                    lineNumber: i + 1,
                    rawLine: line,
                    dependencies,
                    acceptanceCriteria
                });
            }
        }

        return tasks;
    }

    async parseTasksAsync(): Promise<Task[]> {
        this.recordCall('parseTasksAsync', []);
        const content = await this.readPRDAsync();
        if (!content) { return []; }
        return this.parseTasksFromContent(content);
    }

    // Task stats
    async getTaskStatsAsync(): Promise<{ completed: number; pending: number; total: number; progress: number }> {
        this.recordCall('getTaskStatsAsync', []);
        const tasks = await this.parseTasksAsync();
        const completed = tasks.filter(t => t.status === TaskStatus.COMPLETE).length;
        const pending = tasks.filter(t => t.status === TaskStatus.PENDING).length;
        const total = tasks.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, pending, total, progress };
    }

    // Next task
    async getNextTaskAsync(): Promise<Task | null> {
        this.recordCall('getNextTaskAsync', []);
        const tasks = await this.parseTasksAsync();
        return tasks.find(t => t.status === TaskStatus.PENDING) ?? null;
    }

    // Task modifications
    async markTaskAsSkippedAsync(lineNumber: number): Promise<boolean> {
        this.recordCall('markTaskAsSkippedAsync', [lineNumber]);
        const content = await this.readPRDAsync();
        if (!content) { return false; }
        
        const lines = content.split('\n');
        if (lineNumber < 1 || lineNumber > lines.length) { return false; }
        
        const line = lines[lineNumber - 1];
        const updatedLine = line.replace(/\[([ ~!])\]/, '[s]');
        lines[lineNumber - 1] = updatedLine;
        
        await this.writePRDAsync(lines.join('\n'));
        return true;
    }

    async markTaskAsPendingAsync(lineNumber: number): Promise<boolean> {
        this.recordCall('markTaskAsPendingAsync', [lineNumber]);
        const content = await this.readPRDAsync();
        if (!content) { return false; }
        
        const lines = content.split('\n');
        if (lineNumber < 1 || lineNumber > lines.length) { return false; }
        
        const line = lines[lineNumber - 1];
        const updatedLine = line.replace(/\[(!|s)\]/, '[ ]');
        lines[lineNumber - 1] = updatedLine;
        
        await this.writePRDAsync(lines.join('\n'));
        return true;
    }

    async markAllTasksAsCompleteAsync(): Promise<number> {
        this.recordCall('markAllTasksAsCompleteAsync', []);
        const content = await this.readPRDAsync();
        if (!content) { return 0; }
        
        let count = 0;
        const updatedContent = content.replace(/\[([ ~!s])\]/g, () => {
            count++;
            return '[x]';
        });
        
        await this.writePRDAsync(updatedContent);
        return count;
    }

    async resetAllTasksAsync(): Promise<number> {
        this.recordCall('resetAllTasksAsync', []);
        const content = await this.readPRDAsync();
        if (!content) { return 0; }
        
        let count = 0;
        const updatedContent = content.replace(/\[([x~!s])\]/g, () => {
            count++;
            return '[ ]';
        });
        
        await this.writePRDAsync(updatedContent);
        return count;
    }

    async getFirstBlockedTaskAsync(): Promise<Task | null> {
        this.recordCall('getFirstBlockedTaskAsync', []);
        const tasks = await this.parseTasksAsync();
        return tasks.find(t => t.status === TaskStatus.BLOCKED) ?? null;
    }

    async reorderTasksAsync(taskOrder: string[]): Promise<boolean> {
        this.recordCall('reorderTasksAsync', [taskOrder]);
        // Simplified mock - just record the call
        return true;
    }

    // File operations
    async readFileAsync(path: string): Promise<string | null> {
        this.recordCall('readFileAsync', [path]);
        return this.files.get(path) ?? null;
    }

    async writeFileAsync(path: string, content: string): Promise<boolean> {
        this.recordCall('writeFileAsync', [path, content]);
        this.files.set(path, content);
        return true;
    }

    async fileExistsAsync(path: string): Promise<boolean> {
        this.recordCall('fileExistsAsync', [path]);
        return this.files.has(path);
    }

    private recordCall(method: string, args: unknown[]): void {
        this.methodCalls.push({ method, args });
    }

    // =========================================================================
    // Test Helper Methods
    // =========================================================================

    /** Set a file's content */
    setFile(path: string, content: string): void {
        this.files.set(path, content);
    }

    /** Get a file's content */
    getFile(path: string): string | undefined {
        return this.files.get(path);
    }

    /** Check if a file exists */
    hasFile(path: string): boolean {
        return this.files.has(path);
    }

    /** Delete a file */
    deleteFile(path: string): boolean {
        return this.files.delete(path);
    }

    /** Get all files */
    getAllFiles(): Map<string, string> {
        return new Map(this.files);
    }

    /** Clear all files */
    clearFiles(): void {
        this.files.clear();
    }

    /** Set PRD content (convenience method) */
    setPRDContent(content: string): void {
        if (this.workspaceRoot) {
            const prdPath = `${this.workspaceRoot}/${this.config.files.prdPath}`;
            this.files.set(prdPath, content);
        }
    }

    /** Set progress content (convenience method) */
    setProgressContent(content: string): void {
        if (this.workspaceRoot) {
            const progressPath = `${this.workspaceRoot}/${this.config.files.progressPath}`;
            this.files.set(progressPath, content);
        }
    }

    /** Set config */
    setConfig(config: Partial<RalphConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /** Get method calls */
    getMethodCalls(): Array<{ method: string; args: unknown[] }> {
        return [...this.methodCalls];
    }

    /** Get calls to a specific method */
    getCallsTo(method: string): unknown[][] {
        return this.methodCalls
            .filter(call => call.method === method)
            .map(call => call.args);
    }

    /** Check if a method was called */
    wasCalled(method: string): boolean {
        return this.methodCalls.some(call => call.method === method);
    }

    /** Clear method call history */
    clearMethodCalls(): void {
        this.methodCalls = [];
    }

    /** Reset all state */
    reset(): void {
        this.files.clear();
        this.workspaceRoot = '/test/workspace';
        this.config = { ...DEFAULT_CONFIG };
        this.methodCalls = [];
    }
}

/**
 * Factory function to create a MockFileUtils with sample data.
 */
export function createMockFileUtils(options?: {
    hasPrd?: boolean;
    tasks?: Array<{ description: string; status?: string }>;
    workspaceRoot?: string | null;
}): MockFileUtils {
    const mock = new MockFileUtils();
    
    if (options?.workspaceRoot !== undefined) {
        mock.setWorkspaceRoot(options.workspaceRoot);
    }
    
    if (options?.hasPrd !== false && options?.tasks) {
        const prdContent = options.tasks.map(t => {
            const marker = t.status === 'complete' ? 'x' 
                : t.status === 'blocked' ? '!' 
                : t.status === 'skipped' ? 's'
                : t.status === 'in-progress' ? '~' 
                : ' ';
            return `- [${marker}] ${t.description}`;
        }).join('\n');
        mock.setPRDContent(`# Tasks\n\n${prdContent}`);
    } else if (options?.hasPrd === false) {
        // No PRD
    } else {
        // Default sample PRD
        mock.setPRDContent(`# Tasks

- [ ] Implement feature A
- [x] Complete feature B
- [ ] Add tests for feature C
- [!] Fix bug in feature D
- [s] Skipped feature E
`);
    }
    
    return mock;
}

/**
 * Sample PRD content for testing.
 */
export const SAMPLE_PRD_CONTENT = `# Project Tasks

## Phase 1

- [x] Setup project structure
- [x] Configure TypeScript
- [ ] Implement core module [depends on: Setup project structure]
- [ ] Add unit tests [AC: 80% coverage; all tests pass]

## Phase 2

- [ ] Build UI components
- [!] Fix performance issue
- [~] Working on documentation
- [s] Skipped legacy migration
`;

/**
 * Sample progress content for testing.
 */
export const SAMPLE_PROGRESS_CONTENT = `# Progress Log

[2026-01-18T10:00:00.000Z] ✅ Completed: Setup project structure
[2026-01-18T10:30:00.000Z] ✅ Completed: Configure TypeScript
`;
