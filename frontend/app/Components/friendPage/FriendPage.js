"use client";
import { useState, useEffect } from "react";
import "./friendPage.css";
import { useAuth } from "../Content/AuthContext";
import Link from "next/link";

export default function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState(true);
    const [penorfre, setpenorfre] = useState("Friends");
    const [penorfre2,setpenorfre2] = useState("Pending Friends");
    const { user } = useAuth();
    const [num, setNum] = useState(10);

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



    useEffect(() => {
        if (user && user.id) {
            retriveFriends(); 
            const interval = setInterval(() => {retriveFriends(); }, 60000); 
            return () => clearInterval(interval); 
        }
    }, [user]);
    
    useEffect(()=>{
        if (user && user.id){
            retrivePending();
        }
    },[mode, user])

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const retriveFriends = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
            const response = await fetch(`/api/retriveFriends/${id}/${num}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                handleerror(data.message);
                return;
            }
            console.log("Friends retrieved");
            setFriends(data.friendsWithStatus || []);
        } catch (error) {
            console.error("Error retrieving friends:", error);
            handleerror(error.message);
        }
    };

    const retrivePending = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
            const response = await fetch(`/api/retrivePending/${id}/${num}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                handleerror(data.message);
                return;
            }
            console.log("Pending friends retrieved");
            setPendingFriends(data.friendsUsername || []);
        } catch (error) {
            console.error("Error retrieving pending friends:", error);
            handleerror(error.message);
        }
    };
    
    const handleAddFriend = async () => {
        if (!user || username.trim() === "") return;
        const newfriend = username.trim();
        const id = user.id;
        try {
            const response = await fetch("/api/addFriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, newfriend }),
            });
            const data = await response.json();
            if (!response.ok) {
                handleerror(data.message);
                return;
            }
            console.log("Friend added:", data);
            setUsername("");
            setShowPopup(false);
        } catch (error) {
            console.error("Error adding friend:", error)
            handleerror(error.message);
        }
    };

    const handleSwitch = () =>{
        if (mode){
            retrivePending();
            setpenorfre("Pending Friends");
            setpenorfre2("Friends");
        }
        if (!mode){
            setpenorfre("Friends");
            setpenorfre2("Pending Friends");
            retriveFriends();
        }
        setMode(!mode);
    };
    
    const handleAcceptFriend = async (username) =>{
        if (!user || !user.id) return;
        const id = user.id;
        try{
            const response = await fetch(`/api/acceptFriend/${id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({username:username}),
            });
            const data = await response.json();
            if (!response.ok){
                handleerror(data.message);
                return;
            }
            console.log("accepted friend");
            retrivePending();
            retriveFriends();
        }  
        catch(error){
            console.error("Error accept friend:", error);
            handleerror(error.message);
        }
    };
    return (
        <>
            <div className="friend-page">
                <header className="header-buttons">
                    <button className="header-btn" onClick={togglePopup}>
                        Add Friend
                    </button>
                    <button className="header-btn" onClick={handleSwitch}>
                        {penorfre2}
                    </button>
                    <Link href="/profile" className = "header-btn">My Profile</Link>
                </header>
                <h2 className="BRO">{penorfre}</h2>
                {mode && (
                    
                    <div className="friends-list">
                        {friends.map((friend, index) => (
                            <div key={friend.id || index} className="friend-card">
                                <span>{friend.username}</span>
                                <span className={`status ${friend.status.toLowerCase()}`}>{friend.status}</span>
                            </div>
                        ))}
                    </div>
                )}

                {!mode && (
                    <div className="friends-list">
                        {pendingFriends.map((username, index) => (
                            <div key={username || index} className="friend-card">
                                <span>{username}</span>
                                <span className={`status busy`}>{"Pending"}</span>
                                <button
                                    className="accept-btn"
                                    onClick={() => handleAcceptFriend(username)}
                                >
                                    Accept
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add a Friend</h2>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="popup-actions">
                            <button className="Cancel" onClick={togglePopup}>
                                Cancel
                            </button>
                            <button className="Add" onClick={handleAddFriend}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
                {haserror && <div className = "errormessagepopup">{errormessage}</div>}
    </>
    );
}
