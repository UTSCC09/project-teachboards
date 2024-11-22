"use client";
import "./Allmessage.css";
import React, { useState, useEffect,useRef } from "react";
import { useAuth } from "../Content/AuthContext.js";



export default function Allmessage() {
    const { user } = useAuth();
    const [chatrooms, setChatrooms] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sendMessage, setsendMessage] = useState("");
    const [createOpen, setCreateOpen] = useState(false); 
    const [chatName, setChatName] = useState(""); 
    const [usernames, setUsernames] = useState(""); 
    const shouldContinueRef = useRef(false);

    const handleEnter = async (e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            if (!currentChat) return;
            if (!sendMessage.trim() || !user) return;
            const chatID = currentChat.chatID;
            const pack = {chatID:chatID, messageText:sendMessage,
                messageSender:user.firstName,dateSent: new Date().toISOString(),};

            try{
                const response = await fetch(`/api/sendMessage`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(pack),
                })

                const data = await response.json();

                if(!response.ok){
                    console.error("failed to send message");
                    return;
                }
                setsendMessage("");
            }
            catch(error){
                console.log(error);
            }
        }
    };
    //this box here is all for longpulling the messages 
    const getMessages = async () => {
        if (!currentChat || !shouldContinueRef.current) {
            return;
        }
        try {
            const response = await fetch(`/api/chatlongpull/${currentChat.chatID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error("Could not get messages:", data.message);
                setMessages([]);
                return;
            }
            console.log("Retrieved message"); 
            setMessages(Array.isArray(data.messagereturn) ? data.messagereturn : []);
            if (shouldContinueRef.current) {
                setTimeout(getMessages, 500); 
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            if (shouldContinueRef.current) {
                setTimeout(getMessages, 3000); 
            }
        }
    };
    
    useEffect(() => {
        if (currentChat) {
            shouldContinueRef.current = true;
            getMessages();
        }
        else{
            shouldContinueRef.current = false;
            setMessages([]);
        }   

        return () => {
            shouldContinueRef.current = false;
        };
    }, [currentChat]);
    
    //

    //this area is handling the getting the chatrooms in general
    useEffect(()=>{
        if(user){
        handleGetChatrooms();
        }
    },[user])

    const handleGetChatrooms = async () => {
        if (!user || !user.id) return;
        const id = user.id;
        try {
        const response = await fetch(`/api/getChatRooms/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Could not get message", error);
            setChatrooms([]);
            return;
        }
        setChatrooms(data.output || []);
        console.log("Chatrooms data:", chatrooms);
        console.log("Retrieved chatrooms");
        } catch (error) {
        console.error("Could not retrieve chatrooms", error);
        }
    };
    //

 //this portion here is handling the new chat thing
  const handleNewChat = () => {
    setCreateOpen(true);
  };

  const handleCreateChat = async (e) => {
    if (!user || !user.id) return;
    e.preventDefault();
    const id = user.id;
    const pack = {chatName:chatName, usernames:usernames};
    try{
        const response = await fetch(`/api/createChat/${id}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(pack),
        })

        const data = await response.json();
        if (!response.ok){
            console.error("Could not create chat", error);
            return;
        }
        console.log("Create new chatroom");
        setChatName("");
        setUsernames("");
        setChatrooms([data,...chatrooms]);
        setCreateOpen(false);
        e.target.reset();
    }
    catch(error){
        console.error("Could not create chat", error);
    }
  };
  const switchChats = (chat) => {
    setCurrentChat(null);
    setTimeout(() => {
        setCurrentChat(chat); 
    }, 500);
};
//
  return (
    <div className="AM-container">

      <div className="AM-left-panel">
        <button className="AM-create-chat-btn" onClick={handleNewChat}>
          Create New Chat
        </button>
        <div className="AM-chat-list">
            {Array.isArray(chatrooms) ? (
                chatrooms.map((chat) => (
                    <div
                    key={chat.chatID}
                    className={`AM-chat-item ${
                        currentChat?.chatID === chat.chatID ? "AM-active" : ""
                    }`}
                    onClick={() => {
                        switchChats(chat);
                        shouldContinueRef.current = true;
                    }}
                    
                >
                    {chat.chatName}
                </div>                
                ))
            ) : (
        <div>No chatrooms available.</div>
            )}
</div>

      </div>

      <div className="AM-right-panel">
        {currentChat ? (
          <>
            <div className="AM-chat-header">{currentChat.chatName}</div>
            <div className="AM-chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`AM-message AM-NONE`}>
                  {msg.messageSender + ": " + msg.messageText}
                </div>
              ))}
            </div>
            <div className="AM-chat-input">
                <textarea 
                    className="AM-textarea"
                    placeholder="Type your message and press Enter to send..."
                    value={sendMessage} 
                    onChange={(e) => {
                        setsendMessage(e.target.value);
                    }} 
                    onKeyDown={handleEnter} 
                ></textarea>
            </div>
          </>
        ) : (
          <div className="AM-chat-messages">Select a chat to start messaging!</div>
        )}
      </div>

      {createOpen && (
        <div className="AM-create">
          <div className="AM-create-content">
            <form onSubmit={handleCreateChat}>
                <input
                  type="text"
                  placeholder="Chat Name:"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  required
                />
              <label>
                <input
                  type="text"
                  placeholder="Usernames (space-separated):"
                  value={usernames}
                  onChange={(e) => setUsernames(e.target.value)}
                  required
                />
              </label>
              <div className="AM-create-buttons">
                <button type="button" className="AMCancel" onClick={() => setCreateOpen(false)}>
                    Cancel
                </button>
                <button type="submit" className="AMCreate">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
