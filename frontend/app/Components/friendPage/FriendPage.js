"use client";
import { useState } from "react";
import "./friendPage.css";

export default function FriendPage() {
    const [friends, setFriends] = useState([
        { id: 1, name: "Alice Johnson", status: "Online" },
        { id: 2, name: "Bob Smith", status: "Busy" },
        { id: 3, name: "Charlie Davis", status: "Online" },
        { id: 4, name: "Diana Prince", status: "Online" },
        {id: 5, name:"Peter Yoo", status:"Offline"},
    ]); // Dummy data for friends

    const [showPopup, setShowPopup] = useState(false); 
    const [username, setUsername] = useState(""); 

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleAddFriend = () => {
        if (username.trim() === "") return;
        const newFriend = { id: Date.now(), name: username, status: "Pending" };
        setFriends([...friends, newFriend]);
        setUsername(""); 
        setShowPopup(false); 
    };

    return (
        <>
            <div className="friend-page">
                <header className="header-buttons">
                    <button className="header-btn" onClick={togglePopup}>
                        Add Friend
                    </button>
                    <button className="header-btn">Pending Requests</button>
                    <button className="header-btn">Messages</button>
                </header>

                <div className="friends-list">
                    {friends.map((friend) => (
                        <div key={friend.id} className="friend-card">
                            <span>{friend.name}</span>
                            <span className={`status ${friend.status.toLowerCase()}`}>{friend.status}</span>
                        </div>
                    ))}
                </div>
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
                            <button className="Cancel" onClick={togglePopup}>Cancel</button>
                            <button className="Add" onClick={handleAddFriend}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
