import * as vscode from 'vscode';
import { subscribeToDocumentChanges, EMOJI_MENTION } from './diagnostics';
import axios from 'axios';
import {exec} from 'child_process'
const { spawn } = require('child_process');
const { readFile } = require('fs/promises');
const { spawnSync } = require('child_process');
const path = require('path');
const fsPromises = require('fs').promises;
import {createClient} from '@supabase/supabase-js'
import { Auth } from '@supabase/ui';


const supabaseUrl = 'https://zlenezbwfqcoawbssfed.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZW5lemJ3ZnFjb2F3YnNzZmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNzUzNjIsImV4cCI6MjAzMDg1MTM2Mn0.pxuJfTh-z3EiJs4ItDVedAN2EGiSHO-KJUYj2FI294Y'
const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

const currentDir = __dirname;
const desiredDir = path.join(currentDir, '../src');
const scriptPath = path.join(desiredDir, 'check.py');
console.log("printing cwd ", scriptPath)

const COMMAND_INFO = 'stack-on-the-code.onGetInfo';
const COMMAND_ERROR = 'stack-on-the-code.onGetError';
const COMMAND_LOGIN = 'stack-on-the-code.onLogin';
const COMMAND_HISTORY = 'stack-on-the-code.onGetHistory';

let infoLine = '';
let errorLine = ''
let diagnostics: vscode.Diagnostic[] = [];
let hasUserLoggedIn = true;



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
        // console.log("Response:", response.data.items);

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
                // console.log("Answers:", response.data.items);
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

                                // console.log("printing question length ", questions.length)
                                // console.log("printing answer length ", response.data.items.length)

                                const sendToLLM: any[] = [];
                                let summaryArray: any[] = [];
                                let count = 0;
                                let questionsArray: any[] = [];
                                let c=0;

                                questions.forEach(async (questionItem: any) => {
                                    if(questionItem.accepted_answer_id){

                                        // console.log("printing question item", questionItem)
                                    
                                        const matchingResponse = response.data.items.find((responseItem: any) => {
                                            // console.log("printing answer item ", responseItem)
                                            return responseItem.answer_id === questionItem.accepted_answer_id;
                                        });
                                    
                                        if (matchingResponse && count<3) {
                                          questionsArray.push(questionItem.title)
                                          count++;
                                            // htmlContent += `<li>${questionItem.title}</li>`; // Display the question title

                                          // console.log("printing type of matching response ", JSON.stringify(matchingResponse))
                                          const pythonProcess = await spawnSync('python3', [
                                            scriptPath,
                                            'first_function',
                                            JSON.stringify(matchingResponse),
                                            `${desiredDir}/results.json`
                                          ]);
          
                                          console.log("printing path ", `${desiredDir}/results.json`)
          
                                          const result = pythonProcess.stdout?.toString()?.trim();
                                          

// Using substring
let finalRes = result.substring(result.indexOf("full summary:") + "full summary:".length);
summaryArray.push(finalRes);
if(summaryArray.length >= 3){
  let index = 0;
  questionsArray.forEach((q:any) => {
    // let r = summaryArray[0]; // Get the corresponding answer
    console.log("printing inside for each answer ", summaryArray[0])
    // Construct HTML content for question and answer pair
    htmlContent += `<li>${q}</li>`;
    htmlContent += `<ol>${summaryArray[index]}</ol>`;
    index++;
});
panel.webview.html = htmlContent;

}

console.log("printing summary array ", summaryArray[0])

// // htmlContent += `<ol>${finalRes}</ol>`;

// // Using slice
// // let result = inputString.slice(inputString.indexOf("full summary:") + "full summary:".length);

// // Using regular expression
// // let result = inputString.match(/full summary:(.*)/)[1];

// console.log(result.trim());
//                                           console.log("printing in node js ", result);
//                                           // // result.forEach((res: any) =>{
//                                           // //   console.log("printing item ", JSON.stringify(res));
//                                           // // })
//                                           const error = pythonProcess.stderr?.toString()?.trim();
          
//                                           // const status = result === 'OK';
//                           let resultParsed = []
//             // if (status) {
//               // const buffer = await readFile( `${desiredDir}/results.json`);
//               // resultParsed = JSON.parse(buffer?.toString());
//               // console.log("printing parsed node ", resultParsed)
//             // } else {
//             //   console.log(error)
//             // }
//                                             sendToLLM.push(JSON.stringify(matchingResponse))
//                         //                     fsPromises.writeFile('./answers.json', JSON.stringify(matchingResponse))
//                         // .then(  () => { console.log('Append Success'); })
//                         // .catch((err: any) => { console.log("Append Failed: "+err);});
                          
                                        }

                                        
                                    }
                                   
                                });
                        


            })
            .catch((error) => {
                console.error("Error fetching answers:", error);
            });
    })
    .catch((error) => {
        console.error("Error fetching similar questions:", error);
    });
    
}

const displayHistory = () => {
    const panel = vscode.window.createWebviewPanel(
        'history', // Identifies the type of the webview. Used internally
        'History of Past Summaries', // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {}
    );
    let htmlContent = `<html>
    <head>
      <title>Stack On The Code</title>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
      <link rel="stylesheet" type="text/css" href="./history.css" />
    </head>
    <body>
      <header>
        <nav class="nav">
          <h1 class="nav--title">Stack On The Code</h1>
        </nav>
      </header>
      <h1 class="history-title">History</h1>
      <div class="history-header">
        <hr class="rounded">
      </div>
      <div class="history-content">
        <div class="columns container" id="history-container">
          <div class="row">
            <div class="col">
              <h4>User Prompt</h4>
            </div>
            <div class="col">
              <h4>Stack Overflow Question</h4>
            </div>
            <div class="col">
              <h4>Answer</h4>
            </div>
          </div>
        </div>
        <div class="error container">
          <div class="row">
            <div class="col">
              <p>example</p>
            </div>
            <div class="col">
              <p>example</p>
            </div>
            <div class="col">
              <p>example</p>
            </div>
          </div>
        </div>
        <button onclick="addRow()">Add Row</button>
      </div>
      
      <script>
        function addRow() {
          var container = document.getElementById('error container');
          var newRow = document.createElement('div');
          newRow.className = 'row';
          newRow.innerHTML = \`
            <div class="col">
              <h4>New User Prompt</h4>
            </div>
            <div class="col">
              <h4>New Stack Overflow Question</h4>
            </div>
            <div class="col">
              <h4>New Answer</h4>
            </div>\`;
          container.appendChild(newRow);
        }
      </script>
    </body>
    </html>
    `

panel.webview.html = htmlContent;
}

function createLoginWebview() {
  const panel = vscode.window.createWebviewPanel(
    'login', // Identifies the type of the webview. Used internally
    'Login', // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      enableScripts: true
    }
  );

  let sampleHtml = 
  `<form id="loginForm">

    <div class="container">
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required>

      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>

      <button type="submit">Login</button>
    </div>
  </form>

  <form id="SignUpForm">

    <div class="container">
      <label for="uname2"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname2" required>

      <label for="psw2"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw2" required>

      <button type="submit">SignUp</button>
    </div>
  </form>

  <script>
    const vscode = acquireVsCodeApi();
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get('uname');
      const password = formData.get('psw');
      if (email && password) {
        vscode.postMessage({
          command: 'login',
          email,
          password
        });
      }
    });

    const signUpForm = document.getElementById('SignUpForm');
    signUpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(signUpForm);
      const email = formData.get('uname2');
      const password = formData.get('psw2');
      if (email && password) {
        vscode.postMessage({
          command: 'signUp',
          email,
          password
        });
      }
    });
  </script>
  `;

  panel.webview.onDidReceiveMessage(
    async message => {
      console.log(message)
      switch (message.command) {
        case 'login':
          let email = message.email;
          let password = message.password;
          await loginCommand(email, password);
        case 'signUp':
          let email2 = message.email;
          let password2 = message.password;
          await signUpCommand(email2, password2);
      }
    }
  )

  panel.webview.html = sampleHtml;
}

const signUpCommand = async (email: string, password: string) => {
  console.log("sign UP function called")
  try{
  const {data, error} = await supabase.auth.signUp({
    email: email,
    password: password
  })
  if (error) {
    console.log("printing error ", error)
  }
  else{
    console.log("printing data ", data)
  }
}
  catch(e){
    console.log("printing error ", e)
  }
}

const loginCommand = async (email: string, password: string) => {
  console.log("logging in")
  const {data, error} = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
}

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_LOGIN, () => {
      createLoginWebview();
    })
  );

  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') {
      console.log("User is signed in");
      hasUserLoggedIn = true;
    }
    else if (event == 'USER_UPDATED') {
      console.log("User is updated");
    }
  });

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

    context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_HISTORY, () => {
           displayHistory();
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

        const commandStack = [];
		const commandActionInfo = this.createCommandInfo();
        const commandActionError = this.createCommandError();
        const commandActionHistory = this.createCommandHistory();
        const commandLogin = this.createCommandLogin();
        hasUserLoggedIn? commandStack.push(commandActionInfo, commandActionError, commandActionHistory, commandLogin) : commandStack.push(commandLogin);

		return commandStack;
	}

	private createCommandInfo(): vscode.CodeAction {
		const action = new vscode.CodeAction('Learn more about selected text', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_INFO, title: 'Learn more about selected text 1', tooltip: 'This will display more info' };
		return action;
	}

    private createCommandError(): vscode.CodeAction {
		const action = new vscode.CodeAction('Get Error Fixes', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_ERROR, title: 'Learn more about error', tooltip: 'This will display more error info'}
		return action;
	}

    private createCommandHistory(): vscode.CodeAction {
		const action = new vscode.CodeAction('View History of Past Summaries', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_HISTORY, title: 'History', tooltip: 'This will allow you to view the past summaries'}
		return action;
	}

    private createCommandLogin(): vscode.CodeAction {
		const action = new vscode.CodeAction('Login to get Diagnostic Information About Your Code.', vscode.CodeActionKind.Empty);
		action.command = { command: COMMAND_LOGIN, title: 'Login', tooltip: 'This will take you to the login page.'}
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


