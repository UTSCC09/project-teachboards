"use client";
import React, { useState, useEffect } from "react";
import "./Real.css";
import Link from "next/link";
import { useAuth } from "../Content/AuthContext.js";

export default function ClassRoomMainPage() {
    const { user,checkAuthStatus} = useAuth();
    const [className, setClassName] = useState("");
    const [classrooms, setClassrooms] = useState([]);
    const [windowWidth, setWindowWidth] = useState();
    const [code, setCode] = useState("");
    const [popout2, setPopout2] = useState(false);
    const [classenrolled, setClassEnrolled] = useState([]);
    const [enrolled, setEnrolled] = useState(false);
    const [teaching, setTeaching] = useState(false);
    const [popout, setPopout] = useState(false);

    const [currentClass, setCurrentClass] = useState("");

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
            setPopout(false);
            setClassrooms([data,...classrooms]);
            setClassName(""); 
            e.target.reset();
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    };

    const joinClassRoom = async(e) =>{
        e.preventDefault();
        if (!user) return;
        const id = user.id
        try {
            const response = await fetch(`/api/classroom/join/${id}`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({code}),
            });
            const data = await response.json();
            if (!response.ok){
                console.log(data.message);
                setCode("");
                return;
            }
            setClassEnrolled([data, ...classenrolled]);
            setPopout2(false);
            setCode("");
            e.target.reset();
        }
        catch(error){
            setCode("");
            console.error("error adding classroom",error);
        }
    }

    const handleGetClassroom = async () =>{
        if (!user) return;
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
                    setClassrooms([]);
                    return;
                }
                setClassrooms(data);
            }
            catch(error){
                console.error("error gettinv classroom", error);
            }
        }
    };

    const handleGetEnrolled = async() =>{
        const id = user.id;
        if (id != null){
            try{    
                const response = await fetch(`/api/classroom/enrolled/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });                
                const data = await response.json();
                if (!response.ok){
                    console.log("could not get enrolled clasrooms");
                    setClassEnrolled([]);
                    return;
                }
                setClassEnrolled(data);
            }
            catch(error){
                console.error("error getting enrolled classroom", error);
            }
        }
    }
    useEffect(() => {
        if (user) {
            handleGetClassroom();
            handleGetEnrolled();
        }
    }, [user,checkAuthStatus]); 

    const handlePopout = (e) =>{
        e.preventDefault();
        setPopout((prev) => !prev);
    };
    const handlePopout2 = (e) =>{
        e.preventDefault();
        setPopout2((prev) =>!prev);
    }

    const handleEnrolled = (e) =>{
        e.preventDefault();
        setEnrolled((prev) => !prev);
    };

    const handleTeaching = (e) =>{
        e.preventDefault();
        setTeaching((prev) => !prev);
    };

    return (
        <div className = "ClassRoomHomePage">

        {windowWidth > 400 && <div className = "CPLeft">
            <p className = "CPLTitle">Classrooms</p>
            <button className="CPLContainer3" onClick={handlePopout}>Add Classroom</button>
            <button className="CPLContainer2" onClick={handlePopout2}>Enroll</button>
            <button className={`CPLContainer1${teaching ? 'active' : ''}`}  onClick={handleTeaching}>Teaching</button>
                {teaching && <>
                {classrooms.map((classroom) => (
                    <div key={classroom.classRoomID} className="CPLContainer">
                        <p className="CPLHelperer">{classroom.className}</p>
                    </div>
                ))}
                </>}
            <button className = {`CPLContainer1${enrolled ? 'active' : ''}`} onClick={handleEnrolled}>Enrolled</button>
                {enrolled && <>
                    {classenrolled.map((classroom) => (
                    <div key={classroom.classRoomID} className="CPLContainer">
                        <p className="CPLHelperer">{classroom.className}</p>
                    </div>
                    ))}
                </>}
        </div> }

        <div className = "CPMiddle">
            <p className = "CPMtitle">Classroom Name</p>
            <div className = "CPMContainer">

            </div>
        </div>

        {windowWidth > 1300 && <div className = "CPRight">
            <p className = "CPRTitle">Next Call</p>
            <div className = "CPRContainer"></div>
            <div className = "CPRContainer"></div>
            <div className = "CPRContainer"></div>
            <div className = "CPRContainer"></div>
        </div>}

        {popout &&  
            <div className="SCREENBANG">
                <form onSubmit={handleAddClassroom} className="AddClassroomForm">
                <h2>Add Classroom</h2>
                <input
                    type="text"
                    placeholder="Classroom Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
                <div classname = "CCButton">
                    <button className="AddClassroom1" onClick={handlePopout}>Cancel</button>
                    <button type="submit" className="AddClassroomButton2">Add</button>
                </div>
                </form>
            </div>
        }

        {popout2 && 
            <div className="SCREENBANG">
            <form onSubmit={joinClassRoom} className="AddClassroomForm">
            <h2>Classroom Code</h2>
            <input
                type="text"
                placeholder="Classroom Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />
            <div classname = "CCButton">
                <button className="AddClassroom1" onClick={handlePopout2}>Cancel</button>
                <button type="submit" className="AddClassroomButton2">Add</button>
            </div>
            </form>
            </div>
        }

    </div>
    );
}




/*<div className="HomePageContainer">
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
        </div> */