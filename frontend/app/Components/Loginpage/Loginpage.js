import "./Loginpage.css";
import React, {useEffect, useRef, useState} from "react";

export default function Loginpage(){
    const [displayError, setdisplayError] = useState(false);
    const [errorMessage,seterrorMessage] = useState("Error mesasge");
    const [LoginOrOut, setLoginOrOut] = useState("SignUp");

    const handleSignIn = (e) =>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        //do a funciton that handles this submitting 

        console.log(email + " " + password );

        //insert he code between these things 
        e.target.reset();
    };
    const handleSignUp =(e) => {
        e.preventDefault();
        const firstName = e.target.FirstName.value;
        const lastName = e.target.LastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        //do a funciton that handles this submitting 
        console.log(firstName + " " + lastName + " " + email + " " + password );
        //insert he code between these things 
        e.target.reset();
    };
    const badInput = () =>{
        //Please have this function be the implementatino of all the backend code for this 
        setdisplayError(true);
        seterrorMessage("Please put the error message return here");
    };

    const switchform = () =>{
        if (LoginOrOut === "Login") setLoginOrOut("SignUp");
        if (LoginOrOut === "SignUp") setLoginOrOut("Login");
    }

    //Still need to add the function that closes this form btw... lmaooo player 
    
    return (
        <div className="SignInContainer"> 
        {LoginOrOut === "Login" && <div className="SignInBox">
            <h2>Sign In</h2>
            <form method="POST" onSubmit={handleSignIn}>
            <div className="SignInInput">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="password">Password</label> 
                <input type="password" id="password" name="password" required></input>
            </div>
            <button type="submit" className="SignInBtn">Sign In</button>
            <div className="signup" onClick={switchform}>Click to SignUp</div>
            </form>
            {displayError && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div> }
        
        {LoginOrOut === "SignUp" && <div className = "SignInBox">
            <h2>Sign up</h2>
            <form method="POST" onSubmit={handleSignUp}>
            <div className="SignInInput">
                <label htmlFor="FirstName">First Name</label>
                <input type="text" id="text" name="FirstName" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="LastName">Last Name</label>
                <input type="text" id="text" name="LastName" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="password">Password</label> 
                <input type="password" id="password" name="password" required></input>
            </div>
            <button type="submit" className="SignInBtn">SignUp</button>
            <div className="signup" onClick={switchform}>Click to SignIn</div>
            </form>
            {displayError && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>}

    </div>
    )
}