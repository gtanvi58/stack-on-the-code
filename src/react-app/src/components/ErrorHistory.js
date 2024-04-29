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