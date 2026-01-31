import { Task, TaskRequirements, DEFAULT_REQUIREMENTS, ProjectInfo } from '../types';

export const Icons = {
    play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    stop: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
    step: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><rect x="15" y="4" width="4" height="16"/></svg>',
    skip: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="4 5 14 12 4 19 4 5"/><polygon points="14 5 24 12 14 19 14 5"/></svg>',
    retry: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    completeAll: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/><path d="M9 5l-4 4-2-2"/></svg>',
    resetAll: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
    filter: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    search: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    clear: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    infoCircle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warningTriangle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    errorCircle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    autoScroll: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><polyline points="19 12 12 19 5 12"/></svg>',
    refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

export function getLogo(size: number = 24): string {
    return `<svg class="ralph-logo" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f97316"/>
                <stop offset="50%" style="stop-color:#ec4899"/>
                <stop offset="100%" style="stop-color:#8b5cf6"/>
            </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="13" fill="white"/>
        <circle cx="16" cy="16" r="13" stroke="url(#logoGradient)" stroke-width="3" fill="none"/>
        <text x="16" y="21" text-anchor="middle" font-size="14" font-weight="bold" fill="url(#logoGradient)">R</text>
    </svg>`;
}

export function getHeader(projects: ProjectInfo[] = [], currentProject: string | null = null): string {
    let projectSelector = '';
    
    if (projects.length > 0) {
        // If there's only one project and it matches current, maybe show just name or nothing?
        // But requested is "project selector dropdown".
        // Let's show dropdown if > 1 project, or just a label if 1?
        // Let's assume > 0 we show dropdown for extensibility, or > 1.
        // PRD says "Add project selector dropdown" under "Multi-Project Support".
        // It implies ability to switch. If > 1, switch is meaningful.
        // If 1, it's just info.
        
        if (projects.length > 1) {
            const options = projects.map(p => {
                const selected = p.path === currentProject ? 'selected' : '';
                return `<option value="${p.path}" ${selected}>${p.name}</option>`;
            }).join('');
            
            projectSelector = `
            <div class="project-selector">
                <select id="projectSelect" aria-label="Select project" onchange="send('switchProject', { projectPath: this.value })">
                    ${options}
                </select>
            </div>`;
        } else if (projects.length === 1) {
             // Just show name? Or hidden?
             // Maybe simpler to not show anything if only 1 project to keep UI clean
             // unless user explicitly wants to see which project is active.
             // Let's skip for length === 1 for now to match current behavior
             projectSelector = '';
        }
    }

    return `
    <div class="header idle" id="header" role="banner">
        <div class="header-content">
            <div class="title-group">
                <div class="title">
                    ${getLogo()}
                    <h1>Ralph</h1>
                    <div class="status-pill" id="statusPill" role="status" aria-live="polite" aria-label="Automation status">
                        <span class="status-dot" aria-hidden="true"></span>
                        <span id="statusText">Ready</span>
                    </div>
                </div>
                ${projectSelector}
            </div>
            <div class="header-right">
                <div class="timing-display" id="timingDisplay" role="timer" aria-label="Session timing">
                    <div class="timing-item">
                        <span class="timing-label" id="elapsedLabel">Elapsed</span>
                        <span class="timing-value" id="elapsedTime" aria-labelledby="elapsedLabel">00:00:00</span>
                    </div>
                    <div class="timing-item">
                        <span class="timing-label" id="etaLabel">ETA</span>
                        <span class="timing-value" id="etaTime" aria-labelledby="etaLabel">--:--:--</span>
                    </div>
                </div>
                <div class="countdown" id="countdown" role="timer" aria-live="polite" aria-label="Countdown to next task">
                    <div class="countdown-clock" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 28 28">
                            <defs>
                                <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#f97316"/>
                                    <stop offset="100%" style="stop-color:#8b5cf6"/>
                                </linearGradient>
                            </defs>
                            <circle class="countdown-clock-bg" cx="14" cy="14" r="11"/>
                            <circle class="countdown-clock-fill" id="clockFill" cx="14" cy="14" r="11" stroke-dasharray="69.115" stroke-dashoffset="69.115"/>
                        </svg>
                    </div>
                    <span>Next task</span>
                </div>
            </div>
        </div>
    </div>`;
}

export function getControls(hasPrd: boolean): string {
    return `
    <div class="controls" role="toolbar" aria-label="Automation controls">
        <button class="primary" id="btnStart" onclick="send('start')" ${!hasPrd ? 'disabled' : ''} aria-label="Start automation" title="Start automation">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.play}</span> Start
        </button>
        <button class="secondary" id="btnPause" onclick="send('pause')" disabled aria-label="Pause automation" title="Pause automation">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.pause}</span> Pause
        </button>
        <button class="secondary" id="btnResume" onclick="send('resume')" disabled style="display:none" aria-label="Resume automation" title="Resume automation">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.play}</span> Resume
        </button>
        <button class="danger" id="btnStop" onclick="send('stop')" disabled aria-label="Stop automation" title="Stop automation">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.stop}</span> Stop
        </button>
        <div class="spacer"></div>
        <button class="secondary" id="btnNext" onclick="send('next')" ${!hasPrd ? 'disabled' : ''} aria-label="Execute single step" title="Execute single step">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.step}</span> Step
        </button>
        <button class="secondary" id="btnSkip" onclick="send('skipTask')" ${!hasPrd ? 'disabled' : ''} aria-label="Skip current task" title="Skip current task">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.skip}</span> Skip
        </button>
        <button class="secondary" id="btnRetry" onclick="send('retryTask')" ${!hasPrd ? 'disabled' : ''} aria-label="Retry failed task" title="Retry failed task">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.retry}</span> Retry
        </button>
        <button class="secondary" id="btnCompleteAll" onclick="send('completeAllTasks')" ${!hasPrd ? 'disabled' : ''} aria-label="Mark all tasks as complete" title="Mark all tasks as complete">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.completeAll}</span> Complete All
        </button>
        <button class="secondary" id="btnResetAll" onclick="send('resetAllTasks')" ${!hasPrd ? 'disabled' : ''} aria-label="Reset all tasks to pending" title="Reset all tasks to pending">
            <span class="btn-spinner" aria-hidden="true"></span>
            <span class="btn-icon" aria-hidden="true">${Icons.resetAll}</span> Reset All
        </button>
        <button class="secondary icon-only" onclick="send('refresh')" title="Refresh" aria-label="Refresh panel">
            ${Icons.refresh}
        </button>
        <button class="secondary icon-only" onclick="openSettings()" title="Settings" aria-label="Open settings">
            ${Icons.settings}
        </button>
    </div>`;
}

// Validation constants for PRD input
export const PRD_INPUT_MIN_LENGTH = 10;
export const PRD_INPUT_MAX_LENGTH = 2000;

export function getSetupSection(): string {
    return `
    <div class="setup-section" role="region" aria-label="Project setup">
        <div class="setup-header">
            <span class="setup-icon" aria-hidden="true">${Icons.rocket}</span>
            <span>Get Started with Ralph</span>
        </div>
        <p class="setup-description" id="taskInputDescription">
            Describe what you want to build and Ralph will create a PRD.md with structured tasks.
        </p>
        <div class="setup-input-group">
            <div class="textarea-wrapper">
                <textarea
                    id="taskInput"
                    class="setup-textarea"
                    placeholder="Example: Build a todo app with React that has add, delete, and mark complete functionality. Use TypeScript and Tailwind CSS for styling."
                    rows="4"
                    aria-label="Project description"
                    aria-describedby="taskInputDescription taskInputError"
                    aria-invalid="false"
                    maxlength="${PRD_INPUT_MAX_LENGTH}"
                ></textarea>
                <div class="textarea-char-count" id="taskInputCharCount" aria-live="polite">
                    <span id="charCountValue">0</span>/<span>${PRD_INPUT_MAX_LENGTH}</span>
                </div>
            </div>
            <div class="validation-message" id="taskInputError" role="alert" aria-live="assertive"></div>
            <button class="primary generate-btn" onclick="generatePrd()" aria-label="Generate PRD and tasks from description">
                <span class="btn-spinner" aria-hidden="true"></span>
                <span class="btn-icon" aria-hidden="true">${Icons.star}</span>Generate PRD & Tasks
            </button>
        </div>
    </div>`;
}

/**
 * Icon for collapsible section toggle (chevron).
 */
export const CollapsibleIcons = {
    chevronDown: '<svg class="section-toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    zoomIn: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    zoomOut: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
    zoomReset: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    download: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

export function getTimelineSection(): string {
    return `
    <div class="timeline-section collapsible-section" id="timelineSection" role="region" aria-label="Task timeline">
        <div class="timeline-header section-header-collapsible" onclick="toggleSection('timelineContent', 'timelineToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="timelineContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('timelineContent','timelineToggle',this);}">
            <span id="timelineTitle">Task Timeline</span>
            <div class="section-header-right">
                <div class="zoom-controls" role="group" aria-label="Timeline zoom controls" onclick="event.stopPropagation()">
                    <button class="icon-only small" onclick="zoomTimeline(-1)" title="Zoom Out" aria-label="Zoom out timeline">${CollapsibleIcons.zoomOut}</button>
                    <button class="icon-only small" onclick="resetZoom()" title="Reset Zoom" aria-label="Reset timeline zoom">${CollapsibleIcons.zoomReset}</button>
                    <button class="icon-only small" onclick="zoomTimeline(1)" title="Zoom In" aria-label="Zoom in timeline">${CollapsibleIcons.zoomIn}</button>
                </div>
                <div class="export-controls" role="group" aria-label="Export timeline" onclick="event.stopPropagation()" style="margin-left: 4px; display: flex;">
                    <button class="icon-only small" onclick="activeExportData()" title="Export Timeline Data" aria-label="Export timeline data">${CollapsibleIcons.download}</button>
                </div>
                <span id="timelineCount" aria-label="Task completion count">0/0</span>
                <span class="section-toggle expanded" id="timelineToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="timeline-content section-content" id="timelineContent" role="img" aria-labelledby="timelineTitle" aria-describedby="timelineCount">
            <div class="timeline-empty" id="timelineEmpty" role="status">No tasks completed yet</div>
            <div class="timeline-scroll-container">
                <div class="timeline-bars" id="timelineBars" style="display: none;" aria-hidden="true"></div>
                <div class="timeline-labels" id="timelineLabels" style="display: none;" aria-hidden="true"></div>
            </div>
        </div>
    </div>`;
}

function getRequirementItem(id: string, label: string, icon: string, checked: boolean = false): string {
    return `
    <div class="requirement-item">
        <input type="checkbox" id="${id}" onchange="updateRequirements()"${checked ? ' checked' : ''} aria-describedby="requirements-desc">
        <label for="${id}"><span aria-hidden="true">${icon}</span> ${label}</label>
    </div>`;
}

export function getRequirementsSection(requirements: TaskRequirements = DEFAULT_REQUIREMENTS): string {
    const checkIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>';
    const testIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>';
    const playIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    const typeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>';
    const lintIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    const docIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
    const commitIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>';

    return `
    <div class="requirements-section" id="requirementsSection" role="region" aria-label="Acceptance criteria">
        <div class="requirements-header" onclick="toggleRequirements()" role="button" tabindex="0" aria-expanded="true" aria-controls="reqContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleRequirements();}">
            <span class="requirements-header-title">
                ${checkIcon}
                Acceptance Criteria
            </span>
            <span class="requirements-toggle expanded" id="reqToggle" aria-hidden="true">▼</span>
        </div>
        <div class="requirements-content" id="reqContent" role="group" aria-label="Acceptance criteria checkboxes">
            <div class="requirements-desc" id="requirements-desc">Actions the agent must complete before moving to the next task:</div>
            ${getRequirementItem('reqWriteTests', 'Write unit tests', testIcon, requirements.writeTests)}
            ${getRequirementItem('reqRunTests', 'Run tests', playIcon, requirements.runTests)}
            ${getRequirementItem('reqTypeCheck', 'Type check (tsc)', typeIcon, requirements.runTypeCheck)}
            ${getRequirementItem('reqLinting', 'Run linting', lintIcon, requirements.runLinting)}
            ${getRequirementItem('reqDocs', 'Update documentation', docIcon, requirements.updateDocs)}
            ${getRequirementItem('reqCommit', 'Commit changes', commitIcon, requirements.commitChanges)}
        </div>
    </div>`;
}

/**
 * Icons for task details panel.
 */
export const TaskDetailIcons = {
    id: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/></svg>',
    status: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    dependency: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
    line: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    complexity: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    estimatedTime: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M22 12c0-5.523-4.477-10-10-10" stroke-dasharray="4 2" opacity="0.5"/></svg>',
    relatedFiles: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
    acceptanceCriteria: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>'
};

/**
 * Common file extensions used in software projects.
 */
const FILE_EXTENSIONS = [
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
    'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs',
    'go', 'rs', 'rb', 'php', 'swift', 'kt', 'scala',
    'html', 'css', 'scss', 'sass', 'less',
    'json', 'yaml', 'yml', 'xml', 'toml', 'ini', 'env',
    'md', 'txt', 'rst', 'mdx',
    'sql', 'graphql', 'gql',
    'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd',
    'dockerfile', 'makefile', 'gitignore'
];

/**
 * Extracts related file paths and patterns from a task description.
 * Looks for file extensions, path patterns, and common file references.
 * @param description - The task description to analyze
 * @returns Array of related file paths/patterns found
 */
export function extractRelatedFiles(description: string): string[] {
    const files: Set<string> = new Set();
    
    // Pattern 1: Files with extensions (e.g., file.ts, src/utils.js, ./components/Button.tsx)
    const extensionPattern = new RegExp(
        `(?:^|[\\s'"(\`])([a-zA-Z0-9_.\\-/]+\\.(${FILE_EXTENSIONS.join('|')}))(?:[\\s'")\`]|$)`,
        'gi'
    );
    let match;
    while ((match = extensionPattern.exec(description)) !== null) {
        const file = match[1].trim();
        if (file && !file.startsWith('.') || file.startsWith('./') || file.startsWith('../')) {
            files.add(file);
        } else if (file) {
            files.add(file);
        }
    }
    
    // Pattern 2: Backtick-quoted file paths (e.g., \`src/utils.ts\`)
    const backtickPattern = /`([a-zA-Z0-9_.\/\-]+\.[a-zA-Z0-9]+)`/g;
    while ((match = backtickPattern.exec(description)) !== null) {
        const file = match[1].trim();
        if (file && FILE_EXTENSIONS.some(ext => file.toLowerCase().endsWith('.' + ext))) {
            files.add(file);
        }
    }
    
    // Pattern 3: Common file keywords (e.g., "in config.ts", "the index.js file")
    const keywordPattern = /(?:in|the|file|update|modify|edit|create|add to|change)\s+([a-zA-Z0-9_.\/\-]+\.[a-zA-Z0-9]+)/gi;
    while ((match = keywordPattern.exec(description)) !== null) {
        const file = match[1].trim();
        if (file && FILE_EXTENSIONS.some(ext => file.toLowerCase().endsWith('.' + ext))) {
            files.add(file);
        }
    }
    
    // Pattern 4: Directory paths (e.g., src/components/, ./lib/)
    const dirPattern = /(?:^|[\s'"`])([a-zA-Z0-9_.\-]+(?:\/[a-zA-Z0-9_.\-]+)+)\/?(?:[\s'"`]|$)/g;
    while ((match = dirPattern.exec(description)) !== null) {
        const dir = match[1].trim();
        // Only add if it looks like a path (has slashes) and doesn't have a file extension
        if (dir && dir.includes('/') && !FILE_EXTENSIONS.some(ext => dir.toLowerCase().endsWith('.' + ext))) {
            files.add(dir + '/');
        }
    }
    
    // Pattern 5: Glob patterns (e.g., **/*.ts, src/*.js)
    const globPattern = /(?:^|[\s'"`])(\*\*?\/[a-zA-Z0-9_.*\-\/]+|\*\.[a-zA-Z0-9]+)(?:[\s'"`]|$)/g;
    while ((match = globPattern.exec(description)) !== null) {
        const glob = match[1].trim();
        if (glob) {
            files.add(glob);
        }
    }
    
    return Array.from(files).slice(0, 10); // Limit to 10 files max
}

/**
 * Generates the HTML for task details panel.
 * Shows task metadata like ID, status, dependencies, and line number.
 * @param task - The task to show details for
 * @returns HTML string for task details panel
 */
export function getTaskDetailsHtml(task: Task): string {
    const statusLabels: Record<string, string> = {
        'PENDING': 'Pending',
        'IN_PROGRESS': 'In Progress',
        'COMPLETE': 'Complete',
        'BLOCKED': 'Blocked',
        'SKIPPED': 'Skipped'
    };
    
    const statusClasses: Record<string, string> = {
        'PENDING': 'pending',
        'IN_PROGRESS': 'in-progress',
        'COMPLETE': 'complete',
        'BLOCKED': 'blocked',
        'SKIPPED': 'skipped'
    };
    
    // Get complexity indicator based on description length and keywords
    const complexity = estimateTaskComplexity(task.description);
    
    // Build dependencies list
    const dependenciesHtml = task.dependencies && task.dependencies.length > 0
        ? task.dependencies.map(dep => `<span class="task-detail-dependency">${escapeHtml(dep)}</span>`).join('')
        : '<span class="task-detail-none">No dependencies</span>';
    
    // Extract and build related files list
    const relatedFiles = extractRelatedFiles(task.description);
    const relatedFilesHtml = relatedFiles.length > 0
        ? relatedFiles.map(file => `<span class="task-detail-related-file" title="${escapeHtml(file)}">${escapeHtml(file)}</span>`).join('')
        : '<span class="task-detail-none">No files detected</span>';
    
    // Build acceptance criteria list
    const acceptanceCriteriaHtml = task.acceptanceCriteria && task.acceptanceCriteria.length > 0
        ? `<ul class="task-detail-criteria-list" role="list">${task.acceptanceCriteria.map(criterion => 
            `<li class="task-detail-criterion" role="listitem"><span class="criterion-bullet" aria-hidden="true">✓</span>${escapeHtml(criterion)}</li>`
        ).join('')}</ul>`
        : '<span class="task-detail-none">No acceptance criteria defined</span>';
    
    return `
    <div class="task-details-panel" id="taskDetailsPanel" role="region" aria-label="Task details" aria-hidden="true" style="display: none;">
        <div class="task-details-content">
            <div class="task-detail-row">
                <span class="task-detail-label">${TaskDetailIcons.id}<span>Task ID</span></span>
                <span class="task-detail-value task-detail-id">${escapeHtml(task.id)}</span>
            </div>
            <div class="task-detail-row">
                <span class="task-detail-label">${TaskDetailIcons.status}<span>Status</span></span>
                <span class="task-detail-value task-detail-status ${statusClasses[task.status] || 'pending'}">${statusLabels[task.status] || task.status}</span>
            </div>
            <div class="task-detail-row">
                <span class="task-detail-label">${TaskDetailIcons.line}<span>Line Number</span></span>
                <span class="task-detail-value task-detail-line">${task.lineNumber}</span>
            </div>
            <div class="task-detail-row">
                <span class="task-detail-label">${TaskDetailIcons.complexity}<span>Complexity</span></span>
                <span class="task-detail-value task-detail-complexity ${complexity.class}">${complexity.label}</span>
            </div>
            <div class="task-detail-row" id="estimatedTimeRow">
                <span class="task-detail-label">${TaskDetailIcons.estimatedTime}<span>Est. Time</span></span>
                <span class="task-detail-value task-detail-estimated-time" id="taskEstimatedTime" aria-live="polite">
                    <span class="estimated-time-value" id="estimatedTimeValue">--</span>
                    <span class="estimated-time-source" id="estimatedTimeSource"></span>
                </span>
            </div>
            <div class="task-detail-row task-detail-related-files-row" id="relatedFilesRow">
                <span class="task-detail-label">${TaskDetailIcons.relatedFiles}<span>Related Files</span></span>
                <div class="task-detail-related-files" id="taskRelatedFiles" aria-label="Files that may be affected">${relatedFilesHtml}</div>
            </div>
            <div class="task-detail-row task-detail-acceptance-criteria-row" id="acceptanceCriteriaRow">
                <span class="task-detail-label">${TaskDetailIcons.acceptanceCriteria}<span>Acceptance Criteria</span></span>
                <div class="task-detail-acceptance-criteria" id="taskAcceptanceCriteria" aria-label="Acceptance criteria for this task">${acceptanceCriteriaHtml}</div>
            </div>
            <div class="task-detail-row task-detail-dependencies-row">
                <span class="task-detail-label">${TaskDetailIcons.dependency}<span>Dependencies</span></span>
                <div class="task-detail-dependencies">${dependenciesHtml}</div>
            </div>
        </div>
    </div>`;
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
    const div = { innerHTML: '' };
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Estimates task complexity based on description content.
 * Uses heuristics like length, keywords, and structure.
 * @param description - The task description
 * @returns Object with complexity label and CSS class
 */
export function estimateTaskComplexity(description: string): { label: string; class: string } {
    const lowerDesc = description.toLowerCase();
    const length = description.length;
    
    // High complexity indicators
    const highComplexityKeywords = ['refactor', 'architect', 'redesign', 'migrate', 'implement', 'integration', 'system', 'infrastructure'];
    const hasHighKeyword = highComplexityKeywords.some(keyword => lowerDesc.includes(keyword));
    
    // Medium complexity indicators  
    const mediumComplexityKeywords = ['add', 'create', 'build', 'update', 'enhance', 'extend', 'modify'];
    const hasMediumKeyword = mediumComplexityKeywords.some(keyword => lowerDesc.includes(keyword));
    
    // Low complexity indicators
    const lowComplexityKeywords = ['fix', 'typo', 'rename', 'remove', 'delete', 'cleanup', 'comment'];
    const hasLowKeyword = lowComplexityKeywords.some(keyword => lowerDesc.includes(keyword));
    
    // Scoring based on multiple factors
    let score = 0;
    
    // Length factor (longer descriptions often mean more complex tasks)
    if (length > 100) {score += 2;}
    else if (length > 50) {score += 1;}
    
    // Keyword factor
    if (hasHighKeyword) {score += 3;}
    if (hasMediumKeyword) {score += 1;}
    if (hasLowKeyword) {score -= 1;}
    
    // Determine complexity level
    if (score >= 4) {
        return { label: 'High', class: 'complexity-high' };
    } else if (score >= 2) {
        return { label: 'Medium', class: 'complexity-medium' };
    } else {
        return { label: 'Low', class: 'complexity-low' };
    }
}

export function getTaskSection(nextTask: Task | null, hasAnyTasks: boolean): string {
    if (nextTask) {
        // Build task details preview section
        const taskDetails = getTaskDetailsHtml(nextTask);
        
        return `
        <div class="task-section active collapsible-section" id="taskSection" role="region" aria-label="Current task">
            <div class="task-header section-header-collapsible" onclick="toggleSection('taskContent', 'taskToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="taskContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('taskContent','taskToggle',this);}">
                <span class="task-label" id="taskLabel">Current Task</span>
                <div class="task-header-actions">
                    <button class="task-details-toggle" id="btnTaskDetails" onclick="event.stopPropagation(); toggleTaskDetails();" title="Show task details" aria-label="Toggle task details" aria-expanded="false" aria-controls="taskDetailsPanel">
                        ${Icons.infoCircle}
                    </button>
                    <span class="section-toggle expanded" id="taskToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
                </div>
            </div>
            <div class="task-content section-content" id="taskContent">
                <div class="task-text" id="taskText" aria-labelledby="taskLabel" role="status" aria-live="polite">${nextTask.description}</div>
                ${taskDetails}
                <div class="task-progress" id="taskProgress" role="progressbar" aria-label="Task execution progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="task-progress-bar" id="taskProgressBar" style="width: 0%"></div>
                </div>
            </div>
        </div>`;
    } else if (hasAnyTasks) {
        return `
        <div class="task-section collapsible-section" role="region" aria-label="Task status">
            <div class="empty-state" role="status" aria-live="polite">
                <div class="empty-state-icon" aria-hidden="true">${Icons.check}</div>
                <div>All tasks completed!</div>
            </div>
        </div>`;
    }
    return '';
}

export function getPendingTasksSection(tasks: Task[]): string {
    const pendingTasks = tasks.filter(t => t.status === 'PENDING' || t.status === 'BLOCKED' || t.status === 'SKIPPED' || t.status === 'IN_PROGRESS');
    
    // If no pending tasks, don't show the queue
    if (pendingTasks.length <= 1) {return '';} 
    
    // Icon for drag handle
    const dragHandle = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="drag-handle-icon" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';

    const listItems = pendingTasks.map((task) => {
        return `
        <div class="task-queue-item" draggable="true" data-task-id="${task.id}" role="listitem" tabindex="0" aria-label="Task: ${task.description}. Press Enter to start dragging.">
            <span class="drag-handle">${dragHandle}</span>
            <span class="task-queue-text">${task.description}</span>
        </div>`;
    }).join('');

    return `
    <div class="task-queue-section collapsible-section" id="taskQueueSection" role="region" aria-label="Task Queue">
        <div class="task-header section-header-collapsible" onclick="toggleSection('taskQueueContent', 'taskQueueToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="taskQueueContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('taskQueueContent','taskQueueToggle',this);}">
             <span class="task-label">Upcoming Tasks</span>
             <span class="section-toggle expanded" id="taskQueueToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
        </div>
        <div class="task-queue-content section-content" id="taskQueueContent" role="list">
             <div class="task-queue-list" id="taskQueueList">
                ${listItems}
             </div>
             <div class="queue-hint">Drag and drop to reorder tasks</div>
        </div>
    </div>`;
}

/** Log level types for filtering */
export type LogLevel = 'all' | 'info' | 'warning' | 'error' | 'success';

/** Log filter button configuration */
export interface LogFilterConfig {
    level: LogLevel;
    label: string;
    icon: string;
    ariaLabel: string;
}

/** Get log filter buttons configuration */
export function getLogFilterButtons(): LogFilterConfig[] {
    return [
        { level: 'all', label: 'All', icon: Icons.filter, ariaLabel: 'Show all log entries' },
        { level: 'info', label: 'Info', icon: Icons.infoCircle, ariaLabel: 'Show info log entries only' },
        { level: 'warning', label: 'Warn', icon: Icons.warningTriangle, ariaLabel: 'Show warning log entries only' },
        { level: 'error', label: 'Error', icon: Icons.errorCircle, ariaLabel: 'Show error log entries only' },
    ];
}

export function getLogSection(): string {
    const filterButtons = getLogFilterButtons();
    const filterButtonsHtml = filterButtons.map((btn, index) => 
        `<button class="log-filter-btn${btn.level === 'all' ? ' active' : ''}" 
                data-level="${btn.level}" 
                onclick="filterLogs('${btn.level}')" 
                aria-label="${btn.ariaLabel}" 
                aria-pressed="${btn.level === 'all' ? 'true' : 'false'}"
                title="${btn.ariaLabel}">
            <span class="log-filter-icon" aria-hidden="true">${btn.icon}</span>
            <span class="log-filter-label">${btn.label}</span>
        </button>`
    ).join('');

    return `
    <div class="log-section collapsible-section" role="log" aria-label="Activity log" aria-live="polite">
        <div class="log-header section-header-collapsible" onclick="toggleSection('logContent', 'logToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="logContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('logContent','logToggle',this);}">
            <span id="logHeaderTitle">Activity</span>
            <div class="section-header-right">
                <button class="log-action-btn log-timestamp-toggle" 
                        id="btnToggleTimestamp" 
                        onclick="event.stopPropagation(); toggleTimestamps();" 
                        aria-label="Toggle timestamp visibility" 
                        aria-pressed="true"
                        title="Toggle timestamps">
                    <span class="log-action-icon" aria-hidden="true">${Icons.clock}</span>
                    <span class="log-action-label">Time</span>
                </button>
                <button class="log-action-btn log-autoscroll-toggle" 
                        id="btnToggleAutoScroll" 
                        onclick="event.stopPropagation(); toggleAutoScroll();" 
                        aria-label="Toggle auto-scroll" 
                        aria-pressed="true"
                        title="Auto-scroll to latest log entries">
                    <span class="log-action-icon" aria-hidden="true">${Icons.autoScroll}</span>
                    <span class="log-action-label">Auto</span>
                </button>
                <button class="log-action-btn" 
                        id="btnCopyLog" 
                        onclick="event.stopPropagation(); copyLog();" 
                        aria-label="Copy log to clipboard" 
                        title="Copy log to clipboard">
                    <span class="log-action-icon" aria-hidden="true">${Icons.copy}</span>
                    <span class="log-action-label">Copy</span>
                </button>
                <button class="log-action-btn" 
                        id="btnExportLog" 
                        onclick="event.stopPropagation(); exportLog();" 
                        aria-label="Export log to file" 
                        title="Export log to file">
                    <span class="log-action-icon" aria-hidden="true">${CollapsibleIcons.download}</span>
                    <span class="log-action-label">Export</span>
                </button>
                <span class="section-toggle expanded" id="logToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="log-filters" role="group" aria-label="Log level filters">
            ${filterButtonsHtml}
            <span class="log-filter-count" id="logFilterCount" aria-live="polite" aria-atomic="true"></span>
        </div>
        <div class="log-search-container" role="search" aria-label="Search log entries">
            <span class="log-search-icon" aria-hidden="true">${Icons.search}</span>
            <input type="text" 
                   id="logSearchInput" 
                   class="log-search-input" 
                   placeholder="Search logs..." 
                   aria-label="Search log entries" 
                   oninput="searchLogs(this.value)" 
                   onkeydown="if(event.key==='Escape'){clearLogSearch();event.target.blur();}" />
            <button class="log-search-clear" 
                    id="logSearchClear" 
                    onclick="clearLogSearch()" 
                    aria-label="Clear search" 
                    title="Clear search (Escape)" 
                    style="display: none;">
                ${Icons.clear}
            </button>
            <span class="log-search-count" id="logSearchCount" aria-live="polite" aria-atomic="true"></span>
        </div>
        <div class="log-content section-content" id="logContent" role="list" aria-labelledby="logHeaderTitle">
            <div id="logArea">
                <div class="log-entry info" data-level="info" role="listitem">
                    <span class="log-time" aria-label="Time">--:--</span>
                    <span class="log-msg">Ready to start</span>
                </div>
            </div>
        </div>
    </div>`;
}

const EXTENSION_VERSION = '0.5.0';

export function getFooter(): string {
    return `
    <div class="footer" role="contentinfo">
        <div class="footer-warning" role="alert">
            <span aria-hidden="true">⚠️</span> <strong>Cost Notice:</strong> Each task step spawns one new chat session using your selected model.
        </div>
        <div>
            <a href="https://github.com/aymenfurter/ralph" target="_blank" rel="noopener noreferrer" aria-label="Visit Ralph on GitHub">GitHub: aymenfurter/ralph</a>
            <span class="footer-version" aria-label="Version">v${EXTENSION_VERSION}</span>
        </div>
        <div class="footer-disclaimer">
            Side project, not officially endorsed by or affiliated with the GitHub Copilot team. "GitHub Copilot" is a trademark of GitHub, Inc.
        </div>
    </div>`;
}

/**
 * Returns the screen reader announcer element.
 * This is a visually hidden live region that announces status changes to screen readers.
 */
export function getScreenReaderAnnouncer(): string {
    return `<div id="srAnnouncer" class="sr-announcer" role="status" aria-live="assertive" aria-atomic="true"></div>`;
}

export interface SettingsOverlayOptions {
    maxIterations: number;
}

export function getSettingsOverlay(settings?: SettingsOverlayOptions): string {
    const maxIterations = settings?.maxIterations ?? 50;
    const settingsIcon = Icons.settings;
    const closeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    const clockIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';

    return `
    <div class="settings-overlay" id="settingsOverlay" role="dialog" aria-labelledby="settingsTitle" aria-modal="true">
        <div class="settings-header">
            <h2 id="settingsTitle"><span aria-hidden="true">${settingsIcon}</span> Settings</h2>
            <button class="settings-close" onclick="closeSettings()" aria-label="Close settings">${closeIcon}</button>
        </div>
        <div class="settings-body">
            <div class="settings-section" role="group" aria-labelledby="safetyLimitsTitle">
                <div class="settings-section-title" id="safetyLimitsTitle">Safety Limits</div>
                <div class="requirement-item">
                    <label for="settingMaxIterations" style="display: flex; align-items: center; gap: 8px;">
                        <span aria-hidden="true">${clockIcon}</span>
                        Max iterations:
                        <input type="number" id="settingMaxIterations" min="0" max="100" value="${maxIterations}" onchange="updateSettings()" style="width: 60px; padding: 4px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 3px;" aria-describedby="maxIterationsHelp">
                    </label>
                </div>
                <div class="setting-help" id="maxIterationsHelp">Maximum number of task iterations before auto-stop (0 = unlimited).</div>
            </div>
        </div>
    </div>`;
}

/**
 * Toast notification icons for each type.
 */
export const ToastIcons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    dismiss: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

/**
 * Returns the toast container element for displaying toast notifications.
 * The container is positioned in the top-right corner of the panel.
 */
export function getToastContainer(): string {
    return `<div id="toastContainer" class="toast-container" role="region" aria-label="Notifications" aria-live="polite"></div>`;
}
/**
 * Returns skeleton loader HTML for the timeline section.
 * Shows placeholder bars mimicking the timeline visualization.
 */
export function getSkeletonTimeline(): string {
    return `
    <div class="skeleton-timeline" id="skeletonTimeline" role="img" aria-label="Loading timeline" aria-busy="true">
        <div class="skeleton-timeline-bars">
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-bar" aria-hidden="true"></div>
        </div>
        <div class="skeleton-timeline-labels">
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
            <div class="skeleton skeleton-timeline-label" aria-hidden="true"></div>
        </div>
    </div>`;
}

/**
 * Returns skeleton loader HTML for the task section.
 * Shows placeholder text lines mimicking the current task display.
 */
export function getSkeletonTask(): string {
    return `
    <div class="skeleton-task" id="skeletonTask" role="img" aria-label="Loading task" aria-busy="true">
        <div class="skeleton skeleton-task-label" aria-hidden="true"></div>
        <div class="skeleton skeleton-task-text" aria-hidden="true"></div>
        <div class="skeleton skeleton-task-text" aria-hidden="true"></div>
    </div>`;
}

/**
 * Returns skeleton loader HTML for the log section.
 * Shows placeholder log entries mimicking the activity log.
 */
export function getSkeletonLog(): string {
    return `
    <div class="skeleton-log" id="skeletonLog" role="img" aria-label="Loading activity log" aria-busy="true">
        <div class="skeleton-log-header">
            <div class="skeleton skeleton-log-header-text" aria-hidden="true"></div>
        </div>
        <div class="skeleton-log-content">
            <div class="skeleton-log-entry">
                <div class="skeleton skeleton-log-time" aria-hidden="true"></div>
                <div class="skeleton skeleton-log-msg" aria-hidden="true"></div>
            </div>
            <div class="skeleton-log-entry">
                <div class="skeleton skeleton-log-time" aria-hidden="true"></div>
                <div class="skeleton skeleton-log-msg" aria-hidden="true"></div>
            </div>
            <div class="skeleton-log-entry">
                <div class="skeleton skeleton-log-time" aria-hidden="true"></div>
                <div class="skeleton skeleton-log-msg" aria-hidden="true"></div>
            </div>
        </div>
    </div>`;
}

/**
 * Returns skeleton loader HTML for the requirements section.
 * Shows placeholder checkboxes and labels mimicking the acceptance criteria.
 */
export function getSkeletonRequirements(): string {
    return `
    <div class="skeleton-requirements" id="skeletonRequirements" role="img" aria-label="Loading requirements" aria-busy="true">
        <div class="skeleton-requirements-header">
            <div class="skeleton skeleton-requirements-icon" aria-hidden="true"></div>
            <div class="skeleton skeleton-requirements-title" aria-hidden="true"></div>
        </div>
        <div class="skeleton-requirements-content">
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
            <div class="skeleton-requirement-item">
                <div class="skeleton skeleton-requirement-checkbox" aria-hidden="true"></div>
                <div class="skeleton skeleton-requirement-label" aria-hidden="true"></div>
            </div>
        </div>
    </div>`;
}

/**
 * Returns a loading indicator with animated dots.
 * Can be used for inline loading states.
 */
export function getLoadingIndicator(text: string = 'Loading'): string {
    return `
    <div class="skeleton-loading-indicator" role="status" aria-label="${text}">
        <span aria-hidden="true">${text}</span>
        <div class="skeleton-loading-dot" aria-hidden="true"></div>
        <div class="skeleton-loading-dot" aria-hidden="true"></div>
        <div class="skeleton-loading-dot" aria-hidden="true"></div>
    </div>`;
}

/**
 * Returns all skeleton loaders combined for initial panel loading state.
 */
export function getAllSkeletons(): string {
    return `
    ${getSkeletonTimeline()}
    ${getSkeletonRequirements()}
    ${getSkeletonTask()}
    ${getSkeletonLog()}`;
}

/**
 * Icons for lazy loading placeholders
 */
export const LazyLoadIcons = {
    chart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    graph: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    queue: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    settings: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    loading: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lazy-load-spinner-icon" aria-hidden="true"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>'
};

/**
 * Returns a lazy loading placeholder element.
 * Used to show a placeholder while section content is being loaded.
 * 
 * @param sectionId - The section ID for the placeholder
 * @param icon - Optional icon to display (from LazyLoadIcons)
 * @param text - Optional placeholder text
 */
export function getLazyLoadPlaceholder(sectionId: string, icon?: string, text?: string): string {
    const placeholderIcon = icon || LazyLoadIcons.loading;
    const placeholderText = text || 'Loading...';

    return `
    <div class="lazy-section-placeholder" id="${sectionId}Placeholder" role="status" aria-label="Loading ${sectionId}">
        <span class="placeholder-icon">${placeholderIcon}</span>
        <span class="placeholder-text">${placeholderText}</span>
    </div>`;
}

/**
 * List of section IDs that support lazy loading.
 * These sections are loaded on-demand when they become visible in the viewport.
 */
export const LAZY_LOAD_SECTION_IDS = [
    'durationSection',
    'dependencySection',
    'taskQueueSection',
    'settingsOverlay'
] as const;

/**
 * Type for lazy load section IDs.
 */
export type LazyLoadSectionId = typeof LAZY_LOAD_SECTION_IDS[number];

export function getDurationChartSection(): string {
    return `
    <div class="duration-section collapsible-section" id="durationSection" role="region" aria-label="Task duration breakdown">
        <div class="duration-header section-header-collapsible" onclick="toggleSection('durationContent', 'durationToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="durationContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('durationContent','durationToggle',this);}">
            <span id="durationTitle">Task Duration Breakdown</span>
            <div class="section-header-right">
                <span class="section-toggle expanded" id="durationToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="duration-content section-content" id="durationContent" role="img" aria-labelledby="durationTitle">
            <div class="duration-empty" id="durationEmpty" role="status">No tasks completed yet</div>
            <div class="duration-chart" id="durationChart" style="display: none;" aria-hidden="true"></div>
        </div>
    </div>`;
}

export function getDependencyGraphSection(): string {
    return `
    <div class="dependency-section collapsible-section" id="dependencySection" role="region" aria-label="Task dependencies">
        <div class="dependency-header section-header-collapsible" onclick="toggleSection('dependencyContent', 'dependencyToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="dependencyContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('dependencyContent','dependencyToggle',this);}">
            <span id="dependencyTitle">Task Dependencies</span>
            <div class="section-header-right">
                <span class="section-toggle expanded" id="dependencyToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="dependency-content section-content" id="dependencyContent" role="img" aria-labelledby="dependencyTitle">
            <div class="dependency-empty" id="dependencyEmpty" role="status">No simple dependency data available (use 'depends on: "Task Name"')</div>
            <div class="dependency-graph" id="dependencyGraph" style="display: none; height: auto; width: 100%; overflow: auto; padding: 10px;" aria-hidden="true"></div>
        </div>
    </div>`;
}

/**
 * Icons for the aggregated stats section.
 */
export const AggregatedStatsIcons = {
    projects: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
    tasks: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    progress: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>'
};

/**
 * Interface for project stats data.
 */
export interface ProjectStatsData {
    name: string;
    path: string;
    total: number;
    completed: number;
    pending: number;
    progress: number;
}

/**
 * Interface for aggregated stats data.
 */
export interface AggregatedStatsData {
    projects: ProjectStatsData[];
    totalTasks: number;
    totalCompleted: number;
    totalPending: number;
    overallProgress: number;
    projectCount: number;
}

/**
 * Generates HTML for the aggregated statistics section.
 * This section displays combined statistics across all projects.
 */
export function getAggregatedStatsSection(): string {
    return `
    <div class="aggregated-stats-section collapsible-section" id="aggregatedStatsSection" role="region" aria-label="Aggregated statistics across projects">
        <div class="aggregated-stats-header section-header-collapsible" onclick="toggleSection('aggregatedStatsContent', 'aggregatedStatsToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="aggregatedStatsContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('aggregatedStatsContent','aggregatedStatsToggle',this);}">
            <span class="aggregated-stats-icon" aria-hidden="true">${AggregatedStatsIcons.projects}</span>
            <span id="aggregatedStatsTitle">All Projects Overview</span>
            <div class="section-header-right">
                <span class="aggregated-stats-count" id="aggregatedProjectCount" aria-label="Number of projects">0 projects</span>
                <span class="section-toggle expanded" id="aggregatedStatsToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="aggregated-stats-content section-content" id="aggregatedStatsContent">
            <div class="aggregated-stats-empty" id="aggregatedStatsEmpty" role="status">
                <span aria-hidden="true">${AggregatedStatsIcons.projects}</span>
                <span>No projects found or single project active</span>
            </div>
            <div class="aggregated-stats-summary" id="aggregatedStatsSummary" style="display: none;">
                <div class="aggregated-stats-totals" role="group" aria-label="Overall totals">
                    <div class="aggregated-stat-item" role="status">
                        <span class="aggregated-stat-icon" aria-hidden="true">${AggregatedStatsIcons.tasks}</span>
                        <span class="aggregated-stat-value" id="aggregatedTotalTasks">0</span>
                        <span class="aggregated-stat-label">Total Tasks</span>
                    </div>
                    <div class="aggregated-stat-item completed" role="status">
                        <span class="aggregated-stat-icon" aria-hidden="true">${Icons.check}</span>
                        <span class="aggregated-stat-value" id="aggregatedCompleted">0</span>
                        <span class="aggregated-stat-label">Completed</span>
                    </div>
                    <div class="aggregated-stat-item pending" role="status">
                        <span class="aggregated-stat-icon" aria-hidden="true">${Icons.step}</span>
                        <span class="aggregated-stat-value" id="aggregatedPending">0</span>
                        <span class="aggregated-stat-label">Pending</span>
                    </div>
                    <div class="aggregated-stat-item progress" role="status">
                        <span class="aggregated-stat-icon" aria-hidden="true">${AggregatedStatsIcons.progress}</span>
                        <span class="aggregated-stat-value" id="aggregatedProgress">0%</span>
                        <span class="aggregated-stat-label">Overall Progress</span>
                    </div>
                </div>
                <div class="aggregated-stats-progress-bar" role="progressbar" aria-label="Overall progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="aggregated-stats-progress-fill" id="aggregatedProgressFill" style="width: 0%"></div>
                </div>
                <div class="aggregated-stats-projects" id="aggregatedStatsProjects" role="list" aria-label="Project breakdown">
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Generates HTML for a single project's stats row.
 */
export function getProjectStatsRow(project: ProjectStatsData, currentPath: string | null): string {
    const isActive = project.path === currentPath;
    const activeClass = isActive ? ' active' : '';
    const progressColor = project.progress === 100 ? 'complete' : project.progress >= 50 ? 'partial' : 'low';
    
    return `
    <div class="project-stats-row${activeClass}" role="listitem" data-project-path="${escapeHtml(project.path)}">
        <div class="project-stats-name">
            <span class="project-active-indicator" aria-hidden="true">${isActive ? '▶' : ''}</span>
            <span class="project-name-text" title="${escapeHtml(project.path)}">${escapeHtml(project.name)}</span>
        </div>
        <div class="project-stats-bar">
            <div class="project-stats-bar-bg">
                <div class="project-stats-bar-fill ${progressColor}" style="width: ${project.progress}%"></div>
            </div>
        </div>
        <div class="project-stats-numbers">
            <span class="project-completed">${project.completed}</span>
            <span class="project-separator">/</span>
            <span class="project-total">${project.total}</span>
            <span class="project-percent">(${project.progress}%)</span>
        </div>
    </div>`;
}

// ============================================================================
// Completion History Section
// ============================================================================

/**
 * Icons for the completion history section.
 */
export const CompletionHistoryIcons = {
    history: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    calendar: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    chart: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    duration: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    project: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
    empty: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',
    refresh: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
    clear: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>'
};

/**
 * Formats a duration in milliseconds to a human-readable string.
 */
export function formatHistoryDuration(ms: number): string {
    if (ms < 1000) {
        return '<1s';
    }
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Formats a date string (YYYY-MM-DD) to a more readable format.
 */
export function formatHistoryDate(dateKey: string): string {
    const today = new Date();
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    if (dateKey === todayKey) {
        return 'Today';
    }
    if (dateKey === yesterdayKey) {
        return 'Yesterday';
    }
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Data structure for a daily summary in the UI.
 */
export interface DailySummaryData {
    date: string;
    tasksCompleted: number;
    totalDuration: number;
    averageDuration: number;
    projects: string[];
}

/**
 * Data structure for overall history stats in the UI.
 */
export interface HistoryStatsData {
    totalTasks: number;
    totalDuration: number;
    averageDuration: number;
    uniqueProjects: number;
    uniqueSessions: number;
    oldestRecord: number | null;
    newestRecord: number | null;
}

/**
 * Generates HTML for the completion history section.
 */
export function getCompletionHistorySection(): string {
    return `
    <div class="completion-history-section collapsible-section" id="completionHistorySection" role="region" aria-label="Task completion history over time">
        <div class="completion-history-header section-header-collapsible" onclick="toggleSection('completionHistoryContent', 'completionHistoryToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="completionHistoryContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('completionHistoryContent','completionHistoryToggle',this);}">
            <span class="completion-history-icon" aria-hidden="true">${CompletionHistoryIcons.history}</span>
            <span id="completionHistoryTitle">Completion History</span>
            <div class="section-header-right">
                <span class="completion-history-count" id="completionHistoryCount" aria-label="Number of completions tracked">0 tasks tracked</span>
                <button class="history-action-btn" id="btnRefreshHistory" onclick="event.stopPropagation(); send('refreshHistory')" aria-label="Refresh history" title="Refresh history">
                    <span aria-hidden="true">${CompletionHistoryIcons.refresh}</span>
                </button>
                <span class="section-toggle expanded" id="completionHistoryToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="completion-history-content section-content" id="completionHistoryContent">
            <div class="completion-history-empty" id="completionHistoryEmpty" role="status">
                <span class="history-empty-icon" aria-hidden="true">${CompletionHistoryIcons.empty}</span>
                <span class="history-empty-text">No task completions recorded yet</span>
                <span class="history-empty-hint">Complete tasks to start tracking your progress over time</span>
            </div>
            <div class="completion-history-data" id="completionHistoryData" style="display: none;">
                <div class="history-stats-summary" role="group" aria-label="Overall statistics">
                    <div class="history-stat-item" role="status">
                        <span class="history-stat-icon" aria-hidden="true">${Icons.check}</span>
                        <span class="history-stat-value" id="historyTotalTasks">0</span>
                        <span class="history-stat-label">Total Completed</span>
                    </div>
                    <div class="history-stat-item" role="status">
                        <span class="history-stat-icon" aria-hidden="true">${CompletionHistoryIcons.duration}</span>
                        <span class="history-stat-value" id="historyTotalDuration">0m</span>
                        <span class="history-stat-label">Total Time</span>
                    </div>
                    <div class="history-stat-item" role="status">
                        <span class="history-stat-icon" aria-hidden="true">${CompletionHistoryIcons.chart}</span>
                        <span class="history-stat-value" id="historyAvgDuration">0m</span>
                        <span class="history-stat-label">Avg Time</span>
                    </div>
                    <div class="history-stat-item" role="status">
                        <span class="history-stat-icon" aria-hidden="true">${CompletionHistoryIcons.project}</span>
                        <span class="history-stat-value" id="historyUniqueProjects">0</span>
                        <span class="history-stat-label">Projects</span>
                    </div>
                </div>
                <div class="history-daily-list" id="historyDailyList" role="list" aria-label="Daily completion summaries">
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Generates HTML for a single day's summary row.
 */
export function getDailySummaryRow(summary: DailySummaryData): string {
    const formattedDate = formatHistoryDate(summary.date);
    const formattedDuration = formatHistoryDuration(summary.totalDuration);
    const formattedAvg = formatHistoryDuration(summary.averageDuration);
    const projectsText = summary.projects.length > 2 
        ? `${summary.projects.slice(0, 2).join(', ')} +${summary.projects.length - 2}` 
        : summary.projects.join(', ');
    
    return `
    <div class="history-daily-row" role="listitem" data-date="${escapeHtml(summary.date)}">
        <div class="history-date-col">
            <span class="history-date-icon" aria-hidden="true">${CompletionHistoryIcons.calendar}</span>
            <span class="history-date-text">${escapeHtml(formattedDate)}</span>
        </div>
        <div class="history-tasks-col">
            <span class="history-tasks-value">${summary.tasksCompleted}</span>
            <span class="history-tasks-label">task${summary.tasksCompleted !== 1 ? 's' : ''}</span>
        </div>
        <div class="history-duration-col">
            <span class="history-duration-value">${escapeHtml(formattedDuration)}</span>
            <span class="history-duration-avg" title="Average: ${escapeHtml(formattedAvg)} per task">(avg ${escapeHtml(formattedAvg)})</span>
        </div>
        <div class="history-projects-col" title="${escapeHtml(summary.projects.join(', '))}">
            <span class="history-projects-icon" aria-hidden="true">${CompletionHistoryIcons.project}</span>
            <span class="history-projects-text">${escapeHtml(projectsText)}</span>
        </div>
    </div>`;
}

/**
 * Generates HTML for the daily summary chart visualization.
 */
export function getHistoryChart(dailySummaries: DailySummaryData[]): string {
    if (dailySummaries.length === 0) {
        return '';
    }
    
    const maxTasks = Math.max(...dailySummaries.map(s => s.tasksCompleted), 1);
    
    const bars = dailySummaries.slice(0, 14).reverse().map(summary => {
        const heightPercent = (summary.tasksCompleted / maxTasks) * 100;
        const formattedDate = formatHistoryDate(summary.date);
        return `
            <div class="history-chart-bar-container" title="${escapeHtml(formattedDate)}: ${summary.tasksCompleted} task(s)">
                <div class="history-chart-bar" style="height: ${Math.max(heightPercent, 4)}%">
                    <span class="history-chart-bar-value">${summary.tasksCompleted}</span>
                </div>
                <span class="history-chart-bar-label">${summary.date.substring(5)}</span>
            </div>`;
    }).join('');
    
    return `
    <div class="history-chart" role="img" aria-label="Task completion chart for the last 14 days">
        <div class="history-chart-bars">
            ${bars}
        </div>
    </div>`;
}

// ============================================================================
// Session Statistics Dashboard
// ============================================================================

/**
 * Icons for the session statistics dashboard.
 */
export const SessionStatsIcons = {
    dashboard: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    timer: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    rocket: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>',
    bolt: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    turtle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    fire: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>',
    target: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    trend: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    activity: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    tasks: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    empty: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    refresh: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>'
};

/**
 * Data structure for session stats in the UI.
 */
export interface SessionStatsData {
    sessionId: string;
    sessionStartTime: number;
    tasksCompleted: number;
    totalDuration: number;
    averageDuration: number;
    fastestTask: number | null;
    slowestTask: number | null;
    currentStreak: number;
    timeSinceLastCompletion: number | null;
    tasksPerHour: number;
    completedTasks: string[];
    projectsWorkedOn: number;
}

/**
 * Formats a duration in milliseconds to a compact human-readable string.
 */
export function formatSessionDuration(ms: number): string {
    if (ms < 1000) {
        return '< 1s';
    }
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Formats a timestamp to a readable time string.
 */
export function formatSessionTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Generates HTML for the session statistics dashboard section.
 */
export function getSessionStatsDashboard(): string {
    return `
    <div class="session-stats-section collapsible-section" id="sessionStatsSection" role="region" aria-label="Current session statistics dashboard">
        <div class="session-stats-header section-header-collapsible" onclick="toggleSection('sessionStatsContent', 'sessionStatsToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="sessionStatsContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('sessionStatsContent','sessionStatsToggle',this);}">
            <span class="session-stats-icon" aria-hidden="true">${SessionStatsIcons.dashboard}</span>
            <span id="sessionStatsTitle">Session Dashboard</span>
            <div class="section-header-right">
                <span class="session-stats-badge" id="sessionStatsBadge" aria-label="Session status">No activity</span>
                <button class="session-action-btn" id="btnRefreshSession" onclick="event.stopPropagation(); send('refreshSessionStats')" aria-label="Refresh session stats" title="Refresh session stats">
                    <span aria-hidden="true">${SessionStatsIcons.refresh}</span>
                </button>
                <span class="section-toggle expanded" id="sessionStatsToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="session-stats-content section-content" id="sessionStatsContent">
            <div class="session-stats-empty" id="sessionStatsEmpty" role="status">
                <span class="session-empty-icon" aria-hidden="true">${SessionStatsIcons.empty}</span>
                <span class="session-empty-text">No tasks completed yet this session</span>
                <span class="session-empty-hint">Complete a task to start tracking your session performance</span>
            </div>
            <div class="session-stats-data" id="sessionStatsData" style="display: none;">
                <div class="session-info-bar" role="group" aria-label="Session information">
                    <div class="session-info-item">
                        <span class="session-info-icon" aria-hidden="true">${SessionStatsIcons.timer}</span>
                        <span class="session-info-label">Started</span>
                        <span class="session-info-value" id="sessionStartTime">--:--</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-info-icon" aria-hidden="true">${SessionStatsIcons.activity}</span>
                        <span class="session-info-label">Duration</span>
                        <span class="session-info-value" id="sessionDuration">0m</span>
                    </div>
                    <div class="session-info-item">
                        <span class="session-info-icon" aria-hidden="true">${SessionStatsIcons.target}</span>
                        <span class="session-info-label">Projects</span>
                        <span class="session-info-value" id="sessionProjects">0</span>
                    </div>
                </div>
                <div class="session-stats-grid" role="group" aria-label="Session statistics">
                    <div class="session-stat-card primary" role="status">
                        <div class="session-stat-header">
                            <span class="session-stat-icon" aria-hidden="true">${Icons.check}</span>
                            <span class="session-stat-title">Completed</span>
                        </div>
                        <span class="session-stat-value" id="sessionTasksCompleted">0</span>
                        <span class="session-stat-subtitle" id="sessionTasksPerHour">0 tasks/hr</span>
                    </div>
                    <div class="session-stat-card" role="status">
                        <div class="session-stat-header">
                            <span class="session-stat-icon" aria-hidden="true">${SessionStatsIcons.timer}</span>
                            <span class="session-stat-title">Total Time</span>
                        </div>
                        <span class="session-stat-value" id="sessionTotalDuration">0m</span>
                        <span class="session-stat-subtitle" id="sessionAvgDuration">avg: 0m</span>
                    </div>
                    <div class="session-stat-card fastest" role="status">
                        <div class="session-stat-header">
                            <span class="session-stat-icon" aria-hidden="true">${SessionStatsIcons.bolt}</span>
                            <span class="session-stat-title">Fastest</span>
                        </div>
                        <span class="session-stat-value" id="sessionFastest">--</span>
                        <span class="session-stat-subtitle">best time</span>
                    </div>
                    <div class="session-stat-card slowest" role="status">
                        <div class="session-stat-header">
                            <span class="session-stat-icon" aria-hidden="true">${SessionStatsIcons.turtle}</span>
                            <span class="session-stat-title">Slowest</span>
                        </div>
                        <span class="session-stat-value" id="sessionSlowest">--</span>
                        <span class="session-stat-subtitle">longest task</span>
                    </div>
                </div>
                <div class="session-streak-bar" role="group" aria-label="Current streak">
                    <div class="session-streak-info">
                        <span class="session-streak-icon" aria-hidden="true">${SessionStatsIcons.fire}</span>
                        <span class="session-streak-label">Current Streak</span>
                        <span class="session-streak-value" id="sessionStreak">0</span>
                        <span class="session-streak-text">consecutive tasks</span>
                    </div>
                    <div class="session-streak-meter">
                        <div class="session-streak-fill" id="sessionStreakFill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="session-recent-tasks" role="group" aria-label="Recently completed tasks">
                    <div class="session-recent-header">
                        <span class="session-recent-icon" aria-hidden="true">${SessionStatsIcons.tasks}</span>
                        <span class="session-recent-title">Recent Completions</span>
                    </div>
                    <div class="session-recent-list" id="sessionRecentTasks" role="list">
                        <div class="session-recent-empty">No tasks completed yet</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Generates HTML for a single recent task item in the session dashboard.
 */
export function getSessionTaskItem(taskDescription: string, index: number): string {
    const truncated = taskDescription.length > 60 
        ? taskDescription.substring(0, 60) + '...' 
        : taskDescription;
    return `
    <div class="session-task-item" role="listitem">
        <span class="session-task-number">${index + 1}</span>
        <span class="session-task-text" title="${escapeHtml(taskDescription)}">${escapeHtml(truncated)}</span>
    </div>`;
}

// ============================================================================
// Productivity Report Section
// ============================================================================

/**
 * Icons for the productivity report section.
 */
export const ProductivityReportIcons = {
    report: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    download: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    calendar: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    trendUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    trendStable: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    fire: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c4-2 8-7 8-12 0-3-3-5-5-6-1-0.5-3 1-3 3s2 3 2 5c0 3-4 4-4 4s-4-1-4-4c0-2 2-3 2-5s-2-3.5-3-3c-2 1-5 3-5 6 0 5 4 10 8 12z"/></svg>',
    projects: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
    chart: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    markdown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M6 9v6l2-2 2 2V9"/><path d="M18 9l-2 3h4l-2 3"/></svg>',
    html: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    json: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6c0-1.1.9-2 2-2h2"/><path d="M4 18c0 1.1.9 2 2 2h2"/><path d="M16 4h2a2 2 0 012 2"/><path d="M16 20h2a2 2 0 002-2"/><path d="M4 12h16"/></svg>',
    empty: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>'
};

/**
 * Report period options for the UI.
 */
export const REPORT_PERIODS = [
    { value: 'today', label: 'Today', icon: ProductivityReportIcons.calendar },
    { value: 'week', label: 'Last 7 Days', icon: ProductivityReportIcons.calendar },
    { value: 'month', label: 'Last 30 Days', icon: ProductivityReportIcons.calendar }
] as const;

/**
 * Report format options for the UI.
 */
export const REPORT_FORMATS = [
    { value: 'markdown', label: 'Markdown', icon: ProductivityReportIcons.markdown, ext: '.md' },
    { value: 'html', label: 'HTML', icon: ProductivityReportIcons.html, ext: '.html' },
    { value: 'json', label: 'JSON', icon: ProductivityReportIcons.json, ext: '.json' }
] as const;

/**
 * Day of week names for trend display.
 */
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Generates HTML for the productivity report section.
 */
export function getProductivityReportSection(): string {
    const periodOptions = REPORT_PERIODS.map(p => 
        `<option value="${p.value}">${p.label}</option>`
    ).join('');
    
    const formatButtons = REPORT_FORMATS.map(f =>
        `<button class="report-format-btn" data-format="${f.value}" title="Export as ${f.label}" aria-label="Export as ${f.label}">
            <span class="format-icon" aria-hidden="true">${f.icon}</span>
            <span class="format-label">${f.label}</span>
        </button>`
    ).join('');
    
    return `
    <div class="productivity-report-section collapsible-section" id="productivityReportSection" role="region" aria-label="Generate productivity reports">
        <div class="report-header section-header-collapsible" onclick="toggleSection('reportContent', 'reportToggle', this)" role="button" tabindex="0" aria-expanded="true" aria-controls="reportContent" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSection('reportContent','reportToggle',this);}">
            <span class="report-header-icon" aria-hidden="true">${ProductivityReportIcons.report}</span>
            <span id="reportTitle">Productivity Reports</span>
            <div class="section-header-right">
                <span class="section-toggle expanded" id="reportToggle" aria-hidden="true">${CollapsibleIcons.chevronDown}</span>
            </div>
        </div>
        <div class="report-content section-content" id="reportContent">
            <div class="report-description">
                <p>Generate detailed productivity reports to analyze your task completion patterns and track progress over time.</p>
            </div>
            
            <div class="report-controls" role="group" aria-label="Report options">
                <div class="report-period-selector">
                    <label for="reportPeriodSelect" class="report-label">
                        <span class="report-label-icon" aria-hidden="true">${ProductivityReportIcons.calendar}</span>
                        Time Period
                    </label>
                    <select id="reportPeriodSelect" class="report-select" aria-label="Select report period">
                        ${periodOptions}
                    </select>
                </div>
                
                <div class="report-format-group" role="group" aria-label="Export format">
                    <span class="report-label">
                        <span class="report-label-icon" aria-hidden="true">${ProductivityReportIcons.download}</span>
                        Export Format
                    </span>
                    <div class="report-format-buttons" role="radiogroup" aria-label="Choose export format">
                        ${formatButtons}
                    </div>
                </div>
            </div>
            
            <div class="report-actions">
                <button id="btnGenerateReport" class="btn btn-primary report-generate-btn" onclick="generateReport()" aria-label="Generate productivity report">
                    <span class="btn-spinner" aria-hidden="true"></span>
                    <span class="btn-icon" aria-hidden="true">${ProductivityReportIcons.report}</span>
                    <span class="btn-text">Generate Report</span>
                </button>
            </div>
            
            <div class="report-preview" id="reportPreview" style="display: none;" role="region" aria-label="Report preview">
                <div class="report-preview-header">
                    <span class="preview-title">Preview</span>
                    <button class="preview-close-btn" onclick="closeReportPreview()" aria-label="Close preview">×</button>
                </div>
                <div class="report-preview-content" id="reportPreviewContent"></div>
            </div>
            
            <div class="report-empty" id="reportEmpty" role="status">
                <span class="report-empty-icon" aria-hidden="true">${ProductivityReportIcons.empty}</span>
                <span class="report-empty-text">No reports generated yet</span>
                <span class="report-empty-hint">Select a time period and format, then click Generate Report</span>
            </div>
        </div>
    </div>`;
}

/**
 * Generates the HTML content for a productivity report preview.
 */
export function getReportPreviewHtml(report: {
    title: string;
    totalTasks: number;
    totalDuration: number;
    sessions: number;
    projects: number;
    timeBreakdown: {
        averageTaskTime: number;
        fastestTaskTime: number | null;
        slowestTaskTime: number | null;
    };
    trends: {
        avgTasksPerDay: number;
        mostProductiveDay: number | null;
        mostProductiveHour: number | null;
        trendDirection: 'up' | 'down' | 'stable';
        trendPercentage: number;
        longestStreak: number;
        currentStreak: number;
    };
    projectBreakdown: Array<{
        name: string;
        tasksCompleted: number;
        taskPercentage: number;
    }>;
}): string {
    const trendIcon = report.trends.trendDirection === 'up' 
        ? ProductivityReportIcons.trendUp
        : report.trends.trendDirection === 'down'
            ? ProductivityReportIcons.trendDown
            : ProductivityReportIcons.trendStable;
    
    const trendClass = report.trends.trendDirection === 'up' 
        ? 'trend-up' 
        : report.trends.trendDirection === 'down' 
            ? 'trend-down' 
            : 'trend-stable';
    
    const mostProductiveDayName = report.trends.mostProductiveDay !== null 
        ? DAY_NAMES[report.trends.mostProductiveDay] 
        : '--';
    
    const mostProductiveHourStr = report.trends.mostProductiveHour !== null
        ? formatHour(report.trends.mostProductiveHour)
        : '--';
    
    const projectRows = report.projectBreakdown.slice(0, 5).map(p => `
        <div class="preview-project-row">
            <span class="preview-project-name">${escapeHtml(p.name)}</span>
            <span class="preview-project-tasks">${p.tasksCompleted} tasks</span>
            <div class="preview-project-bar">
                <div class="preview-project-fill" style="width: ${p.taskPercentage}%"></div>
            </div>
            <span class="preview-project-percent">${p.taskPercentage}%</span>
        </div>
    `).join('');
    
    return `
        <div class="preview-summary">
            <h3 class="preview-heading">${escapeHtml(report.title)}</h3>
            <div class="preview-stats-grid">
                <div class="preview-stat">
                    <span class="preview-stat-value">${report.totalTasks}</span>
                    <span class="preview-stat-label">Tasks Completed</span>
                </div>
                <div class="preview-stat">
                    <span class="preview-stat-value">${formatSessionDuration(report.totalDuration)}</span>
                    <span class="preview-stat-label">Total Time</span>
                </div>
                <div class="preview-stat">
                    <span class="preview-stat-value">${report.sessions}</span>
                    <span class="preview-stat-label">Sessions</span>
                </div>
                <div class="preview-stat">
                    <span class="preview-stat-value">${report.projects}</span>
                    <span class="preview-stat-label">Projects</span>
                </div>
            </div>
        </div>
        
        <div class="preview-trends">
            <h4 class="preview-subheading">Trends & Insights</h4>
            <div class="preview-trend-grid">
                <div class="preview-trend-item">
                    <span class="trend-icon ${trendClass}" aria-hidden="true">${trendIcon}</span>
                    <span class="trend-value">${report.trends.trendPercentage}%</span>
                    <span class="trend-label">${report.trends.trendDirection === 'up' ? 'Increase' : report.trends.trendDirection === 'down' ? 'Decrease' : 'Stable'}</span>
                </div>
                <div class="preview-trend-item">
                    <span class="trend-icon" aria-hidden="true">${ProductivityReportIcons.chart}</span>
                    <span class="trend-value">${report.trends.avgTasksPerDay}</span>
                    <span class="trend-label">Tasks/Day</span>
                </div>
                <div class="preview-trend-item">
                    <span class="trend-icon" aria-hidden="true">${ProductivityReportIcons.fire}</span>
                    <span class="trend-value">${report.trends.currentStreak}</span>
                    <span class="trend-label">Current Streak</span>
                </div>
                <div class="preview-trend-item">
                    <span class="trend-icon" aria-hidden="true">${ProductivityReportIcons.calendar}</span>
                    <span class="trend-value">${mostProductiveDayName}</span>
                    <span class="trend-label">Best Day</span>
                </div>
                <div class="preview-trend-item">
                    <span class="trend-icon" aria-hidden="true">${ProductivityReportIcons.clock}</span>
                    <span class="trend-value">${mostProductiveHourStr}</span>
                    <span class="trend-label">Peak Hour</span>
                </div>
            </div>
        </div>
        
        ${report.projectBreakdown.length > 0 ? `
        <div class="preview-projects">
            <h4 class="preview-subheading">Project Breakdown</h4>
            <div class="preview-project-list">
                ${projectRows}
            </div>
        </div>
        ` : ''}
    `;
}

/**
 * Formats an hour (0-23) to a readable string.
 */
export function formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
}
