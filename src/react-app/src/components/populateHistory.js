// Define the initialization function
function init() {
    console.log("Initialization tasks executed on page load!");
    populateHistory();
  }
  
  window.addEventListener("load", init);

function populateHistory(){
    const history_arr = [{prompt: "asd", question: "ges", answer:"aef"}]; //get the history from database
    
    for(const entry of history_arr){
        const newError = document.createElement("div");
        const contentDiv = document.getElementById("main-content");
        newError.classList.add("error");
        newError.classList.add("container");
        contentDiv.appendChild(newError);

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        newError.appendChild(rowDiv);

        const promptColDiv = document.createElement("div");
        promptColDiv.classList.add("prompt");
        promptColDiv.classList.add("col");
        const promptText = document.createElement("p");
        promptText.innerHTML = entry.prompt;
        promptColDiv.appendChild(promptText);
        rowDiv.appendChild(promptColDiv);

        const questionColDiv = document.createElement("div");
        questionColDiv.classList.add("question")
        questionColDiv.classList.add("col");
        const questionText = document.createElement("p");
        questionText.innerHTML = entry.question;
        questionColDiv.appendChild(questionText);
        rowDiv.appendChild(questionColDiv);

        const answerColDiv = document.createElement("div");
        answerColDiv.classList.add("answer");
        answerColDiv.classList.add("col");
        const answerText = document.createElement("p");
        answerText.innerHTML = entry.answer;
        answerColDiv.appendChild(answerText);
        rowDiv.appendChild(answerColDiv);
      }
}