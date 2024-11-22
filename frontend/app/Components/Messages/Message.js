"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("Anonymous");

  useEffect(() => {
    // Connect to the separate WebSocket server
    socket = io("http://localhost:4000", {
      transports: ["websocket", "polling"], // Allow fallback
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("room-messages", (existingMessages) => {
      setMessages(existingMessages);
    });

    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", { sender: username, content: message });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <button onClick={sendMessage} style={{ width: "100%" }}>
        Send
      </button>
    </div>
  );
}
