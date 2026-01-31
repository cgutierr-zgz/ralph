/**
 * WebviewBuilder - Dedicated class for building webview HTML content.
 * 
 * This class encapsulates all webview HTML generation logic, making it:
 * - Testable in isolation without VS Code dependencies
 * - Reusable across different panel types (main panel, sidebar)
 * - Configurable for different contexts and states
 * 
 * Performance optimization: Static HTML fragments are cached using the
 * htmlCache module to avoid redundant string generation.
 */

import { Task, TaskRequirements, RalphSettings, PanelState, DEFAULT_PANEL_STATE, DEFAULT_REQUIREMENTS, ProjectInfo } from './types';
import {
    getControls,
    getHeader,
    getRequirementsSection,
    getTaskSection,
    getSettingsOverlay,
    getPendingTasksSection,
    getCompletionHistorySection,
    // Cached fragment accessors for static content
    getCachedStyles,
    getCachedClientScripts,
    getCachedHeader,
    getCachedSetupSection,
    getCachedTimelineSection,
    getCachedLogSection,
    getCachedFooter,
    getCachedScreenReaderAnnouncer,
    getCachedToastContainer,
    getCachedSkeletonTimeline,
    getCachedSkeletonTask,
    getCachedSkeletonLog,
    getCachedSkeletonRequirements,
    getCachedDurationChartSection,
    getCachedDependencyGraphSection,
    getCachedAggregatedStatsSection,
    getCachedCompletionHistorySection,
    getCachedSessionStatsDashboard,
    getCachedProductivityReportSection
} from './webview';

/**
 * Options for building the main panel HTML.
 */
export interface PanelHtmlOptions {
    /** Whether a PRD file exists */
    hasPrd: boolean;
    /** The next task to display, or null if none */
    nextTask: Task | null;
    /** All parsed tasks */
    allTasks: Task[];
    /** Total number of tasks */
    totalTasks: number;
    /** Persisted panel state (collapsed sections, scroll position, etc.) */
    panelState?: PanelState;
    /** Task requirements settings */
    requirements?: TaskRequirements;
    /** Ralph settings (max iterations, etc.) */
    settings?: RalphSettings;
    /** Whether to use cached fragments (default: true) */
    useCache?: boolean;
    /** List of available projects */
    projects?: ProjectInfo[];
    /** Current project path */
    currentProject?: string | null;
}

/**
 * Default settings for the webview.
 */
export const DEFAULT_SETTINGS: RalphSettings = {
    maxIterations: 50
};

/**
 * WebviewBuilder class for generating webview HTML content.
 * 
 * This class extracts all HTML generation logic into a dedicated, testable class.
 * It follows the builder pattern to allow flexible configuration and construction
 * of webview HTML content.
 * 
 * Performance: Uses cached fragments for static HTML content to minimize
 * string generation overhead. The cache can be disabled via options.useCache.
 */
export class WebviewBuilder {
    private options: PanelHtmlOptions;

    /**
     * Creates a new WebviewBuilder instance.
     * @param options - Configuration options for the HTML generation
     */
    constructor(options: Partial<PanelHtmlOptions> = {}) {
        this.options = {
            hasPrd: options.hasPrd ?? false,
            nextTask: options.nextTask ?? null,
            allTasks: options.allTasks ?? [],
            totalTasks: options.totalTasks ?? 0,
            panelState: options.panelState ?? { ...DEFAULT_PANEL_STATE },
            requirements: options.requirements ?? { ...DEFAULT_REQUIREMENTS },
            settings: options.settings ?? { ...DEFAULT_SETTINGS },
            useCache: options.useCache ?? true,
            projects: options.projects ?? [],
            currentProject: options.currentProject ?? null
        };
    }

    /**
     * Sets whether a PRD file exists.
     * @param hasPrd - Whether a PRD file exists
     * @returns The builder instance for chaining
     */
    setHasPrd(hasPrd: boolean): WebviewBuilder {
        this.options.hasPrd = hasPrd;
        return this;
    }
    /**
     * Sets list of available projects.
     * @param projects - List of ProjectInfo
     * @returns The builder instance for chaining
     */
    public setProjects(projects: ProjectInfo[]): WebviewBuilder {
        this.options.projects = projects;
        return this;
    }

    /**
     * Sets current project path.
     * @param currentProject - Current project path
     * @returns The builder instance for chaining
     */
    public setCurrentProject(currentProject: string | null): WebviewBuilder {
        this.options.currentProject = currentProject;
        return this;
    }
    /**
     * Sets the next task to display.
     * @param nextTask - The next task, or null if none
     * @returns The builder instance for chaining
     */
    setNextTask(nextTask: Task | null): WebviewBuilder {
        this.options.nextTask = nextTask;
        return this;
    }

    /**
     * Sets all parsed tasks.
     * @param allTasks - Array of all tasks
     * @returns The builder instance for chaining
     */
    setAllTasks(allTasks: Task[]): WebviewBuilder {
        this.options.allTasks = allTasks;
        return this;
    }

    /**
     * Sets the total number of tasks.
     * @param totalTasks - Total task count
     * @returns The builder instance for chaining
     */
    setTotalTasks(totalTasks: number): WebviewBuilder {
        this.options.totalTasks = totalTasks;
        return this;

    }

    /**
     * Sets the panel state.
     * @param panelState - Panel state for persistence
     * @returns The builder instance for chaining
     */
    setPanelState(panelState: PanelState): WebviewBuilder {
        this.options.panelState = panelState;
        return this;
    }

    /**
     * Sets the task requirements.
     * @param requirements - Task requirements settings
     * @returns The builder instance for chaining
     */
    setRequirements(requirements: TaskRequirements): WebviewBuilder {
        this.options.requirements = requirements;
        return this;
    }

    /**
     * Sets the Ralph settings.
     * @param settings - Ralph settings
     * @returns The builder instance for chaining
     */
    setSettings(settings: RalphSettings): WebviewBuilder {
        this.options.settings = settings;
        return this;
    }

    /**
     * Sets whether to use cached fragments.
     * @param useCache - Whether to use the HTML fragment cache
     * @returns The builder instance for chaining
     */
    setUseCache(useCache: boolean): WebviewBuilder {
        this.options.useCache = useCache;
        return this;
    }

    /**
     * Gets the current options.
     * @returns The current build options
     */
    getOptions(): Readonly<PanelHtmlOptions> {
        return { ...this.options };
    }

    /**
     * Builds the document head section with styles.
     * Uses cached styles for improved performance.
     * @returns The HTML head section string
     */
    buildHead(): string {
        const styles = this.options.useCache ? getCachedStyles() : getCachedStyles();
        return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ralph</title>
    <style>${styles}</style>
</head>`;
    }

    /**
     * Builds the accessibility components (screen reader announcer).
     * Uses cached fragment for improved performance.
     * @returns The accessibility HTML string
     */
    buildAccessibilityComponents(): string {
        return getCachedScreenReaderAnnouncer();
    }

    /**
     * Builds the toast notification container.
     * Uses cached fragment for improved performance.
     * @returns The toast container HTML string
     */
    buildToastContainer(): string {
        return getCachedToastContainer();
    }

    /**
     * Builds the header section.
     * Uses cached fragment for improved performance.
     * @returns The header HTML string
     */
    buildHeader(): string {
        // If we have multiple projects, we cannot use cache for header
        // as it contains dyamic dropdown content tailored to available projects.
        // Or we cache it keyed by project count/current project but that's complex.
        
        if (this.options.projects && this.options.projects.length > 1) {
             return getHeader(this.options.projects, this.options.currentProject);
        }
        
        return this.options.useCache ? getCachedHeader() : getCachedHeader();
    }

    /**
     * Builds the control buttons section.
     * This is dynamic (depends on hasPrd) so it cannot be cached.
     * @returns The controls HTML string
     */
    buildControls(): string {
        return getControls(this.options.hasPrd);
    }

    /**
     * Builds the setup section (shown when no PRD exists).
     * Uses cached fragment when PRD doesn't exist.
     * @returns The setup section HTML string, or empty if PRD exists
     */
    buildSetupSection(): string {
        return !this.options.hasPrd ? getCachedSetupSection() : '';
    }

    /**
     * Builds all skeleton loader components.
     * Uses cached fragments for improved performance.
     * @returns The skeleton loaders HTML string
     */
    buildSkeletonLoaders(): string {
        const parts: string[] = [];
        parts.push(getCachedSkeletonTimeline());
        if (this.options.hasPrd) {
            parts.push(getCachedSkeletonRequirements());
        }
        parts.push(getCachedSkeletonTask());
        parts.push(getCachedSkeletonLog());
        return parts.join('\n');
    }

    /**
     * Builds the timeline section.
     * Uses cached fragment for improved performance.
     * @returns The timeline HTML string
     */
    buildTimelineSection(): string {
        return getCachedTimelineSection();
    }

    /**
     * Builds the duration chart section.
     * Uses cached fragment for improved performance.
     * @returns The duration chart HTML string
     */
    buildDurationChartSection(): string {
        return getCachedDurationChartSection();
    }

    /**
     * Builds the dependency graph section.
     * Uses cached fragment for improved performance.
     * @returns The dependency graph HTML string
     */
    buildDependencyGraphSection(): string {
        return getCachedDependencyGraphSection();
    }

    /**
     * Builds the aggregated stats section.
     * Uses cached fragment for improved performance.
     * @returns The aggregated stats HTML string
     */
    buildAggregatedStatsSection(): string {
        return getCachedAggregatedStatsSection();
    }

    /**
     * Builds the completion history section.
     * Uses cached fragment for improved performance.
     * @returns The completion history HTML string
     */
    buildCompletionHistorySection(): string {
        return getCachedCompletionHistorySection();
    }

    /**
     * Builds the session statistics dashboard section.
     * Uses cached fragment for improved performance.
     * @returns The session stats dashboard HTML string
     */
    buildSessionStatsDashboard(): string {
        return getCachedSessionStatsDashboard();
    }

    /**
     * Builds the productivity report section.
     * Uses cached fragment for improved performance.
     * @returns The productivity report section HTML string
     */
    buildProductivityReportSection(): string {
        return getCachedProductivityReportSection();
    }

    /**
     * Builds the requirements section.
     * This is dynamic (depends on requirements state) so it cannot be fully cached.
     * @returns The requirements HTML string, or empty if no PRD
     */
    buildRequirementsSection(): string {
        if (!this.options.hasPrd) {
            return '';
        }
        return getRequirementsSection(this.options.requirements || DEFAULT_REQUIREMENTS);
    }

    /**
     * Builds the task section.
     * This is dynamic (depends on task data) so it cannot be cached.
     * @returns The task section HTML string
     */
    buildTaskSection(): string {
        return getTaskSection(this.options.nextTask, this.options.totalTasks > 0);
    }

    /**
     * Builds the pending tasks queue section.
     * This is dynamic (depends on task list) so it cannot be cached.
     * @returns The pending tasks HTML string, or empty if no PRD
     */
    buildPendingTasksSection(): string {
        if (!this.options.hasPrd) {
            return '';
        }
        return getPendingTasksSection(this.options.allTasks);
    }

    /**
     * Builds the log section.
     * Uses cached fragment for improved performance.
     * @returns The log section HTML string
     */
    buildLogSection(): string {
        return getCachedLogSection();
    }

    /**
     * Builds the footer section.
     * Uses cached fragment for improved performance.
     * @returns The footer HTML string
     */
    buildFooter(): string {
        return getCachedFooter();
    }

    /**
     * Builds the settings overlay.
     * This is dynamic (depends on settings) so it cannot be cached.
     * @returns The settings overlay HTML string
     */
    buildSettingsOverlay(): string {
        const settings = this.options.settings || DEFAULT_SETTINGS;
        return getSettingsOverlay({ maxIterations: settings.maxIterations });
    }

    /**
     * Builds the injected state scripts.
     * This is always dynamic (contains runtime state).
     * @returns The state injection script HTML
     */
    buildStateScripts(): string {
        const stateJson = JSON.stringify(this.options.panelState || DEFAULT_PANEL_STATE);
        const tasksJson = JSON.stringify(this.options.allTasks);
        
        return `<script>
        // Panel state injected from extension
        window.__RALPH_PANEL_STATE__ = ${stateJson};
        // Tasks data injected from extension
        window.__RALPH_INITIAL_TASKS__ = ${tasksJson};
    </script>`;
    }

    /**
     * Builds the client-side scripts.
     * Uses cached scripts for improved performance.
     * @returns The client scripts HTML string
     */
    buildClientScripts(): string {
        return `<script>${getCachedClientScripts()}</script>`;
    }

    /**
     * Builds the main content area with all sections.
     * Uses cached fragments where possible for improved performance.
     * @returns The main content HTML string
     */
    buildMainContent(): string {
        const sections: string[] = [];
        
        // Setup section (if no PRD) - uses cache
        sections.push(this.buildSetupSection());
        
        // Skeleton loaders (shown during loading) - uses cache
        sections.push(getCachedSkeletonTimeline());
        
        // Timeline and charts - uses cache
        sections.push(this.buildTimelineSection());
        sections.push(this.buildDurationChartSection());
        sections.push(this.buildDependencyGraphSection());
        
        // Aggregated stats section (for multi-project support) - uses cache
        sections.push(this.buildAggregatedStatsSection());
        
        // Session statistics dashboard - uses cache
        sections.push(this.buildSessionStatsDashboard());
        
        // Productivity report section - uses cache
        sections.push(this.buildProductivityReportSection());
        
        // Completion history section (for tracking over time) - uses cache
        sections.push(this.buildCompletionHistorySection());
        
        // Requirements skeleton and section
        if (this.options.hasPrd) {
            sections.push(getCachedSkeletonRequirements());
            sections.push(this.buildRequirementsSection());
        }
        
        // Task skeleton and section
        sections.push(getCachedSkeletonTask());
        sections.push(this.buildTaskSection());
        
        // Pending tasks queue
        sections.push(this.buildPendingTasksSection());
        
        // Log skeleton and section - uses cache
        sections.push(getCachedSkeletonLog());
        sections.push(this.buildLogSection());
        
        // Footer - uses cache
        sections.push(this.buildFooter());
        
        return `<div class="content" id="mainContent" tabindex="-1" role="main">
        ${sections.filter(s => s).join('\n        ')}
    </div>`;
    }

    /**
     * Builds the complete HTML document for the webview panel.
     * Combines cached static fragments with dynamic content for optimal performance.
     * @returns The complete HTML document string
     */
    build(): string {
        return `<!DOCTYPE html>
<html lang="en">
${this.buildHead()}
<body>
    ${this.buildAccessibilityComponents()}
    ${this.buildToastContainer()}
    ${this.buildHeader()}
    ${this.buildControls()}
    ${this.buildMainContent()}
    ${this.buildSettingsOverlay()}
    ${this.buildStateScripts()}
    ${this.buildClientScripts()}
</body>
</html>`;
    }

    /**
     * Static factory method to create a builder with all options.
     * @param options - The build options
     * @returns A configured WebviewBuilder instance
     */
    static create(options: Partial<PanelHtmlOptions> = {}): WebviewBuilder {
        return new WebviewBuilder(options);
    }

    /**
     * Static convenience method to build HTML directly from options.
     * @param options - The build options
     * @returns The complete HTML document string
     */
    static buildHtml(options: Partial<PanelHtmlOptions> = {}): string {
        return new WebviewBuilder(options).build();
    }
}

/**
 * Builds the main panel HTML with the provided options.
 * This is a convenience function that wraps the WebviewBuilder.

 * 
 * @param options - Configuration options for the HTML generation
 * @returns The complete HTML document string
 */
export function buildPanelHtml(options: Partial<PanelHtmlOptions> = {}): string {
    return WebviewBuilder.buildHtml(options);
}
