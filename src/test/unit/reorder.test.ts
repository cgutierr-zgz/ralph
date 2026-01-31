import * as assert from 'assert';
import { Task, TaskStatus } from '../../types';

// Mock parser for testing logic
function parseTasksFromContent(content: string): Task[] {
    const tasks: Task[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = /^[-*]\s*\[([ x~!s])\]\s*(.+)$/im.exec(line);

        if (match) {
            const marker = match[1].toLowerCase();
            const fullDescription = match[2].trim();
            const description = fullDescription.replace(/\(depends on:.*?\)/i, '').trim();

            let status: TaskStatus;
            switch (marker) {
                case 'x': status = TaskStatus.COMPLETE; break;
                case '~': status = TaskStatus.IN_PROGRESS; break;
                case '!': status = TaskStatus.BLOCKED; break;
                case 's': status = TaskStatus.SKIPPED; break;
                default: status = TaskStatus.PENDING;
            }

            tasks.push({
                id: `task-${i + 1}`,
                description,
                status,
                lineNumber: i + 1,
                rawLine: line
            });
        }
    }
    return tasks;
}

function reorderContent(content: string, orderedTaskIds: string[]): string {
    const tasks = parseTasksFromContent(content);
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    if (!orderedTaskIds.every(id => taskMap.has(id))) {
        throw new Error('Invalid task IDs: ' + orderedTaskIds.filter(id => !taskMap.has(id)).join(', '));
    }

    const tasksToReorder = orderedTaskIds.map(id => taskMap.get(id)!);
    const sortedLineNumbers = tasksToReorder.map(t => t.lineNumber).sort((a, b) => a - b);
    const newLinesOfText = tasksToReorder.map(t => t.rawLine);

    const lines = content.split('\n');
    
    for (let i = 0; i < sortedLineNumbers.length; i++) {
        const lineNum = sortedLineNumbers[i];
        const newLineContent = newLinesOfText[i];
        lines[lineNum - 1] = newLineContent;
    }

    return lines.join('\n');
}

describe('Task Reordering Logic', () => {
    it('should reorder tasks correctly', () => {
        const content = [
            '# Header',
            '',
            '- [ ] Task 1',
            '- [ ] Task 2',
            '- [ ] Task 3',
            '',
            'Footer'
        ].join('\n');
        
        // Items are at lines 3, 4, 5 (1-based because split is 0-based but parseTasks uses i+1)
        // Wait, lines array is 0-indexed.
        // line 'Header' is index 0 -> lineNum 1.
        // line '' is index 1 -> lineNum 2.
        // line '- [ ] Task 1' is index 2 -> lineNum 3.
        
        // Reorder to 3, 1, 2
        // IDs are task-3, task-4, task-5
        
        const result = reorderContent(content, ['task-5', 'task-3', 'task-4']);
        
        const expected = [
            '# Header',
            '',
            '- [ ] Task 3',
            '- [ ] Task 1',
            '- [ ] Task 2',
            '',
            'Footer'
        ].join('\n');
        
        assert.strictEqual(result, expected);
    });

    it('should handle interleaving text correctly', () => {
        const content = [
            '- [ ] Task A',
            'Some comment',
            '- [ ] Task B'
        ].join('\n');
        
        // task-1, task-3
        // swap them
        const result = reorderContent(content, ['task-3', 'task-1']);
        
        const expected = [
            '- [ ] Task B',
            'Some comment',
            '- [ ] Task A'
        ].join('\n');
        
        assert.strictEqual(result, expected);
    });

    it('should preserve content exactly when rawLine is used', () => {
        const content = [
            '- [ ] Task A with extra details',
            '- [ ] Task B with other info'
        ].join('\n');
        
        // task-1, task-2
        // swap
        const result = reorderContent(content, ['task-2', 'task-1']);
        
        const expected = [
            '- [ ] Task B with other info',
            '- [ ] Task A with extra details'
        ].join('\n');
        
        assert.strictEqual(result, expected);
    });
});
