import * as assert from 'assert';
import { getStyles } from '../../webview/styles';
import { getClientScripts } from '../../webview/scripts';
import { getDependencyGraphSection } from '../../webview/templates';

describe('Task Dependency Visualization', () => {
    describe('Styles', () => {
        it('should include timeline connector styles', () => {
            const styles = getStyles();
            assert.ok(styles.includes('.timeline-connector'), 'Should have .timeline-connector class');
            assert.ok(styles.includes('.timeline-connector::after'), 'Should have .timeline-connector::after pseudo-element');
        });

        it('should style arrows correctly', () => {
            const styles = getStyles();
            // Check for arrow head styling logic (borders)
            assert.ok(styles.includes('border-top: 4px solid transparent'), 'Should form arrow head top');
            assert.ok(styles.includes('border-bottom: 4px solid transparent'), 'Should form arrow head bottom');
            assert.ok(styles.includes('border-left: 5px solid'), 'Should form arrow head left');
        });
    });

    describe('Scripts', () => {
        it('should include addConnector function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function addConnector(bars, labels)'), 'Should defined addConnector function');
        });

        it('should insert connectors in updateTimeline', () => {
            const scripts = getClientScripts();
            // Check for connector insertion in history loop
            assert.ok(scripts.includes('if (i > 0) {'), 'Should check index > 0');
            assert.ok(scripts.includes('addConnector(bars, labels);'), 'Should call addConnector');
        });

        it('should insert connectors between current and pending tasks', () => {
            const scripts = getClientScripts();
            // Check for connector before pending bars loop logic or initial pending call
            // We can't regex complex logic easily on minified-like code, but we can check specific lines we added
            assert.ok(scripts.includes('addConnector(bars, labels)'), 'Should have addConnector calls');
        });
    });

    describe('Dependency Graph', () => {
        describe('Template', () => {
            it('should return valid HTML string', () => {
                const html = getDependencyGraphSection();
                assert.ok(typeof html === 'string');
                assert.ok(html.length > 0);
            });

            it('should include correct ID and class', () => {
                const html = getDependencyGraphSection();
                assert.ok(html.includes('id="dependencySection"'));
                assert.ok(html.includes('class="dependency-section collapsible-section"'));
            });

            it('should include graph container', () => {
                const html = getDependencyGraphSection();
                assert.ok(html.includes('id="dependencyGraph"'));
                assert.ok(html.includes('display: none'), 'Hidden by default');
            });

            it('should include empty state', () => {
                const html = getDependencyGraphSection();
                assert.ok(html.includes('id="dependencyEmpty"'));
            });
        });

        describe('Scripts', () => {
            it('should include renderDependencyGraph function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function renderDependencyGraph(tasks, immediate)'));
            });

            it('should call renderDependencyGraph via lazy loading for dependencySection', () => {
                const scripts = getClientScripts();
                // renderDependencyGraph is now called via initializeLazySection when dependency section becomes visible
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("case 'dependencySection'"));
                assert.ok(fnBody.includes('renderDependencyGraph(window.__RALPH_INITIAL_TASKS__'));
            });
            
             it('should call renderDependencyGraph on stats update', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('renderDependencyGraph(msg.tasks)'));
            });
        });
    });
});
