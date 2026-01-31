import * as assert from 'assert';
import { getTimelineSection, CollapsibleIcons } from '../../webview/templates';
import { getClientScripts } from '../../webview/scripts';

describe('Export Feature Unit Tests', () => {
    describe('Webview Templates', () => {
        it('should have export data button in timeline section', () => {
            const html = getTimelineSection();
            assert.ok(html.includes('activeExportData()'), 'Timeline section should initiate exportData');
            assert.ok(html.includes('Export Timeline Data'), 'Timeline section should have export button title');
        });

        it('should have download icon', () => {
            // @ts-ignore
            assert.ok(CollapsibleIcons.download, 'CollapsibleIcons should have download icon');
            // @ts-ignore
            assert.ok(CollapsibleIcons.download.includes('<svg'), 'Download icon should be an SVG');
        });
    });

    describe('Webview Scripts', () => {
        it('should have activeExportData function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function activeExportData()'), 'Scripts should include activeExportData function');
            assert.ok(scripts.includes("vscode.postMessage({ command: 'exportData' })"), 'activeExportData should post exportData command');
        });
    });
});
