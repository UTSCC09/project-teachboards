"use client" 

import './Call.css'
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react"
import Videos from "../Videos/Videos";
export default function Call({channelName, appId, token, uid, endCall}) {

    const client = useRTCClient(AgoraRTC.createClient({mode: "live", codec: "vp8", role: "host"}));

    const [ localUsername, setLocalUsername ] = useState("");


    const [ viewState, setViewState ] = useState(0);
    // 0 - default view
    // 1 - viewing participants
    // 2 - whiteboard

    const localBoardRef = useRef();
    const [boardUploadState, setBoardUploadState] = useState(0);

    const saveToFirestore = () => {
        setBoardUploadState(1);
        const saveData = localBoardRef.current.getSaveData();
        const classroomID = "76cdCVK4beEE8Ik74613"
        fetch(`/api/classroom/${classroomID}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: '4Z3FohSY67OTCpoe25pge6YTsqD3',
                noteContent: saveData
            })
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            alert("UPLOADED!!!");
        })
        .catch((e) => {
            alert("bad classroom upload")
            console.error(error);
        })
        setBoardUploadState(2);
    }

    function handleLeaveCall() {
        saveToFirestore();
    }
    useEffect( ()=> {
        if (boardUploadState===2) {
            endCall();
        }
    })

    return (
        <AgoraRTCProvider className="call-wrapper" client={client}>
            <div className={"flex"}>
                <p>{token}</p>
                <p>{uid}</p>
                { token && uid ? 
                (
                <Videos 
                    className={"call-videos"}
                    channelName={channelName}
                    appId={appId}
                    token={token}
                    uid={uid}
                    username={localUsername}
                    localBoardRef={localBoardRef}/>
                ) : (<p>Joining...</p>)
                }
                <button onClick={handleLeaveCall}>LEAVE CALL</button>
                <Sidebar></Sidebar>
            </div>
        </AgoraRTCProvider>
    );
}

function Sidebar() {

    const remoteUsers = useRemoteUsers();

    return (
        <ul>
        {remoteUsers.map(user => (
            <li key={user.uid}>{user.uid}</li>
        ))}
        </ul>
    )
}