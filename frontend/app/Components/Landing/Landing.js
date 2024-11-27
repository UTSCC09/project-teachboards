"use client";

import "./Landing.css";
import {useAuth} from "../Content/AuthContext.js";
import {gsap} from "gsap";
import {React, useEffect} from "react";
import Link from "next/link";

export default function Landing(){
    const {user} = useAuth();
    useEffect(() => {
        const timeline = gsap.timeline({repeat: -1, repeatDelay: 0.5, });
        timeline.from(".ETeachboards span",{y:0, opacity:0, rotateY:0});
        timeline.to(".ETeachboards span",{y: -15, opacity: 1, rotateY: 360, stagger: 0.2, duration: 1, ease: "sine.inOut"});
        timeline.to(".ETeachboards span",{y: 0, opacity: 0.1,rotateY:0, stagger:0.2, duration:1, ease:"sine.inOut"});
        timeline.to(".ETeachboards span",{y:0, opacity:0, rotateY:0});
    }, []);
    return(
        <div className="Entire">
            <p className="ETeachboards">
                <span>T</span><span>e</span><span>a</span><span>c</span><span>h</span><span>b</span><span>o</span><span>a</span><span>r</span><span>d</span><span>s</span>
            </p>
            {!user && <div className="ENotLogin">
                <Link href="/login"><p className="ELoginButton">Login</p></Link>
            </div>}
            {user && <div className = "ELoggedIn">
                <Link href="/home"><p className="ELoginButton">Dive In</p></Link>
            </div>}
        </div>
    )
};