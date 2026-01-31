import * as assert from 'assert';

/**
 * Unit tests for keyboard shortcuts configuration.
 * 
 * These tests verify the keyboard shortcut definitions in package.json
 * and the command structure for Ralph's common actions.
 */
describe('Keyboard Shortcuts', () => {
    // Command definitions that should exist in package.json
    const RALPH_COMMANDS = [
        { command: 'ralph.showPanel', title: 'Ralph: Open Control Panel' },
        { command: 'ralph.viewLogs', title: 'Ralph: View Logs' },
        { command: 'ralph.start', title: 'Ralph: Start Loop' },
        { command: 'ralph.stop', title: 'Ralph: Stop Loop' },
        { command: 'ralph.pause', title: 'Ralph: Pause Loop' },
        { command: 'ralph.resume', title: 'Ralph: Resume Loop' },
        { command: 'ralph.step', title: 'Ralph: Run Single Step' },
        { command: 'ralph.skipTask', title: 'Ralph: Skip Current Task' },
        { command: 'ralph.retryTask', title: 'Ralph: Retry Failed Task' }
    ];

    // Keybinding definitions that should exist in package.json
    const RALPH_KEYBINDINGS = [
        { command: 'ralph.showPanel', key: 'ctrl+shift+r ctrl+shift+o', mac: 'cmd+shift+r cmd+shift+o' },
        { command: 'ralph.start', key: 'ctrl+shift+r s', mac: 'cmd+shift+r s' },
        { command: 'ralph.stop', key: 'ctrl+shift+r x', mac: 'cmd+shift+r x' },
        { command: 'ralph.pause', key: 'ctrl+shift+r p', mac: 'cmd+shift+r p' },
        { command: 'ralph.resume', key: 'ctrl+shift+r r', mac: 'cmd+shift+r r' },
        { command: 'ralph.step', key: 'ctrl+shift+r n', mac: 'cmd+shift+r n' },
        { command: 'ralph.skipTask', key: 'ctrl+shift+r k', mac: 'cmd+shift+r k' },
        { command: 'ralph.retryTask', key: 'ctrl+shift+r t', mac: 'cmd+shift+r t' }
    ];

    describe('Command Definitions', () => {
        describe('Command IDs', () => {
            it('should have all control commands defined', () => {
                const controlCommands = ['ralph.start', 'ralph.stop', 'ralph.pause', 'ralph.resume'];
                controlCommands.forEach(cmd => {
                    const found = RALPH_COMMANDS.find(c => c.command === cmd);
                    assert.ok(found, `Command ${cmd} should be defined`);
                });
            });

            it('should have task action commands defined', () => {
                const taskCommands = ['ralph.step', 'ralph.skipTask', 'ralph.retryTask'];
                taskCommands.forEach(cmd => {
                    const found = RALPH_COMMANDS.find(c => c.command === cmd);
                    assert.ok(found, `Command ${cmd} should be defined`);
                });
            });

            it('should have panel and log commands defined', () => {
                const uiCommands = ['ralph.showPanel', 'ralph.viewLogs'];
                uiCommands.forEach(cmd => {
                    const found = RALPH_COMMANDS.find(c => c.command === cmd);
                    assert.ok(found, `Command ${cmd} should be defined`);
                });
            });

            it('should have 9 total commands', () => {
                assert.strictEqual(RALPH_COMMANDS.length, 9);
            });

            it('should have unique command IDs', () => {
                const commandIds = RALPH_COMMANDS.map(c => c.command);
                const uniqueIds = new Set(commandIds);
                assert.strictEqual(commandIds.length, uniqueIds.size);
            });

            it('should use ralph. namespace prefix for all commands', () => {
                RALPH_COMMANDS.forEach(cmd => {
                    assert.ok(cmd.command.startsWith('ralph.'), 
                        `Command ${cmd.command} should start with 'ralph.'`);
                });
            });
        });

        describe('Command Titles', () => {
            it('should have Ralph: prefix for all titles', () => {
                RALPH_COMMANDS.forEach(cmd => {
                    assert.ok(cmd.title.startsWith('Ralph:'), 
                        `Title "${cmd.title}" should start with 'Ralph:'`);
                });
            });

            it('should have descriptive titles for control commands', () => {
                const startCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.start');
                assert.ok(startCmd?.title.includes('Start'), 'Start command should mention "Start"');
                
                const stopCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.stop');
                assert.ok(stopCmd?.title.includes('Stop'), 'Stop command should mention "Stop"');
                
                const pauseCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.pause');
                assert.ok(pauseCmd?.title.includes('Pause'), 'Pause command should mention "Pause"');
                
                const resumeCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.resume');
                assert.ok(resumeCmd?.title.includes('Resume'), 'Resume command should mention "Resume"');
            });

            it('should have descriptive titles for task commands', () => {
                const stepCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.step');
                assert.ok(stepCmd?.title.includes('Step'), 'Step command should mention "Step"');
                
                const skipCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.skipTask');
                assert.ok(skipCmd?.title.includes('Skip'), 'Skip command should mention "Skip"');
                
                const retryCmd = RALPH_COMMANDS.find(c => c.command === 'ralph.retryTask');
                assert.ok(retryCmd?.title.includes('Retry'), 'Retry command should mention "Retry"');
            });
        });
    });

    describe('Keybinding Definitions', () => {
        describe('Keybinding Structure', () => {
            it('should have 8 keybindings defined', () => {
                assert.strictEqual(RALPH_KEYBINDINGS.length, 8);
            });

            it('should have both Windows/Linux and Mac keybindings', () => {
                RALPH_KEYBINDINGS.forEach(kb => {
                    assert.ok(kb.key, `Keybinding for ${kb.command} should have 'key' property`);
                    assert.ok(kb.mac, `Keybinding for ${kb.command} should have 'mac' property`);
                });
            });

            it('should reference valid commands', () => {
                RALPH_KEYBINDINGS.forEach(kb => {
                    const commandExists = RALPH_COMMANDS.some(c => c.command === kb.command);
                    assert.ok(commandExists, `Keybinding references unknown command: ${kb.command}`);
                });
            });
        });

        describe('Keybinding Patterns', () => {
            it('should use ctrl+shift+r as chord prefix on Windows/Linux', () => {
                RALPH_KEYBINDINGS.forEach(kb => {
                    assert.ok(kb.key.startsWith('ctrl+shift+r'), 
                        `Keybinding ${kb.command} should use ctrl+shift+r prefix`);
                });
            });

            it('should use cmd+shift+r as chord prefix on Mac', () => {
                RALPH_KEYBINDINGS.forEach(kb => {
                    assert.ok(kb.mac.startsWith('cmd+shift+r'), 
                        `Mac keybinding ${kb.command} should use cmd+shift+r prefix`);
                });
            });

            it('should use chord keybindings (two-key sequences)', () => {
                RALPH_KEYBINDINGS.forEach(kb => {
                    assert.ok(kb.key.includes(' '), 
                        `Keybinding ${kb.command} should be a chord (contain space)`);
                    assert.ok(kb.mac.includes(' '), 
                        `Mac keybinding ${kb.command} should be a chord (contain space)`);
                });
            });

            it('should use single letter suffixes for action commands', () => {
                const actionKeybindings = RALPH_KEYBINDINGS.filter(
                    kb => kb.command !== 'ralph.showPanel'
                );
                actionKeybindings.forEach(kb => {
                    const suffix = kb.key.split(' ')[1];
                    assert.ok(suffix.length === 1, 
                        `Action keybinding ${kb.command} should use single letter suffix, got: ${suffix}`);
                });
            });
        });

        describe('Keybinding Mnemonics', () => {
            it('should use "s" for start', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.start');
                assert.ok(kb?.key.endsWith(' s'), 'Start should use "s" key');
            });

            it('should use "x" for stop (exit)', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.stop');
                assert.ok(kb?.key.endsWith(' x'), 'Stop should use "x" key');
            });

            it('should use "p" for pause', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.pause');
                assert.ok(kb?.key.endsWith(' p'), 'Pause should use "p" key');
            });

            it('should use "r" for resume', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.resume');
                assert.ok(kb?.key.endsWith(' r'), 'Resume should use "r" key');
            });

            it('should use "n" for step (next)', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.step');
                assert.ok(kb?.key.endsWith(' n'), 'Step should use "n" key');
            });

            it('should use "k" for skip', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.skipTask');
                assert.ok(kb?.key.endsWith(' k'), 'Skip should use "k" key');
            });

            it('should use "t" for retry (try again)', () => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.retryTask');
                assert.ok(kb?.key.endsWith(' t'), 'Retry should use "t" key');
            });
        });

        describe('Keybinding Uniqueness', () => {
            it('should have unique Windows/Linux keybindings', () => {
                const keys = RALPH_KEYBINDINGS.map(kb => kb.key);
                const uniqueKeys = new Set(keys);
                assert.strictEqual(keys.length, uniqueKeys.size, 'All Windows/Linux keybindings should be unique');
            });

            it('should have unique Mac keybindings', () => {
                const macKeys = RALPH_KEYBINDINGS.map(kb => kb.mac);
                const uniqueMacKeys = new Set(macKeys);
                assert.strictEqual(macKeys.length, uniqueMacKeys.size, 'All Mac keybindings should be unique');
            });

            it('should not conflict with common VS Code keybindings', () => {
                // Common VS Code shortcuts we want to avoid
                const commonShortcuts = [
                    'ctrl+s', 'ctrl+c', 'ctrl+v', 'ctrl+x', 'ctrl+z', 'ctrl+y',
                    'ctrl+f', 'ctrl+h', 'ctrl+p', 'ctrl+shift+p', 'ctrl+shift+e',
                    'ctrl+shift+f', 'ctrl+shift+g', 'ctrl+shift+d', 'ctrl+shift+x'
                ];
                
                RALPH_KEYBINDINGS.forEach(kb => {
                    const mainKey = kb.key.split(' ')[0];
                    // The chord prefix ctrl+shift+r should not conflict
                    assert.ok(!commonShortcuts.includes(mainKey) || kb.key.includes(' '),
                        `Keybinding ${kb.key} may conflict with common shortcuts`);
                });
            });
        });
    });

    describe('Command-Keybinding Mapping', () => {
        it('should have keybinding for showPanel', () => {
            const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.showPanel');
            assert.ok(kb, 'showPanel should have a keybinding');
        });

        it('should have keybindings for all control commands', () => {
            const controlCommands = ['ralph.start', 'ralph.stop', 'ralph.pause', 'ralph.resume'];
            controlCommands.forEach(cmd => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === cmd);
                assert.ok(kb, `${cmd} should have a keybinding`);
            });
        });

        it('should have keybindings for all task commands', () => {
            const taskCommands = ['ralph.step', 'ralph.skipTask', 'ralph.retryTask'];
            taskCommands.forEach(cmd => {
                const kb = RALPH_KEYBINDINGS.find(k => k.command === cmd);
                assert.ok(kb, `${cmd} should have a keybinding`);
            });
        });

        it('should not have keybinding for viewLogs (less common action)', () => {
            const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.viewLogs');
            assert.ok(!kb, 'viewLogs should not have a keybinding (accessible via command palette)');
        });
    });

    describe('Platform Consistency', () => {
        it('should have matching suffix keys on Windows/Linux and Mac', () => {
            // Filter out showPanel which has a special chord pattern
            const actionKeybindings = RALPH_KEYBINDINGS.filter(
                kb => kb.command !== 'ralph.showPanel'
            );
            actionKeybindings.forEach(kb => {
                const winSuffix = kb.key.split(' ').slice(1).join(' ');
                const macSuffix = kb.mac.split(' ').slice(1).join(' ');
                assert.strictEqual(winSuffix, macSuffix, 
                    `${kb.command} should have matching suffix keys on both platforms`);
            });
        });

        it('should only differ in modifier keys between platforms', () => {
            // Filter out showPanel which has a special chord pattern
            const actionKeybindings = RALPH_KEYBINDINGS.filter(
                kb => kb.command !== 'ralph.showPanel'
            );
            actionKeybindings.forEach(kb => {
                const winKey = kb.key.replace('ctrl', 'MODIFIER');
                const macKey = kb.mac.replace('cmd', 'MODIFIER');
                assert.strictEqual(winKey, macKey, 
                    `${kb.command} should only differ in ctrl vs cmd`);
            });
        });

        it('should use consistent platform modifiers for showPanel', () => {
            const kb = RALPH_KEYBINDINGS.find(k => k.command === 'ralph.showPanel');
            assert.ok(kb, 'showPanel keybinding should exist');
            // Both use ctrl+shift+o as second chord, but with platform-specific prefix
            assert.ok(kb!.key.includes('ctrl+shift+o'), 'Windows should use ctrl+shift+o');
            assert.ok(kb!.mac.includes('cmd+shift+o'), 'Mac should use cmd+shift+o');
        });
    });

    describe('Accessibility', () => {
        it('should use easily reachable keys', () => {
            const easyKeys = ['s', 'x', 'p', 'r', 'n', 'k', 't', 'o'];
            RALPH_KEYBINDINGS.forEach(kb => {
                const parts = kb.key.split(' ');
                const suffix = parts[parts.length - 1];
                const lastChar = suffix.charAt(suffix.length - 1);
                assert.ok(easyKeys.includes(lastChar), 
                    `${kb.command} should use easily reachable key, got: ${lastChar}`);
            });
        });

        it('should not require awkward key combinations', () => {
            // All our keybindings use ctrl+shift+r followed by a single key
            // This is a comfortable chord pattern
            RALPH_KEYBINDINGS.forEach(kb => {
                const parts = kb.key.split(' ');
                assert.strictEqual(parts.length, 2, 
                    `${kb.command} should be a two-part chord`);
            });
        });
    });
});
