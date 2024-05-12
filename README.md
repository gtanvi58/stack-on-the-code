# stack-on-the-code
### Introduction
StackOnTheCode is a VS Code extension to generate code/error summaries using data from StackOverflow and LLMs. This extension was inspired by our own experiences working on VSCode and finding it tedious to constantly flip back between VSCode and the browser for debugging and StackOverflow searching. StackOnTheCode eliminates the need for web browser searching by allowing you to get StackOverflow answers right in VSCode's webview. Additionally, we use an LLM to summarize the StackOverflow responses to return more concise and useful answers to the user. 
### Installation Instructions

git clone https://github.com/gtanvi58/stack-on-the-code.git

cd stack-on-the-code

run `npm install`

run `npm run watch` to watch for TypeScript changes

### Configuration/How to Run

Navigate to extension.ts and run command+shift+p -> choose `Debug: Start Debugging`

In the new window that opens, run command+shift+p -> choose `Developer: Reload Window` everytime some new changes have been made.

1. Highlight code that you want information from. For e.g - a dependency name, a React hook etc, or even an entire line of code that has is erroneous.
   
2. If you are not logged in, only the login action will be available to you. Login if you are opening the extension for the first time in this debug session. Sign up if you do not already have an account. 

4. After clicking the login or signup button. Click on bulb icon again after highlighting the text and choose the option you want.

5. The summaries or the history page should load accordingly. If the code has an error, you can click learn more about error for a mini popup with more info. Otherwise there will be a popup saying "No diagnostics found at the selected line."
   
6. When a user ends the debug session, they are automatically logged out. 

### Datasets used by LLM
We used datasets from CodeXGlue (https://github.com/microsoft/CodeXGLUE) and the LLM we used is DistilBART (https://huggingface.co/sshleifer/distilbart-cnn-12-6).
