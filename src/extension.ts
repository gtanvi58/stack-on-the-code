import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "stack-on-the-code" is now active!');

    let timer: NodeJS.Timeout | null = null;

    let disposable1 = vscode.window.onDidChangeTextEditorSelection(event => {
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
                    const highlighted = editor.document.getText(selectionRange);
                    console.log("Highlighted text:", highlighted);

                    axios.get(`https://api.stackexchange.com/2.3/similar?order=desc&sort=relevance&title=what is ${highlighted}&site=stackoverflow`)
                        .then((response) => {
                            console.log("Response:", response.data.items);

                            // Extract accepted answer IDs
                            const acceptedAnswerIds = response.data.items.map((item: any) => item.accepted_answer_id).filter((id: any) => id !== undefined);
                            const answerIdsString = acceptedAnswerIds.join(';');

                            axios.get(`https://api.stackexchange.com/2.3/answers/${answerIdsString}?order=desc&sort=votes&site=stackoverflow&filter=withbody`)
                                .then((response) => {
                                    console.log("Answers:", response.data.items);
                                })
                                .catch((error) => {
                                    console.error("Error fetching answers:", error);
                                });
                        })
                        .catch((error) => {
                            console.error("Error fetching similar questions:", error);
                        });
                }
            }
        }, 1000); // Adjust the delay (in milliseconds) as needed
    });

    context.subscriptions.push(disposable1);
}

export function deactivate() {}
