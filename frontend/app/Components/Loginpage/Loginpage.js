"use client";
import "./Loginpage.css";
import React, {useEffect, useRef, useState} from "react";
import { useRouter } from "next/navigation";

import {useAuth} from "../Content/AuthContext";


export default function Loginpage(){
    const [errorMessage,seterrorMessage] = useState("Error mesasge");
    const [LoginOrOut, setLoginOrOut] = useState("Login");
    const router = useRouter();
    const { checkAuthStatus } = useAuth();
    const googleAuth = () =>{
        window.location.href = `/api/auth/google`;
    };
    const handleSignIn = async (e) =>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const pack = {email,password};
        
        try {
            const response = await fetch("/api/auth/firebaseSignIn", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(pack),
            });
            const userReturn = await response.json();
            if (!response.ok){
                seterrorMessage("could not sign in rip");
                return;
            }
            console.log("User signed in successfully");
            e.target.reset();
            await checkAuthStatus();
            router.push("/home");
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
        const username = e.target.Username.value;
        const pack = {email,firstName,lastName,password,role,username};
        try{
            const response = await fetch("/api/auth/firebaseSignUp",{
                method:"POST",
                headers:{"Content-Type": "application/json",},
                body: JSON.stringify(pack),
            });
            const userReturn = await response.json();
            if (!response.ok){
                seterrorMessage("Could not create account");
                return;
            }
            console.log("User created");
            setLoginOrOut("Login");
            e.target.reset();
            await checkAuthStatus();
            router.back();
        }
        catch(error){
            console.error("error signing up", error.message);
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
            <form onSubmit={handleSignIn}>
            <div className="SignInInput">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="password">Password</label> 
                <input type="password" id="password" name="password" required></input>
            </div>
            <button type="submit" className="SignInBtn">Sign In</button>
            </form>
            <button onClick={googleAuth} className= "SignInBtn">Login with Google</button>
            <div className="signup" onClick={switchform}>Click to SignUp</div>
        </div> }
        
        {LoginOrOut === "SignUp" && <div className = "SignInBox">
            <h2>Sign up</h2>
            <form onSubmit={handleSignUp}>
            <div className="SignInInput">
                <label htmlFor="FirstName">First Name</label>
                <input type="text" id="text" name="FirstName" required></input>
            </div>
            <div className="SignInInput">z
                <label htmlFor="LastName">Last Name</label>
                <input type="text" id="text" name="LastName" required></input>
            </div>
            <div className="SignInInput">
                <label htmlFor="Username">Username</label>
                <input type="text" id="text" name="Username" required></input>
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