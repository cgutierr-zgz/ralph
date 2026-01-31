import * as assert from 'assert';
import { getStyles } from '../../webview/styles';
import { getClientScripts } from '../../webview/scripts';

describe('Timeline Tooltips', () => {
    describe('Styles', () => {
        it('should include timeline tooltip container styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-tooltip'), 'Should have .timeline-tooltip class');
            assert.ok(styles.includes('position: fixed'), 'Tooltip should be fixed position');
            assert.ok(styles.includes('z-index: 1000'), 'Tooltip should have high z-index');
            assert.ok(styles.includes('pointer-events: none'), 'Tooltip should ignore pointer events');
        });

        it('should include tooltip visibility styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-tooltip.visible'), 'Should have visible state class');
            assert.ok(styles.includes('opacity: 1'), 'Visible state should be opaque');
        });

        it('should include tooltip content styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-tooltip .tooltip-header'), 'Should style tooltip header');
            assert.ok(styles.includes('.timeline-tooltip .tooltip-desc'), 'Should style tooltip description');
            assert.ok(styles.includes('.timeline-tooltip .tooltip-meta'), 'Should style tooltip meta info');
        });
    });

    describe('Scripts', () => {
        it('should include tooltip management functions', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function createTimelineTooltip()'), 'Should have createTimelineTooltip function');
            assert.ok(scripts.includes('function showTimelineTooltip(event, task, index)'), 'Should have showTimelineTooltip function');
            assert.ok(scripts.includes('function hideTimelineTooltip()'), 'Should have hideTimelineTooltip function');
            assert.ok(scripts.includes('function updateTooltipPosition(target)'), 'Should have updateTooltipPosition function');
        });

        it('should include simple tooltip function', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes('function showSimpleTooltip(event, title, desc)'), 'Should have showSimpleTooltip function');
        });

         it('should create tooltip element on demand', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("document.createElement('div')"), 'Should create div element');
            assert.ok(scripts.includes("timelineTooltip.id = 'timelineTooltip'"), 'Should set tooltip ID');
        });

        it('should attach tooltip events in updateTimeline', () => {
            const scripts = getClientScripts();
            // We check for the event handler assignments
            assert.ok(scripts.includes('bar.onmouseenter = function(e) { showTimelineTooltip(e, task, i); };'), 'Should attach mouseenter handler');
            assert.ok(scripts.includes('bar.onmouseleave = function() { hideTimelineTooltip(); };'), 'Should attach mouseleave handler');
        });

        it('should attach tooltip events for pending bars', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("showSimpleTooltip(e, 'Task #' + taskNum + ' (Pending)', 'Estimated duration: ' + durationStr);"), 'Should attach handler for pending bars');
        });

        it('should attach tooltip events for current bar', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("showSimpleTooltip(e, 'Task #' + taskNum + ' (In Progress)', 'Current task is executing...');"), 'Should attach handler for current bar');
        });
        
        it('should have positioning logic', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes('target.getBoundingClientRect()'), 'Should get target rect');
             assert.ok(scripts.includes('timelineTooltip.getBoundingClientRect()'), 'Should get tooltip rect');
             assert.ok(scripts.includes('timelineTooltip.style.left'), 'Should set left position');
             assert.ok(scripts.includes('timelineTooltip.style.top'), 'Should set top position');
        });
    });
});
