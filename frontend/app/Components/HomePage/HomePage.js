"use client";
import React from "react";
import "./HomePage.css";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
    const {user, loading} = useAuth();

    const classrooms = [
        "Classroom 1", "Classroom 2", "Classroom 3", "Classroom 4", "Classroom 5",
        "Classroom 6", "Classroom 7", "Classroom 8", "Classroom 9", "Classroom 10",
     
    ];

    const handleAddClassroom = () => {
        alert("Add Classroom button clicked"); 
    };

    return (
        <div className="HomePageContainer">
            <div className="welcome">Welcome {user ? user.firstName : "Loading..."}</div>
            <button className="AddClassroomButton" onClick={handleAddClassroom}>
                Add Classroom
            </button>
            <div className="ClassRoomComponentHolder">
                {classrooms.map((classroom, index) => (
                    <div key={index} className="ClassroomBox">
                        {classroom}
                    </div>
                ))}
            </div>
        </div>
    );
}
