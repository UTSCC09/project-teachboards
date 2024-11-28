"use client";
import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Link from "next/link";
import {useAuth} from "../Content/AuthContext.js";
import {getData} from "../Content/AllCalls.js";

export default function HomePage() {
    const { user } = useAuth();
    const [windowWidth, setWindowWidth] = useState();
    const {friends, setFriends} = getData();
    
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (user && user.id) {
            retriveFriends(); 
            const interval = setInterval(() => {retriveFriends(); }, 60000); 
            return () => clearInterval(interval); 
        }
    }, [user]);

    const retriveFriends = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
            const response = await fetch(`/api/retriveFriends/${id}`, {method: "GET",headers: { "Content-Type": "application/json" },});
            const data = await response.json();
            if (!response.ok) { return;}
            console.log("Friends retrieved");
            setFriends(data.friendsWithStatus || []);
        } catch (error) {
            console.error("Error retrieving friends:", error);
        }
    };

    return (
        <div className = "HomePage">

            {windowWidth > 900 && <div className = "HPFriends">
                <p className = "HPF">Friends</p>
                {friends.map((friend)=>{
                    return (
                    <Link key={friend.username} href="/friends" className = "HPFContainer">
                        <p className="Helperer">{friend.username}</p>
                        <p className={`HF${friend.status.toLowerCase()}`}>{friend.status}</p>
                    </Link>
                    )
                })}
                <Link href="/friends" className = "HPFContainer">
                        <p className="Helperer">See more</p>
                    </Link>
            </div> }

            <div className = "HPCenter">
                <p className = "HPC">Recent Notes</p>
                <div className = "NoteContainer">

                </div>
            </div>

            {windowWidth > 1300 && <div className = "HPRight">
                <p className = "HPR">Next Call</p>
                <div className = "HPRContainer"></div>
                <div className = "HPRContainer"></div>
                <div className = "HPRContainer"></div>
                <div className = "HPRContainer"></div>
            </div>}


        </div>
    );
}
