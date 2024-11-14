"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./Header.css";

export default function Header() {
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

                    {width <= 710 ? (
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
                                            <Link href="/login">Login</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    ) : (
                        <>
                            <li >
                                <Link className="Nav-Options" href="/"><p>Home</p></Link>
                            </li>
                            <li >
                                <Link className="Nav-Options" href="/classroom"><p>Classroom</p></Link>
                            </li>
                            <li>
                                <Link className="Nav-Options" href="/profile"><p>Profile</p></Link>
                            </li>
                            <li>
                                <Link className="Nav-Options" href="/login"><p>Login</p></Link>
                            </li>
                            <li>
                                <Link className="Nav-Options" href="/room"><p>Start Room Call</p></Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
