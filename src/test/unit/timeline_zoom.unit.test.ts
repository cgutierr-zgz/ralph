import * as assert from 'assert';
import { getTimelineSection } from '../../webview/templates';
import { getStyles } from '../../webview/styles';
import { getClientScripts } from '../../webview/scripts';

describe('Timeline Zoom Controls', () => {
    describe('Template', () => {
        it('should include zoom controls in timeline section', () => {
            const html = getTimelineSection();
            assert.ok(html.includes('class="zoom-controls"'), 'Should have zoom-controls container');
            assert.ok(html.includes('onclick="zoomTimeline(-1)"'), 'Should have Zoom Out button');
            assert.ok(html.includes('onclick="zoomTimeline(1)"'), 'Should have Zoom In button');
            assert.ok(html.includes('onclick="resetZoom()"'), 'Should have Reset Zoom button');
        });

        it('should include timeline scroll container', () => {
             const html = getTimelineSection();
             assert.ok(html.includes('class="timeline-scroll-container"'), 'Should have scroll container');
        });
    });

    describe('Styles', () => {
        it('should include zoom control styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.zoom-controls'), 'Should map .zoom-controls class');
            assert.ok(styles.includes('.zoom-controls button.icon-only.small'), 'Should have small button styles');
        });

        it('should include timeline scroll styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-scroll-container'), 'Should have scroll container styles');
            assert.ok(styles.includes('overflow-x: auto'), 'Should enable horizontal scrolling');
            assert.ok(styles.includes('scrollbar-width: thin'), 'Should style scrollbar');
        });
        
        it('should include dynamic bar width via CSS variable', () => {
            const styles = getStyles();
            assert.ok(styles.includes('min-width: var(--timeline-bar-width, 20px)'), 'Should use variable for min-width');
        });
    });

    describe('Scripts', () => {
        it('should include zoom logic', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('const ZOOM_LEVELS = [10, 15, 20, 30, 40, 60, 80]'), 'Should define ZOOM_LEVELS');
            assert.ok(scripts.includes('function zoomTimeline(delta)'), 'Should have zoomTimeline function');
            assert.ok(scripts.includes('function resetZoom()'), 'Should have resetZoom function');
            assert.ok(scripts.includes('function applyZoom()'), 'Should have applyZoom function');
        });

         it('should apply zoom in updateTimeline', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('applyZoom()'), 'Should call applyZoom in updateTimeline');
        });
    });
});
