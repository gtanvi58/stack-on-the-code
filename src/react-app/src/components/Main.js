import { useState } from 'react';
import Report from "./Report";

function Main(){

    const [showMain, setShowMain] = useState(true);
    const [showReport, setShowReport] = useState(false);

    function loadReport(){
        setShowReport(!showReport);
        setShowMain(!showMain);
    }

    return (
        <div> 
            {showMain && <div className="main-content">
                <div className = "instructions">
                    <h2> Instructions: </h2>
                    <p className = "instructions--text"> Highlight the desired lines of code in your VSCode workspace. 
                        The error will populate in the text box with the default LLM prompt. 
                        Edit the prompt within the text box if desired. 
                        Click the search button when you are ready for your error report. </p>
                </div>
                <div className = "error-search">
                    <h2> Selected Error and Prompt: </h2>
                    <form className='error-search--form'>
                        <textarea className='input-long'> </textarea>
                        <button className='error-search--button' type='submit' onClick = {loadReport}> Search </button> 
                    </form>
                </div>
            </div>}
            {showReport && <Report />}
        </div>
    );
}

export default Main;