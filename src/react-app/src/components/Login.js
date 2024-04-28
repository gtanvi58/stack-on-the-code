function Login(){
    function loadSignup(){
        console.log("Go to sign up page");
    }

    function loadMain(){
        console.log("Go to main");
    }

    return (
        <main id = "login-form">
            <h1> Stack On The Code </h1>
            <form className='form'>
                <input type = 'text' placeholder = 'username' className='form--input'/>
                <input type = 'password' placeholder = 'password' className='form--input'/>
                <button className='form--button' type='submit' onClick={loadMain}> Log In </button> 

            </form>
            <p className="signup-text"> Don't have an account? <button onClick = {loadSignup}> Click to sign up </button>  </p>
        </main>
    );
}

export default Login;