import { useState } from 'react';
import Main from './Main';

function Signup(){

    const [showSignup, setShowSignup] = useState(true);
    const [showMain, setShowMain] = useState(false);
    
    function loadMain(){
        setShowMain(!showMain);
        setShowSignup(!showSignup);
    }
    return (
        <div>
            {showSignup && <div className = "signup-form">
                <h1> Welcome to Stack On The Code </h1>
                <p className='signup-info-text'> Easier debugging and code help is just a few clicks away! Enter a username and password to create your account. </p>
                <form className='form'>
                    <input type = 'text' placeholder = 'username' className='form--input'/>
                    <input type = 'password' placeholder = 'password' className='form--input'/>
                    <button className='form--button' type='submit' onClick={loadMain}> Sign Up </button> 

                </form>
            </div>}
            {showMain && <Main />}
        </div>
    );
}

export default Signup;