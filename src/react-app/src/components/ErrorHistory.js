function ErrorHistory(props){
    return (
        <div className = "error">
            <div className = "error-identifiers"> 
                <h4> {props.timeStamp}:  {props.errorTitle} </h4>
            </div>
        </div>
    )
}

export default ErrorHistory;

//should be a link brings up the whole report or drop down with the summary and api response