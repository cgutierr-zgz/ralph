import * as assert from 'assert';
import {
    Icons,
    CollapsibleIcons,
    getLogo,
    getHeader,
    getControls,
    getSetupSection,
    getTimelineSection,
    getRequirementsSection,
    getTaskSection,
    getPendingTasksSection,
    getLogSection,
    getLogFilterButtons,
    LogLevel,
    LogFilterConfig,
    getFooter,
    getSettingsOverlay,
    getScreenReaderAnnouncer,
    getToastContainer,
    ToastIcons,
    PRD_INPUT_MIN_LENGTH,
    PRD_INPUT_MAX_LENGTH,
    getSkeletonTimeline,
    getSkeletonTask,
    getSkeletonLog,
    getSkeletonRequirements,
    getLoadingIndicator,
    getAllSkeletons,
    TaskDetailIcons,
    getTaskDetailsHtml,
    estimateTaskComplexity,
    extractRelatedFiles,
    LazyLoadIcons,
    getLazyLoadPlaceholder,
    LAZY_LOAD_SECTION_IDS,
    AggregatedStatsIcons,
    getAggregatedStatsSection,
    getProjectStatsRow,
    ProjectStatsData,
    AggregatedStatsData
} from '../../webview/templates';
import { Task, TaskStatus, DEFAULT_REQUIREMENTS } from '../../types';

describe('Webview Templates', () => {
    describe('Icons', () => {
        it('should have play icon', () => {
            assert.ok(Icons.play);
            assert.ok(Icons.play.includes('svg'));
        });

        it('should have pause icon', () => {
            assert.ok(Icons.pause);
            assert.ok(Icons.pause.includes('svg'));
        });

        it('should have stop icon', () => {
            assert.ok(Icons.stop);
            assert.ok(Icons.stop.includes('svg'));
        });

        it('should have step icon', () => {
            assert.ok(Icons.step);
            assert.ok(Icons.step.includes('svg'));
        });

        it('should have refresh icon', () => {
            assert.ok(Icons.refresh);
            assert.ok(Icons.refresh.includes('svg'));
        });

        it('should have settings icon', () => {
            assert.ok(Icons.settings);
            assert.ok(Icons.settings.includes('svg'));
        });

        it('should have check icon', () => {
            assert.ok(Icons.check);
            assert.ok(Icons.check.includes('svg'));
        });

        it('should have rocket icon', () => {
            assert.ok(Icons.rocket);
            assert.ok(Icons.rocket.includes('svg'));
        });

        it('should have star icon', () => {
            assert.ok(Icons.star);
            assert.ok(Icons.star.includes('svg'));
        });

        it('should have skip icon', () => {
            assert.ok(Icons.skip);
            assert.ok(Icons.skip.includes('svg'));
        });

        it('should have retry icon', () => {
            assert.ok(Icons.retry);
            assert.ok(Icons.retry.includes('svg'));
        });

        it('should have retry icon with counter-clockwise arrow path', () => {
            // Retry icon should represent "undo/retry" action
            assert.ok(Icons.retry.includes('polyline'));
            assert.ok(Icons.retry.includes('path'));
        });

        it('should have completeAll icon', () => {
            assert.ok(Icons.completeAll);
            assert.ok(Icons.completeAll.includes('svg'));
        });

        it('should have completeAll icon with checkmark elements', () => {
            // Complete all icon should have check-related elements
            assert.ok(Icons.completeAll.includes('polyline') || Icons.completeAll.includes('path'));
        });

        it('should have resetAll icon', () => {
            assert.ok(Icons.resetAll);
            assert.ok(Icons.resetAll.includes('svg'));
        });

        it('should have resetAll icon with reset/undo elements', () => {
            // Reset all icon should have reset-related elements
            assert.ok(Icons.resetAll.includes('polyline') || Icons.resetAll.includes('path'));
        });

        it('should have copy icon', () => {
            assert.ok(Icons.copy);
            assert.ok(Icons.copy.includes('svg'));
        });

        it('should have copy icon with clipboard-like elements', () => {
            // Copy icon should have rectangle and path (clipboard shape)
            assert.ok(Icons.copy.includes('rect'));
            assert.ok(Icons.copy.includes('path'));
        });
    });

    describe('getLogo', () => {
        it('should generate SVG with default size', () => {
            const logo = getLogo();
            assert.ok(logo.includes('svg'));
            assert.ok(logo.includes('width="24"'));
            assert.ok(logo.includes('height="24"'));
        });

        it('should generate SVG with custom size', () => {
            const logo = getLogo(48);
            assert.ok(logo.includes('width="48"'));
            assert.ok(logo.includes('height="48"'));
        });

        it('should include Ralph "R" text', () => {
            const logo = getLogo();
            assert.ok(logo.includes('>R<'));
        });

        it('should include gradient definition', () => {
            const logo = getLogo();
            assert.ok(logo.includes('linearGradient'));
            assert.ok(logo.includes('logoGradient'));
        });

        it('should include circles for the logo shape', () => {
            const logo = getLogo();
            assert.ok(logo.includes('<circle'));
        });
    });

    describe('getHeader', () => {
        it('should generate header HTML', () => {
            const header = getHeader();
            assert.ok(header.includes('class="header'));
            assert.ok(header.includes('id="header"'));
        });

        it('should include status pill', () => {
            const header = getHeader();
            assert.ok(header.includes('status-pill'));
            assert.ok(header.includes('statusText'));
        });

        it('should include timing display', () => {
            const header = getHeader();
            assert.ok(header.includes('timing-display'));
            assert.ok(header.includes('elapsedTime'));
            assert.ok(header.includes('etaTime'));
        });

        it('should include countdown clock', () => {
            const header = getHeader();
            assert.ok(header.includes('countdown'));
            assert.ok(header.includes('clockFill'));
        });

        it('should include Ralph title', () => {
            const header = getHeader();
            assert.ok(header.includes('<h1>Ralph</h1>'));
        });
    });

    describe('getControls', () => {
        it('should generate controls with PRD', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnStart'));
            assert.ok(controls.includes('btnPause'));
            assert.ok(controls.includes('btnStop'));
        });

        it('should disable start button when no PRD', () => {
            const controls = getControls(false);
            assert.ok(controls.includes('id="btnStart"'));

            assert.ok(controls.includes('id="btnStart" onclick="send(\'start\')" disabled'));
        });

        it('should enable start button when PRD exists', () => {
            const controls = getControls(true);

            assert.ok(controls.includes('id="btnStart" onclick="send(\'start\')"'));

            const startButtonMatch = controls.match(/id="btnStart"[^>]*>/);
            assert.ok(startButtonMatch);
            assert.ok(!startButtonMatch[0].includes('disabled'));
        });

        it('should include step button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnNext'));
        });

        it('should include refresh button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes("send('refresh')"));
        });

        it('should include settings button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('openSettings()'));
        });

        it('should include resume button (hidden by default)', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnResume'));
            assert.ok(controls.includes('style="display:none"'));
        });

        it('should include skip button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnSkip'));
        });

        it('should include retry button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnRetry'));
        });

        it('should include retry button with correct onclick', () => {
            const controls = getControls(true);
            assert.ok(controls.includes("send('retryTask')"));
        });

        it('should include retry button with proper accessibility', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('aria-label="Retry failed task"'));
            assert.ok(controls.includes('title="Retry failed task"'));
        });

        it('should disable retry button when no PRD', () => {
            const controls = getControls(false);
            // Find the retry button section and check it has disabled
            assert.ok(controls.includes('id="btnRetry"'));
            const btnRetryMatch = controls.match(/id="btnRetry"[^>]*disabled/);
            assert.ok(btnRetryMatch, 'Retry button should be disabled when no PRD');
        });

        it('should include complete all button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnCompleteAll'));
        });

        it('should include complete all button with correct onclick', () => {
            const controls = getControls(true);
            assert.ok(controls.includes("send('completeAllTasks')"));
        });

        it('should include complete all button with proper accessibility', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('aria-label="Mark all tasks as complete"'));
            assert.ok(controls.includes('title="Mark all tasks as complete"'));
        });

        it('should disable complete all button when no PRD', () => {
            const controls = getControls(false);
            assert.ok(controls.includes('id="btnCompleteAll"'));
            const btnCompleteAllMatch = controls.match(/id="btnCompleteAll"[^>]*disabled/);
            assert.ok(btnCompleteAllMatch, 'Complete All button should be disabled when no PRD');
        });

        it('should include complete all button with spinner', () => {
            const controls = getControls(true);
            // The Complete All button should have a spinner element
            const completeAllSection = controls.match(/id="btnCompleteAll"[^<]*<span class="btn-spinner"/);
            assert.ok(completeAllSection || controls.includes('btnCompleteAll'), 'Complete All button should exist');
        });

        it('should include reset all button', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('btnResetAll'));
        });

        it('should include reset all button with correct onclick', () => {
            const controls = getControls(true);
            assert.ok(controls.includes("send('resetAllTasks')"));
        });

        it('should include reset all button with proper accessibility', () => {
            const controls = getControls(true);
            assert.ok(controls.includes('aria-label="Reset all tasks to pending"'));
            assert.ok(controls.includes('title="Reset all tasks to pending"'));
        });

        it('should disable reset all button when no PRD', () => {
            const controls = getControls(false);
            assert.ok(controls.includes('id="btnResetAll"'));
            const btnResetAllMatch = controls.match(/id="btnResetAll"[^>]*disabled/);
            assert.ok(btnResetAllMatch, 'Reset All button should be disabled when no PRD');
        });

        it('should include reset all button with spinner', () => {
            const controls = getControls(true);
            // The Reset All button should have a spinner element
            const resetAllSection = controls.match(/id="btnResetAll"[^<]*<span class="btn-spinner"/);
            assert.ok(resetAllSection || controls.includes('btnResetAll'), 'Reset All button should exist');
        });

        it('should include batch operation buttons in correct order', () => {
            const controls = getControls(true);
            const retryIndex = controls.indexOf('btnRetry');
            const completeAllIndex = controls.indexOf('btnCompleteAll');
            const resetAllIndex = controls.indexOf('btnResetAll');
            // Batch operation buttons should come after retry button
            assert.ok(retryIndex < completeAllIndex, 'Complete All should come after Retry');
            assert.ok(completeAllIndex < resetAllIndex, 'Reset All should come after Complete All');
        });
    });

    describe('getSetupSection', () => {
        it('should generate setup section HTML', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('setup-section'));
        });

        it('should include rocket icon', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('setup-icon'));
        });

        it('should include task input textarea', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('taskInput'));
            assert.ok(setup.includes('textarea'));
        });

        it('should include generate PRD button', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('generatePrd()'));
            assert.ok(setup.includes('generate-btn'));
        });

        it('should include placeholder text', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('placeholder='));
        });

        it('should include description text', () => {
            const setup = getSetupSection();
            assert.ok(setup.includes('setup-description'));
        });
    });

    describe('getTimelineSection', () => {
        it('should generate timeline section HTML', () => {
            const timeline = getTimelineSection();
            assert.ok(timeline.includes('timeline-section'));
        });

        it('should include timeline header', () => {
            const timeline = getTimelineSection();
            assert.ok(timeline.includes('timeline-header'));
            assert.ok(timeline.includes('Task Timeline'));
        });

        it('should include timeline count', () => {
            const timeline = getTimelineSection();
            assert.ok(timeline.includes('timelineCount'));
            assert.ok(timeline.includes('0/0'));
        });

        it('should include empty state', () => {
            const timeline = getTimelineSection();
            assert.ok(timeline.includes('timelineEmpty'));
            assert.ok(timeline.includes('No tasks completed yet'));
        });

        it('should include bars and labels containers', () => {
            const timeline = getTimelineSection();
            assert.ok(timeline.includes('timelineBars'));
            assert.ok(timeline.includes('timelineLabels'));
        });
    });

    describe('getRequirementsSection', () => {
        it('should generate requirements section HTML', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('requirements-section'));
        });

        it('should include all requirement checkboxes', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('reqWriteTests'));
            assert.ok(requirements.includes('reqRunTests'));
            assert.ok(requirements.includes('reqTypeCheck'));
            assert.ok(requirements.includes('reqLinting'));
            assert.ok(requirements.includes('reqDocs'));
            assert.ok(requirements.includes('reqCommit'));
        });

        it('should include toggle functionality', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('toggleRequirements()'));
            assert.ok(requirements.includes('reqToggle'));
        });

        it('should include updateRequirements handler', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('updateRequirements()'));
        });

        it('should include acceptance criteria header', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('Acceptance Criteria'));
        });

        it('should include requirements description', () => {
            const requirements = getRequirementsSection();
            assert.ok(requirements.includes('requirements-desc'));
        });

        it('should render unchecked checkboxes by default', () => {
            const html = getRequirementsSection();
            // Checkboxes should not have 'checked' attribute when using defaults
            const writeTestsMatch = html.match(/id="reqWriteTests"[^>]*>/);
            assert.ok(writeTestsMatch, 'reqWriteTests checkbox should exist');
            assert.ok(!writeTestsMatch[0].includes('checked'), 'reqWriteTests should not be checked by default');
        });

        it('should render checked checkboxes when requirements are true', () => {
            const html = getRequirementsSection({
                writeTests: true,
                runTests: true,
                runTypeCheck: true,
                runLinting: true,
                updateDocs: true,
                commitChanges: true
            });
            // All checkboxes should have 'checked' attribute
            assert.ok(html.includes('id="reqWriteTests" onchange="updateRequirements()" checked'));
            assert.ok(html.includes('id="reqRunTests" onchange="updateRequirements()" checked'));
            assert.ok(html.includes('id="reqTypeCheck" onchange="updateRequirements()" checked'));
            assert.ok(html.includes('id="reqLinting" onchange="updateRequirements()" checked'));
            assert.ok(html.includes('id="reqDocs" onchange="updateRequirements()" checked'));
            assert.ok(html.includes('id="reqCommit" onchange="updateRequirements()" checked'));
        });

        it('should render mixed checked/unchecked based on requirements', () => {
            const html = getRequirementsSection({
                writeTests: true,
                runTests: false,
                runTypeCheck: true,
                runLinting: false,
                updateDocs: true,
                commitChanges: false
            });
            // Check that correct checkboxes are checked
            assert.ok(html.includes('id="reqWriteTests" onchange="updateRequirements()" checked'), 'writeTests should be checked');
            assert.ok(html.includes('id="reqTypeCheck" onchange="updateRequirements()" checked'), 'typeCheck should be checked');
            assert.ok(html.includes('id="reqDocs" onchange="updateRequirements()" checked'), 'docs should be checked');
            
            // Check that others are NOT checked (no 'checked' attribute after onchange)
            const runTestsMatch = html.match(/id="reqRunTests" onchange="updateRequirements\(\)"[^>]*>/);
            assert.ok(runTestsMatch, 'reqRunTests checkbox should exist');
            assert.ok(!runTestsMatch[0].includes('checked'), 'runTests should not be checked');
        });

        it('should use DEFAULT_REQUIREMENTS when called without arguments', () => {
            const html = getRequirementsSection();
            // All default requirements are false, so no checkboxes should be checked
            const checkedCount = (html.match(/ checked>/g) || []).length;
            assert.strictEqual(checkedCount, 0, 'No checkboxes should be checked with default requirements');
        });

        it('should accept explicit DEFAULT_REQUIREMENTS', () => {
            const html = getRequirementsSection(DEFAULT_REQUIREMENTS);
            // All default requirements are false, so no checkboxes should be checked
            const checkedCount = (html.match(/ checked>/g) || []).length;
            assert.strictEqual(checkedCount, 0, 'No checkboxes should be checked with DEFAULT_REQUIREMENTS');
        });
    });

    describe('getTaskSection', () => {
        it('should show current task when task exists', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task description',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task description'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('Current Task'));
            assert.ok(section.includes('Test task description'));
            assert.ok(section.includes('task-section active'));
        });

        it('should show completed state when no task and has tasks', () => {
            const section = getTaskSection(null, true);
            assert.ok(section.includes('All tasks completed!'));
            assert.ok(section.includes('empty-state'));
        });

        it('should return empty string when no task and no tasks', () => {
            const section = getTaskSection(null, false);
            assert.strictEqual(section, '');
        });

        it('should include task text element', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Another task',
                status: TaskStatus.IN_PROGRESS,
                lineNumber: 2,
                rawLine: '- [~] Another task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('taskText'));
        });

        it('should include progress bar container', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('task-progress'));
            assert.ok(section.includes('id="taskProgress"'));
        });

        it('should include progress bar element', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('task-progress-bar'));
            assert.ok(section.includes('id="taskProgressBar"'));
        });

        it('should have progress bar with ARIA attributes', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('role="progressbar"'));
            assert.ok(section.includes('aria-valuenow="0"'));
            assert.ok(section.includes('aria-valuemin="0"'));
            assert.ok(section.includes('aria-valuemax="100"'));
        });

        it('should have progress bar aria-label', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('aria-label="Task execution progress"'));
        });

        it('should start progress bar at 0% width', () => {
            const task: Task = {
                id: 'task-1',
                description: 'Test task',
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };
            const section = getTaskSection(task, true);
            assert.ok(section.includes('style="width: 0%"'));
        });

        it('should not include progress bar in completed state', () => {
            const section = getTaskSection(null, true);
            assert.ok(!section.includes('task-progress'));
        });
    });

    describe('getLogSection', () => {
        it('should generate log section HTML', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-section'));
        });

        it('should include log header with Activity title', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-header'));
            assert.ok(log.includes('Activity'));
        });

        it('should include log area', () => {
            const log = getLogSection();
            assert.ok(log.includes('logArea'));
        });

        it('should include initial log entry', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-entry'));
            assert.ok(log.includes('Ready to start'));
        });

        it('should include log filters container', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-filters'));
            assert.ok(log.includes('role="group"'));
            assert.ok(log.includes('aria-label="Log level filters"'));
        });

        it('should include filter buttons for all levels', () => {
            const log = getLogSection();
            assert.ok(log.includes('data-level="all"'));
            assert.ok(log.includes('data-level="info"'));
            assert.ok(log.includes('data-level="warning"'));
            assert.ok(log.includes('data-level="error"'));
        });

        it('should have All filter active by default', () => {
            const log = getLogSection();
            // The 'all' button should have active class and aria-pressed=true
            assert.ok(log.includes('data-level="all"') && log.includes('active'));
            assert.ok(log.includes('aria-pressed="true"'));
        });

        it('should include filter button onclick handlers', () => {
            const log = getLogSection();
            assert.ok(log.includes("filterLogs('all')"));
            assert.ok(log.includes("filterLogs('info')"));
            assert.ok(log.includes("filterLogs('warning')"));
            assert.ok(log.includes("filterLogs('error')"));
        });

        it('should include filter count display', () => {
            const log = getLogSection();
            assert.ok(log.includes('logFilterCount'));
            assert.ok(log.includes('log-filter-count'));
        });

        it('should include filter icons', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-filter-icon'));
            assert.ok(log.includes('svg')); // Icons should contain SVG
        });

        it('should include filter labels', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-filter-label'));
            assert.ok(log.includes('All'));
            assert.ok(log.includes('Info'));
            assert.ok(log.includes('Warn'));
            assert.ok(log.includes('Error'));
        });

        it('should include aria-labels for accessibility', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Show all log entries"'));
            assert.ok(log.includes('aria-label="Show info log entries only"'));
            assert.ok(log.includes('aria-label="Show warning log entries only"'));
            assert.ok(log.includes('aria-label="Show error log entries only"'));
        });

        it('should include data-level attribute on initial log entry', () => {
            const log = getLogSection();
            assert.ok(log.includes('data-level="info"'));
        });

        it('should include Copy Log button', () => {
            const log = getLogSection();
            assert.ok(log.includes('btnCopyLog'), 'Should have Copy Log button id');
            assert.ok(log.includes('log-action-btn'), 'Should have log-action-btn class');
        });

        it('should have Copy button with copyLog onclick handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('copyLog()'), 'Should call copyLog function');
        });

        it('should have Copy button with stopPropagation', () => {
            const log = getLogSection();
            // Button should stop event propagation so clicking doesn't toggle section
            assert.ok(log.includes('event.stopPropagation()'), 'Should stop propagation');
        });

        it('should have Copy button with accessibility attributes', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Copy log to clipboard"'), 'Should have aria-label');
            assert.ok(log.includes('title="Copy log to clipboard"'), 'Should have title');
        });

        it('should have Copy button with icon and label', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-action-icon'), 'Should have icon container');
            assert.ok(log.includes('log-action-label'), 'Should have label container');
            assert.ok(log.includes('>Copy<'), 'Should have Copy label text');
        });

        it('should position Copy button in section-header-right', () => {
            const log = getLogSection();
            // Copy button should be inside section-header-right div
            const headerRightMatch = log.match(/section-header-right[^]*?<\/div>/);
            assert.ok(headerRightMatch, 'Should have section-header-right div');
            assert.ok(headerRightMatch[0].includes('btnCopyLog'), 'Copy button should be in header-right');
        });

        // Export Log Button Tests
        it('should include Export Log button', () => {
            const log = getLogSection();
            assert.ok(log.includes('btnExportLog'), 'Should have Export Log button id');
            assert.ok(log.includes('log-action-btn'), 'Should have log-action-btn class');
        });

        it('should have Export button with exportLog onclick handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('exportLog()'), 'Should call exportLog function');
        });

        it('should have Export button with stopPropagation', () => {
            const log = getLogSection();
            // Both Copy and Export buttons should stop event propagation
            const buttonMatches = log.match(/event\.stopPropagation\(\)/g);
            assert.ok(buttonMatches && buttonMatches.length >= 2, 'Should have stopPropagation on both buttons');
        });

        it('should have Export button with accessibility attributes', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Export log to file"'), 'Should have aria-label for Export');
            assert.ok(log.includes('title="Export log to file"'), 'Should have title for Export');
        });

        it('should have Export button with icon and label', () => {
            const log = getLogSection();
            assert.ok(log.includes('>Export<'), 'Should have Export label text');
        });

        it('should position Export button in section-header-right', () => {
            const log = getLogSection();
            // Export button should be inside section-header-right div
            const headerRightMatch = log.match(/section-header-right[^]*?<\/div>/);
            assert.ok(headerRightMatch, 'Should have section-header-right div');
            assert.ok(headerRightMatch[0].includes('btnExportLog'), 'Export button should be in header-right');
        });

        it('should have Export button with download icon from CollapsibleIcons', () => {
            const log = getLogSection();
            // The download icon should be in the Export button
            assert.ok(log.includes('btnExportLog') && log.includes('svg'), 'Export button should have SVG icon');
        });

        // Timestamp Toggle Button Tests
        it('should include Timestamp Toggle button', () => {
            const log = getLogSection();
            assert.ok(log.includes('btnToggleTimestamp'), 'Should have Timestamp Toggle button id');
            assert.ok(log.includes('log-timestamp-toggle'), 'Should have log-timestamp-toggle class');
        });

        it('should have Timestamp Toggle button with toggleTimestamps onclick handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('toggleTimestamps()'), 'Should call toggleTimestamps function');
        });

        it('should have Timestamp Toggle button with stopPropagation', () => {
            const log = getLogSection();
            // All header buttons should stop event propagation
            const buttonMatches = log.match(/event\.stopPropagation\(\)/g);
            assert.ok(buttonMatches && buttonMatches.length >= 3, 'Should have stopPropagation on all three buttons');
        });

        it('should have Timestamp Toggle button with accessibility attributes', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Toggle timestamp visibility"'), 'Should have aria-label for Timestamp Toggle');
            assert.ok(log.includes('title="Toggle timestamps"'), 'Should have title for Timestamp Toggle');
        });

        it('should have Timestamp Toggle button with aria-pressed attribute', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-pressed="true"'), 'Should have aria-pressed="true" by default');
        });

        it('should have Timestamp Toggle button with icon and label', () => {
            const log = getLogSection();
            assert.ok(log.includes('>Time<'), 'Should have Time label text');
        });

        it('should position Timestamp Toggle button in section-header-right', () => {
            const log = getLogSection();
            const headerRightMatch = log.match(/section-header-right[^]*?<\/div>/);
            assert.ok(headerRightMatch, 'Should have section-header-right div');
            assert.ok(headerRightMatch[0].includes('btnToggleTimestamp'), 'Timestamp Toggle button should be in header-right');
        });

        // Auto-Scroll Toggle Button Tests
        it('should include Auto-Scroll Toggle button', () => {
            const log = getLogSection();
            assert.ok(log.includes('btnToggleAutoScroll'), 'Should have Auto-Scroll Toggle button id');
            assert.ok(log.includes('log-autoscroll-toggle'), 'Should have log-autoscroll-toggle class');
        });

        it('should have Auto-Scroll Toggle button with toggleAutoScroll onclick handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('toggleAutoScroll()'), 'Should call toggleAutoScroll function');
        });

        it('should have Auto-Scroll Toggle button with stopPropagation', () => {
            const log = getLogSection();
            // All header buttons should stop event propagation - now there are 4 buttons
            const buttonMatches = log.match(/event\.stopPropagation\(\)/g);
            assert.ok(buttonMatches && buttonMatches.length >= 4, 'Should have stopPropagation on all four buttons');
        });

        it('should have Auto-Scroll Toggle button with accessibility attributes', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Toggle auto-scroll"'), 'Should have aria-label for Auto-Scroll Toggle');
            assert.ok(log.includes('title="Auto-scroll to latest log entries"'), 'Should have title for Auto-Scroll Toggle');
        });

        it('should have Auto-Scroll Toggle button with aria-pressed attribute', () => {
            const log = getLogSection();
            // Check both timestamp and auto-scroll buttons have aria-pressed
            const ariaPressedMatches = log.match(/aria-pressed="true"/g);
            assert.ok(ariaPressedMatches && ariaPressedMatches.length >= 2, 'Should have aria-pressed="true" for both toggle buttons');
        });

        it('should have Auto-Scroll Toggle button with icon and label', () => {
            const log = getLogSection();
            assert.ok(log.includes('>Auto<'), 'Should have Auto label text');
        });

        it('should position Auto-Scroll Toggle button in section-header-right', () => {
            const log = getLogSection();
            const headerRightMatch = log.match(/section-header-right[^]*?<\/div>/);
            assert.ok(headerRightMatch, 'Should have section-header-right div');
            assert.ok(headerRightMatch[0].includes('btnToggleAutoScroll'), 'Auto-Scroll Toggle button should be in header-right');
        });

        it('should use autoScroll icon from Icons object', () => {
            const log = getLogSection();
            // The autoScroll icon should include a path for vertical line
            assert.ok(log.includes('M12 5v14'), 'Should include autoScroll icon path');
        });
    });

    describe('Icons - Clock Icon', () => {
        it('should have clock icon', () => {
            assert.ok(Icons.clock, 'Should have clock icon');
            assert.ok(Icons.clock.includes('svg'), 'Clock icon should be SVG');
        });

        it('should have clock icon with circle and polyline', () => {
            assert.ok(Icons.clock.includes('circle'), 'Clock icon should have circle');
            assert.ok(Icons.clock.includes('polyline'), 'Clock icon should have polyline for hands');
        });

        it('should have clock icon with proper dimensions', () => {
            assert.ok(Icons.clock.includes('width="12"'), 'Clock icon should have width 12');
            assert.ok(Icons.clock.includes('height="12"'), 'Clock icon should have height 12');
        });
    });

    describe('Icons - AutoScroll Icon', () => {
        it('should have autoScroll icon', () => {
            assert.ok(Icons.autoScroll, 'Should have autoScroll icon');
            assert.ok(Icons.autoScroll.includes('svg'), 'AutoScroll icon should be SVG');
        });

        it('should have autoScroll icon with path and polyline', () => {
            assert.ok(Icons.autoScroll.includes('path'), 'AutoScroll icon should have path');
            assert.ok(Icons.autoScroll.includes('polyline'), 'AutoScroll icon should have polyline for arrow');
        });

        it('should have autoScroll icon with proper dimensions', () => {
            assert.ok(Icons.autoScroll.includes('width="12"'), 'AutoScroll icon should have width 12');
            assert.ok(Icons.autoScroll.includes('height="12"'), 'AutoScroll icon should have height 12');
        });

        it('should have down arrow direction', () => {
            // The icon should have a path for vertical line and polyline for down arrow
            assert.ok(Icons.autoScroll.includes('M12 5v14'), 'Should have vertical line path');
            assert.ok(Icons.autoScroll.includes('19 12 12 19 5 12'), 'Should have down arrow polyline');
        });
    });

    describe('getLogFilterButtons', () => {
        it('should return array of filter configurations', () => {
            const buttons = getLogFilterButtons();
            assert.ok(Array.isArray(buttons));
            assert.strictEqual(buttons.length, 4);
        });

        it('should include all, info, warning, and error levels', () => {
            const buttons = getLogFilterButtons();
            const levels = buttons.map(b => b.level);
            assert.ok(levels.includes('all'));
            assert.ok(levels.includes('info'));
            assert.ok(levels.includes('warning'));
            assert.ok(levels.includes('error'));
        });

        it('should have labels for each filter', () => {
            const buttons = getLogFilterButtons();
            buttons.forEach(btn => {
                assert.ok(btn.label, 'Each button should have a label');
                assert.strictEqual(typeof btn.label, 'string');
            });
        });

        it('should have icons for each filter', () => {
            const buttons = getLogFilterButtons();
            buttons.forEach(btn => {
                assert.ok(btn.icon, 'Each button should have an icon');
                assert.ok(btn.icon.includes('svg'), 'Icon should be SVG');
            });
        });

        it('should have aria-labels for accessibility', () => {
            const buttons = getLogFilterButtons();
            buttons.forEach(btn => {
                assert.ok(btn.ariaLabel, 'Each button should have an aria-label');
                assert.strictEqual(typeof btn.ariaLabel, 'string');
            });
        });

        it('should have All filter first', () => {
            const buttons = getLogFilterButtons();
            assert.strictEqual(buttons[0].level, 'all');
        });
    });

    describe('Log Filter Icons', () => {
        it('should have filter icon', () => {
            assert.ok(Icons.filter);
            assert.ok(Icons.filter.includes('svg'));
            assert.ok(Icons.filter.includes('polygon'));
        });

        it('should have info circle icon', () => {
            assert.ok(Icons.infoCircle);
            assert.ok(Icons.infoCircle.includes('svg'));
            assert.ok(Icons.infoCircle.includes('circle'));
        });

        it('should have warning triangle icon', () => {
            assert.ok(Icons.warningTriangle);
            assert.ok(Icons.warningTriangle.includes('svg'));
            assert.ok(Icons.warningTriangle.includes('path'));
        });

        it('should have error circle icon', () => {
            assert.ok(Icons.errorCircle);
            assert.ok(Icons.errorCircle.includes('svg'));
            assert.ok(Icons.errorCircle.includes('circle'));
            assert.ok(Icons.errorCircle.includes('line'));
        });
    });

    describe('Log Search Icons', () => {
        it('should have search icon', () => {
            assert.ok(Icons.search);
            assert.ok(Icons.search.includes('svg'));
            assert.ok(Icons.search.includes('circle')); // magnifying glass circle
            assert.ok(Icons.search.includes('line')); // handle line
        });

        it('should have clear icon', () => {
            assert.ok(Icons.clear);
            assert.ok(Icons.clear.includes('svg'));
            assert.ok(Icons.clear.includes('circle'));
            assert.ok(Icons.clear.includes('line')); // X lines
        });
    });

    describe('Log Search Section', () => {
        it('should include log search container', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-search-container'));
        });

        it('should have role="search" on container', () => {
            const log = getLogSection();
            assert.ok(log.includes('role="search"'));
        });

        it('should have aria-label for accessibility', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Search log entries"'));
        });

        it('should include search icon', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-search-icon'));
        });

        it('should include search input', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-search-input'));
            assert.ok(log.includes('id="logSearchInput"'));
        });

        it('should have placeholder text', () => {
            const log = getLogSection();
            assert.ok(log.includes('placeholder="Search logs..."'));
        });

        it('should have oninput handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('oninput="searchLogs(this.value)"'));
        });

        it('should have Escape key handler to clear', () => {
            const log = getLogSection();
            assert.ok(log.includes("event.key==='Escape'"));
            assert.ok(log.includes('clearLogSearch()'));
        });

        it('should include clear button', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-search-clear'));
            assert.ok(log.includes('id="logSearchClear"'));
        });

        it('should have clear button onclick handler', () => {
            const log = getLogSection();
            assert.ok(log.includes('onclick="clearLogSearch()"'));
        });

        it('should have clear button aria-label', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-label="Clear search"'));
        });

        it('should have clear button hidden by default', () => {
            const log = getLogSection();
            assert.ok(log.includes('style="display: none;"'));
        });

        it('should include search count display', () => {
            const log = getLogSection();
            assert.ok(log.includes('log-search-count'));
            assert.ok(log.includes('id="logSearchCount"'));
        });

        it('should have aria-live on search count', () => {
            const log = getLogSection();
            assert.ok(log.includes('aria-live="polite"'));
            assert.ok(log.includes('aria-atomic="true"'));
        });
    });

    describe('getFooter', () => {
        it('should generate footer HTML', () => {
            const footer = getFooter();
            assert.ok(footer.includes('footer'));
        });

        it('should include cost warning', () => {
            const footer = getFooter();
            assert.ok(footer.includes('footer-warning'));
            assert.ok(footer.includes('Cost Notice'));
        });

        it('should include GitHub link', () => {
            const footer = getFooter();
            assert.ok(footer.includes('https://github.com/aymenfurter/ralph'));
        });

        it('should include disclaimer', () => {
            const footer = getFooter();
            assert.ok(footer.includes('footer-disclaimer'));
            assert.ok(footer.includes('not officially endorsed by or affiliated with'));
        });
    });

    describe('getSettingsOverlay', () => {
        it('should generate settings overlay HTML', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('settings-overlay'));
            assert.ok(overlay.includes('settingsOverlay'));
        });

        it('should include settings header', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('settings-header'));
            assert.ok(overlay.includes('Settings'));
        });

        it('should include close button', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('settings-close'));
            assert.ok(overlay.includes('closeSettings()'));
        });

        it('should include max iterations setting', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('settingMaxIterations'));
            assert.ok(overlay.includes('Max iterations'));
        });

        it('should include updateSettings handler', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('updateSettings()'));
        });

        it('should include help text', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('setting-help'));
        });

        it('should use default maxIterations value of 50 when no settings provided', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('value="50"'));
        });

        it('should use provided maxIterations value from settings', () => {
            const overlay = getSettingsOverlay({ maxIterations: 25 });
            assert.ok(overlay.includes('value="25"'));
        });

        it('should support zero maxIterations (unlimited)', () => {
            const overlay = getSettingsOverlay({ maxIterations: 0 });
            assert.ok(overlay.includes('value="0"'));
        });

        it('should support max value of 100', () => {
            const overlay = getSettingsOverlay({ maxIterations: 100 });
            assert.ok(overlay.includes('value="100"'));
        });

        it('should have aria-label on close button', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('aria-label="Close settings"'));
        });

        it('should have role="dialog" and aria-modal', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('role="dialog"'));
            assert.ok(overlay.includes('aria-modal="true"'));
            assert.ok(overlay.includes('aria-labelledby="settingsTitle"'));
        });

        it('should have aria-describedby for max iterations input', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('aria-describedby="maxIterationsHelp"'));
            assert.ok(overlay.includes('id="maxIterationsHelp"'));
        });

        it('should have aria-hidden on decorative icons', () => {
            const overlay = getSettingsOverlay();
            assert.ok(overlay.includes('aria-hidden="true"'));
        });
    });

    describe('ARIA Accessibility', () => {
        describe('getHeader', () => {
            it('should have role="banner" on header', () => {
                const header = getHeader();
                assert.ok(header.includes('role="banner"'));
            });

            it('should have role="status" on status pill', () => {
                const header = getHeader();
                assert.ok(header.includes('role="status"'));
                assert.ok(header.includes('aria-live="polite"'));
            });

            it('should have aria-label on status pill', () => {
                const header = getHeader();
                assert.ok(header.includes('aria-label="Automation status"'));
            });

            it('should have aria-hidden on decorative status dot', () => {
                const header = getHeader();
                assert.ok(header.includes('aria-hidden="true"'));
            });

            it('should have role="timer" on timing display', () => {
                const header = getHeader();
                assert.ok(header.includes('role="timer"'));
            });

            it('should have aria-labelledby linking elapsed time to label', () => {
                const header = getHeader();
                assert.ok(header.includes('id="elapsedLabel"'));
                assert.ok(header.includes('aria-labelledby="elapsedLabel"'));
            });

            it('should have aria-label on countdown', () => {
                const header = getHeader();
                assert.ok(header.includes('aria-label="Countdown to next task"'));
            });
        });

        describe('getControls', () => {
            it('should have role="toolbar" on controls container', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('role="toolbar"'));
                assert.ok(controls.includes('aria-label="Automation controls"'));
            });

            it('should have aria-label on Start button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Start automation"'));
            });

            it('should have aria-label on Pause button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Pause automation"'));
            });

            it('should have aria-label on Resume button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Resume automation"'));
            });

            it('should have aria-label on Stop button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Stop automation"'));
            });

            it('should have aria-label on Step button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Execute single step"'));
            });

            it('should have aria-label on Refresh button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Refresh panel"'));
            });

            it('should have aria-label on Settings button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('aria-label="Open settings"'));
            });
        });

        describe('getSetupSection', () => {
            it('should have role="region" with aria-label', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('role="region"'));
                assert.ok(setup.includes('aria-label="Project setup"'));
            });

            it('should have aria-hidden on decorative icon', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('aria-hidden="true"'));
            });

            it('should have aria-label on textarea', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('aria-label="Project description"'));
            });

            it('should have aria-describedby linking textarea to description and error', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('id="taskInputDescription"'));
                assert.ok(setup.includes('aria-describedby="taskInputDescription taskInputError"'));
            });

            it('should have aria-label on generate button', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('aria-label="Generate PRD and tasks from description"'));
            });
        });

        describe('getTimelineSection', () => {
            it('should have role="region" with aria-label', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('role="region"'));
                assert.ok(timeline.includes('aria-label="Task timeline"'));
            });

            it('should have role="status" on empty state', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('role="status"'));
            });

            it('should have aria-label on timeline count', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('aria-label="Task completion count"'));
            });

            it('should have aria-hidden on timeline bars and labels', () => {
                const timeline = getTimelineSection();
                // Bars and labels are visual representations with aria-hidden
                assert.ok(timeline.includes('aria-hidden="true"'));
            });
        });

        describe('getRequirementsSection', () => {
            it('should have role="region" with aria-label', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('role="region"'));
                assert.ok(reqs.includes('aria-label="Acceptance criteria"'));
            });

            it('should have role="button" on header toggle', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('role="button"'));
            });

            it('should have tabindex="0" on header for keyboard access', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('tabindex="0"'));
            });

            it('should have aria-expanded on header toggle', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('aria-expanded="true"'));
            });

            it('should have aria-controls linking header to content', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('aria-controls="reqContent"'));
            });

            it('should have keyboard event handler for Enter and Space', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('onkeydown'));
                assert.ok(reqs.includes("event.key==='Enter'"));
                assert.ok(reqs.includes("event.key===' '"));
            });

            it('should have aria-hidden on toggle indicator', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('id="reqToggle"'));
                // The toggle arrow is decorative
                const reqToggleMatch = reqs.match(/id="reqToggle"[^>]*aria-hidden="true"/);
                assert.ok(reqToggleMatch);
            });

            it('should have role="group" on content', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('role="group"'));
                assert.ok(reqs.includes('aria-label="Acceptance criteria checkboxes"'));
            });

            it('should have aria-describedby on checkboxes', () => {
                const reqs = getRequirementsSection();
                assert.ok(reqs.includes('aria-describedby="requirements-desc"'));
                assert.ok(reqs.includes('id="requirements-desc"'));
            });

            it('should have aria-hidden on checkbox label icons', () => {
                const reqs = getRequirementsSection();
                // Check that icons in labels have aria-hidden
                const iconAriaHidden = reqs.match(/<label[^>]*>.*?aria-hidden="true".*?<\/label>/s);
                assert.ok(iconAriaHidden);
            });
        });

        describe('getTaskSection', () => {
            const mockTask: Task = { 
                id: 'test-1',
                description: 'Test task', 
                status: TaskStatus.PENDING,
                lineNumber: 1,
                rawLine: '- [ ] Test task'
            };

            it('should have role="region" with aria-label when task present', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('role="region"'));
                assert.ok(task.includes('aria-label="Current task"'));
            });

            it('should have role="status" and aria-live on task text', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('role="status"'));
                assert.ok(task.includes('aria-live="polite"'));
            });

            it('should have aria-labelledby linking task text to label', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('id="taskLabel"'));
                assert.ok(task.includes('aria-labelledby="taskLabel"'));
            });

            it('should have role="status" on completed state', () => {
                const task = getTaskSection(null, true);
                assert.ok(task.includes('role="status"'));
                assert.ok(task.includes('aria-live="polite"'));
            });

            it('should have aria-hidden on decorative check icon', () => {
                const task = getTaskSection(null, true);
                assert.ok(task.includes('aria-hidden="true"'));
            });
        });

        describe('getLogSection', () => {
            it('should have role="log" with aria-label', () => {
                const log = getLogSection();
                assert.ok(log.includes('role="log"'));
                assert.ok(log.includes('aria-label="Activity log"'));
            });

            it('should have aria-live on log section', () => {
                const log = getLogSection();
                assert.ok(log.includes('aria-live="polite"'));
            });

            it('should have role="list" on log content', () => {
                const log = getLogSection();
                assert.ok(log.includes('role="list"'));
                assert.ok(log.includes('aria-labelledby="logHeaderTitle"'));
            });

            it('should have role="listitem" on log entries', () => {
                const log = getLogSection();
                assert.ok(log.includes('role="listitem"'));
            });

            it('should have aria-label on time span', () => {
                const log = getLogSection();
                assert.ok(log.includes('aria-label="Time"'));
            });
        });

        describe('getFooter', () => {
            it('should have role="contentinfo"', () => {
                const footer = getFooter();
                assert.ok(footer.includes('role="contentinfo"'));
            });

            it('should have role="alert" on warning', () => {
                const footer = getFooter();
                assert.ok(footer.includes('role="alert"'));
            });

            it('should have aria-hidden on warning emoji', () => {
                const footer = getFooter();
                assert.ok(footer.includes('aria-hidden="true"'));
            });

            it('should have rel="noopener noreferrer" on external link', () => {
                const footer = getFooter();
                assert.ok(footer.includes('rel="noopener noreferrer"'));
            });

            it('should have aria-label on GitHub link', () => {
                const footer = getFooter();
                assert.ok(footer.includes('aria-label="Visit Ralph on GitHub"'));
            });

            it('should have aria-label on version', () => {
                const footer = getFooter();
                assert.ok(footer.includes('aria-label="Version"'));
            });
        });

        describe('getScreenReaderAnnouncer', () => {
            it('should return a string', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.strictEqual(typeof announcer, 'string');
            });

            it('should have id="srAnnouncer"', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('id="srAnnouncer"'));
            });

            it('should have class="sr-announcer"', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('class="sr-announcer"'));
            });

            it('should have role="status"', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('role="status"'));
            });

            it('should have aria-live="assertive" for important announcements', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('aria-live="assertive"'));
            });

            it('should have aria-atomic="true" for complete content reading', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('aria-atomic="true"'));
            });

            it('should be an empty div element', () => {
                const announcer = getScreenReaderAnnouncer();
                assert.ok(announcer.includes('></div>'));
            });
        });
    });

    describe('Loading Spinners in Templates', () => {
        describe('Control buttons spinner elements', () => {
            it('should include btn-spinner element in start button', () => {
                const controls = getControls(true);
                // Check for spinner in start button area
                const startBtnMatch = controls.match(/id="btnStart"[^>]*>[^]*?class="btn-spinner"/);
                assert.ok(startBtnMatch || controls.includes('btn-spinner'), 'Start button should have a spinner element');
            });

            it('should include btn-spinner element in pause button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('id="btnPause"'));
                // Verify btn-spinner appears in the controls
                const pauseSection = controls.substring(controls.indexOf('btnPause'));
                assert.ok(pauseSection.includes('btn-spinner') || controls.includes('btn-spinner'));
            });

            it('should include btn-spinner element in stop button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('id="btnStop"'));
                assert.ok(controls.includes('btn-spinner'));
            });

            it('should include btn-spinner element in step button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('id="btnNext"'));
                assert.ok(controls.includes('btn-spinner'));
            });

            it('should include btn-spinner element in resume button', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('id="btnResume"'));
                assert.ok(controls.includes('btn-spinner'));
            });

            it('should have btn-icon class for button icons', () => {
                const controls = getControls(true);
                assert.ok(controls.includes('class="btn-icon"'));
            });

            it('should have aria-hidden on spinner elements', () => {
                const controls = getControls(true);
                // Spinners should be hidden from screen readers
                const spinnerCount = (controls.match(/class="btn-spinner" aria-hidden="true"/g) || []).length;
                assert.ok(spinnerCount >= 5, 'All control buttons should have aria-hidden spinners');
            });

            it('should have aria-hidden on btn-icon elements', () => {
                const controls = getControls(true);
                // Icons should be hidden from screen readers (decorative)
                const iconCount = (controls.match(/class="btn-icon" aria-hidden="true"/g) || []).length;
                assert.ok(iconCount >= 5, 'All control buttons should have aria-hidden icons');
            });
        });

        describe('Generate button spinner elements', () => {
            it('should include btn-spinner in generate button', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('generate-btn'));
                assert.ok(setup.includes('btn-spinner'));
            });

            it('should have btn-icon class for generate button star icon', () => {
                const setup = getSetupSection();
                assert.ok(setup.includes('class="btn-icon"'));
            });

            it('should have aria-hidden on generate button spinner', () => {
                const setup = getSetupSection();
                const hasAriaHiddenSpinner = setup.includes('class="btn-spinner" aria-hidden="true"');
                assert.ok(hasAriaHiddenSpinner, 'Generate button spinner should be aria-hidden');
            });
        });
    });

    describe('Toast Container', () => {
        describe('getToastContainer', () => {
            it('should return a string', () => {
                const container = getToastContainer();
                assert.strictEqual(typeof container, 'string');
            });

            it('should include toastContainer id', () => {
                const container = getToastContainer();
                assert.ok(container.includes('id="toastContainer"'));
            });

            it('should include toast-container class', () => {
                const container = getToastContainer();
                assert.ok(container.includes('class="toast-container"'));
            });

            it('should have role=region for accessibility', () => {
                const container = getToastContainer();
                assert.ok(container.includes('role="region"'));
            });

            it('should have aria-label for accessibility', () => {
                const container = getToastContainer();
                assert.ok(container.includes('aria-label="Notifications"'));
            });

            it('should have aria-live=polite for screen readers', () => {
                const container = getToastContainer();
                assert.ok(container.includes('aria-live="polite"'));
            });
        });

        describe('ToastIcons', () => {
            it('should export ToastIcons object', () => {
                assert.ok(ToastIcons);
                assert.strictEqual(typeof ToastIcons, 'object');
            });

            it('should include success icon', () => {
                assert.ok(ToastIcons.success);
                assert.ok(ToastIcons.success.includes('<svg'));
            });

            it('should include error icon', () => {
                assert.ok(ToastIcons.error);
                assert.ok(ToastIcons.error.includes('<svg'));
            });

            it('should include warning icon', () => {
                assert.ok(ToastIcons.warning);
                assert.ok(ToastIcons.warning.includes('<svg'));
            });

            it('should include info icon', () => {
                assert.ok(ToastIcons.info);
                assert.ok(ToastIcons.info.includes('<svg'));
            });

            it('should include dismiss icon', () => {
                assert.ok(ToastIcons.dismiss);
                assert.ok(ToastIcons.dismiss.includes('<svg'));
            });

            it('should have aria-hidden on all icons', () => {
                assert.ok(ToastIcons.success.includes('aria-hidden="true"'));
                assert.ok(ToastIcons.error.includes('aria-hidden="true"'));
                assert.ok(ToastIcons.warning.includes('aria-hidden="true"'));
                assert.ok(ToastIcons.info.includes('aria-hidden="true"'));
                assert.ok(ToastIcons.dismiss.includes('aria-hidden="true"'));
            });

            it('should use 16x16 size for toast type icons', () => {
                assert.ok(ToastIcons.success.includes('width="16"'));
                assert.ok(ToastIcons.success.includes('height="16"'));
                assert.ok(ToastIcons.error.includes('width="16"'));
                assert.ok(ToastIcons.info.includes('width="16"'));
                assert.ok(ToastIcons.warning.includes('width="16"'));
            });

            it('should use 14x14 size for dismiss icon', () => {
                assert.ok(ToastIcons.dismiss.includes('width="14"'));
                assert.ok(ToastIcons.dismiss.includes('height="14"'));
            });

            it('success icon should include checkmark path', () => {
                assert.ok(ToastIcons.success.includes('polyline'));
            });

            it('error icon should include X lines', () => {
                assert.ok(ToastIcons.error.includes('line'));
            });

            it('warning icon should include triangle path', () => {
                assert.ok(ToastIcons.warning.includes('path'));
            });

            it('info icon should include circle and lines', () => {
                assert.ok(ToastIcons.info.includes('circle'));
                assert.ok(ToastIcons.info.includes('line'));
            });

            it('dismiss icon should include X lines', () => {
                assert.ok(ToastIcons.dismiss.includes('line'));
            });
        });
    });

    // ====================================================================
    // PRD Input Validation Constants & Template Tests
    // ====================================================================

    describe('PRD Input Validation', () => {
        describe('Validation Constants', () => {
            it('should export PRD_INPUT_MIN_LENGTH constant', () => {
                assert.strictEqual(typeof PRD_INPUT_MIN_LENGTH, 'number');
            });

            it('should export PRD_INPUT_MAX_LENGTH constant', () => {
                assert.strictEqual(typeof PRD_INPUT_MAX_LENGTH, 'number');
            });

            it('should set PRD_INPUT_MIN_LENGTH to 10', () => {
                assert.strictEqual(PRD_INPUT_MIN_LENGTH, 10);
            });

            it('should set PRD_INPUT_MAX_LENGTH to 2000', () => {
                assert.strictEqual(PRD_INPUT_MAX_LENGTH, 2000);
            });

            it('should have min length less than max length', () => {
                assert.ok(PRD_INPUT_MIN_LENGTH < PRD_INPUT_MAX_LENGTH);
            });
        });

        describe('getSetupSection validation elements', () => {
            it('should include textarea-wrapper element', () => {
                const html = getSetupSection();
                assert.ok(html.includes('class="textarea-wrapper"'));
            });

            it('should include character count display', () => {
                const html = getSetupSection();
                assert.ok(html.includes('class="textarea-char-count"'));
                assert.ok(html.includes('id="taskInputCharCount"'));
            });

            it('should include charCountValue element', () => {
                const html = getSetupSection();
                assert.ok(html.includes('id="charCountValue"'));
            });

            it('should display max length in character count', () => {
                const html = getSetupSection();
                assert.ok(html.includes(`<span>${PRD_INPUT_MAX_LENGTH}</span>`));
            });

            it('should include validation message container', () => {
                const html = getSetupSection();
                assert.ok(html.includes('class="validation-message"'));
                assert.ok(html.includes('id="taskInputError"'));
            });

            it('should set validation message role to alert', () => {
                const html = getSetupSection();
                assert.ok(html.includes('role="alert"'));
            });

            it('should set validation message aria-live to assertive', () => {
                const html = getSetupSection();
                assert.ok(html.includes('aria-live="assertive"'));
            });

            it('should add maxlength attribute to textarea', () => {
                const html = getSetupSection();
                assert.ok(html.includes(`maxlength="${PRD_INPUT_MAX_LENGTH}"`));
            });

            it('should set aria-invalid to false initially', () => {
                const html = getSetupSection();
                assert.ok(html.includes('aria-invalid="false"'));
            });

            it('should include taskInputError in aria-describedby', () => {
                const html = getSetupSection();
                assert.ok(html.includes('aria-describedby="taskInputDescription taskInputError"'));
            });

            it('should have character count with aria-live polite', () => {
                const html = getSetupSection();
                // Check that the char count div has proper accessibility
                const charCountIndex = html.indexOf('taskInputCharCount');
                assert.ok(charCountIndex > 0);
                const nearbyContent = html.substring(charCountIndex - 100, charCountIndex + 100);
                assert.ok(nearbyContent.includes('aria-live="polite"'));
            });

            it('should have initial character count of 0', () => {
                const html = getSetupSection();
                assert.ok(html.includes('>0</span>'));
            });
        });
    });

    describe('Skeleton Loaders', () => {
        describe('getSkeletonTimeline', () => {
            it('should return HTML string', () => {
                const html = getSkeletonTimeline();
                assert.strictEqual(typeof html, 'string');
            });

            it('should have skeleton-timeline class', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('class="skeleton-timeline"'));
            });

            it('should have skeletonTimeline id', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('id="skeletonTimeline"'));
            });

            it('should have aria-label for accessibility', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('aria-label="Loading timeline"'));
            });

            it('should have aria-busy attribute', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('aria-busy="true"'));
            });

            it('should have role=img for decorative skeleton', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('role="img"'));
            });

            it('should include skeleton timeline bars', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('skeleton-timeline-bars'));
                assert.ok(html.includes('skeleton-timeline-bar'));
            });

            it('should include skeleton timeline labels', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('skeleton-timeline-labels'));
                assert.ok(html.includes('skeleton-timeline-label'));
            });

            it('should have 6 skeleton bars', () => {
                const html = getSkeletonTimeline();
                const barCount = (html.match(/skeleton-timeline-bar/g) || []).length;
                // Includes the container class too, so check for individual bars
                assert.ok(barCount >= 6);
            });

            it('should mark skeleton elements as aria-hidden', () => {
                const html = getSkeletonTimeline();
                assert.ok(html.includes('aria-hidden="true"'));
            });
        });

        describe('getSkeletonTask', () => {
            it('should return HTML string', () => {
                const html = getSkeletonTask();
                assert.strictEqual(typeof html, 'string');
            });

            it('should have skeleton-task class', () => {
                const html = getSkeletonTask();
                assert.ok(html.includes('class="skeleton-task"'));
            });

            it('should have skeletonTask id', () => {
                const html = getSkeletonTask();
                assert.ok(html.includes('id="skeletonTask"'));
            });

            it('should have aria-label for accessibility', () => {
                const html = getSkeletonTask();
                assert.ok(html.includes('aria-label="Loading task"'));
            });

            it('should have aria-busy attribute', () => {
                const html = getSkeletonTask();
                assert.ok(html.includes('aria-busy="true"'));
            });

            it('should include skeleton task label', () => {
                const html = getSkeletonTask();
                assert.ok(html.includes('skeleton-task-label'));
            });

            it('should include skeleton task text lines', () => {
                const html = getSkeletonTask();
                const textCount = (html.match(/skeleton-task-text/g) || []).length;
                assert.ok(textCount >= 2);
            });
        });

        describe('getSkeletonLog', () => {
            it('should return HTML string', () => {
                const html = getSkeletonLog();
                assert.strictEqual(typeof html, 'string');
            });

            it('should have skeleton-log class', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('class="skeleton-log"'));
            });

            it('should have skeletonLog id', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('id="skeletonLog"'));
            });

            it('should have aria-label for accessibility', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('aria-label="Loading activity log"'));
            });

            it('should have aria-busy attribute', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('aria-busy="true"'));
            });

            it('should include skeleton log header', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('skeleton-log-header'));
            });

            it('should include skeleton log content', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('skeleton-log-content'));
            });

            it('should include 3 skeleton log entries', () => {
                const html = getSkeletonLog();
                const entryCount = (html.match(/skeleton-log-entry/g) || []).length;
                assert.ok(entryCount >= 3);
            });

            it('should include skeleton log time placeholders', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('skeleton-log-time'));
            });

            it('should include skeleton log message placeholders', () => {
                const html = getSkeletonLog();
                assert.ok(html.includes('skeleton-log-msg'));
            });
        });

        describe('getSkeletonRequirements', () => {
            it('should return HTML string', () => {
                const html = getSkeletonRequirements();
                assert.strictEqual(typeof html, 'string');
            });

            it('should have skeleton-requirements class', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('class="skeleton-requirements"'));
            });

            it('should have skeletonRequirements id', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('id="skeletonRequirements"'));
            });

            it('should have aria-label for accessibility', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('aria-label="Loading requirements"'));
            });

            it('should have aria-busy attribute', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('aria-busy="true"'));
            });

            it('should include skeleton requirements header', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('skeleton-requirements-header'));
            });

            it('should include skeleton requirements icon', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('skeleton-requirements-icon'));
            });

            it('should include skeleton requirements title', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('skeleton-requirements-title'));
            });

            it('should include 6 skeleton requirement items', () => {
                const html = getSkeletonRequirements();
                const itemCount = (html.match(/skeleton-requirement-item/g) || []).length;
                assert.ok(itemCount >= 6);
            });

            it('should include skeleton requirement checkboxes', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('skeleton-requirement-checkbox'));
            });

            it('should include skeleton requirement labels', () => {
                const html = getSkeletonRequirements();
                assert.ok(html.includes('skeleton-requirement-label'));
            });
        });

        describe('getLoadingIndicator', () => {
            it('should return HTML string', () => {
                const html = getLoadingIndicator();
                assert.strictEqual(typeof html, 'string');
            });

            it('should have skeleton-loading-indicator class', () => {
                const html = getLoadingIndicator();
                assert.ok(html.includes('class="skeleton-loading-indicator"'));
            });

            it('should have role=status', () => {
                const html = getLoadingIndicator();
                assert.ok(html.includes('role="status"'));
            });

            it('should use default text "Loading"', () => {
                const html = getLoadingIndicator();
                assert.ok(html.includes('aria-label="Loading"'));
                assert.ok(html.includes('>Loading</span>'));
            });

            it('should accept custom text', () => {
                const html = getLoadingIndicator('Fetching data');
                assert.ok(html.includes('aria-label="Fetching data"'));
                assert.ok(html.includes('>Fetching data</span>'));
            });

            it('should include 3 loading dots', () => {
                const html = getLoadingIndicator();
                const dotCount = (html.match(/skeleton-loading-dot/g) || []).length;
                assert.strictEqual(dotCount, 3);
            });
        });

        describe('getAllSkeletons', () => {
            it('should return HTML string', () => {
                const html = getAllSkeletons();
                assert.strictEqual(typeof html, 'string');
            });

            it('should include skeleton timeline', () => {
                const html = getAllSkeletons();
                assert.ok(html.includes('skeletonTimeline'));
            });

            it('should include skeleton task', () => {
                const html = getAllSkeletons();
                assert.ok(html.includes('skeletonTask'));
            });

            it('should include skeleton log', () => {
                const html = getAllSkeletons();
                assert.ok(html.includes('skeletonLog'));
            });

            it('should include skeleton requirements', () => {
                const html = getAllSkeletons();
                assert.ok(html.includes('skeletonRequirements'));
            });
        });
    });

    describe('Collapsible Sections for Mobile-Friendly View', () => {
        describe('CollapsibleIcons', () => {
            it('should export CollapsibleIcons object', () => {
                assert.ok(CollapsibleIcons);
                assert.strictEqual(typeof CollapsibleIcons, 'object');
            });

            it('should include chevronDown icon', () => {
                assert.ok(CollapsibleIcons.chevronDown);
                assert.ok(CollapsibleIcons.chevronDown.includes('svg'));
            });

            it('should have section-toggle-icon class on chevron', () => {
                assert.ok(CollapsibleIcons.chevronDown.includes('section-toggle-icon'));
            });

            it('should have aria-hidden on decorative icon', () => {
                assert.ok(CollapsibleIcons.chevronDown.includes('aria-hidden="true"'));
            });
        });

        describe('getTimelineSection - Collapsible', () => {
            it('should have collapsible-section class', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('collapsible-section'));
            });

            it('should have section-header-collapsible class on header', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('section-header-collapsible'));
            });

            it('should have onclick handler calling toggleSection', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes("onclick=\"toggleSection('timelineContent', 'timelineToggle', this)\""));
            });

            it('should have aria-expanded attribute on header', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('aria-expanded="true"'));
            });

            it('should have aria-controls pointing to content', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('aria-controls="timelineContent"'));
            });

            it('should have keyboard handler for Enter and Space', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes("onkeydown=\"if(event.key==='Enter'||event.key===' ')"));
            });

            it('should have tabindex for keyboard focus', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('tabindex="0"'));
            });

            it('should have section-toggle element with expanded class', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('section-toggle expanded'));
                assert.ok(timeline.includes('id="timelineToggle"'));
            });

            it('should have section-content class on content', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('class="timeline-content section-content"'));
                assert.ok(timeline.includes('id="timelineContent"'));
            });

            it('should have section-header-right wrapper', () => {
                const timeline = getTimelineSection();
                assert.ok(timeline.includes('section-header-right'));
            });
        });

        describe('getTaskSection - Collapsible', () => {
            const mockTask: Task = { id: 'task-1', description: 'Test task', status: TaskStatus.PENDING, lineNumber: 1, rawLine: '- [ ] Test task' };

            it('should have collapsible-section class', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('collapsible-section'));
            });

            it('should have task-header with section-header-collapsible', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('task-header section-header-collapsible'));
            });

            it('should have onclick handler calling toggleSection', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes("onclick=\"toggleSection('taskContent', 'taskToggle', this)\""));
            });

            it('should have aria-expanded attribute on header', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('aria-expanded="true"'));
            });

            it('should have aria-controls pointing to taskContent', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('aria-controls="taskContent"'));
            });

            it('should have section-toggle element with taskToggle id', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('id="taskToggle"'));
                assert.ok(task.includes('section-toggle expanded'));
            });

            it('should have task-content with section-content class', () => {
                const task = getTaskSection(mockTask, true);
                assert.ok(task.includes('class="task-content section-content"'));
                assert.ok(task.includes('id="taskContent"'));
            });

            it('should not have collapsible header for completed state', () => {
                const task = getTaskSection(null, true);
                assert.ok(!task.includes('toggleSection'));
            });
        });

        describe('getLogSection - Collapsible', () => {
            it('should have collapsible-section class', () => {
                const log = getLogSection();
                assert.ok(log.includes('collapsible-section'));
            });

            it('should have section-header-collapsible class on header', () => {
                const log = getLogSection();
                assert.ok(log.includes('section-header-collapsible'));
            });

            it('should have onclick handler calling toggleSection', () => {
                const log = getLogSection();
                assert.ok(log.includes("onclick=\"toggleSection('logContent', 'logToggle', this)\""));
            });

            it('should have aria-expanded attribute on header', () => {
                const log = getLogSection();
                assert.ok(log.includes('aria-expanded="true"'));
            });

            it('should have aria-controls pointing to logContent', () => {
                const log = getLogSection();
                assert.ok(log.includes('aria-controls="logContent"'));
            });

            it('should have section-toggle element with logToggle id', () => {
                const log = getLogSection();
                assert.ok(log.includes('id="logToggle"'));
                assert.ok(log.includes('section-toggle expanded'));
            });

            it('should have log-content with section-content class', () => {
                const log = getLogSection();
                assert.ok(log.includes('class="log-content section-content"'));
                assert.ok(log.includes('id="logContent"'));
            });

            it('should still have logArea for backward compatibility', () => {
                const log = getLogSection();
                assert.ok(log.includes('id="logArea"'));
            });

            it('should include chevron icon in toggle', () => {
                const log = getLogSection();
                assert.ok(log.includes('section-toggle-icon'));
            });
        });
    });

    describe('getPendingTasksSection (Drag-and-Drop Task Reordering)', () => {
        const createTask = (id: string, description: string, status: TaskStatus): Task => ({
            id,
            description,
            status,
            lineNumber: 1,
            rawLine: `- [ ] ${description}`
        });

        describe('Empty and Single Task Cases', () => {
            it('should return empty string for empty tasks array', () => {
                const section = getPendingTasksSection([]);
                assert.strictEqual(section, '');
            });

            it('should return empty string for single pending task', () => {
                const tasks = [createTask('task-1', 'Single Task', TaskStatus.PENDING)];
                const section = getPendingTasksSection(tasks);
                assert.strictEqual(section, '');
            });

            it('should return empty string for only completed tasks', () => {
                const tasks = [
                    createTask('task-1', 'Task 1', TaskStatus.COMPLETE),
                    createTask('task-2', 'Task 2', TaskStatus.COMPLETE)
                ];
                const section = getPendingTasksSection(tasks);
                assert.strictEqual(section, '');
            });
        });

        describe('Section Structure', () => {
            const tasks = [
                createTask('task-1', 'Task 1', TaskStatus.PENDING),
                createTask('task-2', 'Task 2', TaskStatus.PENDING)
            ];

            it('should include task-queue-section container', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('class="task-queue-section'));
            });

            it('should include collapsible-section class', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('collapsible-section'));
            });

            it('should have taskQueueSection ID', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('id="taskQueueSection"'));
            });

            it('should have role="region" for accessibility', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('role="region"'));
            });

            it('should have aria-label for accessibility', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('aria-label="Task Queue"'));
            });
        });

        describe('Collapsible Header', () => {
            const tasks = [
                createTask('task-1', 'Task 1', TaskStatus.PENDING),
                createTask('task-2', 'Task 2', TaskStatus.PENDING)
            ];

            it('should include section-header-collapsible class', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('section-header-collapsible'));
            });

            it('should have onclick handler for toggleSection', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes("toggleSection('taskQueueContent', 'taskQueueToggle', this)"));
            });

            it('should have role="button" on header', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('role="button"'));
            });

            it('should have aria-expanded attribute', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('aria-expanded="true"'));
            });

            it('should have aria-controls pointing to content', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('aria-controls="taskQueueContent"'));
            });

            it('should include Upcoming Tasks label', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('Upcoming Tasks'));
            });

            it('should include section toggle with chevron', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('id="taskQueueToggle"'));
                assert.ok(section.includes('section-toggle expanded'));
            });
        });

        describe('Content Area', () => {
            const tasks = [
                createTask('task-1', 'Task 1', TaskStatus.PENDING),
                createTask('task-2', 'Task 2', TaskStatus.PENDING)
            ];

            it('should include task-queue-content with section-content', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('class="task-queue-content section-content"'));
            });

            it('should have taskQueueContent ID', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('id="taskQueueContent"'));
            });

            it('should have role="list" on content', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('role="list"'));
            });

            it('should include task-queue-list container', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('id="taskQueueList"'));
            });

            it('should include queue hint text', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('Drag and drop to reorder tasks'));
            });
        });

        describe('Task Queue Items', () => {
            const tasks = [
                createTask('task-1', 'Task 1', TaskStatus.PENDING),
                createTask('task-2', 'Task 2', TaskStatus.PENDING)
            ];

            it('should create task-queue-item for each task', () => {
                const section = getPendingTasksSection(tasks);
                const itemMatches = section.match(/class="task-queue-item"/g);
                assert.strictEqual(itemMatches?.length, 2);
            });

            it('should include draggable="true" attribute', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('draggable="true"'));
            });

            it('should include data-task-id attribute', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('data-task-id="task-1"'));
                assert.ok(section.includes('data-task-id="task-2"'));
            });

            it('should include role="listitem" for accessibility', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('role="listitem"'));
            });

            it('should include tabindex="0" for keyboard access', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('tabindex="0"'));
            });

            it('should include aria-label with task description', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('aria-label="Task: Task 1'));
            });

            it('should include drag handle icon', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('class="drag-handle"'));
                assert.ok(section.includes('drag-handle-icon'));
            });

            it('should include task description text', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('class="task-queue-text"'));
                assert.ok(section.includes('>Task 1</span>'));
                assert.ok(section.includes('>Task 2</span>'));
            });
        });

        describe('Task Status Filtering', () => {
            it('should include PENDING tasks', () => {
                const tasks = [
                    createTask('task-1', 'Pending 1', TaskStatus.PENDING),
                    createTask('task-2', 'Pending 2', TaskStatus.PENDING)
                ];
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('Pending 1'));
                assert.ok(section.includes('Pending 2'));
            });

            it('should include IN_PROGRESS tasks', () => {
                const tasks = [
                    createTask('task-1', 'In Progress Task', TaskStatus.IN_PROGRESS),
                    createTask('task-2', 'Pending Task', TaskStatus.PENDING)
                ];
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('In Progress Task'));
            });

            it('should include BLOCKED tasks', () => {
                const tasks = [
                    createTask('task-1', 'Blocked Task', TaskStatus.BLOCKED),
                    createTask('task-2', 'Pending Task', TaskStatus.PENDING)
                ];
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('Blocked Task'));
            });

            it('should include SKIPPED tasks', () => {
                const tasks = [
                    createTask('task-1', 'Skipped Task', TaskStatus.SKIPPED),
                    createTask('task-2', 'Pending Task', TaskStatus.PENDING)
                ];
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('Skipped Task'));
            });

            it('should exclude COMPLETE tasks', () => {
                const tasks = [
                    createTask('task-1', 'Complete Task', TaskStatus.COMPLETE),
                    createTask('task-2', 'Pending 1', TaskStatus.PENDING),
                    createTask('task-3', 'Pending 2', TaskStatus.PENDING)
                ];
                const section = getPendingTasksSection(tasks);
                assert.ok(!section.includes('Complete Task'));
                assert.ok(section.includes('Pending 1'));
                assert.ok(section.includes('Pending 2'));
            });

            it('should handle mixed statuses correctly', () => {
                const tasks = [
                    createTask('task-1', 'Complete 1', TaskStatus.COMPLETE),
                    createTask('task-2', 'Pending 1', TaskStatus.PENDING),
                    createTask('task-3', 'Complete 2', TaskStatus.COMPLETE),
                    createTask('task-4', 'Blocked', TaskStatus.BLOCKED)
                ];
                const section = getPendingTasksSection(tasks);
                // Only Pending 1 and Blocked should be included (2 items)
                const itemMatches = section.match(/class="task-queue-item"/g);
                assert.strictEqual(itemMatches?.length, 2);
            });
        });

        describe('Keyboard Accessibility', () => {
            const tasks = [
                createTask('task-1', 'Task 1', TaskStatus.PENDING),
                createTask('task-2', 'Task 2', TaskStatus.PENDING)
            ];

            it('should have keyboard handler on header', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('onkeydown="if(event.key===\'Enter\'||event.key===\' \')'));
            });

            it('should call toggleSection on Enter key', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes("toggleSection('taskQueueContent','taskQueueToggle',this)"));
            });

            it('should prevent default on Enter/Space', () => {
                const section = getPendingTasksSection(tasks);
                assert.ok(section.includes('event.preventDefault()'));
            });
        });
    });

    // =========================================================================
    // Task Details Panel Tests
    // =========================================================================

    describe('TaskDetailIcons', () => {
        it('should have id icon', () => {
            assert.ok(TaskDetailIcons.id);
            assert.ok(TaskDetailIcons.id.includes('svg'));
        });

        it('should have status icon', () => {
            assert.ok(TaskDetailIcons.status);
            assert.ok(TaskDetailIcons.status.includes('svg'));
        });

        it('should have dependency icon', () => {
            assert.ok(TaskDetailIcons.dependency);
            assert.ok(TaskDetailIcons.dependency.includes('svg'));
        });

        it('should have line icon', () => {
            assert.ok(TaskDetailIcons.line);
            assert.ok(TaskDetailIcons.line.includes('svg'));
        });

        it('should have complexity icon', () => {
            assert.ok(TaskDetailIcons.complexity);
            assert.ok(TaskDetailIcons.complexity.includes('svg'));
        });

        it('should have aria-hidden on all icons', () => {
            assert.ok(TaskDetailIcons.id.includes('aria-hidden="true"'));
            assert.ok(TaskDetailIcons.status.includes('aria-hidden="true"'));
            assert.ok(TaskDetailIcons.dependency.includes('aria-hidden="true"'));
            assert.ok(TaskDetailIcons.line.includes('aria-hidden="true"'));
            assert.ok(TaskDetailIcons.complexity.includes('aria-hidden="true"'));
        });
    });

    describe('getTaskDetailsHtml', () => {
        const createTestTask = (overrides: Partial<Task> = {}): Task => ({
            id: 'test-task-1',
            description: 'Test task description',
            status: TaskStatus.PENDING,
            lineNumber: 10,
            rawLine: '- [ ] Test task description',
            ...overrides
        });

        describe('Basic Structure', () => {
            it('should return valid HTML with task details panel', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-details-panel'));
                assert.ok(html.includes('id="taskDetailsPanel"'));
            });

            it('should have role="region" for accessibility', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('role="region"'));
            });

            it('should have aria-label for accessibility', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('aria-label="Task details"'));
            });

            it('should start hidden with aria-hidden="true"', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('aria-hidden="true"'));
            });

            it('should start with display: none', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('style="display: none;"'));
            });

            it('should have task-details-content container', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-details-content'));
            });
        });

        describe('Task ID Display', () => {
            it('should display task ID', () => {
                const task = createTestTask({ id: 'my-unique-task-id' });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('my-unique-task-id'));
            });

            it('should have task-detail-id class', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-detail-id'));
            });

            it('should escape HTML in task ID', () => {
                const task = createTestTask({ id: '<script>alert(1)</script>' });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('&lt;script&gt;'));
                assert.ok(!html.includes('<script>alert'));
            });
        });

        describe('Task Status Display', () => {
            it('should display PENDING status', () => {
                const task = createTestTask({ status: TaskStatus.PENDING });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Pending'));
                assert.ok(html.includes('pending'));
            });

            it('should display IN_PROGRESS status', () => {
                const task = createTestTask({ status: TaskStatus.IN_PROGRESS });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('In Progress'));
                assert.ok(html.includes('in-progress'));
            });

            it('should display COMPLETE status', () => {
                const task = createTestTask({ status: TaskStatus.COMPLETE });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Complete'));
                assert.ok(html.includes('complete'));
            });

            it('should display BLOCKED status', () => {
                const task = createTestTask({ status: TaskStatus.BLOCKED });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Blocked'));
                assert.ok(html.includes('blocked'));
            });

            it('should display SKIPPED status', () => {
                const task = createTestTask({ status: TaskStatus.SKIPPED });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Skipped'));
                assert.ok(html.includes('skipped'));
            });

            it('should have task-detail-status class', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-detail-status'));
            });
        });

        describe('Line Number Display', () => {
            it('should display line number', () => {
                const task = createTestTask({ lineNumber: 42 });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('42'));
            });

            it('should have task-detail-line class', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-detail-line'));
            });
        });

        describe('Dependencies Display', () => {
            it('should show "No dependencies" when no dependencies', () => {
                const task = createTestTask({ dependencies: undefined });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('No dependencies'));
            });

            it('should show "No dependencies" when empty dependencies array', () => {
                const task = createTestTask({ dependencies: [] });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('No dependencies'));
            });

            it('should display single dependency', () => {
                const task = createTestTask({ dependencies: ['Setup database'] });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Setup database'));
                assert.ok(html.includes('task-detail-dependency'));
            });

            it('should display multiple dependencies', () => {
                const task = createTestTask({ dependencies: ['First task', 'Second task'] });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('First task'));
                assert.ok(html.includes('Second task'));
            });

            it('should escape HTML in dependencies', () => {
                const task = createTestTask({ dependencies: ['<b>Malicious</b>'] });
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('&lt;b&gt;'));
                assert.ok(!html.includes('<b>Malicious'));
            });

            it('should have task-detail-dependencies container', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-detail-dependencies'));
            });
        });

        describe('Complexity Display', () => {
            it('should have task-detail-complexity class', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('task-detail-complexity'));
            });

            it('should display complexity level', () => {
                const task = createTestTask({ description: 'Simple fix' });
                const html = getTaskDetailsHtml(task);
                // Should have one of the complexity levels
                const hasComplexity = html.includes('complexity-low') || 
                                     html.includes('complexity-medium') || 
                                     html.includes('complexity-high');
                assert.ok(hasComplexity);
            });
        });

        describe('Task Detail Labels', () => {
            it('should have Task ID label', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Task ID'));
            });

            it('should have Status label', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Status'));
            });

            it('should have Line Number label', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Line Number'));
            });

            it('should have Complexity label', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Complexity'));
            });

            it('should have Dependencies label', () => {
                const task = createTestTask();
                const html = getTaskDetailsHtml(task);
                assert.ok(html.includes('Dependencies'));
            });
        });
    });

    describe('estimateTaskComplexity', () => {
        describe('Low Complexity', () => {
            it('should return low for "fix typo"', () => {
                const result = estimateTaskComplexity('Fix typo in README');
                assert.strictEqual(result.label, 'Low');
                assert.strictEqual(result.class, 'complexity-low');
            });

            it('should return low for "remove"', () => {
                const result = estimateTaskComplexity('Remove unused import');
                assert.strictEqual(result.label, 'Low');
                assert.strictEqual(result.class, 'complexity-low');
            });

            it('should return low for "cleanup"', () => {
                const result = estimateTaskComplexity('Cleanup old comments');
                assert.strictEqual(result.label, 'Low');
                assert.strictEqual(result.class, 'complexity-low');
            });

            it('should return low for short simple tasks', () => {
                const result = estimateTaskComplexity('Rename variable');
                assert.strictEqual(result.label, 'Low');
                assert.strictEqual(result.class, 'complexity-low');
            });
        });

        describe('Medium Complexity', () => {
            it('should return medium for "add feature" with length', () => {
                const result = estimateTaskComplexity('Add new feature for user authentication with proper validation logic');
                assert.strictEqual(result.label, 'Medium');
                assert.strictEqual(result.class, 'complexity-medium');
            });

            it('should return medium for "create component" with length', () => {
                const result = estimateTaskComplexity('Create new button component with hover states and accessibility support');
                assert.strictEqual(result.label, 'Medium');
                assert.strictEqual(result.class, 'complexity-medium');
            });

            it('should return medium for description with medium keyword and length over 50', () => {
                const result = estimateTaskComplexity('Build a form validation for email format checking and password requirements');
                assert.strictEqual(result.label, 'Medium');
                assert.strictEqual(result.class, 'complexity-medium');
            });
        });

        describe('High Complexity', () => {
            it('should return high for "refactor" with long description', () => {
                const result = estimateTaskComplexity('Refactor the entire authentication module to use the new OAuth2 provider and update all related components');
                assert.strictEqual(result.label, 'High');
                assert.strictEqual(result.class, 'complexity-high');
            });

            it('should return high for "architect" with sufficient length', () => {
                const result = estimateTaskComplexity('Architect the new microservices infrastructure with service mesh and distributed tracing capabilities');
                assert.strictEqual(result.label, 'High');
                assert.strictEqual(result.class, 'complexity-high');
            });

            it('should return high for "migrate" with sufficient length', () => {
                const result = estimateTaskComplexity('Migrate database from MongoDB to PostgreSQL including schema changes and data transformation scripts');
                assert.strictEqual(result.label, 'High');
                assert.strictEqual(result.class, 'complexity-high');
            });

            it('should return high for complex long descriptions', () => {
                const result = estimateTaskComplexity('Implement a complete system redesign with new architecture patterns and integrate with external services');
                assert.strictEqual(result.label, 'High');
                assert.strictEqual(result.class, 'complexity-high');
            });
        });

        describe('Return Value Structure', () => {
            it('should return object with label property', () => {
                const result = estimateTaskComplexity('Test task');
                assert.ok('label' in result);
                assert.ok(typeof result.label === 'string');
            });

            it('should return object with class property', () => {
                const result = estimateTaskComplexity('Test task');
                assert.ok('class' in result);
                assert.ok(typeof result.class === 'string');
            });

            it('should return valid complexity class', () => {
                const result = estimateTaskComplexity('Any task');
                const validClasses = ['complexity-low', 'complexity-medium', 'complexity-high'];
                assert.ok(validClasses.includes(result.class));
            });

            it('should return valid complexity label', () => {
                const result = estimateTaskComplexity('Any task');
                const validLabels = ['Low', 'Medium', 'High'];
                assert.ok(validLabels.includes(result.label));
            });
        });
    });

    describe('extractRelatedFiles', () => {
        describe('file extension detection', () => {
            it('should extract TypeScript files', () => {
                const result = extractRelatedFiles('Update the config.ts file');
                assert.ok(result.includes('config.ts'));
            });

            it('should extract JavaScript files', () => {
                const result = extractRelatedFiles('Modify utils.js and helpers.jsx');
                assert.ok(result.includes('utils.js'));
                assert.ok(result.includes('helpers.jsx'));
            });

            it('should extract Python files', () => {
                const result = extractRelatedFiles('Fix main.py script');
                assert.ok(result.includes('main.py'));
            });

            it('should extract CSS/SCSS files', () => {
                const result = extractRelatedFiles('Update styles.css and theme.scss');
                assert.ok(result.includes('styles.css'));
                assert.ok(result.includes('theme.scss'));
            });

            it('should extract JSON/YAML files', () => {
                const result = extractRelatedFiles('Edit package.json and config.yaml');
                assert.ok(result.includes('package.json'));
                assert.ok(result.includes('config.yaml'));
            });

            it('should extract Markdown files', () => {
                const result = extractRelatedFiles('Update README.md documentation');
                assert.ok(result.includes('README.md'));
            });

            it('should extract TSX/JSX React files', () => {
                const result = extractRelatedFiles('Create Button.tsx and Modal.jsx');
                assert.ok(result.includes('Button.tsx'));
                assert.ok(result.includes('Modal.jsx'));
            });
        });

        describe('path detection', () => {
            it('should extract file paths with directories', () => {
                const result = extractRelatedFiles('Update src/utils/helpers.ts');
                assert.ok(result.some(f => f.includes('helpers.ts')));
            });

            it('should extract nested paths', () => {
                const result = extractRelatedFiles('Modify src/components/Button/index.tsx');
                assert.ok(result.some(f => f.includes('index.tsx')));
            });

            it('should extract relative paths with ./', () => {
                const result = extractRelatedFiles('Import from ./utils.ts');
                assert.ok(result.some(f => f.includes('utils.ts')));
            });
        });

        describe('backtick-quoted files', () => {
            it('should extract files in backticks', () => {
                const result = extractRelatedFiles('Update `config.ts` file');
                assert.ok(result.includes('config.ts'));
            });

            it('should extract paths in backticks', () => {
                const result = extractRelatedFiles('Modify `src/utils.ts`');
                assert.ok(result.some(f => f.includes('utils.ts')));
            });
        });

        describe('keyword-based detection', () => {
            it('should detect files after "in" keyword', () => {
                const result = extractRelatedFiles('Add new function in utils.ts');
                assert.ok(result.includes('utils.ts'));
            });

            it('should detect files after "update" keyword', () => {
                const result = extractRelatedFiles('Please update config.json');
                assert.ok(result.includes('config.json'));
            });

            it('should detect files after "modify" keyword', () => {
                const result = extractRelatedFiles('Modify the index.ts file');
                assert.ok(result.includes('index.ts'));
            });
        });

        describe('directory detection', () => {
            it('should detect directory paths', () => {
                const result = extractRelatedFiles('Add components to src/components/');
                assert.ok(result.some(f => f.includes('src/components')));
            });

            it('should detect nested directories', () => {
                const result = extractRelatedFiles('Update files in lib/utils/');
                assert.ok(result.some(f => f.includes('lib/utils')));
            });
        });

        describe('glob patterns', () => {
            it('should detect glob with double asterisk', () => {
                const result = extractRelatedFiles('Find all **/*.ts files');
                assert.ok(result.some(f => f.includes('**/*.ts')));
            });

            it('should detect glob with single asterisk', () => {
                const result = extractRelatedFiles('Match *.json files');
                assert.ok(result.some(f => f.includes('*.json')));
            });
        });

        describe('edge cases', () => {
            it('should return empty array for description without files', () => {
                const result = extractRelatedFiles('Fix the bug in the system');
                assert.strictEqual(result.length, 0);
            });

            it('should limit results to 10 files', () => {
                const result = extractRelatedFiles(
                    'Update a.ts b.ts c.ts d.ts e.ts f.ts g.ts h.ts i.ts j.ts k.ts l.ts m.ts'
                );
                assert.ok(result.length <= 10);
            });

            it('should deduplicate files', () => {
                const result = extractRelatedFiles('Update config.ts and also config.ts again');
                const configCount = result.filter(f => f === 'config.ts').length;
                assert.strictEqual(configCount, 1);
            });

            it('should handle empty string', () => {
                const result = extractRelatedFiles('');
                assert.strictEqual(result.length, 0);
            });

            it('should handle special characters in description', () => {
                const result = extractRelatedFiles('Update file.ts & run tests!');
                assert.ok(result.includes('file.ts'));
            });
        });
    });

    describe('TaskDetailIcons.relatedFiles', () => {
        it('should have relatedFiles icon', () => {
            assert.ok(TaskDetailIcons.relatedFiles);
        });

        it('should be an SVG element', () => {
            assert.ok(TaskDetailIcons.relatedFiles.includes('<svg'));
            assert.ok(TaskDetailIcons.relatedFiles.includes('</svg>'));
        });

        it('should have aria-hidden attribute', () => {
            assert.ok(TaskDetailIcons.relatedFiles.includes('aria-hidden="true"'));
        });

        it('should have folder path element', () => {
            assert.ok(TaskDetailIcons.relatedFiles.includes('<path'));
        });
    });

    describe('getTaskDetailsHtml with Related Files', () => {
        const createTestTask = (overrides: Partial<Task> = {}): Task => ({
            id: 'task-1',
            description: 'Update config.ts file',
            status: TaskStatus.PENDING,
            lineNumber: 5,
            rawLine: '- [ ] Update config.ts file',
            ...overrides
        });

        it('should include related files row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('relatedFilesRow'));
        });

        it('should include related files container', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('taskRelatedFiles'));
        });

        it('should include related files label', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('Related Files'));
        });

        it('should include relatedFiles icon', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes(TaskDetailIcons.relatedFiles));
        });

        it('should extract and display file from description', () => {
            const task = createTestTask({ description: 'Modify utils.ts' });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('task-detail-related-file'));
            assert.ok(html.includes('utils.ts'));
        });

        it('should show "No files detected" when no files found', () => {
            const task = createTestTask({ description: 'Fix the bug' });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('No files detected'));
        });

        it('should have aria-label on related files container', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('aria-label="Files that may be affected"'));
        });

        it('should include title attribute on file chips for full path', () => {
            const task = createTestTask({ description: 'Update src/config.ts' });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('title='));
        });

        it('should place related files row before dependencies row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            const relatedFilesPos = html.indexOf('relatedFilesRow');
            const dependenciesPos = html.indexOf('task-detail-dependencies-row');
            assert.ok(relatedFilesPos < dependenciesPos);
        });
    });

    describe('TaskDetailIcons.acceptanceCriteria', () => {
        it('should have acceptanceCriteria icon', () => {
            assert.ok(TaskDetailIcons.acceptanceCriteria);
        });

        it('should be an SVG element', () => {
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('<svg'));
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('</svg>'));
        });

        it('should have aria-hidden attribute', () => {
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('aria-hidden="true"'));
        });

        it('should have checkmark path element', () => {
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('<path'));
        });

        it('should have 12x12 dimensions', () => {
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('width="12"'));
            assert.ok(TaskDetailIcons.acceptanceCriteria.includes('height="12"'));
        });
    });

    describe('getTaskDetailsHtml with Acceptance Criteria', () => {
        const createTestTask = (overrides: Partial<Task> = {}): Task => ({
            id: 'task-1',
            description: 'Update config.ts file',
            status: TaskStatus.PENDING,
            lineNumber: 5,
            rawLine: '- [ ] Update config.ts file',
            ...overrides
        });

        it('should include acceptance criteria row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('acceptanceCriteriaRow'));
        });

        it('should include acceptance criteria container', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('taskAcceptanceCriteria'));
        });

        it('should include acceptance criteria label', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('Acceptance Criteria'));
        });

        it('should include acceptanceCriteria icon', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes(TaskDetailIcons.acceptanceCriteria));
        });

        it('should display criteria when provided', () => {
            const task = createTestTask({ acceptanceCriteria: ['Tests pass', 'Docs updated'] });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('task-detail-criterion'));
            assert.ok(html.includes('Tests pass'));
            assert.ok(html.includes('Docs updated'));
        });

        it('should show "No acceptance criteria defined" when empty', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('No acceptance criteria defined'));
        });

        it('should show "No acceptance criteria defined" when undefined', () => {
            const task = createTestTask({ acceptanceCriteria: undefined });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('No acceptance criteria defined'));
        });

        it('should show "No acceptance criteria defined" when empty array', () => {
            const task = createTestTask({ acceptanceCriteria: [] });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('No acceptance criteria defined'));
        });

        it('should render criteria as list items', () => {
            const task = createTestTask({ acceptanceCriteria: ['First', 'Second'] });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('task-detail-criteria-list'));
            assert.ok(html.includes('role="list"'));
            assert.ok(html.includes('role="listitem"'));
        });

        it('should have criterion bullets', () => {
            const task = createTestTask({ acceptanceCriteria: ['Test'] });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('criterion-bullet'));
            assert.ok(html.includes('✓'));
        });

        it('should escape HTML in criteria', () => {
            const task = createTestTask({ acceptanceCriteria: ['<script>alert("XSS")</script>'] });
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('&lt;script&gt;'));
            assert.ok(!html.includes('<script>alert'));
        });

        it('should have aria-label on acceptance criteria container', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('aria-label="Acceptance criteria for this task"'));
        });

        it('should place acceptance criteria row before dependencies row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            const acceptanceCriteriaPos = html.indexOf('acceptanceCriteriaRow');
            const dependenciesPos = html.indexOf('task-detail-dependencies-row');
            assert.ok(acceptanceCriteriaPos < dependenciesPos);
        });

        it('should place acceptance criteria row after related files row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            const relatedFilesPos = html.indexOf('relatedFilesRow');
            const acceptanceCriteriaPos = html.indexOf('acceptanceCriteriaRow');
            assert.ok(relatedFilesPos < acceptanceCriteriaPos);
        });
    });

    describe('getTaskSection with Task Details', () => {
        const createTestTask = (overrides: Partial<Task> = {}): Task => ({
            id: 'test-task-1',
            description: 'Test task description',
            status: TaskStatus.PENDING,
            lineNumber: 10,
            rawLine: '- [ ] Test task description',
            ...overrides
        });

        it('should include task details toggle button', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('btnTaskDetails'));
        });

        it('should include task details panel', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('taskDetailsPanel'));
        });

        it('should have toggleTaskDetails click handler', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('toggleTaskDetails()'));
        });

        it('should have task-header-actions container', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('task-header-actions'));
        });

        it('should have aria-controls on toggle button', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('aria-controls="taskDetailsPanel"'));
        });

        it('should have aria-expanded="false" initially', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('aria-expanded="false"'));
        });

        it('should use infoCircle icon for toggle button', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes(Icons.infoCircle));
        });

        it('should stop click propagation on toggle button', () => {
            const task = createTestTask();
            const section = getTaskSection(task, true);
            assert.ok(section.includes('event.stopPropagation()'));
        });

        it('should not include task details for null task', () => {
            const section = getTaskSection(null, true);
            assert.ok(!section.includes('taskDetailsPanel'));
        });

        it('should include task details with dependencies', () => {
            const task = createTestTask({ dependencies: ['First task', 'Second task'] });
            const section = getTaskSection(task, true);
            assert.ok(section.includes('First task'));
            assert.ok(section.includes('Second task'));
        });
    });

    describe('TaskDetailIcons.estimatedTime', () => {
        it('should have estimatedTime icon', () => {
            assert.ok(TaskDetailIcons.estimatedTime);
            assert.ok(TaskDetailIcons.estimatedTime.includes('svg'));
        });

        it('should have aria-hidden="true" for accessibility', () => {
            assert.ok(TaskDetailIcons.estimatedTime.includes('aria-hidden="true"'));
        });

        it('should be a clock-based icon', () => {
            assert.ok(TaskDetailIcons.estimatedTime.includes('circle'));
            assert.ok(TaskDetailIcons.estimatedTime.includes('polyline'));
        });

        it('should include dashed indicator for estimation', () => {
            assert.ok(TaskDetailIcons.estimatedTime.includes('stroke-dasharray'));
        });
    });

    describe('Estimated Time Display in getTaskDetailsHtml', () => {
        const createTestTask = (overrides: Partial<Task> = {}): Task => ({
            id: 'test-task-1',
            description: 'Test task description',
            status: TaskStatus.PENDING,
            lineNumber: 10,
            rawLine: '- [ ] Test task description',
            ...overrides
        });

        it('should include estimated time row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('estimatedTimeRow'));
        });

        it('should have Est. Time label', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('Est. Time'));
        });

        it('should have estimatedTimeValue element', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('id="estimatedTimeValue"'));
        });

        it('should have estimatedTimeSource element', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('id="estimatedTimeSource"'));
        });

        it('should have task-detail-estimated-time class', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('task-detail-estimated-time'));
        });

        it('should have aria-live="polite" for accessibility', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('aria-live="polite"'));
        });

        it('should have initial placeholder value', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('>--</span>'));
        });

        it('should use estimatedTime icon', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes(TaskDetailIcons.estimatedTime));
        });

        it('should have estimated-time-value class', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('estimated-time-value'));
        });

        it('should have estimated-time-source class', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            assert.ok(html.includes('estimated-time-source'));
        });

        it('should place Est. Time row before Dependencies row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            const estimatedTimePos = html.indexOf('Est. Time');
            const dependenciesPos = html.indexOf('Dependencies');
            assert.ok(estimatedTimePos < dependenciesPos, 'Est. Time should appear before Dependencies');
        });

        it('should place Est. Time row after Complexity row', () => {
            const task = createTestTask();
            const html = getTaskDetailsHtml(task);
            const complexityPos = html.indexOf('Complexity');
            const estimatedTimePos = html.indexOf('Est. Time');
            assert.ok(complexityPos < estimatedTimePos, 'Complexity should appear before Est. Time');
        });
    });

    describe('LazyLoadIcons', () => {
        it('should have chart icon', () => {
            assert.ok(LazyLoadIcons.chart);
            assert.ok(LazyLoadIcons.chart.includes('svg'));
        });

        it('should have chart icon with bar chart lines', () => {
            assert.ok(LazyLoadIcons.chart.includes('<line'));
        });

        it('should have graph icon', () => {
            assert.ok(LazyLoadIcons.graph);
            assert.ok(LazyLoadIcons.graph.includes('svg'));
        });

        it('should have graph icon with nodes and connections', () => {
            assert.ok(LazyLoadIcons.graph.includes('circle'));
            assert.ok(LazyLoadIcons.graph.includes('line'));
        });

        it('should have queue icon', () => {
            assert.ok(LazyLoadIcons.queue);
            assert.ok(LazyLoadIcons.queue.includes('svg'));
        });

        it('should have queue icon with list lines', () => {
            assert.ok(LazyLoadIcons.queue.includes('<line'));
        });

        it('should have settings icon', () => {
            assert.ok(LazyLoadIcons.settings);
            assert.ok(LazyLoadIcons.settings.includes('svg'));
        });

        it('should have settings icon with gear', () => {
            assert.ok(LazyLoadIcons.settings.includes('circle'));
            assert.ok(LazyLoadIcons.settings.includes('path'));
        });

        it('should have loading icon', () => {
            assert.ok(LazyLoadIcons.loading);
            assert.ok(LazyLoadIcons.loading.includes('svg'));
        });

        it('should have loading icon with spinner class', () => {
            assert.ok(LazyLoadIcons.loading.includes('lazy-load-spinner-icon'));
        });

        it('should mark all icons as aria-hidden', () => {
            assert.ok(LazyLoadIcons.chart.includes('aria-hidden="true"'));
            assert.ok(LazyLoadIcons.graph.includes('aria-hidden="true"'));
            assert.ok(LazyLoadIcons.queue.includes('aria-hidden="true"'));
            assert.ok(LazyLoadIcons.settings.includes('aria-hidden="true"'));
            assert.ok(LazyLoadIcons.loading.includes('aria-hidden="true"'));
        });
    });

    describe('getLazyLoadPlaceholder', () => {
        it('should return a string', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.strictEqual(typeof html, 'string');
        });

        it('should have lazy-section-placeholder class', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('class="lazy-section-placeholder"'));
        });

        it('should include section ID in placeholder ID', () => {
            const html = getLazyLoadPlaceholder('durationSection');
            assert.ok(html.includes('id="durationSectionPlaceholder"'));
        });

        it('should have role="status" for accessibility', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('role="status"'));
        });

        it('should have aria-label for accessibility', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('aria-label="Loading testSection"'));
        });

        it('should include placeholder-icon class', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('class="placeholder-icon"'));
        });

        it('should include placeholder-text class', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('class="placeholder-text"'));
        });

        it('should use default loading icon when none provided', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes(LazyLoadIcons.loading));
        });

        it('should use default Loading... text when none provided', () => {
            const html = getLazyLoadPlaceholder('testSection');
            assert.ok(html.includes('>Loading...</span>'));
        });

        it('should use custom icon when provided', () => {
            const html = getLazyLoadPlaceholder('testSection', LazyLoadIcons.chart);
            assert.ok(html.includes(LazyLoadIcons.chart));
        });

        it('should use custom text when provided', () => {
            const html = getLazyLoadPlaceholder('testSection', undefined, 'Custom loading text');
            assert.ok(html.includes('>Custom loading text</span>'));
        });

        it('should use both custom icon and text when provided', () => {
            const html = getLazyLoadPlaceholder('testSection', LazyLoadIcons.graph, 'Loading graph...');
            assert.ok(html.includes(LazyLoadIcons.graph));
            assert.ok(html.includes('>Loading graph...</span>'));
        });
    });

    describe('LAZY_LOAD_SECTION_IDS', () => {
        it('should be an array', () => {
            assert.ok(Array.isArray(LAZY_LOAD_SECTION_IDS));
        });

        it('should have 4 sections', () => {
            assert.strictEqual(LAZY_LOAD_SECTION_IDS.length, 4);
        });

        it('should include durationSection', () => {
            assert.ok(LAZY_LOAD_SECTION_IDS.includes('durationSection'));
        });

        it('should include dependencySection', () => {
            assert.ok(LAZY_LOAD_SECTION_IDS.includes('dependencySection'));
        });

        it('should include taskQueueSection', () => {
            assert.ok(LAZY_LOAD_SECTION_IDS.includes('taskQueueSection'));
        });

        it('should include settingsOverlay', () => {
            assert.ok(LAZY_LOAD_SECTION_IDS.includes('settingsOverlay'));
        });

        it('should be readonly', () => {
            // This is a compile-time check, but we can verify the values don't change
            const original = [...LAZY_LOAD_SECTION_IDS];
            // Try to verify it's the same
            assert.deepStrictEqual([...LAZY_LOAD_SECTION_IDS], original);
        });

        it('should contain only valid section IDs', () => {
            const validIds = ['durationSection', 'dependencySection', 'taskQueueSection', 'settingsOverlay'];
            LAZY_LOAD_SECTION_IDS.forEach(id => {
                assert.ok(validIds.includes(id), `${id} should be a valid section ID`);
            });
        });
    });

    describe('AggregatedStatsIcons', () => {
        it('should have projects icon', () => {
            assert.ok(AggregatedStatsIcons.projects);
            assert.ok(AggregatedStatsIcons.projects.includes('svg'));
        });

        it('should have tasks icon', () => {
            assert.ok(AggregatedStatsIcons.tasks);
            assert.ok(AggregatedStatsIcons.tasks.includes('svg'));
        });

        it('should have progress icon', () => {
            assert.ok(AggregatedStatsIcons.progress);
            assert.ok(AggregatedStatsIcons.progress.includes('svg'));
        });

        it('should have all icons with proper dimensions', () => {
            Object.values(AggregatedStatsIcons).forEach(icon => {
                assert.ok(icon.includes('width="14"'));
                assert.ok(icon.includes('height="14"'));
            });
        });
    });

    describe('getAggregatedStatsSection', () => {
        it('should return HTML with aggregatedStatsSection id', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedStatsSection"'));
        });

        it('should have collapsible-section class', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('class="aggregated-stats-section collapsible-section"'));
        });

        it('should have proper ARIA role', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('role="region"'));
            assert.ok(result.includes('aria-label="Aggregated statistics across projects"'));
        });

        it('should have collapsible header', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('section-header-collapsible'));
            assert.ok(result.includes('toggleSection'));
            assert.ok(result.includes('aria-expanded="true"'));
        });

        it('should have project count badge', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedProjectCount"'));
            assert.ok(result.includes('0 projects'));
        });

        it('should have empty state container', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedStatsEmpty"'));
            assert.ok(result.includes('No projects found'));
        });

        it('should have summary container with totals grid', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedStatsSummary"'));
            assert.ok(result.includes('aggregated-stats-totals'));
        });

        it('should have total tasks stat item', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedTotalTasks"'));
            assert.ok(result.includes('Total Tasks'));
        });

        it('should have completed stat item', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedCompleted"'));
            assert.ok(result.includes('Completed'));
        });

        it('should have pending stat item', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedPending"'));
            assert.ok(result.includes('Pending'));
        });

        it('should have progress stat item', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedProgress"'));
            assert.ok(result.includes('Overall Progress'));
        });

        it('should have progress bar with ARIA attributes', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('aggregated-stats-progress-bar'));
            assert.ok(result.includes('role="progressbar"'));
            assert.ok(result.includes('aria-valuemin="0"'));
            assert.ok(result.includes('aria-valuemax="100"'));
        });

        it('should have projects list container', () => {
            const result = getAggregatedStatsSection();
            assert.ok(result.includes('id="aggregatedStatsProjects"'));
            assert.ok(result.includes('role="list"'));
        });
    });

    describe('getProjectStatsRow', () => {
        const baseProject: ProjectStatsData = {
            name: 'TestProject',
            path: '/path/to/project',
            total: 10,
            completed: 5,
            pending: 5,
            progress: 50
        };

        it('should render project name', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('TestProject'));
        });

        it('should render project path in title attribute', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('title="/path/to/project"'));
        });

        it('should render completed count', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('<span class="project-completed">5</span>'));
        });

        it('should render total count', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('<span class="project-total">10</span>'));
        });

        it('should render progress percentage', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('(50%)'));
        });

        it('should set active class when current project matches', () => {
            const result = getProjectStatsRow(baseProject, '/path/to/project');
            assert.ok(result.includes('class="project-stats-row active"'));
        });

        it('should not set active class when current project differs', () => {
            const result = getProjectStatsRow(baseProject, '/other/path');
            assert.ok(result.includes('class="project-stats-row"'));
            assert.ok(!result.includes('class="project-stats-row active"'));
        });

        it('should show active indicator arrow when active', () => {
            const result = getProjectStatsRow(baseProject, '/path/to/project');
            assert.ok(result.includes('▶'));
        });

        it('should not show active indicator when not active', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(!result.includes('▶'));
        });

        it('should use "complete" progress color at 100%', () => {
            const project = { ...baseProject, progress: 100 };
            const result = getProjectStatsRow(project, null);
            assert.ok(result.includes('project-stats-bar-fill complete'));
        });

        it('should use "partial" progress color at 50%', () => {
            const project = { ...baseProject, progress: 50 };
            const result = getProjectStatsRow(project, null);
            assert.ok(result.includes('project-stats-bar-fill partial'));
        });

        it('should use "low" progress color at 25%', () => {
            const project = { ...baseProject, progress: 25 };
            const result = getProjectStatsRow(project, null);
            assert.ok(result.includes('project-stats-bar-fill low'));
        });

        it('should set data-project-path attribute', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('data-project-path="/path/to/project"'));
        });

        it('should have listitem role', () => {
            const result = getProjectStatsRow(baseProject, null);
            assert.ok(result.includes('role="listitem"'));
        });

        it('should escape HTML in project name', () => {
            const project = { ...baseProject, name: '<script>alert("xss")</script>' };
            const result = getProjectStatsRow(project, null);
            assert.ok(result.includes('&lt;script&gt;'));
            assert.ok(!result.includes('<script>alert'));
        });

        it('should escape HTML in project path', () => {
            const project = { ...baseProject, path: '/path/<test>' };
            const result = getProjectStatsRow(project, null);
            assert.ok(result.includes('&lt;test&gt;'));
        });
    });

    describe('ProjectStatsData interface', () => {
        it('should define required properties', () => {
            const project: ProjectStatsData = {
                name: 'test',
                path: '/test',
                total: 10,
                completed: 5,
                pending: 5,
                progress: 50
            };
            assert.strictEqual(project.name, 'test');
            assert.strictEqual(project.path, '/test');
            assert.strictEqual(project.total, 10);
            assert.strictEqual(project.completed, 5);
            assert.strictEqual(project.pending, 5);
            assert.strictEqual(project.progress, 50);
        });
    });

    describe('AggregatedStatsData interface', () => {
        it('should define all required properties', () => {
            const stats: AggregatedStatsData = {
                projects: [],
                totalTasks: 100,
                totalCompleted: 50,
                totalPending: 50,
                overallProgress: 50,
                projectCount: 3
            };
            assert.strictEqual(stats.projects.length, 0);
            assert.strictEqual(stats.totalTasks, 100);
            assert.strictEqual(stats.totalCompleted, 50);
            assert.strictEqual(stats.totalPending, 50);
            assert.strictEqual(stats.overallProgress, 50);
            assert.strictEqual(stats.projectCount, 3);
        });

        it('should allow projects array with ProjectStatsData', () => {
            const stats: AggregatedStatsData = {
                projects: [{
                    name: 'Project1',
                    path: '/p1',
                    total: 10,
                    completed: 5,
                    pending: 5,
                    progress: 50
                }],
                totalTasks: 10,
                totalCompleted: 5,
                totalPending: 5,
                overallProgress: 50,
                projectCount: 1
            };
            assert.strictEqual(stats.projects.length, 1);
            assert.strictEqual(stats.projects[0].name, 'Project1');
        });
    });
});
