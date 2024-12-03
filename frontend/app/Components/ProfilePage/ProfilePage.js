"use client";
import "./ProfilePage.css";
import React, { useState, useEffect} from "react";
import { useAuth } from "../Content/AuthContext";


export default function ProfilePage() {
    const { user, checkAuthStatus} = useAuth();
    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileUsername, setProfileUsername] = useState("");

    const check = () => user && profileFirstName !== "" && profileLastName !== "" && profileEmail !== "" && profileUsername !== "";
    const [errormessage, seterrormessage] = useState("This is an error message actual");
    const [haserror, sethaserror] = useState(false);

    const handleerror = (message) => {
        sethaserror(true);
        seterrormessage(message);
        setTimeout(removeerror, 5000);
    };
    const removeerror = ()=>{
        seterrormessage("");
        sethaserror(false);
    }

            
    const handleSubmit = async (e) => {
        const id = user.id;
        e.preventDefault();
        const pack = {
            firstName:profileFirstName,
            lastName: profileLastName,
            email: profileEmail,
            username: profileUsername};
            
        try{
            const response = await fetch(`/api/profile/${id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(pack),
            });
            const returnValue = await response.json();
            if (!response.ok){
                handleerror(returnValue.message);
                return;
            }         
            await checkAuthStatus();
            console.log(returnValue.message);
        }
        catch(error){
            console.error("Error putting user data", error.message);
            handleerror(error.message);
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
                handleerror(returnValue);
                return;
            }
            setProfileFirstName(returnValue.firstName);
            setProfileLastName(returnValue.lastName);
            setProfileEmail(returnValue.email);
            setProfileUsername(returnValue.username);
        }   
        catch(error){
            console.log("error getting user data", error.message);
            handleerror(error.message);
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
            {!check() && <p className = "loadingPP">Loading Please Wait...</p>}
                {check() &&  <div className="profileField">
                    <label htmlFor="profileName">First Name:</label>
                    <input
                        id="profileFirstName"
                        type="text"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                    />
                </div>}
                {check() && <div className="profileField">
                    <label htmlFor="profileName">Last Name:</label>
                    <input
                        id="profileLastName"
                        type="text"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                    />
                </div>}
                {check() && <div className="profileField">
                    <label htmlFor="profileUsername">Username:</label>
                    <input
                        id="profileUsername"
                        type="text"
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                    />
                </div>}
                {check() &&   <div className="profileField">
                    <label htmlFor="profileEmail">Email:</label>
                    <input
                        id="profileEmail"
                        type="text"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                    />
                </div>}
                {check() &&   <button className="submitButton" onClick={handleSubmit}>
                    Submit
                </button>}
            </div>
            {haserror && <div className = "errormessagepopup">{errormessage}</div>}
        </div>
    );
}
