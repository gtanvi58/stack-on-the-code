import { useState } from 'react';
import Signup from './Signup';
import Main from './Main';

function Login(){

    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showMain, setShowMain] = useState(false);

    function loadSignup(){
        setShowSignup(!showSignup);
        setShowLogin(!showLogin);
    }

    function loadMain(){
        setShowMain(!showMain);
        setShowLogin(!showLogin);
    }

    return (
        <div>
            {showSignup && <Signup />}
            {showLogin && 
                <div id = "login-form">
                    <h1> Stack On The Code </h1>
                    <form className='form'>
                        <input type = 'text' placeholder = 'username' className='form--input'/>
                        <input type = 'password' placeholder = 'password' className='form--input'/>
                        <button className='form--button' type='submit' onClick={loadMain}> Log In </button> 

                    </form>
                    <p className="signup-text"> Don't have an account? <button onClick={loadSignup}> Click to sign up </button> </p>
                </div>
            }
            {showMain && <Main />}
        </div>
    );
}

export default Login;