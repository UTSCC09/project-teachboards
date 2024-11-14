'use client'

import { useEffect } from "react";
import RTCContainer from "../Components/RTCContainer/RTCContainer";

export default function RoomPage() {

    // useEffect( () => {
    //     fetch('/api/room', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ roomName: 'New Room' }),
    //       });          
    // },[]);


    return (
        <div className="RoomPageContainer">
            <div className="HostElements">
                <RTCContainer>
                </RTCContainer>
            </div>
        </div>
    );
}