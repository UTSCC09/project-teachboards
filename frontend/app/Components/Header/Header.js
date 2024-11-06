import React from "react";
import "./Header.css";

export default function Header(){
    return(
        <div className="Nav-Bar">
            <div className = "Nav-Bar-Container">
                <ul className = "Nav-List">
                    <li className = "Nav-Title">TeachBoards</li>
                    <li className = "Nav-Options"><p>Home</p></li>
                    <li className = "Nav-Options"><p>Courses</p></li>
                    <li className = "Nav-Options"><p>Profile</p></li>
                </ul>
            </div>
        </div>
    );
};