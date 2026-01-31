import * as vscode from 'vscode';
import * as path from 'path';
import { RalphStatusBar } from './statusBar';
import { RalphPanel, RalphSidebarProvider, PANEL_VIEW_TYPE } from './controlPanel';
import { LoopOrchestrator } from './orchestrator';
import { log, disposeLogger, showLogs } from './logger';
import { getSettings, updateSettings } from './config';
import { prewarmCache } from './webview';
import { discoverPrdRootsAsync, setActiveWorkspaceFolder } from './fileUtils';
import { initHistoryStorage } from './historyStorage';

class RalphExtension {
    private statusBar: RalphStatusBar;
    private orchestrator: LoopOrchestrator;
    private currentPanel: RalphPanel | null = null;
    private panelEventHandlers: vscode.Disposable[] = [];
    private sidebarEventHandlers: vscode.Disposable[] = [];
    private sidebarProvider: RalphSidebarProvider;
    private configChangeDisposable: vscode.Disposable | null = null;

    constructor(private readonly context: vscode.ExtensionContext) {
        log('Ralph extension activating...');

        // Initialize completion history storage
        const historyStorage = initHistoryStorage(context);
        log('Completion history storage initialized');

        // Prewarm HTML fragment cache for faster initial panel render
        prewarmCache();
        log('HTML fragment cache prewarmed');

        this.statusBar = new RalphStatusBar();
        context.subscriptions.push(this.statusBar);

        this.orchestrator = new LoopOrchestrator(this.statusBar, historyStorage);

        // Load settings from VS Code configuration on startup
        const savedSettings = getSettings();
        this.orchestrator.setSettings(savedSettings);
        log(`Loaded settings from configuration: maxIterations=${savedSettings.maxIterations}`);

        this.sidebarProvider = new RalphSidebarProvider(context.extensionUri);
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider('ralph.sidebarView', this.sidebarProvider)
        );

        // Connect sidebar to orchestrator for state synchronization
        this.orchestrator.setSidebarView(this.sidebarProvider);
        this.setupSidebarEventHandlers();

        this.registerCommands();
        this.setupConfigurationChangeListener();

        this.registerPanelSerializer();

        context.subscriptions.push({
            dispose: () => this.dispose()
        });

        log('Ralph extension activated');

        this.initializeWorkspace();
    }

    /**
     * Scans workspace folders for PRD files and sets the active root.
     * Supports multi-root workspaces.
     */
    private async initializeWorkspace(): Promise<void> {
        log('Scanning workspace for PRD files...');
        try {
            const roots = await discoverPrdRootsAsync();
            if (roots.length > 0) {
                log(`Found ${roots.length} folder(s) with PRD files.`);
                // For now, default to the first one found until project selector is implemented
                const activeRoot = roots[0];
                setActiveWorkspaceFolder(activeRoot);
                log(`Active workspace root set to: ${activeRoot}`);
                
                if (roots.length > 1) {
                    // Notify user if multiple found
                    log(`Multiple PRD roots found: ${roots.join(', ')}`);
                }
            } else {
                log('No PRD files found in workspace roots. Defaulting to first workspace folder for creation.');
            }
        } catch (error) {
            log(`Error initializing workspace: ${error}`);
        }
    }

    /**
     * Registers a WebviewPanelSerializer to restore the panel after VS Code restart.
     */
    private registerPanelSerializer(): void {
        this.context.subscriptions.push(
            vscode.window.registerWebviewPanelSerializer(PANEL_VIEW_TYPE, {
                deserializeWebviewPanel: async (webviewPanel: vscode.WebviewPanel, _state: unknown) => {
                    log('Deserializing Ralph panel after VS Code restart');
                    
                    // Configure the restored webview panel
                    RalphPanel.configurePanel(webviewPanel, this.context.extensionUri);
                    
                    // Create a new RalphPanel instance from the restored webview panel
                    this.currentPanel = new RalphPanel(webviewPanel, this.context);
                    this.orchestrator.setPanel(this.currentPanel);
                    
                    // Restore saved requirements to the orchestrator
                    const savedRequirements = this.currentPanel.getSavedRequirements();
                    this.orchestrator.setRequirements(savedRequirements);
                    
                    // Set up event handlers for the restored panel
                    this.currentPanel.onDispose(() => {
                        this.cleanupPanel();
                    });
                    
                    this.setupPanelEventHandlers();
                    
                    log('Ralph panel restored successfully');
                }
            })
        );
    }

    /**
     * Sets up a listener for VS Code configuration changes to sync settings.
     */
    private setupConfigurationChangeListener(): void {
        this.configChangeDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('ralph.settings')) {
                const newSettings = getSettings();
                this.orchestrator.setSettings(newSettings);
                log(`Settings updated from configuration: maxIterations=${newSettings.maxIterations}`);
            }
        });
        this.context.subscriptions.push(this.configChangeDisposable);
    }

    private setupSidebarEventHandlers(): void {
        this.sidebarEventHandlers.push(
            this.sidebarProvider.on('start', () => this.orchestrator.startLoop()),
            this.sidebarProvider.on('stop', () => this.orchestrator.stopLoop()),
            this.sidebarProvider.on('pause', () => this.orchestrator.pauseLoop()),
            this.sidebarProvider.on('resume', () => this.orchestrator.resumeLoop()),
            this.sidebarProvider.on('next', () => this.orchestrator.runSingleStep()),
            this.sidebarProvider.on('skipTask', () => this.orchestrator.skipCurrentTask()),
            this.sidebarProvider.on('retryTask', () => this.orchestrator.retryFailedTask()),
            this.sidebarProvider.on('completeAllTasks', () => this.orchestrator.completeAllTasks()),
            this.sidebarProvider.on('resetAllTasks', () => this.orchestrator.resetAllTasks()),
            this.sidebarProvider.on('generatePrd', (data) => {
                if (data?.taskDescription) {
                    this.orchestrator.generatePrdFromDescription(data.taskDescription);
                }
            }),
            this.sidebarProvider.on('requirementsChanged', (data) => {
                if (data?.requirements) {
                    this.orchestrator.setRequirements(data.requirements);
                }
            }),
            this.sidebarProvider.on('settingsChanged', (data) => {
                if (data?.settings) {
                    this.orchestrator.setSettings(data.settings);
                    // Persist settings to VS Code configuration
                    updateSettings(data.settings).catch((err) => {
                        log(`Failed to persist settings: ${err}`);
                    });
                }
            })
        );
    }

    private registerCommands(): void {
        this.context.subscriptions.push(
            vscode.commands.registerCommand('ralph.showPanel', () => {
                this.showPanel();
            }),

            vscode.commands.registerCommand('ralph.viewLogs', () => {
                showLogs();
            }),

            // Keyboard shortcut commands
            vscode.commands.registerCommand('ralph.start', () => {
                log('Keyboard shortcut: Start loop');
                this.orchestrator.startLoop();
            }),

            vscode.commands.registerCommand('ralph.stop', () => {
                log('Keyboard shortcut: Stop loop');
                this.orchestrator.stopLoop();
            }),

            vscode.commands.registerCommand('ralph.pause', () => {
                log('Keyboard shortcut: Pause loop');
                this.orchestrator.pauseLoop();
            }),

            vscode.commands.registerCommand('ralph.resume', () => {
                log('Keyboard shortcut: Resume loop');
                this.orchestrator.resumeLoop();
            }),

            vscode.commands.registerCommand('ralph.step', () => {
                log('Keyboard shortcut: Run single step');
                this.orchestrator.runSingleStep();
            }),

            vscode.commands.registerCommand('ralph.skipTask', () => {
                log('Keyboard shortcut: Skip current task');
                this.orchestrator.skipCurrentTask();
            }),

            vscode.commands.registerCommand('ralph.retryTask', () => {
                log('Keyboard shortcut: Retry failed task');
                this.orchestrator.retryFailedTask();
            })
        );
    }

    private showPanel(): void {
        if (this.currentPanel) {
            this.currentPanel.reveal();
            this.currentPanel.refresh();
            return;
        }

        const webviewPanel = RalphPanel.createPanel(this.context.extensionUri);
        this.currentPanel = new RalphPanel(webviewPanel, this.context);
        this.orchestrator.setPanel(this.currentPanel);

        // Restore saved requirements to the orchestrator
        const savedRequirements = this.currentPanel.getSavedRequirements();
        this.orchestrator.setRequirements(savedRequirements);

        this.currentPanel.onDispose(() => {
            this.cleanupPanel();
        });

        this.setupPanelEventHandlers();
    }

    /**
     * Sets up event handlers for the current panel.
     * Shared between showPanel and panel deserialization.
     */
    private setupPanelEventHandlers(): void {
        if (!this.currentPanel) {
            return;
        }

        this.panelEventHandlers.push(
            this.currentPanel.on('start', () => this.orchestrator.startLoop()),
            this.currentPanel.on('stop', () => this.orchestrator.stopLoop()),
            this.currentPanel.on('pause', () => this.orchestrator.pauseLoop()),
            this.currentPanel.on('resume', () => this.orchestrator.resumeLoop()),
            this.currentPanel.on('next', () => this.orchestrator.runSingleStep()),
            this.currentPanel.on('skipTask', () => this.orchestrator.skipCurrentTask()),
            this.currentPanel.on('retryTask', () => this.orchestrator.retryFailedTask()),
            this.currentPanel.on('completeAllTasks', () => this.orchestrator.completeAllTasks()),
            this.currentPanel.on('resetAllTasks', () => this.orchestrator.resetAllTasks()),
            this.currentPanel.on('generatePrd', (data) => {
                if (data?.taskDescription) {
                    this.orchestrator.generatePrdFromDescription(data.taskDescription);
                }
            }),
            this.currentPanel.on('requirementsChanged', (data) => {
                if (data?.requirements) {
                    this.orchestrator.setRequirements(data.requirements);
                }
            }),
            this.currentPanel.on('settingsChanged', (data) => {
                if (data?.settings) {
                    this.orchestrator.setSettings(data.settings);
                    // Persist settings to VS Code configuration
                    updateSettings(data.settings).catch((err) => {
                        log(`Failed to persist settings: ${err}`);
                    });
                }
            }),
            this.currentPanel.on('exportData', (data) => {
                this.handleExportData(data?.format as 'json' | 'csv' | undefined);
            }),
            this.currentPanel.on('exportLog', (data) => {
                this.handleExportLog(data?.entries);
            }),
            this.currentPanel.on('generateReport', (data) => {
                this.handleGenerateReport(
                    data?.period as 'today' | 'week' | 'month' | 'custom' | undefined,
                    data?.format as 'markdown' | 'html' | 'json' | undefined,
                    data?.customStartDate,
                    data?.customEndDate
                );
            }),
            this.currentPanel.on('reorderTasks', (data) => {
                if (data?.taskIds) {
                    this.orchestrator.reorderTasks(data.taskIds);
                }
            }),
            this.currentPanel.on('switchProject', async (data) => {
                if (data?.projectPath) {
                    log(`Switching project to: ${data.projectPath}`);
                    // Use orchestrator's switchProject method which preserves running state
                    await this.orchestrator.switchProject(data.projectPath);
                    
                    if (this.currentPanel) { await this.currentPanel.refresh(); }
                    if (this.sidebarProvider) { await this.sidebarProvider.refresh(); }
                    
                    vscode.window.showInformationMessage(`Ralph: Switched to project ${path.basename(data.projectPath)}`);
                }
            })
        );
    }

    private async handleExportData(format?: 'json' | 'csv'): Promise<void> {
        const history = this.orchestrator.getHistory();

        if (history.length === 0) {
            vscode.window.showInformationMessage('No timeline data to export available yet.');
            return;
        }

        let selectedFormat = format;
        if (!selectedFormat) {
            const pick = await vscode.window.showQuickPick(['json', 'csv'], {
                placeHolder: 'Select export format'
            });
            if (!pick) { return; }
            selectedFormat = pick as 'json' | 'csv';
        }

        const filters: { [name: string]: string[] } = {};
        if (selectedFormat === 'json') {
            filters['JSON'] = ['json'];
        } else {
            filters['CSV'] = ['csv'];
        }

        const uri = await vscode.window.showSaveDialog({
            saveLabel: 'Export Timeline',
            filters: filters
        });

        if (!uri) { return; }

        let content = '';
        if (selectedFormat === 'json') {
            content = JSON.stringify(history, null, 2);
        } else {
            // CSV Header
            content = 'Task Description,Completed At,Duration (ms),Iteration\n';
            content += history.map(h => {
                const desc = `"${h.taskDescription.replace(/"/g, '""')}"`;
                const date = new Date(h.completedAt).toISOString();
                return `${desc},${date},${h.duration},${h.iteration}`;
            }).join('\n');
        }

        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
            vscode.window.showInformationMessage(`Timeline exported successfully to ${selectedFormat.toUpperCase()}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export timeline: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async handleExportLog(entries?: Array<{ time: string; level: string; message: string }>): Promise<void> {
        if (!entries || entries.length === 0) {
            vscode.window.showInformationMessage('No log entries to export.');
            return;
        }

        const pick = await vscode.window.showQuickPick(['json', 'txt'], {
            placeHolder: 'Select export format'
        });
        if (!pick) { return; }

        const selectedFormat = pick as 'json' | 'txt';

        const filters: { [name: string]: string[] } = {};
        if (selectedFormat === 'json') {
            filters['JSON'] = ['json'];
        } else {
            filters['Text'] = ['txt', 'log'];
        }

        const uri = await vscode.window.showSaveDialog({
            saveLabel: 'Export Log',
            filters: filters,
            defaultUri: vscode.Uri.file(`ralph-log-${new Date().toISOString().slice(0, 10)}.${selectedFormat}`)
        });

        if (!uri) { return; }

        let content = '';
        if (selectedFormat === 'json') {
            content = JSON.stringify(entries, null, 2);
        } else {
            // Plain text format: [TIME] [LEVEL] MESSAGE
            content = entries.map(entry => 
                `[${entry.time}] [${entry.level.toUpperCase()}] ${entry.message}`
            ).join('\n');
        }

        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
            vscode.window.showInformationMessage(`Log exported successfully to ${selectedFormat.toUpperCase()}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export log: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async handleGenerateReport(
        period?: 'today' | 'week' | 'month' | 'custom',
        format?: 'markdown' | 'html' | 'json',
        customStartDate?: string,
        customEndDate?: string
    ): Promise<void> {
        const { getHistoryStorage } = await import('./historyStorage.js');
        const historyStorage = getHistoryStorage();
        
        if (!historyStorage) {
            if (this.currentPanel) {
                this.currentPanel.sendReportError('History storage not available');
            }
            return;
        }
        
        const reportPeriod = period || 'today';
        const reportFormat = format || 'markdown';
        
        try {
            // Generate the report
            const report = await historyStorage.generateProductivityReport(
                reportPeriod,
                customStartDate ? new Date(customStartDate) : undefined,
                customEndDate ? new Date(customEndDate) : undefined
            );
            
            // Send preview to webview
            if (this.currentPanel) {
                this.currentPanel.sendReportComplete(report);
            }
            
            // If no tasks in period, don't prompt for export
            if (report.totalTasks === 0) {
                return;
            }
            
            // Generate export content
            const content = this.formatReportContent(report, reportFormat);
            
            // Show save dialog
            const filters: { [name: string]: string[] } = {};
            let extension = '';
            switch (reportFormat) {
                case 'markdown':
                    filters['Markdown'] = ['md'];
                    extension = 'md';
                    break;
                case 'html':
                    filters['HTML'] = ['html'];
                    extension = 'html';
                    break;
                case 'json':
                    filters['JSON'] = ['json'];
                    extension = 'json';
                    break;
            }
            
            const dateStr = new Date().toISOString().slice(0, 10);
            const uri = await vscode.window.showSaveDialog({
                saveLabel: 'Save Report',
                filters,
                defaultUri: vscode.Uri.file(`ralph-report-${reportPeriod}-${dateStr}.${extension}`)
            });
            
            if (uri) {
                await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
                vscode.window.showInformationMessage(`Productivity report exported to ${reportFormat.toUpperCase()}`);
                log(`Productivity report exported: ${uri.fsPath}`);
                
                if (this.currentPanel) {
                    this.currentPanel.sendReportComplete(report, true, reportFormat);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            log(`Failed to generate productivity report: ${errorMessage}`);
            
            if (this.currentPanel) {
                this.currentPanel.sendReportError(errorMessage);
            }
            
            vscode.window.showErrorMessage(`Failed to generate report: ${errorMessage}`);
        }
    }
    
    private formatReportContent(
        report: {
            title: string;
            generatedAt: number;
            periodStart: number;
            periodEnd: number;
            periodType: string;
            totalTasks: number;
            totalDuration: number;
            sessions: number;
            projects: number;
            timeBreakdown: {
                totalActiveTime: number;
                averageTaskTime: number;
                fastestTaskTime: number | null;
                slowestTaskTime: number | null;
                timeDeviation: number;
            };
            projectBreakdown: Array<{
                name: string;
                path: string;
                tasksCompleted: number;
                totalDuration: number;
                taskPercentage: number;
                timePercentage: number;
            }>;
            dailyActivity: Array<{
                date: string;
                tasksCompleted: number;
                totalDuration: number;
                projects: string[];
            }>;
            trends: {
                avgTasksPerDay: number;
                mostProductiveDay: number | null;
                mostProductiveHour: number | null;
                trendDirection: 'up' | 'down' | 'stable';
                trendPercentage: number;
                longestStreak: number;
                currentStreak: number;
            };
        },
        format: 'markdown' | 'html' | 'json'
    ): string {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const formatDuration = (ms: number): string => {
            if (ms < 1000) return '< 1s';
            const seconds = Math.floor(ms / 1000);
            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        };
        
        const formatHour = (hour: number): string => {
            if (hour === 0) return '12 AM';
            if (hour === 12) return '12 PM';
            if (hour < 12) return `${hour} AM`;
            return `${hour - 12} PM`;
        };
        
        if (format === 'json') {
            return JSON.stringify(report, null, 2);
        }
        
        if (format === 'html') {
            const projectRows = report.projectBreakdown.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.tasksCompleted}</td>
                    <td>${formatDuration(p.totalDuration)}</td>
                    <td>${p.taskPercentage}%</td>
                </tr>
            `).join('');
            
            const dailyRows = report.dailyActivity.slice(0, 14).map(d => `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.tasksCompleted}</td>
                    <td>${formatDuration(d.totalDuration)}</td>
                    <td>${d.projects.join(', ')}</td>
                </tr>
            `).join('');
            
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #1e1e1e; color: #cccccc; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        h2 { color: #8b5cf6; margin-top: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
        .stat-card { background: #252526; padding: 16px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #3794ff; }
        .stat-label { font-size: 12px; color: #9d9d9d; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #3c3c3c; }
        th { background: #252526; color: #8b5cf6; }
        .trend { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .trend-up { background: #22c55e33; color: #22c55e; }
        .trend-down { background: #ef444433; color: #ef4444; }
        .trend-stable { background: #f59e0b33; color: #f59e0b; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #3c3c3c; font-size: 12px; color: #9d9d9d; }
    </style>
</head>
<body>
    <h1>${report.title}</h1>
    <p>Generated on ${new Date(report.generatedAt).toLocaleString()}</p>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${report.totalTasks}</div>
            <div class="stat-label">Tasks Completed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${formatDuration(report.totalDuration)}</div>
            <div class="stat-label">Total Time</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${report.sessions}</div>
            <div class="stat-label">Sessions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${report.projects}</div>
            <div class="stat-label">Projects</div>
        </div>
    </div>
    
    <h2>Productivity Trends</h2>
    <ul>
        <li><strong>Trend:</strong> <span class="trend trend-${report.trends.trendDirection}">${report.trends.trendDirection === 'up' ? '↑' : report.trends.trendDirection === 'down' ? '↓' : '→'} ${report.trends.trendPercentage}%</span></li>
        <li><strong>Average Tasks/Day:</strong> ${report.trends.avgTasksPerDay}</li>
        <li><strong>Most Productive Day:</strong> ${report.trends.mostProductiveDay !== null ? dayNames[report.trends.mostProductiveDay] : 'N/A'}</li>
        <li><strong>Peak Hour:</strong> ${report.trends.mostProductiveHour !== null ? formatHour(report.trends.mostProductiveHour) : 'N/A'}</li>
        <li><strong>Current Streak:</strong> ${report.trends.currentStreak} day(s)</li>
        <li><strong>Longest Streak:</strong> ${report.trends.longestStreak} day(s)</li>
    </ul>
    
    <h2>Time Breakdown</h2>
    <ul>
        <li><strong>Average Task Time:</strong> ${formatDuration(report.timeBreakdown.averageTaskTime)}</li>
        <li><strong>Fastest Task:</strong> ${report.timeBreakdown.fastestTaskTime !== null ? formatDuration(report.timeBreakdown.fastestTaskTime) : 'N/A'}</li>
        <li><strong>Slowest Task:</strong> ${report.timeBreakdown.slowestTaskTime !== null ? formatDuration(report.timeBreakdown.slowestTaskTime) : 'N/A'}</li>
    </ul>
    
    ${report.projectBreakdown.length > 0 ? `
    <h2>Project Breakdown</h2>
    <table>
        <thead><tr><th>Project</th><th>Tasks</th><th>Time</th><th>% of Total</th></tr></thead>
        <tbody>${projectRows}</tbody>
    </table>
    ` : ''}
    
    ${report.dailyActivity.length > 0 ? `
    <h2>Daily Activity</h2>
    <table>
        <thead><tr><th>Date</th><th>Tasks</th><th>Duration</th><th>Projects</th></tr></thead>
        <tbody>${dailyRows}</tbody>
    </table>
    ` : ''}
    
    <div class="footer">
        <p>Report generated by Ralph - Task Automation for VS Code</p>
    </div>
</body>
</html>`;
        }
        
        // Markdown format
        const projectTable = report.projectBreakdown.length > 0 
            ? `\n## Project Breakdown\n\n| Project | Tasks | Time | % of Total |\n|---------|-------|------|------------|\n${report.projectBreakdown.map(p => `| ${p.name} | ${p.tasksCompleted} | ${formatDuration(p.totalDuration)} | ${p.taskPercentage}% |`).join('\n')}\n`
            : '';
        
        const dailyTable = report.dailyActivity.length > 0
            ? `\n## Daily Activity\n\n| Date | Tasks | Duration | Projects |\n|------|-------|----------|----------|\n${report.dailyActivity.slice(0, 14).map(d => `| ${d.date} | ${d.tasksCompleted} | ${formatDuration(d.totalDuration)} | ${d.projects.join(', ')} |`).join('\n')}\n`
            : '';
        
        return `# ${report.title}

*Generated on ${new Date(report.generatedAt).toLocaleString()}*

## Summary

| Metric | Value |
|--------|-------|
| Tasks Completed | ${report.totalTasks} |
| Total Time | ${formatDuration(report.totalDuration)} |
| Sessions | ${report.sessions} |
| Projects | ${report.projects} |

## Productivity Trends

- **Trend:** ${report.trends.trendDirection === 'up' ? '↑ Up' : report.trends.trendDirection === 'down' ? '↓ Down' : '→ Stable'} ${report.trends.trendPercentage}%
- **Average Tasks/Day:** ${report.trends.avgTasksPerDay}
- **Most Productive Day:** ${report.trends.mostProductiveDay !== null ? dayNames[report.trends.mostProductiveDay] : 'N/A'}
- **Peak Hour:** ${report.trends.mostProductiveHour !== null ? formatHour(report.trends.mostProductiveHour) : 'N/A'}
- **Current Streak:** ${report.trends.currentStreak} day(s)
- **Longest Streak:** ${report.trends.longestStreak} day(s)

## Time Breakdown

- **Average Task Time:** ${formatDuration(report.timeBreakdown.averageTaskTime)}
- **Fastest Task:** ${report.timeBreakdown.fastestTaskTime !== null ? formatDuration(report.timeBreakdown.fastestTaskTime) : 'N/A'}
- **Slowest Task:** ${report.timeBreakdown.slowestTaskTime !== null ? formatDuration(report.timeBreakdown.slowestTaskTime) : 'N/A'}
${projectTable}${dailyTable}
---

*Report generated by Ralph - Task Automation for VS Code*
`;
    }

    private cleanupPanel(): void {
        this.panelEventHandlers.forEach(d => d.dispose());
        this.panelEventHandlers = [];
        this.currentPanel = null;
        this.orchestrator.setPanel(null);
    }

    dispose(): void {
        this.cleanupPanel();
        this.sidebarEventHandlers.forEach(d => d.dispose());
        this.sidebarEventHandlers = [];
        this.orchestrator.dispose();
        disposeLogger();
    }
}

let extensionInstance: RalphExtension | null = null;

export function activate(context: vscode.ExtensionContext): void {
    extensionInstance = new RalphExtension(context);
}

export function deactivate(): void {
    log('Ralph extension deactivating...');
    extensionInstance?.dispose();
    extensionInstance = null;
}
