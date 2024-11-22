"use client";
import "./ProfilePage.css";
import React, { useState, useEffect} from "react";
import { useAuth } from "../Content/AuthContext";


export default function ProfilePage() {
    const { user, checkAuthStatus} = useAuth();
    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");

    const handleSubmit = async (e) => {
        const id = user.id;
        e.preventDefault();
        const pack = {firstName:profileFirstName,
            lastName: profileLastName,
            email: profileEmail};
        try{
            const response = await fetch(`/api/profile/${id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(pack),
            });
            const returnValue = await response.json();
            if (!response.ok){
                console.error("could not change user values RIP");
                return;
            }         
            await checkAuthStatus();
            console.log(returnValue.message);
        }
        catch(error){
            console.error("Error putting user data", error.message);
        }
    };

    const handleUser = async () =>{
        const id = user.id;
        try {
            const response = await fetch(`/api/profile/${id}`,{
                method:"GET",
                headers:{"Content-Type":"application/json"},
            });
            const returnValue = await response.json();
            if (!response.ok){
                console.error("Could not get user values");
            }
            setProfileFirstName(returnValue.firstName);
            setProfileLastName(returnValue.lastName);
            setProfileEmail(returnValue.email);
        }   
        catch(error){
            console.log("error getting user data", error.message);
        }
    };

    useEffect(()=>{
        if (user){
            handleUser();
        }
    },[user]);

    return (
        <div className="screen">
            <div className="profilePageContainer">
                <div className="profileField">
                    <label htmlFor="profileName">First Name:</label>
                    <input
                        id="profileFirstName"
                        type="text"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                    />
                </div>
                <div className="profileField">
                    <label htmlFor="profileName">Last Name:</label>
                    <input
                        id="profileLastName"
                        type="text"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                    />
                </div>
                <div className="profileField">
                    <label htmlFor="profileEmail">Email:</label>
                    <input
                        id="profileEmail"
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                    />
                </div>
                <button className="submitButton" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}
