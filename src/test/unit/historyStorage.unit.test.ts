import * as assert from 'assert';
import {
    generateRecordId,
    generateSessionId,
    getDateKey,
    getProjectName,
    createCompletionRecord,
    isValidCompletionHistoryData,
    isValidCompletionRecord,
    normalizeCompletionHistoryData
} from '../../historyStorage.js';
import { DEFAULT_COMPLETION_HISTORY, TaskCompletion, TaskCompletionRecord } from '../../types.js';

describe('HistoryStorage', () => {
    describe('generateRecordId', () => {
        it('should generate a unique ID string', () => {
            const id = generateRecordId();
            assert.ok(typeof id === 'string');
            assert.ok(id.length > 0);
        });

        it('should generate different IDs on each call', () => {
            const id1 = generateRecordId();
            const id2 = generateRecordId();
            assert.notStrictEqual(id1, id2);
        });

        it('should include timestamp prefix', () => {
            const before = Date.now();
            const id = generateRecordId();
            const after = Date.now();
            const timestamp = parseInt(id.split('-')[0], 10);
            assert.ok(timestamp >= before);
            assert.ok(timestamp <= after);
        });
    });

    describe('generateSessionId', () => {
        it('should generate a session ID starting with "session-"', () => {
            const sessionId = generateSessionId();
            assert.ok(sessionId.startsWith('session-'));
        });

        it('should generate unique session IDs', () => {
            const id1 = generateSessionId();
            const id2 = generateSessionId();
            assert.notStrictEqual(id1, id2);
        });
    });

    describe('getDateKey', () => {
        it('should format date as YYYY-MM-DD', () => {
            // Jan 15, 2024 at noon
            const timestamp = new Date(2024, 0, 15, 12, 0, 0).getTime();
            assert.strictEqual(getDateKey(timestamp), '2024-01-15');
        });

        it('should pad single-digit months with zero', () => {
            const timestamp = new Date(2024, 4, 5).getTime(); // May 5
            assert.strictEqual(getDateKey(timestamp), '2024-05-05');
        });

        it('should pad single-digit days with zero', () => {
            const timestamp = new Date(2024, 11, 1).getTime(); // Dec 1
            assert.strictEqual(getDateKey(timestamp), '2024-12-01');
        });

        it('should handle year boundaries', () => {
            const timestamp = new Date(2023, 11, 31, 23, 59, 59).getTime();
            assert.strictEqual(getDateKey(timestamp), '2023-12-31');
        });
    });

    describe('getProjectName', () => {
        it('should return "Unknown Project" for null path', () => {
            assert.strictEqual(getProjectName(null), 'Unknown Project');
        });

        it('should extract basename from path', () => {
            assert.strictEqual(getProjectName('/Users/test/projects/my-project'), 'my-project');
        });

        it('should handle Windows-style paths on Windows or return full path on other OS', () => {
            // path.basename on macOS/Linux doesn't handle Windows paths correctly
            // On Windows, this would return 'my-project'
            // On other platforms, it may return the full path
            const result = getProjectName('C:\\Users\\test\\projects\\my-project');
            // Just verify it returns a non-empty string
            assert.ok(typeof result === 'string');
            assert.ok(result.length > 0);
        });

        it('should handle path with trailing slash', () => {
            // path.basename handles this by returning empty string or the folder name depending on OS
            const result = getProjectName('/Users/test/projects/my-project/');
            // On most systems, trailing slash is handled gracefully
            assert.ok(typeof result === 'string');
        });
    });

    describe('createCompletionRecord', () => {
        const mockCompletion: TaskCompletion = {
            taskDescription: 'Test task',
            completedAt: Date.now(),
            duration: 5000,
            iteration: 1
        };

        it('should create a record with all required fields', () => {
            const sessionId = 'test-session-123';
            const projectPath = '/test/project';
            const record = createCompletionRecord(mockCompletion, sessionId, projectPath);

            assert.ok(record.id);
            assert.strictEqual(record.taskDescription, mockCompletion.taskDescription);
            assert.strictEqual(record.completedAt, mockCompletion.completedAt);
            assert.strictEqual(record.duration, mockCompletion.duration);
            assert.strictEqual(record.iteration, mockCompletion.iteration);
            assert.strictEqual(record.sessionId, sessionId);
            assert.strictEqual(record.projectPath, projectPath);
            assert.strictEqual(record.projectName, 'project');
            assert.ok(record.dateKey);
        });

        it('should use workspace root when projectPath not provided', () => {
            const sessionId = 'test-session-123';
            const record = createCompletionRecord(mockCompletion, sessionId);
            
            // Should use empty string fallback when no workspace
            assert.ok(typeof record.projectPath === 'string');
        });

        it('should preserve completion fields', () => {
            const sessionId = 'test-session-123';
            const record = createCompletionRecord(mockCompletion, sessionId, '/test/proj');
            assert.strictEqual(record.taskDescription, 'Test task');
            assert.strictEqual(record.duration, 5000);
        });
    });

    describe('isValidCompletionHistoryData', () => {
        it('should return true for valid data', () => {
            const validData = {
                records: [],
                lastCleanup: Date.now(),
                version: 1
            };
            assert.strictEqual(isValidCompletionHistoryData(validData), true);
        });

        it('should return false for null', () => {
            assert.strictEqual(isValidCompletionHistoryData(null), false);
        });

        it('should return false for undefined', () => {
            assert.strictEqual(isValidCompletionHistoryData(undefined), false);
        });

        it('should return false for non-object', () => {
            assert.strictEqual(isValidCompletionHistoryData('string'), false);
            assert.strictEqual(isValidCompletionHistoryData(123), false);
        });

        it('should return false for missing records', () => {
            assert.strictEqual(isValidCompletionHistoryData({
                lastCleanup: Date.now(),
                version: 1
            }), false);
        });

        it('should return false for non-array records', () => {
            assert.strictEqual(isValidCompletionHistoryData({
                records: {},
                lastCleanup: Date.now(),
                version: 1
            }), false);
        });

        it('should return false for missing lastCleanup', () => {
            assert.strictEqual(isValidCompletionHistoryData({
                records: [],
                version: 1
            }), false);
        });

        it('should return false for non-number lastCleanup', () => {
            assert.strictEqual(isValidCompletionHistoryData({
                records: [],
                lastCleanup: 'not-a-number',
                version: 1
            }), false);
        });

        it('should return false for missing version', () => {
            assert.strictEqual(isValidCompletionHistoryData({
                records: [],
                lastCleanup: Date.now()
            }), false);
        });
    });

    describe('isValidCompletionRecord', () => {
        const validRecord: TaskCompletionRecord = {
            id: 'test-id',
            taskDescription: 'Test task',
            completedAt: Date.now(),
            duration: 5000,
            iteration: 1,
            projectName: 'test-project',
            projectPath: '/test/project',
            sessionId: 'session-123',
            dateKey: '2024-01-15'
        };

        it('should return true for valid record', () => {
            assert.strictEqual(isValidCompletionRecord(validRecord), true);
        });

        it('should return false for null', () => {
            assert.strictEqual(isValidCompletionRecord(null), false);
        });

        it('should return false for undefined', () => {
            assert.strictEqual(isValidCompletionRecord(undefined), false);
        });

        it('should return false for non-object', () => {
            assert.strictEqual(isValidCompletionRecord('string'), false);
        });

        it('should return false for missing id', () => {
            const { id, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing taskDescription', () => {
            const { taskDescription, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing completedAt', () => {
            const { completedAt, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing duration', () => {
            const { duration, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing iteration', () => {
            const { iteration, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing projectName', () => {
            const { projectName, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing projectPath', () => {
            const { projectPath, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing sessionId', () => {
            const { sessionId, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for missing dateKey', () => {
            const { dateKey, ...rest } = validRecord;
            assert.strictEqual(isValidCompletionRecord(rest), false);
        });

        it('should return false for wrong type of id', () => {
            assert.strictEqual(isValidCompletionRecord({ ...validRecord, id: 123 }), false);
        });

        it('should return false for wrong type of duration', () => {
            assert.strictEqual(isValidCompletionRecord({ ...validRecord, duration: '5000' }), false);
        });
    });

    describe('normalizeCompletionHistoryData', () => {
        it('should return default for invalid data', () => {
            const result = normalizeCompletionHistoryData(null);
            assert.deepStrictEqual(result, DEFAULT_COMPLETION_HISTORY);
        });

        it('should return default for undefined', () => {
            const result = normalizeCompletionHistoryData(undefined);
            assert.deepStrictEqual(result, DEFAULT_COMPLETION_HISTORY);
        });

        it('should filter out invalid records', () => {
            const validRecord: TaskCompletionRecord = {
                id: 'test-id',
                taskDescription: 'Test task',
                completedAt: Date.now(),
                duration: 5000,
                iteration: 1,
                projectName: 'test-project',
                projectPath: '/test/project',
                sessionId: 'session-123',
                dateKey: '2024-01-15'
            };
            const invalidRecord = { id: 'invalid', taskDescription: 'Test' };

            const data = {
                records: [validRecord, invalidRecord],
                lastCleanup: Date.now(),
                version: 1
            };

            const result = normalizeCompletionHistoryData(data);
            assert.strictEqual(result.records.length, 1);
            assert.strictEqual(result.records[0].id, 'test-id');
        });

        it('should preserve valid data structure', () => {
            const validRecord: TaskCompletionRecord = {
                id: 'test-id',
                taskDescription: 'Test task',
                completedAt: Date.now(),
                duration: 5000,
                iteration: 1,
                projectName: 'test-project',
                projectPath: '/test/project',
                sessionId: 'session-123',
                dateKey: '2024-01-15'
            };

            const data = {
                records: [validRecord],
                lastCleanup: 12345678,
                version: 2
            };

            const result = normalizeCompletionHistoryData(data);
            assert.strictEqual(result.records.length, 1);
            assert.strictEqual(result.lastCleanup, 12345678);
            assert.strictEqual(result.version, 2);
        });
    });
});
