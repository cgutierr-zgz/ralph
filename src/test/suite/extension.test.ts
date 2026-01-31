import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    it('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('ralph-dev.ralph'));
    });

    it('Extension should activate', async () => {
        const ext = vscode.extensions.getExtension('ralph-dev.ralph');
        if (ext) {
            await ext.activate();
            assert.ok(ext.isActive);
        }
    });
});
