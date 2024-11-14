"use client";
import React from "react";
import "./HomePage.css";
import { useAuth } from "../Content/AuthContext";

export default function HomePage() {
    const {user} = useAuth();

    const classrooms = [
        "Classroom 1", "Classroom 2", "Classroom 3", "Classroom 4", "Classroom 5",
        "Classroom 6", "Classroom 7", "Classroom 8", "Classroom 9", "Classroom 10",
     
    ];

    const handleAddClassroom = () => {
        alert("Add Classroom button clicked"); 
    };

    return (
        <div className="HomePageContainer">
            <div className="welcome">{user ? user.firstName : " Please Login"}</div>
            {user && <button className="AddClassroomButton" onClick={handleAddClassroom}>
                Add Classroom
            </button> }
            {user && <div className="ClassRoomComponentHolder">
                {classrooms.map((classroom, index) => (
                    <div key={index} className="ClassroomBox">
                        {classroom}
                    </div> 
                ))} 
            </div> }
        </div>
    );
}

