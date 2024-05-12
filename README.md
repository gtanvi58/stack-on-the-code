# stack-on-the-code
### Introduction
StackOnTheCode is a VS Code extension to generate code/error summaries using data from StackOverflow and LLMs. This extension was inspired by our own experiences working on VSCode and finding it tedious to constantly flip back between VSCode and the browser for debugging and StackOverflow searching. StackOnTheCode eliminates the need for web browser searching by allowing you to get StackOverflow answers right in VSCode's webview. Additionally, we use an LLM to summarize the StackOverflow responses to return more concise and useful answers to the user. 

Demo video link: 

### Installation Instructions

User should have VSCode (https://code.visualstudio.com/download), node.js version 20+ (https://nodejs.org/en/download), and python version 3 (https://www.python.org/downloads/) installed.

git clone https://github.com/gtanvi58/stack-on-the-code.git

cd stack-on-the-code

run `npm install`

run `npm run watch` to watch for TypeScript changes

### Configuration/How to Run

Navigate to extension.ts and run command+shift+p -> choose `Debug: Start Debugging`

In the new window that opens, run command+shift+p -> choose `Developer: Reload Window` everytime some new changes have been made.

1. Highlight code that you want information from. For e.g - a dependency name, a React hook etc, or even an entire line of code that has is erroneous.
   
2. If you are not logged in, only the login action will be available to you. Login if you are opening the extension for the first time in this debug session. Sign up if you do not already have an account.

   For login credentials, you can use:
   email: ali.naveed8002@gmail.com
   password: test123

   If you wish to sign in, there is a 3 new users per hour limit since we are using a free version of Supabase.

4. After clicking the login or signup button. Click on bulb icon again after highlighting the text and choose the option you want.

5. The summaries or the history page should load accordingly. If the code has an error, you can click learn more about error for a mini popup with more info. Otherwise there will be a popup saying "No diagnostics found at the selected line."
   
6. When a user ends the debug session, they are automatically logged out.

### Test
Run npm run test

Delete the .vscode-test folder after each test run.

### Datasets used by LLM
We used datasets from CodeXGlue (https://github.com/microsoft/CodeXGLUE) and the LLM we used is DistilBART (https://huggingface.co/sshleifer/distilbart-cnn-12-6).

### Additional notes: 
Due to difficulties with the VSCode extensions webview API and our time constraints, we opted to not use the React framework. We also are no longer using a layered architectural design. However, we are still using the Publisher-Subscriber model for the webviews through the command listeners.

Command Listeners:
The VS Code API registers listeners for commands triggered by certain user actions. Our extension subscribes to these commands by registering command handlers. In our application, the following commands are triggered:

COMMAND_INFO = 'stack-on-the-code.onGetInfo': Triggered when the user selects the option to get more information about a line of code.
COMMAND_ERROR = 'stack-on-the-code.onGetError': Triggered when the user selects the option to get more diagnostic information from a line of code that has an error.
COMMAND_LOGIN = 'stack-on-the-code.onLogin': Triggered when the user successfully logs into the extension.
COMMAND_HISTORY = 'stack-on-the-code.onGetHistory': Triggered when the user selects the option to retrieve past history of summaries.
Text Highlighting:

We listen to changes in the active VS Code editor using the onDidChangeTextEditorSelection event listener, which monitors changes in the VS Code editor. If a user highlights text, the extension retrieves that text to make API calls to the StackExchange API.
