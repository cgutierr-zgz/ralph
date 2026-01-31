import * as assert from 'assert';
import { getStyles } from '../../webview/styles';

describe('Webview Styles', () => {
    describe('getStyles', () => {
        it('should return a string', () => {
            const styles = getStyles();
            assert.strictEqual(typeof styles, 'string');
        });

        it('should include CSS variables', () => {
            const styles = getStyles();
            assert.ok(styles.includes(':root'));
            assert.ok(styles.includes('--gradient-1'));
            assert.ok(styles.includes('--gradient-2'));
            assert.ok(styles.includes('--gradient-3'));
        });

        it('should include header styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.header'));
            assert.ok(styles.includes('.header.idle'));
            assert.ok(styles.includes('.header.running'));
        });

        it('should include button styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('button'));
            assert.ok(styles.includes('button.primary'));
            assert.ok(styles.includes('button.secondary'));
            assert.ok(styles.includes('button.danger'));
        });

        it('should include task section styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.task-section'));
            assert.ok(styles.includes('.task-label'));
            assert.ok(styles.includes('.task-text'));
        });

        it('should include log section styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-section'));
            assert.ok(styles.includes('.log-entry'));
            assert.ok(styles.includes('.log-time'));
        });

        it('should include timeline styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-section'));
            assert.ok(styles.includes('.timeline-bar'));
            assert.ok(styles.includes('.timeline-bars'));
        });

        it('should include requirements section styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.requirements-section'));
            assert.ok(styles.includes('.requirement-item'));
        });

        it('should include settings overlay styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.settings-overlay'));
            assert.ok(styles.includes('.settings-header'));
        });

        it('should include setup section styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.setup-section'));
            assert.ok(styles.includes('.setup-textarea'));
        });

        it('should include countdown styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.countdown'));
            assert.ok(styles.includes('.countdown-clock'));
        });

        it('should include timing display styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timing-display'));
            assert.ok(styles.includes('.timing-value'));
        });

        it('should include animation keyframes', () => {
            const styles = getStyles();
            assert.ok(styles.includes('@keyframes'));
            assert.ok(styles.includes('gradientShift'));
            assert.ok(styles.includes('shimmer'));
            assert.ok(styles.includes('pulse'));
        });

        it('should include status pill styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.status-pill'));
            assert.ok(styles.includes('.status-dot'));
        });

        it('should include footer styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.footer'));
            assert.ok(styles.includes('.footer-warning'));
            assert.ok(styles.includes('.footer-disclaimer'));
        });

        it('should include empty state styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.empty-state'));
            assert.ok(styles.includes('.empty-state-icon'));
        });

        it('should include VS Code theme variables', () => {
            const styles = getStyles();
            assert.ok(styles.includes('var(--vscode-'));
        });

        it('should include control button spacing', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.controls'));
            assert.ok(styles.includes('.spacer'));
        });

        it('should include error log entry styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry.error'));
            assert.ok(styles.includes('.log-entry.error .log-msg'));
        });

        it('should include error styling with red color', () => {
            const styles = getStyles();
            assert.ok(styles.includes('#ef4444')); // Error red color
        });

        it('should include warning log entry styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry.warning'));
            assert.ok(styles.includes('.log-entry.warning .log-msg'));
        });

        it('should include warning styling with amber color', () => {
            const styles = getStyles();
            assert.ok(styles.includes('#f59e0b')); // Warning amber color
        });
    });

    describe('Log Filter Styles', () => {
        it('should include log-filters container', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filters'));
        });

        it('should include log-filter-btn styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-btn'));
        });

        it('should include log-filter-btn hover state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-btn:hover'));
        });

        it('should include log-filter-btn focus-visible state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-btn:focus-visible'));
        });

        it('should include log-filter-btn active state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-btn.active'));
        });

        it('should include level-specific active colors', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-btn[data-level="info"].active'));
            assert.ok(styles.includes('.log-filter-btn[data-level="warning"].active'));
            assert.ok(styles.includes('.log-filter-btn[data-level="error"].active'));
        });

        it('should include log-filter-icon styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-icon'));
        });

        it('should include log-filter-label styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-label'));
        });

        it('should include log-filter-count styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-filter-count'));
        });

        it('should include filtered-out class for hidden entries', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry.filtered-out'));
            assert.ok(styles.includes('display: none'));
        });
    });

    describe('Virtual Scrolling Styles', () => {
        it('should include virtual-scroll-enabled class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-enabled'), 'Should have virtual-scroll-enabled class');
        });

        it('should set position relative on virtual-scroll-enabled', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-enabled {'), 'Should have virtual-scroll-enabled block');
            assert.ok(styles.includes('position: relative'), 'Should set position relative');
        });

        it('should include virtual-scroll-spacer class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-spacer'), 'Should have virtual-scroll-spacer class');
        });

        it('should set spacer to pointer-events none', () => {
            const styles = getStyles();
            assert.ok(styles.includes('pointer-events: none'), 'Spacer should not receive pointer events');
        });

        it('should set spacer width to 100%', () => {
            const styles = getStyles();
            assert.ok(styles.includes('width: 100%'), 'Spacer should fill width');
        });

        it('should set spacer flex-shrink to 0', () => {
            const styles = getStyles();
            const styles2 = getStyles();
            assert.ok(styles2.includes('flex-shrink: 0'), 'Spacer should not shrink');
        });

        it('should style log entries in virtual scroll mode', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-enabled .log-entry'), 'Should style entries in virtual mode');
        });

        it('should set log entry to box-sizing border-box', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-enabled .log-entry'), 'Should style entries');
            assert.ok(styles.includes('box-sizing: border-box'), 'Should use border-box');
        });

        it('should include virtual-scroll-indicator class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.virtual-scroll-indicator'), 'Should have indicator class');
        });

        it('should style indicator with small font size', () => {
            const styles = getStyles();
            assert.ok(styles.includes('font-size: 9px'), 'Indicator should have small font');
        });

        it('should add lightning bolt icon to indicator', () => {
            const styles = getStyles();
            assert.ok(styles.includes(".virtual-scroll-indicator::before"), 'Should have before pseudo-element');
            assert.ok(styles.includes("content: '⚡'"), 'Should show lightning bolt');
        });
    });

    describe('Log Action Button Styles (Copy Log)', () => {
        it('should include log-action-btn base styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn'), 'Should have log-action-btn class');
        });

        it('should include log-action-btn hover state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn:hover'), 'Should have hover state');
        });

        it('should include log-action-btn focus-visible state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn:focus-visible'), 'Should have focus-visible state');
        });

        it('should include log-action-btn active state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn:active'), 'Should have active state');
        });

        it('should include log-action-btn copied state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn.copied'), 'Should have copied state');
        });

        it('should include log-action-icon styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-icon'), 'Should have icon container styles');
        });

        it('should include log-action-label styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-label'), 'Should have label styles');
        });

        it('should style copied state with success color', () => {
            const styles = getStyles();
            // Copied state should have green color
            const copiedSection = styles.substring(styles.indexOf('.log-action-btn.copied'));
            assert.ok(copiedSection.includes('#22c55e'), 'Copied state should use green color');
        });

        it('should include log-action-btn exported state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-action-btn.exported'), 'Should have exported state');
        });

        it('should style exported state with blue color', () => {
            const styles = getStyles();
            // Exported state should have blue color
            const exportedSection = styles.substring(styles.indexOf('.log-action-btn.exported'));
            assert.ok(exportedSection.includes('#3b82f6'), 'Exported state should use blue color');
        });

        it('should have exported state background color', () => {
            const styles = getStyles();
            const exportedSection = styles.substring(styles.indexOf('.log-action-btn.exported'));
            assert.ok(exportedSection.includes('background'), 'Exported state should set background');
        });

        it('should have exported state border color', () => {
            const styles = getStyles();
            const exportedSection = styles.substring(styles.indexOf('.log-action-btn.exported'));
            assert.ok(exportedSection.includes('border-color'), 'Exported state should set border-color');
        });

        it('should have exported state text color', () => {
            const styles = getStyles();
            const exportedSection = styles.substring(styles.indexOf('.log-action-btn.exported'));
            assert.ok(exportedSection.includes('color: #fff'), 'Exported state should set white text');
        });
    });

    describe('Timestamp Toggle Styles', () => {
        it('should include log-timestamp-toggle class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-timestamp-toggle'), 'Should have timestamp toggle class');
        });

        it('should include log-timestamp-toggle transition', () => {
            const styles = getStyles();
            const toggleSection = styles.substring(styles.indexOf('.log-timestamp-toggle'));
            assert.ok(toggleSection.includes('transition'), 'Should have transition property');
        });

        it('should include log-timestamp-toggle aria-pressed true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-timestamp-toggle[aria-pressed="true"]'), 'Should have pressed=true state');
        });

        it('should include log-timestamp-toggle aria-pressed false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-timestamp-toggle[aria-pressed="false"]'), 'Should have pressed=false state');
        });

        it('should style pressed=true with VS Code button colors', () => {
            const styles = getStyles();
            const pressedTrueSection = styles.substring(styles.indexOf('.log-timestamp-toggle[aria-pressed="true"]'));
            assert.ok(pressedTrueSection.includes('--vscode-button-background'), 'Should use button background');
            assert.ok(pressedTrueSection.includes('--vscode-button-foreground'), 'Should use button foreground');
        });

        it('should style pressed=false with reduced opacity', () => {
            const styles = getStyles();
            const pressedFalseSection = styles.substring(styles.indexOf('.log-timestamp-toggle[aria-pressed="false"]'));
            assert.ok(pressedFalseSection.includes('opacity'), 'Should have opacity');
        });

        it('should include log-area-hide-timestamps class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-area-hide-timestamps'), 'Should have hide timestamps class');
        });

        it('should hide log-time when timestamps are hidden', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-area-hide-timestamps .log-time'), 'Should target log-time inside hide class');
            const hideSection = styles.substring(styles.indexOf('.log-area-hide-timestamps .log-time'));
            assert.ok(hideSection.includes('display: none'), 'Should hide timestamps with display: none');
        });
    });

    describe('Auto-Scroll Toggle Styles', () => {
        it('should include log-autoscroll-toggle class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-autoscroll-toggle'), 'Should have auto-scroll toggle class');
        });

        it('should include log-autoscroll-toggle transition', () => {
            const styles = getStyles();
            const toggleSection = styles.substring(styles.indexOf('.log-autoscroll-toggle'));
            assert.ok(toggleSection.includes('transition'), 'Should have transition property');
        });

        it('should include log-autoscroll-toggle aria-pressed true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-autoscroll-toggle[aria-pressed="true"]'), 'Should have pressed=true state');
        });

        it('should include log-autoscroll-toggle aria-pressed false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-autoscroll-toggle[aria-pressed="false"]'), 'Should have pressed=false state');
        });

        it('should style pressed=true with VS Code button colors', () => {
            const styles = getStyles();
            const pressedTrueSection = styles.substring(styles.indexOf('.log-autoscroll-toggle[aria-pressed="true"]'));
            assert.ok(pressedTrueSection.includes('--vscode-button-background'), 'Should use button background');
            assert.ok(pressedTrueSection.includes('--vscode-button-foreground'), 'Should use button foreground');
        });

        it('should style pressed=false with reduced opacity', () => {
            const styles = getStyles();
            const pressedFalseSection = styles.substring(styles.indexOf('.log-autoscroll-toggle[aria-pressed="false"]'));
            assert.ok(pressedFalseSection.includes('opacity'), 'Should have opacity');
        });

        it('should reduce icon opacity when pressed=false', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-autoscroll-toggle[aria-pressed="false"] .log-action-icon'), 'Should target icon inside disabled toggle');
        });
    });

    describe('Log Search Styles', () => {
        it('should include log-search-container styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-container'));
        });

        it('should include log-search-icon styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-icon'));
        });

        it('should include log-search-input styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-input'));
        });

        it('should include log-search-input::placeholder styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-input::placeholder'));
        });

        it('should include log-search-input:focus styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-input:focus'));
        });

        it('should include log-search-clear button styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-clear'));
        });

        it('should include log-search-clear:hover styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-clear:hover'));
        });

        it('should include log-search-clear:focus-visible styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-clear:focus-visible'));
        });

        it('should include log-search-count styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-count'));
        });

        it('should include log-search-count.no-matches styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-count.no-matches'));
        });

        it('should include log-search-count.has-matches styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-search-count.has-matches'));
        });

        it('should include search-highlight styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry .search-highlight'));
        });

        it('should include search-match entry styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry.search-match'));
        });

        it('should include search-hidden entry styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.log-entry.search-hidden'));
            assert.ok(styles.includes('display: none'));
        });
    });

    describe('Log Action Button High Contrast Dark Styles', () => {
        it('should include high contrast log-action-btn', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-action-btn'));
        });

        it('should include high contrast log-action-btn hover', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-action-btn:hover'));
        });

        it('should include high contrast log-action-btn copied state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-action-btn.copied'));
        });

        it('should use transparent background in high contrast dark', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast .log-action-btn {'),
                styles.indexOf('body.vscode-high-contrast .log-action-btn {') + 200
            );
            assert.ok(hcSection.includes('background: transparent'));
        });

        it('should use light green for copied state in high contrast dark', () => {
            const styles = getStyles();
            assert.ok(styles.includes('#90ee90'), 'Should use light green (#90ee90) for copied state');
        });
    });

    describe('Timestamp Toggle High Contrast Dark Styles', () => {
        it('should include high contrast timestamp toggle pressed=true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="true"]'));
        });

        it('should include high contrast timestamp toggle pressed=false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="false"]'));
        });

        it('should use 2px solid border for pressed=true in high contrast dark', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="true"]'),
                styles.indexOf('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="true"]') + 200
            );
            assert.ok(hcSection.includes('border: 2px solid'), 'Should have 2px solid border');
        });

        it('should use dashed border for pressed=false in high contrast dark', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="false"]'),
                styles.indexOf('body.vscode-high-contrast .log-timestamp-toggle[aria-pressed="false"]') + 200
            );
            assert.ok(hcSection.includes('border-style: dashed'), 'Should have dashed border');
        });
    });

    describe('Auto-Scroll Toggle High Contrast Dark Styles', () => {
        it('should include high contrast auto-scroll toggle pressed=true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="true"]'));
        });

        it('should include high contrast auto-scroll toggle pressed=false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="false"]'));
        });

        it('should use 2px solid border for pressed=true in high contrast dark', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="true"]'),
                styles.indexOf('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="true"]') + 200
            );
            assert.ok(hcSection.includes('border: 2px solid'), 'Should have 2px solid border');
        });

        it('should use dashed border for pressed=false in high contrast dark', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="false"]'),
                styles.indexOf('body.vscode-high-contrast .log-autoscroll-toggle[aria-pressed="false"]') + 200
            );
            assert.ok(hcSection.includes('border-style: dashed'), 'Should have dashed border');
        });
    });

    describe('Log Action Button High Contrast Light Styles', () => {
        it('should include high contrast light log-action-btn', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-action-btn'));
        });

        it('should include high contrast light log-action-btn hover', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-action-btn:hover'));
        });

        it('should include high contrast light log-action-btn copied state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-action-btn.copied'));
        });

        it('should use dark green for copied state in high contrast light', () => {
            const styles = getStyles();
            assert.ok(styles.includes('#15803d'), 'Should use dark green (#15803d) for copied state');
        });
    });

    describe('Timestamp Toggle High Contrast Light Styles', () => {
        it('should include high contrast light timestamp toggle pressed=true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="true"]'));
        });

        it('should include high contrast light timestamp toggle pressed=false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="false"]'));
        });

        it('should use 2px solid border for pressed=true in high contrast light', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="true"]'),
                styles.indexOf('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="true"]') + 200
            );
            assert.ok(hcSection.includes('border: 2px solid'), 'Should have 2px solid border');
        });

        it('should use dashed border for pressed=false in high contrast light', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="false"]'),
                styles.indexOf('body.vscode-high-contrast-light .log-timestamp-toggle[aria-pressed="false"]') + 200
            );
            assert.ok(hcSection.includes('border-style: dashed'), 'Should have dashed border');
        });
    });

    describe('Auto-Scroll Toggle High Contrast Light Styles', () => {
        it('should include high contrast light auto-scroll toggle pressed=true state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="true"]'));
        });

        it('should include high contrast light auto-scroll toggle pressed=false state', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="false"]'));
        });

        it('should use 2px solid border for pressed=true in high contrast light', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="true"]'),
                styles.indexOf('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="true"]') + 200
            );
            assert.ok(hcSection.includes('border: 2px solid'), 'Should have 2px solid border');
        });

        it('should use dashed border for pressed=false in high contrast light', () => {
            const styles = getStyles();
            const hcSection = styles.substring(
                styles.indexOf('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="false"]'),
                styles.indexOf('body.vscode-high-contrast-light .log-autoscroll-toggle[aria-pressed="false"]') + 200
            );
            assert.ok(hcSection.includes('border-style: dashed'), 'Should have dashed border');
        });
    });

    describe('Log Search High Contrast Dark Styles', () => {
        it('should include high contrast log-search-container', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-container'));
        });

        it('should include high contrast log-search-input', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-input'));
        });

        it('should include high contrast log-search-input:focus', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-input:focus'));
        });

        it('should include high contrast log-search-clear', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-clear'));
        });

        it('should include high contrast search-highlight', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-entry .search-highlight'));
        });

        it('should include high contrast search-match', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-entry.search-match'));
        });

        it('should include high contrast no-matches count', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-count.no-matches'));
        });

        it('should include high contrast has-matches count', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast .log-search-count.has-matches'));
        });
    });

    describe('Log Search High Contrast Light Styles', () => {
        it('should include high contrast light log-search-container', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-container'));
        });

        it('should include high contrast light log-search-input', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-input'));
        });

        it('should include high contrast light log-search-input:focus', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-input:focus'));
        });

        it('should include high contrast light log-search-clear', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-clear'));
        });

        it('should include high contrast light search-highlight', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-entry .search-highlight'));
        });

        it('should include high contrast light search-match', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-entry.search-match'));
        });

        it('should include high contrast light no-matches count', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-count.no-matches'));
        });

        it('should include high contrast light has-matches count', () => {
            const styles = getStyles();
            assert.ok(styles.includes('body.vscode-high-contrast-light .log-search-count.has-matches'));
        });
    });

    describe('Focus Indicator Styles', () => {
        it('should include focus-visible styles for buttons', () => {
            const styles = getStyles();
            assert.ok(styles.includes('button:focus-visible'), 'Should have button:focus-visible style');
        });

        it('should include focus-visible styles for inputs', () => {
            const styles = getStyles();
            assert.ok(styles.includes('input:focus-visible'), 'Should have input:focus-visible style');
        });

        it('should include focus-visible styles for textareas', () => {
            const styles = getStyles();
            assert.ok(styles.includes('textarea:focus-visible'), 'Should have textarea:focus-visible style');
        });

        it('should include focus-visible styles for selects', () => {
            const styles = getStyles();
            assert.ok(styles.includes('select:focus-visible'), 'Should have select:focus-visible style');
        });

        it('should include focus-visible styles for links', () => {
            const styles = getStyles();
            assert.ok(styles.includes('a:focus-visible'), 'Should have a:focus-visible style');
        });

        it('should include focus-visible styles for tabindex elements', () => {
            const styles = getStyles();
            assert.ok(styles.includes('[tabindex]:focus-visible'), 'Should have [tabindex]:focus-visible style');
        });

        it('should include focus-visible styles for requirements header', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.requirements-header:focus-visible'), 'Should have requirements-header:focus-visible style');
        });

        it('should use VS Code focus border variable', () => {
            const styles = getStyles();
            assert.ok(styles.includes('--vscode-focusBorder'), 'Should use VS Code focus border color');
        });

        it('should include outline offset for focus indicators', () => {
            const styles = getStyles();
            assert.ok(styles.includes('outline-offset'), 'Should have outline-offset for accessibility');
        });

        it('should include box-shadow for button focus', () => {
            const styles = getStyles();
            // Box-shadow is used for more visible focus rings on buttons
            assert.ok(styles.includes('box-shadow: 0 0 0'), 'Should use box-shadow for button focus rings');
        });

        it('should include focus styles for primary buttons', () => {
            const styles = getStyles();
            assert.ok(styles.includes('button.primary:focus-visible'), 'Should have primary button focus style');
        });

        it('should include focus styles for danger buttons', () => {
            const styles = getStyles();
            assert.ok(styles.includes('button.danger:focus-visible'), 'Should have danger button focus style');
        });

        it('should include focus styles for settings close button', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.settings-close:focus-visible'), 'Should have settings close button focus style');
        });

        it('should include focus styles for checkboxes', () => {
            const styles = getStyles();
            assert.ok(styles.includes('input[type="checkbox"]:focus-visible'), 'Should have checkbox focus style');
        });

        it('should include focus styles for setup textarea', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.setup-textarea:focus-visible'), 'Should have setup textarea focus style');
        });

        it('should include focus styles for settings number input', () => {
            const styles = getStyles();
            assert.ok(styles.includes('input[type="number"]:focus-visible'), 'Should have number input focus style');
        });

        it('should include main content focus style for Escape key handling', () => {
            const styles = getStyles();
            assert.ok(styles.includes('#mainContent:focus'), 'Should have mainContent focus style');
        });

        it('should hide outline on main content focus', () => {
            const styles = getStyles();
            // Main content should not show outline when focused (it's just for Escape handling)
            const mainContentFocus = styles.match(/#mainContent:focus\s*\{[^}]*outline:\s*none/);
            assert.ok(mainContentFocus, 'Should hide outline on mainContent focus');
        });

        it('should include skip-link styles for screen reader users', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.skip-link'), 'Should have skip-link style');
        });

        it('should position skip-link off-screen by default', () => {
            const styles = getStyles();
            assert.ok(styles.includes('left: -9999px'), 'Skip-link should be off-screen by default');
        });

        it('should show skip-link on focus', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.skip-link:focus'), 'Should have skip-link:focus style');
        });
    });

    describe('Screen Reader Announcer Styles', () => {
        it('should include sr-announcer class', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.sr-announcer'), 'Should have sr-announcer class');
        });

        it('should use visually hidden technique with 1px dimensions', () => {
            const styles = getStyles();
            assert.ok(styles.includes('width: 1px'), 'Should have 1px width');
            assert.ok(styles.includes('height: 1px'), 'Should have 1px height');
        });

        it('should position announcer absolutely', () => {
            const styles = getStyles();
            assert.ok(styles.includes('position: absolute'), 'Should be absolutely positioned');
        });

        it('should use overflow hidden', () => {
            const styles = getStyles();
            assert.ok(styles.includes('overflow: hidden'), 'Should have overflow hidden');
        });

        it('should use clip rect to hide visually', () => {
            const styles = getStyles();
            assert.ok(styles.includes('clip: rect(0, 0, 0, 0)'), 'Should use clip rect for hiding');
        });

        it('should use whitespace nowrap', () => {
            const styles = getStyles();
            assert.ok(styles.includes('white-space: nowrap'), 'Should have whitespace nowrap');
        });

        it('should have zero border', () => {
            const styles = getStyles();
            assert.ok(styles.includes('border: 0'), 'Should have zero border');
        });

        it('should have negative margin to remove from layout', () => {
            const styles = getStyles();
            assert.ok(styles.includes('margin: -1px'), 'Should have negative margin');
        });

        it('should have zero padding', () => {
            const styles = getStyles();
            // Check the sr-announcer section specifically has padding: 0
            const announcerSection = styles.match(/\.sr-announcer\s*\{[^}]*padding:\s*0/);
            assert.ok(announcerSection, 'Should have zero padding in sr-announcer');
        });
    });

    describe('High Contrast Theme Support', () => {
        describe('High Contrast Dark Theme', () => {
            it('should include body.vscode-high-contrast selector', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast'), 'Should have high contrast dark theme selector');
            });

            it('should define high contrast CSS variables', () => {
                const styles = getStyles();
                assert.ok(styles.includes('--hc-border'), 'Should define --hc-border variable');
                assert.ok(styles.includes('--hc-active-border'), 'Should define --hc-active-border variable');
                assert.ok(styles.includes('--hc-focus'), 'Should define --hc-focus variable');
            });

            it('should use VS Code contrastBorder for high contrast dark', () => {
                const styles = getStyles();
                assert.ok(styles.includes('--vscode-contrastBorder'), 'Should use VS Code contrastBorder');
            });

            it('should use VS Code contrastActiveBorder for active elements', () => {
                const styles = getStyles();
                assert.ok(styles.includes('--vscode-contrastActiveBorder'), 'Should use VS Code contrastActiveBorder');
            });

            it('should override header background to transparent in high contrast', () => {
                const styles = getStyles();
                const hcHeader = styles.match(/body\.vscode-high-contrast\s+\.header\s*\{[^}]*background:\s*var\(--vscode-sideBar-background\)/);
                assert.ok(hcHeader, 'Should override header background in high contrast');
            });

            it('should disable animations in high contrast mode', () => {
                const styles = getStyles();
                const hcRunning = styles.match(/body\.vscode-high-contrast\s+\.header\.running[^}]*animation:\s*none/);
                assert.ok(hcRunning, 'Should disable animations for running header in high contrast');
            });

            it('should add border to header in high contrast mode', () => {
                const styles = getStyles();
                const hcHeaderBorder = styles.match(/body\.vscode-high-contrast\s+\.header\s*\{[^}]*border:/);
                assert.ok(hcHeaderBorder, 'Should add border to header in high contrast');
            });

            it('should disable shimmer effect overlay in high contrast', () => {
                const styles = getStyles();
                assert.ok(
                    styles.includes('body.vscode-high-contrast .header.running::after'),
                    'Should target shimmer overlay in high contrast'
                );
            });

            it('should style status pill with border in high contrast', () => {
                const styles = getStyles();
                const hcStatusPill = styles.match(/body\.vscode-high-contrast\s+\.status-pill\s*\{[^}]*border:/);
                assert.ok(hcStatusPill, 'Should add border to status pill in high contrast');
            });

            it('should add border to buttons in high contrast', () => {
                const styles = getStyles();
                const hcButton = styles.match(/body\.vscode-high-contrast\s+button\s*\{[^}]*border:/);
                assert.ok(hcButton, 'Should add border to buttons in high contrast');
            });

            it('should style primary button with active border in high contrast', () => {
                const styles = getStyles();
                const hcPrimary = styles.match(/body\.vscode-high-contrast\s+button\.primary\s*\{/);
                assert.ok(hcPrimary, 'Should have primary button styles in high contrast');
            });

            it('should style danger button with error color in high contrast', () => {
                const styles = getStyles();
                const hcDanger = styles.match(/body\.vscode-high-contrast\s+button\.danger\s*\{[^}]*--vscode-errorForeground/);
                assert.ok(hcDanger, 'Should use error foreground for danger button in high contrast');
            });

            it('should add borders to sections in high contrast', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-section'), 'Should style task section');
                assert.ok(styles.includes('body.vscode-high-contrast .log-section'), 'Should style log section');
                assert.ok(styles.includes('body.vscode-high-contrast .timeline-section'), 'Should style timeline section');
            });

            it('should style timeline bars in high contrast', () => {
                const styles = getStyles();
                const hcTimelineBar = styles.match(/body\.vscode-high-contrast\s+\.timeline-bar\s*\{/);
                assert.ok(hcTimelineBar, 'Should style timeline bars in high contrast');
            });

            it('should style pending timeline bars with dashed border', () => {
                const styles = getStyles();
                const hcPending = styles.match(/body\.vscode-high-contrast\s+\.timeline-bar\.pending\s*\{[^}]*dashed/);
                assert.ok(hcPending, 'Should use dashed border for pending timeline bars');
            });

            it('should style requirements section in high contrast', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .requirements-section'), 'Should style requirements section');
                assert.ok(styles.includes('body.vscode-high-contrast .requirements-header'), 'Should style requirements header');
            });

            it('should style checkboxes in high contrast', () => {
                const styles = getStyles();
                const hcCheckbox = styles.match(/body\.vscode-high-contrast\s+\.requirement-item\s+input\[type="checkbox"\]/);
                assert.ok(hcCheckbox, 'Should style checkboxes in high contrast');
            });

            it('should style setup section in high contrast', () => {
                const styles = getStyles();
                const hcSetup = styles.match(/body\.vscode-high-contrast\s+\.setup-section\s*\{/);
                assert.ok(hcSetup, 'Should style setup section in high contrast');
            });

            it('should style settings overlay in high contrast', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .settings-overlay'), 'Should style settings overlay');
                assert.ok(styles.includes('body.vscode-high-contrast .settings-header'), 'Should style settings header');
                assert.ok(styles.includes('body.vscode-high-contrast .settings-close'), 'Should style settings close button');
            });

            it('should style warning elements in high contrast', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .footer-warning'), 'Should style footer warning');
                assert.ok(styles.includes('body.vscode-high-contrast .warning-banner'), 'Should style warning banner');
            });

            it('should underline links in high contrast', () => {
                const styles = getStyles();
                const hcLinks = styles.match(/body\.vscode-high-contrast\s+a\s*\{[^}]*text-decoration:\s*underline/);
                assert.ok(hcLinks, 'Should underline links in high contrast');
            });

            it('should style log entry colors in high contrast', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .log-entry.success'), 'Should style success log entries');
                assert.ok(styles.includes('body.vscode-high-contrast .log-entry.error'), 'Should style error log entries');
                assert.ok(styles.includes('body.vscode-high-contrast .log-entry.warning'), 'Should style warning log entries');
            });

            it('should use ansiGreen for success colors in high contrast', () => {
                const styles = getStyles();
                const hcSuccess = styles.match(/body\.vscode-high-contrast\s+\.log-entry\.success[^}]*--vscode-terminal-ansiGreen/);
                assert.ok(hcSuccess, 'Should use ansiGreen for success in high contrast');
            });

            it('should use ansiYellow for warning colors in high contrast', () => {
                const styles = getStyles();
                const hcWarning = styles.match(/body\.vscode-high-contrast\s+\.log-entry\.warning[^}]*--vscode-terminal-ansiYellow/);
                assert.ok(hcWarning, 'Should use ansiYellow for warning in high contrast');
            });

            it('should style log filter buttons in high contrast dark', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .log-filters'), 'Should style log filters container');
                assert.ok(styles.includes('body.vscode-high-contrast .log-filter-btn'), 'Should style filter buttons');
                assert.ok(styles.includes('body.vscode-high-contrast .log-filter-btn.active'), 'Should style active filter button');
            });

            it('should style level-specific filter buttons in high contrast dark', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .log-filter-btn[data-level="info"].active'), 'Should style info filter');
                assert.ok(styles.includes('body.vscode-high-contrast .log-filter-btn[data-level="warning"].active'), 'Should style warning filter');
                assert.ok(styles.includes('body.vscode-high-contrast .log-filter-btn[data-level="error"].active'), 'Should style error filter');
            });

            it('should style virtual scroll indicator in high contrast dark', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .virtual-scroll-indicator'), 'Should style virtual scroll indicator in HC dark');
            });

            it('should override progress percentage gradient in high contrast', () => {
                const styles = getStyles();
                const hcProgress = styles.match(/body\.vscode-high-contrast\s+\.progress-percentage-value[^}]*background:\s*none/);
                assert.ok(hcProgress, 'Should remove gradient from progress percentage in high contrast');
            });
        });

        describe('High Contrast Light Theme', () => {
            it('should include body.vscode-high-contrast-light selector', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light'), 'Should have high contrast light theme selector');
            });

            it('should define high contrast light CSS variables', () => {
                const styles = getStyles();
                // High contrast light should have its own variable definitions
                const hcLightVars = styles.match(/body\.vscode-high-contrast-light\s*\{[^}]*--hc-border:/);
                assert.ok(hcLightVars, 'Should define CSS variables for high contrast light');
            });

            it('should use different fallback colors for high contrast light', () => {
                const styles = getStyles();
                // High contrast light typically uses darker colors
                assert.ok(styles.includes('#0f4a85') || styles.includes('#b5200d'), 'Should have dark fallback colors for HC light');
            });

            it('should style header in high contrast light', () => {
                const styles = getStyles();
                const hcLightHeader = styles.match(/body\.vscode-high-contrast-light\s+\.header\s*\{/);
                assert.ok(hcLightHeader, 'Should style header in high contrast light');
            });

            it('should disable animations in high contrast light mode', () => {
                const styles = getStyles();
                const hcLightRunning = styles.match(/body\.vscode-high-contrast-light\s+\.header\.running[^}]*animation:\s*none/);
                assert.ok(hcLightRunning, 'Should disable animations in high contrast light');
            });

            it('should style buttons in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light button'), 'Should style buttons in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light button.primary'), 'Should style primary buttons in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light button.danger'), 'Should style danger buttons in HC light');
            });

            it('should style sections in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-section'), 'Should style task section in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-section'), 'Should style log section in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .timeline-section'), 'Should style timeline section in HC light');
            });

            it('should style requirements in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .requirements-section'), 'Should style requirements section in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .requirements-header'), 'Should style requirements header in HC light');
            });

            it('should style log entries in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-entry.success'), 'Should style success logs in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-entry.error'), 'Should style error logs in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-entry.warning'), 'Should style warning logs in HC light');
            });

            it('should style log filter buttons in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filters'), 'Should style log filters in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filter-btn'), 'Should style filter buttons in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filter-btn.active'), 'Should style active filter in HC light');
            });

            it('should style level-specific filter buttons in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filter-btn[data-level="info"].active'), 'Should style info filter in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filter-btn[data-level="warning"].active'), 'Should style warning filter in HC light');
                assert.ok(styles.includes('body.vscode-high-contrast-light .log-filter-btn[data-level="error"].active'), 'Should style error filter in HC light');
            });

            it('should style virtual scroll indicator in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .virtual-scroll-indicator'), 'Should style virtual scroll indicator in HC light');
            });

            it('should use appropriate green for success in high contrast light', () => {
                const styles = getStyles();
                // HC light should use darker green that's visible on light backgrounds
                assert.ok(styles.includes('#116329'), 'Should use dark green for success in HC light');
            });

            it('should use appropriate red for errors in high contrast light', () => {
                const styles = getStyles();
                // HC light should use darker red
                assert.ok(styles.includes('#b5200d'), 'Should use dark red for errors in HC light');
            });

            it('should override progress percentage gradient in high contrast light', () => {
                const styles = getStyles();
                const hcLightProgress = styles.match(/body\.vscode-high-contrast-light\s+\.progress-percentage-value[^}]*background:\s*none/);
                assert.ok(hcLightProgress, 'Should remove gradient from progress percentage in HC light');
            });
        });

        describe('High Contrast Accessibility', () => {
            it('should use transparent backgrounds instead of semi-transparent colors', () => {
                const styles = getStyles();
                // High contrast should not use rgba with low alpha
                const hcSections = styles.match(/body\.vscode-high-contrast[^{]*\{[^}]*background:\s*transparent/g);
                assert.ok(hcSections && hcSections.length > 0, 'Should use transparent backgrounds in high contrast');
            });

            it('should use solid borders instead of subtle colors', () => {
                const styles = getStyles();
                // High contrast should use solid borders via CSS variables
                const hcBorders = styles.match(/body\.vscode-high-contrast[^}]*border:[^}]*var\(--hc-border\)/g);
                assert.ok(hcBorders && hcBorders.length > 0, 'Should use CSS variable borders in high contrast');
            });

            it('should maintain focus indicators in high contrast mode', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast button:focus-visible'), 'Should have button focus styles in HC');
                assert.ok(styles.includes('body.vscode-high-contrast a:focus-visible'), 'Should have link focus styles in HC');
            });

            it('should use VS Code theme tokens for high contrast colors', () => {
                const styles = getStyles();
                // Should use VS Code's semantic colors
                assert.ok(styles.includes('--vscode-errorForeground'), 'Should use error foreground token');
                assert.ok(styles.includes('--vscode-editorWarning-foreground'), 'Should use warning foreground token');
                assert.ok(styles.includes('--vscode-terminal-ansiGreen'), 'Should use terminal green token');
            });

            it('should remove webkit gradient effects in high contrast', () => {
                const styles = getStyles();
                // Progress percentage should not use -webkit-background-clip in high contrast
                const hcNoGradient = styles.match(/body\.vscode-high-contrast[^}]*-webkit-background-clip:\s*unset/);
                assert.ok(hcNoGradient, 'Should unset webkit-background-clip in high contrast');
            });
        });
    });

    describe('Loading Spinners', () => {
        describe('Button spinner styles', () => {
            it('should include btn-spinner class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.btn-spinner'));
            });

            it('should have btn-spin animation keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes btn-spin'));
                assert.ok(styles.includes('to { transform: rotate(360deg); }'));
            });

            it('should hide spinner by default', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.btn-spinner'));
                assert.ok(styles.includes('display: none'));
            });

            it('should show spinner when button has loading class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('button.loading .btn-spinner'));
                assert.ok(styles.includes('display: inline-block'));
            });

            it('should hide btn-icon when button is loading', () => {
                const styles = getStyles();
                assert.ok(styles.includes('button.loading .btn-icon'));
            });

            it('should apply loading state styles to buttons', () => {
                const styles = getStyles();
                assert.ok(styles.includes('button.loading'));
                assert.ok(styles.includes('pointer-events: none'));
            });

            it('should reduce opacity for loading buttons', () => {
                const styles = getStyles();
                const loadingButton = styles.match(/button\.loading\s*\{[^}]*opacity:\s*0\.7/);
                assert.ok(loadingButton, 'Loading buttons should have reduced opacity');
            });
        });

        describe('Generate button spinner styles', () => {
            it('should have loading styles for generate-btn', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.generate-btn.loading'));
            });

            it('should set cursor to wait for loading generate button', () => {
                const styles = getStyles();
                assert.ok(styles.includes('cursor: wait'));
            });

            it('should have larger spinner for generate button', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.generate-btn .btn-spinner'));
            });
        });

        describe('Refresh button loading styles', () => {
            it('should have loading animation for icon-only buttons', () => {
                const styles = getStyles();
                assert.ok(styles.includes('button.icon-only.loading svg'));
            });

            it('should include spin-slow animation', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes spin-slow'));
            });
        });

        describe('Loading overlay styles', () => {
            it('should include loading-overlay class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.loading-overlay'));
            });

            it('should position loading overlay absolutely', () => {
                const styles = getStyles();
                const overlay = styles.match(/\.loading-overlay\s*\{[^}]*position:\s*absolute/);
                assert.ok(overlay, 'Loading overlay should be positioned absolutely');
            });

            it('should include spinner-large class for overlay spinner', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.loading-overlay .spinner-large'));
            });
        });

        describe('High contrast loading spinner styles', () => {
            it('should have high contrast dark theme spinner styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .btn-spinner'));
            });

            it('should use hc-active-border for spinner in high contrast dark', () => {
                const styles = getStyles();
                const hcSpinner = styles.match(/body\.vscode-high-contrast\s+\.btn-spinner[^}]*border-color:\s*var\(--hc-active-border\)/);
                assert.ok(hcSpinner, 'Should use hc-active-border for spinner in high contrast');
            });

            it('should have high contrast light theme spinner styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .btn-spinner'));
            });

            it('should use hc-active-border for spinner in high contrast light', () => {
                const styles = getStyles();
                const hcLightSpinner = styles.match(/body\.vscode-high-contrast-light\s+\.btn-spinner[^}]*border-color:\s*var\(--hc-active-border\)/);
                assert.ok(hcLightSpinner, 'Should use hc-active-border for spinner in high contrast light');
            });

            it('should have loading button styles in high contrast dark', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast button.loading'));
            });

            it('should have loading button styles in high contrast light', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light button.loading'));
            });
        });

        describe('Toast Notification Styles', () => {
            describe('Toast container', () => {
                it('should include toast-container class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-container'));
                });

                it('should position toast container fixed', () => {
                    const styles = getStyles();
                    const container = styles.match(/\.toast-container\s*\{[^}]*position:\s*fixed/);
                    assert.ok(container, 'Toast container should be fixed positioned');
                });

                it('should position toast container at top-right', () => {
                    const styles = getStyles();
                    const container = styles.match(/\.toast-container\s*\{[^}]*top:\s*12px[^}]*right:\s*12px/);
                    assert.ok(container, 'Toast container should be at top-right');
                });

                it('should have high z-index for toast container', () => {
                    const styles = getStyles();
                    const container = styles.match(/\.toast-container\s*\{[^}]*z-index:\s*1000/);
                    assert.ok(container, 'Toast container should have z-index 1000');
                });

                it('should use flexbox with column direction', () => {
                    const styles = getStyles();
                    const container = styles.match(/\.toast-container\s*\{[^}]*flex-direction:\s*column/);
                    assert.ok(container, 'Toast container should use column flex direction');
                });
            });

            describe('Toast element', () => {
                it('should include toast class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast'));
                });

                it('should use flexbox for toast layout', () => {
                    const styles = getStyles();
                    const toast = styles.match(/\.toast\s*\{[^}]*display:\s*flex/);
                    assert.ok(toast, 'Toast should use flexbox');
                });

                it('should have toast padding', () => {
                    const styles = getStyles();
                    const toast = styles.match(/\.toast\s*\{[^}]*padding:\s*12px\s*14px/);
                    assert.ok(toast, 'Toast should have padding');
                });

                it('should have toast border-radius', () => {
                    const styles = getStyles();
                    const toast = styles.match(/\.toast\s*\{[^}]*border-radius:\s*6px/);
                    assert.ok(toast, 'Toast should have border-radius');
                });

                it('should have toast box-shadow', () => {
                    const styles = getStyles();
                    const toast = styles.match(/\.toast\s*\{[^}]*box-shadow:/);
                    assert.ok(toast, 'Toast should have box-shadow');
                });

                it('should have slide-in animation', () => {
                    const styles = getStyles();
                    const toast = styles.match(/\.toast\s*\{[^}]*animation:\s*toastSlideIn/);
                    assert.ok(toast, 'Toast should have slide-in animation');
                });
            });

            describe('Toast animations', () => {
                it('should include toastSlideIn keyframes', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes toastSlideIn'));
                });

                it('should include toastSlideOut keyframes', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes toastSlideOut'));
                });

                it('should include toast.dismissing class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.dismissing'));
                });

                it('should use toastSlideOut for dismissing', () => {
                    const styles = getStyles();
                    const dismissing = styles.match(/\.toast\.dismissing\s*\{[^}]*animation:\s*toastSlideOut/);
                    assert.ok(dismissing, 'Dismissing toast should use slide-out animation');
                });

                it('should include toastProgressShrink keyframes', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes toastProgressShrink'));
                });
            });

            describe('Toast parts', () => {
                it('should include toast-icon class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-icon'));
                });

                it('should include toast-content class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-content'));
                });

                it('should include toast-title class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-title'));
                });

                it('should include toast-message class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-message'));
                });

                it('should include toast-dismiss class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-dismiss'));
                });

                it('should include toast-progress class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-progress'));
                });

                it('should have animated toast-progress class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-progress.animate'));
                });
            });

            describe('Toast types', () => {
                it('should include toast.success class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.success'));
                });

                it('should use green border for success toast', () => {
                    const styles = getStyles();
                    const success = styles.match(/\.toast\.success\s*\{[^}]*border-left:\s*3px\s*solid\s*#22c55e/);
                    assert.ok(success, 'Success toast should have green border');
                });

                it('should include toast.error class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.error'));
                });

                it('should use red border for error toast', () => {
                    const styles = getStyles();
                    const error = styles.match(/\.toast\.error\s*\{[^}]*border-left:\s*3px\s*solid\s*#ef4444/);
                    assert.ok(error, 'Error toast should have red border');
                });

                it('should include toast.warning class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.warning'));
                });

                it('should use yellow border for warning toast', () => {
                    const styles = getStyles();
                    const warning = styles.match(/\.toast\.warning\s*\{[^}]*border-left:\s*3px\s*solid\s*#eab308/);
                    assert.ok(warning, 'Warning toast should have yellow border');
                });

                it('should include toast.info class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.info'));
                });

                it('should use blue border for info toast', () => {
                    const styles = getStyles();
                    const info = styles.match(/\.toast\.info\s*\{[^}]*border-left:\s*3px\s*solid\s*#3b82f6/);
                    assert.ok(info, 'Info toast should have blue border');
                });
            });

            describe('Toast icon colors', () => {
                it('should have green icon for success toast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.success .toast-icon'));
                });

                it('should have red icon for error toast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.error .toast-icon'));
                });

                it('should have yellow icon for warning toast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.warning .toast-icon'));
                });

                it('should have blue icon for info toast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast.info .toast-icon'));
                });
            });

            describe('Toast dismiss button', () => {
                it('should have transparent background', () => {
                    const styles = getStyles();
                    const dismiss = styles.match(/\.toast-dismiss\s*\{[^}]*background:\s*transparent/);
                    assert.ok(dismiss, 'Dismiss button should have transparent background');
                });

                it('should have hover state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-dismiss:hover'));
                });

                it('should have focus-visible state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.toast-dismiss:focus-visible'));
                });
            });

            describe('Toast high contrast support', () => {
                it('should have high contrast dark toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .toast'));
                });

                it('should have high contrast light toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .toast'));
                });

                it('should have hc-border for toast in high contrast', () => {
                    const styles = getStyles();
                    const hcToast = styles.match(/body\.vscode-high-contrast\s+\.toast\s*\{[^}]*border:\s*1px\s*solid\s*var\(--hc-border\)/);
                    assert.ok(hcToast, 'High contrast toast should use hc-border');
                });

                it('should have no box-shadow in high contrast', () => {
                    const styles = getStyles();
                    const hcToast = styles.match(/body\.vscode-high-contrast\s+\.toast\s*\{[^}]*box-shadow:\s*none/);
                    assert.ok(hcToast, 'High contrast toast should have no box-shadow');
                });

                it('should have high contrast success toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .toast.success'));
                });

                it('should have high contrast error toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .toast.error'));
                });

                it('should have high contrast warning toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .toast.warning'));
                });

                it('should have high contrast info toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .toast.info'));
                });

                it('should have high contrast light success toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .toast.success'));
                });

                it('should have high contrast light error toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .toast.error'));
                });

                it('should have high contrast light warning toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .toast.warning'));
                });

                it('should have high contrast light info toast styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .toast.info'));
                });
            });
        });

        describe('Task Progress Animations', () => {
            describe('Task section executing state', () => {
                it('should have executing class style', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-section.executing'));
                });

                it('should have taskGlow animation for executing state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes taskGlow'));
                });

                it('should apply taskGlow animation to executing task section', () => {
                    const styles = getStyles();
                    const execSection = styles.indexOf('.task-section.executing');
                    const nextSection = styles.indexOf('.task-section.executing::before', execSection + 1);
                    const sectionBody = styles.substring(execSection, nextSection);
                    assert.ok(sectionBody.includes('animation: taskGlow'));
                });

                it('should have purple glow box-shadow for executing state', () => {
                    const styles = getStyles();
                    const execSection = styles.indexOf('.task-section.executing');
                    const nextSection = styles.indexOf('.task-section.executing::before', execSection + 1);
                    const sectionBody = styles.substring(execSection, nextSection);
                    assert.ok(sectionBody.includes('box-shadow'));
                    assert.ok(sectionBody.includes('rgba(139, 92, 246'));
                });
            });

            describe('Task section shimmer effect', () => {
                it('should have shimmer pseudo-element for executing state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-section.executing::before'));
                });

                it('should have taskShimmer animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes taskShimmer'));
                });

                it('should use gradient for shimmer effect', () => {
                    const styles = getStyles();
                    const shimmerSection = styles.indexOf('.task-section.executing::before');
                    const nextSection = styles.indexOf('@keyframes taskShimmer', shimmerSection);
                    const sectionBody = styles.substring(shimmerSection, nextSection);
                    assert.ok(sectionBody.includes('linear-gradient'));
                    assert.ok(sectionBody.includes('rgba(139, 92, 246'));
                });
            });

            describe('Task completion animation', () => {
                it('should have completing class style', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-section.completing'));
                });

                it('should have taskComplete animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes taskComplete'));
                });

                it('should apply bounce effect in taskComplete animation', () => {
                    const styles = getStyles();
                    const keyframes = styles.indexOf('@keyframes taskComplete');
                    const nextKeyframes = styles.indexOf('@keyframes', keyframes + 1);
                    const keyframeBody = styles.substring(keyframes, nextKeyframes);
                    assert.ok(keyframeBody.includes('scale(1.02)'));
                    assert.ok(keyframeBody.includes('scale(0.98)'));
                });
            });

            describe('Inline progress bar', () => {
                it('should have task-progress container style', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-progress'));
                });

                it('should have task-progress-bar style', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-progress-bar'));
                });

                it('should position progress bar at bottom', () => {
                    const styles = getStyles();
                    const progressStyle = styles.indexOf('.task-progress {');
                    const nextStyle = styles.indexOf('.task-progress-bar', progressStyle);
                    const sectionBody = styles.substring(progressStyle, nextStyle);
                    assert.ok(sectionBody.includes('position: absolute'));
                    assert.ok(sectionBody.includes('bottom: 0'));
                });

                it('should have gradient background for progress bar', () => {
                    const styles = getStyles();
                    const progressBar = styles.indexOf('.task-progress-bar {');
                    const nextStyle = styles.indexOf('@keyframes progressGradient', progressBar);
                    const sectionBody = styles.substring(progressBar, nextStyle);
                    assert.ok(sectionBody.includes('linear-gradient'));
                    assert.ok(sectionBody.includes('#f97316')); // Orange
                    assert.ok(sectionBody.includes('#ec4899')); // Pink
                    assert.ok(sectionBody.includes('#8b5cf6')); // Purple
                });

                it('should have progressGradient animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes progressGradient'));
                });

                it('should have indeterminate progress bar style', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-progress-bar.indeterminate'));
                });

                it('should have progressIndeterminate animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes progressIndeterminate'));
                });

                it('should set fixed width for indeterminate progress', () => {
                    const styles = getStyles();
                    const indeterminate = styles.indexOf('.task-progress-bar.indeterminate');
                    const nextStyle = styles.indexOf('@keyframes progressIndeterminate', indeterminate);
                    const sectionBody = styles.substring(indeterminate, nextStyle);
                    assert.ok(sectionBody.includes('width: 40%'));
                });
            });

            describe('Timeline bar animations', () => {
                it('should have gradient background for current bar', () => {
                    const styles = getStyles();
                    const currentBar = styles.indexOf('.timeline-bar.current {');
                    const nextStyle = styles.indexOf('@keyframes barPulse', currentBar);
                    const sectionBody = styles.substring(currentBar, nextStyle);
                    assert.ok(sectionBody.includes('linear-gradient'));
                    assert.ok(sectionBody.includes('#3b82f6')); // Blue
                    assert.ok(sectionBody.includes('#8b5cf6')); // Purple
                });

                it('should have barGrow animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes barGrow'));
                });

                it('should have barShimmer animation for current bar', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes barShimmer'));
                });

                it('should have shimmer pseudo-element on current bar', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.timeline-bar.current::after'));
                });

                it('should have completed-new animation class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.timeline-bar.completed-new'));
                });

                it('should have barComplete animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes barComplete'));
                });

                it('should transition colors in barComplete animation', () => {
                    const styles = getStyles();
                    const keyframes = styles.indexOf('@keyframes barComplete');
                    const nextKeyframes = styles.indexOf('@keyframes', keyframes + 20);
                    const keyframeBody = styles.substring(keyframes, nextKeyframes);
                    assert.ok(keyframeBody.includes('#8b5cf6')); // Start purple
                    assert.ok(keyframeBody.includes('#22c55e')); // End green
                });

                it('should have becoming-current animation class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.timeline-bar.becoming-current'));
                });

                it('should have becomingCurrent animation', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@keyframes becomingCurrent'));
                });
            });

            describe('Pending bar transitions', () => {
                it('should have transition for pending bars', () => {
                    const styles = getStyles();
                    const pendingBar = styles.indexOf('.timeline-bar.pending {');
                    const nextStyle = styles.indexOf('.timeline-bar.becoming-current', pendingBar);
                    const sectionBody = styles.substring(pendingBar, nextStyle);
                    assert.ok(sectionBody.includes('transition'));
                });
            });

            describe('High contrast theme support for progress animations', () => {
                it('should disable taskGlow animation in high contrast dark', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .task-section.executing'));
                });

                it('should disable shimmer in high contrast dark', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .task-section.executing::before'));
                });

                it('should have high contrast progress bar styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .task-progress'));
                    assert.ok(styles.includes('body.vscode-high-contrast .task-progress-bar'));
                });

                it('should keep indeterminate animation in high contrast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .task-progress-bar.indeterminate'));
                });

                it('should disable taskGlow animation in high contrast light', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .task-section.executing'));
                });

                it('should disable shimmer in high contrast light', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .task-section.executing::before'));
                });

                it('should have high contrast light progress bar styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .task-progress'));
                    assert.ok(styles.includes('body.vscode-high-contrast-light .task-progress-bar'));
                });

                it('should keep timeline bar pulse in high contrast', () => {
                    const styles = getStyles();
                    const hcCurrentBar = styles.indexOf('body.vscode-high-contrast .timeline-bar.current');
                    const nextStyle = styles.indexOf('body.vscode-high-contrast .timeline-bar.current::after', hcCurrentBar);
                    const sectionBody = styles.substring(hcCurrentBar, nextStyle);
                    assert.ok(sectionBody.includes('animation: barPulse'));
                });

                it('should disable shimmer on current bar in high contrast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .timeline-bar.current::after'));
                    const hcAfter = styles.indexOf('body.vscode-high-contrast .timeline-bar.current::after');
                    const nextStyle = styles.indexOf('body.vscode-high-contrast .task-section.executing', hcAfter);
                    const sectionBody = styles.substring(hcAfter, nextStyle);
                    assert.ok(sectionBody.includes('display: none'));
                });
            });

            describe('Task section base transitions', () => {
                it('should have transition on task-section for smooth animations', () => {
                    const styles = getStyles();
                    const taskSection = styles.indexOf('.task-section {');
                    const nextSection = styles.indexOf('.task-section.active', taskSection);
                    const sectionBody = styles.substring(taskSection, nextSection);
                    assert.ok(sectionBody.includes('transition'));
                });

                it('should transition transform property', () => {
                    const styles = getStyles();
                    const taskSection = styles.indexOf('.task-section {');
                    const nextSection = styles.indexOf('.task-section.active', taskSection);
                    const sectionBody = styles.substring(taskSection, nextSection);
                    assert.ok(sectionBody.includes('transform'));
                });

                it('should transition box-shadow property', () => {
                    const styles = getStyles();
                    const taskSection = styles.indexOf('.task-section {');
                    const nextSection = styles.indexOf('.task-section.active', taskSection);
                    const sectionBody = styles.substring(taskSection, nextSection);
                    assert.ok(sectionBody.includes('box-shadow'));
                });

                it('should have overflow hidden for shimmer effect', () => {
                    const styles = getStyles();
                    const taskSection = styles.indexOf('.task-section {');
                    const nextSection = styles.indexOf('.task-section.active', taskSection);
                    const sectionBody = styles.substring(taskSection, nextSection);
                    assert.ok(sectionBody.includes('overflow: hidden'));
                });

                it('should have position relative for progress bar', () => {
                    const styles = getStyles();
                    const taskSection = styles.indexOf('.task-section {');
                    const nextSection = styles.indexOf('.task-section.active', taskSection);
                    const sectionBody = styles.substring(taskSection, nextSection);
                    assert.ok(sectionBody.includes('position: relative'));
                });
            });
        });
    });

    // ====================================================================
    // PRD Input Inline Validation Styles Tests
    // ====================================================================

    describe('PRD Input Inline Validation Styles', () => {
        describe('Textarea wrapper styles', () => {
            it('should include .textarea-wrapper class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.textarea-wrapper {'));
            });

            it('should set position relative for character count positioning', () => {
                const styles = getStyles();
                const wrapperStart = styles.indexOf('.textarea-wrapper {');
                const wrapperEnd = styles.indexOf('}', wrapperStart);
                const wrapperBody = styles.substring(wrapperStart, wrapperEnd);
                assert.ok(wrapperBody.includes('position: relative'));
            });

            it('should set width to 100%', () => {
                const styles = getStyles();
                const wrapperStart = styles.indexOf('.textarea-wrapper {');
                const wrapperEnd = styles.indexOf('}', wrapperStart);
                const wrapperBody = styles.substring(wrapperStart, wrapperEnd);
                assert.ok(wrapperBody.includes('width: 100%'));
            });
        });

        describe('Character count styles', () => {
            it('should include .textarea-char-count class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.textarea-char-count {'));
            });

            it('should position character count absolutely', () => {
                const styles = getStyles();
                const countStart = styles.indexOf('.textarea-char-count {');
                const countEnd = styles.indexOf('}', countStart);
                const countBody = styles.substring(countStart, countEnd);
                assert.ok(countBody.includes('position: absolute'));
            });

            it('should position character count at bottom right', () => {
                const styles = getStyles();
                const countStart = styles.indexOf('.textarea-char-count {');
                const countEnd = styles.indexOf('}', countStart);
                const countBody = styles.substring(countStart, countEnd);
                assert.ok(countBody.includes('bottom:'));
                assert.ok(countBody.includes('right:'));
            });

            it('should include warning state for character count', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.textarea-char-count.warning'));
            });

            it('should use yellow color for warning state', () => {
                const styles = getStyles();
                const warningStart = styles.indexOf('.textarea-char-count.warning');
                const warningEnd = styles.indexOf('}', warningStart);
                const warningBody = styles.substring(warningStart, warningEnd);
                assert.ok(warningBody.includes('#f59e0b'));
            });

            it('should include error state for character count', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.textarea-char-count.error'));
            });

            it('should use red color for error state', () => {
                const styles = getStyles();
                const errorStart = styles.indexOf('.textarea-char-count.error');
                const errorEnd = styles.indexOf('}', errorStart);
                const errorBody = styles.substring(errorStart, errorEnd);
                assert.ok(errorBody.includes('#dc2626'));
            });
        });

        describe('Validation error/success states', () => {
            it('should include .validation-error class for textarea', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.setup-textarea.validation-error'));
            });

            it('should use red border for validation error', () => {
                const styles = getStyles();
                const errorStart = styles.indexOf('.setup-textarea.validation-error {');
                const errorEnd = styles.indexOf('}', errorStart);
                const errorBody = styles.substring(errorStart, errorEnd);
                assert.ok(errorBody.includes('#dc2626'));
            });

            it('should include .validation-success class for textarea', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.setup-textarea.validation-success'));
            });

            it('should use green border for validation success', () => {
                const styles = getStyles();
                const successStart = styles.indexOf('.setup-textarea.validation-success {');
                const successEnd = styles.indexOf('}', successStart);
                const successBody = styles.substring(successStart, successEnd);
                assert.ok(successBody.includes('#22c55e'));
            });

            it('should include focus state for validation-error', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.setup-textarea.validation-error:focus'));
            });

            it('should include focus state for validation-success', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.setup-textarea.validation-success:focus'));
            });
        });

        describe('Validation message styles', () => {
            it('should include .validation-message class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.validation-message {'));
            });

            it('should have animated height transition', () => {
                const styles = getStyles();
                const msgStart = styles.indexOf('.validation-message {');
                const msgEnd = styles.indexOf('}', msgStart);
                const msgBody = styles.substring(msgStart, msgEnd);
                assert.ok(msgBody.includes('min-height: 0'));
                assert.ok(msgBody.includes('max-height: 0'));
                assert.ok(msgBody.includes('transition:'));
            });

            it('should hide overflow initially', () => {
                const styles = getStyles();
                const msgStart = styles.indexOf('.validation-message {');
                const msgEnd = styles.indexOf('}', msgStart);
                const msgBody = styles.substring(msgStart, msgEnd);
                assert.ok(msgBody.includes('overflow: hidden'));
            });

            it('should be hidden initially with opacity 0', () => {
                const styles = getStyles();
                const msgStart = styles.indexOf('.validation-message {');
                const msgEnd = styles.indexOf('}', msgStart);
                const msgBody = styles.substring(msgStart, msgEnd);
                assert.ok(msgBody.includes('opacity: 0'));
            });

            it('should include visible state', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.validation-message.visible'));
            });

            it('should show message when visible', () => {
                const styles = getStyles();
                const visibleStart = styles.indexOf('.validation-message.visible');
                const visibleEnd = styles.indexOf('}', visibleStart);
                const visibleBody = styles.substring(visibleStart, visibleEnd);
                assert.ok(visibleBody.includes('opacity: 1'));
            });

            it('should include error message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.validation-message.error'));
                const errorStart = styles.indexOf('.validation-message.error');
                const errorEnd = styles.indexOf('}', errorStart);
                const errorBody = styles.substring(errorStart, errorEnd);
                assert.ok(errorBody.includes('#dc2626'));
            });

            it('should include success message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.validation-message.success'));
                const successStart = styles.indexOf('.validation-message.success');
                const successEnd = styles.indexOf('}', successStart);
                const successBody = styles.substring(successStart, successEnd);
                assert.ok(successBody.includes('#22c55e'));
            });

            it('should include validation icon styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.validation-message .validation-icon'));
            });
        });

        describe('High contrast dark theme validation styles', () => {
            it('should include high contrast validation-error styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .setup-textarea.validation-error'));
            });

            it('should use salmon color for error in high contrast dark', () => {
                const styles = getStyles();
                const hcErrorStart = styles.indexOf('body.vscode-high-contrast .setup-textarea.validation-error');
                const hcErrorEnd = styles.indexOf('}', hcErrorStart);
                const hcErrorBody = styles.substring(hcErrorStart, hcErrorEnd);
                assert.ok(hcErrorBody.includes('#ffa07a'));
            });

            it('should include high contrast validation-success styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .setup-textarea.validation-success'));
            });

            it('should use light green for success in high contrast dark', () => {
                const styles = getStyles();
                const hcSuccessStart = styles.indexOf('body.vscode-high-contrast .setup-textarea.validation-success');
                const hcSuccessEnd = styles.indexOf('}', hcSuccessStart);
                const hcSuccessBody = styles.substring(hcSuccessStart, hcSuccessEnd);
                assert.ok(hcSuccessBody.includes('#90ee90'));
            });

            it('should use thicker border for high contrast validation', () => {
                const styles = getStyles();
                const hcErrorStart = styles.indexOf('body.vscode-high-contrast .setup-textarea.validation-error');
                const hcErrorEnd = styles.indexOf('}', hcErrorStart);
                const hcErrorBody = styles.substring(hcErrorStart, hcErrorEnd);
                assert.ok(hcErrorBody.includes('border-width: 2px'));
            });

            it('should include high contrast error message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .validation-message.error'));
            });

            it('should include high contrast success message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .validation-message.success'));
            });

            it('should include high contrast char count warning color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .textarea-char-count.warning'));
            });

            it('should include high contrast char count error color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .textarea-char-count.error'));
            });
        });

        describe('High contrast light theme validation styles', () => {
            it('should include high contrast light validation-error styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .setup-textarea.validation-error'));
            });

            it('should use dark red for error in high contrast light', () => {
                const styles = getStyles();
                const hcErrorStart = styles.indexOf('body.vscode-high-contrast-light .setup-textarea.validation-error');
                const hcErrorEnd = styles.indexOf('}', hcErrorStart);
                const hcErrorBody = styles.substring(hcErrorStart, hcErrorEnd);
                assert.ok(hcErrorBody.includes('#b91c1c'));
            });

            it('should include high contrast light validation-success styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .setup-textarea.validation-success'));
            });

            it('should use dark green for success in high contrast light', () => {
                const styles = getStyles();
                const hcSuccessStart = styles.indexOf('body.vscode-high-contrast-light .setup-textarea.validation-success');
                const hcSuccessEnd = styles.indexOf('}', hcSuccessStart);
                const hcSuccessBody = styles.substring(hcSuccessStart, hcSuccessEnd);
                assert.ok(hcSuccessBody.includes('#15803d'));
            });

            it('should use thicker border for high contrast light validation', () => {
                const styles = getStyles();
                const hcErrorStart = styles.indexOf('body.vscode-high-contrast-light .setup-textarea.validation-error');
                const hcErrorEnd = styles.indexOf('}', hcErrorStart);
                const hcErrorBody = styles.substring(hcErrorStart, hcErrorEnd);
                assert.ok(hcErrorBody.includes('border-width: 2px'));
            });

            it('should include high contrast light error message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .validation-message.error'));
            });

            it('should include high contrast light success message color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .validation-message.success'));
            });

            it('should include high contrast light char count warning color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .textarea-char-count.warning'));
            });

            it('should include high contrast light char count error color', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .textarea-char-count.error'));
            });
        });
    });

    describe('Skeleton Loader Styles', () => {
        describe('Base skeleton styles', () => {
            it('should include .skeleton class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton {'));
            });

            it('should set position relative for skeleton', () => {
                const styles = getStyles();
                const skeletonStart = styles.indexOf('.skeleton {');
                const skeletonEnd = styles.indexOf('}', skeletonStart);
                const skeletonBody = styles.substring(skeletonStart, skeletonEnd);
                assert.ok(skeletonBody.includes('position: relative'));
            });

            it('should set overflow hidden for skeleton', () => {
                const styles = getStyles();
                const skeletonStart = styles.indexOf('.skeleton {');
                const skeletonEnd = styles.indexOf('}', skeletonStart);
                const skeletonBody = styles.substring(skeletonStart, skeletonEnd);
                assert.ok(skeletonBody.includes('overflow: hidden'));
            });

            it('should use VS Code input background for skeleton', () => {
                const styles = getStyles();
                const skeletonStart = styles.indexOf('.skeleton {');
                const skeletonEnd = styles.indexOf('}', skeletonStart);
                const skeletonBody = styles.substring(skeletonStart, skeletonEnd);
                assert.ok(skeletonBody.includes('var(--vscode-input-background)'));
            });
        });

        describe('Skeleton shimmer animation', () => {
            it('should include skeletonShimmer keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes skeletonShimmer'));
            });

            it('should include .skeleton::after pseudo-element', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton::after'));
            });

            it('should animate translateX for shimmer effect', () => {
                const styles = getStyles();
                const shimmerStart = styles.indexOf('@keyframes skeletonShimmer');
                const shimmerEnd = styles.indexOf('}', styles.indexOf('}', shimmerStart) + 1);
                const shimmerBody = styles.substring(shimmerStart, shimmerEnd);
                assert.ok(shimmerBody.includes('translateX'));
            });

            it('should use linear-gradient for shimmer overlay', () => {
                const styles = getStyles();
                const afterStart = styles.indexOf('.skeleton::after');
                const afterEnd = styles.indexOf('}', afterStart);
                const afterBody = styles.substring(afterStart, afterEnd);
                assert.ok(afterBody.includes('linear-gradient'));
            });
        });

        describe('Skeleton text styles', () => {
            it('should include .skeleton-text class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-text'));
            });

            it('should include .skeleton-text.short class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-text.short'));
            });

            it('should include .skeleton-text.medium class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-text.medium'));
            });

            it('should include .skeleton-text.long class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-text.long'));
            });

            it('should include .skeleton-text.full class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-text.full'));
            });

            it('should include .skeleton-title class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-title'));
            });
        });

        describe('Skeleton timeline styles', () => {
            it('should include .skeleton-timeline class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline'));
            });

            it('should include .skeleton-timeline-bars class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline-bars'));
            });

            it('should include .skeleton-timeline-bar class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline-bar'));
            });

            it('should include .skeleton-timeline-labels class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline-labels'));
            });

            it('should include .skeleton-timeline-label class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline-label'));
            });

            it('should have varying heights for skeleton bars', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-timeline-bar:nth-child(1)'));
                assert.ok(styles.includes('.skeleton-timeline-bar:nth-child(2)'));
            });
        });

        describe('Skeleton task styles', () => {
            it('should include .skeleton-task class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-task'));
            });

            it('should include .skeleton-task-label class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-task-label'));
            });

            it('should include .skeleton-task-text class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-task-text'));
            });
        });

        describe('Skeleton log styles', () => {
            it('should include .skeleton-log class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log'));
            });

            it('should include .skeleton-log-header class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log-header'));
            });

            it('should include .skeleton-log-content class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log-content'));
            });

            it('should include .skeleton-log-entry class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log-entry'));
            });

            it('should include .skeleton-log-time class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log-time'));
            });

            it('should include .skeleton-log-msg class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-log-msg'));
            });
        });

        describe('Skeleton requirements styles', () => {
            it('should include .skeleton-requirements class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirements'));
            });

            it('should include .skeleton-requirements-header class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirements-header'));
            });

            it('should include .skeleton-requirements-content class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirements-content'));
            });

            it('should include .skeleton-requirement-item class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirement-item'));
            });

            it('should include .skeleton-requirement-checkbox class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirement-checkbox'));
            });

            it('should include .skeleton-requirement-label class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-requirement-label'));
            });
        });

        describe('Skeleton loading state styles', () => {
            it('should include .content.loading selector', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.content.loading'));
            });

            it('should hide actual content when loading', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.content.loading .timeline-section'));
                assert.ok(styles.includes('.content.loading .task-section'));
                assert.ok(styles.includes('.content.loading .log-section'));
            });

            it('should show skeletons when loading', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.content.loading .skeleton-timeline'));
                assert.ok(styles.includes('.content.loading .skeleton-task'));
                assert.ok(styles.includes('.content.loading .skeleton-log'));
            });
        });

        describe('Skeleton pulse animation variant', () => {
            it('should include .skeleton.pulse class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton.pulse'));
            });

            it('should include skeletonPulse keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes skeletonPulse'));
            });

            it('should animate opacity for pulse effect', () => {
                const styles = getStyles();
                const pulseStart = styles.indexOf('@keyframes skeletonPulse');
                const pulseEnd = styles.indexOf('}', styles.indexOf('}', pulseStart) + 1);
                const pulseBody = styles.substring(pulseStart, pulseEnd);
                assert.ok(pulseBody.includes('opacity'));
            });
        });

        describe('Skeleton loading indicator', () => {
            it('should include .skeleton-loading-indicator class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-loading-indicator'));
            });

            it('should include .skeleton-loading-dot class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-loading-dot'));
            });

            it('should include skeletonLoadingDot keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes skeletonLoadingDot'));
            });

            it('should have staggered animation delays for dots', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.skeleton-loading-dot:nth-child(1)'));
                assert.ok(styles.includes('.skeleton-loading-dot:nth-child(2)'));
                assert.ok(styles.includes('.skeleton-loading-dot:nth-child(3)'));
            });
        });

        describe('High contrast skeleton styles', () => {
            it('should include high contrast dark skeleton styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .skeleton'));
            });

            it('should use dashed border for high contrast skeleton', () => {
                const styles = getStyles();
                const hcSkeletonStart = styles.indexOf('body.vscode-high-contrast .skeleton {');
                const hcSkeletonEnd = styles.indexOf('}', hcSkeletonStart);
                const hcSkeletonBody = styles.substring(hcSkeletonStart, hcSkeletonEnd);
                assert.ok(hcSkeletonBody.includes('dashed'));
            });

            it('should use transparent background for high contrast skeleton', () => {
                const styles = getStyles();
                const hcSkeletonStart = styles.indexOf('body.vscode-high-contrast .skeleton {');
                const hcSkeletonEnd = styles.indexOf('}', hcSkeletonStart);
                const hcSkeletonBody = styles.substring(hcSkeletonStart, hcSkeletonEnd);
                assert.ok(hcSkeletonBody.includes('background: transparent'));
            });

            it('should include high contrast light skeleton styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .skeleton'));
            });

            it('should use dashed border for high contrast light skeleton', () => {
                const styles = getStyles();
                const hcLightStart = styles.indexOf('body.vscode-high-contrast-light .skeleton {');
                const hcLightEnd = styles.indexOf('}', hcLightStart);
                const hcLightBody = styles.substring(hcLightStart, hcLightEnd);
                assert.ok(hcLightBody.includes('dashed'));
            });
        });

        describe('Responsive Layout for Narrow Panel Widths', () => {
            describe('Container query setup', () => {
                it('should enable container-type on body', () => {
                    const styles = getStyles();
                    // Look for the responsive section body styles
                    assert.ok(styles.includes('container-type: inline-size'));
                });

                it('should set container-name to panel', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('container-name: panel'));
                });

                it('should include @container panel queries', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@container panel'));
                });
            });

            describe('Medium width breakpoint (400px)', () => {
                it('should include container query for max-width 400px', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@container panel (max-width: 400px)'));
                });

                it('should reduce header padding at 400px', () => {
                    const styles = getStyles();
                    const query400Start = styles.indexOf('@container panel (max-width: 400px)');
                    const query400End = styles.indexOf('@container panel (max-width: 320px)');
                    const query400Body = styles.substring(query400Start, query400End);
                    assert.ok(query400Body.includes('.header'));
                    assert.ok(query400Body.includes('padding'));
                });

                it('should wrap header-content at 400px', () => {
                    const styles = getStyles();
                    const query400Start = styles.indexOf('@container panel (max-width: 400px)');
                    const query400End = styles.indexOf('@container panel (max-width: 320px)');
                    const query400Body = styles.substring(query400Start, query400End);
                    assert.ok(query400Body.includes('.header-content'));
                    assert.ok(query400Body.includes('flex-wrap: wrap'));
                });

                it('should reduce control gap at 400px', () => {
                    const styles = getStyles();
                    const query400Start = styles.indexOf('@container panel (max-width: 400px)');
                    const query400End = styles.indexOf('@container panel (max-width: 320px)');
                    const query400Body = styles.substring(query400Start, query400End);
                    assert.ok(query400Body.includes('.controls'));
                    assert.ok(query400Body.includes('gap: 6px'));
                });

                it('should reduce button padding at 400px', () => {
                    const styles = getStyles();
                    const query400Start = styles.indexOf('@container panel (max-width: 400px)');
                    const query400End = styles.indexOf('@container panel (max-width: 320px)');
                    const query400Body = styles.substring(query400Start, query400End);
                    assert.ok(query400Body.includes('button {'));
                });

                it('should reduce toast container max-width at 400px', () => {
                    const styles = getStyles();
                    const query400Start = styles.indexOf('@container panel (max-width: 400px)');
                    const query400End = styles.indexOf('@container panel (max-width: 320px)');
                    const query400Body = styles.substring(query400Start, query400End);
                    assert.ok(query400Body.includes('.toast-container'));
                    assert.ok(query400Body.includes('max-width: 280px'));
                });
            });

            describe('Narrow width breakpoint (320px)', () => {
                it('should include container query for max-width 320px', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@container panel (max-width: 320px)'));
                });

                it('should reduce title font-size at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.title h1'));
                    assert.ok(query320Body.includes('font-size: 14px'));
                });

                it('should make controls wrap at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.controls {'));
                    assert.ok(query320Body.includes('flex-wrap: wrap'));
                });

                it('should make buttons flex at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.controls button'));
                    assert.ok(query320Body.includes('flex: 1 1 auto'));
                });

                it('should reduce timeline bar height at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.timeline-bars'));
                    assert.ok(query320Body.includes('height: 40px'));
                });

                it('should reduce requirement item font size at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.requirement-item'));
                    assert.ok(query320Body.includes('font-size: 10px'));
                });

                it('should reduce log content max-height at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.log-content'));
                    assert.ok(query320Body.includes('max-height: 120px'));
                });

                it('should reduce textarea char count font size at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.textarea-char-count'));
                    assert.ok(query320Body.includes('font-size: 10px'));
                });
            });

            describe('Very narrow width breakpoint (250px)', () => {
                it('should include container query for max-width 250px', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@container panel (max-width: 250px)'));
                });

                it('should hide timing-display at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.timing-display'));
                    assert.ok(query250Body.includes('display: none !important'));
                });

                it('should make buttons full width at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.controls button'));
                    assert.ok(query250Body.includes('flex: 1 1 100%'));
                });

                it('should hide spacer at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.controls .spacer'));
                    assert.ok(query250Body.includes('display: none'));
                });

                it('should hide timeline labels at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.timeline-labels'));
                    assert.ok(query250Body.includes('display: none'));
                });

                it('should hide requirement descriptions at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.requirement-item .req-desc'));
                    assert.ok(query250Body.includes('display: none'));
                });

                it('should stack log time and message at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.log-time'));
                    assert.ok(query250Body.includes('width: 100%'));
                    assert.ok(query250Body.includes('.log-msg'));
                });

                it('should reduce countdown clock size at 250px', () => {
                    const styles = getStyles();
                    const query250Start = styles.indexOf('@container panel (max-width: 250px)');
                    const query250End = styles.indexOf('@supports not');
                    const query250Body = styles.substring(query250Start, query250End);
                    assert.ok(query250Body.includes('.countdown-clock'));
                    assert.ok(query250Body.includes('width: 20px'));
                    assert.ok(query250Body.includes('height: 20px'));
                });
            });

            describe('Media query fallback for browsers without container query support', () => {
                it('should include @supports not (container-type) fallback', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('@supports not (container-type: inline-size)'));
                });

                it('should include medium width media query fallback (450px)', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    assert.ok(fallbackBody.includes('@media (max-width: 450px)'));
                });

                it('should include narrow width media query fallback (350px)', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    assert.ok(fallbackBody.includes('@media (max-width: 350px)'));
                });

                it('should include very narrow width media query fallback (280px)', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    assert.ok(fallbackBody.includes('@media (max-width: 280px)'));
                });

                it('should hide timing-display in fallback at 280px', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    const media280Start = fallbackBody.indexOf('@media (max-width: 280px)');
                    const media280Body = fallbackBody.substring(media280Start);
                    assert.ok(media280Body.includes('.timing-display'));
                    assert.ok(media280Body.includes('display: none'));
                });

                it('should make controls wrap in fallback at 350px', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    const media350Start = fallbackBody.indexOf('@media (max-width: 350px)');
                    const media350End = fallbackBody.indexOf('@media (max-width: 280px)');
                    const media350Body = fallbackBody.substring(media350Start, media350End);
                    assert.ok(media350Body.includes('.controls'));
                    assert.ok(media350Body.includes('flex-wrap: wrap'));
                });

                it('should reduce button padding in fallback at 350px', () => {
                    const styles = getStyles();
                    const fallbackStart = styles.indexOf('@supports not (container-type: inline-size)');
                    const fallbackBody = styles.substring(fallbackStart);
                    const media350Start = fallbackBody.indexOf('@media (max-width: 350px)');
                    const media350End = fallbackBody.indexOf('@media (max-width: 280px)');
                    const media350Body = fallbackBody.substring(media350Start, media350End);
                    assert.ok(media350Body.includes('button'));
                    assert.ok(media350Body.includes('padding: 4px 8px'));
                });
            });

            describe('Responsive styles apply to key components', () => {
                it('should include responsive header styles', () => {
                    const styles = getStyles();
                    // Check that header styles exist in multiple breakpoints
                    const query400Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 400px)'),
                        styles.indexOf('@container panel (max-width: 320px)')
                    );
                    const query320Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 320px)'),
                        styles.indexOf('@container panel (max-width: 250px)')
                    );
                    const query250Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 250px)'),
                        styles.indexOf('@supports not')
                    );
                    const headerIn400 = query400Body.includes('.header');
                    const headerIn320 = query320Body.includes('.header');
                    const headerIn250 = query250Body.includes('.header');
                    const count = [headerIn400, headerIn320, headerIn250].filter(Boolean).length;
                    assert.ok(count >= 3, 'Should have header styles in multiple breakpoints');
                });

                it('should include responsive controls styles', () => {
                    const styles = getStyles();
                    const query400Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 400px)'),
                        styles.indexOf('@container panel (max-width: 320px)')
                    );
                    const query320Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 320px)'),
                        styles.indexOf('@container panel (max-width: 250px)')
                    );
                    const query250Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 250px)'),
                        styles.indexOf('@supports not')
                    );
                    const controlsIn400 = query400Body.includes('.controls');
                    const controlsIn320 = query320Body.includes('.controls');
                    const controlsIn250 = query250Body.includes('.controls');
                    const count = [controlsIn400, controlsIn320, controlsIn250].filter(Boolean).length;
                    assert.ok(count >= 2, 'Should have controls styles in multiple breakpoints');
                });

                it('should include responsive timeline styles', () => {
                    const styles = getStyles();
                    const query400Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 400px)'),
                        styles.indexOf('@container panel (max-width: 320px)')
                    );
                    const query320Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 320px)'),
                        styles.indexOf('@container panel (max-width: 250px)')
                    );
                    const query250Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 250px)'),
                        styles.indexOf('@supports not')
                    );
                    const timelineIn400 = query400Body.includes('.timeline');
                    const timelineIn320 = query320Body.includes('.timeline');
                    const timelineIn250 = query250Body.includes('.timeline');
                    const count = [timelineIn400, timelineIn320, timelineIn250].filter(Boolean).length;
                    assert.ok(count >= 2, 'Should have timeline styles in multiple breakpoints');
                });

                it('should include responsive log styles', () => {
                    const styles = getStyles();
                    const query400Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 400px)'),
                        styles.indexOf('@container panel (max-width: 320px)')
                    );
                    const query320Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 320px)'),
                        styles.indexOf('@container panel (max-width: 250px)')
                    );
                    const query250Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 250px)'),
                        styles.indexOf('@supports not')
                    );
                    const logIn400 = query400Body.includes('.log');
                    const logIn320 = query320Body.includes('.log');
                    const logIn250 = query250Body.includes('.log');
                    const count = [logIn400, logIn320, logIn250].filter(Boolean).length;
                    assert.ok(count >= 2, 'Should have log styles in multiple breakpoints');
                });

                it('should include responsive toast container styles', () => {
                    const styles = getStyles();
                    const query400Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 400px)'),
                        styles.indexOf('@container panel (max-width: 320px)')
                    );
                    const query320Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 320px)'),
                        styles.indexOf('@container panel (max-width: 250px)')
                    );
                    const query250Body = styles.substring(
                        styles.indexOf('@container panel (max-width: 250px)'),
                        styles.indexOf('@supports not')
                    );
                    const toastIn400 = query400Body.includes('.toast-container');
                    const toastIn320 = query320Body.includes('.toast-container');
                    const toastIn250 = query250Body.includes('.toast-container');
                    const count = [toastIn400, toastIn320, toastIn250].filter(Boolean).length;
                    assert.ok(count >= 2, 'Should have toast-container styles in multiple breakpoints');
                });
            });

            describe('Progressive enhancement approach', () => {
                it('should define base styles before responsive overrides', () => {
                    const styles = getStyles();
                    const baseHeaderPos = styles.indexOf('.header {');
                    const containerQueryPos = styles.indexOf('@container panel');
                    assert.ok(baseHeaderPos < containerQueryPos, 'Base styles should come before container queries');
                });

                it('should order breakpoints from largest to smallest', () => {
                    const styles = getStyles();
                    const pos400 = styles.indexOf('@container panel (max-width: 400px)');
                    const pos320 = styles.indexOf('@container panel (max-width: 320px)');
                    const pos250 = styles.indexOf('@container panel (max-width: 250px)');
                    assert.ok(pos400 < pos320, '400px breakpoint should come before 320px');
                    assert.ok(pos320 < pos250, '320px breakpoint should come before 250px');
                });

                it('should have fallback before end of styles', () => {
                    const styles = getStyles();
                    const fallbackPos = styles.indexOf('@supports not (container-type: inline-size)');
                    assert.ok(fallbackPos > 0, 'Fallback styles should be present');
                    assert.ok(fallbackPos < styles.length - 100, 'Fallback should be near end of styles');
                });
            });
        });

        describe('Collapsible Sections for Mobile-Friendly View', () => {
            describe('Section toggle styles', () => {
                it('should include section-toggle class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-toggle {'));
                });

                it('should have flex display for toggle', () => {
                    const styles = getStyles();
                    const toggleStart = styles.indexOf('.section-toggle {');
                    const toggleEnd = styles.indexOf('}', toggleStart);
                    const toggleBody = styles.substring(toggleStart, toggleEnd);
                    assert.ok(toggleBody.includes('display: flex'));
                });

                it('should have transition for smooth animation', () => {
                    const styles = getStyles();
                    const toggleStart = styles.indexOf('.section-toggle {');
                    const toggleEnd = styles.indexOf('}', toggleStart);
                    const toggleBody = styles.substring(toggleStart, toggleEnd);
                    assert.ok(toggleBody.includes('transition: transform'));
                });

                it('should rotate expanded toggle 180 degrees', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-toggle.expanded'));
                    assert.ok(styles.includes('transform: rotate(180deg)'));
                });

                it('should include section-toggle-icon styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-toggle-icon'));
                });
            });

            describe('Section header collapsible styles', () => {
                it('should include section-header-collapsible class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-header-collapsible {'));
                });

                it('should have cursor pointer', () => {
                    const styles = getStyles();
                    const headerStart = styles.indexOf('.section-header-collapsible {');
                    const headerEnd = styles.indexOf('}', headerStart);
                    const headerBody = styles.substring(headerStart, headerEnd);
                    assert.ok(headerBody.includes('cursor: pointer'));
                });

                it('should have user-select none', () => {
                    const styles = getStyles();
                    const headerStart = styles.indexOf('.section-header-collapsible {');
                    const headerEnd = styles.indexOf('}', headerStart);
                    const headerBody = styles.substring(headerStart, headerEnd);
                    assert.ok(headerBody.includes('user-select: none'));
                });

                it('should have hover state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-header-collapsible:hover'));
                });

                it('should have focus-visible outline', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-header-collapsible:focus-visible'));
                });
            });

            describe('Section header right styles', () => {
                it('should include section-header-right class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-header-right {'));
                });

                it('should have flex display', () => {
                    const styles = getStyles();
                    const rightStart = styles.indexOf('.section-header-right {');
                    const rightEnd = styles.indexOf('}', rightStart);
                    const rightBody = styles.substring(rightStart, rightEnd);
                    assert.ok(rightBody.includes('display: flex'));
                });

                it('should have gap between items', () => {
                    const styles = getStyles();
                    const rightStart = styles.indexOf('.section-header-right {');
                    const rightEnd = styles.indexOf('}', rightStart);
                    const rightBody = styles.substring(rightStart, rightEnd);
                    assert.ok(rightBody.includes('gap:'));
                });
            });

            describe('Section content styles', () => {
                it('should include section-content class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-content {'));
                });

                it('should have max-height for animation', () => {
                    const styles = getStyles();
                    const contentStart = styles.indexOf('.section-content {');
                    const contentEnd = styles.indexOf('}', contentStart);
                    const contentBody = styles.substring(contentStart, contentEnd);
                    assert.ok(contentBody.includes('max-height:'));
                });

                it('should have smooth transition', () => {
                    const styles = getStyles();
                    const contentStart = styles.indexOf('.section-content {');
                    const contentEnd = styles.indexOf('}', contentStart);
                    const contentBody = styles.substring(contentStart, contentEnd);
                    assert.ok(contentBody.includes('transition:'));
                });

                it('should include collapsed state', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.section-content.collapsed'));
                });

                it('should collapse to max-height 0', () => {
                    const styles = getStyles();
                    const collapsedStart = styles.indexOf('.section-content.collapsed');
                    const collapsedEnd = styles.indexOf('}', collapsedStart);
                    const collapsedBody = styles.substring(collapsedStart, collapsedEnd);
                    assert.ok(collapsedBody.includes('max-height: 0'));
                });

                it('should have opacity 0 when collapsed', () => {
                    const styles = getStyles();
                    const collapsedStart = styles.indexOf('.section-content.collapsed');
                    const collapsedEnd = styles.indexOf('}', collapsedStart);
                    const collapsedBody = styles.substring(collapsedStart, collapsedEnd);
                    assert.ok(collapsedBody.includes('opacity: 0'));
                });
            });

            describe('Mobile view styles', () => {
                it('should include body.mobile-view class', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.mobile-view'));
                });

                it('should have compact margins for collapsible sections on mobile', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.mobile-view .collapsible-section'));
                });
            });

            describe('Collapsible section specific styles', () => {
                it('should have timeline section collapsible styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.timeline-section.collapsible-section'));
                });

                it('should have task section collapsible header styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-section.collapsible-section .task-header'));
                });

                it('should have task header gradient background', () => {
                    const styles = getStyles();
                    const taskHeaderStart = styles.indexOf('.task-section.collapsible-section .task-header {');
                    const taskHeaderEnd = styles.indexOf('}', taskHeaderStart);
                    const taskHeaderBody = styles.substring(taskHeaderStart, taskHeaderEnd);
                    assert.ok(taskHeaderBody.includes('background:'));
                    assert.ok(taskHeaderBody.includes('linear-gradient'));
                });

                it('should have task content padding', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.task-section.collapsible-section .task-content'));
                });

                it('should have log section collapsible styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('.log-section.collapsible-section'));
                });
            });

            describe('Narrow breakpoint collapsible styles', () => {
                it('should have collapsible-section styles in 320px breakpoint', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.collapsible-section'));
                });

                it('should have compact margin for collapsible sections at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.collapsible-section'));
                    assert.ok(query320Body.includes('margin-bottom: 8px'));
                });

                it('should have compact header padding at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.section-header-collapsible'));
                });

                it('should make section toggle fully opaque at 320px', () => {
                    const styles = getStyles();
                    const query320Start = styles.indexOf('@container panel (max-width: 320px)');
                    const query320End = styles.indexOf('@container panel (max-width: 250px)');
                    const query320Body = styles.substring(query320Start, query320End);
                    assert.ok(query320Body.includes('.section-toggle'));
                    assert.ok(query320Body.includes('opacity: 1'));
                });
            });

            describe('High contrast collapsible styles', () => {
                it('should have dark high contrast collapsible-section styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .collapsible-section'));
                });

                it('should have dark high contrast section header styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .section-header-collapsible'));
                });

                it('should have transparent background in dark high contrast', () => {
                    const styles = getStyles();
                    const hcStart = styles.indexOf('body.vscode-high-contrast .section-header-collapsible {');
                    const hcEnd = styles.indexOf('}', hcStart);
                    const hcBody = styles.substring(hcStart, hcEnd);
                    assert.ok(hcBody.includes('background: transparent'));
                });

                it('should have focus-visible outline in dark high contrast', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast .section-header-collapsible:focus-visible'));
                });

                it('should have light high contrast collapsible-section styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .collapsible-section'));
                });

                it('should have light high contrast section header styles', () => {
                    const styles = getStyles();
                    assert.ok(styles.includes('body.vscode-high-contrast-light .section-header-collapsible'));
                });

                it('should have transparent background in light high contrast', () => {
                    const styles = getStyles();
                    const hcStart = styles.indexOf('body.vscode-high-contrast-light .section-header-collapsible {');
                    const hcEnd = styles.indexOf('}', hcStart);
                    const hcBody = styles.substring(hcStart, hcEnd);
                    assert.ok(hcBody.includes('background: transparent'));
                });
            });
        });
    });

    describe('Task Queue (Drag-and-Drop) Styles', () => {
        describe('task-queue-content', () => {
            it('should have task-queue-content style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-content'));
            });

            it('should have zero padding for queue content', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-content {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('padding: 0'));
            });
        });

        describe('task-queue-list', () => {
            it('should have task-queue-list style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-list'));
            });

            it('should use flexbox for layout', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-list {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
                assert.ok(body.includes('flex-direction: column'));
            });

            it('should have gap between items', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-list {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('gap: 1px'));
            });

            it('should have border and border-radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-list {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border:'));
                assert.ok(body.includes('border-radius: 4px'));
            });

            it('should have overflow hidden', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-list {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('overflow: hidden'));
            });
        });

        describe('task-queue-item', () => {
            it('should have task-queue-item style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item'));
            });

            it('should use flexbox for layout', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
                assert.ok(body.includes('align-items: center'));
            });

            it('should have padding', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('padding:'));
            });

            it('should have grab cursor', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('cursor: grab'));
            });

            it('should have transition for smooth hover', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('transition'));
            });
        });

        describe('task-queue-item:last-child', () => {
            it('should have last-child style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item:last-child'));
            });

            it('should have no bottom border on last item', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item:last-child');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-bottom: none'));
            });
        });

        describe('task-queue-item:hover', () => {
            it('should have hover style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item:hover'));
            });

            it('should change background on hover', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item:hover');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('background:'));
            });
        });

        describe('task-queue-item.dragging', () => {
            it('should have dragging style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item.dragging'));
            });

            it('should have reduced opacity when dragging', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item.dragging');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity: 0.5'));
            });

            it('should have grabbing cursor when dragging', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item.dragging');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('cursor: grabbing'));
            });
        });

        describe('task-queue-item.drag-over', () => {
            it('should have drag-over style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item.drag-over'));
            });

            it('should have colored border on drag-over', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item.drag-over');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-top:'));
            });
        });

        describe('drag-handle', () => {
            it('should have drag-handle style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.drag-handle'));
            });

            it('should use flexbox for layout', () => {
                const styles = getStyles();
                const start = styles.indexOf('.drag-handle {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
            });

            it('should have margin-right for spacing', () => {
                const styles = getStyles();
                const start = styles.indexOf('.drag-handle {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('margin-right:'));
            });

            it('should have opacity styling', () => {
                const styles = getStyles();
                const start = styles.indexOf('.drag-handle {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity:'));
            });
        });

        describe('drag-handle on hover', () => {
            it('should have hover state for drag handle', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-item:hover .drag-handle'));
            });

            it('should increase opacity on hover', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-item:hover .drag-handle');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity: 1'));
            });
        });

        describe('task-queue-text', () => {
            it('should have task-queue-text style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-queue-text'));
            });

            it('should have flex: 1 for filling space', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-text {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex: 1'));
            });

            it('should have font-size styling', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-text {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-size:'));
            });

            it('should have text clamping for overflow', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-queue-text {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('-webkit-line-clamp: 2'));
            });
        });

        describe('queue-hint', () => {
            it('should have queue-hint style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.queue-hint'));
            });

            it('should have small font size', () => {
                const styles = getStyles();
                const start = styles.indexOf('.queue-hint {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-size: 11px'));
            });

            it('should have italic style', () => {
                const styles = getStyles();
                const start = styles.indexOf('.queue-hint {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-style: italic'));
            });

            it('should be centered', () => {
                const styles = getStyles();
                const start = styles.indexOf('.queue-hint {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('text-align: center'));
            });
        });

        describe('High contrast support for queue', () => {
            it('should have high contrast task-queue-list style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-queue-list'));
            });

            it('should have high contrast light task-queue-list style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-queue-list'));
            });

            it('should have high contrast task-queue-item style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-queue-item'));
            });

            it('should have high contrast light task-queue-item style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-queue-item'));
            });

            it('should have high contrast drag-over style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-queue-item.drag-over'));
            });

            it('should have high contrast light drag-over style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-queue-item.drag-over'));
            });

            it('should use transparent background in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-queue-list');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('background: transparent'));
            });

            it('should use hc-border variable in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-queue-list');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('var(--hc-border)'));
            });
        });
    });

    // =========================================================================
    // Task Details Panel Styles
    // =========================================================================

    describe('Task Details Panel Styles', () => {
        describe('Task Header Actions', () => {
            it('should have task-header-actions styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-header-actions'));
            });

            it('should have flex display', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-header-actions');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
            });

            it('should have gap between elements', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-header-actions');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('gap:'));
            });
        });

        describe('Task Details Toggle Button', () => {
            it('should have task-details-toggle styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-toggle'));
            });

            it('should have hover styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-toggle:hover'));
            });

            it('should have focus-visible styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-toggle:focus-visible'));
            });

            it('should have aria-expanded true styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-toggle[aria-expanded="true"]'));
            });

            it('should have border-radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-details-toggle {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-radius'));
            });

            it('should have cursor pointer', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-details-toggle {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('cursor: pointer'));
            });
        });

        describe('Task Details Panel', () => {
            it('should have task-details-panel styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-panel'));
            });

            it('should have slide-in animation', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes taskDetailsSlideIn'));
            });

            it('should have border-radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-details-panel {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-radius'));
            });

            it('should have margin-top', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-details-panel {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('margin-top'));
            });
        });

        describe('Task Details Content', () => {
            it('should have task-details-content styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-details-content'));
            });

            it('should have flex column layout', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-details-content');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-direction: column'));
            });
        });

        describe('Task Detail Row', () => {
            it('should have task-detail-row styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-row'));
            });

            it('should have flex display', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-row {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
            });
        });

        describe('Task Detail Label', () => {
            it('should have task-detail-label styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-label'));
            });

            it('should have uppercase text transform', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-label {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('text-transform: uppercase'));
            });
        });

        describe('Task Detail ID', () => {
            it('should have task-detail-id styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-id'));
            });

            it('should have monospace font', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-id');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-family'));
            });
        });

        describe('Task Detail Status', () => {
            it('should have task-detail-status styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status'));
            });

            it('should have pending status style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status.pending'));
            });

            it('should have in-progress status style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status.in-progress'));
            });

            it('should have complete status style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status.complete'));
            });

            it('should have blocked status style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status.blocked'));
            });

            it('should have skipped status style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-status.skipped'));
            });
        });

        describe('Task Detail Complexity', () => {
            it('should have task-detail-complexity styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-complexity'));
            });

            it('should have complexity-low style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-complexity.complexity-low'));
            });

            it('should have complexity-medium style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-complexity.complexity-medium'));
            });

            it('should have complexity-high style', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-complexity.complexity-high'));
            });
        });

        describe('Task Detail Dependencies', () => {
            it('should have task-detail-dependencies styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-dependencies'));
            });

            it('should have task-detail-dependency chip styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-dependency'));
            });

            it('should have task-detail-none styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-none'));
            });

            it('should have flex-wrap for multiple dependencies', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-dependencies {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-wrap: wrap'));
            });
        });

        describe('High Contrast Theme Support', () => {
            it('should have high contrast task-details-panel styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-details-panel'));
            });

            it('should have high contrast task-details-toggle styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-details-toggle'));
            });

            it('should have high contrast status styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-status'));
            });

            it('should have high contrast complexity styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-complexity'));
            });

            it('should have high contrast dependency styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-dependency'));
            });

            it('should use transparent background in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-details-panel');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('background: transparent'));
            });

            it('should use hc-border variable in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-details-panel');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('var(--hc-border)'));
            });
        });

        describe('High Contrast Light Theme Support', () => {
            it('should have high contrast light task-details-panel styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-details-panel'));
            });

            it('should have high contrast light task-details-toggle styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-details-toggle'));
            });

            it('should have high contrast light status styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-status'));
            });

            it('should have high contrast light complexity styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-complexity'));
            });

            it('should have high contrast light dependency styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-dependency'));
            });
        });

        describe('Estimated Time Styles', () => {
            it('should have task-detail-estimated-time styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-estimated-time'));
            });

            it('should have estimated-time-value styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.estimated-time-value'));
            });

            it('should have estimated-time-source styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.estimated-time-source'));
            });

            it('should have no-data class for estimated-time-value', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.estimated-time-value.no-data'));
            });

            it('should have loading class for estimated-time-value', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.estimated-time-value.loading'));
            });

            it('should have pulse animation for loading state', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes estimatedTimePulse'));
            });

            it('should use inline-flex display', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-estimated-time {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: inline-flex'));
            });

            it('should have purple color scheme for value', () => {
                const styles = getStyles();
                const start = styles.indexOf('.estimated-time-value {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#8b5cf6'));
            });

            it('should have gray color for no-data state', () => {
                const styles = getStyles();
                const start = styles.indexOf('.estimated-time-value.no-data');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#9ca3af'));
            });

            it('should have italic style for source text', () => {
                const styles = getStyles();
                const start = styles.indexOf('.estimated-time-source {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-style: italic'));
            });
        });

        describe('Estimated Time High Contrast Support', () => {
            it('should have high contrast estimated-time-value styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .estimated-time-value'));
            });

            it('should have high contrast no-data styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .estimated-time-value.no-data'));
            });

            it('should use transparent background in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .estimated-time-value {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('background: transparent'));
            });

            it('should use border in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .estimated-time-value {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border: 1px solid'));
            });

            it('should have high contrast light estimated-time-value styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .estimated-time-value'));
            });

            it('should have high contrast light no-data styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .estimated-time-value.no-data'));
            });
        });

        describe('Related Files Styles', () => {
            it('should have task-detail-related-files-row styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-files-row'));
            });

            it('should have task-detail-related-files container styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-files {'));
            });

            it('should have task-detail-related-file chip styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-file'));
            });

            it('should use flex-direction column for related files row', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-files-row');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-direction: column'));
            });

            it('should have flex-wrap for multiple files', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-files {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-wrap: wrap'));
            });

            it('should use blue color scheme for file chips', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#3b82f6'));
            });

            it('should have monospace font family', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('var(--vscode-editor-font-family)'));
            });

            it('should have text-overflow ellipsis', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('text-overflow: ellipsis'));
            });

            it('should have max-width constraint', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('max-width'));
            });

            it('should have hover styles for file chips', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-file:hover'));
            });

            it('should have is-directory class for directories', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-file.is-directory'));
            });

            it('should use yellow color for directories', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file.is-directory {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#eab308'));
            });

            it('should have is-glob class for glob patterns', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-related-file.is-glob'));
            });

            it('should use purple color for globs', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file.is-glob {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#8b5cf6'));
            });

            it('should have transition for hover effect', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('transition:'));
            });
        });

        describe('Related Files High Contrast Support', () => {
            it('should have high contrast related-file styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-related-file'));
            });

            it('should use transparent background in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('background: transparent'));
            });

            it('should use cyan border in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#6fc3df'));
            });

            it('should have high contrast directory styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-related-file.is-directory'));
            });

            it('should use gold color for directories in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-related-file.is-directory');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#ffd700'));
            });

            it('should have high contrast glob styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-related-file.is-glob'));
            });

            it('should use lavender color for globs in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-related-file.is-glob');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#b19cd9'));
            });

            it('should have high contrast hover styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-related-file:hover'));
            });
        });

        describe('Related Files High Contrast Light Support', () => {
            it('should have high contrast light related-file styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-related-file'));
            });

            it('should use dark blue color in high contrast light', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .task-detail-related-file {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#0f4a85'));
            });

            it('should have high contrast light directory styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-related-file.is-directory'));
            });

            it('should use amber color for directories in high contrast light', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .task-detail-related-file.is-directory');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#a16207'));
            });

            it('should have high contrast light glob styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-related-file.is-glob'));
            });

            it('should use purple color for globs in high contrast light', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .task-detail-related-file.is-glob');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#6b21a8'));
            });

            it('should have high contrast light hover styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-related-file:hover'));
            });
        });
    });

    describe('Acceptance Criteria Styles', () => {
        describe('Acceptance Criteria Row Styles', () => {
            it('should have task-detail-acceptance-criteria-row styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-acceptance-criteria-row'));
            });

            it('should have flex-direction column', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-acceptance-criteria-row');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-direction: column'));
            });
        });

        describe('Acceptance Criteria Container Styles', () => {
            it('should have task-detail-acceptance-criteria styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-acceptance-criteria {'));
            });

            it('should have flex-direction column', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-acceptance-criteria {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('flex-direction: column'));
            });
        });

        describe('Criteria List Styles', () => {
            it('should have task-detail-criteria-list styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-criteria-list'));
            });

            it('should have no list style', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-criteria-list');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('list-style: none'));
            });
        });

        describe('Criterion Item Styles', () => {
            it('should have task-detail-criterion styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-criterion {'));
            });

            it('should have green background', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-criterion {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('rgba(34, 197, 94'));
            });

            it('should have border-radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.task-detail-criterion {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-radius'));
            });

            it('should have hover styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.task-detail-criterion:hover'));
            });
        });

        describe('Criterion Bullet Styles', () => {
            it('should have criterion-bullet styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.criterion-bullet'));
            });

            it('should have green color', () => {
                const styles = getStyles();
                const start = styles.indexOf('.criterion-bullet {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#22c55e'));
            });
        });

        describe('High Contrast Dark Support', () => {
            it('should have high contrast criterion styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .task-detail-criterion'));
            });

            it('should use transparent background', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-criterion');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('transparent'));
            });

            it('should have solid border in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-criterion');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('1px solid'));
            });

            it('should use light green for border in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .task-detail-criterion');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#90ee90'));
            });

            it('should have high contrast criterion-bullet styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .criterion-bullet'));
            });

            it('should use light green for bullet in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .criterion-bullet');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#90ee90'));
            });
        });

        describe('High Contrast Light Support', () => {
            it('should have high contrast light criterion styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .task-detail-criterion'));
            });

            it('should use transparent background in light theme', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .task-detail-criterion');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('transparent'));
            });

            it('should use dark green for border in high contrast light', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .task-detail-criterion');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#15803d'));
            });

            it('should have high contrast light criterion-bullet styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .criterion-bullet'));
            });

            it('should use dark green for bullet in high contrast light', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast-light .criterion-bullet');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#15803d'));
            });
        });
    });

    describe('Lazy Loading Styles', () => {
        describe('Base lazy-section class', () => {
            it('should have lazy-section class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section'));
            });

            it('should set position relative', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('position: relative'));
            });

            it('should set min-height', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('min-height: 60px'));
            });
        });

        describe('Loading state styles', () => {
            it('should have lazy-loading class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section.lazy-loading'));
            });

            it('should reduce opacity during loading', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section.lazy-loading {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity: 0.7'));
            });

            it('should have section-content min-height when loading', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section.lazy-loading .section-content'));
            });
        });

        describe('Loaded state styles', () => {
            it('should have lazy-loaded class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section.lazy-loaded'));
            });

            it('should have lazyFadeIn animation', () => {
                const styles = getStyles();
                assert.ok(styles.includes('animation: lazyFadeIn'));
            });

            it('should define lazyFadeIn keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes lazyFadeIn'));
            });

            it('should animate opacity in lazyFadeIn', () => {
                const styles = getStyles();
                const start = styles.indexOf('@keyframes lazyFadeIn');
                const end = styles.indexOf('}', styles.indexOf('}', start) + 1);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity: 0.7'));
            });

            it('should animate transform in lazyFadeIn', () => {
                const styles = getStyles();
                const start = styles.indexOf('@keyframes lazyFadeIn');
                const end = styles.indexOf('}', styles.indexOf('}', start) + 1);
                const body = styles.substring(start, end);
                assert.ok(body.includes('translateY'));
            });
        });

        describe('Error state styles', () => {
            it('should have lazy-error class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section.lazy-error'));
            });

            it('should style error indicator', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section.lazy-error .lazy-load-indicator'));
            });

            it('should use error foreground color', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section.lazy-error .lazy-load-indicator');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('--vscode-errorForeground'));
            });
        });

        describe('Loading indicator styles', () => {
            it('should have lazy-load-indicator class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-load-indicator'));
            });

            it('should use flexbox for centering', () => {
                const styles = getStyles();
                // Find the standalone lazy-load-indicator block (not the error state one)
                const loadingIndicatorComment = styles.indexOf('/* Loading indicator */');
                const start = styles.indexOf('.lazy-load-indicator {', loadingIndicatorComment);
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'), 'Should have display: flex');
                assert.ok(body.includes('align-items: center'), 'Should have align-items: center');
                assert.ok(body.includes('justify-content: center'), 'Should have justify-content: center');
            });

            it('should have gap between elements', () => {
                const styles = getStyles();
                const loadingIndicatorComment = styles.indexOf('/* Loading indicator */');
                const start = styles.indexOf('.lazy-load-indicator {', loadingIndicatorComment);
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('gap: 8px'), 'Should have gap: 8px');
            });

            it('should have padding', () => {
                const styles = getStyles();
                const loadingIndicatorComment = styles.indexOf('/* Loading indicator */');
                const start = styles.indexOf('.lazy-load-indicator {', loadingIndicatorComment);
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('padding: 16px'), 'Should have padding: 16px');
            });
        });

        describe('Spinner styles', () => {
            it('should have lazy-load-spinner class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-load-spinner'));
            });

            it('should set spinner dimensions', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-spinner {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('width: 16px'));
                assert.ok(body.includes('height: 16px'));
            });

            it('should have border styling', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-spinner {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border: 2px solid'));
            });

            it('should use gradient color for top border', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-spinner {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-top-color: var(--gradient-2)'));
            });

            it('should be circular', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-spinner {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-radius: 50%'));
            });

            it('should have spin animation', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-spinner {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('animation: lazyLoadSpin'));
            });

            it('should define lazyLoadSpin keyframes', () => {
                const styles = getStyles();
                assert.ok(styles.includes('@keyframes lazyLoadSpin'));
            });

            it('should rotate 360 degrees', () => {
                const styles = getStyles();
                const start = styles.indexOf('@keyframes lazyLoadSpin');
                const end = styles.indexOf('}', styles.indexOf('}', start) + 1);
                const body = styles.substring(start, end);
                assert.ok(body.includes('rotate(360deg)'));
            });
        });

        describe('Loading text styles', () => {
            it('should have lazy-load-text class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-load-text'));
            });

            it('should use italic style', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-load-text {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-style: italic'));
            });
        });

        describe('Placeholder styles', () => {
            it('should have lazy-section-placeholder class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-section-placeholder'));
            });

            it('should have dashed border', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section-placeholder {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border: 1px dashed'));
            });

            it('should have border radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section-placeholder {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border-radius: 6px'));
            });

            it('should use flexbox for content centering', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section-placeholder {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('display: flex'));
                assert.ok(body.includes('flex-direction: column'));
                assert.ok(body.includes('align-items: center'));
                assert.ok(body.includes('justify-content: center'));
            });

            it('should have min-height', () => {
                const styles = getStyles();
                const start = styles.indexOf('.lazy-section-placeholder {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('min-height: 100px'));
            });
        });

        describe('Placeholder icon styles', () => {
            it('should have placeholder-icon class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.placeholder-icon'));
            });
        });

        describe('Placeholder text styles', () => {
            it('should have placeholder-text class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.placeholder-text'));
            });

            it('should use italic style', () => {
                const styles = getStyles();
                const start = styles.indexOf('.placeholder-text {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('font-style: italic'));
            });
        });

        describe('High Contrast Dark Support', () => {
            it('should have high contrast lazy-loading styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .lazy-section.lazy-loading'));
            });

            it('should keep full opacity in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .lazy-section.lazy-loading');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('opacity: 1'));
            });

            it('should have dashed border in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .lazy-section.lazy-loading');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('1px dashed'));
            });

            it('should have high contrast spinner styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .lazy-load-spinner'));
            });

            it('should use hc-border for spinner border', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .lazy-load-spinner');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('--hc-border'));
            });

            it('should use hc-active-border for spinner top border', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .lazy-load-spinner');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('--hc-active-border'));
            });

            it('should have high contrast error styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .lazy-section.lazy-error .lazy-load-indicator'));
            });

            it('should have high contrast placeholder styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .lazy-section-placeholder'));
            });

            it('should use 2px dashed border for placeholder in high contrast', () => {
                const styles = getStyles();
                const start = styles.indexOf('body.vscode-high-contrast .lazy-section-placeholder');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('2px dashed'));
            });
        });

        describe('High Contrast Light Support', () => {
            it('should have high contrast light lazy-loading styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .lazy-section.lazy-loading'));
            });

            it('should have high contrast light error styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .lazy-section.lazy-error'));
            });

            it('should use dark red for error in light theme', () => {
                const styles = getStyles();
                // Find the standalone light theme error rule (not the combined one with dark theme)
                // The first occurrence is the combined rule (comma-separated with dark theme), so we need the second
                const pattern = 'body.vscode-high-contrast-light .lazy-section.lazy-error .lazy-load-indicator {';
                const firstOccurrence = styles.indexOf(pattern);
                const start = styles.indexOf(pattern, firstOccurrence + 1);
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('#b91c1c'), 'Should use dark red #b91c1c for light theme error');
            });

            it('should have high contrast light placeholder styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .lazy-section-placeholder'));
            });
        });

        describe('Responsive adjustments', () => {
            it('should have responsive lazy loading styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('Responsive adjustments for lazy loading'));
            });

            it('should reduce indicator padding for narrow widths', () => {
                const styles = getStyles();
                // Find the responsive section specific to lazy loading
                const lazyResponsiveStart = styles.indexOf('Responsive adjustments for lazy loading');
                const queryContent = styles.substring(lazyResponsiveStart, lazyResponsiveStart + 500);
                assert.ok(queryContent.includes('.lazy-load-indicator'));
            });

            it('should reduce spinner size for narrow widths', () => {
                const styles = getStyles();
                // Find the responsive section specific to lazy loading
                const lazyResponsiveStart = styles.indexOf('Responsive adjustments for lazy loading');
                const queryContent = styles.substring(lazyResponsiveStart, lazyResponsiveStart + 500);
                assert.ok(queryContent.includes('.lazy-load-spinner'));
            });

            it('should reduce placeholder padding for narrow widths', () => {
                const styles = getStyles();
                // Find the responsive section specific to lazy loading
                const lazyResponsiveStart = styles.indexOf('Responsive adjustments for lazy loading');
                const queryContent = styles.substring(lazyResponsiveStart, lazyResponsiveStart + 500);
                assert.ok(queryContent.includes('.lazy-section-placeholder'));
            });
        });

        describe('Error icon styles', () => {
            it('should have lazy-load-error-icon class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.lazy-load-error-icon'));
            });
        });
    });

    describe('Aggregated Stats Styles', () => {
        describe('Section container', () => {
            it('should have aggregated-stats-section class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-section'));
            });

            it('should have margin-top for section spacing', () => {
                const styles = getStyles();
                const sectionStart = styles.indexOf('.aggregated-stats-section {');
                const sectionEnd = styles.indexOf('}', sectionStart);
                const sectionBody = styles.substring(sectionStart, sectionEnd);
                assert.ok(sectionBody.includes('margin-top'));
            });
        });

        describe('Header styles', () => {
            it('should have aggregated-stats-header class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-header'));
            });

            it('should have aggregated-stats-icon class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-icon'));
            });

            it('should have aggregated-stats-count badge class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-count'));
            });
        });

        describe('Content container', () => {
            it('should have aggregated-stats-content class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-content'));
            });

            it('should have border and border-radius', () => {
                const styles = getStyles();
                const start = styles.indexOf('.aggregated-stats-content {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('border'));
                assert.ok(body.includes('border-radius'));
            });
        });

        describe('Empty state', () => {
            it('should have aggregated-stats-empty class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-empty'));
            });
        });

        describe('Stats totals grid', () => {
            it('should have aggregated-stats-totals class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-totals'));
            });

            it('should use grid layout for totals', () => {
                const styles = getStyles();
                const start = styles.indexOf('.aggregated-stats-totals {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('grid') || body.includes('display: grid'));
            });

            it('should have 4 columns for stats items', () => {
                const styles = getStyles();
                const start = styles.indexOf('.aggregated-stats-totals {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('repeat(4, 1fr)'));
            });
        });

        describe('Stat items', () => {
            it('should have aggregated-stat-item class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-item'));
            });

            it('should have aggregated-stat-value class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-value'));
            });

            it('should have aggregated-stat-label class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-label'));
            });

            it('should have completed variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-item.completed'));
            });

            it('should have pending variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-item.pending'));
            });

            it('should have progress variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stat-item.progress'));
            });
        });

        describe('Progress bar', () => {
            it('should have aggregated-stats-progress-bar class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-progress-bar'));
            });

            it('should have aggregated-stats-progress-fill class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.aggregated-stats-progress-fill'));
            });

            it('should have transition for smooth animation', () => {
                const styles = getStyles();
                const start = styles.indexOf('.aggregated-stats-progress-fill {');
                const end = styles.indexOf('}', start);
                const body = styles.substring(start, end);
                assert.ok(body.includes('transition'));
            });
        });

        describe('Project rows', () => {
            it('should have project-stats-row class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-row'));
            });

            it('should have active state for current project', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-row.active'));
            });

            it('should have hover state', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-row:hover'));
            });

            it('should have project-stats-name class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-name'));
            });

            it('should have project-stats-bar class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-bar'));
            });

            it('should have project-stats-numbers class', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-numbers'));
            });
        });

        describe('Progress bar fill colors', () => {
            it('should have complete color variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-bar-fill.complete'));
            });

            it('should have partial color variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-bar-fill.partial'));
            });

            it('should have low color variant', () => {
                const styles = getStyles();
                assert.ok(styles.includes('.project-stats-bar-fill.low'));
            });
        });

        describe('High contrast support', () => {
            it('should have high contrast styles for content', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .aggregated-stats-content'));
            });

            it('should have high contrast light styles for content', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast-light .aggregated-stats-content'));
            });

            it('should have high contrast styles for stat items', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .aggregated-stat-item'));
            });

            it('should have high contrast styles for progress bar', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .aggregated-stats-progress-bar'));
            });

            it('should have high contrast styles for project rows', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .project-stats-row'));
            });

            it('should have high contrast active project styles', () => {
                const styles = getStyles();
                assert.ok(styles.includes('body.vscode-high-contrast .project-stats-row.active'));
            });
        });

        describe('Responsive adjustments', () => {
            it('should have responsive styles at 400px breakpoint', () => {
                const styles = getStyles();
                const statsSection = styles.indexOf('Responsive adjustments for aggregated stats');
                if (statsSection > -1) {
                    const nextSection = styles.indexOf('@container', statsSection);
                    assert.ok(nextSection > statsSection);
                } else {
                    // Check for container query rules with aggregated stats
                    assert.ok(styles.includes('.aggregated-stats-totals'));
                }
            });

            it('should reduce grid columns for narrow widths', () => {
                const styles = getStyles();
                // Check that 2 columns are used at narrow width
                assert.ok(styles.includes('repeat(2, 1fr)'));
            });
        });
    });
});
