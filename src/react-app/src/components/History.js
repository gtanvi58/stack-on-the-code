import ErrorHistory from "./ErrorHistory";
import Main from "./Main";
import { useState } from "react";

function History(){
    const [showMain, setShowMain] = useState(false);
    const [showHistory, setShowHistory] = useState(true);

    function loadMain(){
        setShowMain(!showMain);
        setShowHistory(!showHistory);
    }


    return( 
        <div>
            {showHistory && <div>
                <h1> History: </h1>
                <div className="savedErrorsList">
                    <ErrorHistory
                        key = "1"
                        timeStamp = "29 April 2024, 10:20am"
                        errorTitle = "Division by zero"
                    />

                    <ErrorHistory
                        key = "2"
                        timeStamp = "29 April 2024, 10:40am"
                        errorTitle = "Infinite Loop"
                    />
                </div>
                <div className="report-btn-div">
                    <button className= "error-report--button" onClick={loadMain}> New Search </button>
                </div>
            </div>}
            {showMain && <Main />}
        </div>

    );
}

export default History;