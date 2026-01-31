import * as assert from 'assert';
import { getDurationChartSection, CollapsibleIcons } from '../../webview/templates';

describe('Chart Templates', () => {
    describe('getDurationChartSection', () => {
        it('should return valid HTML string', () => {
            const html = getDurationChartSection();
            assert.ok(typeof html === 'string');
            assert.ok(html.length > 0);
        });

        it('should include correct ID and class', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('id="durationSection"'), 'Missing durationSection ID');
            assert.ok(html.includes('class="duration-section collapsible-section"'), 'Missing duration-section class');
        });

        it('should have correct title', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('Task Duration Breakdown'), 'Missing correct title');
        });

        it('should include collapsible components', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('onclick="toggleSection(\'durationContent\''), 'Missing toggle handler');
            assert.ok(html.includes('id="durationToggle"'), 'Missing toggle icon ID');
            assert.ok(html.includes(CollapsibleIcons.chevronDown), 'Missing chevron icon');
        });

        it('should include content container', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('id="durationContent"'), 'Missing content ID');
            assert.ok(html.includes('class="duration-content section-content"'), 'Missing content class');
        });

        it('should include empty state', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('id="durationEmpty"'), 'Missing empty state ID');
            assert.ok(html.includes('No tasks completed yet'), 'Missing empty state text');
        });

        it('should include chart container', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('id="durationChart"'), 'Missing chart container ID');
            assert.ok(html.includes('class="duration-chart"'), 'Missing chart container class');
            assert.ok(html.includes('style="display: none;"'), 'Chart should be hidden by default');
        });

        it('should have correct accessibility attributes', () => {
            const html = getDurationChartSection();
            assert.ok(html.includes('role="region"'), 'Missing role="region"');
            assert.ok(html.includes('aria-label="Task duration breakdown"'), 'Missing aria-label');
            assert.ok(html.includes('aria-expanded="true"'), 'Missing aria-expanded');
            assert.ok(html.includes('aria-controls="durationContent"'), 'Missing aria-controls');
        });
    });
});
