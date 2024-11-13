"use client"
import React, {useState, useEffect} from "react";
import "./Header.css";

export default function Header(){
    const [width, setWidth] = useState(0);
    const [menuDropDown, setmenuDropDown] = useState(false);
    const [buttonChoice, setButtonChoice] = useState("Login");
    const modelRef = React.useRef();

    useEffect(()=>{
        const handleResize = () => setWidth(window.innerWidth);
        const handlePressed = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)){
                setmenuDropDown(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handlePressed);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handlePressed);
        }
    },[]);

    const changeMenu = () =>{setmenuDropDown(true);};

    return(
        <div className="Nav-Bar">
            <div className = "Nav-Bar-Container">
                <ul className = "Nav-List">
                    <li className = "Nav-Title">TeachBoards</li>
                    {width <= 700 && <li className ="Nav-EXTRA"onClick={changeMenu}>
                        <div className="container">
                            <p>Menu</p>
                            {menuDropDown && <div className = "DropDown">
                                <ul className = "DropDown-List" ref={modelRef}>
                                    <li className = "DD-Option"><p>Home</p></li>
                                    <li className = "DD-Option"><p>Courses</p></li>
                                    <li className = "DD-Option"><p>Profile</p></li>
                                    {buttonChoice === "Login" && <li className = "DD-Option"><p>Login</p></li>}
                                    {buttonChoice === "Logout" && <li className = "DD-Option"><p>LogOut</p></li>}
                                </ul>
                            </div>}
                        </div>
                    </li>}
                    {width > 700 && <li className = "Nav-Options"><p>Home</p></li>}
                    {width > 700 && <li className = "Nav-Options"><p>Courses</p></li>}
                    {width > 700 && <li className = "Nav-Options"><p>Profile</p></li>}
                    {width > 700 && buttonChoice === "Login" &&  <li className = "Nav-Options" ><p>Login</p></li>}
                    {width > 700 && buttonChoice === "Logout" && <li className = "Nav-Options" ><p>Login</p></li>}
                </ul>
            </div>
        </div>
    );
};