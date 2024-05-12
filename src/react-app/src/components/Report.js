import ErrorReport from "./ErrorReport";
import History from "./History";
import { useState } from "react";

function Report(){

    const [showHistory, setShowHistory] = useState(false);
    const [showReport, setShowReport] = useState(true);

    function loadHistory(){
        setShowHistory(!showHistory);
        setShowReport(!showReport);
    }

    return( 
        <div>
            {showReport && 
            <div>
                <h1> Error Report: </h1>
                <ErrorReport
                    key = "1"
                    timeStamp = "29 April 2024, 10:20am"
                    errorTitle = "Division by zero"
                    summary = "You cannot divide by zero."
                    stackOverflowResponse = "asdfghjkl"
                />
                <div className="report-btn-div"> 
                <button className="error-report--button" onClick={loadHistory}> View History </button>
                </div>
            </div>
            }
            {showHistory && <History />}
        </div>

    );
}

export default Report;