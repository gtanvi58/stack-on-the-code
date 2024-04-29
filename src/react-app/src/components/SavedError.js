function ErrorReport(props){
    return (
        <div className = "savedErr">
            <div className = "error-identifiers"> 
                <h4> {props.timeStamp}:  {props.errorTitle} </h4>
            </div>
        </div>
    )
}

export default ErrorReport;