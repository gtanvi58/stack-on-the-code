# stack-on-the-code
A VS Code extension to generate code/error summaries using data from StackOverflow

# Installation

git clone https://github.com/gtanvi58/stack-on-the-code.git

cd stack-on-the-code

run `npm install`

run `npm run watch` to watch for TypeScript changes


# Run

Navigate to extension.ts and run command+shift+p -> choose `Debug: Start Debugging`

In the new window that opens, run command+shift+p -> choose `Developer: Reload Window` everytime some new changes have been made.

1. Highlight code that you want information from. For e.g - a dependency name, a React hook etc, or even an entire line of code that has is erroneous. 

2. Click on bulb icon after highlighting the text and choose the option you want.

3. The summaries or the history page should load accordingly.

# Test

Run `npm run test`

Delete the `.vscode-test` folder after each test run.

