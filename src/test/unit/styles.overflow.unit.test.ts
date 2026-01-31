import * as assert from 'assert';
import { getStyles } from '../../webview/styles';

describe('Webview Styles - Overflow Protection', () => {
    const styles = getStyles();

    it('should have overflow protection for .task-text', () => {
        // Match .task-text block
        const taskTextMatch = styles.match(/\.task-text\s*\{([^}]+)\}/);
        assert.ok(taskTextMatch, '.task-text rule not found');
        const content = taskTextMatch[1];
        assert.ok(content.includes('word-break: break-word'), 'Missing word-break: break-word in .task-text');
        assert.ok(content.includes('overflow-wrap: anywhere'), 'Missing overflow-wrap: anywhere in .task-text');
    });

    it('should have overflow protection for .log-msg', () => {
        // Match .log-msg block
        const logMsgMatch = styles.match(/\.log-msg\s*\{([^}]+)\}/);
        assert.ok(logMsgMatch, '.log-msg rule not found');
        const content = logMsgMatch[1];
        assert.ok(content.includes('min-width: 0'), 'Missing min-width: 0 in .log-msg');
        assert.ok(content.includes('word-break: break-word'), 'Missing word-break: break-word in .log-msg');
        assert.ok(content.includes('overflow-wrap: anywhere'), 'Missing overflow-wrap: anywhere in .log-msg');
    });

    it('should have truncation for .title h1', () => {
        // Match .title h1 block
        const titleH1Match = styles.match(/\.title h1\s*\{([^}]+)\}/);
        assert.ok(titleH1Match, '.title h1 rule not found');
        const content = titleH1Match[1];
        assert.ok(content.includes('white-space: nowrap'), 'Missing white-space: nowrap in .title h1');
        assert.ok(content.includes('overflow: hidden'), 'Missing overflow: hidden in .title h1');
        assert.ok(content.includes('text-overflow: ellipsis'), 'Missing text-overflow: ellipsis in .title h1');
    });

    it('should have flex shrinking for .title container', () => {
        // Match .title block (ensure it's not .title h1 or others)
        const titleMatch = styles.match(/\.title\s*\{([^}]+)\}/);
        assert.ok(titleMatch, '.title rule not found');
        const content = titleMatch[1];
        assert.ok(content.includes('min-width: 0'), 'Missing min-width: 0 in .title');
        assert.ok(content.includes('max-width: 100%'), 'Missing max-width: 100% in .title');
    });

    it('should have overflow protection for .setup-description', () => {
        // Match .setup-description block
        const setupDescMatch = styles.match(/\.setup-description\s*\{([^}]+)\}/);
        assert.ok(setupDescMatch, '.setup-description rule not found');
        const content = setupDescMatch[1];
        assert.ok(content.includes('word-break: break-word'), 'Missing word-break: break-word in .setup-description');
        assert.ok(content.includes('overflow-wrap: anywhere'), 'Missing overflow-wrap: anywhere in .setup-description');
    });
});
