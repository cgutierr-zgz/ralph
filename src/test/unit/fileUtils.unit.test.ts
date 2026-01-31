import * as assert from 'assert';
import { Task, TaskStatus } from '../../types';

// Since fileUtils imports vscode modules, we test the pure parsing logic
// by re-implementing the parseTasksFromContent function here for unit testing purposes.
// This approach is consistent with other unit tests in this project (see promptBuilder.unit.test.ts)
// and allows us to test the regex logic without requiring the full VS Code environment.
// The actual integration testing happens in the VS Code test environment.

function parseTasksFromContent(content: string): Task[] {
    const tasks: Task[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = /^[-*]\s*\[([ x~!s])\]\s*(.+)$/im.exec(line);

        if (match) {
            const marker = match[1].toLowerCase();
            const fullDescription = match[2].trim();
            
            // Extract dependencies
            const description = fullDescription;
            const dependencies: string[] = [];
            
            const depMatch = /\(depends on:\s*([^)]+)\)/i.exec(fullDescription);
            if (depMatch) {
                // Parse dependencies string: "Task A", 'Task B', Task C
                const depString = depMatch[1];
                // Split by comma and clean quotes
                dependencies.push(...depString.split(',').map(d => d.trim().replace(/^['"]|['"]$/g, '')));
            }

            // Extract acceptance criteria using [AC: criterion1; criterion2] syntax
            const acceptanceCriteria: string[] = [];
            const acMatch = /\[AC:\s*([^\]]+)\]/i.exec(fullDescription);
            if (acMatch) {
                // Split by semicolon and clean up whitespace
                acceptanceCriteria.push(...acMatch[1].split(';').map(c => c.trim()).filter(c => c.length > 0));
            }

            let status: TaskStatus;
            switch (marker) {
                case 'x':
                    status = TaskStatus.COMPLETE;
                    break;
                case '~':
                    status = TaskStatus.IN_PROGRESS;
                    break;
                case '!':
                    status = TaskStatus.BLOCKED;
                    break;
                case 's':
                    status = TaskStatus.SKIPPED;
                    break;
                default:
                    status = TaskStatus.PENDING;
            }

            tasks.push({
                id: `task-${i + 1}`,
                description,
                status,
                lineNumber: i + 1,
                rawLine: line,
                dependencies,
                acceptanceCriteria: acceptanceCriteria.length > 0 ? acceptanceCriteria : undefined
            });
        }
    }

    return tasks;
}

describe('FileUtils - Task Parsing Regex', () => {
    describe('Basic checkbox formats', () => {
        it('should parse unchecked task with dash', () => {
            const content = '- [ ] Set up project structure with dependencies';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Set up project structure with dependencies');
            assert.strictEqual(tasks[0].status, TaskStatus.PENDING);
        });

        it('should parse unchecked task with asterisk', () => {
            const content = '* [ ] Create core data models and types';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Create core data models and types');
            assert.strictEqual(tasks[0].status, TaskStatus.PENDING);
        });

        it('should parse checked task with dash', () => {
            const content = '- [x] Implement main application logic';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Implement main application logic');
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
        });

        it('should parse checked task with asterisk', () => {
            const content = '* [x] Add user interface and styling';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Add user interface and styling');
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
        });

        it('should parse skipped task', () => {
            const content = '- [s] Skip this task';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Skip this task');
            assert.strictEqual(tasks[0].status, TaskStatus.SKIPPED);
        });

        it('should parse in-progress task', () => {
            const content = '- [~] Write tests and documentation';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Write tests and documentation');
            assert.strictEqual(tasks[0].status, TaskStatus.IN_PROGRESS);
        });

        it('should parse blocked task', () => {
            const content = '- [!] Fix critical bug in authentication';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Fix critical bug in authentication');
            assert.strictEqual(tasks[0].status, TaskStatus.BLOCKED);
        });
    });

    describe('Whitespace variations', () => {
        it('should parse task with single space after marker', () => {
            const content = '- [ ] Task with single space';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with single space');
        });

        it('should parse task with multiple spaces after marker', () => {
            const content = '-    [ ] Task with multiple spaces';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with multiple spaces');
        });

        it('should parse task with multiple spaces after checkbox', () => {
            const content = '- [ ]    Task with spaces after checkbox';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with spaces after checkbox');
        });

        it('should parse task with tab after marker', () => {
            const content = '-\t[ ] Task with tab';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with tab');
        });

        it('should parse task with trailing whitespace in description', () => {
            const content = '- [ ] Task with trailing spaces   ';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with trailing spaces');
        });
    });

    describe('Dependency parsing', () => {
        it('should parse simple dependency', () => {
            const content = '- [ ] Task B (depends on: "Task A")';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.length, 1);
            assert.strictEqual(tasks[0].dependencies?.[0], 'Task A');
        });

        it('should parse multiple dependencies', () => {
            const content = '- [ ] Task C (depends on: "Task A", "Task B")';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.length, 2);
            assert.strictEqual(tasks[0].dependencies?.[0], 'Task A');
            assert.strictEqual(tasks[0].dependencies?.[1], 'Task B');
        });

        it('should parse dependencies with single quotes', () => {
            const content = "- [ ] Task D (depends on: 'Task A')";
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.[0], 'Task A');
        });
        
        it('should parse dependencies without quotes', () => {
            const content = "- [ ] Task E (depends on: Task A, Task B)";
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.[0], 'Task A');
            assert.strictEqual(tasks[0].dependencies?.[1], 'Task B');
        });

        it('should handle tasks with no dependencies', () => {
            const content = '- [ ] Simple task';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.length, 0);
        });
    });

    describe('Acceptance criteria parsing', () => {
        it('should parse single acceptance criterion', () => {
            const content = '- [ ] Task with AC [AC: Unit tests pass]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'Unit tests pass');
        });

        it('should parse multiple acceptance criteria', () => {
            const content = '- [ ] Task with multiple AC [AC: Tests pass; Docs updated; Code reviewed]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 3);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'Tests pass');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[1], 'Docs updated');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[2], 'Code reviewed');
        });

        it('should parse acceptance criteria case-insensitively', () => {
            const content = '- [ ] Task with lowercase ac [ac: criterion]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'criterion');
        });

        it('should handle tasks without acceptance criteria', () => {
            const content = '- [ ] Simple task without AC';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria, undefined);
        });

        it('should trim whitespace from acceptance criteria', () => {
            const content = '- [ ] Task [AC:  criterion with spaces  ;  another one  ]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'criterion with spaces');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[1], 'another one');
        });

        it('should filter out empty acceptance criteria', () => {
            const content = '- [ ] Task [AC: criterion; ; another]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 2);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'criterion');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[1], 'another');
        });

        it('should parse both dependencies and acceptance criteria', () => {
            const content = '- [ ] Complex task (depends on: "Task A") [AC: Test passes; Works correctly]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].dependencies?.length, 1);
            assert.strictEqual(tasks[0].dependencies?.[0], 'Task A');
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 2);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'Test passes');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[1], 'Works correctly');
        });

        it('should handle acceptance criteria with special characters', () => {
            const content = '- [ ] Task [AC: Check file.ts works; Verify 100% coverage]';
            const tasks = parseTasksFromContent(content);
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].acceptanceCriteria?.length, 2);
            assert.strictEqual(tasks[0].acceptanceCriteria?.[0], 'Check file.ts works');
            assert.strictEqual(tasks[0].acceptanceCriteria?.[1], 'Verify 100% coverage');
        });
    });

    describe('Case sensitivity', () => {
        it('should parse uppercase X as complete', () => {
            const content = '- [X] Task with uppercase X';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
        });

        it('should parse lowercase x as complete', () => {
            const content = '- [x] Task with lowercase x';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
        });
    });

    describe('Multiple tasks in document', () => {
        it('should parse multiple tasks from PRD example', () => {
            const content = `# My Project

## Overview
Brief description of what you're building.

## Tasks
- [x] Set up project structure with dependencies
- [x] Create core data models and types
- [ ] Implement main application logic
- [ ] Add user interface and styling
- [ ] Write tests and documentation`;
            
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 5);
            assert.strictEqual(tasks[0].description, 'Set up project structure with dependencies');
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[1].description, 'Create core data models and types');
            assert.strictEqual(tasks[1].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[2].description, 'Implement main application logic');
            assert.strictEqual(tasks[2].status, TaskStatus.PENDING);
            assert.strictEqual(tasks[3].description, 'Add user interface and styling');
            assert.strictEqual(tasks[3].status, TaskStatus.PENDING);
            assert.strictEqual(tasks[4].description, 'Write tests and documentation');
            assert.strictEqual(tasks[4].status, TaskStatus.PENDING);
        });

        it('should parse mixed task markers', () => {
            const content = `- [ ] First task with dash
* [ ] Second task with asterisk
- [x] Third task completed
* [~] Fourth task in progress`;
            
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 4);
            assert.strictEqual(tasks[0].description, 'First task with dash');
            assert.strictEqual(tasks[1].description, 'Second task with asterisk');
            assert.strictEqual(tasks[2].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[3].status, TaskStatus.IN_PROGRESS);
        });
    });

    describe('Edge cases and special characters', () => {
        it('should parse task with special characters in description', () => {
            const content = '- [ ] Task with special chars: @#$%^&*()';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Task with special chars: @#$%^&*()');
        });

        it('should parse task with punctuation', () => {
            const content = '- [ ] Add authentication & authorization (OAuth 2.0)';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Add authentication & authorization (OAuth 2.0)');
        });

        it('should parse task with numbers', () => {
            const content = '- [ ] Configure port 3000 for development server';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Configure port 3000 for development server');
        });

        it('should parse task with backticks', () => {
            const content = '- [ ] Update `package.json` with dependencies';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Update `package.json` with dependencies');
        });

        it('should parse task with quotes', () => {
            const content = '- [ ] Add "feature" to the application';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Add "feature" to the application');
        });

        it('should parse task with emojis', () => {
            const content = '- [ ] 🚀 Deploy to production';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, '🚀 Deploy to production');
        });
    });

    describe('Non-matching patterns', () => {
        it('should not match task without checkbox', () => {
            const content = '- Just a regular list item';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should not match task with indentation', () => {
            const content = '  - [ ] Indented task';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should not match task with invalid checkbox marker', () => {
            const content = '- [y] Invalid checkbox marker';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should not match plain text', () => {
            const content = 'This is just plain text';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should not match task starting with number', () => {
            const content = '1. [ ] Numbered list with checkbox';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });
    });

    describe('Line number tracking', () => {
        it('should track correct line numbers', () => {
            const content = `Line 1: heading
Line 2: text
- [ ] Task on line 3
Line 4: more text
- [x] Task on line 5`;
            
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 2);
            assert.strictEqual(tasks[0].lineNumber, 3);
            assert.strictEqual(tasks[1].lineNumber, 5);
        });
    });

    describe('Task description content', () => {
        it('should parse task with long description', () => {
            const content = '- [ ] This is a very long task description that contains multiple words and explains in detail what needs to be done';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'This is a very long task description that contains multiple words and explains in detail what needs to be done');
        });

        it('should parse task with URL', () => {
            const content = '- [ ] Check documentation at https://example.com/docs';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Check documentation at https://example.com/docs');
        });

        it('should parse task with file path', () => {
            const content = '- [ ] Update src/components/Header.tsx';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 1);
            assert.strictEqual(tasks[0].description, 'Update src/components/Header.tsx');
        });
    });

    describe('Empty and malformed input', () => {
        it('should handle empty string', () => {
            const content = '';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should handle string with only newlines', () => {
            const content = '\n\n\n';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should handle malformed checkbox (missing closing bracket)', () => {
            const content = '- [ Task without closing bracket';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });

        it('should handle malformed checkbox (missing opening bracket)', () => {
            const content = '- ] Task without opening bracket';
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 0);
        });
    });

    describe('Real-world PRD examples', () => {
        it('should parse realistic PRD from README example', () => {
            const content = `# My Project

## Overview
Brief description of what you're building.

## Tasks
- [ ] Set up project structure with dependencies
- [ ] Create core data models and types
- [ ] Implement main application logic
- [ ] Add user interface and styling
- [ ] Write tests and documentation

## Technical Details
Using React, TypeScript, and Tailwind CSS`;
            
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 5);
            tasks.forEach(task => {
                assert.strictEqual(task.status, TaskStatus.PENDING);
            });
        });

        it('should parse PRD with completed and pending tasks', () => {
            const content = `# Todo App

## Tasks
- [x] Set up React project with TypeScript
- [x] Install Tailwind CSS
- [x] Create basic component structure
- [~] Implement add todo functionality
- [ ] Implement delete functionality
- [ ] Implement mark as complete
- [ ] Add styling and animations`;
            
            const tasks = parseTasksFromContent(content);
            
            assert.strictEqual(tasks.length, 7);
            assert.strictEqual(tasks[0].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[1].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[2].status, TaskStatus.COMPLETE);
            assert.strictEqual(tasks[3].status, TaskStatus.IN_PROGRESS);
            assert.strictEqual(tasks[4].status, TaskStatus.PENDING);
            assert.strictEqual(tasks[5].status, TaskStatus.PENDING);
            assert.strictEqual(tasks[6].status, TaskStatus.PENDING);
        });
    });

    describe('getFirstBlockedTaskAsync', () => {
        it('should find first blocked task', () => {
            const content = `- [x] Completed task
- [ ] Pending task
- [!] Blocked task 1
- [!] Blocked task 2`;
            const tasks = parseTasksFromContent(content);
            const blockedTask = tasks.find(t => t.status === TaskStatus.BLOCKED);
            
            assert.ok(blockedTask);
            assert.strictEqual(blockedTask.description, 'Blocked task 1');
            assert.strictEqual(blockedTask.status, TaskStatus.BLOCKED);
        });

        it('should return null when no blocked tasks', () => {
            const content = `- [x] Completed task
- [ ] Pending task
- [s] Skipped task`;
            const tasks = parseTasksFromContent(content);
            const blockedTask = tasks.find(t => t.status === TaskStatus.BLOCKED);
            
            assert.strictEqual(blockedTask, undefined);
        });

        it('should find blocked task among various statuses', () => {
            const content = `- [x] Done
- [~] In progress
- [s] Skipped
- [!] Blocked one
- [ ] Pending`;
            const tasks = parseTasksFromContent(content);
            const blockedTask = tasks.find(t => t.status === TaskStatus.BLOCKED);
            
            assert.ok(blockedTask);
            assert.strictEqual(blockedTask.description, 'Blocked one');
        });
    });

    describe('markTaskAsPendingAsync logic', () => {
        it('should change blocked marker to pending', () => {
            const line = '- [!] Blocked task';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.strictEqual(newLine, '- [ ] Blocked task');
        });

        it('should change skipped marker to pending', () => {
            const line = '- [s] Skipped task';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.strictEqual(newLine, '- [ ] Skipped task');
        });

        it('should change completed marker to pending', () => {
            const line = '- [x] Completed task';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.strictEqual(newLine, '- [ ] Completed task');
        });

        it('should preserve task description when changing to pending', () => {
            const line = '- [!] Fix critical bug in authentication';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.ok(newLine.includes('Fix critical bug in authentication'));
            assert.ok(newLine.startsWith('- [ ]'));
        });

        it('should preserve indentation when changing to pending', () => {
            const line = '  - [!] Indented blocked task';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.strictEqual(newLine, '  - [ ] Indented blocked task');
        });

        it('should handle asterisk bullets when changing to pending', () => {
            const line = '* [!] Asterisk blocked task';
            const newLine = line.replace(/\[([ x~!s]?)\]/, '[ ]');
            
            assert.strictEqual(newLine, '* [ ] Asterisk blocked task');
        });
    });

    describe('markAllTasksAsCompleteAsync logic', () => {
        // This simulates the regex logic used to mark all pending tasks as complete
        function markAllComplete(content: string): { newContent: string; count: number } {
            const lines = content.split('\n');
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Match non-complete task markers (pending, in-progress, blocked, skipped)
                const match = /^(\s*[-*]\s*)\[([  ~!s])\](\s*.+)$/i.exec(line);
                if (match) {
                    lines[i] = line.replace(/\[([  ~!s])\]/i, '[x]');
                    count++;
                }
            }
            return { newContent: lines.join('\n'), count };
        }

        it('should mark pending task as complete', () => {
            const content = '- [ ] Pending task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [x] Pending task');
        });

        it('should mark multiple pending tasks as complete', () => {
            const content = `- [ ] Task 1
- [ ] Task 2
- [ ] Task 3`;
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 3);
            assert.ok(result.newContent.includes('- [x] Task 1'));
            assert.ok(result.newContent.includes('- [x] Task 2'));
            assert.ok(result.newContent.includes('- [x] Task 3'));
        });

        it('should mark in-progress tasks as complete', () => {
            const content = '- [~] In progress task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [x] In progress task');
        });

        it('should mark blocked tasks as complete', () => {
            const content = '- [!] Blocked task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [x] Blocked task');
        });

        it('should mark skipped tasks as complete', () => {
            const content = '- [s] Skipped task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [x] Skipped task');
        });

        it('should not change already completed tasks', () => {
            const content = '- [x] Already done';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 0);
            assert.strictEqual(result.newContent, '- [x] Already done');
        });

        it('should handle mixed status tasks', () => {
            const content = `- [x] Completed
- [ ] Pending
- [~] In progress
- [!] Blocked
- [s] Skipped`;
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 4);
            const lines = result.newContent.split('\n');
            assert.strictEqual(lines[0], '- [x] Completed');
            assert.strictEqual(lines[1], '- [x] Pending');
            assert.strictEqual(lines[2], '- [x] In progress');
            assert.strictEqual(lines[3], '- [x] Blocked');
            assert.strictEqual(lines[4], '- [x] Skipped');
        });

        it('should preserve non-task content', () => {
            const content = `# PRD Title

## Tasks
- [ ] Do something
- [x] Already done

Some description text.`;
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.ok(result.newContent.includes('# PRD Title'));
            assert.ok(result.newContent.includes('Some description text.'));
        });

        it('should handle asterisk bullets', () => {
            const content = '* [ ] Asterisk task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '* [x] Asterisk task');
        });

        it('should preserve indentation', () => {
            const content = '  - [ ] Indented task';
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '  - [x] Indented task');
        });

        it('should return zero count when all tasks are completed', () => {
            const content = `- [x] Task 1
- [x] Task 2`;
            const result = markAllComplete(content);
            
            assert.strictEqual(result.count, 0);
        });
    });

    describe('resetAllTasksAsync logic', () => {
        // This simulates the regex logic used to reset all tasks to pending
        function resetAllTasks(content: string): { newContent: string; count: number } {
            const lines = content.split('\n');
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Match non-pending task markers (complete, in-progress, blocked, skipped)
                const match = /^(\s*[-*]\s*)\[([x~!s])\](\s*.+)$/i.exec(line);
                if (match) {
                    lines[i] = line.replace(/\[([x~!s])\]/i, '[ ]');
                    count++;
                }
            }
            return { newContent: lines.join('\n'), count };
        }

        it('should reset completed task to pending', () => {
            const content = '- [x] Completed task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] Completed task');
        });

        it('should reset multiple completed tasks to pending', () => {
            const content = `- [x] Task 1
- [x] Task 2
- [x] Task 3`;
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 3);
            assert.ok(result.newContent.includes('- [ ] Task 1'));
            assert.ok(result.newContent.includes('- [ ] Task 2'));
            assert.ok(result.newContent.includes('- [ ] Task 3'));
        });

        it('should reset in-progress tasks to pending', () => {
            const content = '- [~] In progress task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] In progress task');
        });

        it('should reset blocked tasks to pending', () => {
            const content = '- [!] Blocked task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] Blocked task');
        });

        it('should reset skipped tasks to pending', () => {
            const content = '- [s] Skipped task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] Skipped task');
        });

        it('should not change already pending tasks', () => {
            const content = '- [ ] Already pending';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 0);
            assert.strictEqual(result.newContent, '- [ ] Already pending');
        });

        it('should handle mixed status tasks', () => {
            const content = `- [ ] Pending
- [x] Completed
- [~] In progress
- [!] Blocked
- [s] Skipped`;
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 4);
            const lines = result.newContent.split('\n');
            assert.strictEqual(lines[0], '- [ ] Pending');
            assert.strictEqual(lines[1], '- [ ] Completed');
            assert.strictEqual(lines[2], '- [ ] In progress');
            assert.strictEqual(lines[3], '- [ ] Blocked');
            assert.strictEqual(lines[4], '- [ ] Skipped');
        });

        it('should preserve non-task content', () => {
            const content = `# PRD Title

## Tasks
- [x] Completed task
- [ ] Pending task

Some description text.`;
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.ok(result.newContent.includes('# PRD Title'));
            assert.ok(result.newContent.includes('Some description text.'));
        });

        it('should handle asterisk bullets', () => {
            const content = '* [x] Completed asterisk task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '* [ ] Completed asterisk task');
        });

        it('should preserve indentation', () => {
            const content = '  - [x] Indented completed task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '  - [ ] Indented completed task');
        });

        it('should return zero count when all tasks are already pending', () => {
            const content = `- [ ] Task 1
- [ ] Task 2`;
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 0);
        });

        it('should handle uppercase markers', () => {
            const content = '- [X] Uppercase completed task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] Uppercase completed task');
        });

        it('should handle uppercase skipped marker', () => {
            const content = '- [S] Uppercase skipped task';
            const result = resetAllTasks(content);
            
            assert.strictEqual(result.count, 1);
            assert.strictEqual(result.newContent, '- [ ] Uppercase skipped task');
        });
    });
});
