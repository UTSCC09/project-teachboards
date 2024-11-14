"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../Content/AuthContext"; 
import "./Header.css";

export default function Header() {
    const { user, logout } = useAuth();
    const [width, setWidth] = useState(1500);
    const [menuDropDown, setMenuDropDown] = useState(false);
    const modelRef = useRef();

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
                            {menuDropDown && (
                                <div className="DropDown" ref={modelRef}>
                                    <ul className="DropDown-List">
                                        <li className="DD-Option">
                                            <Link href="/home">Home</Link>
                                        </li>
                                        <li className="DD-Option">
                                            <Link href="/classroom">Classroom</Link>
                                        </li>
                                        <li className="DD-Option">
                                            {user ? (
                                                <button onClick={logout}>Logout</button>
                                            ) : (
                                                <Link href="/login">Login</Link>
                                            )}
                                        </li>
                                        {user && <li className="DD-Option">
                                            <Link href="/draw"><p>draw</p></Link>
                                        </li>}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link className="Nav-Options" href="/"><p>Home</p></Link>
                            </li>
                            {user && <li>
                                <Link className="Nav-Options" href="/classroom"><p>Classroom</p></Link>
                            </li>}
                            {user && <li>
                                <Link className="Nav-Options" href="/profile"><p>Profile</p></Link>
                            </li>}
                            <li>
                                {user ? (
                                    <button className="Nav-Options" onClick={logout}><p>Logout</p></button>
                                ) : (
                                    <Link className="Nav-Options" href="/login"><p>Login</p></Link>
                                )}
                            </li>
                            {user && <li>
                                <Link className="Nav-Options" href="/draw"><p>draw</p></Link>
                            </li>}
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
