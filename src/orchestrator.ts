import * as vscode from 'vscode';
import {
    LoopExecutionState,
    TaskRequirements,
    RalphSettings,
    REVIEW_COUNTDOWN_SECONDS,
    IRalphUI,
    TaskCompletion
} from './types';
import { logError, log } from './logger';
import { readPRDAsync, getNextTaskAsync, getTaskStatsAsync, getWorkspaceRoot, appendProgressAsync, ensureProgressFileAsync, markTaskAsSkippedAsync, reorderTasksAsync, getFirstBlockedTaskAsync, markTaskAsPendingAsync, markAllTasksAsCompleteAsync, resetAllTasksAsync, setActiveWorkspaceFolder } from './fileUtils';
import { RalphStatusBar } from './statusBar';
import { CountdownTimer, InactivityMonitor } from './timerManager';
import { FileWatcherManager } from './fileWatchers';
import { UIManager } from './uiManager';
import { TaskRunner } from './taskRunner';
import { CompletionHistoryStorage } from './historyStorage';

export class LoopOrchestrator {
    private state: LoopExecutionState = LoopExecutionState.IDLE;
    private isPaused = false;
    private sessionStartTime = 0;

    private readonly ui: UIManager;
    private readonly taskRunner: TaskRunner;
    private readonly fileWatchers = new FileWatcherManager();
    private readonly countdownTimer = new CountdownTimer();
    private readonly inactivityMonitor = new InactivityMonitor();
    private readonly historyStorage: CompletionHistoryStorage | null;

    constructor(statusBar: RalphStatusBar, historyStorage?: CompletionHistoryStorage) {
        this.ui = new UIManager(statusBar);
        this.taskRunner = new TaskRunner();
        this.historyStorage = historyStorage ?? null;

        this.taskRunner.setLogCallback((message, highlight) => {
            this.ui.addLog(message, highlight);
        });
    }

    setPanel(panel: IRalphUI | null): void {
        this.ui.setPanel(panel);
    }

    setSidebarView(view: IRalphUI): void {
        this.ui.setSidebarView(view);
    }

    setRequirements(requirements: TaskRequirements): void {
        this.taskRunner.setRequirements(requirements);
    }

    getRequirements(): TaskRequirements {
        return this.taskRunner.getRequirements();
    }

    setSettings(settings: RalphSettings): void {
        this.taskRunner.setSettings(settings);
    }

    getSettings(): RalphSettings {
        return this.taskRunner.getSettings();
    }

    getHistory(): TaskCompletion[] {
        return this.taskRunner.getHistory();
    }

    /**
     * Gets the completion history storage instance.
     */
    getHistoryStorage(): CompletionHistoryStorage | null {
        return this.historyStorage;
    }

    async startLoop(): Promise<void> {
        if (this.state === LoopExecutionState.RUNNING) {
            this.ui.addLog('Loop is already running');
            return;
        }

        const stats = await getTaskStatsAsync();
        if (stats.pending === 0) {
            this.ui.addLog('No pending tasks found. Add tasks to PRD.md first.');
            vscode.window.showInformationMessage('Ralph: No pending tasks found in PRD.md');
            return;
        }

        // Start a new session for history tracking
        if (this.historyStorage) {
            this.historyStorage.startNewSession();
        }

        // Ensure progress.txt exists
        await ensureProgressFileAsync();

        this.taskRunner.clearHistory();
        this.ui.clearLogs();
        this.ui.updateHistory([]);

        this.state = LoopExecutionState.RUNNING;
        this.isPaused = false;
        this.taskRunner.resetIterations();
        this.sessionStartTime = Date.now();

        await this.ui.updateStats();

        this.ui.addLog('🚀 Starting Ralph loop...');
        await this.updatePanelTiming();
        this.ui.updateStatus('running', this.taskRunner.getIterationCount(), this.taskRunner.getCurrentTask());

        await this.setupWatchers();
        await this.runNextTask();
    }

    pauseLoop(): void {
        if (this.state !== LoopExecutionState.RUNNING) { return; }

        this.isPaused = true;
        this.fileWatchers.prdWatcher.disable();
        this.inactivityMonitor.pause();
        this.countdownTimer.stop();

        this.ui.addLog('Loop paused');
        this.ui.updateStatus('paused', this.taskRunner.getIterationCount(), this.taskRunner.getCurrentTask());
    }

    resumeLoop(): void {
        if (!this.isPaused) { return; }

        this.isPaused = false;
        this.inactivityMonitor.resume();
        this.ui.addLog('Loop resumed');
        this.ui.updateStatus('running', this.taskRunner.getIterationCount(), this.taskRunner.getCurrentTask());

        this.runNextTask();
    }

    async stopLoop(): Promise<void> {
        this.fileWatchers.dispose();
        this.countdownTimer.stop();
        this.inactivityMonitor.stop();

        this.state = LoopExecutionState.IDLE;
        this.isPaused = false;

        this.ui.updateStatus('idle', this.taskRunner.getIterationCount(), this.taskRunner.getCurrentTask());
        this.ui.updateCountdown(0);

        this.ui.updateSessionTiming(0, this.taskRunner.getTaskHistory(), 0);
        await this.ui.updateStats();
    }

    async runSingleStep(): Promise<void> {
        if (this.state === LoopExecutionState.RUNNING) {
            this.ui.addLog('Cannot run single step while loop is running');
            return;
        }

        const task = await getNextTaskAsync();
        if (!task) {
            this.ui.addLog('No pending tasks');
            vscode.window.showInformationMessage('Ralph: No pending tasks in PRD.md');
            return;
        }

        if (this.taskRunner.checkIterationLimit()) { return; }

        this.taskRunner.incrementIteration();
        this.taskRunner.setCurrentTask(task.description);
        this.ui.addLog(`Single step: ${task.description}`);
        await this.taskRunner.triggerCopilotAgent(task.description);
    }

    async skipCurrentTask(): Promise<void> {
        const taskToSkip = await getNextTaskAsync();
        
        if (!taskToSkip) {
            this.ui.addLog('No pending tasks to skip.');
            return;
        }
        
        this.ui.addLog(`Using "Skip Task": Skipping "${taskToSkip.description}"...`);
        
        const marked = await markTaskAsSkippedAsync(taskToSkip.lineNumber);
        if (marked) {
            await appendProgressAsync(`Skipped: ${taskToSkip.description}`);
            if (this.state === LoopExecutionState.RUNNING) {
                // If running, log and notify. The loop will pick up the next task on next iteration.
                // If we are stuck in countdown, this effectively changes what happens next.
                this.ui.addLog(`Skipped "${taskToSkip.description}". Next task will be selected.`);
            } else {
                this.ui.addLog(`Skipped "${taskToSkip.description}".`);
            }
            
            await this.ui.updateStats();
            
            // Allow UI to update with new next task
            const nextTask = await getNextTaskAsync();
            const currentDesc = nextTask ? nextTask.description : (this.state === LoopExecutionState.RUNNING ? 'Looking for tasks...' : 'No pending tasks');
            
            if (this.state !== LoopExecutionState.RUNNING) {
                 this.taskRunner.setCurrentTask(currentDesc);
                 this.ui.updateStatus(this.state === LoopExecutionState.IDLE ? 'idle' : 'paused', this.taskRunner.getIterationCount(), currentDesc);
            }
        } else {
            this.ui.addLog('Failed to mark task as skipped (could not update PRD.md).', true);
        }
    }

    async reorderTasks(taskIds: string[]): Promise<void> {
        this.ui.addLog('Reordering tasks...');
        const success = await reorderTasksAsync(taskIds);
        if (success) {
            this.ui.addLog('Tasks reordered successfully.', true);
            await this.ui.updateStats();
        } else {
            this.ui.addLog('Failed to reorder tasks.');
        }
    }

    async retryFailedTask(): Promise<void> {
        const blockedTask = await getFirstBlockedTaskAsync();
        
        if (!blockedTask) {
            this.ui.addLog('No failed/blocked tasks to retry.');
            return;
        }
        
        this.ui.addLog(`Using "Retry Task": Retrying "${blockedTask.description}"...`);
        
        const marked = await markTaskAsPendingAsync(blockedTask.lineNumber);
        if (marked) {
            await appendProgressAsync(`Retrying: ${blockedTask.description}`);
            this.ui.addLog(`Marked "${blockedTask.description}" as pending for retry.`, true);
            
            await this.ui.updateStats();
            
            // Update UI with the retried task (it's now pending)
            const nextTask = await getNextTaskAsync();
            const currentDesc = nextTask ? nextTask.description : (this.state === LoopExecutionState.RUNNING ? 'Looking for tasks...' : 'No pending tasks');
            
            if (this.state !== LoopExecutionState.RUNNING) {
                this.taskRunner.setCurrentTask(currentDesc);
                this.ui.updateStatus(this.state === LoopExecutionState.IDLE ? 'idle' : 'paused', this.taskRunner.getIterationCount(), currentDesc);
            }
        } else {
            this.ui.addLog('Failed to mark task for retry (could not update PRD.md).', true);
        }
    }

    async completeAllTasks(): Promise<void> {
        this.ui.addLog('Completing all tasks...');
        
        const count = await markAllTasksAsCompleteAsync();
        
        if (count > 0) {
            await appendProgressAsync(`Batch completed: ${count} task(s) marked as complete`);
            this.ui.addLog(`✅ Marked ${count} task(s) as complete.`, true);
            
            await this.ui.updateStats();
            
            // Update UI with no pending tasks
            if (this.state !== LoopExecutionState.RUNNING) {
                this.taskRunner.setCurrentTask('No pending tasks');
                this.ui.updateStatus('idle', this.taskRunner.getIterationCount(), 'No pending tasks');
            }
            
            vscode.window.showInformationMessage(`Ralph: Marked ${count} task(s) as complete.`);
        } else {
            this.ui.addLog('No pending tasks to complete.');
        }
    }

    async resetAllTasks(): Promise<void> {
        this.ui.addLog('Resetting all tasks...');
        
        const count = await resetAllTasksAsync();
        
        if (count > 0) {
            await appendProgressAsync(`Batch reset: ${count} task(s) reset to pending`);
            this.ui.addLog(`🔄 Reset ${count} task(s) to pending.`, true);
            
            await this.ui.updateStats();
            
            // Update UI with the first pending task
            const nextTask = await getNextTaskAsync();
            const currentDesc = nextTask ? nextTask.description : 'No pending tasks';
            
            if (this.state !== LoopExecutionState.RUNNING) {
                this.taskRunner.setCurrentTask(currentDesc);
                this.ui.updateStatus('idle', this.taskRunner.getIterationCount(), currentDesc);
            }
            
            vscode.window.showInformationMessage(`Ralph: Reset ${count} task(s) to pending.`);
        } else {
            this.ui.addLog('No completed tasks to reset.');
        }
    }

    async generatePrdFromDescription(taskDescription: string): Promise<void> {
        const root = getWorkspaceRoot();
        if (!root) {
            vscode.window.showErrorMessage('Ralph: No workspace folder open');
            return;
        }

        this.ui.showPrdGenerating();
        this.setupPrdCreationWatcher();
        await this.taskRunner.triggerPrdGeneration(taskDescription);
    }

    async showStatus(stream: vscode.ChatResponseStream): Promise<void> {
        const taskStats = await getTaskStatsAsync();
        const task = await getNextTaskAsync();
        const prd = await readPRDAsync();
        const settings = this.taskRunner.getSettings();

        stream.markdown('## Ralph Status\n\n');

        if (!prd) {
            stream.markdown('**No PRD found.** Run `@ralph /init` to create template files.\n');
            return;
        }

        stream.markdown(`**State:** ${this.state}\n`);
        stream.markdown(`**Tasks:** ${taskStats.completed}/${taskStats.total} complete\n`);
        stream.markdown(`**Iterations:** ${this.taskRunner.getIterationCount()}${settings.maxIterations > 0 ? ` / ${settings.maxIterations}` : ''}\n\n`);

        if (task) {
            stream.markdown(`**Next Task:** ${task.description}\n`);
        } else if (taskStats.total > 0) {
            stream.markdown('**All tasks completed!**\n');
        }
    }

    dispose(): void {
        this.stopLoop();
    }

    /**
     * Switches to a different project (workspace folder) without stopping the loop.
     * If the loop is running, it will pause, switch, and resume on the new project.
     * @param projectPath - The new workspace folder path to switch to
     */
    async switchProject(projectPath: string): Promise<void> {
        const wasRunning = this.state === LoopExecutionState.RUNNING;
        const wasPaused = this.isPaused;
        
        // Temporarily pause if running (to prevent race conditions during switch)
        if (wasRunning && !wasPaused) {
            this.isPaused = true;
            this.fileWatchers.prdWatcher.disable();
            this.inactivityMonitor.pause();
            this.countdownTimer.stop();
        }
        
        // Switch the active workspace folder
        setActiveWorkspaceFolder(projectPath);
        
        this.ui.addLog(`📂 Switched to project: ${projectPath.split('/').pop() || projectPath}`);
        
        // Clear history for the new project context (history is per-session, per-project)
        this.taskRunner.clearHistory();
        this.ui.updateHistory([]);
        
        // Reset timers for the new project
        this.countdownTimer.stop();
        this.ui.updateCountdown(0);
        
        // Update stats and UI for the new project
        await this.ui.updateStats();
        
        const task = await getNextTaskAsync();
        const taskDesc = task ? task.description : 'No pending tasks';
        this.taskRunner.setCurrentTask(taskDesc);
        
        // If the loop was running, set up watchers for the new project and continue
        if (wasRunning) {
            // Dispose old file watchers and set up new ones for the new project
            this.fileWatchers.dispose();
            await this.setupWatchers();
            
            if (!wasPaused) {
                // Resume the loop on the new project
                this.isPaused = false;
                this.ui.updateStatus('running', this.taskRunner.getIterationCount(), taskDesc);
                
                // Start processing tasks from the new project
                await this.runNextTask();
            } else {
                // Remain paused on the new project
                this.ui.updateStatus('paused', this.taskRunner.getIterationCount(), taskDesc);
            }
        } else {
            // If idle, just update the UI
            this.ui.updateStatus('idle', this.taskRunner.getIterationCount(), taskDesc);
        }
        
        await this.updatePanelTiming();
    }

    private async setupWatchers(): Promise<void> {
        const initialContent = await readPRDAsync() || '';

        this.fileWatchers.prdWatcher.start(initialContent, (newContent) => {
            this.handlePrdChange(newContent);
        });
        this.ui.addLog('👁️ Watching PRD.md for task completion...');

        this.fileWatchers.activityWatcher.start(() => {
            this.inactivityMonitor.recordActivity();
        });

        this.inactivityMonitor.start(() => this.handleInactivity());
    }

    private setupPrdCreationWatcher(): void {
        this.fileWatchers.prdCreationWatcher.start(async () => {
            this.ui.hidePrdGenerating();
            this.ui.addLog('PRD.md created successfully!', true);
            await this.ui.refresh();
            this.fileWatchers.prdCreationWatcher.dispose();
            vscode.window.showInformationMessage('Ralph: PRD.md created! Click Start to begin.');
        });
        this.ui.addLog('👁️ Watching for PRD.md creation...');
    }

    private async runNextTask(): Promise<void> {
        if (this.state !== LoopExecutionState.RUNNING || this.isPaused) {
            return;
        }

        const stats = await getTaskStatsAsync();

        if (stats.pending === 0) {
            this.ui.addLog('🎉 All tasks completed!', true);
            this.stopLoop();
            vscode.window.showInformationMessage('Ralph: All PRD tasks completed! 🎉');
            return;
        }

        const task = await getNextTaskAsync();
        if (!task) {
            this.ui.addLog('No more tasks to process');
            this.stopLoop();
            return;
        }

        if (this.taskRunner.checkIterationLimit()) {
            this.stopLoop();
            return;
        }

        const iteration = this.taskRunner.incrementIteration();
        this.taskRunner.setCurrentTask(task.description);
        this.ui.setIteration(iteration);
        this.ui.setTaskInfo(task.description);
        this.ui.updateStatus('running', iteration, task.description);

        this.ui.addLog(`Task ${iteration}: ${task.description}`);
        await this.taskRunner.triggerCopilotAgent(task.description);

        this.fileWatchers.prdWatcher.enable();
        this.inactivityMonitor.setWaiting(true);
        this.ui.updateStatus('waiting', iteration, task.description);
        this.ui.addLog('Waiting for Copilot to complete and update PRD.md...');
    }

    private async handlePrdChange(newContent: string): Promise<void> {
        try {
            this.ui.addLog('📝 PRD.md changed - checking task status...');
            this.inactivityMonitor.recordActivity();
            this.fileWatchers.prdWatcher.updateContent(newContent);

            const task = await getNextTaskAsync();
            const currentTask = this.taskRunner.getCurrentTask();

            if (!task || task.description !== currentTask) {

                this.fileWatchers.prdWatcher.disable();
                this.inactivityMonitor.stop();

                const completion = this.taskRunner.recordTaskCompletion();

                // Record completion in persistent history
                if (this.historyStorage) {
                    await this.historyStorage.recordCompletion(completion, getWorkspaceRoot() ?? undefined);
                }

                // Append to progress.txt
                const progressEntry = `✅ Completed: ${completion.taskDescription} (took ${Math.round(completion.duration / 1000)}s)`;
                await appendProgressAsync(progressEntry);

                this.ui.updateHistory(this.taskRunner.getTaskHistory());
                await this.updatePanelTiming();

                await this.startCountdown();
            }
        } catch (error) {
            logError('Error handling PRD change', error);
            this.ui.addLog('Error processing PRD change');
        }
    }

    private async handleInactivity(): Promise<void> {
        this.ui.addLog('⚠️ No file activity detected for 60 seconds...');

        const action = await vscode.window.showWarningMessage(
            `Ralph: No file changes detected for 60 seconds. Is Copilot still working on the task?`,
            'Continue Waiting',
            'Retry Task',
            'Skip Task',
            'Stop Loop'
        );

        switch (action) {
            case 'Continue Waiting':
                this.ui.addLog('Continuing to wait...');
                this.inactivityMonitor.start(() => this.handleInactivity());
                break;
            case 'Retry Task':
                this.ui.addLog('Retrying current task...');
                this.fileWatchers.prdWatcher.disable();
                await this.runNextTask();
                break;
            case 'Skip Task':
                this.ui.addLog('Skipping to next task...');
                this.fileWatchers.prdWatcher.disable();
                this.taskRunner.setCurrentTask('');
                await this.startCountdown();
                break;
            case 'Stop Loop':
                this.stopLoop();
                break;
            default:
                this.inactivityMonitor.start(() => this.handleInactivity());
        }
    }

    private async startCountdown(): Promise<void> {
        this.ui.addLog(`Starting next task in ${REVIEW_COUNTDOWN_SECONDS} seconds...`);

        await this.countdownTimer.start(REVIEW_COUNTDOWN_SECONDS, (remaining) => {
            this.ui.updateCountdown(remaining);
        });

        if (this.state === LoopExecutionState.RUNNING && !this.isPaused) {
            await this.ui.updateStats();
            await this.runNextTask();
        }
    }

    private async updatePanelTiming(): Promise<void> {
        const stats = await getTaskStatsAsync();
        this.ui.updateSessionTiming(this.sessionStartTime, this.taskRunner.getTaskHistory(), stats.pending);
    }
}
