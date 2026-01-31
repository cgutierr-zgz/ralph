import * as assert from 'assert';

export function addBreakpointTests(scripts: string): void {
    describe('Responsive Breakpoint System', () => {
        it('should define BREAKPOINT_THRESHOLDS', () => {
            assert.ok(scripts.includes('const BREAKPOINT_THRESHOLDS = {'));
            assert.ok(scripts.includes('xs: 250'));
            assert.ok(scripts.includes('sm: 320'));
            assert.ok(scripts.includes('md: 400'));
            assert.ok(scripts.includes('lg: 600'));
        });

        it('should define calculateBreakpoint function', () => {
            assert.ok(scripts.includes('function calculateBreakpoint(width)'));
            const fnStart = scripts.indexOf('function calculateBreakpoint(width)');
            const fnEnd = scripts.indexOf('function getCurrentBreakpoint', fnStart);
            const fnBody = scripts.substring(fnStart, fnEnd);
            assert.ok(fnBody.includes('return \'xs\''));
            assert.ok(fnBody.includes('return \'sm\''));
            assert.ok(fnBody.includes('return \'md\''));
            assert.ok(fnBody.includes('return \'lg\''));
        });

        it('should define handleBreakpointChange function', () => {
            assert.ok(scripts.includes('function handleBreakpointChange(newBreakpoint)'));
            const fnStart = scripts.indexOf('function handleBreakpointChange(newBreakpoint)');
            const fnEnd = scripts.indexOf('function getBreakpointLabel', fnStart);
            const fnBody = scripts.substring(fnStart, fnEnd);
            assert.ok(fnBody.includes('updateBreakpointClasses(newBreakpoint)'));
            assert.ok(fnBody.includes('updateConditionalVisibility()'));
            assert.ok(fnBody.includes('announceToScreenReader'));
        });

        it('should define updateBreakpointClasses function', () => {
            assert.ok(scripts.includes('function updateBreakpointClasses(breakpoint)'));
            const fnStart = scripts.indexOf('function updateBreakpointClasses(breakpoint)');
            const fnEnd = scripts.indexOf('function updateConditionalVisibility', fnStart);
            const fnBody = scripts.substring(fnStart, fnEnd);
            assert.ok(fnBody.includes("body.classList.remove('breakpoint-' + bp)"));
            assert.ok(fnBody.includes("body.classList.add('breakpoint-' + breakpoint)"));
            assert.ok(fnBody.includes("body.setAttribute('data-breakpoint', breakpoint)"));
        });

        it('should define updateConditionalVisibility function', () => {
            assert.ok(scripts.includes('function updateConditionalVisibility()'));
            const fnStart = scripts.indexOf('function updateConditionalVisibility()');
            const fnEnd = scripts.indexOf('function handleBreakpointChange', fnStart);
            const fnBody = scripts.substring(fnStart, fnEnd);
            assert.ok(fnBody.includes("document.querySelectorAll('[data-show-at]')"));
            assert.ok(fnBody.includes("document.querySelectorAll('[data-hide-at]')"));
        });

        it('should define initResizeObserver function', () => {
            assert.ok(scripts.includes('function initResizeObserver()'));
            const fnStart = scripts.indexOf('function initResizeObserver()');
            const fnEnd = scripts.indexOf('function destroyResizeObserver', fnStart);
            const fnBody = scripts.substring(fnStart, fnEnd);
            assert.ok(fnBody.includes('new ResizeObserver'));
            // Check fallback for browsers without ResizeObserver
            assert.ok(fnBody.includes('window.addEventListener(\'resize\''));
            // Check initial calculation
            assert.ok(fnBody.includes('calculateBreakpoint(initialWidth)'));
        });
    });
}
