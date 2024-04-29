import ErrorHistory from "./ErrorHistory";

function History(){
    return( 
        <div>
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
        </div>

    );
}

export default History;