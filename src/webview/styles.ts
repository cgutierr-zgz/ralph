export function getStyles(): string {
    return `
        :root {
            --gradient-1: #f97316;
            --gradient-2: #ec4899;
            --gradient-3: #8b5cf6;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 0;
            overflow-x: hidden;
        }

        /* Animated gradient header */
        .header {
            background: linear-gradient(-45deg, var(--gradient-1), var(--gradient-2), var(--gradient-3), var(--gradient-2));
            background-size: 400% 400%;
            padding: 20px 24px;
            position: relative;
            overflow: hidden;
        }

        .header.idle {
            animation: none;
            background: var(--vscode-sideBar-background);
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        .header.running { animation: gradientShift 3s ease infinite; }
        .header.waiting { animation: gradientShift 6s ease infinite; }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Shimmer effect overlay */
        .header.running::after,
        .header.waiting::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer { 100% { left: 100%; } }

        .header-content {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .title-group {
            display: flex;
            align-items: center;
            gap: 16px;
            min-width: 0;
            flex: 1;
        }

        .project-selector {
            min-width: 0;
            flex-shrink: 1;
        }

        .project-selector select {
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid var(--vscode-dropdown-border);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            font-family: inherit;
            outline: none;
            cursor: pointer;
            max-width: 200px;
            text-overflow: ellipsis;
        }

        .project-selector select:focus {
            border-color: var(--vscode-focusBorder);
        }

        .header.running .project-selector select,
        .header.waiting .project-selector select {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .header.running .project-selector select option,
        .header.waiting .project-selector select option {
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
        }

        .title {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            max-width: 100%;
            flex-shrink: 0;
        }

        .title h1 {
            font-size: 16px;
            font-weight: 600;
            color: inherit;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ralph-logo { flex-shrink: 0; }
        .header.idle .title h1 { color: var(--vscode-foreground); }
        .header.running .title h1, .header.waiting .title h1 { color: white; }

        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .header.idle .status-pill {
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }

        .header.running .status-pill, .header.waiting .status-pill {
            background: rgba(255,255,255,0.2);
            color: white;
            backdrop-filter: blur(4px);
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
        }

        .header.running .status-dot { animation: pulse 1s infinite; }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }

        /* Timing displays */
        .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .timing-display {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 6px 12px;
            background: rgba(0,0,0,0.3);
            border-radius: 8px;
            color: white;
            font-size: 11px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .timing-display.visible { opacity: 1; visibility: visible; }

        .timing-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        .timing-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.7;
        }

        .timing-value {
            font-size: 13px;
            font-weight: 600;
            font-family: var(--vscode-editor-font-family);
        }

        /* Countdown clock display */
        .countdown {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(0,0,0,0.3);
            border-radius: 8px;
            color: white;
            font-size: 12px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .countdown.visible { opacity: 1; visibility: visible; }

        .countdown-clock {
            width: 28px;
            height: 28px;
            position: relative;
        }

        .countdown-clock svg { transform: rotate(-90deg); }

        .countdown-clock-bg {
            fill: none;
            stroke: rgba(255,255,255,0.2);
            stroke-width: 3;
        }

        .countdown-clock-fill {
            fill: none;
            stroke: url(#clockGradient);
            stroke-width: 3;
            stroke-linecap: round;
            transition: stroke-dashoffset 1s linear;
        }

        /* Main content */
        .content { padding: 16px; }

        /* Controls */
        .controls {
            display: flex;
            gap: 8px;
            padding: 16px;
            background: var(--vscode-sideBar-background);
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        button.primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        button.primary:hover:not(:disabled) {
            background: var(--vscode-button-hoverBackground);
        }

        button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        button.secondary:hover:not(:disabled) {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        button.danger { background: #dc2626; color: white; }
        button.danger:hover:not(:disabled) { background: #b91c1c; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        button.icon-only { padding: 6px; min-width: 28px; }
        .spacer { flex: 1; }

        /* Current task */
        .task-section {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .task-section.active {
            border-color: #3b82f6;
            border-width: 2px;
            padding: 11px;
        }

        /* Task section executing state with animated border */
        .task-section.executing {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3),
                        0 4px 12px rgba(139, 92, 246, 0.15);
            animation: taskGlow 2s ease-in-out infinite;
        }

        @keyframes taskGlow {
            0%, 100% {
                box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3),
                            0 4px 12px rgba(139, 92, 246, 0.15);
            }
            50% {
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5),
                            0 4px 20px rgba(139, 92, 246, 0.25);
            }
        }

        /* Shimmer effect for executing task */
        .task-section.executing::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(139, 92, 246, 0.1),
                rgba(236, 72, 153, 0.1),
                transparent
            );
            animation: taskShimmer 2.5s ease infinite;
        }

        @keyframes taskShimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* Task completion animation */
        .task-section.completing {
            animation: taskComplete 0.6s ease forwards;
        }

        @keyframes taskComplete {
            0% { transform: scale(1); }
            30% { transform: scale(1.02); }
            60% { transform: scale(0.98); }
            100% { transform: scale(1); }
        }

        /* Inline progress bar for task execution */
        .task-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(139, 92, 246, 0.2);
            overflow: hidden;
        }

        .task-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6);
            background-size: 200% 100%;
            animation: progressGradient 2s linear infinite;
            transition: width 0.5s ease;
        }

        @keyframes progressGradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        /* Indeterminate progress animation */
        .task-progress-bar.indeterminate {
            width: 40% !important;
            animation: progressGradient 2s linear infinite, progressIndeterminate 1.5s ease-in-out infinite;
        }

        @keyframes progressIndeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
        }

        .task-label {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .task-text {
            font-size: 13px;
            line-height: 1.4;
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        /* Task header actions */
        .task-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Task details toggle button */
        .task-details-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 4px;
            background: transparent;
            color: var(--vscode-descriptionForeground);
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0;
        }

        .task-details-toggle:hover {
            background: var(--vscode-toolbar-hoverBackground);
            color: var(--vscode-foreground);
        }

        .task-details-toggle:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 1px;
        }

        .task-details-toggle[aria-expanded="true"] {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        /* Task details panel */
        .task-details-panel {
            margin-top: 12px;
            padding: 12px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            animation: taskDetailsSlideIn 0.25s ease-out;
        }

        @keyframes taskDetailsSlideIn {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .task-details-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .task-detail-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .task-detail-label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 500;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 110px;
            flex-shrink: 0;
        }

        .task-detail-label svg {
            opacity: 0.7;
        }

        .task-detail-value {
            font-size: 12px;
            color: var(--vscode-foreground);
            word-break: break-word;
        }

        .task-detail-id {
            font-family: var(--vscode-editor-font-family);
            font-size: 11px;
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
        }

        .task-detail-status {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }

        .task-detail-status.pending {
            background: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
        }

        .task-detail-status.in-progress {
            background: rgba(139, 92, 246, 0.15);
            color: #8b5cf6;
        }

        .task-detail-status.complete {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
        }

        .task-detail-status.blocked {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
        }

        .task-detail-status.skipped {
            background: rgba(156, 163, 175, 0.15);
            color: #9ca3af;
        }

        .task-detail-line {
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
        }

        .task-detail-complexity {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 500;
        }

        .task-detail-complexity.complexity-low {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
        }

        .task-detail-complexity.complexity-medium {
            background: rgba(234, 179, 8, 0.15);
            color: #eab308;
        }

        .task-detail-complexity.complexity-high {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
        }

        .task-detail-dependencies-row {
            flex-direction: column;
            gap: 6px;
        }

        .task-detail-dependencies {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .task-detail-dependency {
            display: inline-flex;
            padding: 3px 8px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 10px;
            font-size: 11px;
        }

        .task-detail-none {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }

        /* Related Files Display */
        .task-detail-related-files-row {
            flex-direction: column;
            gap: 6px;
        }

        .task-detail-related-files {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .task-detail-related-file {
            display: inline-flex;
            align-items: center;
            padding: 3px 8px;
            background: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
            border-radius: 10px;
            font-size: 11px;
            font-family: var(--vscode-editor-font-family);
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
            transition: background-color 0.15s ease, transform 0.15s ease;
        }

        .task-detail-related-file:hover {
            background: rgba(59, 130, 246, 0.25);
            transform: translateY(-1px);
        }

        .task-detail-related-file.is-directory {
            background: rgba(234, 179, 8, 0.15);
            color: #eab308;
        }

        .task-detail-related-file.is-directory:hover {
            background: rgba(234, 179, 8, 0.25);
        }

        .task-detail-related-file.is-glob {
            background: rgba(139, 92, 246, 0.15);
            color: #8b5cf6;
        }

        .task-detail-related-file.is-glob:hover {
            background: rgba(139, 92, 246, 0.25);
        }

        /* Acceptance Criteria Display */
        .task-detail-acceptance-criteria-row {
            flex-direction: column;
            gap: 6px;
        }

        .task-detail-acceptance-criteria {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .task-detail-criteria-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .task-detail-criterion {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            padding: 4px 8px;
            background: rgba(34, 197, 94, 0.1);
            border-radius: 6px;
            font-size: 11px;
            line-height: 1.4;
            color: var(--vscode-foreground);
        }

        .task-detail-criterion:hover {
            background: rgba(34, 197, 94, 0.18);
        }

        .criterion-bullet {
            flex-shrink: 0;
            color: #22c55e;
            font-weight: 600;
            font-size: 10px;
        }

        /* Estimated Time Display */
        .task-detail-estimated-time {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .estimated-time-value {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 500;
            background: rgba(139, 92, 246, 0.15);
            color: #8b5cf6;
        }

        .estimated-time-value.no-data {
            background: rgba(156, 163, 175, 0.15);
            color: #9ca3af;
        }

        .estimated-time-value.loading {
            animation: estimatedTimePulse 1.5s ease-in-out infinite;
        }

        @keyframes estimatedTimePulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        .estimated-time-source {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }

        .estimated-time-source::before {
            content: '(';
        }

        .estimated-time-source:not(:empty)::after {
            content: ')';
        }

        /* Activity log */
        .log-section {
            background: var(--vscode-terminal-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            overflow: hidden;
        }

        .log-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-widget-border);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--vscode-descriptionForeground);
        }

        .log-content {
            padding: 8px;
            max-height: 180px;
            overflow-y: auto;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
        }

        .log-entry {
            padding: 4px 8px;
            border-radius: 3px;
            margin-bottom: 2px;
            display: flex;
            gap: 8px;
        }

        .log-entry:hover { background: var(--vscode-list-hoverBackground); }
        .log-time { color: var(--vscode-descriptionForeground); flex-shrink: 0; }
        .log-msg {
            flex: 1;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: anywhere;
        }
        .log-entry.success .log-msg { color: #22c55e; }
        .log-entry.info .log-msg { color: var(--vscode-textLink-foreground); }
        .log-entry.warning .log-msg { color: #f59e0b; font-weight: 500; }
        .log-entry.warning { background: rgba(245, 158, 11, 0.1); border-left: 2px solid #f59e0b; }
        .log-entry.error .log-msg { color: #ef4444; font-weight: 500; }
        .log-entry.error { background: rgba(239, 68, 68, 0.1); border-left: 2px solid #ef4444; }

        /* Log entry visibility for filtering */
        .log-entry.filtered-out { display: none !important; }

        /* Virtual Scrolling Styles */
        .virtual-scroll-enabled {
            position: relative;
        }

        .virtual-scroll-spacer {
            pointer-events: none;
            width: 100%;
            flex-shrink: 0;
        }

        .virtual-scroll-enabled .log-entry {
            box-sizing: border-box;
            align-items: center;
            overflow: hidden;
            flex-shrink: 0;
        }

        /* Virtual scroll status indicator */
        .virtual-scroll-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 6px;
            font-size: 9px;
            color: var(--vscode-descriptionForeground);
            background: var(--vscode-badge-background);
            border-radius: 10px;
            margin-left: 8px;
        }

        .virtual-scroll-indicator::before {
            content: '⚡';
            font-size: 8px;
        }

        /* Log filters */
        .log-filters {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-bottom: 1px solid var(--vscode-widget-border);
            background: var(--vscode-sideBarSectionHeader-background);
            flex-wrap: wrap;
        }

        .log-filter-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 12px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            font-size: 10px;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .log-filter-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            border-color: var(--vscode-focusBorder);
        }

        .log-filter-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 1px;
        }

        .log-filter-btn.active {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-button-background);
        }

        .log-filter-btn[data-level="info"].active {
            background: var(--vscode-textLink-foreground);
            border-color: var(--vscode-textLink-foreground);
        }

        .log-filter-btn[data-level="warning"].active {
            background: #f59e0b;
            border-color: #f59e0b;
            color: #000;
        }

        .log-filter-btn[data-level="error"].active {
            background: #ef4444;
            border-color: #ef4444;
            color: #fff;
        }

        .log-filter-icon {
            display: flex;
            align-items: center;
        }

        .log-filter-icon svg {
            width: 10px;
            height: 10px;
        }

        .log-filter-label {
            font-weight: 500;
        }

        .log-filter-count {
            margin-left: auto;
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            font-weight: 500;
        }

        /* Log action buttons (Copy Log, etc.) */
        .log-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            font-size: 10px;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
            margin-right: 8px;
        }

        .log-action-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            border-color: var(--vscode-focusBorder);
        }

        .log-action-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 1px;
        }

        .log-action-btn:active {
            transform: scale(0.95);
        }

        .log-action-btn.copied {
            background: #22c55e;
            border-color: #22c55e;
            color: #fff;
        }

        .log-action-btn.exported {
            background: #3b82f6;
            border-color: #3b82f6;
            color: #fff;
        }

        /* Timestamp toggle button styles */
        .log-timestamp-toggle {
            transition: all 0.2s ease;
        }

        .log-timestamp-toggle[aria-pressed="true"] {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-button-background);
        }

        .log-timestamp-toggle[aria-pressed="false"] {
            opacity: 0.7;
        }

        .log-timestamp-toggle[aria-pressed="false"] .log-action-icon {
            opacity: 0.5;
        }

        /* Hide timestamps when toggle is off */
        .log-area-hide-timestamps .log-time {
            display: none !important;
        }

        /* Auto-scroll toggle button styles */
        .log-autoscroll-toggle {
            transition: all 0.2s ease;
        }

        .log-autoscroll-toggle[aria-pressed="true"] {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-button-background);
        }

        .log-autoscroll-toggle[aria-pressed="false"] {
            opacity: 0.7;
        }

        .log-autoscroll-toggle[aria-pressed="false"] .log-action-icon {
            opacity: 0.5;
        }

        .log-action-icon {
            display: flex;
            align-items: center;
        }

        .log-action-icon svg {
            width: 10px;
            height: 10px;
        }

        .log-action-label {
            font-weight: 500;
        }

        /* Log search */
        .log-search-container {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-bottom: 1px solid var(--vscode-widget-border);
            background: var(--vscode-input-background);
        }

        .log-search-icon {
            display: flex;
            align-items: center;
            color: var(--vscode-descriptionForeground);
            flex-shrink: 0;
        }

        .log-search-icon svg {
            width: 12px;
            height: 12px;
        }

        .log-search-input {
            flex: 1;
            min-width: 0;
            padding: 4px 8px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-size: 11px;
            font-family: inherit;
        }

        .log-search-input::placeholder {
            color: var(--vscode-input-placeholderForeground);
        }

        .log-search-input:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 0 0 1px var(--vscode-focusBorder);
        }

        .log-search-clear {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            padding: 0;
            border: none;
            border-radius: 50%;
            background: transparent;
            color: var(--vscode-descriptionForeground);
            cursor: pointer;
            transition: all 0.15s ease;
            flex-shrink: 0;
        }

        .log-search-clear:hover {
            background: var(--vscode-toolbar-hoverBackground);
            color: var(--vscode-foreground);
        }

        .log-search-clear:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 1px;
        }

        .log-search-clear svg {
            width: 10px;
            height: 10px;
        }

        .log-search-count {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .log-search-count.no-matches {
            color: #ef4444;
        }

        .log-search-count.has-matches {
            color: #22c55e;
        }

        /* Log entry search highlight */
        .log-entry .search-highlight {
            background: rgba(255, 213, 0, 0.4);
            border-radius: 2px;
            padding: 0 1px;
        }

        .log-entry.search-match {
            background: rgba(255, 213, 0, 0.1);
        }

        .log-entry.search-hidden {
            display: none !important;
        }

        /* Footer */
        .footer {
            margin-top: 20px;
            padding: 12px;
            border-top: 1px solid var(--vscode-widget-border);
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
            line-height: 1.6;
        }

        .footer a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }

        .footer a:hover { text-decoration: underline; }

        .footer-version {
            margin-left: 8px;
            padding: 2px 6px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
        }

        .footer-warning {
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.3);
            border-radius: 4px;
            padding: 8px 10px;
            margin-bottom: 10px;
            font-size: 11px;
            color: #eab308;
        }

        .footer-disclaimer { opacity: 0.7; font-size: 10px; margin-top: 8px; }

        /* Warning banner */
        .warning-banner {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.3);
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 13px;
        }

        .warning-banner code {
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
        }

        /* Empty state */
        .empty-state {
            text-align: center;
            padding: 32px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state-icon { font-size: 32px; margin-bottom: 12px; }

        /* Setup section for PRD generation */
        .setup-section {
            background: linear-gradient(135deg,
                rgba(124, 58, 237, 0.08),
                rgba(37, 99, 235, 0.08),
                rgba(6, 182, 212, 0.08)
            );
            border: 1px solid rgba(124, 58, 237, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .setup-header {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            font-weight: 600;
            word-break: break-word;
            overflow-wrap: anywhere;
            margin-bottom: 8px;
        }

        .setup-icon { font-size: 20px; }

        .setup-description {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 12px;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        .setup-input-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .setup-textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: inherit;
            font-size: 13px;
            resize: vertical;
            min-height: 80px;
        }

        .setup-textarea:focus {
            outline: none;
            border-color: var(--gradient-2);
            box-shadow: 0 0 0 1px var(--gradient-2);
        }

        .setup-textarea::placeholder { color: var(--vscode-input-placeholderForeground); }

        /* Textarea wrapper for character count positioning */
        .textarea-wrapper {
            position: relative;
            width: 100%;
        }

        .textarea-wrapper .setup-textarea {
            padding-bottom: 24px; /* Make room for char count */
        }

        /* Character count display */
        .textarea-char-count {
            position: absolute;
            bottom: 6px;
            right: 10px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            pointer-events: none;
        }

        .textarea-char-count.warning {
            color: #f59e0b; /* Yellow for warning */
        }

        .textarea-char-count.error {
            color: #dc2626; /* Red for over limit */
        }

        /* Validation error/success states */
        .setup-textarea.validation-error {
            border-color: #dc2626;
            box-shadow: 0 0 0 1px #dc2626;
        }

        .setup-textarea.validation-error:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 1px #dc2626, 0 0 0 3px rgba(220, 38, 38, 0.2);
        }

        .setup-textarea.validation-success {
            border-color: #22c55e;
            box-shadow: 0 0 0 1px #22c55e;
        }

        .setup-textarea.validation-success:focus {
            border-color: #22c55e;
            box-shadow: 0 0 0 1px #22c55e, 0 0 0 3px rgba(34, 197, 94, 0.2);
        }

        /* Inline validation message */
        .validation-message {
            font-size: 12px;
            line-height: 1.4;
            min-height: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.2s ease-out;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .validation-message.visible {
            min-height: 20px;
            max-height: 60px;
            opacity: 1;
            padding: 4px 0;
        }

        .validation-message.error {
            color: #dc2626;
        }

        .validation-message.success {
            color: #22c55e;
        }

        .validation-message .validation-icon {
            flex-shrink: 0;
            width: 14px;
            height: 14px;
        }

        .generate-btn {
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 500;
            background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
            border: none;
            color: white;
        }

        .generate-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .generate-btn:disabled { opacity: 0.5; cursor: wait; }

        /* Task Timeline / Histogram */
        .timeline-section {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .timeline-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-widget-border);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--vscode-descriptionForeground);
        }

        .section-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .zoom-controls {
            display: flex;
            align-items: center;
            gap: 2px;
            background: var(--vscode-widget-border);
            border-radius: 4px;
            padding: 2px;
            margin-right: 8px;
        }

        .zoom-controls button.icon-only.small {
            padding: 2px;
            width: 18px;
            height: 18px;
            min-width: 18px;
            border-radius: 2px;
            background: transparent;
            color: var(--vscode-descriptionForeground);
        }

        .zoom-controls button.icon-only.small:hover {
            background: var(--vscode-toolbar-hoverBackground);
            color: var(--vscode-foreground);
        }

        .timeline-content { padding: 12px; min-height: 60px; }

        .timeline-scroll-container {
            width: 100%;
            overflow-x: auto;
            /* Thin scrollbar for webkit */
            scrollbar-width: thin;
            scrollbar-color: var(--vscode-scrollbarSlider-background) transparent;
        }

        .timeline-scroll-container::-webkit-scrollbar {
            height: 6px;
        }
        
        .timeline-scroll-container::-webkit-scrollbar-thumb {
            background-color: var(--vscode-scrollbarSlider-background);
            border-radius: 3px;
        }

        .timeline-scroll-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .timeline-empty {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            padding: 16px;
        }

        .timeline-bars {
            display: flex;
            align-items: flex-end;
            gap: 4px;
            height: 50px;
            padding-bottom: 2px;
            /* Allow it to grow beyond container width */
            width: fit-content;
            min-width: 100%;
        }

        .timeline-bar {
            flex: 0 0 auto;
            min-width: var(--timeline-bar-width, 20px);
            max-width: var(--timeline-bar-width, 40px);
            background: #22c55e;
            border-radius: 3px 3px 0 0;
            position: relative;
            cursor: pointer;
            transition: opacity 0.15s, height 1s linear, min-width 0.2s, max-width 0.2s;
        }

        .timeline-bar.current {
            background: linear-gradient(180deg, #3b82f6, #8b5cf6);
            animation: barPulse 2s ease-in-out infinite, barGrow 0.5s ease-out;
            position: relative;
            overflow: hidden;
        }

        @keyframes barPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        @keyframes barGrow {
            0% { transform: scaleY(0); transform-origin: bottom; }
            100% { transform: scaleY(1); transform-origin: bottom; }
        }

        /* Shimmer effect on current bar */
        .timeline-bar.current::after {
            content: '';
            position: absolute;
            top: -100%;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(
                180deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
            );
            animation: barShimmer 2s ease-in-out infinite;
        }

        .timeline-connector {
            flex: 0 0 auto;
            width: 12px;
            height: 2px;
            background: var(--vscode-editor-lineHighlightBorder);
            align-self: flex-end;
            margin-bottom: 0;
            position: relative;
            opacity: 0.6;
        }

        .timeline-connector::after {
            content: '';
            position: absolute;
            right: -1px;
            top: -3px;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 5px solid var(--vscode-editor-lineHighlightBorder);
        }

        @keyframes barShimmer {
            0% { top: -100%; }
            50% { top: 100%; }
            100% { top: 100%; }
        }

        /* Completed bar entrance animation */
        .timeline-bar.completed-new {
            animation: barComplete 0.5s ease forwards;
        }

        @keyframes barComplete {
            0% {
                transform: scaleY(0);
                transform-origin: bottom;
                background: #8b5cf6;
            }
            50% {
                transform: scaleY(1.1);
                background: #8b5cf6;
            }
            100% {
                transform: scaleY(1);
                background: #22c55e;
            }
        }

        .timeline-bar.pending {
            background: var(--vscode-widget-border);
            opacity: 0.4;
            transition: opacity 0.3s ease, background 0.3s ease;
        }

        /* Pending bar becoming current animation */
        .timeline-bar.becoming-current {
            animation: becomingCurrent 0.4s ease forwards;
        }

        @keyframes becomingCurrent {
            0% {
                background: var(--vscode-widget-border);
                opacity: 0.4;
            }
            100% {
                background: linear-gradient(180deg, #3b82f6, #8b5cf6);
                opacity: 1;
            }
        }

        .timeline-bar:hover { opacity: 0.8; }

        .timeline-bar::after {
            content: attr(data-duration);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: var(--vscode-descriptionForeground);
            white-space: nowrap;
            padding-bottom: 2px;
            opacity: 0;
            transition: opacity 0.15s;
        }

        .timeline-bar:hover::after { opacity: 1; }

        /* Timeline Tooltip */
        .timeline-tooltip {
            position: fixed;
            z-index: 1000;
            background: var(--vscode-editorHoverWidget-background);
            border: 1px solid var(--vscode-editorHoverWidget-border);
            color: var(--vscode-editorHoverWidget-foreground);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 11px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.1s;
            max-width: 300px;
            white-space: normal;
            font-family: var(--vscode-font-family);
        }

        .timeline-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }

        .timeline-tooltip .tooltip-header {
            font-weight: 600;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--vscode-widget-border);
            display: flex;
            justify-content: space-between;
        }

        .timeline-tooltip .tooltip-desc {
            margin-bottom: 8px;
            line-height: 1.4;
            max-height: 100px;
            overflow-y: auto;
        }

        .timeline-tooltip .tooltip-meta {
            display: flex;
            gap: 12px;
            font-size: 10px;
            opacity: 0.8;
            border-top: 1px solid var(--vscode-widget-border);
            padding-top: 6px;
        }
        
        .timeline-tooltip .tooltip-tag {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .timeline-tooltip .tooltip-icon {
            opacity: 0.7;
        }

        .timeline-labels {
            display: flex;
            gap: 4px;
            margin-top: 4px;
            /* Allow it to grow beyond container width */
            width: fit-content;
            min-width: 100%;
        }

        .timeline-label {
            flex: 0 0 auto;
            min-width: var(--timeline-bar-width, 20px);
            max-width: var(--timeline-bar-width, 40px);
            text-align: center;
            font-size: 9px;
            color: var(--vscode-descriptionForeground);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: min-width 0.2s, max-width 0.2s;
        }

        /* Requirements section */
        .requirements-section {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .requirements-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(37, 99, 235, 0.08));
            border-bottom: 1px solid var(--vscode-widget-border);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--vscode-foreground);
            cursor: pointer;
        }

        .requirements-header:hover {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.12));
        }

        .requirements-header-title {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .requirements-header-title svg { opacity: 0.8; }
        .requirements-toggle { font-size: 10px; transition: transform 0.2s; }
        .requirements-toggle.expanded { transform: rotate(180deg); }
        .requirements-content { padding: 12px; display: block; }
        .requirements-content.collapsed { display: none; }

        /* ================================================================
           Collapsible Sections for Mobile-Friendly View
           Generic styles for all collapsible content sections
           ================================================================ */

        /* Section toggle indicator (chevron icon) */
        .section-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.25s ease;
            opacity: 0.7;
        }

        .section-toggle.expanded {
            transform: rotate(180deg);
        }

        .section-toggle-icon {
            width: 12px;
            height: 12px;
        }

        /* Collapsible section header styles */
        .section-header-collapsible {
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background 0.15s ease;
        }

        .section-header-collapsible:hover {
            background: var(--vscode-list-hoverBackground);
        }

        .section-header-collapsible:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: -2px;
        }

        /* Section header right side (count + toggle) */
        .section-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Section content with smooth collapse animation */
        .section-content {
            display: block;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.2s ease, padding 0.2s ease;
            opacity: 1;
        }

        .section-content.collapsed {
            max-height: 0;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            opacity: 0;
            overflow: hidden;
        }

        /* Mobile view specific styles */
        body.mobile-view .collapsible-section {
            margin-bottom: 8px;
        }

        body.mobile-view .section-header-collapsible {
            padding: 8px 10px;
        }

        /* Timeline section collapsible adjustments */
        .timeline-section.collapsible-section .timeline-header {
            gap: 8px;
        }

        /* Task section collapsible adjustments */
        .task-section.collapsible-section .task-header {
            padding: 8px 10px;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(37, 99, 235, 0.1));
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        .task-section.collapsible-section .task-header:hover {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(37, 99, 235, 0.15));
        }

        .task-section.collapsible-section .task-content {
            padding: 10px;
        }

        .task-section.collapsible-section .task-label {
            margin-bottom: 0;
        }

        /* Log section collapsible adjustments */
        .log-section.collapsible-section .log-header {
            gap: 8px;
        }

        .log-section.collapsible-section .log-content.section-content {
            max-height: 200px;
        }

        .log-section.collapsible-section .log-content.section-content.collapsed {
            max-height: 0;
        }

        /* Collapsed indicator visual hint */
        .collapsible-section .section-header-collapsible[aria-expanded="false"]::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--vscode-widget-border), transparent);
            opacity: 0.5;
        }

        .requirements-desc {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 12px;
            line-height: 1.4;
        }

        .requirement-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            font-size: 12px;
            border-radius: 4px;
            margin-bottom: 4px;
            transition: background 0.15s;
        }

        .requirement-item:hover { background: var(--vscode-list-hoverBackground); }
        .requirement-item:last-child { margin-bottom: 0; }

        .requirement-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--gradient-2);
            cursor: pointer;
            flex-shrink: 0;
        }

        .requirement-item label {
            cursor: pointer;
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .requirement-item svg { opacity: 0.7; flex-shrink: 0; }

        .requirement-item .req-desc {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-left: 22px;
            margin-top: 2px;
        }

        .setting-help {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
            padding: 8px 10px;
            background: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
            line-height: 1.4;
        }

        /* Settings overlay view */
        .settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--vscode-editor-background);
            z-index: 100;
            display: none;
            flex-direction: column;
        }

        .settings-overlay.visible { display: flex; }

        .settings-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
            color: white;
        }

        .settings-header h2 {
            font-size: 14px;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .settings-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .settings-close:hover { background: rgba(255,255,255,0.3); }
        .settings-body { flex: 1; padding: 16px; overflow-y: auto; }
        .settings-section { margin-bottom: 24px; }

        .settings-section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        /* ================================================================
           Keyboard Navigation Focus Indicators
           ================================================================ */

        /* Focus outline for all interactive elements */
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible,
        a:focus-visible,
        [tabindex]:focus-visible,
        .requirements-header:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 2px;
        }

        /* Enhanced focus for buttons */
        button:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-editor-background),
                        0 0 0 4px var(--vscode-focusBorder, #007acc);
        }

        /* Focus styles for primary buttons */
        button.primary:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-editor-background),
                        0 0 0 4px var(--gradient-2);
        }

        /* Focus styles for danger buttons */
        button.danger:focus-visible {
            box-shadow: 0 0 0 2px var(--vscode-editor-background),
                        0 0 0 4px #dc2626;
        }

        /* Focus styles for settings close button (in gradient header) */
        .settings-close:focus-visible {
            outline: 2px solid white;
            outline-offset: 2px;
            box-shadow: none;
        }

        /* Focus styles for checkboxes */
        .requirement-item input[type="checkbox"]:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 2px;
        }

        /* Focus styles for requirements header (collapsible) */
        .requirements-header:focus-visible {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(37, 99, 235, 0.15));
        }

        /* Focus styles for textarea */
        .setup-textarea:focus-visible {
            outline: none;
            border-color: var(--vscode-focusBorder, #007acc);
            box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007acc);
        }

        /* Focus styles for number input in settings */
        .settings-body input[type="number"]:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 1px;
        }

        /* Focus styles for links */
        a:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 2px;
            border-radius: 2px;
        }

        /* Main content area - needs to be focusable for Escape key handling */
        #mainContent:focus {
            outline: none;
        }

        /* Skip link for keyboard users (screen reader accessible) */
        .skip-link {
            position: absolute;
            left: -9999px;
            z-index: 1000;
            padding: 8px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            text-decoration: none;
            border-radius: 4px;
        }

        .skip-link:focus {
            left: 16px;
            top: 16px;
        }

        /* ================================================================
           Loading Spinners for Async Operations
           ================================================================ */

        /* Base spinner styles */
        .btn-spinner {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            animation: btn-spin 0.8s linear infinite;
            flex-shrink: 0;
        }

        @keyframes btn-spin {
            to { transform: rotate(360deg); }
        }

        /* Hide spinner by default, show when button is loading */
        .btn-spinner {
            display: none;
        }

        button.loading .btn-spinner {
            display: inline-block;
        }

        /* Hide button text icon when loading */
        button.loading .btn-icon {
            display: none;
        }

        /* Loading state for buttons */
        button.loading {
            pointer-events: none;
            opacity: 0.7;
        }

        /* Generate button loading state */
        .generate-btn.loading {
            cursor: wait;
        }

        /* Larger spinner for generate button */
        .generate-btn .btn-spinner {
            width: 14px;
            height: 14px;
        }

        /* Refresh button loading animation */
        button.icon-only.loading svg {
            animation: spin-slow 1s linear infinite;
        }

        @keyframes spin-slow {
            to { transform: rotate(360deg); }
        }

        /* Loading overlay for content areas */
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--vscode-editor-background);
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }

        .loading-overlay .spinner-large {
            width: 24px;
            height: 24px;
            border: 3px solid var(--vscode-focusBorder);
            border-top-color: transparent;
            border-radius: 50%;
            animation: btn-spin 0.8s linear infinite;
        }

        /* ================================================================
           Screen Reader Announcer
           Visually hidden but accessible to screen readers
           ================================================================ */

        .sr-announcer {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* ================================================================
           High Contrast Theme Support
           Styles for VS Code high contrast themes (dark and light)
           Uses body classes: .vscode-high-contrast, .vscode-high-contrast-light
           ================================================================ */

        /* High Contrast Dark Theme */
        body.vscode-high-contrast {
            --hc-border: var(--vscode-contrastBorder, #6fc3df);
            --hc-active-border: var(--vscode-contrastActiveBorder, #f38518);
            --hc-focus: var(--vscode-focusBorder, #f38518);
        }

        body.vscode-high-contrast .header {
            background: var(--vscode-sideBar-background);
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .header.running,
        body.vscode-high-contrast .header.waiting {
            animation: none;
            background: var(--vscode-sideBar-background);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .header.running::after,
        body.vscode-high-contrast .header.waiting::after {
            display: none;
        }

        body.vscode-high-contrast .status-pill {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .header.running .status-pill,
        body.vscode-high-contrast .header.waiting .status-pill {
            border-color: var(--hc-active-border);
            color: var(--vscode-foreground);
            background: transparent;
        }

        body.vscode-high-contrast .header.running .title h1,
        body.vscode-high-contrast .header.waiting .title h1 {
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .timing-display,
        body.vscode-high-contrast .countdown {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast button {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast button:hover:not(:disabled) {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast button:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            border-color: var(--hc-focus);
        }

        body.vscode-high-contrast button.primary {
            background: transparent;
            color: var(--vscode-foreground);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast button.danger {
            background: transparent;
            color: var(--vscode-errorForeground, #f48771);
            border-color: var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .generate-btn {
            background: transparent;
            color: var(--vscode-foreground);
            border: 1px solid var(--hc-active-border);
        }

        /* Loading spinner in high contrast */
        body.vscode-high-contrast .btn-spinner {
            border-color: var(--hc-active-border);
            border-top-color: transparent;
        }

        body.vscode-high-contrast button.loading {
            opacity: 0.8;
        }

        body.vscode-high-contrast .loading-overlay .spinner-large {
            border-color: var(--hc-active-border);
            border-top-color: transparent;
        }

        body.vscode-high-contrast .task-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .task-section.active {
            border-color: var(--hc-active-border);
            border-width: 2px;
        }

        body.vscode-high-contrast .log-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .log-entry:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .timeline-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .timeline-bar {
            background: var(--hc-active-border);
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .timeline-bar.current {
            background: var(--hc-active-border);
            animation: barPulse 2s ease-in-out infinite;
        }

        body.vscode-high-contrast .timeline-bar.current::after {
            display: none;
        }

        /* High contrast task section executing */
        body.vscode-high-contrast .task-section.executing {
            border-color: var(--hc-active-border);
            box-shadow: none;
            animation: none;
        }

        body.vscode-high-contrast .task-section.executing::before {
            display: none;
        }

        body.vscode-high-contrast .task-progress {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .task-progress-bar {
            background: var(--hc-active-border);
            animation: none;
        }

        body.vscode-high-contrast .task-progress-bar.indeterminate {
            animation: progressIndeterminate 1.5s ease-in-out infinite;
        }

        /* High contrast - Task details panel */
        body.vscode-high-contrast .task-details-panel {
            background: transparent;
            border: 1px solid var(--hc-border);
            animation: none;
        }

        body.vscode-high-contrast .task-details-toggle {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .task-details-toggle:hover,
        body.vscode-high-contrast .task-details-toggle:focus-visible {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .task-details-toggle[aria-expanded="true"] {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .task-detail-id {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .task-detail-status,
        body.vscode-high-contrast .task-detail-complexity {
            background: transparent;
            border: 1px solid currentColor;
        }

        body.vscode-high-contrast .task-detail-status.pending { color: #6fc3df; }
        body.vscode-high-contrast .task-detail-status.in-progress { color: #f38518; }
        body.vscode-high-contrast .task-detail-status.complete { color: #90ee90; }
        body.vscode-high-contrast .task-detail-status.blocked { color: #ffa07a; }
        body.vscode-high-contrast .task-detail-status.skipped { color: #a0a0a0; }

        body.vscode-high-contrast .task-detail-complexity.complexity-low { color: #90ee90; }
        body.vscode-high-contrast .task-detail-complexity.complexity-medium { color: #ffd700; }
        body.vscode-high-contrast .task-detail-complexity.complexity-high { color: #ffa07a; }

        body.vscode-high-contrast .task-detail-dependency {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .task-detail-related-file {
            background: transparent;
            border: 1px solid #6fc3df;
            color: #6fc3df;
        }

        body.vscode-high-contrast .task-detail-related-file:hover {
            border-color: var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast .task-detail-related-file.is-directory {
            border-color: #ffd700;
            color: #ffd700;
        }

        body.vscode-high-contrast .task-detail-related-file.is-glob {
            border-color: #b19cd9;
            color: #b19cd9;
        }

        body.vscode-high-contrast .task-detail-criterion {
            background: transparent;
            border: 1px solid #90ee90;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .criterion-bullet {
            color: #90ee90;
        }

        body.vscode-high-contrast .estimated-time-value {
            background: transparent;
            border: 1px solid #b19cd9;
            color: #b19cd9;
        }

        body.vscode-high-contrast .estimated-time-value.no-data {
            border-color: #a0a0a0;
            color: #a0a0a0;
        }

        body.vscode-high-contrast .timeline-bar.pending {
            background: transparent;
            border: 1px dashed var(--hc-border);
            opacity: 1;
        }

        body.vscode-high-contrast .requirements-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .requirements-header {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .requirements-header:hover {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .requirements-header:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: -2px;
        }

        body.vscode-high-contrast .requirement-item:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .requirement-item input[type="checkbox"] {
            accent-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .requirement-item input[type="checkbox"]:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
        }

        body.vscode-high-contrast .setup-section {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .setup-textarea {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .setup-textarea:focus {
            border-color: var(--hc-focus);
            box-shadow: none;
        }

        /* High contrast validation states */
        body.vscode-high-contrast .setup-textarea.validation-error {
            border-color: #ffa07a;
            border-width: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast .setup-textarea.validation-success {
            border-color: #90ee90;
            border-width: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast .validation-message.error {
            color: #ffa07a;
        }

        body.vscode-high-contrast .validation-message.success {
            color: #90ee90;
        }

        body.vscode-high-contrast .textarea-char-count.warning {
            color: #ffd700;
        }

        body.vscode-high-contrast .textarea-char-count.error {
            color: #ffa07a;
        }

        body.vscode-high-contrast .settings-overlay {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .settings-header {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .settings-close {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .settings-close:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .footer-warning {
            background: transparent;
            border: 1px solid var(--vscode-editorWarning-foreground, #cca700);
            color: var(--vscode-editorWarning-foreground, #cca700);
        }

        body.vscode-high-contrast .warning-banner {
            background: transparent;
            border: 1px solid var(--vscode-editorWarning-foreground, #cca700);
        }

        body.vscode-high-contrast a {
            text-decoration: underline;
        }

        body.vscode-high-contrast a:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
        }

        /* Progress bar in high contrast */
        body.vscode-high-contrast .countdown-clock-bg {
            stroke: var(--hc-border);
        }

        body.vscode-high-contrast .countdown-clock-fill {
            stroke: var(--hc-active-border);
        }

        /* Log entry colors in high contrast */
        body.vscode-high-contrast .log-entry.success .log-msg {
            color: var(--vscode-terminal-ansiGreen, #89d185);
        }

        body.vscode-high-contrast .log-entry.warning .log-msg {
            color: var(--vscode-terminal-ansiYellow, #cca700);
        }

        body.vscode-high-contrast .log-entry.warning {
            background: transparent;
            border-left: 2px dashed var(--vscode-terminal-ansiYellow, #cca700);
        }

        body.vscode-high-contrast .log-entry.error .log-msg {
            color: var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .log-entry.error {
            background: transparent;
            border-left: 2px solid var(--vscode-errorForeground, #f48771);
        }

        /* Virtual scroll indicator in high contrast dark */
        body.vscode-high-contrast .virtual-scroll-indicator {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        /* Log filter buttons in high contrast dark */
        body.vscode-high-contrast .log-filters {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .log-filter-btn {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .log-filter-btn:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .log-filter-btn.active {
            background: transparent;
            border: 2px solid var(--hc-active-border);
        }

        body.vscode-high-contrast .log-filter-btn[data-level="info"].active {
            background: transparent;
            border-color: var(--vscode-textLink-foreground);
            color: var(--vscode-textLink-foreground);
        }

        body.vscode-high-contrast .log-filter-btn[data-level="warning"].active {
            background: transparent;
            border-color: var(--vscode-terminal-ansiYellow, #cca700);
            color: var(--vscode-terminal-ansiYellow, #cca700);
        }

        body.vscode-high-contrast .log-filter-btn[data-level="error"].active {
            background: transparent;
            border-color: var(--vscode-errorForeground, #f48771);
            color: var(--vscode-errorForeground, #f48771);
        }

        /* Log action buttons in high contrast dark */
        body.vscode-high-contrast .log-action-btn {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .log-action-btn:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .log-action-btn.copied {
            background: transparent;
            border-color: #90ee90;
            color: #90ee90;
        }

        /* Timestamp toggle in high contrast dark */
        body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="true"] {
            background: transparent;
            border: 2px solid var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="false"] {
            opacity: 1;
            border-style: dashed;
        }

        /* Auto-scroll toggle in high contrast dark */
        body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="true"] {
            background: transparent;
            border: 2px solid var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="false"] {
            opacity: 1;
            border-style: dashed;
        }

        /* Log search in high contrast dark */
        body.vscode-high-contrast .log-search-container {
            background: transparent;
            border: 1px solid var(--hc-border);
            border-top: none;
        }

        body.vscode-high-contrast .log-search-input {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .log-search-input:focus {
            border-color: var(--hc-focus);
            box-shadow: none;
            outline: 1px solid var(--hc-focus);
        }

        body.vscode-high-contrast .log-search-clear {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .log-search-clear:hover {
            border-color: var(--hc-active-border);
            background: transparent;
        }

        body.vscode-high-contrast .log-entry .search-highlight {
            background: transparent;
            border: 1px solid var(--vscode-terminal-ansiYellow, #cca700);
            color: var(--vscode-terminal-ansiYellow, #cca700);
        }

        body.vscode-high-contrast .log-entry.search-match {
            background: transparent;
            border-left: 2px solid var(--vscode-terminal-ansiYellow, #cca700);
        }

        body.vscode-high-contrast .log-search-count.no-matches {
            color: var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .log-search-count.has-matches {
            color: var(--vscode-terminal-ansiGreen, #89d185);
        }

        /* Collapsible sections in high contrast dark */
        body.vscode-high-contrast .collapsible-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .section-header-collapsible {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .section-header-collapsible:hover {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .section-header-collapsible:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: -2px;
        }

        body.vscode-high-contrast .section-header-collapsible[aria-expanded="false"] {
            border-bottom-color: transparent;
        }

        body.vscode-high-contrast .section-toggle {
            color: var(--vscode-foreground);
            opacity: 1;
        }

        body.vscode-high-contrast .section-content {
            border-top: none;
        }

        body.vscode-high-contrast .section-content.collapsed {
            border: none;
        }

        /* High Contrast Light Theme */
        body.vscode-high-contrast-light {
            --hc-border: var(--vscode-contrastBorder, #0f4a85);
            --hc-active-border: var(--vscode-contrastActiveBorder, #b5200d);
            --hc-focus: var(--vscode-focusBorder, #0f4a85);
        }

        body.vscode-high-contrast-light .header {
            background: var(--vscode-sideBar-background);
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .header.running,
        body.vscode-high-contrast-light .header.waiting {
            animation: none;
            background: var(--vscode-sideBar-background);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .header.running::after,
        body.vscode-high-contrast-light .header.waiting::after {
            display: none;
        }

        body.vscode-high-contrast-light .status-pill {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .header.running .status-pill,
        body.vscode-high-contrast-light .header.waiting .status-pill {
            border-color: var(--hc-active-border);
            color: var(--vscode-foreground);
            background: transparent;
        }

        body.vscode-high-contrast-light .header.running .title h1,
        body.vscode-high-contrast-light .header.waiting .title h1 {
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .timing-display,
        body.vscode-high-contrast-light .countdown {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light button {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light button:hover:not(:disabled) {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light button:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
            border-color: var(--hc-focus);
        }

        body.vscode-high-contrast-light button.primary {
            background: transparent;
            color: var(--vscode-foreground);
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light button.danger {
            background: transparent;
            color: var(--vscode-errorForeground, #b5200d);
            border-color: var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .generate-btn {
            background: transparent;
            color: var(--vscode-foreground);
            border: 1px solid var(--hc-active-border);
        }

        /* Loading spinner in high contrast light */
        body.vscode-high-contrast-light .btn-spinner {
            border-color: var(--hc-active-border);
            border-top-color: transparent;
        }

        body.vscode-high-contrast-light button.loading {
            opacity: 0.8;
        }

        body.vscode-high-contrast-light .loading-overlay .spinner-large {
            border-color: var(--hc-active-border);
            border-top-color: transparent;
        }

        body.vscode-high-contrast-light .task-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .task-section.active {
            border-color: var(--hc-active-border);
            border-width: 2px;
        }

        body.vscode-high-contrast-light .log-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .log-entry:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .timeline-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .timeline-bar {
            background: var(--hc-active-border);
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .timeline-bar.current {
            background: var(--hc-active-border);
            animation: barPulse 2s ease-in-out infinite;
        }

        body.vscode-high-contrast-light .timeline-bar.current::after {
            display: none;
        }

        /* High contrast light task section executing */
        body.vscode-high-contrast-light .task-section.executing {
            border-color: var(--hc-active-border);
            box-shadow: none;
            animation: none;
        }

        body.vscode-high-contrast-light .task-section.executing::before {
            display: none;
        }

        body.vscode-high-contrast-light .task-progress {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .task-progress-bar {
            background: var(--hc-active-border);
            animation: none;
        }

        body.vscode-high-contrast-light .task-progress-bar.indeterminate {
            animation: progressIndeterminate 1.5s ease-in-out infinite;
        }

        /* High contrast light - Task details panel */
        body.vscode-high-contrast-light .task-details-panel {
            background: transparent;
            border: 1px solid var(--hc-border);
            animation: none;
        }

        body.vscode-high-contrast-light .task-details-toggle {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .task-details-toggle:hover,
        body.vscode-high-contrast-light .task-details-toggle:focus-visible {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .task-details-toggle[aria-expanded="true"] {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .task-detail-id {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .task-detail-status,
        body.vscode-high-contrast-light .task-detail-complexity {
            background: transparent;
            border: 1px solid currentColor;
        }

        body.vscode-high-contrast-light .task-detail-status.pending { color: #0f4a85; }
        body.vscode-high-contrast-light .task-detail-status.in-progress { color: #7c3aed; }
        body.vscode-high-contrast-light .task-detail-status.complete { color: #15803d; }
        body.vscode-high-contrast-light .task-detail-status.blocked { color: #b91c1c; }
        body.vscode-high-contrast-light .task-detail-status.skipped { color: #525252; }

        body.vscode-high-contrast-light .task-detail-complexity.complexity-low { color: #15803d; }
        body.vscode-high-contrast-light .task-detail-complexity.complexity-medium { color: #a16207; }
        body.vscode-high-contrast-light .task-detail-complexity.complexity-high { color: #b91c1c; }

        body.vscode-high-contrast-light .task-detail-dependency {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .task-detail-related-file {
            background: transparent;
            border: 1px solid #0f4a85;
            color: #0f4a85;
        }

        body.vscode-high-contrast-light .task-detail-related-file:hover {
            border-color: var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .task-detail-related-file.is-directory {
            border-color: #a16207;
            color: #a16207;
        }

        body.vscode-high-contrast-light .task-detail-related-file.is-glob {
            border-color: #6b21a8;
            color: #6b21a8;
        }

        body.vscode-high-contrast-light .task-detail-criterion {
            background: transparent;
            border: 1px solid #15803d;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .criterion-bullet {
            color: #15803d;
        }

        body.vscode-high-contrast-light .estimated-time-value {
            background: transparent;
            border: 1px solid #6b21a8;
            color: #6b21a8;
        }

        body.vscode-high-contrast-light .estimated-time-value.no-data {
            border-color: #525252;
            color: #525252;
        }

        body.vscode-high-contrast-light .timeline-bar.pending {
            background: transparent;
            border: 1px dashed var(--hc-border);
            opacity: 1;
        }

        body.vscode-high-contrast-light .requirements-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .requirements-header {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .requirements-header:hover {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .requirements-header:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: -2px;
        }

        body.vscode-high-contrast-light .requirement-item:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .requirement-item input[type="checkbox"] {
            accent-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .requirement-item input[type="checkbox"]:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
        }

        body.vscode-high-contrast-light .setup-section {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .setup-textarea {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .setup-textarea:focus {
            border-color: var(--hc-focus);
            box-shadow: none;
        }

        /* High contrast light validation states */
        body.vscode-high-contrast-light .setup-textarea.validation-error {
            border-color: #b91c1c;
            border-width: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast-light .setup-textarea.validation-success {
            border-color: #15803d;
            border-width: 2px;
            box-shadow: none;
        }

        body.vscode-high-contrast-light .validation-message.error {
            color: #b91c1c;
        }

        body.vscode-high-contrast-light .validation-message.success {
            color: #15803d;
        }

        body.vscode-high-contrast-light .textarea-char-count.warning {
            color: #a16207;
        }

        body.vscode-high-contrast-light .textarea-char-count.error {
            color: #b91c1c;
        }

        body.vscode-high-contrast-light .settings-overlay {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .settings-header {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .settings-close {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .settings-close:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .footer-warning {
            background: transparent;
            border: 1px solid var(--vscode-editorWarning-foreground, #7a6400);
            color: var(--vscode-editorWarning-foreground, #7a6400);
        }

        body.vscode-high-contrast-light .warning-banner {
            background: transparent;
            border: 1px solid var(--vscode-editorWarning-foreground, #7a6400);
        }

        body.vscode-high-contrast-light a {
            text-decoration: underline;
        }

        body.vscode-high-contrast-light a:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: 2px;
        }

        /* Progress bar in high contrast light */
        body.vscode-high-contrast-light .countdown-clock-bg {
            stroke: var(--hc-border);
        }

        body.vscode-high-contrast-light .countdown-clock-fill {
            stroke: var(--hc-active-border);
        }

        /* Log entry colors in high contrast light */
        body.vscode-high-contrast-light .log-entry.success .log-msg {
            color: var(--vscode-terminal-ansiGreen, #116329);
        }

        body.vscode-high-contrast-light .log-entry.warning .log-msg {
            color: var(--vscode-terminal-ansiYellow, #7c4700);
        }

        body.vscode-high-contrast-light .log-entry.warning {
            background: transparent;
            border-left: 2px dashed var(--vscode-terminal-ansiYellow, #7c4700);
        }

        body.vscode-high-contrast-light .log-entry.error .log-msg {
            color: var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .log-entry.error {
            background: transparent;
            border-left: 2px solid var(--vscode-errorForeground, #b5200d);
        }

        /* Virtual scroll indicator in high contrast light */
        body.vscode-high-contrast-light .virtual-scroll-indicator {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        /* Log filter buttons in high contrast light */
        body.vscode-high-contrast-light .log-filters {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .log-filter-btn {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .log-filter-btn:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .log-filter-btn.active {
            background: transparent;
            border: 2px solid var(--hc-active-border);
        }

        body.vscode-high-contrast-light .log-filter-btn[data-level="info"].active {
            background: transparent;
            border-color: var(--vscode-textLink-foreground);
            color: var(--vscode-textLink-foreground);
        }

        body.vscode-high-contrast-light .log-filter-btn[data-level="warning"].active {
            background: transparent;
            border-color: var(--vscode-terminal-ansiYellow, #7c4700);
            color: var(--vscode-terminal-ansiYellow, #7c4700);
        }

        body.vscode-high-contrast-light .log-filter-btn[data-level="error"].active {
            background: transparent;
            border-color: var(--vscode-errorForeground, #b5200d);
            color: var(--vscode-errorForeground, #b5200d);
        }

        /* Log action buttons in high contrast light */
        body.vscode-high-contrast-light .log-action-btn {
            background: transparent;
            border: 1px solid var(--hc-border);
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .log-action-btn:hover {
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .log-action-btn.copied {
            background: transparent;
            border-color: #15803d;
            color: #15803d;
        }

        /* Timestamp toggle in high contrast light */
        body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="true"] {
            background: transparent;
            border: 2px solid var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="false"] {
            opacity: 1;
            border-style: dashed;
        }

        /* Auto-scroll toggle in high contrast light */
        body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="true"] {
            background: transparent;
            border: 2px solid var(--hc-active-border);
            color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="false"] {
            opacity: 1;
            border-style: dashed;
        }

        /* Log search in high contrast light */
        body.vscode-high-contrast-light .log-search-container {
            background: transparent;
            border: 1px solid var(--hc-border);
            border-top: none;
        }

        body.vscode-high-contrast-light .log-search-input {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .log-search-input:focus {
            border-color: var(--hc-focus);
            box-shadow: none;
            outline: 1px solid var(--hc-focus);
        }

        body.vscode-high-contrast-light .log-search-clear {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .log-search-clear:hover {
            border-color: var(--hc-active-border);
            background: transparent;
        }

        body.vscode-high-contrast-light .log-entry .search-highlight {
            background: transparent;
            border: 1px solid var(--vscode-terminal-ansiYellow, #7c4700);
            color: var(--vscode-terminal-ansiYellow, #7c4700);
        }

        body.vscode-high-contrast-light .log-entry.search-match {
            background: transparent;
            border-left: 2px solid var(--vscode-terminal-ansiYellow, #7c4700);
        }

        body.vscode-high-contrast-light .log-search-count.no-matches {
            color: var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .log-search-count.has-matches {
            color: var(--vscode-terminal-ansiGreen, #15803d);
        }

        /* Collapsible sections in high contrast light */
        body.vscode-high-contrast-light .collapsible-section {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .section-header-collapsible {
            background: transparent;
            border-bottom: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .section-header-collapsible:hover {
            background: transparent;
            border-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .section-header-collapsible:focus-visible {
            outline: 2px solid var(--hc-focus);
            outline-offset: -2px;
        }

        body.vscode-high-contrast-light .section-header-collapsible[aria-expanded="false"] {
            border-bottom-color: transparent;
        }

        body.vscode-high-contrast-light .section-toggle {
            color: var(--vscode-foreground);
            opacity: 1;
        }

        body.vscode-high-contrast-light .section-content {
            border-top: none;
        }

        body.vscode-high-contrast-light .section-content.collapsed {
            border: none;
        }

        /* Progress percentage gradient override for high contrast */
        body.vscode-high-contrast .progress-percentage-value,
        body.vscode-high-contrast-light .progress-percentage-value {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .progress-percentage-complete,
        body.vscode-high-contrast-light .progress-percentage-complete {
            background: none;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
            background-clip: unset;
            color: var(--vscode-terminal-ansiGreen, #89d185);
        }

        body.vscode-high-contrast-light .progress-percentage-complete {
            color: var(--vscode-terminal-ansiGreen, #116329);
        }

        /* ================================================================
           Toast Notifications
           ================================================================ */

        .toast-container {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 320px;
            pointer-events: none;
        }

        .toast {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 14px;
            background: var(--vscode-notifications-background, var(--vscode-editorWidget-background));
            border: 1px solid var(--vscode-notifications-border, var(--vscode-widget-border));
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 12px;
            line-height: 1.4;
            color: var(--vscode-notifications-foreground, var(--vscode-foreground));
            pointer-events: auto;
            animation: toastSlideIn 0.3s ease forwards;
            max-width: 100%;
        }

        .toast.dismissing {
            animation: toastSlideOut 0.3s ease forwards;
        }

        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }

        .toast-icon {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .toast-content {
            flex: 1;
            min-width: 0;
        }

        .toast-title {
            font-weight: 600;
            margin-bottom: 2px;
        }

        .toast-message {
            color: var(--vscode-descriptionForeground);
            word-break: break-word;
        }

        .toast-dismiss {
            flex-shrink: 0;
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground);
            cursor: pointer;
            padding: 2px;
            margin: -2px -4px -2px 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.15s, background 0.15s;
        }

        .toast-dismiss:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
        }

        .toast-dismiss:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 1px;
            opacity: 1;
        }

        /* Toast type variants */
        .toast.success {
            border-left: 3px solid #22c55e;
        }

        .toast.success .toast-icon {
            color: #22c55e;
        }

        .toast.error {
            border-left: 3px solid #ef4444;
        }

        .toast.error .toast-icon {
            color: #ef4444;
        }

        .toast.warning {
            border-left: 3px solid #eab308;
        }

        .toast.warning .toast-icon {
            color: #eab308;
        }

        .toast.info {
            border-left: 3px solid #3b82f6;
        }

        .toast.info .toast-icon {
            color: #3b82f6;
        }

        /* Toast progress bar for auto-dismiss */
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--vscode-progressBar-background, #0066bf);
            transform-origin: left;
            border-radius: 0 0 0 6px;
        }

        .toast-progress.animate {
            animation: toastProgressShrink 5s linear forwards;
        }

        @keyframes toastProgressShrink {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }

        /* ====================================================================
         * Skeleton Loaders
         * ==================================================================== */

        /* Base skeleton element */
        .skeleton {
            position: relative;
            overflow: hidden;
            background: var(--vscode-input-background);
            border-radius: 4px;
        }

        /* Shimmer animation overlay */
        .skeleton::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.08),
                transparent
            );
            animation: skeletonShimmer 1.5s ease-in-out infinite;
        }

        @keyframes skeletonShimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }

        /* Skeleton text lines */
        .skeleton-text {
            height: 14px;
            margin-bottom: 8px;
            border-radius: 3px;
        }

        .skeleton-text.short {
            width: 40%;
        }

        .skeleton-text.medium {
            width: 70%;
        }

        .skeleton-text.long {
            width: 90%;
        }

        .skeleton-text.full {
            width: 100%;
        }

        /* Skeleton title (larger text) */
        .skeleton-title {
            height: 18px;
            width: 60%;
            margin-bottom: 12px;
            border-radius: 3px;
        }

        /* Skeleton timeline container */
        .skeleton-timeline {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
        }

        /* Skeleton timeline bars */
        .skeleton-timeline-bars {
            display: flex;
            align-items: flex-end;
            gap: 4px;
            height: 60px;
            padding: 8px 0;
        }

        .skeleton-timeline-bar {
            flex: 1;
            border-radius: 3px 3px 0 0;
            min-height: 12px;
        }

        .skeleton-timeline-bar:nth-child(1) { height: 40%; }
        .skeleton-timeline-bar:nth-child(2) { height: 65%; }
        .skeleton-timeline-bar:nth-child(3) { height: 50%; }
        .skeleton-timeline-bar:nth-child(4) { height: 80%; }
        .skeleton-timeline-bar:nth-child(5) { height: 45%; }
        .skeleton-timeline-bar:nth-child(6) { height: 70%; }

        .skeleton-timeline-labels {
            display: flex;
            gap: 4px;
        }

        .skeleton-timeline-label {
            flex: 1;
            height: 10px;
            border-radius: 2px;
        }

        /* Skeleton task section */
        .skeleton-task {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
        }

        .skeleton-task-label {
            height: 11px;
            width: 80px;
            margin-bottom: 8px;
            border-radius: 2px;
        }

        .skeleton-task-text {
            height: 14px;
            width: 85%;
            margin-bottom: 6px;
            border-radius: 3px;
        }

        .skeleton-task-text:last-child {
            width: 60%;
            margin-bottom: 0;
        }

        /* Skeleton log section */
        .skeleton-log {
            background: var(--vscode-terminal-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            overflow: hidden;
        }

        .skeleton-log-header {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        .skeleton-log-header-text {
            height: 11px;
            width: 60px;
            border-radius: 2px;
        }

        .skeleton-log-content {
            padding: 8px;
        }

        .skeleton-log-entry {
            display: flex;
            gap: 8px;
            padding: 4px 8px;
            margin-bottom: 4px;
        }

        .skeleton-log-time {
            height: 12px;
            width: 40px;
            border-radius: 2px;
            flex-shrink: 0;
        }

        .skeleton-log-msg {
            height: 12px;
            flex: 1;
            border-radius: 2px;
        }

        .skeleton-log-entry:nth-child(1) .skeleton-log-msg { width: 90%; }
        .skeleton-log-entry:nth-child(2) .skeleton-log-msg { width: 75%; }
        .skeleton-log-entry:nth-child(3) .skeleton-log-msg { width: 82%; }

        /* Skeleton requirements section */
        .skeleton-requirements {
            margin-bottom: 16px;
        }

        .skeleton-requirements-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: var(--vscode-sideBarSectionHeader-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px 6px 0 0;
        }

        .skeleton-requirements-icon {
            height: 14px;
            width: 14px;
            border-radius: 2px;
        }

        .skeleton-requirements-title {
            height: 14px;
            width: 120px;
            border-radius: 3px;
        }

        .skeleton-requirements-content {
            padding: 10px 12px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-widget-border);
            border-top: none;
            border-radius: 0 0 6px 6px;
        }

        .skeleton-requirement-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
        }

        .skeleton-requirement-checkbox {
            height: 16px;
            width: 16px;
            border-radius: 3px;
            flex-shrink: 0;
        }

        .skeleton-requirement-label {
            height: 13px;
            border-radius: 3px;
        }

        .skeleton-requirement-item:nth-child(1) .skeleton-requirement-label { width: 100px; }
        .skeleton-requirement-item:nth-child(2) .skeleton-requirement-label { width: 70px; }
        .skeleton-requirement-item:nth-child(3) .skeleton-requirement-label { width: 90px; }
        .skeleton-requirement-item:nth-child(4) .skeleton-requirement-label { width: 80px; }
        .skeleton-requirement-item:nth-child(5) .skeleton-requirement-label { width: 130px; }
        .skeleton-requirement-item:nth-child(6) .skeleton-requirement-label { width: 110px; }

        /* Skeleton container for whole content area */
        .skeleton-container {
            padding: 16px;
        }

        /* Hide content when loading, show skeletons */
        .content.loading .timeline-section,
        .content.loading .task-section,
        .content.loading .log-section,
        .content.loading .requirements-section {
            display: none;
        }

        .content .skeleton-timeline,
        .content .skeleton-task,
        .content .skeleton-log,
        .content .skeleton-requirements {
            display: none;
        }

        .content.loading .skeleton-timeline,
        .content.loading .skeleton-task,
        .content.loading .skeleton-log,
        .content.loading .skeleton-requirements {
            display: block;
        }

        .content.loading .skeleton-timeline-bars {
            display: flex;
        }

        /* Pulse animation variant for skeleton (alternative to shimmer) */
        .skeleton.pulse {
            animation: skeletonPulse 1.5s ease-in-out infinite;
        }

        .skeleton.pulse::after {
            display: none;
        }

        @keyframes skeletonPulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        /* Skeleton loading indicator */
        .skeleton-loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }

        .skeleton-loading-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--vscode-descriptionForeground);
            animation: skeletonLoadingDot 1.4s ease-in-out infinite both;
        }

        .skeleton-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .skeleton-loading-dot:nth-child(2) { animation-delay: -0.16s; }
        .skeleton-loading-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes skeletonLoadingDot {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* High Contrast Dark Theme - Skeleton Loaders */
        body.vscode-high-contrast .skeleton {
            background: transparent;
            border: 1px dashed var(--hc-border);
        }

        body.vscode-high-contrast .skeleton::after {
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.15),
                transparent
            );
        }

        body.vscode-high-contrast .skeleton-task,
        body.vscode-high-contrast .skeleton-log,
        body.vscode-high-contrast .skeleton-requirements-content {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .skeleton-requirements-header {
            border: 1px solid var(--hc-border);
        }

        /* High Contrast Light Theme - Skeleton Loaders */
        body.vscode-high-contrast-light .skeleton {
            background: transparent;
            border: 1px dashed var(--hc-border);
        }

        body.vscode-high-contrast-light .skeleton::after {
            background: linear-gradient(
                90deg,
                transparent,
                rgba(0, 0, 0, 0.1),
                transparent
            );
        }

        body.vscode-high-contrast-light .skeleton-task,
        body.vscode-high-contrast-light .skeleton-log,
        body.vscode-high-contrast-light .skeleton-requirements-content {
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .skeleton-requirements-header {
            border: 1px solid var(--hc-border);
        }

        /* High Contrast Dark Theme - Toasts */
        body.vscode-high-contrast .toast {
            background: var(--vscode-editor-background);
            border: 1px solid var(--hc-border);
            box-shadow: none;
        }

        body.vscode-high-contrast .toast.success {
            border-left: 3px solid var(--vscode-terminal-ansiGreen, #89d185);
        }

        body.vscode-high-contrast .toast.success .toast-icon {
            color: var(--vscode-terminal-ansiGreen, #89d185);
        }

        body.vscode-high-contrast .toast.error {
            border-left: 3px solid var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .toast.error .toast-icon {
            color: var(--vscode-errorForeground, #f48771);
        }

        body.vscode-high-contrast .toast.warning {
            border-left: 3px solid var(--vscode-editorWarning-foreground, #cca700);
        }

        body.vscode-high-contrast .toast.warning .toast-icon {
            color: var(--vscode-editorWarning-foreground, #cca700);
        }

        body.vscode-high-contrast .toast.info {
            border-left: 3px solid var(--hc-border);
        }

        body.vscode-high-contrast .toast.info .toast-icon {
            color: var(--hc-border);
        }

        body.vscode-high-contrast .toast-dismiss:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast .toast-dismiss:focus-visible {
            outline: 2px solid var(--hc-focus);
        }

        /* High Contrast Light Theme - Toasts */
        body.vscode-high-contrast-light .toast {
            background: var(--vscode-editor-background);
            border: 1px solid var(--hc-border);
            box-shadow: none;
        }

        body.vscode-high-contrast-light .toast.success {
            border-left: 3px solid var(--vscode-terminal-ansiGreen, #116329);
        }

        body.vscode-high-contrast-light .toast.success .toast-icon {
            color: var(--vscode-terminal-ansiGreen, #116329);
        }

        body.vscode-high-contrast-light .toast.error {
            border-left: 3px solid var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .toast.error .toast-icon {
            color: var(--vscode-errorForeground, #b5200d);
        }

        body.vscode-high-contrast-light .toast.warning {
            border-left: 3px solid var(--vscode-editorWarning-foreground, #7a6400);
        }

        body.vscode-high-contrast-light .toast.warning .toast-icon {
            color: var(--vscode-editorWarning-foreground, #7a6400);
        }

        body.vscode-high-contrast-light .toast.info {
            border-left: 3px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .toast.info .toast-icon {
            color: var(--hc-border);
        }

        body.vscode-high-contrast-light .toast-dismiss:hover {
            background: transparent;
            border: 1px solid var(--hc-border);
        }

        body.vscode-high-contrast-light .toast-dismiss:focus-visible {
            outline: 2px solid var(--hc-focus);
        }

        /* ================================================================
           Responsive Breakpoint System - CSS Classes
           These classes are applied by JavaScript ResizeObserver for 
           component-level responsive behavior beyond container queries.
           ================================================================ */

        /* Breakpoint indicator classes - current breakpoint */
        body.breakpoint-xs { --current-breakpoint: 'xs'; }
        body.breakpoint-sm { --current-breakpoint: 'sm'; }
        body.breakpoint-md { --current-breakpoint: 'md'; }
        body.breakpoint-lg { --current-breakpoint: 'lg'; }

        /* Hide elements conditionally based on breakpoint classes */
        body.breakpoint-xs .hide-xs,
        body.breakpoint-sm .hide-sm,
        body.breakpoint-md .hide-md,
        body.breakpoint-lg .hide-lg {
            display: none !important;
        }

        /* Show elements only at specific breakpoints */
        body:not(.breakpoint-xs) .show-xs-only,
        body:not(.breakpoint-sm) .show-sm-only,
        body:not(.breakpoint-md) .show-md-only,
        body:not(.breakpoint-lg) .show-lg-only {
            display: none !important;
        }

        /* Hide elements below certain breakpoints */
        body.breakpoint-below-md .hide-below-md,
        body.breakpoint-below-lg .hide-below-lg {
            display: none !important;
        }

        /* Hide elements above certain breakpoints */
        body.breakpoint-above-xs .hide-above-xs,
        body.breakpoint-above-sm .hide-above-sm,
        body.breakpoint-above-md .hide-above-md {
            display: none !important;
        }

        /* Breakpoint-specific padding utilities */
        body.breakpoint-xs .p-xs-sm { padding: 8px; }
        body.breakpoint-sm .p-sm-sm { padding: 10px; }
        body.breakpoint-md .p-md-md { padding: 12px; }
        body.breakpoint-lg .p-lg-lg { padding: 16px; }

        /* Breakpoint-specific gap utilities */
        body.breakpoint-xs .gap-xs-sm { gap: 4px; }
        body.breakpoint-sm .gap-sm-sm { gap: 6px; }
        body.breakpoint-md .gap-md-md { gap: 8px; }
        body.breakpoint-lg .gap-lg-lg { gap: 12px; }

        /* Breakpoint-specific font size utilities */
        body.breakpoint-xs .text-xs-sm { font-size: 10px; }
        body.breakpoint-sm .text-sm-sm { font-size: 11px; }
        body.breakpoint-md .text-md-base { font-size: 12px; }
        body.breakpoint-lg .text-lg-base { font-size: 13px; }

        /* Breakpoint-specific flex direction utilities */
        body.breakpoint-xs .flex-xs-col { flex-direction: column; }
        body.breakpoint-sm .flex-sm-col { flex-direction: column; }
        body.breakpoint-below-md .flex-below-md-col { flex-direction: column; }

        /* Breakpoint-specific width utilities */
        body.breakpoint-xs .w-xs-full { width: 100%; }
        body.breakpoint-sm .w-sm-full { width: 100%; }
        body.breakpoint-below-md .w-below-md-full { width: 100%; }

        /* Responsive element visibility with data attributes */
        [data-show-at][hidden] {
            display: none !important;
        }

        [data-hide-at][hidden] {
            display: none !important;
        }

        /* Responsive text truncation */
        body.breakpoint-xs .truncate-xs,
        body.breakpoint-sm .truncate-sm {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        /* Stack layout helper for narrow breakpoints */
        body.breakpoint-xs .stack-xs,
        body.breakpoint-sm .stack-sm {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Responsive icon sizing */
        body.breakpoint-xs .icon-responsive {
            width: 14px;
            height: 14px;
        }
        body.breakpoint-sm .icon-responsive {
            width: 16px;
            height: 16px;
        }
        body.breakpoint-md .icon-responsive {
            width: 18px;
            height: 18px;
        }
        body.breakpoint-lg .icon-responsive {
            width: 20px;
            height: 20px;
        }

        /* Mobile view class (applied by JavaScript for narrow panels) */
        body.mobile-view {
            /* Override any fixed widths for mobile */
        }

        body.mobile-view .header-content {
            flex-direction: column;
            align-items: flex-start;
        }

        body.mobile-view .controls {
            width: 100%;
        }

        /* ================================================================
           Responsive Layout for Narrow Panel Widths
           Uses CSS container queries for granular control with media query fallback
           ================================================================ */

        /* Enable container queries on the main content area */
        body {
            container-type: inline-size;
            container-name: panel;
        }

        /* ----------------------------------------------------------------
           Medium Width (< 400px) - Minor adjustments
           ---------------------------------------------------------------- */
        @container panel (max-width: 400px) {
            .header {
                padding: 16px 16px;
            }

            .header-content {
                flex-wrap: wrap;
                gap: 12px;
            }

            .header-right {
                width: 100%;
                justify-content: flex-start;
                gap: 8px;
            }

            .timing-display {
                padding: 4px 10px;
                gap: 12px;
            }

            .timing-item {
                gap: 1px;
            }

            .timing-label {
                font-size: 8px;
            }

            .timing-value {
                font-size: 12px;
            }

            .countdown {
                padding: 4px 10px;
                font-size: 11px;
            }

            .countdown-clock {
                width: 24px;
                height: 24px;
            }

            .controls {
                gap: 6px;
                padding: 12px;
            }

            button {
                padding: 5px 10px;
                font-size: 11px;
            }

            button.icon-only {
                padding: 5px;
                min-width: 26px;
            }

            .content {
                padding: 12px;
            }

            .setup-section {
                padding: 16px;
            }

            .setup-header {
                font-size: 14px;
            }

            .timeline-content {
                padding: 10px;
            }

            .timeline-bar {
                min-width: 16px;
            }

            .requirement-item {
                padding: 6px 8px;
                font-size: 11px;
            }

            .task-section {
                padding: 10px;
            }

            .log-content {
                max-height: 150px;
            }

            .toast-container {
                max-width: 280px;
                right: 8px;
                top: 8px;
            }
        }

        /* ----------------------------------------------------------------
           Narrow Width (< 320px) - Compact layout
           ---------------------------------------------------------------- */
        @container panel (max-width: 320px) {
            .header {
                padding: 12px;
            }

            .title h1 {
                font-size: 14px;
            }

            .status-pill {
                padding: 3px 8px;
                font-size: 10px;
            }

            .status-dot {
                width: 5px;
                height: 5px;
            }

            .header-right {
                flex-wrap: wrap;
            }

            .timing-display {
                flex-wrap: wrap;
                gap: 8px;
            }

            .timing-item {
                min-width: 45px;
            }

            .controls {
                flex-wrap: wrap;
                gap: 4px;
                padding: 10px;
            }

            /* Stack control buttons in two rows on narrow widths */
            .controls button {
                flex: 1 1 auto;
                min-width: calc(33% - 4px);
            }

            /* Make Step button full width with the icon-only buttons */
            .controls .spacer {
                flex-basis: 100%;
                height: 4px;
            }

            button {
                padding: 4px 8px;
                font-size: 10px;
                gap: 4px;
            }

            button.icon-only {
                padding: 4px;
                min-width: 24px;
            }

            .content {
                padding: 10px;
            }

            .setup-section {
                padding: 12px;
            }

            .setup-header {
                font-size: 13px;
                gap: 8px;
            }

            .setup-icon {
                font-size: 16px;
            }

            .setup-description {
                font-size: 11px;
            }

            .setup-textarea {
                min-height: 60px;
                font-size: 12px;
                padding: 8px 10px;
            }

            .textarea-wrapper .setup-textarea {
                padding-bottom: 20px;
            }

            .textarea-char-count {
                font-size: 10px;
                bottom: 4px;
                right: 8px;
            }

            .generate-btn {
                padding: 8px 12px;
                font-size: 12px;
            }

            .timeline-header {
                padding: 6px 10px;
                font-size: 10px;
            }

            .timeline-content {
                padding: 8px;
                min-height: 50px;
            }

            .timeline-bars {
                height: 40px;
                gap: 3px;
            }

            .timeline-bar {
                min-width: 12px;
                max-width: 30px;
            }

            .timeline-label {
                font-size: 8px;
                min-width: 12px;
                max-width: 30px;
            }

            .timeline-labels {
                gap: 3px;
            }

            .requirements-header {
                padding: 8px 10px;
                font-size: 10px;
            }

            .requirements-content {
                padding: 10px;
            }

            .requirements-desc {
                font-size: 10px;
            }

            .requirement-item {
                padding: 5px 6px;
                font-size: 10px;
                gap: 8px;
            }

            .requirement-item input[type="checkbox"] {
                width: 14px;
                height: 14px;
            }

            .requirement-item .req-desc {
                font-size: 9px;
                margin-left: 18px;
            }

            .task-section {
                padding: 8px;
                margin-bottom: 12px;
            }

            .task-label {
                font-size: 10px;
                margin-bottom: 4px;
            }

            .task-text {
                font-size: 12px;
            }

            .log-section {
                margin-bottom: 12px;
            }

            .log-header {
                padding: 6px 10px;
                font-size: 10px;
            }

            .log-content {
                max-height: 120px;
                padding: 6px;
                font-size: 11px;
            }

            .log-entry {
                padding: 3px 6px;
                gap: 6px;
            }

            .log-time {
                font-size: 10px;
            }

            .footer {
                margin-top: 16px;
                padding: 10px;
                font-size: 10px;
            }

            .footer-warning {
                padding: 6px 8px;
                font-size: 10px;
            }

            .footer-version {
                padding: 1px 4px;
                font-size: 9px;
            }

            .settings-header {
                padding: 10px 12px;
            }

            .settings-header h2 {
                font-size: 13px;
            }

            .settings-body {
                padding: 12px;
            }

            .settings-section-title {
                font-size: 10px;
                margin-bottom: 10px;
            }

            .toast-container {
                max-width: 240px;
                left: 8px;
                right: 8px;
            }

            .toast {
                padding: 10px 12px;
                font-size: 11px;
            }

            .toast-title {
                font-size: 12px;
            }

            .toast-icon {
                width: 14px;
                height: 14px;
            }

            /* Collapsible section styles for narrow widths */
            .collapsible-section {
                margin-bottom: 8px;
            }

            .section-header-collapsible {
                padding: 6px 10px;
            }

            .section-toggle {
                opacity: 1;
            }

            .section-toggle-icon {
                width: 10px;
                height: 10px;
            }

            .section-header-right {
                gap: 6px;
            }

            /* Compact collapsed content for mobile */
            .section-content.collapsed {
                margin: 0;
                border: none;
            }
        }

        /* ----------------------------------------------------------------
           Very Narrow Width (< 250px) - Extreme compact mode
           ---------------------------------------------------------------- */
        @container panel (max-width: 250px) {
            .header {
                padding: 10px;
            }

            .header-content {
                gap: 8px;
            }

            .title {
                gap: 6px;
            }

            .ralph-logo {
                width: 20px;
                height: 20px;
            }

            .title h1 {
                font-size: 13px;
            }

            .status-pill {
                padding: 2px 6px;
                font-size: 9px;
                gap: 4px;
            }

            /* Hide timing display in very narrow mode - show only countdown */
            .timing-display {
                display: none !important;
            }

            .countdown {
                padding: 3px 8px;
                font-size: 10px;
                gap: 6px;
            }

            .countdown-clock {
                width: 20px;
                height: 20px;
            }

            .controls {
                padding: 8px;
                gap: 3px;
            }

            /* Stack all buttons vertically */
            .controls button {
                flex: 1 1 100%;
                min-width: 100%;
            }

            .controls .spacer {
                display: none;
            }

            /* Hide button text, show only icons for secondary buttons */
            .controls button.secondary:not(.icon-only),
            .controls button.danger {
                padding: 6px 8px;
            }

            button {
                padding: 4px 6px;
                font-size: 10px;
            }

            .content {
                padding: 8px;
            }

            .setup-section {
                padding: 10px;
            }

            .setup-header {
                font-size: 12px;
                flex-wrap: wrap;
            }

            .setup-description {
                font-size: 10px;
            }

            .setup-input-group {
                gap: 8px;
            }

            .setup-textarea {
                min-height: 50px;
                font-size: 11px;
                padding: 6px 8px;
            }

            .generate-btn {
                padding: 6px 10px;
                font-size: 11px;
            }

            .timeline-content {
                padding: 6px;
            }

            .timeline-bars {
                height: 35px;
                gap: 2px;
            }

            .timeline-bar {
                min-width: 8px;
                max-width: 20px;
            }

            .timeline-label {
                font-size: 7px;
                min-width: 8px;
                max-width: 20px;
            }

            /* Hide timeline labels in very narrow mode */
            .timeline-labels {
                display: none;
            }

            .requirements-header {
                padding: 6px 8px;
            }

            .requirements-content {
                padding: 8px;
            }

            .requirement-item {
                padding: 4px 5px;
                font-size: 9px;
            }

            /* Hide requirement descriptions in very narrow mode */
            .requirement-item .req-desc {
                display: none;
            }

            .task-section {
                padding: 6px;
                margin-bottom: 10px;
            }

            .task-label {
                font-size: 9px;
            }

            .task-text {
                font-size: 11px;
                line-height: 1.3;
            }

            .log-content {
                max-height: 100px;
                padding: 4px;
            }

            .log-entry {
                padding: 2px 4px;
                flex-wrap: wrap;
            }

            /* Stack log time and message in very narrow mode */
            .log-time {
                width: 100%;
                font-size: 9px;
            }

            .log-msg {
                width: 100%;
                font-size: 10px;
            }

            .footer {
                padding: 8px;
                font-size: 9px;
            }

            .footer-warning {
                padding: 5px 6px;
                font-size: 9px;
            }

            .footer-disclaimer {
                font-size: 8px;
            }

            .settings-body {
                padding: 10px;
            }

            .toast-container {
                max-width: 200px;
            }

            .toast {
                padding: 8px 10px;
                gap: 8px;
            }
        }

        /* ----------------------------------------------------------------
           Media Query Fallback for browsers without container query support
           ---------------------------------------------------------------- */
        @supports not (container-type: inline-size) {
            /* Medium width fallback (viewport-based) */
            @media (max-width: 450px) {
                .header {
                    padding: 16px;
                }

                .header-content {
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .header-right {
                    width: 100%;
                    justify-content: flex-start;
                }

                .controls {
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .controls button {
                    flex: 1 1 auto;
                }

                button {
                    padding: 5px 10px;
                    font-size: 11px;
                }

                .content {
                    padding: 12px;
                }

                .timeline-bar {
                    min-width: 14px;
                }
            }

            /* Narrow width fallback */
            @media (max-width: 350px) {
                .header {
                    padding: 12px;
                }

                .title h1 {
                    font-size: 14px;
                }

                .controls {
                    flex-wrap: wrap;
                    padding: 10px;
                }

                .controls .spacer {
                    flex-basis: 100%;
                    height: 4px;
                }

                button {
                    padding: 4px 8px;
                    font-size: 10px;
                }

                .content {
                    padding: 10px;
                }

                .setup-section {
                    padding: 12px;
                }

                .timeline-bars {
                    height: 40px;
                }

                .requirement-item {
                    font-size: 10px;
                }

                .log-content {
                    max-height: 120px;
                }
            }

            /* Very narrow fallback */
            @media (max-width: 280px) {
                .header {
                    padding: 10px;
                }

                .timing-display {
                    display: none !important;
                }

                .controls button {
                    flex: 1 1 100%;
                }

                .controls .spacer {
                    display: none;
                }

                .timeline-labels {
                    display: none;
                }

                .requirement-item .req-desc {
                    display: none;
                }

                .log-time {
                    width: 100%;
                }

                .log-msg {
                    width: 100%;
                }
            }
        }

        /* Duration Chart */
        .duration-section {
            margin-top: 16px;
        }
        .duration-header {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            letter-spacing: 0.5px;
        }
        .duration-content {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 8px;
            border: 1px solid var(--vscode-widget-border);
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        .duration-empty {
            font-size: 11px;
            color: var(--vscode-disabledForeground);
            font-style: italic;
            text-align: center;
            padding: 12px 0;
        }
        .duration-chart {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .duration-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
        }
        .duration-label {
            flex: 0 0 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
            color: var(--vscode-foreground);
        }
        .duration-bar-container {
            flex: 1;
            height: 16px;
            background: rgba(128, 128, 128, 0.1);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        .duration-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--gradient-2), var(--gradient-3));
            border-radius: 3px;
            min-width: 2px;
            width: 0; /* Animated via JS */
            transition: width 0.5s ease-out;
        }
        .duration-time {
            flex: 0 0 50px;
            text-align: left;
            font-variant-numeric: tabular-nums;
            color: var(--vscode-descriptionForeground);
            font-size: 10px;
        }

        /* Responsive adjustments for duration chart */
        @container panel (max-width: 400px) {
            .duration-label {
                flex: 0 0 80px;
            }
        }
        @container panel (max-width: 320px) {
            .duration-row {
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
            }
            .duration-label {
                flex: none;
                text-align: left;
            }
            .duration-bar-container {
                height: 12px;
            }
            .duration-time {
                text-align: right;
            }
        }

        /* High Contrast Support for Duration Chart */
        body.vscode-high-contrast .duration-bar,
        body.vscode-high-contrast-light .duration-bar {
            background: var(--hc-active-border);
        }
        body.vscode-high-contrast .duration-bar-container,
        body.vscode-high-contrast-light .duration-bar-container {
            border: 1px solid var(--hc-border);
            background: transparent;
        }

        /* Task Queue (Drag and Drop) */
        .task-queue-content {
            padding: 0;
        }
        .task-queue-list {
            display: flex;
            flex-direction: column;
            gap: 1px;
            background: var(--vscode-widget-border);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            overflow: hidden;
        }
        .task-queue-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-widget-border);
            cursor: grab;
            transition: background-color 0.2s;
        }
        .task-queue-item:last-child {
            border-bottom: none;
        }
        .task-queue-item:hover {
            background: var(--vscode-list-hoverBackground);
        }
        .task-queue-item.dragging {
            opacity: 0.5;
            background: var(--vscode-list-activeSelectionBackground);
            cursor: grabbing;
        }
        .task-queue-item.drag-over {
            border-top: 2px solid var(--gradient-2);
        }
        .drag-handle {
            display: flex;
            align-items: center;
            color: var(--vscode-descriptionForeground);
            margin-right: 12px;
            flex-shrink: 0;
            opacity: 0.6;
        }
        .task-queue-item:hover .drag-handle {
            opacity: 1;
        }
        .task-queue-text {
            flex: 1;
            font-size: 13px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .queue-hint {
            margin-top: 8px;
            padding: 0 4px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
            font-style: italic;
        }

        /* High contrast support for queue */
        body.vscode-high-contrast .task-queue-list,
        body.vscode-high-contrast-light .task-queue-list {
            border: 1px solid var(--hc-border);
            background: transparent;
        }
        body.vscode-high-contrast .task-queue-item,
        body.vscode-high-contrast-light .task-queue-item {
            border-bottom: 1px solid var(--hc-border);
        }
        body.vscode-high-contrast .task-queue-item.drag-over,
        body.vscode-high-contrast-light .task-queue-item.drag-over {
            border-top: 2px solid var(--hc-active-border);
        }

        /* ================================================================ */
        /* Aggregated Stats Section                                        */
        /* ================================================================ */

        .aggregated-stats-section {
            margin-top: 16px;
        }

        .aggregated-stats-header {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: 0.5px;
        }

        .aggregated-stats-header .aggregated-stats-icon {
            color: var(--gradient-2);
        }

        .aggregated-stats-count {
            margin-left: auto;
            font-size: 10px;
            font-weight: 500;
            color: var(--vscode-badge-foreground);
            background: var(--vscode-badge-background);
            padding: 2px 8px;
            border-radius: 10px;
        }

        .aggregated-stats-content {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 12px;
            border: 1px solid var(--vscode-widget-border);
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .aggregated-stats-empty {
            font-size: 11px;
            color: var(--vscode-disabledForeground);
            font-style: italic;
            text-align: center;
            padding: 12px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .aggregated-stats-totals {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 12px;
        }

        .aggregated-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            background: rgba(128, 128, 128, 0.05);
            border-radius: 6px;
            text-align: center;
        }

        .aggregated-stat-icon {
            color: var(--vscode-descriptionForeground);
            margin-bottom: 4px;
        }

        .aggregated-stat-value {
            font-size: 20px;
            font-weight: 700;
            background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .aggregated-stat-item.completed .aggregated-stat-value {
            background: linear-gradient(135deg, #22c55e, #10b981);
            -webkit-background-clip: text;
            background-clip: text;
        }

        .aggregated-stat-item.pending .aggregated-stat-value {
            background: linear-gradient(135deg, #f59e0b, #f97316);
            -webkit-background-clip: text;
            background-clip: text;
        }

        .aggregated-stat-item.progress .aggregated-stat-value {
            background: linear-gradient(135deg, var(--gradient-2), var(--gradient-3));
            -webkit-background-clip: text;
            background-clip: text;
        }

        .aggregated-stat-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .aggregated-stats-progress-bar {
            height: 8px;
            background: rgba(128, 128, 128, 0.15);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 16px;
        }

        .aggregated-stats-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--gradient-1), var(--gradient-2), var(--gradient-3));
            border-radius: 4px;
            transition: width 0.5s ease-out;
        }

        .aggregated-stats-projects {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .project-stats-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            background: rgba(128, 128, 128, 0.03);
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .project-stats-row:hover {
            background: rgba(128, 128, 128, 0.08);
        }

        .project-stats-row.active {
            background: rgba(139, 92, 246, 0.1);
            border-left: 3px solid var(--gradient-3);
        }

        .project-stats-name {
            flex: 0 0 140px;
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 0;
        }

        .project-active-indicator {
            font-size: 8px;
            color: var(--gradient-3);
            width: 10px;
        }

        .project-name-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            font-weight: 500;
        }

        .project-stats-bar {
            flex: 1;
            min-width: 60px;
        }

        .project-stats-bar-bg {
            height: 6px;
            background: rgba(128, 128, 128, 0.15);
            border-radius: 3px;
            overflow: hidden;
        }

        .project-stats-bar-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.4s ease-out;
        }

        .project-stats-bar-fill.complete {
            background: linear-gradient(90deg, #22c55e, #10b981);
        }

        .project-stats-bar-fill.partial {
            background: linear-gradient(90deg, var(--gradient-2), var(--gradient-3));
        }

        .project-stats-bar-fill.low {
            background: linear-gradient(90deg, #f59e0b, #f97316);
        }

        .project-stats-numbers {
            flex: 0 0 85px;
            text-align: right;
            font-size: 11px;
            font-variant-numeric: tabular-nums;
        }

        .project-completed {
            color: #22c55e;
            font-weight: 600;
        }

        .project-separator {
            color: var(--vscode-descriptionForeground);
            margin: 0 2px;
        }

        .project-total {
            color: var(--vscode-foreground);
        }

        .project-percent {
            color: var(--vscode-descriptionForeground);
            font-size: 10px;
            margin-left: 4px;
        }

        /* Responsive adjustments for aggregated stats */
        @container panel (max-width: 400px) {
            .aggregated-stats-totals {
                grid-template-columns: repeat(2, 1fr);
            }
            .aggregated-stat-value {
                font-size: 16px;
            }
            .project-stats-name {
                flex: 0 0 100px;
            }
            .project-stats-numbers {
                flex: 0 0 70px;
            }
        }

        @container panel (max-width: 320px) {
            .aggregated-stats-totals {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            .aggregated-stat-item {
                padding: 6px;
            }
            .aggregated-stat-value {
                font-size: 14px;
            }
            .project-stats-row {
                flex-wrap: wrap;
            }
            .project-stats-name {
                flex: 0 0 100%;
                margin-bottom: 4px;
            }
            .project-stats-bar {
                flex: 1;
            }
        }

        /* High contrast support for aggregated stats */
        body.vscode-high-contrast .aggregated-stats-content,
        body.vscode-high-contrast-light .aggregated-stats-content {
            border: 1px solid var(--hc-border);
            background: transparent;
        }

        body.vscode-high-contrast .aggregated-stat-item,
        body.vscode-high-contrast-light .aggregated-stat-item {
            border: 1px dashed var(--hc-border);
            background: transparent;
        }

        body.vscode-high-contrast .aggregated-stat-value,
        body.vscode-high-contrast .aggregated-stat-item.completed .aggregated-stat-value,
        body.vscode-high-contrast .aggregated-stat-item.pending .aggregated-stat-value,
        body.vscode-high-contrast .aggregated-stat-item.progress .aggregated-stat-value {
            background: none;
            -webkit-text-fill-color: var(--hc-active-border);
        }

        body.vscode-high-contrast-light .aggregated-stat-value,
        body.vscode-high-contrast-light .aggregated-stat-item.completed .aggregated-stat-value,
        body.vscode-high-contrast-light .aggregated-stat-item.pending .aggregated-stat-value,
        body.vscode-high-contrast-light .aggregated-stat-item.progress .aggregated-stat-value {
            background: none;
            -webkit-text-fill-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .aggregated-stats-progress-bar,
        body.vscode-high-contrast-light .aggregated-stats-progress-bar {
            border: 1px solid var(--hc-border);
            background: transparent;
        }

        body.vscode-high-contrast .aggregated-stats-progress-fill,
        body.vscode-high-contrast-light .aggregated-stats-progress-fill {
            background: var(--hc-active-border);
        }

        body.vscode-high-contrast .project-stats-row,
        body.vscode-high-contrast-light .project-stats-row {
            border: 1px dashed var(--hc-border);
            background: transparent;
        }

        body.vscode-high-contrast .project-stats-row.active,
        body.vscode-high-contrast-light .project-stats-row.active {
            border: 2px solid var(--hc-active-border);
        }

        body.vscode-high-contrast .project-stats-bar-bg,
        body.vscode-high-contrast-light .project-stats-bar-bg {
            border: 1px solid var(--hc-border);
            background: transparent;
        }

        body.vscode-high-contrast .project-stats-bar-fill,
        body.vscode-high-contrast-light .project-stats-bar-fill {
            background: var(--hc-active-border);
        }

        body.vscode-high-contrast .project-completed {
            color: #90ee90;
        }

        body.vscode-high-contrast-light .project-completed {
            color: #15803d;
        }

        /* ================================================================ */
        /* Lazy Loading Styles                                             */
        /* ================================================================ */

        /* Base lazy section styling */
        .lazy-section {
            position: relative;
            min-height: 60px;
        }

        /* Loading state */
        .lazy-section.lazy-loading {
            opacity: 0.7;
        }

        .lazy-section.lazy-loading .section-content {
            min-height: 80px;
        }

        /* Loaded state with subtle animation */
        .lazy-section.lazy-loaded {
            animation: lazyFadeIn 0.3s ease-out;
        }

        @keyframes lazyFadeIn {
            from {
                opacity: 0.7;
                transform: translateY(4px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Error state */
        .lazy-section.lazy-error {
            opacity: 1;
        }

        .lazy-section.lazy-error .lazy-load-indicator {
            color: var(--vscode-errorForeground);
        }

        /* Loading indicator */
        .lazy-load-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }

        /* Spinner animation */
        .lazy-load-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--vscode-widget-border);
            border-top-color: var(--gradient-2);
            border-radius: 50%;
            animation: lazyLoadSpin 0.8s linear infinite;
        }

        @keyframes lazyLoadSpin {
            to {
                transform: rotate(360deg);
            }
        }

        /* Loading text */
        .lazy-load-text {
            font-style: italic;
        }

        /* Error icon */
        .lazy-load-error-icon {
            font-size: 14px;
        }

        /* Placeholder skeleton for lazy sections */
        .lazy-section-placeholder {
            background: var(--vscode-editor-background);
            border: 1px dashed var(--vscode-widget-border);
            border-radius: 6px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 100px;
            color: var(--vscode-descriptionForeground);
        }

        .lazy-section-placeholder .placeholder-icon {
            font-size: 24px;
            opacity: 0.5;
        }

        .lazy-section-placeholder .placeholder-text {
            font-size: 12px;
            font-style: italic;
        }

        /* High contrast support for lazy loading */
        body.vscode-high-contrast .lazy-section.lazy-loading,
        body.vscode-high-contrast-light .lazy-section.lazy-loading {
            opacity: 1;
            border: 1px dashed var(--hc-border);
        }

        body.vscode-high-contrast .lazy-load-spinner,
        body.vscode-high-contrast-light .lazy-load-spinner {
            border-color: var(--hc-border);
            border-top-color: var(--hc-active-border);
        }

        body.vscode-high-contrast .lazy-section.lazy-error .lazy-load-indicator,
        body.vscode-high-contrast-light .lazy-section.lazy-error .lazy-load-indicator {
            color: #ffa07a;
        }

        body.vscode-high-contrast-light .lazy-section.lazy-error .lazy-load-indicator {
            color: #b91c1c;
        }

        body.vscode-high-contrast .lazy-section-placeholder,
        body.vscode-high-contrast-light .lazy-section-placeholder {
            border: 2px dashed var(--hc-border);
            background: transparent;
        }

        /* Responsive adjustments for lazy loading */
        @container panel (max-width: 320px) {
            .lazy-load-indicator {
                padding: 12px;
                font-size: 11px;
            }

            .lazy-load-spinner {
                width: 14px;
                height: 14px;
            }

            .lazy-section-placeholder {
                padding: 16px;
                min-height: 80px;
            }
        }

        /* ================================================================
         * Completion History Section
         * ================================================================ */

        .completion-history-section {
            background: var(--vscode-sideBar-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .completion-history-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: var(--vscode-sideBarSectionHeader-background, #252526);
            cursor: pointer;
            user-select: none;
            transition: background 0.15s ease;
        }

        .completion-history-header:hover {
            background: var(--vscode-list-hoverBackground, #2a2d2e);
        }

        .completion-history-header:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: -2px;
        }

        .completion-history-icon {
            color: var(--vscode-textLink-foreground, #3794ff);
            flex-shrink: 0;
        }

        #completionHistoryTitle {
            font-weight: 600;
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
            flex: 1;
        }

        .completion-history-count {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            background: var(--vscode-badge-background, #4d4d4d);
            padding: 2px 6px;
            border-radius: 10px;
            margin-right: 8px;
        }

        .history-action-btn {
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }

        .history-action-btn:hover {
            color: var(--vscode-foreground, #cccccc);
            background: var(--vscode-button-secondaryHoverBackground, #3c3c3c);
        }

        .history-action-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 1px;
        }

        .completion-history-content {
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .completion-history-content.collapsed {
            max-height: 0;
            padding: 0 12px;
            opacity: 0;
            overflow: hidden;
        }

        .completion-history-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
            text-align: center;
            gap: 8px;
        }

        .history-empty-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            opacity: 0.5;
        }

        .history-empty-text {
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
        }

        .history-empty-hint {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        /* History Stats Summary */
        .history-stats-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }

        .history-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 10px 8px;
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            text-align: center;
        }

        .history-stat-icon {
            color: var(--vscode-textLink-foreground, #3794ff);
        }

        .history-stat-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
        }

        .history-stat-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Daily List */
        .history-daily-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .history-daily-row {
            display: grid;
            grid-template-columns: 100px 70px 1fr 100px;
            gap: 8px;
            padding: 8px 10px;
            background: var(--vscode-editor-background, #1e1e1e);
            border-radius: 4px;
            align-items: center;
            transition: background 0.15s ease;
        }

        .history-daily-row:hover {
            background: var(--vscode-list-hoverBackground, #2a2d2e);
        }

        .history-date-col {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .history-date-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            flex-shrink: 0;
        }

        .history-date-text {
            font-size: 12px;
            font-weight: 500;
            color: var(--vscode-foreground, #cccccc);
        }

        .history-tasks-col {
            display: flex;
            align-items: baseline;
            gap: 4px;
        }

        .history-tasks-value {
            font-size: 14px;
            font-weight: 600;
            color: #22c55e;
        }

        .history-tasks-label {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .history-duration-col {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            font-size: 12px;
        }

        .history-duration-value {
            color: var(--vscode-foreground, #cccccc);
        }

        .history-duration-avg {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            font-size: 11px;
        }

        .history-projects-col {
            display: flex;
            align-items: center;
            gap: 4px;
            overflow: hidden;
        }

        .history-projects-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            flex-shrink: 0;
        }

        .history-projects-text {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* History Chart */
        .history-chart {
            margin-top: 16px;
            padding: 12px;
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
        }

        .history-chart-bars {
            display: flex;
            align-items: flex-end;
            gap: 4px;
            height: 80px;
        }

        .history-chart-bar-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
        }

        .history-chart-bar {
            width: 100%;
            max-width: 24px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            border-radius: 3px 3px 0 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 4px;
            min-height: 4px;
            transition: height 0.3s ease;
        }

        .history-chart-bar-value {
            font-size: 9px;
            font-weight: 600;
            color: white;
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }

        .history-chart-bar-label {
            font-size: 9px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            margin-top: 4px;
            white-space: nowrap;
        }

        /* Responsive adjustments for completion history */
        @container panel (max-width: 400px) {
            .history-stats-summary {
                grid-template-columns: repeat(2, 1fr);
            }

            .history-daily-row {
                grid-template-columns: 1fr 1fr;
                gap: 4px;
            }

            .history-duration-col,
            .history-projects-col {
                grid-column: span 1;
            }
        }

        @container panel (max-width: 320px) {
            .history-stat-item {
                padding: 8px 6px;
            }

            .history-stat-value {
                font-size: 14px;
            }

            .history-stat-label {
                font-size: 9px;
            }

            .history-daily-row {
                grid-template-columns: 1fr;
                gap: 2px;
            }

            .history-chart-bars {
                height: 60px;
            }

            .history-chart-bar-value {
                font-size: 8px;
            }
        }

        /* High contrast theme support for completion history */
        body.vscode-high-contrast .completion-history-section {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .completion-history-header {
            border-bottom: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .history-stat-item {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .history-daily-row:focus {
            outline: 2px solid var(--hc-focus, #f38518);
        }

        body.vscode-high-contrast .history-chart-bar {
            background: var(--hc-active-border, #f38518);
        }

        body.vscode-high-contrast-light .completion-history-section {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .completion-history-header {
            border-bottom: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .history-stat-item {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .history-daily-row:focus {
            outline: 2px solid var(--hc-focus, #b5200d);
        }

        body.vscode-high-contrast-light .history-chart-bar {
            background: var(--hc-active-border, #b5200d);
        }

        /* ================================================================
         * Session Statistics Dashboard
         * ================================================================ */

        .session-stats-section {
            background: var(--vscode-sideBar-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .session-stats-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: var(--vscode-sideBarSectionHeader-background, #252526);
            cursor: pointer;
            user-select: none;
            transition: background 0.15s ease;
        }

        .session-stats-header:hover {
            background: var(--vscode-list-hoverBackground, #2a2d2e);
        }

        .session-stats-header:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: -2px;
        }

        .session-stats-icon {
            color: var(--vscode-textLink-foreground, #3794ff);
            flex-shrink: 0;
        }

        #sessionStatsTitle {
            font-weight: 600;
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
            flex: 1;
        }

        .session-stats-badge {
            font-size: 10px;
            color: var(--vscode-foreground, #cccccc);
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            padding: 2px 8px;
            border-radius: 10px;
            margin-right: 8px;
            font-weight: 500;
        }

        .session-stats-badge.active {
            background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
            animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }

        .session-action-btn {
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }

        .session-action-btn:hover {
            color: var(--vscode-foreground, #cccccc);
            background: var(--vscode-button-secondaryHoverBackground, #3c3c3c);
        }

        .session-action-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 1px;
        }

        .session-stats-content {
            padding: 12px;
            max-height: 500px;
            overflow-y: auto;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .session-stats-content.collapsed {
            max-height: 0;
            padding: 0 12px;
            opacity: 0;
            overflow: hidden;
        }

        /* Empty State */
        .session-stats-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px 24px;
            text-align: center;
            gap: 8px;
        }

        .session-empty-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            opacity: 0.5;
        }

        .session-empty-text {
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
        }

        .session-empty-hint {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        /* Session Info Bar */
        .session-info-bar {
            display: flex;
            gap: 12px;
            padding: 10px 12px;
            background: var(--vscode-editor-background, #1e1e1e);
            border-radius: 6px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .session-info-item {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            min-width: 80px;
        }

        .session-info-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .session-info-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .session-info-value {
            font-size: 12px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
            margin-left: auto;
        }

        /* Stats Grid */
        .session-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 12px;
        }

        .session-stat-card {
            display: flex;
            flex-direction: column;
            padding: 12px;
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 8px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .session-stat-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .session-stat-card.primary {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            border-color: rgba(139, 92, 246, 0.3);
        }

        .session-stat-card.fastest {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
            border-color: rgba(34, 197, 94, 0.3);
        }

        .session-stat-card.slowest {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
            border-color: rgba(249, 115, 22, 0.3);
        }

        .session-stat-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
        }

        .session-stat-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .session-stat-card.primary .session-stat-icon {
            color: #8b5cf6;
        }

        .session-stat-card.fastest .session-stat-icon {
            color: #22c55e;
        }

        .session-stat-card.slowest .session-stat-icon {
            color: #f97316;
        }

        .session-stat-title {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .session-stat-value {
            font-size: 22px;
            font-weight: 700;
            color: var(--vscode-foreground, #cccccc);
            line-height: 1;
            margin-bottom: 4px;
        }

        .session-stat-card.primary .session-stat-value {
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .session-stat-card.fastest .session-stat-value {
            color: #22c55e;
        }

        .session-stat-card.slowest .session-stat-value {
            color: #f97316;
        }

        .session-stat-subtitle {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        /* Streak Bar */
        .session-streak-bar {
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
        }

        .session-streak-info {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .session-streak-icon {
            color: #f97316;
        }

        .session-streak-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .session-streak-value {
            font-size: 18px;
            font-weight: 700;
            color: #f97316;
            margin-left: 4px;
        }

        .session-streak-text {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            margin-left: auto;
        }

        .session-streak-meter {
            height: 4px;
            background: var(--vscode-progressBar-background, #333);
            border-radius: 2px;
            overflow: hidden;
        }

        .session-streak-fill {
            height: 100%;
            background: linear-gradient(90deg, #f97316 0%, #ef4444 100%);
            border-radius: 2px;
            transition: width 0.5s ease;
        }

        /* Recent Tasks */
        .session-recent-tasks {
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 8px;
            overflow: hidden;
        }

        .session-recent-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: var(--vscode-sideBarSectionHeader-background, #252526);
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
        }

        .session-recent-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .session-recent-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
        }

        .session-recent-list {
            max-height: 150px;
            overflow-y: auto;
        }

        .session-recent-empty {
            padding: 16px;
            text-align: center;
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .session-task-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
            transition: background 0.15s ease;
        }

        .session-task-item:last-child {
            border-bottom: none;
        }

        .session-task-item:hover {
            background: var(--vscode-list-hoverBackground, #2a2d2e);
        }

        .session-task-number {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--vscode-badge-background, #4d4d4d);
            border-radius: 50%;
            font-size: 10px;
            font-weight: 600;
            color: var(--vscode-badge-foreground, #ffffff);
            flex-shrink: 0;
        }

        .session-task-text {
            font-size: 11px;
            color: var(--vscode-foreground, #cccccc);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* Responsive: Narrow Panel */
        @container panel (max-width: 400px) {
            .session-stats-grid {
                grid-template-columns: 1fr;
            }

            .session-info-bar {
                flex-direction: column;
                gap: 8px;
            }

            .session-info-item {
                justify-content: space-between;
            }

            .session-info-value {
                margin-left: 0;
            }
        }

        @container panel (max-width: 320px) {
            .session-stat-value {
                font-size: 18px;
            }

            .session-streak-info {
                flex-wrap: wrap;
            }

            .session-streak-text {
                width: 100%;
                margin-left: 28px;
            }
        }

        /* High Contrast Theme - Dark */
        body.vscode-high-contrast .session-stats-section {
            border: 2px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .session-stats-header {
            border-bottom: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .session-stats-badge {
            background: transparent;
            border: 1px solid var(--hc-active-border, #f38518);
            color: var(--hc-active-border, #f38518);
        }

        body.vscode-high-contrast .session-stat-card {
            border: 1px solid var(--hc-border, #6fc3df);
            background: transparent;
        }

        body.vscode-high-contrast .session-stat-card.primary {
            border-color: #b19cd9;
        }

        body.vscode-high-contrast .session-stat-card.primary .session-stat-value {
            background: none;
            -webkit-text-fill-color: #b19cd9;
            color: #b19cd9;
        }

        body.vscode-high-contrast .session-stat-card.fastest {
            border-color: #90ee90;
        }

        body.vscode-high-contrast .session-stat-card.fastest .session-stat-value {
            color: #90ee90;
        }

        body.vscode-high-contrast .session-stat-card.slowest {
            border-color: #ffa07a;
        }

        body.vscode-high-contrast .session-stat-card.slowest .session-stat-value {
            color: #ffa07a;
        }

        body.vscode-high-contrast .session-streak-bar {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .session-streak-value {
            color: #ffa07a;
        }

        body.vscode-high-contrast .session-streak-fill {
            background: #ffa07a;
        }

        body.vscode-high-contrast .session-recent-tasks {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .session-task-item:focus {
            outline: 2px solid var(--hc-focus, #f38518);
        }

        /* High Contrast Theme - Light */
        body.vscode-high-contrast-light .session-stats-section {
            border: 2px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .session-stats-header {
            border-bottom: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .session-stats-badge {
            background: transparent;
            border: 1px solid var(--hc-active-border, #b5200d);
            color: var(--hc-active-border, #b5200d);
        }

        body.vscode-high-contrast-light .session-stat-card {
            border: 1px solid var(--hc-border, #0f4a85);
            background: transparent;
        }

        body.vscode-high-contrast-light .session-stat-card.primary {
            border-color: #6b21a8;
        }

        body.vscode-high-contrast-light .session-stat-card.primary .session-stat-value {
            background: none;
            -webkit-text-fill-color: #6b21a8;
            color: #6b21a8;
        }

        body.vscode-high-contrast-light .session-stat-card.fastest {
            border-color: #15803d;
        }

        body.vscode-high-contrast-light .session-stat-card.fastest .session-stat-value {
            color: #15803d;
        }

        body.vscode-high-contrast-light .session-stat-card.slowest {
            border-color: #c2410c;
        }

        body.vscode-high-contrast-light .session-stat-card.slowest .session-stat-value {
            color: #c2410c;
        }

        body.vscode-high-contrast-light .session-streak-bar {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .session-streak-value {
            color: #c2410c;
        }

        body.vscode-high-contrast-light .session-streak-fill {
            background: #c2410c;
        }

        body.vscode-high-contrast-light .session-recent-tasks {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .session-task-item:focus {
            outline: 2px solid var(--hc-focus, #b5200d);
        }

        /* ================================================================
         * Productivity Report Section
         * ================================================================ */

        .productivity-report-section {
            background: var(--vscode-sideBar-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .report-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: var(--vscode-sideBarSectionHeader-background, #252526);
            cursor: pointer;
            user-select: none;
            transition: background 0.15s ease;
        }

        .report-header:hover {
            background: var(--vscode-list-hoverBackground, #2a2d2e);
        }

        .report-header:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: -2px;
        }

        .report-header-icon {
            color: var(--vscode-textLink-foreground, #3794ff);
            flex-shrink: 0;
        }

        #reportTitle {
            font-weight: 600;
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
            flex: 1;
        }

        .report-content {
            padding: 12px;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .report-content.collapsed {
            max-height: 0;
            padding: 0 12px;
            opacity: 0;
            overflow: hidden;
        }

        .report-description {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            margin-bottom: 16px;
            line-height: 1.5;
        }

        .report-description p {
            margin: 0;
        }

        .report-controls {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .report-period-selector {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .report-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 500;
            color: var(--vscode-foreground, #cccccc);
        }

        .report-label-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .report-select {
            background: var(--vscode-dropdown-background, #3c3c3c);
            color: var(--vscode-dropdown-foreground, #cccccc);
            border: 1px solid var(--vscode-dropdown-border, #3c3c3c);
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            font-family: inherit;
            outline: none;
            cursor: pointer;
            width: 100%;
        }

        .report-select:focus {
            border-color: var(--vscode-focusBorder, #007acc);
        }

        .report-format-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .report-format-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .report-format-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: var(--vscode-button-secondaryBackground, #3c3c3c);
            color: var(--vscode-button-secondaryForeground, #cccccc);
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.15s ease;
            flex: 1;
            justify-content: center;
            min-width: 80px;
        }

        .report-format-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground, #4a4a4a);
        }

        .report-format-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: 1px;
        }

        .report-format-btn.selected {
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            color: white;
            border-color: transparent;
        }

        .format-icon {
            flex-shrink: 0;
        }

        .format-label {
            font-weight: 500;
        }

        .report-actions {
            margin-bottom: 16px;
        }

        .report-generate-btn {
            width: 100%;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .report-generate-btn .btn-spinner {
            display: none;
        }

        .report-generate-btn.loading .btn-spinner {
            display: inline-block;
        }

        .report-generate-btn.loading .btn-icon {
            display: none;
        }

        /* Report Preview */
        .report-preview {
            background: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 12px;
            animation: reportPreviewSlideIn 0.3s ease;
        }

        @keyframes reportPreviewSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .report-preview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: var(--vscode-sideBarSectionHeader-background, #252526);
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
        }

        .preview-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
        }

        .preview-close-btn {
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            cursor: pointer;
            padding: 2px 6px;
            font-size: 16px;
            line-height: 1;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .preview-close-btn:hover {
            color: var(--vscode-foreground, #cccccc);
            background: var(--vscode-button-secondaryHoverBackground, #3c3c3c);
        }

        .preview-close-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
        }

        .report-preview-content {
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        }

        /* Preview Summary */
        .preview-summary {
            margin-bottom: 16px;
        }

        .preview-heading {
            font-size: 13px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
            margin: 0 0 12px 0;
        }

        .preview-subheading {
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .preview-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .preview-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            background: var(--vscode-sideBar-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            text-align: center;
        }

        .preview-stat-value {
            font-size: 18px;
            font-weight: 700;
            color: var(--vscode-textLink-foreground, #3794ff);
            margin-bottom: 2px;
        }

        .preview-stat-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Preview Trends */
        .preview-trends {
            margin-bottom: 16px;
        }

        .preview-trend-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 8px;
        }

        .preview-trend-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            background: var(--vscode-sideBar-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 6px;
            text-align: center;
        }

        .trend-icon {
            margin-bottom: 4px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        .trend-icon.trend-up {
            color: #22c55e;
        }

        .trend-icon.trend-down {
            color: #ef4444;
        }

        .trend-icon.trend-stable {
            color: #f59e0b;
        }

        .trend-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--vscode-foreground, #cccccc);
        }

        .trend-label {
            font-size: 9px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* Preview Projects */
        .preview-projects {
            margin-bottom: 8px;
        }

        .preview-project-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .preview-project-row {
            display: grid;
            grid-template-columns: 1fr auto 60px auto;
            gap: 8px;
            align-items: center;
            padding: 6px 8px;
            background: var(--vscode-sideBar-background, #1e1e1e);
            border-radius: 4px;
            font-size: 11px;
        }

        .preview-project-name {
            color: var(--vscode-foreground, #cccccc);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .preview-project-tasks {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            white-space: nowrap;
        }

        .preview-project-bar {
            height: 4px;
            background: var(--vscode-progressBar-background, #3c3c3c);
            border-radius: 2px;
            overflow: hidden;
        }

        .preview-project-fill {
            height: 100%;
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .preview-project-percent {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            text-align: right;
            min-width: 30px;
        }

        /* Empty State */
        .report-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            text-align: center;
            gap: 8px;
        }

        .report-empty-icon {
            color: var(--vscode-descriptionForeground, #9d9d9d);
            opacity: 0.5;
        }

        .report-empty-text {
            font-size: 12px;
            color: var(--vscode-foreground, #cccccc);
        }

        .report-empty-hint {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #9d9d9d);
        }

        /* Report Section Responsive */
        @container panel (max-width: 400px) {
            .preview-stats-grid {
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .preview-stat {
                padding: 8px;
            }

            .preview-stat-value {
                font-size: 16px;
            }

            .preview-trend-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @container panel (max-width: 320px) {
            .report-format-buttons {
                flex-direction: column;
            }

            .report-format-btn {
                min-width: auto;
            }

            .preview-stats-grid {
                grid-template-columns: 1fr;
            }

            .preview-trend-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .preview-project-row {
                grid-template-columns: 1fr auto;
                gap: 4px;
            }

            .preview-project-bar,
            .preview-project-percent {
                display: none;
            }
        }

        /* High Contrast Dark Theme */
        body.vscode-high-contrast .productivity-report-section {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .report-header {
            border-bottom: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .report-header:focus-visible {
            outline: 2px solid var(--hc-focus, #f38518);
        }

        body.vscode-high-contrast .report-select {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .report-select:focus {
            border-color: var(--hc-active-border, #f38518);
        }

        body.vscode-high-contrast .report-format-btn {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .report-format-btn.selected {
            border: 2px solid var(--hc-active-border, #f38518);
            background: transparent;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast .report-format-btn:focus-visible {
            outline: 2px solid var(--hc-focus, #f38518);
        }

        body.vscode-high-contrast .report-preview {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .preview-stat {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .preview-trend-item {
            border: 1px solid var(--hc-border, #6fc3df);
        }

        body.vscode-high-contrast .trend-icon.trend-up {
            color: #90ee90;
        }

        body.vscode-high-contrast .trend-icon.trend-down {
            color: #ffa07a;
        }

        body.vscode-high-contrast .trend-icon.trend-stable {
            color: #ffd700;
        }

        body.vscode-high-contrast .preview-project-fill {
            background: var(--hc-active-border, #f38518);
        }

        /* High Contrast Light Theme */
        body.vscode-high-contrast-light .productivity-report-section {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .report-header {
            border-bottom: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .report-header:focus-visible {
            outline: 2px solid var(--hc-focus, #b5200d);
        }

        body.vscode-high-contrast-light .report-select {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .report-select:focus {
            border-color: var(--hc-active-border, #b5200d);
        }

        body.vscode-high-contrast-light .report-format-btn {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .report-format-btn.selected {
            border: 2px solid var(--hc-active-border, #b5200d);
            background: transparent;
            color: var(--vscode-foreground);
        }

        body.vscode-high-contrast-light .report-format-btn:focus-visible {
            outline: 2px solid var(--hc-focus, #b5200d);
        }

        body.vscode-high-contrast-light .report-preview {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .preview-stat {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .preview-trend-item {
            border: 1px solid var(--hc-border, #0f4a85);
        }

        body.vscode-high-contrast-light .trend-icon.trend-up {
            color: #15803d;
        }

        body.vscode-high-contrast-light .trend-icon.trend-down {
            color: #b91c1c;
        }

        body.vscode-high-contrast-light .trend-icon.trend-stable {
            color: #a16207;
        }

        body.vscode-high-contrast-light .preview-project-fill {
            background: var(--hc-active-border, #b5200d);
        }
    `;
}
