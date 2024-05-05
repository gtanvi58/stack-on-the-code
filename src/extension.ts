import * as vscode from 'vscode';
import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';
import axios from 'axios';

const COMMAND_INFO = 'stack-on-the-code.onGetInfo';
const COMMAND_ERROR = 'code-actions-sample.onGetError';

let infoLine = '';
let errorLine = ''
let diagnostics: vscode.Diagnostic[] = [];

const stackExchangeGet = (highlighted: String, isError: Boolean) => {
    let query = highlighted;
    if(!isError){
        query = 'what is '+highlighted
        infoLine = ''
    }
    else{
        errorLine = ''
    }
    console.log("printing query ", query)
    axios.get(`https://api.stackexchange.com/2.3/similar?order=desc&sort=relevance&title=${query}&site=stackoverflow`)
    .then((response) => {
        console.log("Response:", response.data.items);

        // Extract accepted answer IDs
        // const acceptedAnswerIds = response.data.items.map((item: any) => item.accepted_answer_id).filter((id: any) => id !== undefined);
        // const questions = response.data.items.map((item: any) => item.accepted_answer_id).filter((id: any) => id !== undefined);

        const acceptedAnswerIds = response.data.items
    .filter((item: any) => item.accepted_answer_id !== undefined) // Filter out items without accepted answers
    .map((item: any) => item.accepted_answer_id); // Map to accepted answer IDs

const questions = response.data.items
//     .filter((item: any) => item.accepted_answer_id === undefined) // Filter out items with accepted answers
//     .map((item: any) => item);
//     console.log("printing questions ", questions)

        const answerIdsString = acceptedAnswerIds.join(';');


        axios.get(`https://api.stackexchange.com/2.3/answers/${answerIdsString}?order=desc&sort=votes&site=stackoverflow&filter=withbody`)
            .then((response) => {
                console.log("Answers:", response.data.items);
                const panel = vscode.window.createWebviewPanel(
                    'apiResults', // Identifies the type of the webview. Used internally
                    'API Results', // Title of the panel displayed to the user
                    vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
                    {}
                );
                let htmlContent = `
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>API Results</title>
                                    <style>
                                        /* Add your CSS styles here */
                                    </style>
                                </head>
                                <body>
                                    <h1>API Results</h1>
                                    <h2>Similar Questions:</h2>
                                    <ul>
                                `;

                                console.log("printing question length ", questions.length)
                                console.log("printing answer length ", response.data.items.length)

                                questions.forEach((questionItem: any) => {
                                    if(questionItem.accepted_answer_id){
                                        htmlContent += `<li>${questionItem.title}</li>`; // Display the question title
                                        console.log("printing question item", questionItem)
                                    
                                        // Find response for this question
                                        const matchingResponse = response.data.items.find((responseItem: any) => {
                                            console.log("printing answer item ", responseItem)
                                            return responseItem.answer_id === questionItem.accepted_answer_id;
                                        });
                                    
                                        if (matchingResponse) {
                                            htmlContent += `<ol>${matchingResponse.body}</ol>`; // Display the response content
                                        }
                                    }
                                   
                                });
                                
                panel.webview.html = htmlContent;
            })
            .catch((error) => {
                console.error("Error fetching answers:", error);
            });
    })
    .catch((error) => {
        console.error("Error fetching similar questions:", error);
    });
    
}
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('*', new Emojizer(), {
			providedCodeActionKinds: Emojizer.providedCodeActionKinds
		}));

	const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
	context.subscriptions.push(emojiDiagnostics);

	subscribeToDocumentChanges(context, emojiDiagnostics);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('markdown', new Emojinfo(), {
			providedCodeActionKinds: Emojinfo.providedCodeActionKinds
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_INFO, () => {
            if(infoLine){
                stackExchangeGet(infoLine, false)
            }
            else{
                vscode.window.showErrorMessage('Select text to get more info');
            }
        })
	);

    context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_ERROR, () => {
            if(errorLine){
                stackExchangeGet(errorLine, true)
            }
            else{
                vscode.window.showErrorMessage('Select text to get more error diagnostics');
            }
        })
	);

    let timer: NodeJS.Timeout | null = null;

    let getHighlightedText = vscode.window.onDidChangeTextEditorSelection(event => {
        console.log("Selection changed");

        // Clear any existing timer
        if (timer !== null) {
            clearTimeout(timer);
        }

        // Start a new timer
        timer = setTimeout(() => {
            console.log("Timer expired");

            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                if (selection && !selection.isEmpty) {
                    const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
                    infoLine = editor.document.getText(selectionRange);
                    console.log("Highlighted text:", infoLine);
                    let uri = editor.document.uri;
                    diagnostics = vscode.languages.getDiagnostics(uri);
                    const selectedLine = selection.start.line;
                    const diagnosticsAtLine = diagnostics.filter(diagnostic =>
                        diagnostic.range.start.line === selectedLine
                    );

                    if (diagnosticsAtLine.length > 0) {
                        errorLine = diagnosticsAtLine.map(diagnostic => diagnostic.message).join('\n');
                        console.log("printing error ", errorLine)
                    } else {
                        vscode.window.showInformationMessage('No diagnostics found at the selected line.');
                    }
                }
            }
        }, 1000); // Adjust the delay (in milliseconds) as needed
    });

    context.subscriptions.push(getHighlightedText);
}

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class Emojizer implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
            console.log("inside code actions")

		const commandActionInfo = this.createCommandInfo();
        const commandActionError = this.createCommandError();

		return [
			commandActionInfo,
            commandActionError
		];
	}

	private createCommandInfo(): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more about selected text', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_INFO, title: 'Learn more about selected text 1', tooltip: 'This will display more info' };
		return action;
	}

    private createCommandError(): vscode.CodeAction {
		const action = new vscode.CodeAction('Get error fixes', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_ERROR, title: 'Learn more about error', tooltip: 'This will display more error info'}
		return action;
	}
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class Emojinfo implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
		// for each diagnostic entry that has the matching `code`, create a code action command
		return context.diagnostics
			.filter(diagnostic => diagnostic.code === EMOJI_MENTION)
			.map(diagnostic => this.createCommandCodeAction(diagnostic));
	}

	private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
		action.command = { command: COMMAND_INFO, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}
}


