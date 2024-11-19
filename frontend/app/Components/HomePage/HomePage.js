"use client";
import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Link from "next/link";
import { useAuth } from "../Content/AuthContext";

// all i need now is the a way to get to the clasroom rn 

export default function HomePage() {
    const { user } = useAuth();
    const [className, setClassName] = useState("");
    const [classrooms, setClassrooms] = useState([]);
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
            setClassrooms([data,...classrooms]);
            setClassName(""); 
            e.target.reset();
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    };

    const handleGetClassroom = async (e) =>{
        const id = user.id;
        if (id != null){
            try{    
                const response = await fetch(`/api/classroom/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });                
                const data = await response.json();
                if (!response.ok){
                    console.log("could not get clasrooms");
                    setClassrooms([])
                    return;
                }
                setClassrooms(data);
            }
            catch(error){
                console.error("error gettinv classroom", error);
            }
        }
    };

    useEffect(() => {
        if (user) {
            handleGetClassroom();
        }
    }, [user]); 

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
                {classrooms.map((classroom) => (
                    <Link key={classroom.classRoomID} href={{pathname: `/classroom/${classroom.classRoomID}`, 
                        query:{name: classroom.className}}}>
                    <div key={classroom.classRoomID} id={classroom.classRoomID} className="ClassroomBox">
                        {classroom.className}
                    </div>
                    </Link>
                ))}
                </div>
            )}
        </div>
    );
}
