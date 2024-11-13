"use client"
import React from "react";

import Drawing from "../Drawing/Drawing.mjs";
import RTCContainer from "../RTCContainer/RTCContainer.js"
import Loginpage from "../Loginpage/Loginpage.js";
import HomePage from "../HomePage/HomePage.js";
const servers = {}
servers.iceServers = [
    {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302','stun:stun4.l.google.com:19302']
    },
];
servers.iceCandidatePoolSize = 10

export default function MainPage(){
    return(
        <div>
            {/*<Drawing/>*/}
            {/*<RTCContainer servers={servers}/>*/}
            {/*<Loginpage/>*/}
            <HomePage>

            </HomePage>
        </div>
    )
}