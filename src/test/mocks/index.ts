/**
 * Mock implementations for testing Ralph VS Code extension.
 * This module provides mock implementations of VS Code APIs and Ralph classes
 * to enable comprehensive unit testing without VS Code extension host.
 * 
 * @module mocks
 */

export * from './vscode';
export * from './ralphPanel';
export * from './ralphSidebar';
export * from './orchestrator';
export { MockUIManager, createMockUIManager } from './uiManager';
export * from './fileUtils';
export * from './timerManager';
export * from './statusBar';
export * from './taskRunner';
export * from './fileWatchers';
