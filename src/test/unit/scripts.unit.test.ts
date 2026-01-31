import * as assert from 'assert';
import { getClientScripts } from '../../webview/scripts';
import { addBreakpointTests } from './breakpoint.test';

describe('Webview Scripts', () => {
    describe('getClientScripts', () => {
        it('should return a string', () => {
            const scripts = getClientScripts();
            assert.strictEqual(typeof scripts, 'string');
        });

        it('should include vscode API acquisition', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('acquireVsCodeApi'));
        });

        it('should include send function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function send(command)'));
        });

        it('should include toggleRequirements function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function toggleRequirements()'));
        });

        it('should include updateRequirements function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateRequirements()'));
        });

        it('should include openSettings function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function openSettings()'));
        });

        it('should include closeSettings function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function closeSettings()'));
        });

        it('should include updateSettings function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateSettings()'));
        });

        it('should include updateUI function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateUI(status, iteration, taskInfo, immediate)'));
        });

        it('should include showCountdown function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function showCountdown(seconds, immediate)'));
        });

        it('should include addLog function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function addLog(message'));
        });

        it('should include generatePrd function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function generatePrd()'));
        });

        it('should include message event listener', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("window.addEventListener('message'"));
        });

        it('should handle update message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'update'"));
        });

        it('should handle countdown message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'countdown'"));
        });

        it('should handle log message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'log'"));
        });

        it('should handle prdGenerating message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'prdGenerating'"));
        });

        it('should handle history message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'history'"));
        });

        it('should handle timing message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'timing'"));
        });

        it('should handle stats message type', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("msg.type === 'stats'"));
        });

        it('should include updateStatsDisplay function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateStatsDisplay(stats, immediate)'));
        });

        it('should include updatePipeline function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updatePipeline(completed, pending)'));
        });

        it('should include updateTiming function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateTiming(startTime, taskHistory, pendingTasks)'));
        });

        it('should include updateElapsedAndEta function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateElapsedAndEta()'));
        });

        it('should include formatTime function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function formatTime(ms)'));
        });

        it('should include updateTimeline function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateTimeline(history, immediate, useRAF)'));
        });

        it('should include addPendingBars function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function addPendingBars(bars, labels, startNum, count, avgDuration, maxDuration)'));
        });

        it('should include addCurrentTaskBar function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function addCurrentTaskBar(bars, labels, taskNum, maxDuration)'));
        });

        it('should include updateCurrentTaskBar function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function updateCurrentTaskBar()'));
        });

        it('should include formatDuration function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function formatDuration(ms)'));
        });

        it('should include getTaskStats function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function getTaskStats()'));
        });

        it('should include TOTAL_COUNTDOWN constant', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('TOTAL_COUNTDOWN'));
        });

        it('should include sessionStartTime variable', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('sessionStartTime'));
        });

        it('should include currentTaskHistory variable', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('currentTaskHistory'));
        });

        it('should include status labels for idle, running, waiting, paused', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("'idle'"));
            assert.ok(scripts.includes("'running'"));
            assert.ok(scripts.includes("'waiting'"));
            assert.ok(scripts.includes("'paused'"));
        });

        it('should post messages to vscode', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('vscode.postMessage'));
        });

        it('should include optimistic UI updates in send function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command === 'start'"));
            assert.ok(scripts.includes("command === 'pause'"));
            assert.ok(scripts.includes("command === 'stop'"));
        });

        it('should handle skipTask command', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command === 'skipTask'"));
            assert.ok(scripts.includes("showControlButtonLoading('btnSkip', 'Skipping...')"));
        });

        it('should handle retryTask command', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command === 'retryTask'"));
            assert.ok(scripts.includes("showControlButtonLoading('btnRetry', 'Retrying...')"));
        });

        it('should handle completeAllTasks command', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command === 'completeAllTasks'"));
            assert.ok(scripts.includes("showControlButtonLoading('btnCompleteAll', 'Completing...')"));
        });

        it('should handle resetAllTasks command', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command === 'resetAllTasks'"));
            assert.ok(scripts.includes("showControlButtonLoading('btnResetAll', 'Resetting...')"));
        });

        it('should include btnSkip in resetControlButtonLoading', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes("'btnStop', 'btnNext', 'btnSkip', 'btnRetry'"));
        });

        it('should include btnRetry in resetControlButtonLoading', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes("'btnRetry'"));
        });

        it('should include btnCompleteAll in resetControlButtonLoading', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes("'btnCompleteAll'"));
        });

        it('should include btnResetAll in resetControlButtonLoading', () => {
             const scripts = getClientScripts();
             assert.ok(scripts.includes("'btnResetAll'"));
        });

        it('should include all batch operation buttons in resetControlButtonLoading', () => {
             const scripts = getClientScripts();
             // Check that both batch buttons are in the reset array
             assert.ok(scripts.includes("'btnCompleteAll', 'btnResetAll'"));
        });

        it('should handle requirements checkbox values', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('reqWriteTests'));
            assert.ok(scripts.includes('reqRunTests'));
            assert.ok(scripts.includes('reqTypeCheck'));
            assert.ok(scripts.includes('reqLinting'));
            assert.ok(scripts.includes('reqDocs'));
            assert.ok(scripts.includes('reqCommit'));
        });
    });

    describe('Error Boundary', () => {
        it('should include reportError function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function reportError(message, source, lineno, colno, error)'));
        });

        it('should include window.onerror handler', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('window.onerror = function(message, source, lineno, colno, error)'));
        });

        it('should include window.onunhandledrejection handler', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('window.onunhandledrejection = function(event)'));
        });

        it('should include safeExecute wrapper function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function safeExecute(fn, fallbackValue, context)'));
        });

        it('should include showErrorInUI function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function showErrorInUI(message)'));
        });

        it('should post webviewError command when error occurs', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command: 'webviewError'"));
        });

        it('should include error object with message, source, lineno, colno, stack in reportError', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('message: message'));
            assert.ok(scripts.includes('source: source'));
            assert.ok(scripts.includes('lineno: lineno'));
            assert.ok(scripts.includes('colno: colno'));
            assert.ok(scripts.includes('stack: error && error.stack'));
        });

        it('should handle unhandled promise rejections', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("'Unhandled Promise rejection: '"));
        });

        it('should display error entries with error class in UI', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("entry.className = 'log-entry error'"));
        });
    });

    describe('Panel State Persistence', () => {
        it('should include COLLAPSIBLE_SECTIONS constant', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('COLLAPSIBLE_SECTIONS'));
        });

        it('should include getCollapsedSections function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function getCollapsedSections()'));
        });

        it('should include getScrollPosition function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function getScrollPosition()'));
        });

        it('should include savePanelState function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function savePanelState()'));
        });

        it('should include restorePanelState function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function restorePanelState()'));
        });

        it('should include setupScrollTracking function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function setupScrollTracking()'));
        });

        it('should include saveScrollPosition function', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('function saveScrollPosition()'));
        });

        it('should post panelStateChanged command', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("command: 'panelStateChanged'"));
        });

        it('should reference window.__RALPH_PANEL_STATE__', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('window.__RALPH_PANEL_STATE__'));
        });

        it('should check for reqContent section', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("'reqContent'"));
        });

        it('should reference mainContent element for scroll tracking', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("getElementById('mainContent')"));
        });

        it('should save state when toggleRequirements is called', () => {
            const scripts = getClientScripts();
            // Check that savePanelState is called in toggleRequirements
            const toggleRequirementsMatch = scripts.match(/function toggleRequirements\(\)[\s\S]*?savePanelState\(\)/);
            assert.ok(toggleRequirementsMatch, 'toggleRequirements should call savePanelState');
        });

        it('should debounce scroll position saves', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('scrollSaveTimeout'));
        });

        it('should use requestAnimationFrame for scroll restoration', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('requestAnimationFrame'));
        });

        it('should restore collapsed sections from state', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('state.collapsedSections'));
        });

        it('should restore scroll position from state', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('state.scrollPosition'));
        });

        it('should call restorePanelState on DOM ready', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("document.readyState === 'loading'"));
            assert.ok(scripts.includes('DOMContentLoaded'));
        });

        it('should call setupScrollTracking on initialization', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('setupScrollTracking()'));
        });

        // Tests for VS Code restart panel restoration
        it('should call vscode.setState() to persist state for VS Code restart', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('vscode.setState(state)'), 'savePanelState should call vscode.setState for cross-session persistence');
        });

        it('should call vscode.getState() to restore state after VS Code restart', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes('vscode.getState()'), 'restorePanelState should check vscode.getState first for restart restoration');
        });

        it('should prioritize vscode.getState over injected state', () => {
            const scripts = getClientScripts();
            // The code should check vscode.getState first, then fall back to window.__RALPH_PANEL_STATE__
            const getStateCall = scripts.indexOf('vscode.getState()');
            const injectedStateCheck = scripts.indexOf('window.__RALPH_PANEL_STATE__');
            
            // Both should exist
            assert.ok(getStateCall !== -1, 'vscode.getState() should be present');
            assert.ok(injectedStateCheck !== -1, 'window.__RALPH_PANEL_STATE__ should be present');
            
            // vscode.getState should be checked before the fallback in restorePanelState
            const restoreFnMatch = scripts.match(/function restorePanelState\(\)[\s\S]*?vscode\.getState\(\)[\s\S]*?window\.__RALPH_PANEL_STATE__/);
            assert.ok(restoreFnMatch, 'restorePanelState should check vscode.getState before window.__RALPH_PANEL_STATE__');
        });

        it('should use fallback to injected state when vscode.getState returns null', () => {
            const scripts = getClientScripts();
            // Should have conditional fallback logic
            assert.ok(scripts.includes('if (!state)'), 'Should fall back to injected state when getState returns null');
            assert.ok(scripts.includes('state = window.__RALPH_PANEL_STATE__'), 'Should assign injected state as fallback');
        });
    });

    describe('ARIA Accessibility in Scripts', () => {
        it('should update aria-expanded in toggleRequirements', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("setAttribute('aria-expanded'"), 'toggleRequirements should update aria-expanded attribute');
        });

        it('should set aria-expanded to false when section is collapsed', () => {
            const scripts = getClientScripts();
            // When collapsed, aria-expanded should be the inverse (not collapsed = expanded)
            assert.ok(scripts.includes("String(!isCollapsed)"), 'Should set aria-expanded to opposite of collapsed state');
        });

        it('should query requirements header for aria-expanded updates', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("querySelector('.requirements-header')"), 'Should find requirements header to update ARIA state');
        });

        it('should update aria-expanded in restorePanelState', () => {
            const scripts = getClientScripts();
            // When restoring collapsed sections, should update ARIA state
            assert.ok(scripts.includes("header.setAttribute('aria-expanded', 'false')"), 'Should set aria-expanded to false when restoring collapsed section');
        });

        it('should add role="listitem" to log entries in addLog', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("setAttribute('role', 'listitem')"), 'addLog should set role=listitem on entries');
        });

        it('should add aria-label to time span in addLog', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("aria-label=\"Time: '"), 'addLog should include aria-label on time span');
        });

        it('should add role="listitem" to error entries in showErrorInUI', () => {
            const scripts = getClientScripts();
            // showErrorInUI should also add role=listitem
            const showErrorMatch = scripts.match(/function showErrorInUI[\s\S]*?setAttribute\('role', 'listitem'\)/);
            assert.ok(showErrorMatch, 'showErrorInUI should set role=listitem on error entries');
        });

        it('should add aria-label to error entries in showErrorInUI', () => {
            const scripts = getClientScripts();
            assert.ok(scripts.includes("setAttribute('aria-label', 'Error: '"), 'showErrorInUI should set aria-label for errors');
        });

        it('should have aria-hidden on error emoji in showErrorInUI', () => {
            const scripts = getClientScripts();
            // The emoji should be hidden from screen readers
            assert.ok(scripts.includes('aria-hidden="true">⚠️'), 'Warning emoji should have aria-hidden');
        });
    });

    describe('Virtual Scrolling for Large Log Lists', () => {
        describe('Virtual scroll constants', () => {
            it('should define VIRTUAL_SCROLL_ITEM_HEIGHT', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_ITEM_HEIGHT'), 'Should define item height constant');
            });

            it('should define VIRTUAL_SCROLL_OVERSCAN', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_OVERSCAN'), 'Should define overscan constant');
            });

            it('should define VIRTUAL_SCROLL_THRESHOLD', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_THRESHOLD'), 'Should define threshold constant');
            });

            it('should define VIRTUAL_SCROLL_DEBOUNCE_MS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_DEBOUNCE_MS'), 'Should define debounce constant');
            });

            it('should set reasonable item height', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_ITEM_HEIGHT = 28'), 'Should set item height to 28px');
            });

            it('should set reasonable threshold', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('VIRTUAL_SCROLL_THRESHOLD = 100'), 'Should set threshold to 100 entries');
            });
        });

        describe('virtualLogData store', () => {
            it('should define virtualLogData array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let virtualLogData = []'), 'Should define virtualLogData as empty array');
            });

            it('should define virtualLogEntryId counter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let virtualLogEntryId = 0'), 'Should define entry ID counter');
            });
        });

        describe('virtualScrollState object', () => {
            it('should define virtualScrollState', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let virtualScrollState = {'), 'Should define virtualScrollState object');
            });

            it('should have enabled property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('enabled: false'), 'Should have enabled property');
            });

            it('should have startIndex property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('startIndex: 0'), 'Should have startIndex property');
            });

            it('should have endIndex property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('endIndex: 0'), 'Should have endIndex property');
            });

            it('should have scrollTop property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('scrollTop: 0'), 'Should have scrollTop property');
            });

            it('should have containerHeight property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('containerHeight: 0'), 'Should have containerHeight property');
            });

            it('should have totalHeight property', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('totalHeight: 0'), 'Should have totalHeight property');
            });
        });

        describe('initVirtualScroll function', () => {
            it('should define initVirtualScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function initVirtualScroll()'), 'Should define initVirtualScroll function');
            });

            it('should get logContent element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('logContent')"), 'Should get logContent element');
            });

            it('should add scroll event listener', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("addEventListener('scroll', handleVirtualScroll"), 'Should add scroll listener');
            });

            it('should use passive scroll listener', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('passive: true'), 'Should use passive option for performance');
            });

            it('should set up ResizeObserver', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('ResizeObserver'), 'Should use ResizeObserver for container size changes');
            });
        });

        describe('handleVirtualScroll function', () => {
            it('should define handleVirtualScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleVirtualScroll(event)'), 'Should define handleVirtualScroll function');
            });

            it('should check if virtual scroll is enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (!virtualScrollState.enabled) return'), 'Should check enabled state');
            });

            it('should use requestAnimationFrame for smooth scrolling', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('requestAnimationFrame(function()'), 'Should use requestAnimationFrame');
            });
        });

        describe('calculateVisibleRange function', () => {
            it('should define calculateVisibleRange function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function calculateVisibleRange()'), 'Should define calculateVisibleRange function');
            });

            it('should use getFilteredLogData', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('getFilteredLogData()'), 'Should use getFilteredLogData for filtering');
            });

            it('should calculate startIndex with Math.max', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('Math.max(0,'), 'Should use Math.max to prevent negative index');
            });

            it('should calculate endIndex with Math.min', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('Math.min(totalItems,'), 'Should use Math.min to prevent exceeding total');
            });
        });

        describe('getFilteredLogData function', () => {
            it('should define getFilteredLogData function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getFilteredLogData()'), 'Should define getFilteredLogData function');
            });

            it('should filter by currentLogFilter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("currentLogFilter !== 'all' && entry.type !== currentLogFilter"), 'Should filter by log level');
            });

            it('should filter by currentLogSearch', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("currentLogSearch && !logMatchesSearch(entry.message)"), 'Should filter by search');
            });
        });

        describe('renderVirtualLogEntries function', () => {
            it('should define renderVirtualLogEntries function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function renderVirtualLogEntries()'), 'Should define renderVirtualLogEntries function');
            });

            it('should create top spacer element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("virtual-scroll-spacer"), 'Should create spacer elements');
            });

            it('should set totalHeight on state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualScrollState.totalHeight = totalItems * VIRTUAL_SCROLL_ITEM_HEIGHT'), 'Should calculate total height');
            });

            it('should update aria-setsize', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('aria-setsize'"), 'Should set aria-setsize for accessibility');
            });
        });

        describe('createLogEntryHtml function', () => {
            it('should define createLogEntryHtml function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createLogEntryHtml(entry, index)'), 'Should define createLogEntryHtml function');
            });

            it('should include data-entry-id attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("data-entry-id="), 'Should include data-entry-id attribute');
            });

            it('should include aria-posinset attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("aria-posinset="), 'Should include aria-posinset for accessibility');
            });

            it('should set fixed height style', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("style=\"height: ' + VIRTUAL_SCROLL_ITEM_HEIGHT + 'px;\""), 'Should set fixed height');
            });
        });

        describe('shouldEnableVirtualScroll function', () => {
            it('should define shouldEnableVirtualScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function shouldEnableVirtualScroll()'), 'Should define shouldEnableVirtualScroll function');
            });

            it('should check against threshold', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogData.length >= VIRTUAL_SCROLL_THRESHOLD'), 'Should compare against threshold');
            });
        });

        describe('enableVirtualScroll function', () => {
            it('should define enableVirtualScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function enableVirtualScroll()'), 'Should define enableVirtualScroll function');
            });

            it('should set enabled to true', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualScrollState.enabled = true'), 'Should set enabled state');
            });

            it('should add virtual-scroll-enabled class', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('virtual-scroll-enabled')"), 'Should add CSS class');
            });
        });

        describe('disableVirtualScroll function', () => {
            it('should define disableVirtualScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function disableVirtualScroll()'), 'Should define disableVirtualScroll function');
            });

            it('should set enabled to false', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualScrollState.enabled = false'), 'Should set enabled state to false');
            });

            it('should remove virtual-scroll-enabled class', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.remove('virtual-scroll-enabled')"), 'Should remove CSS class');
            });

            it('should call renderAllLogEntriesTraditional', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('renderAllLogEntriesTraditional()'), 'Should fall back to traditional rendering');
            });
        });

        describe('clearVirtualLogData function', () => {
            it('should define clearVirtualLogData function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function clearVirtualLogData()'), 'Should define clearVirtualLogData function');
            });

            it('should reset virtualLogData to empty array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogData = []'), 'Should clear log data');
            });

            it('should reset virtualLogEntryId', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogEntryId = 0'), 'Should reset ID counter');
            });

            it('should reset virtualScrollState.enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualScrollState.enabled = false'), 'Should reset enabled state');
            });
        });

        describe('scrollToLogEntry function', () => {
            it('should define scrollToLogEntry function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function scrollToLogEntry(index)'), 'Should define scrollToLogEntry function');
            });

            it('should calculate scroll position', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('index * VIRTUAL_SCROLL_ITEM_HEIGHT'), 'Should calculate scroll position from index');
            });
        });

        describe('scrollToLogBottom function', () => {
            it('should define scrollToLogBottom function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function scrollToLogBottom()'), 'Should define scrollToLogBottom function');
            });

            it('should calculate scroll position for bottom', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('filteredData.length * VIRTUAL_SCROLL_ITEM_HEIGHT - virtualScrollState.containerHeight'), 'Should calculate bottom scroll position');
            });
        });

        describe('getVirtualScrollState function', () => {
            it('should define getVirtualScrollState function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getVirtualScrollState()'), 'Should define getVirtualScrollState function');
            });

            it('should return enabled state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('enabled: virtualScrollState.enabled'), 'Should return enabled state');
            });

            it('should return totalEntries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('totalEntries: virtualLogData.length'), 'Should return total entries');
            });

            it('should return threshold', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('threshold: VIRTUAL_SCROLL_THRESHOLD'), 'Should return threshold');
            });
        });

        describe('getAllLogData function', () => {
            it('should define getAllLogData function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getAllLogData()'), 'Should define getAllLogData function');
            });

            it('should return a copy using slice', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogData.slice()'), 'Should return copy of log data');
            });
        });

        describe('addLog with virtual scrolling', () => {
            it('should add entry to virtualLogData', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogData.push(entry)'), 'Should push entry to virtual data');
            });

            it('should check if virtual scroll should be enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('shouldEnableVirtualScroll()'), 'Should check threshold');
            });

            it('should enable virtual scroll when threshold reached', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('enableVirtualScroll()'), 'Should enable virtual scroll');
            });

            it('should announce when virtual scroll is enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Virtual scrolling enabled for '"), 'Should announce to screen reader');
            });

            it('should render differently based on mode', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (virtualScrollState.enabled)'), 'Should check mode before rendering');
            });

            it('should call scrollToLogBottom when auto scroll enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('scrollToLogBottom()'), 'Should scroll to bottom');
            });
        });

        describe('initialization', () => {
            it('should call initVirtualScroll on DOM ready', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('initVirtualScroll()'), 'Should initialize virtual scroll on DOM ready');
            });
        });
    });

    describe('Log Level Filtering', () => {
        describe('LOG_LEVELS constant', () => {
            it('should include LOG_LEVELS constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('LOG_LEVELS'), 'Should define LOG_LEVELS constant');
            });

            it('should include all log levels', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'all'"), 'Should include all level');
                assert.ok(scripts.includes("'info'"), 'Should include info level');
                assert.ok(scripts.includes("'warning'"), 'Should include warning level');
                assert.ok(scripts.includes("'error'"), 'Should include error level');
                assert.ok(scripts.includes("'success'"), 'Should include success level');
            });
        });

        describe('currentLogFilter variable', () => {
            it('should have currentLogFilter variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("let currentLogFilter = 'all'"), 'Should initialize currentLogFilter to all');
            });
        });

        describe('addLog function with data-level', () => {
            it('should set data-level attribute on log entries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('data-level', type)"), 'addLog should set data-level attribute');
            });

            it('should apply filtered-out class based on current filter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('filtered-out'), 'addLog should handle filtered-out class');
            });

            it('should call updateLogFilterCount after adding log', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateLogFilterCount()'), 'addLog should update filter count');
            });
        });

        describe('filterLogs function', () => {
            it('should have filterLogs function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function filterLogs(level)'), 'Should have filterLogs function');
            });

            it('should update currentLogFilter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('currentLogFilter = level'), 'filterLogs should update currentLogFilter');
            });

            it('should update active button states', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.toggle('active'"), 'filterLogs should toggle active class on buttons');
            });

            it('should update aria-pressed on filter buttons', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('aria-pressed'"), 'filterLogs should update aria-pressed');
            });

            it('should toggle filtered-out class on entries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.toggle('filtered-out'"), 'filterLogs should toggle filtered-out class');
            });

            it('should announce filter change to screen readers', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceToScreenReader'), 'filterLogs should announce changes');
            });
        });

        describe('getLogFilter function', () => {
            it('should have getLogFilter function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLogFilter()'), 'Should have getLogFilter function');
            });

            it('should return currentLogFilter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('return currentLogFilter'), 'getLogFilter should return current filter');
            });
        });

        describe('updateLogFilterCount function', () => {
            it('should have updateLogFilterCount function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateLogFilterCount()'), 'Should have updateLogFilterCount function');
            });

            it('should get logFilterCount element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('logFilterCount')"), 'Should get filter count element');
            });

            it('should count total entries using virtual log data', () => {
                const scripts = getClientScripts();
                // With virtual scrolling, we use virtualLogData.length for total count
                assert.ok(scripts.includes("virtualLogData.length"), 'Should count total log entries from virtual data');
            });

            it('should count visible entries using filtered data', () => {
                const scripts = getClientScripts();
                // With virtual scrolling, we use getFilteredLogData() for visible count
                assert.ok(scripts.includes("getFilteredLogData()"), 'Should count visible entries using filtered data');
            });

            it('should display count text', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("countEl.textContent"), 'Should update count element text');
            });
        });

        describe('clearLogs function', () => {
            it('should have clearLogs function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function clearLogs()'), 'Should have clearLogs function');
            });
        });

        describe('getLogCounts function', () => {
            it('should have getLogCounts function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLogCounts()'), 'Should have getLogCounts function');
            });

            it('should return count object with all levels', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('info: 0'), 'Should have info count');
                assert.ok(scripts.includes('warning: 0'), 'Should have warning count');
                assert.ok(scripts.includes('error: 0'), 'Should have error count');
                assert.ok(scripts.includes('success: 0'), 'Should have success count');
            });
        });

        describe('log message handler with level support', () => {
            it('should support level in log message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('msg.level'), 'Should check msg.level in log handler');
            });

            it('should fallback to highlight-based level', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("msg.highlight ? 'success' : 'info'"), 'Should fallback to highlight logic');
            });
        });
    });

    describe('Copy Log Functionality', () => {
        describe('copyLog function', () => {
            it('should have copyLog function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function copyLog()'), 'Should have copyLog function');
            });

            it('should get btnCopyLog element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('btnCopyLog')"), 'copyLog should get copy button');
            });

            it('should handle empty virtual log data', () => {
                const scripts = getClientScripts();
                // With virtual scrolling, we check virtualLogData.length
                assert.ok(scripts.includes("virtualLogData.length === 0"), 'Should check for empty virtual log data');
                assert.ok(scripts.includes("'No log entries to copy'"), 'Should show info toast for empty log');
            });

            it('should use navigator.clipboard API', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('navigator.clipboard'), 'Should use clipboard API');
                assert.ok(scripts.includes('navigator.clipboard.writeText'), 'Should use writeText method');
            });

            it('should have fallback copy method', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function fallbackCopyToClipboard'), 'Should have fallback method');
            });
        });

        describe('formatLogDataForClipboard function', () => {
            it('should have formatLogDataForClipboard function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function formatLogDataForClipboard(entries)'), 'Should have formatLogDataForClipboard function');
            });

            it('should format entries with time level and message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'[' + entry.time + '] [' + entry.type.toUpperCase()"), 'Should format with brackets');
            });
        });

        describe('formatLogForClipboard function (DOM fallback)', () => {
            it('should have formatLogForClipboard function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function formatLogForClipboard(entries)'), 'Should have formatLogForClipboard function');
            });

            it('should get data-original-text attribute for message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getAttribute('data-original-text')"), 'Should get original text attribute');
            });

            it('should fallback to textContent for message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('msgEl.textContent'), 'Should fallback to textContent');
            });

            it('should join lines with newline', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("lines.join('\\n')"), 'Should join with newline');
            });
        });

        describe('onCopySuccess function', () => {
            it('should have onCopySuccess function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function onCopySuccess(copyBtn)'), 'Should have onCopySuccess function');
            });

            it('should change button label to Copied', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("textContent = 'Copied!'"), 'Should change label to Copied');
            });

            it('should add copied class to button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('copied')"), 'Should add copied class');
            });

            it('should reset button after 2 seconds', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('setTimeout'), 'Should use setTimeout');
                assert.ok(scripts.includes('2000'), 'Should wait 2 seconds');
                assert.ok(scripts.includes("classList.remove('copied')"), 'Should remove copied class');
            });

            it('should show success toast', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showSuccessToast('Log copied to clipboard')"), 'Should show success toast');
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("announceToScreenReader('Log entries copied to clipboard')"), 'Should announce copy success');
            });
        });

        describe('onCopyError function', () => {
            it('should have onCopyError function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function onCopyError(err)'), 'Should have onCopyError function');
            });

            it('should show error toast', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showErrorToast('Failed to copy log to clipboard')"), 'Should show error toast');
            });

            it('should announce error to screen readers', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("announceToScreenReader('Failed to copy log entries')"), 'Should announce copy failure');
            });

            it('should log error to console', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("console.error('Failed to copy log:'"), 'Should log error');
            });
        });

        describe('fallbackCopyToClipboard function', () => {
            it('should have fallbackCopyToClipboard function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function fallbackCopyToClipboard(text, copyBtn)'), 'Should have fallback function');
            });

            it('should create temporary textarea', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("document.createElement('textarea')"), 'Should create textarea');
            });

            it('should position textarea off-screen', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("style.left = '-9999px'"), 'Should position off-screen');
            });

            it('should use execCommand copy', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("document.execCommand('copy')"), 'Should use execCommand');
            });

            it('should remove textarea after copy', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('document.body.removeChild(textarea)'), 'Should remove textarea');
            });
        });

        describe('getLogAsText function', () => {
            it('should have getLogAsText function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLogAsText()'), 'Should have getLogAsText function');
            });

            it('should return empty string if no virtual log data', () => {
                const scripts = getClientScripts();
                // With virtual scrolling, we check virtualLogData.length
                assert.ok(scripts.includes("virtualLogData.length === 0") || scripts.includes("if (virtualLogData.length === 0) return ''"), 'Should return empty string for empty data');
            });

            it('should use formatLogDataForClipboard', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('formatLogDataForClipboard(virtualLogData)'), 'Should format entries from virtual data');
            });
        });
    });

    describe('Log Export Functionality', () => {
        describe('exportLog function', () => {
            it('should have exportLog function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function exportLog()'), 'Should have exportLog function');
            });

            it('should get btnExportLog element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('btnExportLog')"), 'exportLog should get export button');
            });

            it('should handle empty virtual log data', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'No log entries to export'"), 'Should show info toast for empty log');
                assert.ok(scripts.includes("virtualLogData.length === 0"), 'Should check virtualLogData.length');
            });

            it('should map virtual log data for export', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('virtualLogData.map(function(entry)'), 'Should map virtual log data');
            });

            it('should show loading state on export button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("textContent = 'Exporting...'"), 'Should show Exporting text');
                assert.ok(scripts.includes('exportBtn.disabled = true'), 'Should disable button');
            });

            it('should post message to extension', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("command: 'exportLog'"), 'Should send exportLog command');
                assert.ok(scripts.includes('entries: logEntries'), 'Should include entries in message');
            });

            it('should reset button state after delay', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('setTimeout'), 'Should use setTimeout');
                assert.ok(scripts.includes("textContent = 'Export'"), 'Should reset to Export text');
                assert.ok(scripts.includes('exportBtn.disabled = false'), 'Should re-enable button');
            });
        });

        describe('getLogEntriesAsArray function', () => {
            it('should have getLogEntriesAsArray function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLogEntriesAsArray(entries)'), 'Should have getLogEntriesAsArray function');
            });

            it('should return array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const result = []'), 'Should initialize result array');
                assert.ok(scripts.includes('return result'), 'Should return result array');
            });

            it('should iterate over entries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('entries.forEach(function(entry)'), 'Should iterate entries');
            });

            it('should extract time from entry', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("entry.querySelector('.log-time')"), 'Should get time element');
                assert.ok(scripts.includes("time: time"), 'Should include time in result');
            });

            it('should extract level from entry', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getAttribute('data-level')"), 'Should get level attribute');
                assert.ok(scripts.includes("level: level"), 'Should include level in result');
            });

            it('should extract message from entry', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("entry.querySelector('.log-msg')"), 'Should get message element');
                assert.ok(scripts.includes("message: msg"), 'Should include message in result');
            });

            it('should handle original text attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getAttribute('data-original-text')"), 'Should check for original text');
            });

            it('should push structured object to result', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('result.push({'), 'Should push object');
            });
        });

        describe('onExportSuccess function', () => {
            it('should have onExportSuccess function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function onExportSuccess()'), 'Should have onExportSuccess function');
            });

            it('should change button label to Exported', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("textContent = 'Exported!'"), 'Should change label to Exported');
            });

            it('should add exported class to button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('exported')"), 'Should add exported class');
            });

            it('should reset button after 2 seconds', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.remove('exported')"), 'Should remove exported class');
            });

            it('should show success toast', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showSuccessToast('Log exported to file')"), 'Should show success toast');
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("announceToScreenReader('Log entries exported to file')"), 'Should announce export success');
            });
        });
    });

    describe('Timestamp Toggle Functionality', () => {
        describe('timestampsVisible variable', () => {
            it('should have timestampsVisible variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let timestampsVisible = true'), 'Should have timestampsVisible variable initialized to true');
            });
        });

        describe('TIMESTAMP_STORAGE_KEY constant', () => {
            it('should have TIMESTAMP_STORAGE_KEY constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("const TIMESTAMP_STORAGE_KEY = 'ralph.logTimestampsVisible'"), 'Should have storage key constant');
            });
        });

        describe('toggleTimestamps function', () => {
            it('should have toggleTimestamps function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function toggleTimestamps()'), 'Should have toggleTimestamps function');
            });

            it('should toggle timestampsVisible state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('timestampsVisible = !timestampsVisible'), 'Should toggle state');
            });

            it('should call updateTimestampVisibility', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateTimestampVisibility()'), 'Should call updateTimestampVisibility');
            });

            it('should call saveTimestampPreference', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('saveTimestampPreference()'), 'Should call saveTimestampPreference');
            });

            it('should call announceTimestampChange', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceTimestampChange()'), 'Should call announceTimestampChange');
            });
        });

        describe('updateTimestampVisibility function', () => {
            it('should have updateTimestampVisibility function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateTimestampVisibility()'), 'Should have updateTimestampVisibility function');
            });

            it('should get logArea element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('logArea')"), 'Should get logArea element');
            });

            it('should get btnToggleTimestamp element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('btnToggleTimestamp')"), 'Should get toggle button');
            });

            it('should add log-area-hide-timestamps class when hidden', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('log-area-hide-timestamps')"), 'Should add hide class');
            });

            it('should remove log-area-hide-timestamps class when visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.remove('log-area-hide-timestamps')"), 'Should remove hide class');
            });

            it('should update aria-pressed attribute on button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('aria-pressed'"), 'Should update aria-pressed');
            });

            it('should update title attribute on button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('title'"), 'Should update title');
            });
        });

        describe('saveTimestampPreference function', () => {
            it('should have saveTimestampPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function saveTimestampPreference()'), 'Should have saveTimestampPreference function');
            });

            it('should use vscode.setState', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('vscode.setState'), 'Should use vscode.setState');
            });

            it('should use vscode.getState to get current state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('vscode.getState()'), 'Should use vscode.getState');
            });

            it('should save timestampsVisible to state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('currentState.timestampsVisible = timestampsVisible'), 'Should save to state');
            });
        });

        describe('restoreTimestampPreference function', () => {
            it('should have restoreTimestampPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function restoreTimestampPreference()'), 'Should have restoreTimestampPreference function');
            });

            it('should use vscode.getState', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('vscode.getState'), 'Should use vscode.getState');
            });

            it('should check if saved state has timestampsVisible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("savedState.timestampsVisible === 'boolean'") || 
                          scripts.includes("typeof savedState.timestampsVisible === 'boolean'"), 'Should check type of saved value');
            });

            it('should call updateTimestampVisibility after restore', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateTimestampVisibility()'), 'Should update visibility after restore');
            });
        });

        describe('announceTimestampChange function', () => {
            it('should have announceTimestampChange function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function announceTimestampChange()'), 'Should have announceTimestampChange function');
            });

            it('should announce Timestamps shown when visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Timestamps shown'"), 'Should have shown message');
            });

            it('should announce Timestamps hidden when not visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Timestamps hidden'"), 'Should have hidden message');
            });

            it('should call announceToScreenReader', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceToScreenReader(message)'), 'Should call announceToScreenReader');
            });
        });

        describe('areTimestampsVisible function', () => {
            it('should have areTimestampsVisible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function areTimestampsVisible()'), 'Should have areTimestampsVisible function');
            });

            it('should return timestampsVisible state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('return timestampsVisible'), 'Should return state');
            });
        });

        describe('setTimestampsVisible function', () => {
            it('should have setTimestampsVisible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function setTimestampsVisible(visible)'), 'Should have setTimestampsVisible function');
            });

            it('should update timestampsVisible state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('timestampsVisible = visible'), 'Should set state');
            });

            it('should call updateTimestampVisibility', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateTimestampVisibility()'), 'Should update visibility');
            });

            it('should call saveTimestampPreference', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('saveTimestampPreference()'), 'Should save preference');
            });
        });

        describe('restoreTimestampPreference in initialization', () => {
            it('should call restoreTimestampPreference on DOM ready', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('restoreTimestampPreference();'), 'Should call restoreTimestampPreference in initialization');
            });
        });
    });

    describe('Auto-Scroll Toggle', () => {
        describe('autoScrollEnabled variable', () => {
            it('should have autoScrollEnabled variable initialized to true', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let autoScrollEnabled = true'), 'Should have autoScrollEnabled variable initialized to true');
            });
        });

        describe('AUTOSCROLL_STORAGE_KEY constant', () => {
            it('should have AUTOSCROLL_STORAGE_KEY constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("const AUTOSCROLL_STORAGE_KEY = 'ralph.logAutoScrollEnabled'"), 'Should have storage key constant');
            });
        });

        describe('toggleAutoScroll function', () => {
            it('should have toggleAutoScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function toggleAutoScroll()'), 'Should have toggleAutoScroll function');
            });

            it('should toggle autoScrollEnabled state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('autoScrollEnabled = !autoScrollEnabled'), 'Should toggle state');
            });

            it('should call updateAutoScrollVisibility', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateAutoScrollVisibility()'), 'Should call updateAutoScrollVisibility');
            });

            it('should call saveAutoScrollPreference', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('saveAutoScrollPreference()'), 'Should call saveAutoScrollPreference');
            });

            it('should call announceAutoScrollChange', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceAutoScrollChange()'), 'Should call announceAutoScrollChange');
            });
        });

        describe('updateAutoScrollVisibility function', () => {
            it('should have updateAutoScrollVisibility function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateAutoScrollVisibility()'), 'Should have updateAutoScrollVisibility function');
            });

            it('should get btnToggleAutoScroll element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('btnToggleAutoScroll')"), 'Should get toggle button');
            });

            it('should update aria-pressed attribute on button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('aria-pressed'"), 'Should update aria-pressed');
            });

            it('should update title attribute on button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("setAttribute('title'"), 'Should update title');
            });
        });

        describe('saveAutoScrollPreference function', () => {
            it('should have saveAutoScrollPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function saveAutoScrollPreference()'), 'Should have saveAutoScrollPreference function');
            });

            it('should use vscode.setState', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('vscode.setState'), 'Should use vscode.setState');
            });

            it('should save autoScrollEnabled to state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('currentState.autoScrollEnabled = autoScrollEnabled'), 'Should save to state');
            });
        });

        describe('restoreAutoScrollPreference function', () => {
            it('should have restoreAutoScrollPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function restoreAutoScrollPreference()'), 'Should have restoreAutoScrollPreference function');
            });

            it('should check if saved state has autoScrollEnabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("typeof savedState.autoScrollEnabled === 'boolean'"), 'Should check type of saved value');
            });

            it('should call updateAutoScrollVisibility after restore', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateAutoScrollVisibility()'), 'Should update visibility after restore');
            });
        });

        describe('announceAutoScrollChange function', () => {
            it('should have announceAutoScrollChange function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function announceAutoScrollChange()'), 'Should have announceAutoScrollChange function');
            });

            it('should announce Auto-scroll enabled when on', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Auto-scroll enabled'"), 'Should have enabled message');
            });

            it('should announce Auto-scroll disabled when off', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Auto-scroll disabled'"), 'Should have disabled message');
            });

            it('should call announceToScreenReader', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceToScreenReader(message)'), 'Should call announceToScreenReader');
            });
        });

        describe('isAutoScrollEnabled function', () => {
            it('should have isAutoScrollEnabled function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isAutoScrollEnabled()'), 'Should have isAutoScrollEnabled function');
            });

            it('should return autoScrollEnabled state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('return autoScrollEnabled'), 'Should return state');
            });
        });

        describe('setAutoScrollEnabled function', () => {
            it('should have setAutoScrollEnabled function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function setAutoScrollEnabled(enabled)'), 'Should have setAutoScrollEnabled function');
            });

            it('should update autoScrollEnabled state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('autoScrollEnabled = enabled'), 'Should set state');
            });

            it('should call updateAutoScrollVisibility', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('updateAutoScrollVisibility()'), 'Should update visibility');
            });

            it('should call saveAutoScrollPreference', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('saveAutoScrollPreference()'), 'Should save preference');
            });
        });

        describe('scrollLogIfEnabled function', () => {
            it('should have scrollLogIfEnabled function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function scrollLogIfEnabled(logArea)'), 'Should have scrollLogIfEnabled function');
            });

            it('should check if autoScrollEnabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (autoScrollEnabled && logArea)'), 'Should check autoScrollEnabled');
            });

            it('should scroll to bottom when enabled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('logArea.scrollTop = logArea.scrollHeight'), 'Should scroll to bottom');
            });
        });

        describe('addLog uses scrollLogIfEnabled', () => {
            it('should call scrollLogIfEnabled in addLog', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('scrollLogIfEnabled(logArea)'), 'Should call scrollLogIfEnabled');
            });
        });

        describe('restoreAutoScrollPreference in initialization', () => {
            it('should call restoreAutoScrollPreference on DOM ready', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('restoreAutoScrollPreference();'), 'Should call restoreAutoScrollPreference in initialization');
            });
        });
    });

    describe('Log Search Functionality', () => {
        describe('currentLogSearch variable', () => {
            it('should have currentLogSearch variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("let currentLogSearch = ''"), 'Should have currentLogSearch variable initialized to empty string');
            });
        });

        describe('searchLogs function', () => {
            it('should have searchLogs function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function searchLogs(query)'), 'Should have searchLogs function');
            });

            it('should convert query to lowercase', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('query.toLowerCase()'), 'Should convert query to lowercase');
            });

            it('should trim query', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('.trim()'), 'Should trim query');
            });

            it('should get logSearchClear button', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('logSearchClear')"), 'Should get clear button');
            });

            it('should get logSearchCount element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getElementById('logSearchCount')"), 'Should get search count element');
            });

            it('should show/hide clear button based on search', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("clearBtn.style.display"), 'Should toggle clear button visibility');
            });

            it('should store original text in data attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("data-original-text"), 'Should store/access data-original-text');
            });

            it('should add search-match class to matching entries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('search-match')"), 'Should add search-match class');
            });

            it('should add search-hidden class to non-matching entries', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("classList.add('search-hidden')"), 'Should add search-hidden class');
            });

            it('should call highlightSearchMatch for matches', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('highlightSearchMatch(originalText, currentLogSearch)'), 'Should call highlightSearchMatch');
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("announceToScreenReader('No matches found"), 'Should announce no matches');
                assert.ok(scripts.includes("match' + (matchCount !== 1 ? 'es' : '') + ' found'"), 'Should announce match count');
            });
        });

        describe('highlightSearchMatch function', () => {
            it('should have highlightSearchMatch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function highlightSearchMatch(text, query)'), 'Should have highlightSearchMatch function');
            });

            it('should return escaped HTML if no query', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (!query) return escapeHtml(text)'), 'Should return escaped text for empty query');
            });

            it('should wrap matches in search-highlight span', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'<span class=\"search-highlight\">'"), 'Should wrap matches in highlight span');
            });

            it('should preserve original case in highlighted text', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('text.slice(matchIndex, matchIndex + query.length)'), 'Should preserve original case');
            });

            it('should handle multiple matches', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('while (matchIndex >= 0)'), 'Should loop through multiple matches');
            });
        });

        describe('clearLogSearch function', () => {
            it('should have clearLogSearch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function clearLogSearch()'), 'Should have clearLogSearch function');
            });

            it('should clear search input value', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("searchInput.value = ''"), 'Should clear input value');
            });

            it('should call searchLogs with empty string', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("searchLogs('')"), 'Should call searchLogs with empty string');
            });
        });

        describe('getLogSearch function', () => {
            it('should have getLogSearch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLogSearch()'), 'Should have getLogSearch function');
            });

            it('should return currentLogSearch', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('return currentLogSearch'), 'Should return current search');
            });
        });

        describe('updateLogSearchCount function', () => {
            it('should have updateLogSearchCount function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateLogSearchCount(matchCount, total)'), 'Should have updateLogSearchCount function');
            });

            it('should clear count when no search', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("countEl.textContent = ''"), 'Should clear count text');
            });

            it('should show "No matches" for zero results', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'No matches'"), 'Should show no matches text');
            });

            it('should add no-matches class for zero results', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'log-search-count no-matches'"), 'Should add no-matches class');
            });

            it('should add has-matches class for results', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'log-search-count has-matches'"), 'Should add has-matches class');
            });

            it('should show match count of total', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("matchCount + ' of ' + total"), 'Should show match of total');
            });
        });

        describe('logMatchesSearch function', () => {
            it('should have logMatchesSearch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function logMatchesSearch(message)'), 'Should have logMatchesSearch function');
            });

            it('should return true when no search active', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (!currentLogSearch) return true'), 'Should return true for no search');
            });

            it('should check if message includes search query', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('message.toLowerCase().includes(currentLogSearch)'), 'Should check message includes query');
            });
        });

        describe('addLog search integration', () => {
            it('should store original message in data attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("msgEl.setAttribute('data-original-text', message)"), 'Should store original message');
            });

            it('should apply highlight when search matches', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (currentLogSearch && logMatchesSearch(message))'), 'Should check for search match');
            });

            it('should add search-hidden class when no match', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("entry.classList.add('search-hidden')"), 'Should hide non-matching entries');
            });

            it('should update search count when adding entry during search', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("if (currentLogSearch) {"), 'Should check for active search');
                // With virtual scrolling, search count is updated using getFilteredLogData()
                assert.ok(scripts.includes("getFilteredLogData()") || scripts.includes("logMatchesSearch"), 'Should count search matches');
            });
        });
    });

    describe('Keyboard Navigation', () => {
        describe('FOCUSABLE_SELECTORS constant', () => {
            it('should include buttons', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'button:not([disabled])'"), 'Should include enabled buttons in focusable selectors');
            });

            it('should include inputs', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'input:not([disabled])'"), 'Should include enabled inputs in focusable selectors');
            });

            it('should include textareas', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'textarea:not([disabled])'"), 'Should include enabled textareas in focusable selectors');
            });

            it('should include selects', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'select:not([disabled])'"), 'Should include enabled selects in focusable selectors');
            });

            it('should include elements with tabindex', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('[tabindex]:not([tabindex="-1"])'), 'Should include elements with positive tabindex');
            });

            it('should include links with href', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'a[href]'"), 'Should include anchor links in focusable selectors');
            });

            it('should include labels with for attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'label[for]'"), 'Should include labels with for attribute in focusable selectors');
            });
        });

        describe('getFocusableElements function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getFocusableElements()'), 'getFocusableElements function should be defined');
            });

            it('should check if settings overlay is visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("settingsOverlay.classList.contains('visible')"), 'Should check if settings overlay is visible for focus trap');
            });

            it('should query focusable elements within settings overlay when visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('settingsOverlay.querySelectorAll(FOCUSABLE_SELECTORS)'), 'Should query elements within settings overlay');
            });

            it('should query all focusable elements when settings overlay is not visible', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('document.querySelectorAll(FOCUSABLE_SELECTORS)'), 'Should query all document focusable elements');
            });
        });

        describe('getCurrentFocus function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getCurrentFocus()'), 'getCurrentFocus function should be defined');
            });

            it('should return document.activeElement', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('return document.activeElement'), 'Should return the currently focused element');
            });
        });

        describe('moveFocus function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function moveFocus(reverse)'), 'moveFocus function should be defined');
            });

            it('should get focusable elements', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const focusable = getFocusableElements()'), 'Should get list of focusable elements');
            });

            it('should get current focus', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const current = getCurrentFocus()'), 'Should get current focused element');
            });

            it('should handle wrap around to end when going backwards', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('nextIndex = focusable.length - 1'), 'Should wrap to end when going backwards past beginning');
            });

            it('should handle wrap around to beginning when going forwards', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('nextIndex = 0'), 'Should wrap to beginning when going forwards past end');
            });

            it('should focus the next element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('nextElement.focus()'), 'Should call focus on the next element');
            });
        });

        describe('handleEscape function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleEscape()'), 'handleEscape function should be defined');
            });

            it('should close settings overlay if open', () => {
                const scripts = getClientScripts();
                // The function should call closeSettings when overlay is visible
                const handleEscapeMatch = scripts.match(/function handleEscape[\s\S]*?closeSettings\(\)/);
                assert.ok(handleEscapeMatch, 'Should call closeSettings when overlay is visible');
            });

            it('should return focus to settings button after closing', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('settingsButton.focus()'), 'Should focus settings button after closing overlay');
            });

            it('should focus main content when no overlay is open', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('mainContent.focus()'), 'Should focus main content when Escape is pressed without overlay');
            });

            it('should fall back to body.focus if mainContent not found', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('document.body.focus()'), 'Should focus body as fallback');
            });
        });

        describe('handleEnter function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleEnter(event)'), 'handleEnter function should be defined');
            });

            it('should handle button clicks', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("tagName === 'button'"), 'Should check for button elements');
            });

            it('should click non-disabled buttons', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('target.click()'), 'Should click the target element');
            });

            it('should handle checkbox toggling', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("target.type === 'checkbox'"), 'Should check for checkbox inputs');
            });

            it('should toggle checkbox checked state', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('target.checked = !target.checked'), 'Should toggle checkbox checked state');
            });

            it('should dispatch change event after toggling checkbox', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("new Event('change'"), 'Should create change event');
                assert.ok(scripts.includes('target.dispatchEvent(changeEvent)'), 'Should dispatch change event');
            });

            it('should handle elements with role="button"', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("getAttribute('role') === 'button'"), 'Should handle role=button elements');
            });

            it('should handle labels with for attribute', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('target.htmlFor'), 'Should check for htmlFor property on labels');
            });
        });

        describe('handleGlobalKeydown function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleGlobalKeydown(event)'), 'handleGlobalKeydown function should be defined');
            });

            it('should handle Escape key', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("key === 'Escape'"), 'Should check for Escape key');
            });

            it('should handle Tab key', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("key === 'Tab'"), 'Should check for Tab key');
            });

            it('should handle Enter key', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("key === 'Enter'"), 'Should check for Enter key');
            });

            it('should prevent default for Escape when handled', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('event.preventDefault()'), 'Should prevent default behavior');
            });

            it('should implement focus trap for Tab in settings overlay', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('moveFocus(event.shiftKey)'), 'Should call moveFocus with shiftKey for Tab navigation');
            });

            it('should skip Enter handling for textareas', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("event.target.tagName.toLowerCase() === 'textarea'"), 'Should not handle Enter in textarea');
            });
        });

        describe('setupKeyboardNavigation function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function setupKeyboardNavigation()'), 'setupKeyboardNavigation function should be defined');
            });

            it('should add keydown event listener', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("document.addEventListener('keydown', handleGlobalKeydown)"), 'Should add keydown listener');
            });
        });

        describe('focusSettingsOverlay function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function focusSettingsOverlay()'), 'focusSettingsOverlay function should be defined');
            });

            it('should focus first element in overlay', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('focusable[0].focus()'), 'Should focus first focusable element');
            });
        });

        describe('Initialization', () => {
            it('should call setupKeyboardNavigation on DOMContentLoaded', () => {
                const scripts = getClientScripts();
                // When document is loading, should add DOMContentLoaded listener that calls setupKeyboardNavigation
                const initMatch = scripts.match(/DOMContentLoaded[\s\S]*?setupKeyboardNavigation\(\)/);
                assert.ok(initMatch, 'Should call setupKeyboardNavigation on DOMContentLoaded');
            });

            it('should call setupKeyboardNavigation immediately if DOM already loaded', () => {
                const scripts = getClientScripts();
                // In the else branch, should call setupKeyboardNavigation
                const elseMatch = scripts.match(/else \{[\s\S]*?setupKeyboardNavigation\(\)/);
                assert.ok(elseMatch, 'Should call setupKeyboardNavigation immediately when DOM is ready');
            });
        });

        describe('openSettings override', () => {
            it('should override openSettings for focus management', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const originalOpenSettings = openSettings'), 'Should save original openSettings');
            });

            it('should call focusSettingsOverlay after opening', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('setTimeout(focusSettingsOverlay'), 'Should call focusSettingsOverlay with timeout');
            });
        });
    });

    describe('Screen Reader Announcements', () => {
        describe('announceToScreenReader function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function announceToScreenReader(message)'), 'announceToScreenReader function should be defined');
            });

            it('should get the srAnnouncer element', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("document.getElementById('srAnnouncer')"), 'Should get srAnnouncer element by ID');
            });

            it('should clear previous content before announcing', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("announcer.textContent = ''"), 'Should clear previous announcement');
            });

            it('should use requestAnimationFrame for DOM update', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('requestAnimationFrame(function()'), 'Should use requestAnimationFrame for announcement');
            });

            it('should set the message as textContent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announcer.textContent = message'), 'Should set message as textContent');
            });
        });

        describe('getStatusAnnouncement function', () => {
            it('should be defined', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getStatusAnnouncement(oldStatus, newStatus, taskInfo)'), 'getStatusAnnouncement function should be defined');
            });

            it('should have announcement for idle status', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'idle': 'Ralph automation is ready.'"), 'Should have idle announcement');
            });

            it('should have announcement for running status', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'running':"), 'Should have running announcement');
            });

            it('should have announcement for waiting status', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'waiting':"), 'Should have waiting announcement');
            });

            it('should have announcement for paused status', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'paused': 'Ralph automation is paused.'"), 'Should have paused announcement');
            });

            it('should handle transition from paused to running', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("oldStatus === 'paused' && newStatus === 'running'"), 'Should handle paused to running transition');
                assert.ok(scripts.includes('Ralph automation resumed'), 'Should announce resume');
            });

            it('should handle transition from running to idle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("oldStatus === 'running' && newStatus === 'idle'"), 'Should handle running to idle transition');
            });

            it('should handle transition from waiting to idle (completion)', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("oldStatus === 'waiting' && newStatus === 'idle'"), 'Should handle waiting to idle transition');
                assert.ok(scripts.includes('Ralph automation completed'), 'Should announce completion');
            });

            it('should include task info in announcements when provided', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Ralph is now working on: ' + taskInfo"), 'Should include task info in running announcement');
            });
        });

        describe('previousStatus tracking', () => {
            it('should track previous status', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("let previousStatus = 'idle'"), 'Should track previous status starting with idle');
            });

            it('should update previousStatus after status change', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('previousStatus = status'), 'Should update previousStatus after change');
            });
        });

        describe('updateUI status change announcements', () => {
            it('should check if status changed', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('status !== previousStatus'), 'Should check if status changed');
            });

            it('should call getStatusAnnouncement on status change', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('getStatusAnnouncement(previousStatus, status, taskInfo)'), 'Should call getStatusAnnouncement');
            });

            it('should call announceToScreenReader with announcement', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('announceToScreenReader(announcement)'), 'Should call announceToScreenReader');
            });
        });

        describe('Task completion announcements', () => {
            it('should track previousCompletedCount', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let previousCompletedCount = 0'), 'Should track previous completed count');
            });

            it('should detect task completions by comparing counts', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('stats.completed > previousCompletedCount'), 'Should detect when completed count increases');
            });

            it('should announce single task completion', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'Task completed. '"), 'Should announce single task completion');
            });

            it('should announce multiple task completions', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("' tasks completed. '"), 'Should announce multiple task completions');
            });

            it('should announce all tasks complete', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("' tasks completed successfully!'"), 'Should announce all tasks complete');
            });

            it('should update previousCompletedCount after announcement', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('previousCompletedCount = stats.completed'), 'Should update previousCompletedCount');
            });
        });
    });

    describe('Loading Spinners', () => {
        describe('Button spinner functions', () => {
            it('should include showButtonSpinner function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showButtonSpinner(button, loadingText)'));
            });

            it('should include hideButtonSpinner function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideButtonSpinner(button)'));
            });

            it('should store original content when showing spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('button.dataset.originalContent = button.innerHTML'));
            });

            it('should store original disabled state when showing spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('button.dataset.originalDisabled'));
            });

            it('should add loading class when showing spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("button.classList.add('loading')"));
            });

            it('should set aria-busy to true when loading', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("button.setAttribute('aria-busy', 'true')"));
            });

            it('should remove loading class when hiding spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("button.classList.remove('loading')"));
            });

            it('should remove aria-busy when hiding spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("button.removeAttribute('aria-busy')"));
            });

            it('should restore original content when hiding spinner', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('button.innerHTML = button.dataset.originalContent'));
            });
        });

        describe('Control button loading functions', () => {
            it('should include showControlButtonLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showControlButtonLoading(buttonId, loadingText)'));
            });

            it('should include hideControlButtonLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideControlButtonLoading(buttonId)'));
            });

            it('should include resetControlButtonLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function resetControlButtonLoading()'));
            });

            it('should reset all control buttons in resetControlButtonLoading', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'btnStart', 'btnPause', 'btnResume', 'btnStop', 'btnNext'"));
            });
        });

        describe('Refresh button loading functions', () => {
            it('should include showRefreshLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showRefreshLoading()'));
            });

            it('should include hideRefreshLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideRefreshLoading()'));
            });
        });

        describe('Generate PRD loading functions', () => {
            it('should include showGenerateLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showGenerateLoading()'));
            });

            it('should include hideGenerateLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideGenerateLoading()'));
            });

            it('should show loading spinner when generatePrd is called', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('showGenerateLoading()'));
            });
        });

        describe('Loading spinners in send function', () => {
            it('should show loading spinner when start command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showControlButtonLoading('btnStart', 'Starting...')"));
            });

            it('should show loading spinner when pause command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showControlButtonLoading('btnPause', 'Pausing...')"));
            });

            it('should show loading spinner when resume command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showControlButtonLoading('btnResume', 'Resuming...')"));
            });

            it('should show loading spinner when stop command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showControlButtonLoading('btnStop', 'Stopping...')"));
            });

            it('should show loading spinner when next command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("showControlButtonLoading('btnNext', 'Stepping...')"));
            });

            it('should show loading spinner when refresh command is sent', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('showRefreshLoading()'));
            });
        });

        describe('Loading spinner cleanup in message handler', () => {
            it('should reset control button loading on update message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('resetControlButtonLoading()'));
            });

            it('should hide refresh loading on update message', () => {
                const scripts = getClientScripts();
                // Check that hideRefreshLoading is called in the update message handler
                assert.ok(scripts.includes('hideRefreshLoading()'));
            });

            it('should handle prdComplete message type', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("msg.type === 'prdComplete'"));
            });

            it('should hide generate loading on prdComplete message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('hideGenerateLoading()'));
            });

            it('should hide refresh loading on stats message', () => {
                const scripts = getClientScripts();
                // Check that hideRefreshLoading is called before updateStatsDisplay
                const statsHandler = scripts.indexOf("msg.type === 'stats'");
                const hideRefresh = scripts.indexOf('hideRefreshLoading()', statsHandler);
                const updateStats = scripts.indexOf('updateStatsDisplay(msg)', statsHandler);
                assert.ok(hideRefresh > statsHandler && hideRefresh < updateStats, 'hideRefreshLoading should be called before updateStatsDisplay');
            });
        });

        describe('Toast Notifications', () => {
            describe('Toast Constants', () => {
                it('should define TOAST_ICONS object', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('const TOAST_ICONS'));
                });

                it('should include success icon in TOAST_ICONS', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("success: '<svg"));
                });

                it('should include error icon in TOAST_ICONS', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("error: '<svg"));
                });

                it('should include warning icon in TOAST_ICONS', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("warning: '<svg"));
                });

                it('should include info icon in TOAST_ICONS', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("info: '<svg"));
                });

                it('should include dismiss icon in TOAST_ICONS', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("dismiss: '<svg"));
                });

                it('should define TOAST_DEFAULT_DURATION constant', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('const TOAST_DEFAULT_DURATION'));
                });

                it('should set TOAST_DEFAULT_DURATION to 5000ms', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('TOAST_DEFAULT_DURATION = 5000'));
                });

                it('should define TOAST_MAX_VISIBLE constant', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('const TOAST_MAX_VISIBLE'));
                });

                it('should set TOAST_MAX_VISIBLE to 5', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('TOAST_MAX_VISIBLE = 5'));
                });

                it('should define toastIdCounter variable', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('let toastIdCounter'));
                });
            });

            describe('Toast Functions', () => {
                it('should include showToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showToast(options)'));
                });

                it('should include dismissToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function dismissToast(toastId)'));
                });

                it('should include dismissAllToasts function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function dismissAllToasts()'));
                });

                it('should include showSuccessToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showSuccessToast(message, title)'));
                });

                it('should include showErrorToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showErrorToast(message, title)'));
                });

                it('should include showWarningToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showWarningToast(message, title)'));
                });

                it('should include showInfoToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showInfoToast(message, title)'));
                });
            });

            describe('Toast HTML Generation', () => {
                it('should create toast element with correct class', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.className = 'toast ' + type"));
                });

                it('should set toast id', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('toast.id = toastId'));
                });

                it('should set role=alert on toast', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.setAttribute('role', 'alert')"));
                });

                it('should set aria-live=assertive on toast', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.setAttribute('aria-live', 'assertive')"));
                });

                it('should set aria-atomic=true on toast', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.setAttribute('aria-atomic', 'true')"));
                });

                it('should include toast icon in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<div class=\"toast-icon\">'"));
                });

                it('should include toast content container in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<div class=\"toast-content\">"));
                });

                it('should include toast title in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<div class=\"toast-title\">'"));
                });

                it('should include toast message in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<div class=\"toast-message\">'"));
                });

                it('should include dismiss button in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<button class=\"toast-dismiss\""));
                });

                it('should include toast progress bar in HTML', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("html += '<div class=\"toast-progress animate\""));
                });
            });

            describe('Toast Dismissal', () => {
                it('should add dismissing class when dismissing', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.classList.add('dismissing')"));
                });

                it('should check for already dismissing toast', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("toast.classList.contains('dismissing')"));
                });

                it('should remove toast from DOM after animation', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('toast.parentNode.removeChild(toast)'));
                });

                it('should use setTimeout for animation delay', () => {
                    const scripts = getClientScripts();
                    // Check for setTimeout in dismissToast context
                    const dismissFunction = scripts.indexOf('function dismissToast(toastId)');
                    const nextFunction = scripts.indexOf('function dismissAllToasts()');
                    const setTimeoutPos = scripts.indexOf('setTimeout(function()', dismissFunction);
                    assert.ok(setTimeoutPos > dismissFunction && setTimeoutPos < nextFunction, 
                        'setTimeout should be inside dismissToast function');
                });
            });

            describe('Toast Message Handler', () => {
                it('should handle toast message type', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("msg.type === 'toast'"));
                });

                it('should call showToast when toast message received', () => {
                    const scripts = getClientScripts();
                    // Verify showToast is called in the toast message handler
                    const toastHandler = scripts.indexOf("msg.type === 'toast'");
                    const showToastCall = scripts.indexOf('showToast({', toastHandler);
                    assert.ok(showToastCall > toastHandler && showToastCall < toastHandler + 500,
                        'showToast should be called in toast message handler');
                });

                it('should pass toastType from message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('type: msg.toastType'));
                });

                it('should pass title from message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('title: msg.title'));
                });

                it('should pass message from message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('message: msg.message'));
                });

                it('should pass duration from message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('duration: msg.duration'));
                });

                it('should pass dismissible from message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('dismissible: msg.dismissible'));
                });
            });

            describe('Toast on PRD Events', () => {
                it('should show info toast on prdGenerating message', () => {
                    const scripts = getClientScripts();
                    const prdHandler = scripts.indexOf("msg.type === 'prdGenerating'");
                    const infoToast = scripts.indexOf("showInfoToast('Copilot is generating your PRD...'", prdHandler);
                    assert.ok(infoToast > prdHandler && infoToast < prdHandler + 500,
                        'showInfoToast should be called for prdGenerating');
                });

                it('should show success toast on prdComplete message', () => {
                    const scripts = getClientScripts();
                    const prdCompleteHandler = scripts.indexOf("msg.type === 'prdComplete'");
                    const successToast = scripts.indexOf("showSuccessToast('PRD has been generated successfully!'", prdCompleteHandler);
                    assert.ok(successToast > prdCompleteHandler && successToast < prdCompleteHandler + 500,
                        'showSuccessToast should be called for prdComplete');
                });
            });

            describe('Toast on Error Events', () => {
                it('should handle error message type', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("msg.type === 'error'"));
                });

                it('should show error toast on error message', () => {
                    const scripts = getClientScripts();
                    const errorHandler = scripts.indexOf("msg.type === 'error'");
                    const errorToast = scripts.indexOf('showErrorToast(msg.message', errorHandler);
                    assert.ok(errorToast > errorHandler && errorToast < errorHandler + 200,
                        'showErrorToast should be called for error message');
                });
            });

            describe('Toast on Task Completion', () => {
                it('should show success toast when tasks are completed', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showSuccessToast(toastMessage, 'Task Completed')"));
                });

                it('should show success toast when all tasks are completed', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showSuccessToast('All ' + stats.completed + ' tasks have been completed!'"));
                });
            });

            describe('Toast on Status Changes', () => {
                it('should include showStatusToast function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showStatusToast(oldStatus, newStatus, taskInfo)'));
                });

                it('should call showStatusToast on status change', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('showStatusToast(previousUIStatus, status, taskInfo)'));
                });

                it('should show info toast on automation start', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showInfoToast(msg, 'Started')"));
                });

                it('should show warning toast on pause', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showWarningToast('Automation has been paused', 'Paused')"));
                });

                it('should show info toast on resume', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showInfoToast(msg, 'Resumed')"));
                });

                it('should show info toast on stop', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("showInfoToast('Automation has stopped', 'Stopped')"));
                });
            });

            describe('Toast Helper Functions', () => {
                it('should set longer duration for error toasts', () => {
                    const scripts = getClientScripts();
                    // Check that showErrorToast uses 8000ms duration
                    const errorToastFn = scripts.indexOf('function showErrorToast(message, title)');
                    const durationPos = scripts.indexOf('duration: 8000', errorToastFn);
                    const nextFn = scripts.indexOf('function showWarningToast', errorToastFn);
                    assert.ok(durationPos > errorToastFn && durationPos < nextFn,
                        'Error toasts should have 8000ms duration');
                });

                it('should set longer duration for warning toasts', () => {
                    const scripts = getClientScripts();
                    // Check that showWarningToast uses 6000ms duration
                    const warningToastFn = scripts.indexOf('function showWarningToast(message, title)');
                    const durationPos = scripts.indexOf('duration: 6000', warningToastFn);
                    const nextFn = scripts.indexOf('function showInfoToast', warningToastFn);
                    assert.ok(durationPos > warningToastFn && durationPos < nextFn,
                        'Warning toasts should have 6000ms duration');
                });

                it('should use default title for error toasts', () => {
                    const scripts = getClientScripts();
                    const errorToastFn = scripts.indexOf('function showErrorToast(message, title)');
                    const titlePos = scripts.indexOf("title || 'Error'", errorToastFn);
                    assert.ok(titlePos > errorToastFn, 'Error toast should have default Error title');
                });

                it('should use default title for warning toasts', () => {
                    const scripts = getClientScripts();
                    const warningToastFn = scripts.indexOf('function showWarningToast(message, title)');
                    const titlePos = scripts.indexOf("title || 'Warning'", warningToastFn);
                    assert.ok(titlePos > warningToastFn, 'Warning toast should have default Warning title');
                });
            });

            describe('Toast Max Visible Limit', () => {
                it('should check for existing toasts before adding new one', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("container.querySelectorAll('.toast:not(.dismissing)')"));
                });

                it('should dismiss oldest toast when limit reached', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('existingToasts.length >= TOAST_MAX_VISIBLE'));
                });

                it('should get oldest toast for dismissal', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('const oldest = existingToasts[0]'));
                });

                it('should dismiss oldest by id', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('dismissToast(oldest.id)'));
                });
            });
        });

        describe('Task Progress Animations', () => {
            describe('Progress Animation Functions', () => {
                it('should include startTaskExecution function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function startTaskExecution()'));
                });

                it('should include updateTaskProgress function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function updateTaskProgress(percent, animate)'));
                });

                it('should include completeTaskExecution function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function completeTaskExecution()'));
                });

                it('should include stopTaskExecution function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function stopTaskExecution()'));
                });

                it('should include animateBarCompletion function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function animateBarCompletion(index)'));
                });

                it('should include checkTaskCompletion function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function checkTaskCompletion(completedCount)'));
                });
            });

            describe('startTaskExecution behavior', () => {
                it('should add executing class to task section', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function startTaskExecution()');
                    const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.add('executing')"));
                });

                it('should remove completing class when starting', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function startTaskExecution()');
                    const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.remove('completing')"));
                });

                it('should add indeterminate class to progress bar', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function startTaskExecution()');
                    const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("progressBar.classList.add('indeterminate')"));
                });

                it('should set aria-valuetext for accessibility', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function startTaskExecution()');
                    const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'Task in progress'"));
                });

                it('should track execution start time', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function startTaskExecution()');
                    const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('taskExecutionStartTime = Date.now()'));
                });
            });

            describe('updateTaskProgress behavior', () => {
                it('should remove indeterminate class', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskProgress(percent, animate)');
                    const fnEnd = scripts.indexOf('function completeTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("progressBar.classList.remove('indeterminate')"));
                });

                it('should clamp percent between 0 and 100', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskProgress(percent, animate)');
                    const fnEnd = scripts.indexOf('function completeTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('Math.min(Math.max(percent, 0), 100)'));
                });

                it('should update aria-valuenow attribute', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskProgress(percent, animate)');
                    const fnEnd = scripts.indexOf('function completeTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("progress.setAttribute('aria-valuenow'"));
                });

                it('should update aria-valuetext with percentage', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskProgress(percent, animate)');
                    const fnEnd = scripts.indexOf('function completeTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'% complete'"));
                });
            });

            describe('completeTaskExecution behavior', () => {
                it('should remove executing class', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.remove('executing')"));
                });

                it('should add completing class for animation', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.add('completing')"));
                });

                it('should remove completing class after timeout', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.remove('completing')"));
                    assert.ok(fnBody.includes('setTimeout'));
                    assert.ok(fnBody.includes('600'));
                });

                it('should animate progress bar to 100% using RAF', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    // Now uses animateValue for smooth animation to 100%
                    assert.ok(fnBody.includes("animateValue({"));
                    assert.ok(fnBody.includes("id: 'taskProgressComplete'"));
                    assert.ok(fnBody.includes("to: 100"));
                });

                it('should animate progress bar reset using RAF', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    // Now uses animateValue for smooth animation back to 0%
                    assert.ok(fnBody.includes("id: 'taskProgressReset'"));
                    assert.ok(fnBody.includes("to: 0"));
                });

                it('should set aria-valuetext to task complete', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'Task complete'"));
                });

                it('should reset execution start time', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function completeTaskExecution()');
                    const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('taskExecutionStartTime = null'));
                });
            });

            describe('stopTaskExecution behavior', () => {
                it('should remove both executing and completing classes', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function stopTaskExecution()');
                    const fnEnd = scripts.indexOf('function animateBarCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("taskSection.classList.remove('executing', 'completing')"));
                });

                it('should reset progress bar width to 0', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function stopTaskExecution()');
                    const fnEnd = scripts.indexOf('function animateBarCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("progressBar.style.width = '0%'"));
                });

                it('should set aria-valuetext to Ready', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function stopTaskExecution()');
                    const fnEnd = scripts.indexOf('function animateBarCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'Ready'"));
                });
            });

            describe('animateBarCompletion behavior', () => {
                it('should get timeline bars container', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                    const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("getElementById('timelineBars')"));
                });

                it('should query all timeline bar elements', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                    const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("querySelectorAll('.timeline-bar')"));
                });

                it('should add completed-new class for animation', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                    const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("bar.classList.add('completed-new')"));
                });

                it('should remove completed-new class after animation', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                    const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("bar.classList.remove('completed-new')"));
                    assert.ok(fnBody.includes('setTimeout'));
                    assert.ok(fnBody.includes('500'));
                });

                it('should validate index bounds', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                    const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('index >= 0'));
                    assert.ok(fnBody.includes('index < barElements.length'));
                });
            });

            describe('checkTaskCompletion behavior', () => {
                it('should compare with previous task count', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function checkTaskCompletion(completedCount)');
                    const fnEnd = scripts.indexOf('// ===========', scripts.indexOf('function checkTaskCompletion'));
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('completedCount > previousTaskCount'));
                });

                it('should trigger completeTaskExecution on task completion', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function checkTaskCompletion(completedCount)');
                    const fnEnd = scripts.indexOf('// ===========', scripts.indexOf('function checkTaskCompletion'));
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('completeTaskExecution()'));
                });

                it('should animate newly completed bars in loop', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function checkTaskCompletion(completedCount)');
                    const fnEnd = scripts.indexOf('// ===========', scripts.indexOf('function checkTaskCompletion'));
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('for (let i = previousTaskCount; i < completedCount; i++)'));
                    assert.ok(fnBody.includes('animateBarCompletion(i)'));
                });

                it('should update previousTaskCount', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function checkTaskCompletion(completedCount)');
                    const fnEnd = scripts.indexOf('// ===========', scripts.indexOf('function checkTaskCompletion'));
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('previousTaskCount = completedCount'));
                });
            });

            describe('State Variables', () => {
                it('should track task execution start time', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('let taskExecutionStartTime = null'));
                });

                it('should track progress interval', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('let taskProgressInterval = null'));
                });

                it('should track previous task count for animations', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('let previousTaskCount = 0'));
                });
            });

            describe('Integration with updateUI', () => {
                it('should call startTaskExecution when going from idle to running', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("previousUIStatus === 'idle' && (status === 'running' || status === 'waiting')"));
                    assert.ok(scripts.includes('startTaskExecution()'));
                });

                it('should call stopTaskExecution when going to idle', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("(previousUIStatus === 'running' || previousUIStatus === 'waiting') && status === 'idle'"));
                    assert.ok(scripts.includes('stopTaskExecution()'));
                });

                it('should restart execution on resume from pause', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("previousUIStatus === 'paused' && (status === 'running' || status === 'waiting')"));
                });

                it('should remove executing class when paused', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("(previousUIStatus === 'running' || previousUIStatus === 'waiting') && status === 'paused'"));
                });
            });

            describe('Integration with updateStatsDisplay', () => {
                it('should call checkTaskCompletion on task completions', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('checkTaskCompletion(stats.completed)'));
                });

                it('should call stopTaskExecution when all tasks complete', () => {
                    const scripts = getClientScripts();
                    // Within stats update, check for stopTaskExecution
                    const statsSection = scripts.indexOf('function updateStatsDisplayInternal(stats)');
                    const nextFn = scripts.indexOf('function updateStatsDisplay(stats, immediate)', statsSection);
                    const fnBody = scripts.substring(statsSection, nextFn);
                    assert.ok(fnBody.includes('stopTaskExecution()'));
                });

                it('should add completing class to task section when all done', () => {
                    const scripts = getClientScripts();
                    const statsSection = scripts.indexOf('function updateStatsDisplayInternal(stats)');
                    const nextFn = scripts.indexOf('function updateStatsDisplay(stats, immediate)', statsSection);
                    const fnBody = scripts.substring(statsSection, nextFn);
                    assert.ok(fnBody.includes("taskSection.className = 'task-section completing'"));
                });

                it('should include progress bar in dynamically created task section', () => {
                    const scripts = getClientScripts();
                    const statsSection = scripts.indexOf('function updateStatsDisplayInternal(stats)');
                    const nextFn = scripts.indexOf('function updateStatsDisplay(stats, immediate)', statsSection);
                    const fnBody = scripts.substring(statsSection, nextFn);
                    assert.ok(fnBody.includes('task-progress'));
                    assert.ok(fnBody.includes('task-progress-bar'));
                });

                it('should set executing class on task section based on running state', () => {
                    const scripts = getClientScripts();
                    const statsSection = scripts.indexOf('function updateStatsDisplayInternal(stats)');
                    const nextFn = scripts.indexOf('function updateStatsDisplay(stats, immediate)', statsSection);
                    const fnBody = scripts.substring(statsSection, nextFn);
                    assert.ok(fnBody.includes('isExecuting ? '));
                    assert.ok(fnBody.includes('window.isRunning || window.isWaiting'));
                });

                it('should add indeterminate class to progress bar when executing', () => {
                    const scripts = getClientScripts();
                    const statsSection = scripts.indexOf('function updateStatsDisplayInternal(stats)');
                    const nextFn = scripts.indexOf('function updateStatsDisplay(stats, immediate)', statsSection);
                    const fnBody = scripts.substring(statsSection, nextFn);
                    assert.ok(fnBody.includes("isExecuting ? ' indeterminate' : ''"));
                });
            });
        });
    });

    // ====================================================================
    // PRD Input Inline Validation Tests
    // ====================================================================

    describe('PRD Input Inline Validation', () => {
        describe('Validation Constants', () => {
            it('should inject PRD_INPUT_MIN_LENGTH constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const PRD_INPUT_MIN_LENGTH = '));
            });

            it('should inject PRD_INPUT_MAX_LENGTH constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const PRD_INPUT_MAX_LENGTH = '));
            });

            it('should use min length of 10', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('PRD_INPUT_MIN_LENGTH = 10'));
            });

            it('should use max length of 2000', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('PRD_INPUT_MAX_LENGTH = 2000'));
            });
        });

        describe('VALIDATION_MESSAGES object', () => {
            it('should define VALIDATION_MESSAGES constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const VALIDATION_MESSAGES = {'));
            });

            it('should include empty message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("empty: 'Please describe what you want to build'"));
            });

            it('should include tooShort message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("tooShort: 'Description must be at least"));
            });

            it('should include tooLong message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("tooLong: 'Description cannot exceed"));
            });

            it('should include valid message', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("valid: 'Ready to generate PRD'"));
            });
        });

        describe('VALIDATION_ICONS object', () => {
            it('should define VALIDATION_ICONS constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const VALIDATION_ICONS = {'));
            });

            it('should include error icon SVG', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("error: '<svg class=\"validation-icon\""));
            });

            it('should include success icon SVG', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("success: '<svg class=\"validation-icon\""));
            });
        });

        describe('validatePrdInput function', () => {
            it('should define validatePrdInput function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function validatePrdInput(value)'));
            });

            it('should return error type for empty input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("return { isValid: false, message: VALIDATION_MESSAGES.empty, type: 'error' }"));
            });

            it('should return error type for too short input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("type: 'error' }") && fnBody.includes('VALIDATION_MESSAGES.tooShort'));
            });

            it('should return error type for too long input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("return { isValid: false, message: VALIDATION_MESSAGES.tooLong, type: 'error' }"));
            });

            it('should return success type for valid input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("return { isValid: true, message: VALIDATION_MESSAGES.valid, type: 'success' }"));
            });

            it('should check trimmed length', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('const trimmed = value.trim()'));
            });

            it('should compare against PRD_INPUT_MIN_LENGTH', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('length < PRD_INPUT_MIN_LENGTH'));
            });

            it('should compare against PRD_INPUT_MAX_LENGTH', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function validatePrdInput(value)');
                const fnEnd = scripts.indexOf('function showValidationMessage', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('length > PRD_INPUT_MAX_LENGTH'));
            });
        });

        describe('showValidationMessage function', () => {
            it('should define showValidationMessage function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showValidationMessage(message, type)'));
            });

            it('should get taskInputError element by ID', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskInputError')"));
            });

            it('should update textarea validation classes', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.remove('validation-error', 'validation-success')"));
            });

            it('should add appropriate validation class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('validation-' + type)"));
            });

            it('should update aria-invalid attribute', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-invalid'"));
            });

            it('should set aria-invalid to true for error type', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("type === 'error' ? 'true' : 'false'"));
            });

            it('should update error message innerHTML with icon', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('VALIDATION_ICONS.error'));
                assert.ok(fnBody.includes('VALIDATION_ICONS.success'));
            });

            it('should add visible class when showing message', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showValidationMessage(message, type)');
                const fnEnd = scripts.indexOf('function clearValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'validation-message visible '"));
            });
        });

        describe('clearValidation function', () => {
            it('should define clearValidation function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function clearValidation()'));
            });

            it('should call showValidationMessage with empty values', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function clearValidation()');
                const fnEnd = scripts.indexOf('function updateCharCount', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("showValidationMessage('', null)"));
            });
        });

        describe('updateCharCount function', () => {
            it('should define updateCharCount function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateCharCount(count)'));
            });

            it('should get character count elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCharCount(count)');
                const fnEnd = scripts.indexOf('function handlePrdInputChange', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskInputCharCount')"));
                assert.ok(fnBody.includes("getElementById('charCountValue')"));
            });

            it('should update charValueEl textContent', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCharCount(count)');
                const fnEnd = scripts.indexOf('function handlePrdInputChange', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('charValueEl.textContent = count'));
            });

            it('should add warning class near max length', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCharCount(count)');
                const fnEnd = scripts.indexOf('function handlePrdInputChange', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('warning')"));
            });

            it('should add error class when over max length', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCharCount(count)');
                const fnEnd = scripts.indexOf('function handlePrdInputChange', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('error')"));
            });

            it('should use 90% threshold for warning', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCharCount(count)');
                const fnEnd = scripts.indexOf('function handlePrdInputChange', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('PRD_INPUT_MAX_LENGTH * 0.9'));
            });
        });

        describe('handlePrdInputChange function', () => {
            it('should define handlePrdInputChange function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handlePrdInputChange()'));
            });

            it('should get taskInput element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handlePrdInputChange()');
                const fnEnd = scripts.indexOf('function setupPrdInputValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskInput')"));
            });

            it('should call updateCharCount', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handlePrdInputChange()');
                const fnEnd = scripts.indexOf('function setupPrdInputValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('updateCharCount(trimmedLength)'));
            });

            it('should call validatePrdInput for non-empty input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handlePrdInputChange()');
                const fnEnd = scripts.indexOf('function setupPrdInputValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('validatePrdInput(value)'));
            });

            it('should call clearValidation when field is empty', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handlePrdInputChange()');
                const fnEnd = scripts.indexOf('function setupPrdInputValidation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('clearValidation()'));
            });
        });

        describe('setupPrdInputValidation function', () => {
            it('should define setupPrdInputValidation function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function setupPrdInputValidation()'));
            });

            it('should add input event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupPrdInputValidation()');
                const fnEnd = scripts.indexOf('// ========', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('input', handlePrdInputChange)"));
            });

            it('should add blur event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupPrdInputValidation()');
                const fnEnd = scripts.indexOf('// ========', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('blur'"));
            });

            it('should call updateCharCount on initialization', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupPrdInputValidation()');
                const fnEnd = scripts.indexOf('// ========', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('updateCharCount(textarea.value.trim().length)'));
            });
        });

        describe('generatePrd validation integration', () => {
            it('should call validatePrdInput in generatePrd', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function generatePrd()');
                const fnEnd = scripts.indexOf('// ===', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('validatePrdInput(taskDescription)'));
            });

            it('should call showValidationMessage on invalid input', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function generatePrd()');
                const fnEnd = scripts.indexOf('// ===', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('showValidationMessage(validation.message, validation.type)'));
            });

            it('should focus textarea on validation error', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function generatePrd()');
                const fnEnd = scripts.indexOf('// ===', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('textarea.focus()'));
            });

            it('should announce error to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function generatePrd()');
                const fnEnd = scripts.indexOf('// ===', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("announceToScreenReader('Error: ' + validation.message)"));
            });

            it('should call clearValidation before submission', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function generatePrd()');
                const fnEnd = scripts.indexOf('// ===', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('clearValidation()'));
            });
        });

        describe('Initialization', () => {
            it('should call setupPrdInputValidation in DOMContentLoaded handler', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('setupPrdInputValidation();'));
            });

            it('should call setupPrdInputValidation when DOM already loaded', () => {
                const scripts = getClientScripts();
                // Check it appears twice - once in DOMContentLoaded and once in else branch
                const firstOccurrence = scripts.indexOf('setupPrdInputValidation()');
                const secondOccurrence = scripts.indexOf('setupPrdInputValidation()', firstOccurrence + 1);
                assert.ok(firstOccurrence > 0);
                assert.ok(secondOccurrence > firstOccurrence);
            });
        });
    });

    describe('Skeleton Loaders', () => {
        describe('Constants', () => {
            it('should define SKELETON_IDS array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const SKELETON_IDS = ['));
            });

            it('should include skeletonTimeline in SKELETON_IDS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'skeletonTimeline'"));
            });

            it('should include skeletonTask in SKELETON_IDS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'skeletonTask'"));
            });

            it('should include skeletonLog in SKELETON_IDS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'skeletonLog'"));
            });

            it('should include skeletonRequirements in SKELETON_IDS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'skeletonRequirements'"));
            });

            it('should define CONTENT_IDS array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const CONTENT_IDS = ['));
            });
        });

        describe('showSkeletons function', () => {
            it('should define showSkeletons function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showSkeletons()'));
            });

            it('should add loading class to mainContent', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletons()');
                const fnEnd = scripts.indexOf('function hideSkeletons()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("mainContent.classList.add('loading')"));
            });

            it('should set aria-busy attribute on skeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletons()');
                const fnEnd = scripts.indexOf('function hideSkeletons()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-busy', 'true')"));
            });

            it('should announce loading to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletons()');
                const fnEnd = scripts.indexOf('function hideSkeletons()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("announceToScreenReader('Loading content')"));
            });
        });

        describe('hideSkeletons function', () => {
            it('should define hideSkeletons function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideSkeletons()'));
            });

            it('should remove loading class from mainContent', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideSkeletons()');
                const fnEnd = scripts.indexOf('function showSkeleton(skeletonId)', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("mainContent.classList.remove('loading')"));
            });

            it('should set aria-busy to false on skeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideSkeletons()');
                const fnEnd = scripts.indexOf('function showSkeleton(skeletonId)', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-busy', 'false')"));
            });

            it('should announce content loaded to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideSkeletons()');
                const fnEnd = scripts.indexOf('function showSkeleton(skeletonId)', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("announceToScreenReader('Content loaded')"));
            });
        });

        describe('Individual skeleton show functions', () => {
            it('should define showTimelineSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showTimelineSkeleton()'));
            });

            it('should define hideTimelineSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideTimelineSkeleton()'));
            });

            it('should define showTaskSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showTaskSkeleton()'));
            });

            it('should define hideTaskSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideTaskSkeleton()'));
            });

            it('should define showLogSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showLogSkeleton()'));
            });

            it('should define hideLogSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideLogSkeleton()'));
            });

            it('should define showRequirementsSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showRequirementsSkeleton()'));
            });

            it('should define hideRequirementsSkeleton function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideRequirementsSkeleton()'));
            });
        });

        describe('Generic skeleton functions', () => {
            it('should define showSkeleton function with skeletonId parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showSkeleton(skeletonId)'));
            });

            it('should define hideSkeleton function with skeletonId parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideSkeleton(skeletonId)'));
            });
        });

        describe('areSkeletonsVisible function', () => {
            it('should define areSkeletonsVisible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function areSkeletonsVisible()'));
            });

            it('should check aria-busy attribute', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function areSkeletonsVisible()');
                const fnEnd = scripts.indexOf('function showSkeletonsWithAutoHide', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getAttribute('aria-busy') === 'true'"));
            });

            it('should return boolean', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function areSkeletonsVisible()');
                const fnEnd = scripts.indexOf('function showSkeletonsWithAutoHide', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return SKELETON_IDS.some'));
            });
        });

        describe('showSkeletonsWithAutoHide function', () => {
            it('should define showSkeletonsWithAutoHide function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showSkeletonsWithAutoHide(minDuration)'));
            });

            it('should call showSkeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletonsWithAutoHide(minDuration)');
                const fnEnd = scripts.indexOf('// ====', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('showSkeletons()'));
            });

            it('should use default minDuration of 300ms', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletonsWithAutoHide(minDuration)');
                const fnEnd = scripts.indexOf('// ====', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('minDuration = minDuration || 300'));
            });

            it('should return a function to hide skeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletonsWithAutoHide(minDuration)');
                const fnEnd = scripts.indexOf('// ====', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return function hideAfterLoad()'));
            });

            it('should use setTimeout to respect minimum duration', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletonsWithAutoHide(minDuration)');
                const fnEnd = scripts.indexOf('// ====', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('setTimeout'));
            });
        });

        describe('Message handler integration', () => {
            it('should handle loading message type', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("msg.type === 'loading'"));
            });

            it('should call showSkeletons when isLoading is true', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('if (msg.isLoading)'));
            });

            it('should call hideSkeletons on update message', () => {
                const scripts = getClientScripts();
                // Find the update message handler and verify it hides skeletons
                const updateHandler = scripts.indexOf("msg.type === 'update'");
                const nextHandler = scripts.indexOf("msg.type === 'countdown'");
                const handlerBody = scripts.substring(updateHandler, nextHandler);
                assert.ok(handlerBody.includes('hideSkeletons()'));
            });
        });
    });

    describe('Collapsible Sections for Mobile-Friendly View', () => {
        describe('COLLAPSIBLE_SECTIONS constant', () => {
            it('should include all collapsible section IDs', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("const COLLAPSIBLE_SECTIONS = ['reqContent', 'timelineContent', 'taskContent', 'logContent', 'durationContent']"));
            });

            it('should include reqContent for requirements section', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'reqContent'"));
            });

            it('should include timelineContent for timeline section', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'timelineContent'"));
            });

            it('should include taskContent for task section', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'taskContent'"));
            });

            it('should include logContent for log section', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'logContent'"));
            });
        });

        describe('SECTION_TOGGLE_MAP constant', () => {
            it('should define section toggle mapping', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const SECTION_TOGGLE_MAP = {'));
            });

            it('should map reqContent to reqToggle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'reqContent': 'reqToggle'"));
            });

            it('should map timelineContent to timelineToggle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'timelineContent': 'timelineToggle'"));
            });

            it('should map taskContent to taskToggle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'taskContent': 'taskToggle'"));
            });

            it('should map logContent to logToggle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'logContent': 'logToggle'"));
            });
        });

        describe('MOBILE_COLLAPSE_BREAKPOINT constant', () => {
            it('should define mobile collapse breakpoint', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const MOBILE_COLLAPSE_BREAKPOINT = 320'));
            });
        });

        describe('toggleSection function', () => {
            it('should include toggleSection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function toggleSection(contentId, toggleId, headerElement)'));
            });

            it('should toggle collapsed class on content element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleSection(contentId, toggleId, headerElement)');
                const fnEnd = scripts.indexOf('function getSectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("content.classList.toggle('collapsed')"));
            });

            it('should toggle expanded class on toggle element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleSection(contentId, toggleId, headerElement)');
                const fnEnd = scripts.indexOf('function getSectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("toggle.classList.toggle('expanded')"));
            });

            it('should update aria-expanded attribute', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleSection(contentId, toggleId, headerElement)');
                const fnEnd = scripts.indexOf('function getSectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("headerElement.setAttribute('aria-expanded'"));
            });

            it('should announce state change to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleSection(contentId, toggleId, headerElement)');
                const fnEnd = scripts.indexOf('function getSectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
            });

            it('should save panel state after toggling', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleSection(contentId, toggleId, headerElement)');
                const fnEnd = scripts.indexOf('function getSectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('savePanelState()'));
            });
        });

        describe('getSectionName function', () => {
            it('should include getSectionName function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getSectionName(contentId)'));
            });

            it('should return human-readable names for all sections', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getSectionName(contentId)');
                const fnEnd = scripts.indexOf('function collapseSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'reqContent': 'Acceptance criteria'"));
                assert.ok(fnBody.includes("'timelineContent': 'Timeline'"));
                assert.ok(fnBody.includes("'taskContent': 'Current task'"));
                assert.ok(fnBody.includes("'logContent': 'Activity log'"));
            });

            it('should return Section as fallback', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getSectionName(contentId)');
                const fnEnd = scripts.indexOf('function collapseSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("|| 'Section'"));
            });
        });

        describe('collapseSection function', () => {
            it('should include collapseSection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function collapseSection(contentId)'));
            });

            it('should add collapsed class to content element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function collapseSection(contentId)');
                const fnEnd = scripts.indexOf('function expandSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("content.classList.add('collapsed')"));
            });

            it('should remove expanded class from toggle element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function collapseSection(contentId)');
                const fnEnd = scripts.indexOf('function expandSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("toggle.classList.remove('expanded')"));
            });

            it('should update aria-expanded to false on header', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function collapseSection(contentId)');
                const fnEnd = scripts.indexOf('function expandSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("header.setAttribute('aria-expanded', 'false')"));
            });
        });

        describe('expandSection function', () => {
            it('should include expandSection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function expandSection(contentId)'));
            });

            it('should remove collapsed class from content element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function expandSection(contentId)');
                const fnEnd = scripts.indexOf('function checkMobileBreakpoint', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("content.classList.remove('collapsed')"));
            });

            it('should add expanded class to toggle element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function expandSection(contentId)');
                const fnEnd = scripts.indexOf('function checkMobileBreakpoint', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("toggle.classList.add('expanded')"));
            });

            it('should update aria-expanded to true on header', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function expandSection(contentId)');
                const fnEnd = scripts.indexOf('function checkMobileBreakpoint', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("header.setAttribute('aria-expanded', 'true')"));
            });
        });

        describe('checkMobileBreakpoint function', () => {
            it('should include checkMobileBreakpoint function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function checkMobileBreakpoint()'));
            });

            it('should check window innerWidth against breakpoint', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function checkMobileBreakpoint()');
                const fnEnd = scripts.indexOf('function initMobileCollapsible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('window.innerWidth <= MOBILE_COLLAPSE_BREAKPOINT'));
            });

            it('should add mobile-view class to body when mobile', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function checkMobileBreakpoint()');
                const fnEnd = scripts.indexOf('function initMobileCollapsible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("body.classList.add('mobile-view')"));
            });

            it('should remove mobile-view class from body when not mobile', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function checkMobileBreakpoint()');
                const fnEnd = scripts.indexOf('function initMobileCollapsible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("body.classList.remove('mobile-view')"));
            });

            it('should not auto-collapse taskContent (keeps current task visible)', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function checkMobileBreakpoint()');
                const fnEnd = scripts.indexOf('function initMobileCollapsible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("sectionId !== 'taskContent'"));
            });

            it('should collapse non-essential sections on mobile', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function checkMobileBreakpoint()');
                const fnEnd = scripts.indexOf('function initMobileCollapsible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('collapseSection(sectionId)'));
            });
        });

        describe('initMobileCollapsible function', () => {
            it('should include initMobileCollapsible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function initMobileCollapsible()'));
            });

            it('should call checkMobileBreakpoint on initial load', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initMobileCollapsible()');
                const fnEnd = scripts.indexOf('function toggleRequirements', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('checkMobileBreakpoint()'));
            });

            it('should add resize event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initMobileCollapsible()');
                const fnEnd = scripts.indexOf('function toggleRequirements', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("window.addEventListener('resize'"));
            });

            it('should debounce resize events', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initMobileCollapsible()');
                const fnEnd = scripts.indexOf('function toggleRequirements', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('resizeTimeout'));
                assert.ok(fnBody.includes('setTimeout'));
            });

            it('should use 150ms debounce delay for resize', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initMobileCollapsible()');
                const fnEnd = scripts.indexOf('function toggleRequirements', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('150'));
            });
        });

        describe('Initialization', () => {
            it('should call initMobileCollapsible on DOMContentLoaded', () => {
                const scripts = getClientScripts();
                const initSection = scripts.indexOf("document.addEventListener('DOMContentLoaded'");
                const endSection = scripts.indexOf('} else {', initSection);
                const initBody = scripts.substring(initSection, endSection);
                assert.ok(initBody.includes('initMobileCollapsible()'));
            });

            it('should call initMobileCollapsible when DOM already loaded', () => {
                const scripts = getClientScripts();
                const elseSection = scripts.indexOf('// DOM already loaded');
                const endSection = scripts.indexOf('`;', elseSection);
                const elseBody = scripts.substring(elseSection, endSection);
                assert.ok(elseBody.includes('initMobileCollapsible()'));
            });
        });

        describe('restorePanelState with all collapsible sections', () => {
            it('should use SECTION_TOGGLE_MAP to find toggle elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restorePanelState()');
                const fnEnd = scripts.indexOf('function saveScrollPosition', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('SECTION_TOGGLE_MAP[sectionId]'));
            });

            it('should update aria-expanded on header via previousElementSibling', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restorePanelState()');
                const fnEnd = scripts.indexOf('function saveScrollPosition', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('content.previousElementSibling'));
            });

            it('should handle requirements section special case', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restorePanelState()');
                const fnEnd = scripts.indexOf('function saveScrollPosition', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("sectionId === 'reqContent'"));
            });
        });
    });

    describe('Drag and Drop Task Reordering', () => {
        describe('renderPendingTasks function', () => {
            it('should include renderPendingTasks function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function renderPendingTasks(tasks)'));
            });

            it('should filter for pending, blocked, skipped, and in-progress tasks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("t.status === 'PENDING'"));
                assert.ok(fnBody.includes("t.status === 'BLOCKED'"));
                assert.ok(fnBody.includes("t.status === 'SKIPPED'"));
                assert.ok(fnBody.includes("t.status === 'IN_PROGRESS'"));
            });

            it('should hide task queue section when 1 or fewer pending tasks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('pendingTasks.length <= 1'));
                assert.ok(fnBody.includes("style.display = 'none'"));
            });

            it('should show task queue section when more than 1 pending task', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("style.display = 'block'"));
            });

            it('should create draggable task-queue-item elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('class="task-queue-item"'));
                assert.ok(fnBody.includes('draggable="true"'));
            });

            it('should include data-task-id attribute', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('data-task-id'));
            });

            it('should include drag handle icon', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('drag-handle-icon'));
            });

            it('should call setupDnD after rendering', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function renderPendingTasks(tasks)');
                const fnEnd = scripts.indexOf('function handleDragStart', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('setupDnD()'));
            });
        });

        describe('dragSrcEl variable', () => {
            it('should declare dragSrcEl variable for drag tracking', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let dragSrcEl = null'));
            });
        });

        describe('handleDragStart function', () => {
            it('should include handleDragStart function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDragStart(e)'));
            });

            it('should set dragSrcEl to this', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragStart(e)');
                const fnEnd = scripts.indexOf('function handleDragOver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('dragSrcEl = this'));
            });

            it('should set effectAllowed to move', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragStart(e)');
                const fnEnd = scripts.indexOf('function handleDragOver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("effectAllowed = 'move'"));
            });

            it('should add dragging class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragStart(e)');
                const fnEnd = scripts.indexOf('function handleDragOver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('dragging')"));
            });

            it('should announce to screen reader', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragStart(e)');
                const fnEnd = scripts.indexOf('function handleDragOver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
            });
        });

        describe('handleDragOver function', () => {
            it('should include handleDragOver function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDragOver(e)'));
            });

            it('should call preventDefault', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragOver(e)');
                const fnEnd = scripts.indexOf('function handleDragEnter', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('e.preventDefault()'));
            });

            it('should set dropEffect to move', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragOver(e)');
                const fnEnd = scripts.indexOf('function handleDragEnter', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("dropEffect = 'move'"));
            });

            it('should add drag-over class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragOver(e)');
                const fnEnd = scripts.indexOf('function handleDragEnter', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('drag-over')"));
            });
        });

        describe('handleDragEnter function', () => {
            it('should include handleDragEnter function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDragEnter(e)'));
            });

            it('should add drag-over class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragEnter(e)');
                const fnEnd = scripts.indexOf('function handleDragLeave', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('drag-over')"));
            });
        });

        describe('handleDragLeave function', () => {
            it('should include handleDragLeave function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDragLeave(e)'));
            });

            it('should remove drag-over class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragLeave(e)');
                const fnEnd = scripts.indexOf('function handleDrop', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.remove('drag-over')"));
            });
        });

        describe('handleDrop function', () => {
            it('should include handleDrop function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDrop(e)'));
            });

            it('should call stopPropagation', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('e.stopPropagation()'));
            });

            it('should remove drag-over class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.remove('drag-over')"));
            });

            it('should check dragSrcEl is not same as target', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('dragSrcEl !== this'));
            });

            it('should get taskQueueList element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskQueueList')"));
            });

            it('should move element in DOM using after/before', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('this.after(dragSrcEl)'));
                assert.ok(fnBody.includes('this.before(dragSrcEl)'));
            });

            it('should collect new order of task IDs', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getAttribute('data-task-id')"));
            });

            it('should post reorderTasks message to extension', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("command: 'reorderTasks'"));
                assert.ok(fnBody.includes('taskIds: newIds'));
            });

            it('should announce drop to screen reader', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDrop(e)');
                const fnEnd = scripts.indexOf('function handleDragEnd', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
                assert.ok(fnBody.includes('New order saved'));
            });
        });

        describe('handleDragEnd function', () => {
            it('should include handleDragEnd function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleDragEnd(e)'));
            });

            it('should remove dragging class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragEnd(e)');
                const fnEnd = scripts.indexOf('function setupDnD', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.remove('dragging')"));
            });

            it('should remove drag-over class from all items', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragEnd(e)');
                const fnEnd = scripts.indexOf('function setupDnD', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.task-queue-item'));
                assert.ok(fnBody.includes("remove('drag-over')"));
            });

            it('should reset dragSrcEl to null', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleDragEnd(e)');
                const fnEnd = scripts.indexOf('function setupDnD', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('dragSrcEl = null'));
            });
        });

        describe('setupDnD function', () => {
            it('should include setupDnD function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function setupDnD()'));
            });

            it('should query all task-queue-item elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("querySelectorAll('.task-queue-item')"));
            });

            it('should remove old event listeners before adding new', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("removeEventListener('dragstart'"));
                assert.ok(fnBody.includes("removeEventListener('dragend'"));
            });

            it('should add dragstart event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('dragstart', handleDragStart"));
            });

            it('should add dragenter event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('dragenter', handleDragEnter"));
            });

            it('should add dragover event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('dragover', handleDragOver"));
            });

            it('should add dragleave event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('dragleave', handleDragLeave"));
            });

            it('should add drop event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('drop', handleDrop"));
            });

            it('should add dragend event listener', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function setupDnD()');
                const fnEnd = scripts.indexOf('// Initial setup on load', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("addEventListener('dragend', handleDragEnd"));
            });
        });

        describe('Initialization', () => {
            it('should call setupDnD on DOMContentLoaded if still loading', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("document.readyState === 'loading'"));
                assert.ok(scripts.includes("document.addEventListener('DOMContentLoaded', setupDnD)"));
            });

            it('should call setupDnD immediately if DOM already loaded', () => {
                const scripts = getClientScripts();
                // Find setupDnD function first, then the initialization section after it
                const setupDnDFunc = scripts.indexOf('function setupDnD()');
                const loadCheck = scripts.indexOf("if (document.readyState === 'loading')", setupDnDFunc);
                const elseBlock = scripts.indexOf('} else {', loadCheck);
                const afterElse = scripts.substring(elseBlock, elseBlock + 80);
                assert.ok(afterElse.includes('setupDnD()'));
            });
        });
    });

    // =========================================================================
    // Task Details Panel Tests
    // =========================================================================

    describe('Task Details Panel Functions', () => {
        describe('taskDetailsVisible state variable', () => {
            it('should declare taskDetailsVisible variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let taskDetailsVisible = false'));
            });

            it('should initialize to false', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('taskDetailsVisible = false'));
            });
        });

        describe('toggleTaskDetails function', () => {
            it('should include toggleTaskDetails function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function toggleTaskDetails()'));
            });

            it('should get taskDetailsPanel element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleTaskDetails()');
                const fnEnd = scripts.indexOf('function showTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskDetailsPanel')"));
            });

            it('should get btnTaskDetails element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleTaskDetails()');
                const fnEnd = scripts.indexOf('function showTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('btnTaskDetails')"));
            });

            it('should toggle taskDetailsVisible state', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleTaskDetails()');
                const fnEnd = scripts.indexOf('function showTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('taskDetailsVisible = !taskDetailsVisible'));
            });

            it('should call showTaskDetails when visible', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleTaskDetails()');
                const fnEnd = scripts.indexOf('function showTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('showTaskDetails()'));
            });

            it('should call hideTaskDetails when not visible', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function toggleTaskDetails()');
                const fnEnd = scripts.indexOf('function showTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('hideTaskDetails()'));
            });
        });

        describe('showTaskDetails function', () => {
            it('should include showTaskDetails function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showTaskDetails()'));
            });

            it('should set display to block', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showTaskDetails()');
                const fnEnd = scripts.indexOf('function hideTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("style.display = 'block'"));
            });

            it('should set aria-hidden to false', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showTaskDetails()');
                const fnEnd = scripts.indexOf('function hideTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-hidden', 'false')"));
            });

            it('should set aria-expanded to true on button', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showTaskDetails()');
                const fnEnd = scripts.indexOf('function hideTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-expanded', 'true')"));
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showTaskDetails()');
                const fnEnd = scripts.indexOf('function hideTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
                assert.ok(fnBody.includes('expanded'));
            });

            it('should save preference', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showTaskDetails()');
                const fnEnd = scripts.indexOf('function hideTaskDetails()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('saveTaskDetailsPreference(true)'));
            });
        });

        describe('hideTaskDetails function', () => {
            it('should include hideTaskDetails function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideTaskDetails()'));
            });

            it('should set display to none', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideTaskDetails()');
                const fnEnd = scripts.indexOf('function isTaskDetailsVisible()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("style.display = 'none'"));
            });

            it('should set aria-hidden to true', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideTaskDetails()');
                const fnEnd = scripts.indexOf('function isTaskDetailsVisible()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-hidden', 'true')"));
            });

            it('should set aria-expanded to false on button', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideTaskDetails()');
                const fnEnd = scripts.indexOf('function isTaskDetailsVisible()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-expanded', 'false')"));
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideTaskDetails()');
                const fnEnd = scripts.indexOf('function isTaskDetailsVisible()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
                assert.ok(fnBody.includes('collapsed'));
            });

            it('should save preference', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideTaskDetails()');
                const fnEnd = scripts.indexOf('function isTaskDetailsVisible()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('saveTaskDetailsPreference(false)'));
            });
        });

        describe('isTaskDetailsVisible function', () => {
            it('should include isTaskDetailsVisible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isTaskDetailsVisible()'));
            });

            it('should return taskDetailsVisible', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function isTaskDetailsVisible()');
                const fnEnd = scripts.indexOf('function saveTaskDetailsPreference', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return taskDetailsVisible'));
            });
        });

        describe('saveTaskDetailsPreference function', () => {
            it('should include saveTaskDetailsPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function saveTaskDetailsPreference(visible)'));
            });

            it('should use vscode.getState()', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function saveTaskDetailsPreference(visible)');
                const fnEnd = scripts.indexOf('function restoreTaskDetailsPreference()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('vscode.getState()'));
            });

            it('should use vscode.setState()', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function saveTaskDetailsPreference(visible)');
                const fnEnd = scripts.indexOf('function restoreTaskDetailsPreference()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('vscode.setState('));
            });

            it('should store taskDetailsVisible in state', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function saveTaskDetailsPreference(visible)');
                const fnEnd = scripts.indexOf('function restoreTaskDetailsPreference()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('state.taskDetailsVisible = visible'));
            });

            it('should handle errors gracefully', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function saveTaskDetailsPreference(visible)');
                const fnEnd = scripts.indexOf('function restoreTaskDetailsPreference()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('catch'));
                assert.ok(fnBody.includes('console.warn'));
            });
        });

        describe('restoreTaskDetailsPreference function', () => {
            it('should include restoreTaskDetailsPreference function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function restoreTaskDetailsPreference()'));
            });

            it('should use vscode.getState()', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restoreTaskDetailsPreference()');
                const fnEnd = scripts.indexOf('function updateTaskDetails(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('vscode.getState()'));
            });

            it('should check for taskDetailsVisible === true', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restoreTaskDetailsPreference()');
                const fnEnd = scripts.indexOf('function updateTaskDetails(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('taskDetailsVisible === true'));
            });

            it('should call showTaskDetails when preference is true', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restoreTaskDetailsPreference()');
                const fnEnd = scripts.indexOf('function updateTaskDetails(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('showTaskDetails()'));
            });

            it('should handle errors gracefully', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function restoreTaskDetailsPreference()');
                const fnEnd = scripts.indexOf('function updateTaskDetails(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('catch'));
                assert.ok(fnBody.includes('console.warn'));
            });
        });

        describe('updateTaskDetails function', () => {
            it('should include updateTaskDetails function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateTaskDetails(task)'));
            });

            it('should hide panel when task is null', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('if (!task)'));
                assert.ok(fnBody.includes('hideTaskDetails()'));
            });

            it('should update task-detail-id element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.task-detail-id'));
                assert.ok(fnBody.includes('task.id'));
            });

            it('should update task-detail-status element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.task-detail-status'));
                assert.ok(fnBody.includes('task.status'));
            });

            it('should update task-detail-line element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.task-detail-line'));
                assert.ok(fnBody.includes('task.lineNumber'));
            });

            it('should update task-detail-dependencies element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.task-detail-dependencies'));
                assert.ok(fnBody.includes('task.dependencies'));
            });

            it('should show "No dependencies" when none exist', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('No dependencies'));
            });

            it('should have status labels mapping', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('PENDING'));
                assert.ok(fnBody.includes('IN_PROGRESS'));
                assert.ok(fnBody.includes('COMPLETE'));
                assert.ok(fnBody.includes('BLOCKED'));
                assert.ok(fnBody.includes('SKIPPED'));
            });

            it('should call updateAcceptanceCriteria', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                const fnEnd = scripts.indexOf('function updateAcceptanceCriteria(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('updateAcceptanceCriteria(task.acceptanceCriteria)'));
            });
        });

        describe('updateAcceptanceCriteria function', () => {
            it('should include updateAcceptanceCriteria function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateAcceptanceCriteria(criteria)'));
            });

            it('should get taskAcceptanceCriteria element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('taskAcceptanceCriteria')"));
            });

            it('should check criteria length', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('criteria.length > 0'));
            });

            it('should create list items for criteria', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('task-detail-criterion'));
                assert.ok(fnBody.includes('criterion-bullet'));
            });

            it('should show placeholder when no criteria', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('No acceptance criteria defined'));
            });

            it('should call announceToScreenReader', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
            });

            it('should escape HTML in criteria', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAcceptanceCriteria(criteria)');
                const fnEnd = scripts.indexOf('function getAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('escapeHtml(criterion)'));
            });
        });

        describe('getAcceptanceCriteria function', () => {
            it('should include getAcceptanceCriteria function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getAcceptanceCriteria()'));
            });

            it('should query task-detail-criterion elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getAcceptanceCriteria()');
                const fnEnd = scripts.indexOf('function hasAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("querySelectorAll('.task-detail-criterion')"));
            });

            it('should return array of criteria text', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getAcceptanceCriteria()');
                const fnEnd = scripts.indexOf('function hasAcceptanceCriteria()', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return criteria'));
            });
        });

        describe('hasAcceptanceCriteria function', () => {
            it('should include hasAcceptanceCriteria function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hasAcceptanceCriteria()'));
            });

            it('should call getAcceptanceCriteria', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hasAcceptanceCriteria()');
                const fnEnd = scripts.indexOf('// ====', fnStart + 30);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('getAcceptanceCriteria().length > 0'));
            });
        });

        describe('getCurrentTaskData function', () => {
            it('should include getCurrentTaskData function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getCurrentTaskData()'));
            });

            it('should check window.__RALPH_INITIAL_TASKS__', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getCurrentTaskData()');
                const fnEnd = scripts.indexOf('/**', fnStart + 30);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('window.__RALPH_INITIAL_TASKS__'));
            });

            it('should find first PENDING or IN_PROGRESS task', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getCurrentTaskData()');
                const fnEnd = scripts.indexOf('/**', fnStart + 30);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('PENDING'));
                assert.ok(fnBody.includes('IN_PROGRESS'));
            });

            it('should return null when no tasks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getCurrentTaskData()');
                const fnEnd = scripts.indexOf('/**', fnStart + 30);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return null'));
            });
        });

        describe('Estimated Time Functions', () => {
            describe('calculateEstimatedTime', () => {
                it('should include calculateEstimatedTime function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function calculateEstimatedTime()'));
                });

                it('should check for currentTaskHistory', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function calculateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function formatEstimatedDuration', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('currentTaskHistory'));
                });

                it('should return null estimate when no history', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function calculateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function formatEstimatedDuration', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('estimate: null'));
                });

                it('should calculate average duration from history', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function calculateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function formatEstimatedDuration', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('totalDuration'));
                    assert.ok(fnBody.includes('avgDuration'));
                });

                it('should return sampleSize in result', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function calculateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function formatEstimatedDuration', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('sampleSize'));
                });

                it('should return source description', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function calculateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function formatEstimatedDuration', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('source'));
                    assert.ok(fnBody.includes('avg of'));
                });
            });

            describe('formatEstimatedDuration', () => {
                it('should include formatEstimatedDuration function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function formatEstimatedDuration(ms)'));
                });

                it('should handle null/zero input', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function formatEstimatedDuration(ms)');
                    const fnEnd = scripts.indexOf('function updateEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'--'"));
                });

                it('should format hours correctly', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function formatEstimatedDuration(ms)');
                    const fnEnd = scripts.indexOf('function updateEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'h '"));
                    assert.ok(fnBody.includes("'m'"));
                });

                it('should format minutes correctly', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function formatEstimatedDuration(ms)');
                    const fnEnd = scripts.indexOf('function updateEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'m '"));
                    assert.ok(fnBody.includes("'s'"));
                });

                it('should format seconds only for short durations', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function formatEstimatedDuration(ms)');
                    const fnEnd = scripts.indexOf('function updateEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("seconds + 's'"));
                });
            });

            describe('updateEstimatedTime', () => {
                it('should include updateEstimatedTime function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function updateEstimatedTime()'));
                });

                it('should get estimatedTimeValue element', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("getElementById('estimatedTimeValue')"));
                });

                it('should get estimatedTimeSource element', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("getElementById('estimatedTimeSource')"));
                });

                it('should call calculateEstimatedTime', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('calculateEstimatedTime()'));
                });

                it('should add no-data class when no estimate', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'no-data'"));
                });

                it('should announce to screen reader', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('announceToScreenReader'));
                });

                it('should check if task details panel is visible', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateEstimatedTime()');
                    const fnEnd = scripts.indexOf('function showEstimatedTimeLoading()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('isTaskDetailsVisible()'));
                });
            });

            describe('showEstimatedTimeLoading', () => {
                it('should include showEstimatedTimeLoading function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function showEstimatedTimeLoading()'));
                });

                it('should set text content to dots', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function showEstimatedTimeLoading()');
                    const fnEnd = scripts.indexOf('function getEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'...'"));
                });

                it('should add loading class', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function showEstimatedTimeLoading()');
                    const fnEnd = scripts.indexOf('function getEstimatedTime()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'loading'"));
                });
            });

            describe('getEstimatedTime', () => {
                it('should include getEstimatedTime function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function getEstimatedTime()'));
                });

                it('should return formatted value', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getEstimatedTime()');
                    const fnEnd = scripts.indexOf('function getCurrentTaskData()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('formatted'));
                });

                it('should return sampleSize', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getEstimatedTime()');
                    const fnEnd = scripts.indexOf('function getCurrentTaskData()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('sampleSize'));
                });
            });

            describe('updateTaskDetails calls updateEstimatedTime', () => {
                it('should call updateEstimatedTime at end of updateTaskDetails', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                    const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('updateEstimatedTime()'));
                });
            });

            describe('updateTaskDetails calls updateRelatedFiles', () => {
                it('should call updateRelatedFiles with task description', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTaskDetails(task)');
                    const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('updateRelatedFiles'));
                });
            });

            describe('updateTiming calls updateEstimatedTime', () => {
                it('should call updateEstimatedTime in updateTiming', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateTiming(startTime, taskHistory, pendingTasks)');
                    const fnEnd = scripts.indexOf('function updateElapsedAndEta()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('updateEstimatedTime()'));
                });
            });

            describe('history message handler updates estimated time', () => {
                it('should update currentTaskHistory on history message', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("if (msg.type === 'history')"));
                    const historyHandler = scripts.indexOf("if (msg.type === 'history')");
                    const handlerEnd = scripts.indexOf("if (msg.type === 'timing')", historyHandler);
                    const handlerBody = scripts.substring(historyHandler, handlerEnd);
                    assert.ok(handlerBody.includes('currentTaskHistory = msg.history'));
                });

                it('should call updateEstimatedTime on history message', () => {
                    const scripts = getClientScripts();
                    const historyHandler = scripts.indexOf("if (msg.type === 'history')");
                    const handlerEnd = scripts.indexOf("if (msg.type === 'timing')", historyHandler);
                    const handlerBody = scripts.substring(historyHandler, handlerEnd);
                    assert.ok(handlerBody.includes('updateEstimatedTime()'));
                });
            });
        });

        describe('Related Files Functions', () => {
            describe('FILE_EXTENSIONS constant', () => {
                it('should include FILE_EXTENSIONS constant', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('const FILE_EXTENSIONS = ['));
                });

                it('should include TypeScript extensions', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("'ts'"));
                    assert.ok(scripts.includes("'tsx'"));
                });

                it('should include JavaScript extensions', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("'js'"));
                    assert.ok(scripts.includes("'jsx'"));
                });

                it('should include Python extension', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("'py'"));
                });

                it('should include CSS/SCSS extensions', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("'css'"));
                    assert.ok(scripts.includes("'scss'"));
                });

                it('should include JSON/YAML extensions', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes("'json'"));
                    assert.ok(scripts.includes("'yaml'"));
                });
            });

            describe('extractRelatedFilesFromDescription function', () => {
                it('should include extractRelatedFilesFromDescription function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function extractRelatedFilesFromDescription(description)'));
                });

                it('should use Set for deduplication', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function extractRelatedFilesFromDescription(description)');
                    const fnEnd = scripts.indexOf('function getFileTypeClass(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('new Set()'));
                });

                it('should limit to 10 files', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function extractRelatedFilesFromDescription(description)');
                    const fnEnd = scripts.indexOf('function getFileTypeClass(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('.slice(0, 10)'));
                });

                it('should handle backtick-quoted files', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function extractRelatedFilesFromDescription(description)');
                    const fnEnd = scripts.indexOf('function getFileTypeClass(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('backtickPattern'));
                });

                it('should handle keyword-based detection', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function extractRelatedFilesFromDescription(description)');
                    const fnEnd = scripts.indexOf('function getFileTypeClass(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('keywordPattern'));
                });

                it('should handle glob patterns', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function extractRelatedFilesFromDescription(description)');
                    const fnEnd = scripts.indexOf('function getFileTypeClass(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('globPattern'));
                });
            });

            describe('getFileTypeClass function', () => {
                it('should include getFileTypeClass function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function getFileTypeClass(filePath)'));
                });

                it('should return is-directory for directory paths', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getFileTypeClass(filePath)');
                    const fnEnd = scripts.indexOf('function updateRelatedFiles(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'is-directory'"));
                });

                it('should return is-glob for glob patterns', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getFileTypeClass(filePath)');
                    const fnEnd = scripts.indexOf('function updateRelatedFiles(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("'is-glob'"));
                });

                it('should check for trailing slash for directories', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getFileTypeClass(filePath)');
                    const fnEnd = scripts.indexOf('function updateRelatedFiles(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("endsWith('/')"));
                });

                it('should check for asterisk for globs', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getFileTypeClass(filePath)');
                    const fnEnd = scripts.indexOf('function updateRelatedFiles(', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("includes('*')"));
                });
            });

            describe('updateRelatedFiles function', () => {
                it('should include updateRelatedFiles function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function updateRelatedFiles(description)'));
                });

                it('should get taskRelatedFiles element', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("getElementById('taskRelatedFiles')"));
                });

                it('should call extractRelatedFilesFromDescription', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('extractRelatedFilesFromDescription(description)'));
                });

                it('should generate task-detail-related-file elements', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('task-detail-related-file'));
                });

                it('should handle no files detected case', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('No files detected'));
                });

                it('should call getFileTypeClass for each file', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('getFileTypeClass(file)'));
                });

                it('should escape HTML in file names', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function updateRelatedFiles(description)');
                    const fnEnd = scripts.indexOf('function getRelatedFiles()', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('escapeHtml(file)'));
                });
            });

            describe('getRelatedFiles function', () => {
                it('should include getRelatedFiles function', () => {
                    const scripts = getClientScripts();
                    assert.ok(scripts.includes('function getRelatedFiles()'));
                });

                it('should get taskRelatedFiles element', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getRelatedFiles()');
                    const fnEnd = scripts.indexOf('// ====================================================================', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("getElementById('taskRelatedFiles')"));
                });

                it('should query task-detail-related-file elements', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getRelatedFiles()');
                    const fnEnd = scripts.indexOf('// ====================================================================', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes("querySelectorAll('.task-detail-related-file')"));
                });

                it('should return array of file paths', () => {
                    const scripts = getClientScripts();
                    const fnStart = scripts.indexOf('function getRelatedFiles()');
                    const fnEnd = scripts.indexOf('// ====================================================================', fnStart);
                    const fnBody = scripts.substring(fnStart, fnEnd);
                    assert.ok(fnBody.includes('return Array.from('));
                });
            });
        });

        describe('Initialization', () => {
            it('should call restoreTaskDetailsPreference on DOMContentLoaded', () => {
                const scripts = getClientScripts();
                // Check the initialization section
                const initSection = scripts.indexOf('// Initialization');
                const afterInit = scripts.substring(initSection);
                assert.ok(afterInit.includes('restoreTaskDetailsPreference()'));
            });

            it('should call restoreTaskDetailsPreference when DOM already loaded', () => {
                const scripts = getClientScripts();
                // Find the else block in initialization
                const loadCheck = scripts.indexOf("if (document.readyState === 'loading')");
                const elseBlock = scripts.indexOf('} else {', loadCheck);
                const afterElse = scripts.substring(elseBlock, elseBlock + 800);
                assert.ok(afterElse.includes('restoreTaskDetailsPreference()'));
            });
        });
    });

    // ====================================================================
    // Debounce and Throttle Utilities Tests
    // ====================================================================
    describe('Debounce and Throttle Utilities', () => {
        describe('Constants', () => {
            it('should define DEBOUNCE_DELAYS object', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const DEBOUNCE_DELAYS = {'));
            });

            it('should have UI_UPDATE delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('UI_UPDATE:'));
            });

            it('should have TIMELINE delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('TIMELINE:'));
            });

            it('should have STATS delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('STATS:'));
            });

            it('should have DURATION_CHART delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('DURATION_CHART:'));
            });

            it('should have LOG_FILTER delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('LOG_FILTER:'));
            });

            it('should have DEPENDENCY_GRAPH delay in DEBOUNCE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('DEPENDENCY_GRAPH:'));
            });

            it('should define THROTTLE_DELAYS object', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const THROTTLE_DELAYS = {'));
            });

            it('should have COUNTDOWN delay in THROTTLE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('COUNTDOWN:'));
            });

            it('should have SCROLL delay in THROTTLE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('SCROLL:'));
            });

            it('should have RESIZE delay in THROTTLE_DELAYS', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('RESIZE:'));
            });
        });

        describe('createDebounce function', () => {
            it('should define createDebounce function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createDebounce(fn, delay)'));
            });

            it('should return a function with flush method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createDebounce(fn, delay)');
                const fnEnd = scripts.indexOf('function createThrottle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debounced.flush = function()'));
            });

            it('should return a function with cancel method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createDebounce(fn, delay)');
                const fnEnd = scripts.indexOf('function createThrottle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debounced.cancel = function()'));
            });

            it('should return a function with pending method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createDebounce(fn, delay)');
                const fnEnd = scripts.indexOf('function createThrottle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debounced.pending = function()'));
            });

            it('should use setTimeout for delayed execution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createDebounce(fn, delay)');
                const fnEnd = scripts.indexOf('function createThrottle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('setTimeout('));
            });

            it('should use clearTimeout to cancel pending calls', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createDebounce(fn, delay)');
                const fnEnd = scripts.indexOf('function createThrottle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('clearTimeout('));
            });
        });

        describe('createThrottle function', () => {
            it('should define createThrottle function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createThrottle(fn, delay)'));
            });

            it('should return a function with cancel method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createThrottle(fn, delay)');
                const fnEnd = scripts.indexOf('function createAnimationFrameBatch', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('throttled.cancel = function()'));
            });

            it('should track lastTime for rate limiting', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createThrottle(fn, delay)');
                const fnEnd = scripts.indexOf('function createAnimationFrameBatch', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lastTime'));
            });

            it('should calculate remaining time', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createThrottle(fn, delay)');
                const fnEnd = scripts.indexOf('function createAnimationFrameBatch', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var remaining = delay - (now - lastTime)'));
            });

            it('should execute immediately if remaining <= 0', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createThrottle(fn, delay)');
                const fnEnd = scripts.indexOf('function createAnimationFrameBatch', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('if (remaining <= 0'));
            });
        });

        describe('createAnimationFrameBatch function', () => {
            it('should define createAnimationFrameBatch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createAnimationFrameBatch(fn)'));
            });

            it('should use requestAnimationFrame', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createAnimationFrameBatch(fn)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('requestAnimationFrame('));
            });

            it('should return a function with cancel method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createAnimationFrameBatch(fn)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('batched.cancel = function()'));
            });

            it('should return a function with pending method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createAnimationFrameBatch(fn)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('batched.pending = function()'));
            });

            it('should use cancelAnimationFrame in cancel method', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createAnimationFrameBatch(fn)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('cancelAnimationFrame('));
            });
        });

        describe('Debounced UI Update Variables', () => {
            it('should define _updateUIInternal variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var _updateUIInternal = null'));
            });

            it('should define _updateTimelineInternal variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var _updateTimelineInternal = null'));
            });

            it('should define _updateDurationChartInternal variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var _updateDurationChartInternal = null'));
            });

            it('should define _updateStatsDisplayInternal variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var _updateStatsDisplayInternal = null'));
            });

            it('should define _renderDependencyGraphInternal variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var _renderDependencyGraphInternal = null'));
            });

            it('should define debouncedUpdateUI variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var debouncedUpdateUI = null'));
            });

            it('should define debouncedUpdateTimeline variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var debouncedUpdateTimeline = null'));
            });

            it('should define debouncedUpdateDurationChart variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var debouncedUpdateDurationChart = null'));
            });

            it('should define debouncedUpdateStatsDisplay variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var debouncedUpdateStatsDisplay = null'));
            });

            it('should define debouncedRenderDependencyGraph variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var debouncedRenderDependencyGraph = null'));
            });

            it('should define throttledShowCountdown variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var throttledShowCountdown = null'));
            });

            it('should define rafUpdateTimeline variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var rafUpdateTimeline = null'));
            });
        });

        describe('initDebouncedFunctions', () => {
            it('should define initDebouncedFunctions function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function initDebouncedFunctions()'));
            });

            it('should initialize debouncedUpdateUI if _updateUIInternal exists', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateUI = createDebounce(_updateUIInternal'));
            });

            it('should initialize debouncedUpdateTimeline if _updateTimelineInternal exists', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateTimeline = createDebounce(_updateTimelineInternal'));
            });

            it('should initialize rafUpdateTimeline with createAnimationFrameBatch', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('rafUpdateTimeline = createAnimationFrameBatch(_updateTimelineInternal)'));
            });

            it('should initialize debouncedUpdateDurationChart', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateDurationChart = createDebounce(_updateDurationChartInternal'));
            });

            it('should initialize debouncedUpdateStatsDisplay', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateStatsDisplay = createDebounce(_updateStatsDisplayInternal'));
            });

            it('should initialize debouncedRenderDependencyGraph', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initDebouncedFunctions()');
                const fnEnd = scripts.indexOf('function flushAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedRenderDependencyGraph = createDebounce(_renderDependencyGraphInternal'));
            });
        });

        describe('flushAllDebouncedUpdates', () => {
            it('should define flushAllDebouncedUpdates function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function flushAllDebouncedUpdates()'));
            });

            it('should check and flush debouncedUpdateUI', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function flushAllDebouncedUpdates()');
                const fnEnd = scripts.indexOf('function cancelAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateUI.flush()'));
            });

            it('should check pending state before flushing', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function flushAllDebouncedUpdates()');
                const fnEnd = scripts.indexOf('function cancelAllDebouncedUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.pending()'));
            });
        });

        describe('cancelAllDebouncedUpdates', () => {
            it('should define cancelAllDebouncedUpdates function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function cancelAllDebouncedUpdates()'));
            });

            it('should cancel debouncedUpdateUI', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAllDebouncedUpdates()');
                const fnEnd = scripts.indexOf('function hasPendingUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('debouncedUpdateUI.cancel()') || fnBody.includes('if (debouncedUpdateUI) debouncedUpdateUI.cancel()'));
            });

            it('should cancel throttledShowCountdown', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAllDebouncedUpdates()');
                const fnEnd = scripts.indexOf('function hasPendingUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('throttledShowCountdown.cancel()'));
            });

            it('should cancel rafUpdateTimeline', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAllDebouncedUpdates()');
                const fnEnd = scripts.indexOf('function hasPendingUpdates', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('rafUpdateTimeline.cancel()'));
            });
        });

        describe('hasPendingUpdates', () => {
            it('should define hasPendingUpdates function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hasPendingUpdates()'));
            });

            it('should check pending state of debounced functions', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hasPendingUpdates()');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('.pending()'));
            });

            it('should return boolean result', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hasPendingUpdates()');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return ('));
            });
        });

        describe('Internal vs Public Update Functions', () => {
            it('should define updateUIInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateUIInternal(status, iteration, taskInfo)'));
            });

            it('should define showCountdownInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showCountdownInternal(seconds)'));
            });

            it('should define updateTimelineInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateTimelineInternal(history)'));
            });

            it('should define updateDurationChartInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateDurationChartInternal(history)'));
            });

            it('should define updateStatsDisplayInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateStatsDisplayInternal(stats)'));
            });

            it('should define renderDependencyGraphInternal function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function renderDependencyGraphInternal(tasks)'));
            });

            it('should store reference to updateUIInternal', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('_updateUIInternal = updateUIInternal'));
            });

            it('should store reference to updateTimelineInternal', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('_updateTimelineInternal = updateTimelineInternal'));
            });

            it('should store reference to updateDurationChartInternal', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('_updateDurationChartInternal = updateDurationChartInternal'));
            });

            it('should store reference to updateStatsDisplayInternal', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('_updateStatsDisplayInternal = updateStatsDisplayInternal'));
            });

            it('should store reference to renderDependencyGraphInternal', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('_renderDependencyGraphInternal = renderDependencyGraphInternal'));
            });
        });

        describe('Public Wrapper Functions with Immediate Parameter', () => {
            it('should define updateUI with immediate parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateUI(status, iteration, taskInfo, immediate)'));
            });

            it('updateUI should handle immediate=true by calling internal directly', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateUI(status, iteration, taskInfo, immediate)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('updateUIInternal(status, iteration, taskInfo)'));
            });

            it('updateUI should check for status change for immediate execution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateUI(status, iteration, taskInfo, immediate)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('status !== previousUIStatus'));
            });

            it('should define showCountdown with immediate parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showCountdown(seconds, immediate)'));
            });

            it('showCountdown should handle seconds === 0 immediately', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showCountdown(seconds, immediate)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('seconds === 0'));
            });

            it('showCountdown should use throttledShowCountdown for normal updates', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showCountdown(seconds, immediate)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('throttledShowCountdown(seconds)'));
            });

            it('should define updateTimeline with immediate and useRAF parameters', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateTimeline(history, immediate, useRAF)'));
            });

            it('updateTimeline should support requestAnimationFrame mode', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTimeline(history, immediate, useRAF)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 200);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('rafUpdateTimeline(history)'));
            });

            it('should define updateDurationChart with immediate parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateDurationChart(history, immediate)'));
            });

            it('should define updateStatsDisplay with immediate parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateStatsDisplay(stats, immediate)'));
            });

            it('updateStatsDisplay should run immediately on task completion', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateStatsDisplay(stats, immediate)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 200);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('stats.completed > previousCompletedCount'));
            });

            it('should define renderDependencyGraph with immediate parameter', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function renderDependencyGraph(tasks, immediate)'));
            });
        });

        describe('Initialization calls initDebouncedFunctions', () => {
            it('should call initDebouncedFunctions on DOMContentLoaded', () => {
                const scripts = getClientScripts();
                const initSection = scripts.indexOf('// Initialization');
                const afterInit = scripts.substring(initSection);
                assert.ok(afterInit.includes('initDebouncedFunctions()'));
            });

            it('should call initDebouncedFunctions when DOM already loaded', () => {
                const scripts = getClientScripts();
                const loadCheck = scripts.indexOf("if (document.readyState === 'loading')");
                const elseBlock = scripts.indexOf('} else {', loadCheck);
                const afterElse = scripts.substring(elseBlock, elseBlock + 800);
                assert.ok(afterElse.includes('initDebouncedFunctions()'));
            });
        });

        describe('Throttle for countdown', () => {
            it('should initialize throttledShowCountdown with createThrottle', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('throttledShowCountdown = createThrottle(showCountdownInternal'));
            });

            it('should use THROTTLE_DELAYS.COUNTDOWN for countdown throttling', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('THROTTLE_DELAYS.COUNTDOWN'));
            });
        });
    });

    describe('Lazy Loading for Non-Critical Sections', () => {
        describe('LAZY_LOAD_SECTIONS constant', () => {
            it('should define LAZY_LOAD_SECTIONS array', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const LAZY_LOAD_SECTIONS = ['));
            });

            it('should include durationSection in lazy load sections', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'durationSection'"));
            });

            it('should include dependencySection in lazy load sections', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'dependencySection'"));
            });

            it('should include taskQueueSection in lazy load sections', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("'taskQueueSection'"));
            });

            it('should include settingsOverlay in lazy load sections', () => {
                const scripts = getClientScripts();
                const lazyStart = scripts.indexOf('LAZY_LOAD_SECTIONS = [');
                const lazyEnd = scripts.indexOf('];', lazyStart);
                const lazyContent = scripts.substring(lazyStart, lazyEnd);
                assert.ok(lazyContent.includes("'settingsOverlay'"));
            });
        });

        describe('lazySectionStates object', () => {
            it('should define lazySectionStates for tracking section states', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const lazySectionStates = {}'));
            });
        });

        describe('Configuration constants', () => {
            it('should define LAZY_LOAD_MIN_DELAY constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const LAZY_LOAD_MIN_DELAY'));
            });

            it('should define LAZY_LOAD_ROOT_MARGIN constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const LAZY_LOAD_ROOT_MARGIN'));
            });

            it('should define LAZY_LOAD_THRESHOLD constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const LAZY_LOAD_THRESHOLD'));
            });

            it('should set LAZY_LOAD_MIN_DELAY to 50ms', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('LAZY_LOAD_MIN_DELAY = 50'));
            });

            it('should set LAZY_LOAD_ROOT_MARGIN to 100px for preloading', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("LAZY_LOAD_ROOT_MARGIN = '100px'"));
            });

            it('should set LAZY_LOAD_THRESHOLD to 0.01 for early trigger', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('LAZY_LOAD_THRESHOLD = 0.01'));
            });
        });

        describe('getLazySectionState function', () => {
            it('should define getLazySectionState function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLazySectionState(sectionId)'));
            });

            it('should return state from lazySectionStates', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazySectionState(sectionId)');
                const fnEnd = scripts.indexOf('}', fnStart + 50);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return lazySectionStates[sectionId]'));
            });
        });

        describe('isSectionLoaded function', () => {
            it('should define isSectionLoaded function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isSectionLoaded(sectionId)'));
            });

            it('should check for loaded state', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function isSectionLoaded(sectionId)');
                const fnEnd = scripts.indexOf('}', fnStart + 50);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("=== 'loaded'"));
            });
        });

        describe('isSectionLoading function', () => {
            it('should define isSectionLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isSectionLoading(sectionId)'));
            });

            it('should check for loading state', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function isSectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('}', fnStart + 50);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("=== 'loading'"));
            });
        });

        describe('areAllSectionsLoaded function', () => {
            it('should define areAllSectionsLoaded function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function areAllSectionsLoaded()'));
            });

            it('should use every() to check all sections', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function areAllSectionsLoaded()');
                const fnEnd = scripts.indexOf('}', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('LAZY_LOAD_SECTIONS.every'));
            });
        });

        describe('onSectionLoaded function', () => {
            it('should define onSectionLoaded function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function onSectionLoaded(sectionId, callback)'));
            });

            it('should validate callback is a function', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function onSectionLoaded(sectionId, callback)');
                const fnEnd = scripts.indexOf('function notifyLazyLoadCallbacks', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("typeof callback !== 'function'"));
            });

            it('should call callback immediately if section already loaded', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function onSectionLoaded(sectionId, callback)');
                const fnEnd = scripts.indexOf('function notifyLazyLoadCallbacks', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('callback(sectionId)'));
            });

            it('should register callback in lazyLoadCallbacks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function onSectionLoaded(sectionId, callback)');
                const fnEnd = scripts.indexOf('function notifyLazyLoadCallbacks', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadCallbacks[sectionId].push(callback)'));
            });
        });

        describe('notifyLazyLoadCallbacks function', () => {
            it('should define notifyLazyLoadCallbacks function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function notifyLazyLoadCallbacks(sectionId)'));
            });

            it('should iterate and call callbacks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function notifyLazyLoadCallbacks(sectionId)');
                const fnEnd = scripts.indexOf('function showLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('callbacks.forEach'));
            });

            it('should clear callbacks after firing', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function notifyLazyLoadCallbacks(sectionId)');
                const fnEnd = scripts.indexOf('function showLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadCallbacks[sectionId] = []'));
            });
        });

        describe('showLazySectionLoading function', () => {
            it('should define showLazySectionLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function showLazySectionLoading(sectionId)'));
            });

            it('should set state to loading', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function hideLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("lazySectionStates[sectionId] = 'loading'"));
            });

            it('should add lazy-loading class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function hideLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('lazy-loading')"));
            });

            it('should set aria-busy to true', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function hideLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-busy', 'true')"));
            });

            it('should create loading indicator element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function hideLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazy-load-indicator'));
            });

            it('should include spinner in loading indicator', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function hideLazySectionLoading', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazy-load-spinner'));
            });
        });

        describe('hideLazySectionLoading function', () => {
            it('should define hideLazySectionLoading function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function hideLazySectionLoading(sectionId)'));
            });

            it('should set state to loaded', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("lazySectionStates[sectionId] = 'loaded'"));
            });

            it('should remove lazy-loading class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.remove('lazy-loading')"));
            });

            it('should add lazy-loaded class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('lazy-loaded')"));
            });

            it('should set aria-busy to false', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("setAttribute('aria-busy', 'false')"));
            });

            it('should call notifyLazyLoadCallbacks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('notifyLazyLoadCallbacks(sectionId)'));
            });

            it('should announce to screen readers', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideLazySectionLoading(sectionId)');
                const fnEnd = scripts.indexOf('function markLazySectionError', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
            });
        });

        describe('markLazySectionError function', () => {
            it('should define markLazySectionError function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function markLazySectionError(sectionId, errorMessage)'));
            });

            it('should set state to error', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function markLazySectionError(sectionId, errorMessage)');
                const fnEnd = scripts.indexOf('function getLazySectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("lazySectionStates[sectionId] = 'error'"));
            });

            it('should add lazy-error class', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function markLazySectionError(sectionId, errorMessage)');
                const fnEnd = scripts.indexOf('function getLazySectionName', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('lazy-error')"));
            });
        });

        describe('initializeLazySection function', () => {
            it('should define initializeLazySection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function initializeLazySection(sectionId)'));
            });

            it('should skip if already loaded or loading', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("=== 'loaded'"));
                assert.ok(fnBody.includes("=== 'loading'"));
            });

            it('should call showLazySectionLoading', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('showLazySectionLoading(sectionId)'));
            });

            it('should handle durationSection case', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("case 'durationSection'"));
            });

            it('should handle dependencySection case with renderDependencyGraph', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("case 'dependencySection'"));
                assert.ok(fnBody.includes('renderDependencyGraph'));
            });

            it('should handle taskQueueSection case with renderPendingTasks', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("case 'taskQueueSection'"));
                assert.ok(fnBody.includes('renderPendingTasks'));
            });

            it('should handle settingsOverlay case', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("case 'settingsOverlay'"));
            });

            it('should use setTimeout for smooth transition', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('setTimeout'));
                assert.ok(fnBody.includes('LAZY_LOAD_MIN_DELAY'));
            });

            it('should call hideLazySectionLoading on success', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('hideLazySectionLoading(sectionId)'));
            });

            it('should handle errors with markLazySectionError', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initializeLazySection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadSection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('markLazySectionError'));
            });
        });

        describe('forceLoadSection function', () => {
            it('should define forceLoadSection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function forceLoadSection(sectionId)'));
            });

            it('should unobserve the section from IntersectionObserver', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function forceLoadSection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadAllSections', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadObserver.unobserve'));
            });

            it('should call initializeLazySection', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function forceLoadSection(sectionId)');
                const fnEnd = scripts.indexOf('function forceLoadAllSections', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('initializeLazySection(sectionId)'));
            });
        });

        describe('forceLoadAllSections function', () => {
            it('should define forceLoadAllSections function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function forceLoadAllSections()'));
            });

            it('should iterate over LAZY_LOAD_SECTIONS', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function forceLoadAllSections()');
                const fnEnd = scripts.indexOf('function handleLazyIntersection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('LAZY_LOAD_SECTIONS.forEach(forceLoadSection)'));
            });
        });

        describe('handleLazyIntersection function', () => {
            it('should define handleLazyIntersection function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function handleLazyIntersection(entries)'));
            });

            it('should check for isIntersecting', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleLazyIntersection(entries)');
                const fnEnd = scripts.indexOf('function initLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('entry.isIntersecting'));
            });

            it('should unobserve after triggering', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleLazyIntersection(entries)');
                const fnEnd = scripts.indexOf('function initLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadObserver.unobserve'));
            });

            it('should call initializeLazySection for visible sections', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function handleLazyIntersection(entries)');
                const fnEnd = scripts.indexOf('function initLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('initializeLazySection(sectionId)'));
            });
        });

        describe('initLazyLoadObserver function', () => {
            it('should define initLazyLoadObserver function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function initLazyLoadObserver()'));
            });

            it('should check for IntersectionObserver support', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("typeof IntersectionObserver === 'undefined'"));
            });

            it('should fallback to forceLoadAllSections if not supported', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('forceLoadAllSections()'));
            });

            it('should create IntersectionObserver with options', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('new IntersectionObserver(handleLazyIntersection'));
                assert.ok(fnBody.includes('rootMargin: LAZY_LOAD_ROOT_MARGIN'));
                assert.ok(fnBody.includes('threshold: LAZY_LOAD_THRESHOLD'));
            });

            it('should observe all lazy sections', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('LAZY_LOAD_SECTIONS.forEach'));
                assert.ok(fnBody.includes('lazyLoadObserver.observe(section)'));
            });

            it('should mark sections as pending initially', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("lazySectionStates[sectionId] = 'pending'"));
            });

            it('should add lazy-section class to observed elements', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function initLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function destroyLazyLoadObserver', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("classList.add('lazy-section')"));
            });
        });

        describe('destroyLazyLoadObserver function', () => {
            it('should define destroyLazyLoadObserver function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function destroyLazyLoadObserver()'));
            });

            it('should call disconnect on observer', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function destroyLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function getLazyLoadStats', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadObserver.disconnect()'));
            });

            it('should set observer to null', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function destroyLazyLoadObserver()');
                const fnEnd = scripts.indexOf('function getLazyLoadStats', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('lazyLoadObserver = null'));
            });
        });

        describe('getLazyLoadStats function', () => {
            it('should define getLazyLoadStats function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLazyLoadStats()'));
            });

            it('should return total count', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazyLoadStats()');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('total: LAZY_LOAD_SECTIONS.length'));
            });

            it('should track loaded count', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazyLoadStats()');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('loaded: loaded'));
            });

            it('should track pending count', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazyLoadStats()');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 100);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('pending: pending'));
            });
        });

        describe('Initialization', () => {
            it('should call initLazyLoadObserver on DOMContentLoaded', () => {
                const scripts = getClientScripts();
                const initSection = scripts.indexOf('// Initialization');
                const afterInit = scripts.substring(initSection);
                assert.ok(afterInit.includes('initLazyLoadObserver()'));
            });

            it('should call initLazyLoadObserver when DOM already loaded', () => {
                const scripts = getClientScripts();
                const loadCheck = scripts.indexOf("if (document.readyState === 'loading')");
                const elseBlock = scripts.indexOf('} else {', loadCheck);
                const afterElse = scripts.substring(elseBlock, elseBlock + 800);
                assert.ok(afterElse.includes('initLazyLoadObserver()'));
            });
        });

        describe('getLazySectionName function', () => {
            it('should define getLazySectionName function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getLazySectionName(sectionId)'));
            });

            it('should map durationSection to Duration chart', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazySectionName(sectionId)');
                const fnEnd = scripts.indexOf('function initializeLazySection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'durationSection': 'Duration chart'"));
            });

            it('should map dependencySection to Dependency graph', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazySectionName(sectionId)');
                const fnEnd = scripts.indexOf('function initializeLazySection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'dependencySection': 'Dependency graph'"));
            });

            it('should map taskQueueSection to Task queue', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazySectionName(sectionId)');
                const fnEnd = scripts.indexOf('function initializeLazySection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'taskQueueSection': 'Task queue'"));
            });

            it('should map settingsOverlay to Settings', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getLazySectionName(sectionId)');
                const fnEnd = scripts.indexOf('function initializeLazySection', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("'settingsOverlay': 'Settings'"));
            });
        });

        describe('lazyLoadCallbacks object', () => {
            it('should define lazyLoadCallbacks for callback registration', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('const lazyLoadCallbacks = {}'));
            });
        });

        describe('lazyLoadObserver variable', () => {
            it('should define lazyLoadObserver variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('let lazyLoadObserver = null'));
            });
        });
    });

    // ====================================================================
    // requestAnimationFrame Animation Utilities Tests
    // ====================================================================
    describe('requestAnimationFrame Animation Utilities', () => {
        describe('EASING_FUNCTIONS object', () => {
            it('should define EASING_FUNCTIONS object', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var EASING_FUNCTIONS = {'));
            });

            it('should include linear easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("linear: function(t)"));
            });

            it('should include easeInQuad easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeInQuad: function(t)"));
            });

            it('should include easeOutQuad easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeOutQuad: function(t)"));
            });

            it('should include easeInOutQuad easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeInOutQuad: function(t)"));
            });

            it('should include easeOutCubic easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeOutCubic: function(t)"));
            });

            it('should include easeInOutCubic easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeInOutCubic: function(t)"));
            });

            it('should include easeOutElastic easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeOutElastic: function(t)"));
            });

            it('should include easeOutBounce easing function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("easeOutBounce: function(t)"));
            });
        });

        describe('DEFAULT_ANIMATION_DURATION constant', () => {
            it('should define DEFAULT_ANIMATION_DURATION constant', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var DEFAULT_ANIMATION_DURATION = 300'));
            });
        });

        describe('activeAnimations tracking object', () => {
            it('should define activeAnimations object', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var activeAnimations = {}'));
            });
        });

        describe('animateValue function', () => {
            it('should define animateValue function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function animateValue(options)'));
            });

            it('should support id parameter', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var id = options.id'));
            });

            it('should support from parameter', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var from = options.from'));
            });

            it('should support to parameter', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var to = options.to'));
            });

            it('should support duration parameter', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var duration = options.duration'));
            });

            it('should support onUpdate callback', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var onUpdate = options.onUpdate'));
            });

            it('should support onComplete callback', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var onComplete = options.onComplete'));
            });

            it('should use requestAnimationFrame', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('requestAnimationFrame(frame)'));
            });

            it('should call cancelAnimation before starting new animation with same id', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('cancelAnimation(id)'));
            });

            it('should return a cancel function', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateValue(options)');
                const fnEnd = scripts.indexOf('function cancelAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return function cancel()'));
            });
        });

        describe('cancelAnimation function', () => {
            it('should define cancelAnimation function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function cancelAnimation(id)'));
            });

            it('should use cancelAnimationFrame', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAnimation(id)');
                const fnEnd = scripts.indexOf('function cancelAllAnimations', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('cancelAnimationFrame(activeAnimations[id])'));
            });

            it('should delete from activeAnimations', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAnimation(id)');
                const fnEnd = scripts.indexOf('function cancelAllAnimations', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('delete activeAnimations[id]'));
            });
        });

        describe('cancelAllAnimations function', () => {
            it('should define cancelAllAnimations function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function cancelAllAnimations()'));
            });

            it('should iterate over activeAnimations keys', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function cancelAllAnimations()');
                const fnEnd = scripts.indexOf('function isAnimationActive', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('Object.keys(activeAnimations)'));
            });
        });

        describe('isAnimationActive function', () => {
            it('should define isAnimationActive function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isAnimationActive(id)'));
            });

            it('should return boolean based on activeAnimations', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function isAnimationActive(id)');
                const fnEnd = scripts.indexOf('function getActiveAnimationCount', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return !!activeAnimations[id]'));
            });
        });

        describe('getActiveAnimationCount function', () => {
            it('should define getActiveAnimationCount function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getActiveAnimationCount()'));
            });

            it('should return count of active animations', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getActiveAnimationCount()');
                const fnEnd = scripts.indexOf('function animateStyle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('Object.keys(activeAnimations).length'));
            });
        });

        describe('animateStyle function', () => {
            it('should define animateStyle function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function animateStyle(element, property, from, to, options)'));
            });

            it('should support unit option', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateStyle(element, property, from, to, options)');
                const fnEnd = scripts.indexOf('function animateTransform', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("var unit = options.unit || ''"));
            });

            it('should use animateValue internally', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateStyle(element, property, from, to, options)');
                const fnEnd = scripts.indexOf('function animateTransform', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return animateValue('));
            });

            it('should update element style in onUpdate', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateStyle(element, property, from, to, options)');
                const fnEnd = scripts.indexOf('function animateTransform', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('element.style[property] = value + unit'));
            });
        });

        describe('animateTransform function', () => {
            it('should define animateTransform function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function animateTransform(element, transforms, options)'));
            });

            it('should support translateX transform', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateTransform(element, transforms, options)');
                const fnEnd = scripts.indexOf('function animateScroll', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('translateX'));
            });

            it('should support translateY transform', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateTransform(element, transforms, options)');
                const fnEnd = scripts.indexOf('function animateScroll', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('translateY'));
            });

            it('should support scale transform', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateTransform(element, transforms, options)');
                const fnEnd = scripts.indexOf('function animateScroll', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("parts.push('scale('"));
            });

            it('should support rotate transform', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateTransform(element, transforms, options)');
                const fnEnd = scripts.indexOf('function animateScroll', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("parts.push('rotate('"));
            });
        });

        describe('animateScroll function', () => {
            it('should define animateScroll function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function animateScroll(element, to, options)'));
            });

            it('should get current scrollTop as from value', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateScroll(element, to, options)');
                const fnEnd = scripts.indexOf('function animateFade', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('var from = element.scrollTop'));
            });

            it('should update scrollTop in onUpdate', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateScroll(element, to, options)');
                const fnEnd = scripts.indexOf('function animateFade', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('element.scrollTop = value'));
            });
        });

        describe('animateFade function', () => {
            it('should define animateFade function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function animateFade(element, direction, options)'));
            });

            it('should support in direction', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateFade(element, direction, options)');
                const fnEnd = scripts.indexOf('var rafBatchQueue', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("var isIn = direction === 'in'"));
            });

            it('should use animateStyle for opacity', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateFade(element, direction, options)');
                const fnEnd = scripts.indexOf('var rafBatchQueue', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("animateStyle(element, 'opacity'"));
            });

            it('should hide element on fade out complete', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateFade(element, direction, options)');
                const fnEnd = scripts.indexOf('var rafBatchQueue', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("element.style.display = 'none'"));
            });
        });

        describe('RAF Batch Queue System', () => {
            it('should define rafBatchQueue variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var rafBatchQueue = []'));
            });

            it('should define rafBatchScheduled variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var rafBatchScheduled = false'));
            });

            it('should define scheduleRAFUpdate function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function scheduleRAFUpdate(updateFn)'));
            });

            it('should define flushRAFBatch function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function flushRAFBatch()'));
            });
        });

        describe('createRAFStyleSetter function', () => {
            it('should define createRAFStyleSetter function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createRAFStyleSetter(element, property)'));
            });

            it('should use requestAnimationFrame', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createRAFStyleSetter(element, property)');
                const fnEnd = scripts.indexOf('function createRAFClassToggle', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('rafId = requestAnimationFrame('));
            });
        });

        describe('createRAFClassToggle function', () => {
            it('should define createRAFClassToggle function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function createRAFClassToggle(element)'));
            });

            it('should use classList.toggle', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function createRAFClassToggle(element)');
                const fnEnd = scripts.indexOf('function runOnNextFrame', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('element.classList.toggle('));
            });
        });

        describe('runOnNextFrame function', () => {
            it('should define runOnNextFrame function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function runOnNextFrame(fn)'));
            });

            it('should return requestAnimationFrame call', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function runOnNextFrame(fn)');
                const fnEnd = scripts.indexOf('function runAfterPaint', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('return requestAnimationFrame(fn)'));
            });
        });

        describe('runAfterPaint function', () => {
            it('should define runAfterPaint function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function runAfterPaint(fn)'));
            });

            it('should use double RAF technique', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function runAfterPaint(fn)');
                const fnEnd = scripts.indexOf('// ====================================================================', fnStart + 50);
                const fnBody = scripts.substring(fnStart, fnEnd);
                // Check for nested requestAnimationFrame pattern
                assert.ok(fnBody.includes('return requestAnimationFrame(function()'));
                assert.ok(fnBody.includes('requestAnimationFrame(fn)'));
            });
        });

        describe('RAF Integration in Task Animations', () => {
            it('should use runOnNextFrame in startTaskExecution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function startTaskExecution()');
                const fnEnd = scripts.indexOf('function updateTaskProgress', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use animateValue in updateTaskProgress', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateTaskProgress(percent');
                const fnEnd = scripts.indexOf('function completeTaskExecution', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('animateValue({'));
            });

            it('should use runOnNextFrame in completeTaskExecution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function completeTaskExecution()');
                const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use runAfterPaint in completeTaskExecution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function completeTaskExecution()');
                const fnEnd = scripts.indexOf('function stopTaskExecution', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runAfterPaint(function()'));
            });

            it('should use cancelAnimation in stopTaskExecution', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function stopTaskExecution()');
                const fnEnd = scripts.indexOf('function animateBarCompletion', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("cancelAnimation('taskProgress')"));
            });

            it('should use runOnNextFrame in animateBarCompletion', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function animateBarCompletion(index)');
                const fnEnd = scripts.indexOf('function checkTaskCompletion', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });
        });

        describe('RAF Integration in Toast Animations', () => {
            it('should use runOnNextFrame when appending toast', () => {
                const scripts = getClientScripts();
                // Find the showToast function
                const fnStart = scripts.indexOf('function showToast(options)');
                const fnEnd = scripts.indexOf('function dismissToast(', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use runOnNextFrame in dismissToast', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function dismissToast(toastId)');
                const fnEnd = scripts.indexOf('function dismissAllToasts', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });
        });

        describe('RAF Integration in Countdown Animation', () => {
            it('should track lastCountdownOffset variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var lastCountdownOffset = CLOCK_CIRCUMFERENCE'));
            });

            it('should use animateValue for countdown offset', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showCountdownInternal(seconds)');
                const fnEnd = scripts.indexOf('// Initialize throttled countdown', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("animateValue({"));
                assert.ok(fnBody.includes("id: 'countdownOffset'"));
            });

            it('should use cancelAnimation when hiding countdown', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showCountdownInternal(seconds)');
                const fnEnd = scripts.indexOf('// Initialize throttled countdown', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("cancelAnimation('countdownOffset')"));
            });
        });

        describe('RAF Integration in Timeline Bar Animation', () => {
            it('should define currentTaskBarRAFId variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var currentTaskBarRAFId = null'));
            });

            it('should define lastBarHeight variable', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('var lastBarHeight = 5'));
            });

            it('should use animateValue in updateCurrentTaskBar', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateCurrentTaskBar()');
                const fnEnd = scripts.indexOf('function startCurrentTaskBarAnimation', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("animateValue({"));
                assert.ok(fnBody.includes("id: 'currentTaskBar'"));
            });

            it('should define startCurrentTaskBarAnimation function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function startCurrentTaskBarAnimation()'));
            });

            it('should define stopCurrentTaskBarAnimation function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function stopCurrentTaskBarAnimation()'));
            });

            it('should use cancelAnimation in stopCurrentTaskBarAnimation', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function stopCurrentTaskBarAnimation()');
                const fnEnd = scripts.indexOf('function formatDuration', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("cancelAnimation('currentTaskBar')"));
            });
        });

        describe('RAF Integration in Skeleton Loaders', () => {
            it('should use runOnNextFrame in showSkeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeletons()');
                const fnEnd = scripts.indexOf('function hideSkeletons', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use runOnNextFrame in hideSkeletons', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideSkeletons()');
                const fnEnd = scripts.indexOf('function showSkeleton(skeletonId)', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use runOnNextFrame in showSkeleton', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function showSkeleton(skeletonId)');
                const fnEnd = scripts.indexOf('function hideSkeleton(skeletonId)', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });

            it('should use runOnNextFrame in hideSkeleton', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function hideSkeleton(skeletonId)');
                const fnEnd = scripts.indexOf('function showTimelineSkeleton', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('runOnNextFrame(function()'));
            });
        });
    });

    describe('Aggregated Stats Functions', () => {
        describe('updateAggregatedStats function', () => {
            it('should define updateAggregatedStats function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function updateAggregatedStats(stats)'));
            });

            it('should get aggregatedStatsSection element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedStatsSection')"));
            });

            it('should get aggregatedStatsEmpty element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedStatsEmpty')"));
            });

            it('should get aggregatedStatsSummary element', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedStatsSummary')"));
            });

            it('should update project count badge', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedProjectCount')"));
            });

            it('should update total tasks value', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedTotalTasks')"));
            });

            it('should update completed value', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedCompleted')"));
            });

            it('should update pending value', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedPending')"));
            });

            it('should update progress percentage', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedProgress')"));
            });

            it('should update progress bar width', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedProgressFill')"));
            });

            it('should update projects list container', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("getElementById('aggregatedStatsProjects')"));
            });

            it('should hide section when only 0 or 1 project', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('stats.projects.length <= 1'));
            });

            it('should announce to screen reader', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function updateAggregatedStats(stats)');
                const fnEnd = scripts.indexOf('function getProjectStatsRowHtml', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('announceToScreenReader'));
            });
        });

        describe('getProjectStatsRowHtml function', () => {
            it('should define getProjectStatsRowHtml function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getProjectStatsRowHtml(project, currentPath)'));
            });

            it('should check if project is active', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getProjectStatsRowHtml(project, currentPath)');
                const fnEnd = scripts.indexOf('function getAggregatedStatsState', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('project.path === currentPath'));
            });

            it('should add active class when project is current', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getProjectStatsRowHtml(project, currentPath)');
                const fnEnd = scripts.indexOf('function getAggregatedStatsState', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("activeClass = isActive ? ' active' : ''"));
            });

            it('should use escapeHtml for project name', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getProjectStatsRowHtml(project, currentPath)');
                const fnEnd = scripts.indexOf('function getAggregatedStatsState', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('escapeHtml(project.name)'));
            });

            it('should use escapeHtml for project path', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getProjectStatsRowHtml(project, currentPath)');
                const fnEnd = scripts.indexOf('function getAggregatedStatsState', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('escapeHtml(project.path)'));
            });

            it('should set progress color based on percentage', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getProjectStatsRowHtml(project, currentPath)');
                const fnEnd = scripts.indexOf('function getAggregatedStatsState', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes("progressColor = project.progress === 100 ? 'complete'"));
            });
        });

        describe('getAggregatedStatsState function', () => {
            it('should define getAggregatedStatsState function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function getAggregatedStatsState()'));
            });

            it('should return null if no totalTasksEl', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function getAggregatedStatsState()');
                const fnEnd = scripts.indexOf('function isAggregatedStatsVisible', fnStart);
                const fnBody = scripts.substring(fnStart, fnEnd);
                assert.ok(fnBody.includes('if (!totalEl) return null'));
            });
        });

        describe('isAggregatedStatsVisible function', () => {
            it('should define isAggregatedStatsVisible function', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes('function isAggregatedStatsVisible()'));
            });

            it('should check section offsetParent', () => {
                const scripts = getClientScripts();
                const fnStart = scripts.indexOf('function isAggregatedStatsVisible()');
                const fnEnd = scripts.indexOf('// ====', fnStart + 10);
                const fnBody = scripts.substring(fnStart, Math.min(fnEnd, fnStart + 500));
                assert.ok(fnBody.includes('offsetParent'));
            });
        });

        describe('aggregatedStats message handler', () => {
            it('should handle aggregatedStats message type', () => {
                const scripts = getClientScripts();
                assert.ok(scripts.includes("msg.type === 'aggregatedStats'"));
            });

            it('should call updateAggregatedStats on message', () => {
                const scripts = getClientScripts();
                const handlerStart = scripts.indexOf("msg.type === 'aggregatedStats'");
                const handlerEnd = scripts.indexOf('}', handlerStart);
                const handlerBody = scripts.substring(handlerStart, handlerEnd + 100);
                assert.ok(handlerBody.includes('updateAggregatedStats(msg)'));
            });
        });
    });

    addBreakpointTests(getClientScripts());
});
