"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../Content/AuthContext.js"; 
import { useRouter } from "next/navigation";
import "./Header.css";

export default function Header() {
    const { user, logout } = useAuth();
    const [width, setWidth] = useState(1500);
    const [menuDropDown, setMenuDropDown] = useState(false);
    const router = useRouter();
    const modelRef = useRef();

    const handleLogout = () =>{
        logout();
        router.push("/landing");
    };
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = () => setMenuDropDown((prev) => !prev);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setMenuDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div className="Nav-Bar">
            <div className="Nav-Bar-Container">
                <ul className="Nav-List">
                    <li className="Nav-Title">TeachBoards</li>

                    {width <= 825 ? (
                        <li className="Nav-EXTRA" onClick={toggleMenu}>
                            MENU
                        </li>
                    ) : (
                        <>
                           {user &&  <li>
                            <Link className="Nav-Options" href="/home"><p>Home</p></Link>
                            </li>}
                            {user && <li>
                                <Link className="Nav-Options" href="/classroomHome"><p>Classrooms</p></Link>
                            </li>}
                            {user && <li>
                                <Link className="Nav-Options" href="/messages"><p>Messages</p></Link>
                            </li>}
                            {user && <li>
                                <Link className="Nav-Options" href="/friends"><p>Socials</p></Link>
                            </li>}
                            <li>
                                {user ? (
                                    <button className="Nav-Options" onClick={handleLogout}><p>LOGOUT</p></button>
                                ) : (
                                    <Link className="Nav-Options" href="/login"><p>Login</p></Link>
                                )}
                            </li>
                        </>
                    )}
                </ul>
            </div>
            {menuDropDown && (
                                <div className="DropDown" ref={modelRef}>
                                    <ul className="DropDown-List">
                                        {user && <li className="DD-Option">
                                            <Link href="/home">Home</Link>
                                        </li>}
                                        {user && <li className="DD-Option">
                                            <Link href="/classroomHome"><p>Classrooms</p></Link>
                                        </li>}
                                        {user && <li className="DD-Option">
                                            <Link href="/messages">Messages</Link>
                                        </li>}
                                        {user && <li className="DD-Option">
                                            <Link href="/friends">Socials</Link>
                                        </li>}
                                        {user && <li className="DD-Option">
                                            <Link href="/credits">Credits</Link>
                                        </li>}
                                        <li className="DD-Option">
                                            {user ? (
                                                <button onClick={handleLogout}>LOGOUT</button>
                                            ) : (
                                                <Link href="/login">Login</Link>
                                            )}
                                        </li>
                                    </ul>
                                </div>
            )}
        </div>
    );
}
