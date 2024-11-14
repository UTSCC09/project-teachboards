"use client";
import "./Loginpage.css";
import React, {useEffect, useRef, useState} from "react";
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../firebase.js";
import {useRouter} from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

export default function Loginpage(){
    const [errorMessage,seterrorMessage] = useState("Error mesasge");
    const [LoginOrOut, setLoginOrOut] = useState("Login");
    const router = useRouter();

    const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";

    const handleSignIn = async (e) =>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        try {
            const id = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in successfully");
            e.target.reset();
            router.push(returnUrl);
        } catch (error) {
            console.error("Error signing in", error.message);
            seterrorMessage("Could not sign in, please try again");
        }
    };
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        const firstName = e.target.FirstName.value;
        const lastName = e.target.LastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = e.target.role.value;
    
        try {
            const userInfo = await createUserWithEmailAndPassword(auth, email, password);
            const id = userInfo.user.uid;

            await setDoc(doc(db, "users", id), {
                firstName,
                lastName,
                email,
                role,
                uid: id
            });

            console.log("User account made");
            e.target.reset();
        } catch (error) {
            console.error("Error signing up", error.message);
            seterrorMessage(error.message); 
        }
    };

    const switchform = () =>{
        if (LoginOrOut === "Login") setLoginOrOut("SignUp");
        if (LoginOrOut === "SignUp") setLoginOrOut("Login");
    }
    
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
            <div className="SignInInput">
                <label htmlFor="role"></label>
                <select id="role" name="role" required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>
            <button type="submit" className="SignInBtn">SignUp</button>
            <div className="signup" onClick={switchform}>Click to SignIn</div>
            </form>
        </div>}

    </div>
    )
}