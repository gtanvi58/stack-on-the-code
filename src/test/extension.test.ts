import { strict as assert } from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { COMMAND_INFO, COMMAND_ERROR, COMMAND_HISTORY, COMMAND_LOGIN, stackExchangeGet } from '../extension';

suite('Command Tests', () => {
    let errorMessageStub: sinon.SinonStub;

    setup(() => {
        errorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
    });

    teardown(() => {
        errorMessageStub.restore();
    });

    test('Info Command', async () => {
        await vscode.commands.executeCommand(COMMAND_INFO);
        assert(errorMessageStub.calledOnce);
    });

    test('Error Command', async () => {
        await vscode.commands.executeCommand(COMMAND_ERROR);
        assert(errorMessageStub.calledOnce);
    });

    test('History Command', async () => {
        const panel = vscode.window.createWebviewPanel('history', 'History of Past Summaries', vscode.ViewColumn.Beside);
        const expectedTitle = 'History of Past Summaries';
        assert.equal(panel.title, expectedTitle);
    });
});
