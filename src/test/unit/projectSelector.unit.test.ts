import * as assert from 'assert';
import { WebviewBuilder } from '../../webviewBuilder';
import { ProjectMessageHandler } from '../../messageHandlers/projectMessageHandler';
import { ProjectInfo, LoopExecutionState } from '../../types';
import { MockLoopOrchestrator, MockOrchestratorOptions } from '../mocks/orchestrator';

// Helper function to create orchestrator with options
function createTestOrchestrator(options?: MockOrchestratorOptions): MockLoopOrchestrator {
    return new MockLoopOrchestrator(options);
}

describe('Project Selector Support', () => {
    
    describe('WebviewBuilder', () => {
        it('should not show project selector when no projects provided', () => {
            const builder = new WebviewBuilder({ projects: [] });
            const html = builder.buildHeader();
            assert.ok(!html.includes('project-selector'));
        });

        it('should show project selector when multiple projects provided', () => {
             const projects: ProjectInfo[] = [
                 { name: 'Project A', path: '/path/to/a' },
                 { name: 'Project B', path: '/path/to/b' }
             ];
             const builder = new WebviewBuilder({ projects, currentProject: '/path/to/a' });
             const html = builder.buildHeader();
             
             assert.ok(html.includes('project-selector'), 'Header should contain project selector class');
             assert.ok(html.includes('<select id="projectSelect"'), 'Header should contain select element');
             assert.ok(html.includes('Project A'), 'Should show Project A');
             assert.ok(html.includes('Project B'), 'Should show Project B');
             assert.ok(html.includes('value="/path/to/a"'), 'Should have value for Project A');
             assert.ok(html.includes('selected'), 'Should have selected attribute');
        });
    });

    describe('ProjectMessageHandler', () => {
        const handler = new ProjectMessageHandler();

        it('should handle switchProject command', () => {
            assert.ok(handler.handledCommands.includes('switchProject'));
            // @ts-ignore
            assert.ok(handler.canHandle({ command: 'switchProject' }));
        });

        it('should emit switchProject event', (done) => {
            const message = { command: 'switchProject', projectPath: '/new/path' };
            const context = {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                emit: (event: string, data: any) => {
                    try {
                        assert.strictEqual(event, 'switchProject');
                        assert.deepStrictEqual(data, { projectPath: '/new/path' });
                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            };
            
            // @ts-ignore - Partial context mock
            handler.handle(message, context);
        });
    });

    describe('Switch Project Without Stopping', () => {
        it('should preserve running state when switching projects', async () => {
            const orchestrator = createTestOrchestrator({ pendingTasks: 5 });
            
            // Start the loop
            await orchestrator.startLoop();
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
            
            // Switch project - should remain running
            await orchestrator.switchProject('/new/project');
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
            assert.ok(orchestrator.wasCalled('switchProject'));
        });

        it('should preserve paused state when switching projects', async () => {
            const orchestrator = createTestOrchestrator({ pendingTasks: 5 });
            
            // Start and pause the loop
            await orchestrator.startLoop();
            orchestrator.pauseLoop();
            assert.strictEqual(orchestrator.getIsPaused(), true);
            
            // Switch project - should remain paused
            await orchestrator.switchProject('/new/project');
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
            assert.strictEqual(orchestrator.getIsPaused(), true);
        });

        it('should clear history when switching projects', async () => {
            const orchestrator = createTestOrchestrator({ pendingTasks: 5 });
            
            // Add some task history
            orchestrator.addTaskCompletion({
                taskDescription: 'Test task',
                completedAt: Date.now(),
                duration: 1000,
                iteration: 1
            });
            
            assert.strictEqual(orchestrator.getHistory().length, 1);
            
            // Switch project - history should be cleared
            await orchestrator.switchProject('/new/project');
            
            assert.strictEqual(orchestrator.getHistory().length, 0);
        });

        it('should log project switch message', async () => {
            const orchestrator = createTestOrchestrator();
            
            await orchestrator.switchProject('/path/to/my-project');
            
            const logs = orchestrator.getLogs();
            assert.ok(logs.some((log: { message: string }) => log.message.includes('Switched to project')));
            assert.ok(logs.some((log: { message: string }) => log.message.includes('my-project')));
        });

        it('should preserve idle state when switching projects', async () => {
            const orchestrator = createTestOrchestrator();
            
            // Orchestrator starts in IDLE state
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.IDLE);
            
            // Switch project - should remain idle
            await orchestrator.switchProject('/new/project');
            
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.IDLE);
        });

        it('should record switchProject call with project path', async () => {
            const orchestrator = createTestOrchestrator();
            
            await orchestrator.switchProject('/path/to/project');
            
            assert.ok(orchestrator.wasCalled('switchProject'));
            const calls = orchestrator.getMethodCalls().filter(c => c.method === 'switchProject');
            assert.strictEqual(calls.length, 1);
            assert.deepStrictEqual(calls[0].args, ['/path/to/project']);
        });

        it('should support multiple project switches', async () => {
            const orchestrator = createTestOrchestrator({ pendingTasks: 5 });
            
            await orchestrator.startLoop();
            
            await orchestrator.switchProject('/project1');
            await orchestrator.switchProject('/project2');
            await orchestrator.switchProject('/project3');
            
            const calls = orchestrator.getMethodCalls().filter(c => c.method === 'switchProject');
            assert.strictEqual(calls.length, 3);
            
            // Loop should still be running
            assert.strictEqual(orchestrator.getState(), LoopExecutionState.RUNNING);
        });

        it('should extract project name from path for logging', async () => {
            const orchestrator = createTestOrchestrator();
            
            await orchestrator.switchProject('/very/long/path/to/awesome-project');
            
            const logs = orchestrator.getLogs();
            const switchLog = logs.find((log: { message: string }) => log.message.includes('Switched to project'));
            assert.ok(switchLog);
            assert.ok(switchLog.message.includes('awesome-project'));
            // Should not include full path in log
            assert.ok(!switchLog.message.includes('/very/long/path/to/'));
        });
    });
});
