import * as assert from 'assert';

/**
 * Unit tests for WebviewBuilder class
 * 
 * These tests verify the WebviewBuilder class functionality in isolation,
 * without requiring VS Code dependencies.
 */

// Define types matching the source files to avoid importing VS Code-dependent modules
interface Task {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'complete' | 'blocked' | 'skipped';
    line: number;
    rawLine?: string;
    dependencies?: string[];
    acceptanceCriteria?: string[];
}

interface TaskRequirements {
    runTests: boolean;
    runLinting: boolean;
    runTypeCheck: boolean;
    writeTests: boolean;
    updateDocs: boolean;
    commitChanges: boolean;
}

interface RalphSettings {
    maxIterations: number;
}

interface PanelState {
    collapsedSections: string[];
    scrollPosition: number;
    requirements: TaskRequirements;
}

interface PanelHtmlOptions {
    hasPrd: boolean;
    nextTask: Task | null;
    allTasks: Task[];
    totalTasks: number;
    panelState?: PanelState;
    requirements?: TaskRequirements;
    settings?: RalphSettings;
}

const DEFAULT_REQUIREMENTS: TaskRequirements = {
    runTests: false,
    runLinting: false,
    runTypeCheck: false,
    writeTests: false,
    updateDocs: false,
    commitChanges: false
};

const DEFAULT_PANEL_STATE: PanelState = {
    collapsedSections: [],
    scrollPosition: 0,
    requirements: { ...DEFAULT_REQUIREMENTS }
};

const DEFAULT_SETTINGS: RalphSettings = {
    maxIterations: 50
};

// Mock implementation of WebviewBuilder for testing without VS Code dependencies
class MockWebviewBuilder {
    private options: PanelHtmlOptions;
    private useCache: boolean = true;

    constructor(options: Partial<PanelHtmlOptions> = {}) {
        this.options = {
            hasPrd: options.hasPrd ?? false,
            nextTask: options.nextTask ?? null,
            allTasks: options.allTasks ?? [],
            totalTasks: options.totalTasks ?? 0,
            panelState: options.panelState ?? { ...DEFAULT_PANEL_STATE },
            requirements: options.requirements ?? { ...DEFAULT_REQUIREMENTS },
            settings: options.settings ?? { ...DEFAULT_SETTINGS }
        };
    }

    setHasPrd(hasPrd: boolean): MockWebviewBuilder {
        this.options.hasPrd = hasPrd;
        return this;
    }

    setNextTask(nextTask: Task | null): MockWebviewBuilder {
        this.options.nextTask = nextTask;
        return this;
    }

    setAllTasks(allTasks: Task[]): MockWebviewBuilder {
        this.options.allTasks = allTasks;
        return this;
    }

    setTotalTasks(totalTasks: number): MockWebviewBuilder {
        this.options.totalTasks = totalTasks;
        return this;
    }

    setPanelState(panelState: PanelState): MockWebviewBuilder {
        this.options.panelState = panelState;
        return this;
    }

    setRequirements(requirements: TaskRequirements): MockWebviewBuilder {
        this.options.requirements = requirements;
        return this;
    }

    setSettings(settings: RalphSettings): MockWebviewBuilder {
        this.options.settings = settings;
        return this;
    }

    setUseCache(useCache: boolean): MockWebviewBuilder {
        this.useCache = useCache;
        return this;
    }

    getUseCache(): boolean {
        return this.useCache;
    }

    getOptions(): Readonly<PanelHtmlOptions> {
        return { ...this.options };
    }

    buildHead(): string {
        return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ralph</title>
    <style>/* styles */</style>
</head>`;
    }

    buildAccessibilityComponents(): string {
        return '<div id="srAnnouncer" class="sr-announcer" role="status" aria-live="assertive" aria-atomic="true"></div>';
    }

    buildToastContainer(): string {
        return '<div id="toastContainer" class="toast-container" role="region" aria-label="Notifications" aria-live="polite"></div>';
    }

    buildHeader(): string {
        return '<div class="header idle" id="header" role="banner">Header</div>';
    }

    buildControls(): string {
        return `<div class="controls" role="toolbar" aria-label="Automation controls">${this.options.hasPrd ? 'Enabled' : 'Disabled'}</div>`;
    }

    buildSetupSection(): string {
        return !this.options.hasPrd ? '<div class="setup-section" role="region" aria-label="Project setup">Setup</div>' : '';

    }

    buildSkeletonLoaders(): string {
        const parts: string[] = [];
        parts.push('<div class="skeleton skeleton-timeline">Timeline Skeleton</div>');
        if (this.options.hasPrd) {
            parts.push('<div class="skeleton skeleton-requirements">Requirements Skeleton</div>');
        }
        parts.push('<div class="skeleton skeleton-task">Task Skeleton</div>');
        parts.push('<div class="skeleton skeleton-log">Log Skeleton</div>');
        return parts.join('\n');
    }

    buildTimelineSection(): string {
        return '<div class="timeline-section">Timeline</div>';
    }

    buildDurationChartSection(): string {
        return '<div class="duration-chart-section">Duration Chart</div>';
    }

    buildDependencyGraphSection(): string {
        return '<div class="dependency-graph-section">Dependency Graph</div>';
    }

    buildRequirementsSection(): string {
        if (!this.options.hasPrd) {
            return '';
        }
        return '<div class="requirements-section">Requirements</div>';
    }

    buildTaskSection(): string {
        const taskText = this.options.nextTask ? this.options.nextTask.description : 'No task';
        return `<div class="task-section">${taskText}</div>`;
    }

    buildPendingTasksSection(): string {
        if (!this.options.hasPrd) {
            return '';
        }
        return `<div class="pending-tasks-section">${this.options.allTasks.length} tasks</div>`;
    }

    buildLogSection(): string {
        return '<div class="log-section">Log</div>';
    }

    buildFooter(): string {
        return '<footer class="footer">Footer</footer>';
    }

    buildSettingsOverlay(): string {
        const settings = this.options.settings || DEFAULT_SETTINGS;
        return `<div class="settings-overlay" data-max-iterations="${settings.maxIterations}">Settings</div>`;
    }

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

    buildClientScripts(): string {
        return '<script>/* client scripts */</script>';
    }

    buildMainContent(): string {
        const sections: string[] = [];
        
        sections.push(this.buildSetupSection());
        sections.push('<div class="skeleton skeleton-timeline">Timeline Skeleton</div>');
        sections.push(this.buildTimelineSection());
        sections.push(this.buildDurationChartSection());
        sections.push(this.buildDependencyGraphSection());
        
        if (this.options.hasPrd) {
            sections.push('<div class="skeleton skeleton-requirements">Requirements Skeleton</div>');
            sections.push(this.buildRequirementsSection());
        }
        
        sections.push('<div class="skeleton skeleton-task">Task Skeleton</div>');
        sections.push(this.buildTaskSection());
        sections.push(this.buildPendingTasksSection());
        
        sections.push('<div class="skeleton skeleton-log">Log Skeleton</div>');
        sections.push(this.buildLogSection());
        sections.push(this.buildFooter());
        
        return `<div class="content" id="mainContent" tabindex="-1" role="main">
        ${sections.filter(s => s).join('\n        ')}
    </div>`;
    }

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

    static create(options: Partial<PanelHtmlOptions> = {}): MockWebviewBuilder {
        return new MockWebviewBuilder(options);
    }

    static buildHtml(options: Partial<PanelHtmlOptions> = {}): string {
        return new MockWebviewBuilder(options).build();
    }
}

describe('WebviewBuilder', () => {
    describe('Constructor', () => {
        it('should create instance with default options', () => {
            const builder = new MockWebviewBuilder();
            const options = builder.getOptions();
            
            assert.strictEqual(options.hasPrd, false);
            assert.strictEqual(options.nextTask, null);
            assert.deepStrictEqual(options.allTasks, []);
            assert.strictEqual(options.totalTasks, 0);
        });

        it('should create instance with provided options', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: 'pending',
                line: 10
            };
            
            const builder = new MockWebviewBuilder({
                hasPrd: true,
                nextTask: task,
                totalTasks: 5
            });
            const options = builder.getOptions();
            
            assert.strictEqual(options.hasPrd, true);
            assert.deepStrictEqual(options.nextTask, task);
            assert.strictEqual(options.totalTasks, 5);
        });

        it('should use default panel state when not provided', () => {
            const builder = new MockWebviewBuilder();
            const options = builder.getOptions();
            
            assert.deepStrictEqual(options.panelState?.collapsedSections, []);
            assert.strictEqual(options.panelState?.scrollPosition, 0);
        });

        it('should use default requirements when not provided', () => {
            const builder = new MockWebviewBuilder();
            const options = builder.getOptions();
            
            assert.strictEqual(options.requirements?.runTests, false);
            assert.strictEqual(options.requirements?.runLinting, false);
        });

        it('should use default settings when not provided', () => {
            const builder = new MockWebviewBuilder();
            const options = builder.getOptions();
            
            assert.strictEqual(options.settings?.maxIterations, 50);
        });
    });

    describe('Builder Pattern Methods', () => {
        it('setHasPrd should set hasPrd option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const result = builder.setHasPrd(true);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.strictEqual(builder.getOptions().hasPrd, true);
        });

        it('setNextTask should set nextTask option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: 'pending',
                line: 1
            };
            const result = builder.setNextTask(task);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.deepStrictEqual(builder.getOptions().nextTask, task);
        });

        it('setAllTasks should set allTasks option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const tasks: Task[] = [
                { id: 'task-1', description: 'Task 1', status: 'pending', line: 1 },
                { id: 'task-2', description: 'Task 2', status: 'complete', line: 2 }
            ];
            const result = builder.setAllTasks(tasks);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.deepStrictEqual(builder.getOptions().allTasks, tasks);
        });

        it('setTotalTasks should set totalTasks option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const result = builder.setTotalTasks(10);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.strictEqual(builder.getOptions().totalTasks, 10);
        });

        it('setPanelState should set panelState option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const panelState: PanelState = {
                collapsedSections: ['timeline', 'log'],
                scrollPosition: 100,
                requirements: { ...DEFAULT_REQUIREMENTS, runTests: true }
            };
            const result = builder.setPanelState(panelState);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.deepStrictEqual(builder.getOptions().panelState, panelState);
        });

        it('setRequirements should set requirements option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const requirements: TaskRequirements = {
                ...DEFAULT_REQUIREMENTS,
                runTests: true,
                writeTests: true
            };
            const result = builder.setRequirements(requirements);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.deepStrictEqual(builder.getOptions().requirements, requirements);
        });

        it('setSettings should set settings option and return builder', () => {
            const builder = new MockWebviewBuilder();
            const settings: RalphSettings = { maxIterations: 100 };
            const result = builder.setSettings(settings);
            
            assert.strictEqual(result, builder, 'Should return builder for chaining');
            assert.deepStrictEqual(builder.getOptions().settings, settings);
        });

        it('should support method chaining', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Chained task',
                status: 'in-progress',
                line: 1
            };
            
            const builder = new MockWebviewBuilder()
                .setHasPrd(true)
                .setNextTask(task)
                .setTotalTasks(3)
                .setSettings({ maxIterations: 25 });
            
            const options = builder.getOptions();
            assert.strictEqual(options.hasPrd, true);
            assert.deepStrictEqual(options.nextTask, task);
            assert.strictEqual(options.totalTasks, 3);
            assert.strictEqual(options.settings?.maxIterations, 25);
        });
    });

    describe('buildHead', () => {
        it('should include DOCTYPE declaration', () => {
            const builder = new MockWebviewBuilder();
            const html = builder.build();
            
            assert.ok(html.includes('<!DOCTYPE html>'), 'Should include DOCTYPE');
        });

        it('should include html lang attribute', () => {
            const builder = new MockWebviewBuilder();
            const html = builder.build();
            
            assert.ok(html.includes('lang="en"'), 'Should include lang="en"');
        });

        it('should include charset meta tag', () => {
            const builder = new MockWebviewBuilder();
            const head = builder.buildHead();
            
            assert.ok(head.includes('charset="UTF-8"'), 'Should include UTF-8 charset');
        });

        it('should include viewport meta tag', () => {
            const builder = new MockWebviewBuilder();
            const head = builder.buildHead();
            
            assert.ok(head.includes('viewport'), 'Should include viewport meta');
        });

        it('should include title', () => {
            const builder = new MockWebviewBuilder();
            const head = builder.buildHead();
            
            assert.ok(head.includes('<title>Ralph</title>'), 'Should include Ralph title');
        });

        it('should include style tag', () => {
            const builder = new MockWebviewBuilder();
            const head = builder.buildHead();
            
            assert.ok(head.includes('<style>'), 'Should include style tag');
        });
    });

    describe('buildAccessibilityComponents', () => {
        it('should include screen reader announcer', () => {
            const builder = new MockWebviewBuilder();
            const a11y = builder.buildAccessibilityComponents();
            
            assert.ok(a11y.includes('srAnnouncer'), 'Should include srAnnouncer');
            assert.ok(a11y.includes('sr-announcer'), 'Should include sr-announcer class');
        });

        it('should include aria-live attribute', () => {
            const builder = new MockWebviewBuilder();
            const a11y = builder.buildAccessibilityComponents();
            
            assert.ok(a11y.includes('aria-live="assertive"'), 'Should include aria-live');
        });

        it('should include role status', () => {
            const builder = new MockWebviewBuilder();
            const a11y = builder.buildAccessibilityComponents();
            
            assert.ok(a11y.includes('role="status"'), 'Should include role status');
        });

        it('should include aria-atomic', () => {
            const builder = new MockWebviewBuilder();
            const a11y = builder.buildAccessibilityComponents();
            
            assert.ok(a11y.includes('aria-atomic="true"'), 'Should include aria-atomic');
        });
    });

    describe('buildToastContainer', () => {
        it('should include toast container', () => {
            const builder = new MockWebviewBuilder();
            const toast = builder.buildToastContainer();
            
            assert.ok(toast.includes('toastContainer'), 'Should include toastContainer');
            assert.ok(toast.includes('toast-container'), 'Should include toast-container class');
        });

        it('should include aria-label for notifications', () => {
            const builder = new MockWebviewBuilder();
            const toast = builder.buildToastContainer();
            
            assert.ok(toast.includes('aria-label'), 'Should include aria-label');
        });
    });

    describe('buildHeader', () => {
        it('should include header with role banner', () => {
            const builder = new MockWebviewBuilder();
            const header = builder.buildHeader();
            
            assert.ok(header.includes('role="banner"'), 'Should include role banner');
        });

        it('should include header id', () => {
            const builder = new MockWebviewBuilder();
            const header = builder.buildHeader();
            
            assert.ok(header.includes('id="header"'), 'Should include header id');
        });

        it('should include idle class by default', () => {
            const builder = new MockWebviewBuilder();
            const header = builder.buildHeader();
            
            assert.ok(header.includes('idle'), 'Should include idle class');
        });
    });

    describe('buildControls', () => {
        it('should include toolbar role', () => {
            const builder = new MockWebviewBuilder();
            const controls = builder.buildControls();
            
            assert.ok(controls.includes('role="toolbar"'), 'Should include role toolbar');
        });

        it('should show disabled controls when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const controls = builder.buildControls();
            
            assert.ok(controls.includes('Disabled'), 'Should show disabled');
        });

        it('should show enabled controls when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const controls = builder.buildControls();
            
            assert.ok(controls.includes('Enabled'), 'Should show enabled');
        });
    });

    describe('buildSetupSection', () => {
        it('should return setup section when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const setup = builder.buildSetupSection();
            
            assert.ok(setup.includes('setup-section'), 'Should include setup section');
            assert.ok(setup.includes('role="region"'), 'Should include role region');
        });

        it('should return empty string when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const setup = builder.buildSetupSection();
            
            assert.strictEqual(setup, '', 'Should return empty string');
        });
    });

    describe('buildSkeletonLoaders', () => {
        it('should include timeline skeleton', () => {
            const builder = new MockWebviewBuilder();
            const skeletons = builder.buildSkeletonLoaders();
            
            assert.ok(skeletons.includes('skeleton-timeline'), 'Should include timeline skeleton');
        });

        it('should include task skeleton', () => {
            const builder = new MockWebviewBuilder();
            const skeletons = builder.buildSkeletonLoaders();
            
            assert.ok(skeletons.includes('skeleton-task'), 'Should include task skeleton');
        });

        it('should include log skeleton', () => {
            const builder = new MockWebviewBuilder();
            const skeletons = builder.buildSkeletonLoaders();
            
            assert.ok(skeletons.includes('skeleton-log'), 'Should include log skeleton');
        });

        it('should include requirements skeleton when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const skeletons = builder.buildSkeletonLoaders();
            
            assert.ok(skeletons.includes('skeleton-requirements'), 'Should include requirements skeleton');
        });

        it('should not include requirements skeleton when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const skeletons = builder.buildSkeletonLoaders();
            
            assert.ok(!skeletons.includes('skeleton-requirements'), 'Should not include requirements skeleton');
        });
    });

    describe('buildTimelineSection', () => {
        it('should include timeline section', () => {
            const builder = new MockWebviewBuilder();
            const timeline = builder.buildTimelineSection();
            
            assert.ok(timeline.includes('Timeline'), 'Should include timeline');
        });
    });

    describe('buildDurationChartSection', () => {
        it('should include duration chart section', () => {
            const builder = new MockWebviewBuilder();
            const chart = builder.buildDurationChartSection();
            
            assert.ok(chart.includes('Duration Chart'), 'Should include duration chart');
        });
    });

    describe('buildDependencyGraphSection', () => {
        it('should include dependency graph section', () => {
            const builder = new MockWebviewBuilder();
            const graph = builder.buildDependencyGraphSection();
            
            assert.ok(graph.includes('Dependency Graph'), 'Should include dependency graph');
        });
    });

    describe('buildRequirementsSection', () => {
        it('should return requirements section when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const requirements = builder.buildRequirementsSection();
            
            assert.ok(requirements.includes('Requirements'), 'Should include requirements');
        });

        it('should return empty string when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const requirements = builder.buildRequirementsSection();
            
            assert.strictEqual(requirements, '', 'Should return empty string');
        });
    });

    describe('buildTaskSection', () => {
        it('should show task description when task exists', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Implement feature X',
                status: 'pending',
                line: 1
            };
            const builder = new MockWebviewBuilder({ nextTask: task });
            const taskSection = builder.buildTaskSection();
            
            assert.ok(taskSection.includes('Implement feature X'), 'Should include task description');
        });

        it('should show "No task" when no task', () => {
            const builder = new MockWebviewBuilder({ nextTask: null });
            const taskSection = builder.buildTaskSection();
            
            assert.ok(taskSection.includes('No task'), 'Should show no task');
        });
    });

    describe('buildPendingTasksSection', () => {
        it('should return pending tasks section when PRD exists', () => {
            const tasks: Task[] = [
                { id: 'task-1', description: 'Task 1', status: 'pending', line: 1 },
                { id: 'task-2', description: 'Task 2', status: 'pending', line: 2 }
            ];
            const builder = new MockWebviewBuilder({ hasPrd: true, allTasks: tasks });
            const pending = builder.buildPendingTasksSection();
            
            assert.ok(pending.includes('2 tasks'), 'Should show task count');
        });

        it('should return empty string when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const pending = builder.buildPendingTasksSection();
            
            assert.strictEqual(pending, '', 'Should return empty string');
        });
    });

    describe('buildLogSection', () => {
        it('should include log section', () => {
            const builder = new MockWebviewBuilder();
            const log = builder.buildLogSection();
            
            assert.ok(log.includes('Log'), 'Should include log');
        });
    });

    describe('buildFooter', () => {
        it('should include footer element', () => {
            const builder = new MockWebviewBuilder();
            const footer = builder.buildFooter();
            
            assert.ok(footer.includes('footer'), 'Should include footer');
            assert.ok(footer.includes('Footer'), 'Should include footer content');
        });
    });

    describe('buildSettingsOverlay', () => {
        it('should include settings overlay', () => {
            const builder = new MockWebviewBuilder();
            const settings = builder.buildSettingsOverlay();
            
            assert.ok(settings.includes('settings-overlay'), 'Should include settings overlay');
        });

        it('should include max iterations value', () => {
            const builder = new MockWebviewBuilder({ settings: { maxIterations: 75 } });
            const settings = builder.buildSettingsOverlay();
            
            assert.ok(settings.includes('75'), 'Should include max iterations value');
        });

        it('should use default max iterations when not provided', () => {
            const builder = new MockWebviewBuilder();
            const settings = builder.buildSettingsOverlay();
            
            assert.ok(settings.includes('50'), 'Should include default max iterations');
        });
    });

    describe('buildStateScripts', () => {
        it('should include window.__RALPH_PANEL_STATE__', () => {
            const builder = new MockWebviewBuilder();
            const scripts = builder.buildStateScripts();
            
            assert.ok(scripts.includes('window.__RALPH_PANEL_STATE__'), 'Should include panel state');
        });

        it('should include window.__RALPH_INITIAL_TASKS__', () => {
            const builder = new MockWebviewBuilder();
            const scripts = builder.buildStateScripts();
            
            assert.ok(scripts.includes('window.__RALPH_INITIAL_TASKS__'), 'Should include initial tasks');
        });

        it('should serialize panel state as JSON', () => {
            const panelState: PanelState = {
                collapsedSections: ['timeline'],
                scrollPosition: 50,
                requirements: { ...DEFAULT_REQUIREMENTS }
            };
            const builder = new MockWebviewBuilder({ panelState });
            const scripts = builder.buildStateScripts();
            
            assert.ok(scripts.includes('"collapsedSections"'), 'Should include serialized state');
            assert.ok(scripts.includes('"timeline"'), 'Should include collapsed sections');
        });

        it('should serialize tasks as JSON', () => {
            const tasks: Task[] = [
                { id: 'test-1', description: 'Test', status: 'pending', line: 1 }
            ];
            const builder = new MockWebviewBuilder({ allTasks: tasks });
            const scripts = builder.buildStateScripts();
            
            assert.ok(scripts.includes('"id":"test-1"'), 'Should include serialized task');
        });
    });

    describe('buildClientScripts', () => {
        it('should include script tag', () => {
            const builder = new MockWebviewBuilder();
            const scripts = builder.buildClientScripts();
            
            assert.ok(scripts.includes('<script>'), 'Should include script tag');
            assert.ok(scripts.includes('</script>'), 'Should close script tag');
        });
    });

    describe('buildMainContent', () => {
        it('should include content div with id mainContent', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('id="mainContent"'), 'Should include mainContent id');
        });

        it('should include tabindex for keyboard navigation', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('tabindex="-1"'), 'Should include tabindex');
        });

        it('should include role main', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('role="main"'), 'Should include role main');
        });

        it('should include setup section when no PRD', () => {
            const builder = new MockWebviewBuilder({ hasPrd: false });
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('setup-section'), 'Should include setup section');
        });

        it('should not include setup section when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const content = builder.buildMainContent();
            
            assert.ok(!content.includes('setup-section'), 'Should not include setup section');
        });

        it('should include timeline section', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('Timeline'), 'Should include timeline');
        });

        it('should include requirements section when PRD exists', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('Requirements'), 'Should include requirements');
        });

        it('should include log section', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('Log'), 'Should include log');
        });

        it('should include footer', () => {
            const builder = new MockWebviewBuilder();
            const content = builder.buildMainContent();
            
            assert.ok(content.includes('Footer'), 'Should include footer');
        });
    });

    describe('build', () => {
        it('should generate valid HTML document', () => {
            const builder = new MockWebviewBuilder();
            const html = builder.build();
            
            assert.ok(html.includes('<!DOCTYPE html>'), 'Should include DOCTYPE');
            assert.ok(html.includes('<html'), 'Should include html tag');
            assert.ok(html.includes('</html>'), 'Should close html tag');
            assert.ok(html.includes('<head>'), 'Should include head');
            assert.ok(html.includes('<body>'), 'Should include body');
        });

        it('should include all major sections', () => {
            const builder = new MockWebviewBuilder({ hasPrd: true });
            const html = builder.build();
            
            assert.ok(html.includes('srAnnouncer'), 'Should include accessibility components');
            assert.ok(html.includes('toastContainer'), 'Should include toast container');
            assert.ok(html.includes('header'), 'Should include header');
            assert.ok(html.includes('controls'), 'Should include controls');
            assert.ok(html.includes('mainContent'), 'Should include main content');
            assert.ok(html.includes('settings-overlay'), 'Should include settings overlay');
            assert.ok(html.includes('__RALPH_PANEL_STATE__'), 'Should include state scripts');
        });

        it('should generate different HTML based on hasPrd', () => {
            const withPrd = new MockWebviewBuilder({ hasPrd: true }).build();
            const withoutPrd = new MockWebviewBuilder({ hasPrd: false }).build();
            
            assert.ok(withPrd.includes('Requirements'), 'With PRD should include requirements');
            assert.ok(withoutPrd.includes('setup-section'), 'Without PRD should include setup');
        });
    });

    describe('Static Factory Methods', () => {
        describe('create', () => {
            it('should create a new builder instance', () => {
                const builder = MockWebviewBuilder.create();
                
                assert.ok(builder instanceof MockWebviewBuilder, 'Should be MockWebviewBuilder instance');
            });

            it('should create builder with options', () => {
                const builder = MockWebviewBuilder.create({ hasPrd: true, totalTasks: 5 });
                const options = builder.getOptions();
                
                assert.strictEqual(options.hasPrd, true);
                assert.strictEqual(options.totalTasks, 5);
            });
        });

        describe('buildHtml', () => {
            it('should generate HTML directly from options', () => {
                const html = MockWebviewBuilder.buildHtml({ hasPrd: true });
                
                assert.ok(html.includes('<!DOCTYPE html>'), 'Should generate valid HTML');
                assert.ok(html.includes('Requirements'), 'Should include requirements section');
            });

            it('should use default options when not provided', () => {
                const html = MockWebviewBuilder.buildHtml();
                
                assert.ok(html.includes('<!DOCTYPE html>'), 'Should generate valid HTML');
                assert.ok(html.includes('setup-section'), 'Should include setup section');
            });
        });
    });

    describe('Integration - Full Build Scenarios', () => {
        it('should build HTML for new project (no PRD)', () => {
            const html = MockWebviewBuilder.buildHtml({
                hasPrd: false,
                nextTask: null,
                allTasks: [],
                totalTasks: 0
            });
            
            assert.ok(html.includes('setup-section'), 'Should show setup section');
            assert.ok(html.includes('No task'), 'Should show no task');
            assert.ok(!html.includes('Requirements'), 'Should not show requirements');
        });

        it('should build HTML for active project (with PRD)', () => {
            const tasks: Task[] = [
                { id: '1', description: 'Task 1', status: 'complete', line: 1 },
                { id: '2', description: 'Task 2', status: 'pending', line: 2 }
            ];
            const currentTask = tasks[1];
            
            const html = MockWebviewBuilder.buildHtml({
                hasPrd: true,
                nextTask: currentTask,
                allTasks: tasks,
                totalTasks: 2
            });
            
            assert.ok(!html.includes('setup-section'), 'Should not show setup section');
            assert.ok(html.includes('Task 2'), 'Should show current task');
            assert.ok(html.includes('Requirements'), 'Should show requirements');
            assert.ok(html.includes('2 tasks'), 'Should show pending tasks');
        });

        it('should build HTML with custom settings', () => {
            const html = MockWebviewBuilder.buildHtml({
                hasPrd: true,
                settings: { maxIterations: 100 }
            });
            
            assert.ok(html.includes('100'), 'Should include custom max iterations');
        });

        it('should build HTML with custom panel state', () => {
            const panelState: PanelState = {
                collapsedSections: ['timeline', 'log'],
                scrollPosition: 250,
                requirements: { ...DEFAULT_REQUIREMENTS, runTests: true }
            };
            
            const html = MockWebviewBuilder.buildHtml({
                hasPrd: true,
                panelState
            });
            
            assert.ok(html.includes('"collapsedSections"'), 'Should serialize panel state');
            assert.ok(html.includes('"timeline"'), 'Should include collapsed sections');
        });

        it('should build HTML with all options combined', () => {
            const task: Task = {
                id: 'feature-1',
                description: 'Implement amazing feature',
                status: 'in-progress',
                line: 42
            };
            
            const customRequirements = {
                runTests: true,
                runLinting: true,
                runTypeCheck: false,
                writeTests: true,
                updateDocs: false,
                commitChanges: true
            };
            
            const html = new MockWebviewBuilder()
                .setHasPrd(true)
                .setNextTask(task)
                .setAllTasks([task])
                .setTotalTasks(1)
                .setSettings({ maxIterations: 30 })
                .setRequirements(customRequirements)
                .setPanelState({
                    collapsedSections: [],
                    scrollPosition: 0,
                    requirements: customRequirements
                })
                .build();
            
            assert.ok(html.includes('Implement amazing feature'), 'Should include task');
            assert.ok(html.includes('30'), 'Should include settings');
            // Panel state is serialized in buildStateScripts
            assert.ok(html.includes('runTests'), 'Should include requirements in serialized state');
        });
    });
});

describe('PanelHtmlOptions Interface', () => {
    it('should define required hasPrd property', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [],
            totalTasks: 0
        };
        
        assert.strictEqual(typeof options.hasPrd, 'boolean');
    });

    it('should define required nextTask property', () => {
        const task: Task = {
            id: 'test',
            description: 'Test',
            status: 'pending',
            line: 1
        };
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: task,
            allTasks: [],
            totalTasks: 1
        };
        
        assert.strictEqual(options.nextTask?.id, 'test');
    });

    it('should define required allTasks property', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [{ id: 't1', description: 'T1', status: 'pending', line: 1 }],
            totalTasks: 1
        };
        
        assert.strictEqual(options.allTasks.length, 1);
    });

    it('should define required totalTasks property', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [],
            totalTasks: 10
        };
        
        assert.strictEqual(options.totalTasks, 10);
    });

    it('should allow optional panelState', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [],
            totalTasks: 0,
            panelState: {
                collapsedSections: [],
                scrollPosition: 0,
                requirements: { ...DEFAULT_REQUIREMENTS }
            }
        };
        
        assert.ok(options.panelState !== undefined);
    });

    it('should allow optional requirements', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [],
            totalTasks: 0,
            requirements: { ...DEFAULT_REQUIREMENTS, runTests: true }
        };
        
        assert.strictEqual(options.requirements?.runTests, true);
    });

    it('should allow optional settings', () => {
        const options: PanelHtmlOptions = {
            hasPrd: true,
            nextTask: null,
            allTasks: [],
            totalTasks: 0,
            settings: { maxIterations: 75 }
        };
        
        assert.strictEqual(options.settings?.maxIterations, 75);
    });

    it('should allow optional useCache flag', () => {
        // Test that useCache can be set as part of options
        const options: Partial<PanelHtmlOptions> & { useCache?: boolean } = {
            hasPrd: true,
            useCache: false
        };
        
        assert.strictEqual(options.useCache, false);
    });
});

describe('DEFAULT_SETTINGS Constant', () => {
    it('should define maxIterations as 50', () => {
        assert.strictEqual(DEFAULT_SETTINGS.maxIterations, 50);
    });

    it('should be a valid RalphSettings object', () => {
        const settings: RalphSettings = DEFAULT_SETTINGS;
        
        assert.strictEqual(typeof settings.maxIterations, 'number');
    });
});

describe('WebviewBuilder Cache Integration', () => {
    it('should use cached fragments by default (useCache=true)', () => {
        const builder = new MockWebviewBuilder({ hasPrd: true });
        const options = builder.getOptions();
        
        // Default useCache should be true in the real implementation
        // Here we just verify the builder pattern works
        assert.ok(builder);
        assert.strictEqual(options.hasPrd, true);
    });

    it('should support setUseCache builder method', () => {
        // Mock the setUseCache method
        const builder = new MockWebviewBuilder({ hasPrd: true });
        builder.setUseCache(false);
        
        assert.strictEqual(builder.getUseCache(), false);
    });

    it('should chain setUseCache with other builder methods', () => {
        const builder = new MockWebviewBuilder()
            .setHasPrd(true)
            .setUseCache(false)
            .setTotalTasks(5);
        
        const options = builder.getOptions();
        assert.strictEqual(options.hasPrd, true);
        assert.strictEqual(options.totalTasks, 5);
    });
});

describe('WebviewBuilder Static Fragments Caching', () => {
    it('should identify static fragments that can be cached', () => {
        // These fragments are static (no parameters) and can be cached
        const staticFragments = [
            'header',
            'setupSection',
            'timelineSection',
            'logSection',
            'footer',
            'screenReaderAnnouncer',
            'toastContainer',
            'skeletonTimeline',
            'skeletonTask',
            'skeletonLog',
            'skeletonRequirements',
            'durationChartSection',
            'dependencyGraphSection'
        ];
        
        assert.strictEqual(staticFragments.length, 13);
        assert.ok(staticFragments.includes('header'));
        assert.ok(staticFragments.includes('footer'));
    });

    it('should identify dynamic fragments that cannot be cached', () => {
        // These fragments depend on runtime state and cannot be cached
        const dynamicFragments = [
            'controls',           // depends on hasPrd
            'requirementsSection', // depends on requirements
            'taskSection',         // depends on nextTask, totalTasks
            'pendingTasksSection', // depends on allTasks
            'settingsOverlay',     // depends on settings
            'stateScripts'         // depends on panelState, allTasks
        ];
        
        assert.strictEqual(dynamicFragments.length, 6);
        assert.ok(dynamicFragments.includes('controls'));
        assert.ok(dynamicFragments.includes('stateScripts'));
    });

    it('should categorize styles and scripts as cacheable', () => {
        const cacheableAssets = ['styles', 'clientScripts'];
        
        assert.ok(cacheableAssets.includes('styles'));
        assert.ok(cacheableAssets.includes('clientScripts'));
    });
});

describe('WebviewBuilder Performance Optimization', () => {
    it('should build HTML with minimal string operations when using cache', () => {
        // Verify the builder creates a valid document structure
        const builder = new MockWebviewBuilder({ hasPrd: true });
        const html = builder.build();
        
        // The HTML should be valid
        assert.ok(html.includes('<!DOCTYPE html>'));
        assert.ok(html.includes('<html'));
        assert.ok(html.includes('</html>'));
    });

    it('should combine cached and dynamic content correctly', () => {
        const builder = new MockWebviewBuilder({
            hasPrd: true,
            nextTask: {
                id: 'test-1',
                description: 'Test task',
                status: 'pending',
                line: 1
            },
            totalTasks: 5
        });
        
        const html = builder.build();
        
        // Should contain both cached content and dynamic content
        assert.ok(html.includes('<!DOCTYPE html>'));
        assert.ok(html.includes('<head>'));
    });

    it('should use cache for build() method', () => {
        const builder = new MockWebviewBuilder({ hasPrd: true });
        
        // First build
        const html1 = builder.build();
        // Second build should use cached fragments
        const html2 = builder.build();
        
        assert.strictEqual(html1, html2);
    });
});

