

function ErrorReport(props){
    return (
        <div className="report">
            <div className = "error">
                <div className = "error-identifiers"> 
                    <h4> {props.timeStamp}:  {props.errorTitle} </h4>
                </div>
                <div className="error-addInfo">
                <p className="error-summary"> Summary: {props.summary} </p>
                <p className="error-summary"> Response: {props.stackOverflowResponse}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorReport;