import * as vscode from 'vscode';
import {
    TaskCompletion,
    TaskCompletionRecord,
    CompletionHistoryData,
    DailyCompletionSummary,
    SessionStats,
    ProductivityReport,
    ReportPeriod,
    TimeBreakdown,
    ProjectBreakdown,
    DailyActivity,
    ProductivityTrends,
    DEFAULT_COMPLETION_HISTORY,
    DEFAULT_SESSION_STATS,
    MAX_HISTORY_RECORDS,
    HISTORY_RETENTION_DAYS
} from './types';
import { log, logError } from './logger';
import { getWorkspaceRoot } from './fileUtils';
import * as path from 'path';

/** Storage key for completion history in workspaceState */
export const COMPLETION_HISTORY_KEY = 'ralph.completionHistory';

/** Cleanup interval - 24 hours in milliseconds */
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Generates a unique ID for a completion record.
 */
export function generateRecordId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a session ID for grouping completions.
 */
export function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Gets the date key (YYYY-MM-DD) from a timestamp.
 */
export function getDateKey(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Gets the project name from a workspace path.
 */
export function getProjectName(workspacePath: string | null): string {
    if (!workspacePath) {
        return 'Unknown Project';
    }
    return path.basename(workspacePath);
}

/**
 * Creates a TaskCompletionRecord from a TaskCompletion.
 */
export function createCompletionRecord(
    completion: TaskCompletion,
    sessionId: string,
    projectPath?: string
): TaskCompletionRecord {
    const projectPathResolved = projectPath ?? getWorkspaceRoot() ?? '';
    return {
        ...completion,
        id: generateRecordId(),
        projectName: getProjectName(projectPathResolved),
        projectPath: projectPathResolved,
        sessionId,
        dateKey: getDateKey(completion.completedAt)
    };
}

/**
 * Validates that a CompletionHistoryData object is valid.
 */
export function isValidCompletionHistoryData(data: unknown): data is CompletionHistoryData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const d = data as Record<string, unknown>;
    return (
        Array.isArray(d.records) &&
        typeof d.lastCleanup === 'number' &&
        typeof d.version === 'number'
    );
}

/**
 * Normalizes completion history data, filling in defaults for missing fields.
 */
export function normalizeCompletionHistoryData(data: unknown): CompletionHistoryData {
    if (!isValidCompletionHistoryData(data)) {
        return { ...DEFAULT_COMPLETION_HISTORY };
    }
    return {
        records: data.records.filter(isValidCompletionRecord),
        lastCleanup: data.lastCleanup,
        version: data.version
    };
}

/**
 * Validates that a completion record has all required fields.
 */
export function isValidCompletionRecord(record: unknown): record is TaskCompletionRecord {
    if (typeof record !== 'object' || record === null) {
        return false;
    }
    const r = record as Record<string, unknown>;
    return (
        typeof r.id === 'string' &&
        typeof r.taskDescription === 'string' &&
        typeof r.completedAt === 'number' &&
        typeof r.duration === 'number' &&
        typeof r.iteration === 'number' &&
        typeof r.projectName === 'string' &&
        typeof r.projectPath === 'string' &&
        typeof r.sessionId === 'string' &&
        typeof r.dateKey === 'string'
    );
}

/**
 * Completion History Storage class for persisting task completions.
 */
export class CompletionHistoryStorage {
    private context: vscode.ExtensionContext;
    private currentSessionId: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.currentSessionId = generateSessionId();
    }

    /**
     * Gets the current session ID.
     */
    getSessionId(): string {
        return this.currentSessionId;
    }

    /**
     * Starts a new session (generates a new session ID).
     */
    startNewSession(): string {
        this.currentSessionId = generateSessionId();
        log(`Started new history session: ${this.currentSessionId}`);
        return this.currentSessionId;
    }

    /**
     * Retrieves the completion history from storage.
     */
    async getHistory(): Promise<CompletionHistoryData> {
        try {
            const stored = this.context.workspaceState.get<unknown>(COMPLETION_HISTORY_KEY);
            return normalizeCompletionHistoryData(stored);
        } catch (error) {
            logError('Failed to retrieve completion history', error);
            return { ...DEFAULT_COMPLETION_HISTORY };
        }
    }

    /**
     * Saves the completion history to storage.
     */
    async saveHistory(data: CompletionHistoryData): Promise<boolean> {
        try {
            await this.context.workspaceState.update(COMPLETION_HISTORY_KEY, data);
            return true;
        } catch (error) {
            logError('Failed to save completion history', error);
            return false;
        }
    }

    /**
     * Records a task completion in the persistent history.
     */
    async recordCompletion(completion: TaskCompletion, projectPath?: string): Promise<TaskCompletionRecord> {
        const record = createCompletionRecord(completion, this.currentSessionId, projectPath);
        
        const history = await this.getHistory();
        history.records.push(record);
        
        // Run cleanup if needed
        if (Date.now() - history.lastCleanup > CLEANUP_INTERVAL_MS) {
            this.cleanupOldRecords(history);
        }
        
        // Trim to max records if needed
        if (history.records.length > MAX_HISTORY_RECORDS) {
            history.records = history.records.slice(-MAX_HISTORY_RECORDS);
        }
        
        await this.saveHistory(history);
        log(`Recorded completion: "${completion.taskDescription.substring(0, 50)}..." (ID: ${record.id})`);
        
        return record;
    }

    /**
     * Records multiple task completions at once.
     */
    async recordCompletions(completions: TaskCompletion[], projectPath?: string): Promise<TaskCompletionRecord[]> {
        const records: TaskCompletionRecord[] = [];
        const history = await this.getHistory();
        
        for (const completion of completions) {
            const record = createCompletionRecord(completion, this.currentSessionId, projectPath);
            records.push(record);
            history.records.push(record);
        }
        
        // Run cleanup if needed
        if (Date.now() - history.lastCleanup > CLEANUP_INTERVAL_MS) {
            this.cleanupOldRecords(history);
        }
        
        // Trim to max records if needed
        if (history.records.length > MAX_HISTORY_RECORDS) {
            history.records = history.records.slice(-MAX_HISTORY_RECORDS);
        }
        
        await this.saveHistory(history);
        log(`Recorded ${records.length} completions`);
        
        return records;
    }

    /**
     * Gets all completion records.
     */
    async getAllRecords(): Promise<TaskCompletionRecord[]> {
        const history = await this.getHistory();
        return history.records;
    }

    /**
     * Gets completion records for a specific date range.
     * @param startDate - Start date (inclusive)
     * @param endDate - End date (inclusive)
     */
    async getRecordsByDateRange(startDate: Date, endDate: Date): Promise<TaskCompletionRecord[]> {
        const history = await this.getHistory();
        const startTs = startDate.getTime();
        const endTs = endDate.getTime() + (24 * 60 * 60 * 1000 - 1); // End of day
        
        return history.records.filter(r => r.completedAt >= startTs && r.completedAt <= endTs);
    }

    /**
     * Gets completion records for today.
     */
    async getTodayRecords(): Promise<TaskCompletionRecord[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return this.getRecordsByDateRange(today, today);
    }

    /**
     * Gets completion records for the last N days.
     */
    async getRecentRecords(days: number): Promise<TaskCompletionRecord[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);
        
        return this.getRecordsByDateRange(startDate, endDate);
    }

    /**
     * Gets completion records for a specific project.
     */
    async getRecordsByProject(projectPath: string): Promise<TaskCompletionRecord[]> {
        const history = await this.getHistory();
        return history.records.filter(r => r.projectPath === projectPath);
    }

    /**
     * Gets completion records for the current session.
     */
    async getCurrentSessionRecords(): Promise<TaskCompletionRecord[]> {
        const history = await this.getHistory();
        return history.records.filter(r => r.sessionId === this.currentSessionId);
    }

    /**
     * Gets daily summaries for the specified number of days.
     */
    async getDailySummaries(days: number = 30): Promise<DailyCompletionSummary[]> {
        const records = await this.getRecentRecords(days);
        
        // Group records by date
        const byDate = new Map<string, TaskCompletionRecord[]>();
        for (const record of records) {
            const existing = byDate.get(record.dateKey) || [];
            existing.push(record);
            byDate.set(record.dateKey, existing);
        }
        
        // Create summaries
        const summaries: DailyCompletionSummary[] = [];
        for (const [date, dateRecords] of byDate) {
            const totalDuration = dateRecords.reduce((sum, r) => sum + r.duration, 0);
            const projects = [...new Set(dateRecords.map(r => r.projectName))];
            
            summaries.push({
                date,
                tasksCompleted: dateRecords.length,
                totalDuration,
                averageDuration: dateRecords.length > 0 ? Math.round(totalDuration / dateRecords.length) : 0,
                projects
            });
        }
        
        // Sort by date descending
        summaries.sort((a, b) => b.date.localeCompare(a.date));
        
        return summaries;
    }

    /**
     * Gets overall statistics from the history.
     */
    async getOverallStats(): Promise<{
        totalTasks: number;
        totalDuration: number;
        averageDuration: number;
        uniqueProjects: number;
        uniqueSessions: number;
        oldestRecord: number | null;
        newestRecord: number | null;
    }> {
        const history = await this.getHistory();
        const records = history.records;
        
        if (records.length === 0) {
            return {
                totalTasks: 0,
                totalDuration: 0,
                averageDuration: 0,
                uniqueProjects: 0,
                uniqueSessions: 0,
                oldestRecord: null,
                newestRecord: null
            };
        }
        
        const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
        const uniqueProjects = new Set(records.map(r => r.projectPath)).size;
        const uniqueSessions = new Set(records.map(r => r.sessionId)).size;
        const completedTimes = records.map(r => r.completedAt);
        
        return {
            totalTasks: records.length,
            totalDuration,
            averageDuration: Math.round(totalDuration / records.length),
            uniqueProjects,
            uniqueSessions,
            oldestRecord: Math.min(...completedTimes),
            newestRecord: Math.max(...completedTimes)
        };
    }

    /**
     * Clears all completion history.
     */
    async clearHistory(): Promise<void> {
        await this.saveHistory({ ...DEFAULT_COMPLETION_HISTORY });
        log('Cleared completion history');
    }

    /**
     * Gets statistics for the current session.
     * This provides data for the session statistics dashboard.
     */
    async getSessionStats(): Promise<SessionStats> {
        const sessionRecords = await this.getCurrentSessionRecords();
        const now = Date.now();
        
        if (sessionRecords.length === 0) {
            return {
                ...DEFAULT_SESSION_STATS,
                sessionId: this.currentSessionId,
                sessionStartTime: now
            };
        }
        
        // Sort by completion time
        const sortedRecords = [...sessionRecords].sort((a, b) => a.completedAt - b.completedAt);
        
        // Calculate basic stats
        const totalDuration = sortedRecords.reduce((sum, r) => sum + r.duration, 0);
        const durations = sortedRecords.map(r => r.duration);
        const fastestTask = durations.length > 0 ? Math.min(...durations) : null;
        const slowestTask = durations.length > 0 ? Math.max(...durations) : null;
        
        // Session start time (first task completion - its duration)
        const firstCompletion = sortedRecords[0];
        const sessionStartTime = firstCompletion.completedAt - firstCompletion.duration;
        
        // Time since last completion
        const lastCompletion = sortedRecords[sortedRecords.length - 1];
        const timeSinceLastCompletion = now - lastCompletion.completedAt;
        
        // Calculate tasks per hour
        const sessionDurationMs = now - sessionStartTime;
        const sessionDurationHours = sessionDurationMs / (1000 * 60 * 60);
        const tasksPerHour = sessionDurationHours > 0 
            ? Math.round((sortedRecords.length / sessionDurationHours) * 10) / 10 
            : 0;
        
        // Calculate streak (consecutive completions within 30 min of each other)
        let currentStreak = 1;
        const STREAK_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
        for (let i = sortedRecords.length - 1; i > 0; i--) {
            const gap = sortedRecords[i].completedAt - sortedRecords[i - 1].completedAt;
            if (gap <= STREAK_THRESHOLD_MS) {
                currentStreak++;
            } else {
                break;
            }
        }
        
        // Unique projects worked on
        const projectsWorkedOn = new Set(sortedRecords.map(r => r.projectPath)).size;
        
        // Task descriptions (truncated to last 10)
        const completedTasks = sortedRecords
            .slice(-10)
            .map(r => r.taskDescription.substring(0, 100));
        
        return {
            sessionId: this.currentSessionId,
            sessionStartTime,
            tasksCompleted: sortedRecords.length,
            totalDuration,
            averageDuration: sortedRecords.length > 0 ? Math.round(totalDuration / sortedRecords.length) : 0,
            fastestTask,
            slowestTask,
            currentStreak,
            timeSinceLastCompletion,
            tasksPerHour,
            completedTasks,
            projectsWorkedOn
        };
    }

    /**
     * Removes records older than the retention period.
     */
    private cleanupOldRecords(history: CompletionHistoryData): void {
        const cutoffDate = Date.now() - (HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        const originalCount = history.records.length;
        
        history.records = history.records.filter(r => r.completedAt >= cutoffDate);
        history.lastCleanup = Date.now();
        
        const removed = originalCount - history.records.length;
        if (removed > 0) {
            log(`Cleaned up ${removed} old completion records (older than ${HISTORY_RETENTION_DAYS} days)`);
        }
    }

    /**
     * Generates a comprehensive productivity report for the specified period.
     * 
     * @param period - The report period: 'today', 'week', 'month', or 'custom'
     * @param customStartDate - Start date for custom period (required if period is 'custom')
     * @param customEndDate - End date for custom period (required if period is 'custom')
     * @returns A detailed ProductivityReport object
     */
    async generateProductivityReport(
        period: ReportPeriod,
        customStartDate?: Date,
        customEndDate?: Date
    ): Promise<ProductivityReport> {
        const now = Date.now();
        let startDate: Date;
        let endDate: Date = new Date();
        
        // Determine date range based on period
        switch (period) {
            case 'today':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) {
                    throw new Error('Custom period requires both start and end dates');
                }
                startDate = customStartDate;
                endDate = customEndDate;
                break;
            default:
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
        }
        
        // Get records for the period
        const records = await this.getRecordsByDateRange(startDate, endDate);
        
        if (records.length === 0) {
            return this.createEmptyReport(period, startDate, endDate);
        }
        
        // Calculate basic stats
        const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
        const durations = records.map(r => r.duration);
        const uniqueSessions = new Set(records.map(r => r.sessionId)).size;
        const uniqueProjects = new Set(records.map(r => r.projectPath)).size;
        
        // Time breakdown
        const timeBreakdown = this.calculateTimeBreakdown(durations);
        
        // Project breakdown
        const projectBreakdown = this.calculateProjectBreakdown(records, totalDuration);
        
        // Daily activity
        const dailyActivity = this.calculateDailyActivity(records);
        
        // Trends
        const trends = await this.calculateTrends(records, startDate, endDate);
        
        // Generate title based on period
        const title = this.getReportTitle(period, startDate, endDate);
        
        return {
            title,
            generatedAt: now,
            periodStart: startDate.getTime(),
            periodEnd: endDate.getTime(),
            periodType: period,
            totalTasks: records.length,
            totalDuration,
            sessions: uniqueSessions,
            projects: uniqueProjects,
            timeBreakdown,
            projectBreakdown,
            dailyActivity,
            trends
        };
    }
    
    /**
     * Creates an empty productivity report.
     */
    private createEmptyReport(period: ReportPeriod, startDate: Date, endDate: Date): ProductivityReport {
        const title = this.getReportTitle(period, startDate, endDate);
        return {
            title,
            generatedAt: Date.now(),
            periodStart: startDate.getTime(),
            periodEnd: endDate.getTime(),
            periodType: period,
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
    }
    
    /**
     * Generates report title based on period.
     */
    private getReportTitle(period: ReportPeriod, startDate: Date, endDate: Date): string {
        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        switch (period) {
            case 'today':
                return `Productivity Report - Today (${formatDate(startDate)})`;
            case 'week':
                return `Productivity Report - Last 7 Days`;
            case 'month':
                return `Productivity Report - Last 30 Days`;
            case 'custom':
                return `Productivity Report - ${formatDate(startDate)} to ${formatDate(endDate)}`;
            default:
                return 'Productivity Report';
        }
    }
    
    /**
     * Calculates time breakdown statistics.
     */
    private calculateTimeBreakdown(durations: number[]): TimeBreakdown {
        if (durations.length === 0) {
            return {
                totalActiveTime: 0,
                averageTaskTime: 0,
                fastestTaskTime: null,
                slowestTaskTime: null,
                timeDeviation: 0
            };
        }
        
        const total = durations.reduce((a, b) => a + b, 0);
        const avg = total / durations.length;
        const fastest = Math.min(...durations);
        const slowest = Math.max(...durations);
        
        // Calculate standard deviation
        const squaredDiffs = durations.map(d => Math.pow(d - avg, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / durations.length;
        const deviation = Math.sqrt(avgSquaredDiff);
        
        return {
            totalActiveTime: total,
            averageTaskTime: Math.round(avg),
            fastestTaskTime: fastest,
            slowestTaskTime: slowest,
            timeDeviation: Math.round(deviation)
        };
    }
    
    /**
     * Calculates per-project breakdown.
     */
    private calculateProjectBreakdown(records: TaskCompletionRecord[], totalDuration: number): ProjectBreakdown[] {
        const projectMap = new Map<string, { name: string; path: string; tasks: number; duration: number }>();
        
        for (const record of records) {
            const existing = projectMap.get(record.projectPath);
            if (existing) {
                existing.tasks++;
                existing.duration += record.duration;
            } else {
                projectMap.set(record.projectPath, {
                    name: record.projectName,
                    path: record.projectPath,
                    tasks: 1,
                    duration: record.duration
                });
            }
        }
        
        const totalTasks = records.length;
        
        return Array.from(projectMap.values())
            .map(p => ({
                name: p.name,
                path: p.path,
                tasksCompleted: p.tasks,
                totalDuration: p.duration,
                taskPercentage: totalTasks > 0 ? Math.round((p.tasks / totalTasks) * 100) : 0,
                timePercentage: totalDuration > 0 ? Math.round((p.duration / totalDuration) * 100) : 0
            }))
            .sort((a, b) => b.tasksCompleted - a.tasksCompleted);
    }
    
    /**
     * Calculates daily activity data.
     */
    private calculateDailyActivity(records: TaskCompletionRecord[]): DailyActivity[] {
        const dailyMap = new Map<string, { tasks: number; duration: number; projects: Set<string> }>();
        
        for (const record of records) {
            const existing = dailyMap.get(record.dateKey);
            if (existing) {
                existing.tasks++;
                existing.duration += record.duration;
                existing.projects.add(record.projectName);
            } else {
                dailyMap.set(record.dateKey, {
                    tasks: 1,
                    duration: record.duration,
                    projects: new Set([record.projectName])
                });
            }
        }
        
        return Array.from(dailyMap.entries())
            .map(([date, data]) => ({
                date,
                tasksCompleted: data.tasks,
                totalDuration: data.duration,
                projects: Array.from(data.projects)
            }))
            .sort((a, b) => b.date.localeCompare(a.date));
    }
    
    /**
     * Calculates productivity trends and insights.
     */
    private async calculateTrends(
        records: TaskCompletionRecord[],
        startDate: Date,
        endDate: Date
    ): Promise<ProductivityTrends> {
        // Calculate days in period
        const daysInPeriod = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
        const avgTasksPerDay = Math.round((records.length / daysInPeriod) * 10) / 10;
        
        // Find most productive day of week
        const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];
        const hourCounts = new Array(24).fill(0);
        
        for (const record of records) {
            const date = new Date(record.completedAt);
            dayOfWeekCounts[date.getDay()]++;
            hourCounts[date.getHours()]++;
        }
        
        let mostProductiveDay: number | null = null;
        let maxDayCount = 0;
        for (let i = 0; i < 7; i++) {
            if (dayOfWeekCounts[i] > maxDayCount) {
                maxDayCount = dayOfWeekCounts[i];
                mostProductiveDay = i;
            }
        }
        
        let mostProductiveHour: number | null = null;
        let maxHourCount = 0;
        for (let i = 0; i < 24; i++) {
            if (hourCounts[i] > maxHourCount) {
                maxHourCount = hourCounts[i];
                mostProductiveHour = i;
            }
        }
        
        // Calculate trend direction (compare first half to second half of period)
        const midpoint = startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2;
        const firstHalf = records.filter(r => r.completedAt < midpoint).length;
        const secondHalf = records.filter(r => r.completedAt >= midpoint).length;
        
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        let trendPercentage = 0;
        
        if (firstHalf > 0) {
            const change = ((secondHalf - firstHalf) / firstHalf) * 100;
            trendPercentage = Math.round(Math.abs(change));
            if (change > 10) {
                trendDirection = 'up';
            } else if (change < -10) {
                trendDirection = 'down';
            }
        } else if (secondHalf > 0) {
            trendDirection = 'up';
            trendPercentage = 100;
        }
        
        // Calculate streaks
        const { longestStreak, currentStreak } = this.calculateStreaks(records);
        
        return {
            avgTasksPerDay,
            mostProductiveDay,
            mostProductiveHour,
            trendDirection,
            trendPercentage,
            longestStreak,
            currentStreak
        };
    }
    
    /**
     * Calculates longest and current completion streaks.
     */
    private calculateStreaks(records: TaskCompletionRecord[]): { longestStreak: number; currentStreak: number } {
        if (records.length === 0) {
            return { longestStreak: 0, currentStreak: 0 };
        }
        
        // Get unique dates sorted
        const uniqueDates = [...new Set(records.map(r => r.dateKey))].sort();
        
        if (uniqueDates.length === 0) {
            return { longestStreak: 0, currentStreak: 0 };
        }
        
        let longestStreak = 1;
        let currentStreakCount = 1;
        
        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i - 1]);
            const currDate = new Date(uniqueDates[i]);
            
            // Check if consecutive days
            const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
            
            if (diffDays === 1) {
                currentStreakCount++;
                longestStreak = Math.max(longestStreak, currentStreakCount);
            } else {
                currentStreakCount = 1;
            }
        }
        
        // Check if current streak is still active (includes today or yesterday)
        const lastDate = uniqueDates[uniqueDates.length - 1];
        const today = getDateKey(Date.now());
        const yesterday = getDateKey(Date.now() - 24 * 60 * 60 * 1000);
        
        const isActive = lastDate === today || lastDate === yesterday;
        
        return {
            longestStreak,
            currentStreak: isActive ? currentStreakCount : 0
        };
    }
}

/**
 * Singleton instance holder for the completion history storage.
 */
let historyStorageInstance: CompletionHistoryStorage | null = null;

/**
 * Initializes the completion history storage.
 * Should be called during extension activation.
 */
export function initHistoryStorage(context: vscode.ExtensionContext): CompletionHistoryStorage {
    historyStorageInstance = new CompletionHistoryStorage(context);
    return historyStorageInstance;
}

/**
 * Gets the completion history storage instance.
 * Returns null if not initialized.
 */
export function getHistoryStorage(): CompletionHistoryStorage | null {
    return historyStorageInstance;
}

/**
 * Gets the completion history storage instance.
 * Throws an error if not initialized.
 */
export function requireHistoryStorage(): CompletionHistoryStorage {
    if (!historyStorageInstance) {
        throw new Error('Completion history storage not initialized. Call initHistoryStorage first.');
    }
    return historyStorageInstance;
}
