export enum LoopExecutionState {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING'
}

export interface ProjectInfo {
    name: string;
    path: string;
}

/**
 * Statistics for a single project.
 */
export interface ProjectStats {
    name: string;
    path: string;
    total: number;
    completed: number;
    pending: number;
    progress: number;
}

/**
 * Aggregated statistics across all projects in the workspace.
 */
export interface AggregatedStats {
    projects: ProjectStats[];
    totalTasks: number;
    totalCompleted: number;
    totalPending: number;
    overallProgress: number;
    projectCount: number;
}

export interface Task {
    id: string;
    description: string;
    status: TaskStatus;
    lineNumber: number;
    rawLine: string;
    dependencies?: string[];
    /** Acceptance criteria for the task, parsed from [AC: ...] syntax */
    acceptanceCriteria?: string[];
}

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
    BLOCKED = 'BLOCKED',
    SKIPPED = 'SKIPPED'
}

export interface RalphConfig {
    files: {
        prdPath: string;
        progressPath: string;
    };
    prompt: {
        customTemplate: string;
        customPrdGenerationTemplate: string;
    };
}

export const DEFAULT_CONFIG: RalphConfig = {
    files: {
        prdPath: 'PRD.md',
        progressPath: 'progress.txt'
    },
    prompt: {
        customTemplate: '',
        customPrdGenerationTemplate: ''
    }
};

export interface TaskCompletion {
    taskDescription: string;
    completedAt: number;
    duration: number;
    iteration: number;
}

/**
 * Extended task completion record for persistent history tracking.
 * Includes project context and session information.
 */
export interface TaskCompletionRecord extends TaskCompletion {
    /** Unique ID for this record */
    id: string;
    /** Name of the project this task belongs to */
    projectName: string;
    /** Path to the project root */
    projectPath: string;
    /** Session ID to group completions from the same session */
    sessionId: string;
    /** Date string (YYYY-MM-DD) for grouping by day */
    dateKey: string;
}

/**
 * Summary of completion history for a single day.
 */
export interface DailyCompletionSummary {
    /** Date string (YYYY-MM-DD) */
    date: string;
    /** Number of tasks completed on this day */
    tasksCompleted: number;
    /** Total time spent on tasks (in milliseconds) */
    totalDuration: number;
    /** Average task duration (in milliseconds) */
    averageDuration: number;
    /** List of project names that had completions */
    projects: string[];
}

/**
 * Completion history data structure stored in workspaceState.
 */
export interface CompletionHistoryData {
    /** All completion records */
    records: TaskCompletionRecord[];
    /** Last cleanup timestamp */
    lastCleanup: number;
    /** Version for future migration support */
    version: number;
}

/**
 * Default empty completion history data.
 */
export const DEFAULT_COMPLETION_HISTORY: CompletionHistoryData = {
    records: [],
    lastCleanup: 0,
    version: 1
};

/**
 * Maximum number of records to keep in history (to prevent unbounded growth).
 */
export const MAX_HISTORY_RECORDS = 1000;

/**
 * Number of days to retain history records.
 */
export const HISTORY_RETENTION_DAYS = 90;

/**
 * Statistics for the current session.
 * Used in the session statistics dashboard.
 */
export interface SessionStats {
    /** Current session ID */
    sessionId: string;
    /** Session start timestamp */
    sessionStartTime: number;
    /** Number of tasks completed in this session */
    tasksCompleted: number;
    /** Total time spent on tasks in this session (in milliseconds) */
    totalDuration: number;
    /** Average task duration in this session (in milliseconds) */
    averageDuration: number;
    /** Fastest task duration in this session (in milliseconds) */
    fastestTask: number | null;
    /** Slowest task duration in this session (in milliseconds) */
    slowestTask: number | null;
    /** Current streak of consecutive task completions */
    currentStreak: number;
    /** Time since last task completion (in milliseconds) */
    timeSinceLastCompletion: number | null;
    /** Tasks completed per hour rate */
    tasksPerHour: number;
    /** List of task descriptions completed in this session */
    completedTasks: string[];
    /** Number of projects worked on in this session */
    projectsWorkedOn: number;
}

/**
 * Default empty session stats.
 */
export const DEFAULT_SESSION_STATS: SessionStats = {
    sessionId: '',
    sessionStartTime: 0,
    tasksCompleted: 0,
    totalDuration: 0,
    averageDuration: 0,
    fastestTask: null,
    slowestTask: null,
    currentStreak: 0,
    timeSinceLastCompletion: null,
    tasksPerHour: 0,
    completedTasks: [],
    projectsWorkedOn: 0
};

export interface TaskRequirements {
    runTests: boolean;
    runLinting: boolean;
    runTypeCheck: boolean;
    writeTests: boolean;
    updateDocs: boolean;
    commitChanges: boolean;
}

export const DEFAULT_REQUIREMENTS: TaskRequirements = {
    runTests: false,
    runLinting: false,
    runTypeCheck: false,
    writeTests: false,
    updateDocs: false,
    commitChanges: false
};

export interface RalphSettings {
    maxIterations: number;
}

export const DEFAULT_SETTINGS: RalphSettings = {
    maxIterations: 50
};

export const REVIEW_COUNTDOWN_SECONDS = 12;

export const INACTIVITY_TIMEOUT_MS = 60_000;

export const INACTIVITY_CHECK_INTERVAL_MS = 10_000;

/**
 * Log level types for filtering activity log entries.
 */
export type LogLevel = 'info' | 'warning' | 'error' | 'success';

/**
 * Represents an error that occurred in the webview script.
 * Used for error boundary reporting from webview to extension.
 */
export interface WebviewError {
    message: string;
    source: string;
    lineno: number;
    colno: number;
    stack?: string;
}

/**
 * Represents the persistent state of the panel UI.
 * Used to save and restore collapsed sections, scroll position, and requirements.
 */
export interface PanelState {
    /** List of section IDs that are collapsed */
    collapsedSections: string[];
    /** Scroll position of the main content area */
    scrollPosition: number;
    /** User's selected requirements (checkbox states) */
    requirements: TaskRequirements;
}

export const DEFAULT_PANEL_STATE: PanelState = {
    collapsedSections: [],
    scrollPosition: 0,
    requirements: { ...DEFAULT_REQUIREMENTS }
};

export interface IRalphUI {
    updateStatus(status: string, iteration: number, currentTask: string, history: TaskCompletion[]): void;
    updateCountdown(seconds: number): void;
    updateHistory(history: TaskCompletion[]): void;
    updateSessionTiming(startTime: number, taskHistory: TaskCompletion[], pendingTasks: number): void;
    updateStats(): void | Promise<void>;
    refresh(): void | Promise<void>;
    /**
     * Adds a log entry to the activity log.
     * @param message - The log message
     * @param highlightOrLevel - Either a boolean (legacy: true = success) or a LogLevel string
     */
    addLog(message: string, highlightOrLevel?: boolean | LogLevel): void;
    showPrdGenerating(): void;
    hidePrdGenerating(): void;
}

// ============================================================================
// STRICT NULL CHECK UTILITIES
// ============================================================================

/**
 * Type guard to check if a Task has dependencies defined.
 * @param task - The task to check
 * @returns True if the task has a non-empty dependencies array
 */
export function taskHasDependencies(task: Task): task is Task & { dependencies: string[] } {
    return Array.isArray(task.dependencies) && task.dependencies.length > 0;
}

/**
 * Type guard to check if a Task has acceptance criteria defined.
 * @param task - The task to check
 * @returns True if the task has a non-empty acceptanceCriteria array
 */
export function taskHasAcceptanceCriteria(task: Task): task is Task & { acceptanceCriteria: string[] } {
    return Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria.length > 0;
}

/**
 * Gets task dependencies safely, returning an empty array if undefined.
 * @param task - The task to get dependencies from
 * @returns The dependencies array or an empty array
 */
export function getTaskDependencies(task: Task): string[] {
    return task.dependencies ?? [];
}

/**
 * Gets task acceptance criteria safely, returning an empty array if undefined.
 * @param task - The task to get acceptance criteria from
 * @returns The acceptance criteria array or an empty array
 */
export function getTaskAcceptanceCriteria(task: Task): string[] {
    return task.acceptanceCriteria ?? [];
}

/**
 * Type guard to check if a WebviewError has a stack trace.
 * @param error - The webview error to check
 * @returns True if the error has a non-empty stack trace
 */
export function webviewErrorHasStack(error: WebviewError): error is WebviewError & { stack: string } {
    return typeof error.stack === 'string' && error.stack.length > 0;
}

/**
 * Gets the stack trace from a WebviewError safely.
 * @param error - The webview error to get the stack from
 * @param defaultValue - The default value if stack is undefined
 * @returns The stack trace or the default value
 */
export function getWebviewErrorStack(error: WebviewError, defaultValue: string = ''): string {
    return error.stack ?? defaultValue;
}

/**
 * Validates that a PanelState object has all required properties.
 * @param state - The state to validate
 * @returns True if the state is valid
 */
export function isValidPanelState(state: unknown): state is PanelState {
    if (typeof state !== 'object' || state === null) {
        return false;
    }
    const s = state as Record<string, unknown>;
    return (
        Array.isArray(s.collapsedSections) &&
        typeof s.scrollPosition === 'number' &&
        typeof s.requirements === 'object' &&
        s.requirements !== null
    );
}

/**
 * Ensures a PanelState object has all required properties, filling in defaults.
 * @param state - The partial state to normalize
 * @returns A valid PanelState with defaults applied
 */
export function normalizePanelState(state: Partial<PanelState> | null | undefined): PanelState {
    if (!state) {
        return { ...DEFAULT_PANEL_STATE };
    }
    return {
        collapsedSections: Array.isArray(state.collapsedSections) ? state.collapsedSections : [],
        scrollPosition: typeof state.scrollPosition === 'number' ? state.scrollPosition : 0,
        requirements: state.requirements ?? { ...DEFAULT_REQUIREMENTS }
    };
}

/**
 * Validates that a TaskRequirements object has all required properties.
 * @param requirements - The requirements to validate
 * @returns True if the requirements are valid
 */
export function isValidTaskRequirements(requirements: unknown): requirements is TaskRequirements {
    if (typeof requirements !== 'object' || requirements === null) {
        return false;
    }
    const r = requirements as Record<string, unknown>;
    return (
        typeof r.runTests === 'boolean' &&
        typeof r.runLinting === 'boolean' &&
        typeof r.runTypeCheck === 'boolean' &&
        typeof r.writeTests === 'boolean' &&
        typeof r.updateDocs === 'boolean' &&
        typeof r.commitChanges === 'boolean'
    );
}

/**
 * Ensures a TaskRequirements object has all required properties, filling in defaults.
 * @param requirements - The partial requirements to normalize
 * @returns Valid TaskRequirements with defaults applied
 */
export function normalizeTaskRequirements(requirements: Partial<TaskRequirements> | null | undefined): TaskRequirements {
    if (!requirements) {
        return { ...DEFAULT_REQUIREMENTS };
    }
    return {
        runTests: typeof requirements.runTests === 'boolean' ? requirements.runTests : DEFAULT_REQUIREMENTS.runTests,
        runLinting: typeof requirements.runLinting === 'boolean' ? requirements.runLinting : DEFAULT_REQUIREMENTS.runLinting,
        runTypeCheck: typeof requirements.runTypeCheck === 'boolean' ? requirements.runTypeCheck : DEFAULT_REQUIREMENTS.runTypeCheck,
        writeTests: typeof requirements.writeTests === 'boolean' ? requirements.writeTests : DEFAULT_REQUIREMENTS.writeTests,
        updateDocs: typeof requirements.updateDocs === 'boolean' ? requirements.updateDocs : DEFAULT_REQUIREMENTS.updateDocs,
        commitChanges: typeof requirements.commitChanges === 'boolean' ? requirements.commitChanges : DEFAULT_REQUIREMENTS.commitChanges
    };
}

/**
 * Validates that a RalphSettings object has all required properties.
 * @param settings - The settings to validate
 * @returns True if the settings are valid
 */
export function isValidRalphSettings(settings: unknown): settings is RalphSettings {
    if (typeof settings !== 'object' || settings === null) {
        return false;
    }
    const s = settings as Record<string, unknown>;
    return (
        typeof s.maxIterations === 'number' &&
        Number.isFinite(s.maxIterations) &&
        s.maxIterations >= 0
    );
}

/**
 * Ensures a RalphSettings object has all required properties, filling in defaults.
 * @param settings - The partial settings to normalize
 * @returns Valid RalphSettings with defaults applied
 */
export function normalizeRalphSettings(settings: Partial<RalphSettings> | null | undefined): RalphSettings {
    if (!settings) {
        return { ...DEFAULT_SETTINGS };
    }
    return {
        maxIterations: typeof settings.maxIterations === 'number' && Number.isFinite(settings.maxIterations) && settings.maxIterations >= 0
            ? settings.maxIterations
            : DEFAULT_SETTINGS.maxIterations
    };
}

// ============================================================================
// PRODUCTIVITY REPORT TYPES
// ============================================================================

/**
 * Report period options for productivity reports.
 */
export type ReportPeriod = 'today' | 'week' | 'month' | 'custom';

/**
 * Export format options for productivity reports.
 */
export type ReportFormat = 'markdown' | 'html' | 'json';

/**
 * Time breakdown for productivity reports.
 */
export interface TimeBreakdown {
    /** Total active time in milliseconds */
    totalActiveTime: number;
    /** Average time per task in milliseconds */
    averageTaskTime: number;
    /** Fastest task time in milliseconds */
    fastestTaskTime: number | null;
    /** Slowest task time in milliseconds */
    slowestTaskTime: number | null;
    /** Standard deviation of task times in milliseconds */
    timeDeviation: number;
}

/**
 * Project breakdown for multi-project productivity reports.
 */
export interface ProjectBreakdown {
    /** Project name */
    name: string;
    /** Project path */
    path: string;
    /** Number of tasks completed */
    tasksCompleted: number;
    /** Total time spent on this project in milliseconds */
    totalDuration: number;
    /** Percentage of total tasks */
    taskPercentage: number;
    /** Percentage of total time */
    timePercentage: number;
}

/**
 * Daily activity data for trend analysis.
 */
export interface DailyActivity {
    /** Date key (YYYY-MM-DD) */
    date: string;
    /** Number of tasks completed */
    tasksCompleted: number;
    /** Total duration in milliseconds */
    totalDuration: number;
    /** Projects worked on */
    projects: string[];
}

/**
 * Productivity trends and insights.
 */
export interface ProductivityTrends {
    /** Average tasks per day */
    avgTasksPerDay: number;
    /** Most productive day of the week (0-6, Sunday-Saturday) */
    mostProductiveDay: number | null;
    /** Most productive hour of the day (0-23) */
    mostProductiveHour: number | null;
    /** Productivity trend direction: 'up', 'down', 'stable' */
    trendDirection: 'up' | 'down' | 'stable';
    /** Percentage change from previous period */
    trendPercentage: number;
    /** Longest streak of consecutive days with completions */
    longestStreak: number;
    /** Current streak of consecutive days with completions */
    currentStreak: number;
}

/**
 * Comprehensive productivity report data.
 */
export interface ProductivityReport {
    /** Report title */
    title: string;
    /** Report generation timestamp */
    generatedAt: number;
    /** Report period start date */
    periodStart: number;
    /** Report period end date */
    periodEnd: number;
    /** Period type */
    periodType: ReportPeriod;
    
    /** Total tasks completed in the period */
    totalTasks: number;
    /** Total time spent in milliseconds */
    totalDuration: number;
    /** Number of active sessions */
    sessions: number;
    /** Number of unique projects */
    projects: number;
    
    /** Time breakdown statistics */
    timeBreakdown: TimeBreakdown;
    /** Per-project breakdown */
    projectBreakdown: ProjectBreakdown[];
    /** Daily activity data */
    dailyActivity: DailyActivity[];
    /** Productivity trends */
    trends: ProductivityTrends;
}

/**
 * Default empty productivity report.
 */
export const DEFAULT_PRODUCTIVITY_REPORT: ProductivityReport = {
    title: 'Productivity Report',
    generatedAt: 0,
    periodStart: 0,
    periodEnd: 0,
    periodType: 'today',
    totalTasks: 0,
    totalDuration: 0,
    sessions: 0,
    projects: 0,
    timeBreakdown: {
        totalActiveTime: 0,
        averageTaskTime: 0,
        fastestTaskTime: null,
        slowestTaskTime: null,
        timeDeviation: 0
    },
    projectBreakdown: [],
    dailyActivity: [],
    trends: {
        avgTasksPerDay: 0,
        mostProductiveDay: null,
        mostProductiveHour: null,
        trendDirection: 'stable',
        trendPercentage: 0,
        longestStreak: 0,
        currentStreak: 0
    }
};
