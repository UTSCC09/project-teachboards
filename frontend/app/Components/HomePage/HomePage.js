"use client";
import React, { useState } from "react";
import "./HomePage.css";
import { useAuth } from "../Content/AuthContext";

export default function HomePage() {
    const { user } = useAuth();
    const [className, setClassName] = useState("");
    const [classrooms, setClassrooms] = useState([
        "Classroom 1", "Classroom 2", "Classroom 3", "Classroom 4", "Classroom 5",
        "Classroom 6", "Classroom 7", "Classroom 8", "Classroom 9", "Classroom 10",
    ]);
    const handleAddClassroom = async (e) => {
        e.preventDefault();
        const id = user.id;
        const pack = { id, className };

        try {
            const response = await fetch("/api/classroom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pack),
            });
            const data = await response.json();
            if (!response.ok) {
                console.log("Could not create classroom");
                return;
            }
            console.log("Classroom created:", data.classRoomId);
            setClassrooms([...classrooms, className]);
            setClassName(""); 
            e.target.reset();
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    };
    return (
        <div className="HomePageContainer">
            <div className="welcome">{user ? `Welcome, ${user.firstName}` : "Please Login"}</div>
            
            {user && (
                <form onSubmit={handleAddClassroom} className="AddClassroomForm">
                    <input
                        type="text"
                        placeholder="Classroom Name"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                    <button type="submit" className="AddClassroomButton">Add Classroom</button>
                </form>
            )}
            
            {user && (
                <div className="ClassRoomComponentHolder">
                    {classrooms.map((classroom, index) => (
                        <div key={index} className="ClassroomBox">
                            {classroom}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
