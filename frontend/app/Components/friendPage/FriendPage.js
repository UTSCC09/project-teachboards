"use client";
import { useState, useEffect } from "react";
import "./friendPage.css";
import { useAuth } from "../Content/AuthContext";

export default function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState(true);
    const { user } = useAuth();

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
            const response = await fetch(`/api/retriveFriends/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                console.log("Could not retrieve friends");
                return;
            }
            console.log("Friends retrieved");
            setFriends(data.friendsWithStatus || []);
        } catch (error) {
            console.error("Error retrieving friends:", error);
        }
    };

    const retrivePending = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
            const response = await fetch(`/api/retrivePending/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                console.log("Could not retrieve pending friend requests");
                return;
            }
            console.log("Pending friends retrieved");
            setPendingFriends(data.friendsUsername || []);
        } catch (error) {
            console.error("Error retrieving pending friends:", error);
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
                console.log("Could not add friend");
                return;
            }
            console.log("Friend added:", data);
            setUsername("");
            setShowPopup(false);
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    const handleSwitch = () =>{
        if (mode){
            retrivePending();
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
                body:JSON.stringify(username),
            });
            await response.json();
            if (!response.ok){
                console.log("could not accepted friend");
                return;
            }
            console.log("accepted friend");
            retrivePending();
            retriveFriends();
        }  
        catch(error){
            console.error("Error accept friend:", error);
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
                        Pending Requests
                    </button>
                    <button className="header-btn">Messages</button>
                </header>

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
    </>
    );
}
