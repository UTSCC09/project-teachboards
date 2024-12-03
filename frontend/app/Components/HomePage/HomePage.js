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
    const [notes, setNotes] = useState([]);
    const [meeting, setMeeting] = useState([]);
    const handleMeetingTime = async ()=>{
        if (!user) return;
        const id = user.id;
        try{
            const response = await fetch(`/api/getMeetings/${id}`,{
                method:"GET",
                headers:{"Content-Type":'application/json'},
            })

            const data = await response.json();
            if (!response.ok){
                return;
                console.error(data.message);
            }
            console.log(data);
            setMeeting(data);
        }
        catch(error){
            console.error(error.message);
        }
    }
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
            getNotes();
            handleMeetingTime();
            const interval = setInterval(() => {retriveFriends(); }, 60000); 
            return () => clearInterval(interval); 
        }
    }, [user]);


    const getNotes = async () =>{
        if (!user) return;
        const id = user.id;
        try{
            const response = await fetch(`/api/getNotes/${id}`,{
                method:"GET",
                headers:{"Content-Type":"application/json"},
            });

            const data = await response.json();
            if(!response.ok){
                setNotes([]);
                return;
            }
            setNotes(data);
            return;
        }
        catch(error){
            setNotes([]);
            console.error("error getting notes");
        }
    }

    const retriveFriends = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
            const response = await fetch(`/api/retriveFriends/${id}/${5}`, {method: "GET",headers: { "Content-Type": "application/json" },});
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
                <p className = "CPMtitle">Recent Notes</p>
                <div className = "CPMContainer">
                    <div className="NotesContainer">
                            {notes.map((note, index) => (
                                <a key={index} className="clickable" href={note} target="_blank" rel="noopener noreferrer">
                                    <iframe
                                        src={note}
                                        className="pdf"
                                    />
                                </a>
                            ))}
                        </div>
                </div>
            </div>

            {windowWidth > 1300 && <div className = "HPRight">
                <p className = "HPR">Next Call</p>
                {meeting.map((meet)=>(
                    <div key = {meet.code} className= "HPRContainer">{meet.key}</div>
                ))}
            </div>}


        </div>
    );
}
