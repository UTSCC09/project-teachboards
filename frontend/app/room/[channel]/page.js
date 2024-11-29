'use client'

import { useEffect, useState } from 'react';
import Call from '../../Components/Call/Call';
import "./style.css"

let options = {
    // Pass your app ID here.
    appId: "5b04cf1dad0645189bd6533cef7c2158",
    // Set the channel name.
    // channel: "main",
    // Use a temp token
    // token: "007eJxTYJhuv/SsysN3X+ZNl/jfxLPoY9Q/R3PZ2e/Mkuw/XVT3LQ9SYDBNMjBJTjNMSUwxMDMxNbSwTEoxMzU2Tk5NM082MjS1+F7mkd4QyMjwt1KbgREKQXwWhtzEzDwGBgDVtiD2"
};



export default function GuestPage( {params} ) {

    const [token, setToken] = useState(null);
    const [ uid, setUID ] = useState(null);
    const [ ready, setReady ] = useState(false);
    const [ noRoom, setNoRoom ] = useState(false);
    const [ callStatus, setCallStatus] = useState(0);
    
    const { channel } = params;

    // gets the token
    function joinCall() {
        if (token || uid) return;
        // should fetch a token plus uid for you to use
        fetch(`/api/room/${channel}`)
        .then((res) => res.json()) // Await the response JSON here
        .then((data) => {
            // if there's not token, then the room doesn't exist.
            if(!data.token)
                setNoRoom(true);
            setToken(data.token);
            setUID(data.uid);
            setCallStatus(1);
        })
        .catch((err) => console.error('Error verifying session:', err)); // Handle any errors
    }

    function makeRoom() {
        fetch(`/api/room`, {
            method: 'GET'
        })
        .then((res) => res.json())
        .then((data) => {
            alert("room created:"+data.roomID)
        })
    }

    return (
        <div>
            <div className='roomControls'>
                    <p>
                    Room: {channel}
                    {/* THIS IS ALSO THE CHANNEL NAME */}
                </p>
                <button className={"callButton"} onClick={joinCall}>JOIN CALL</button>
                <button onClick={makeRoom}>MAKE ROOM</button>
            </div>
            
            { noRoom ? <p>That room does not exist, or you can't access it.</p> 
            : callStatus===1 ?
            // we set the call status to 0 for ending call to unmount video component and agora context etc
                (<Call appId={options.appId} channelName={channel} token={token} uid={uid} endCall={() => {setCallStatus(0)}}></Call>) 
            : callStatus===0 ? <p>not in call</p> : <p>no call status?</p>
            }
        </div>
    );
}


