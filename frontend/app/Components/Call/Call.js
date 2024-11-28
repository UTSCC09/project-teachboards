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
import { useState, useEffect } from "react"
import Videos from "../Videos/Videos";
export default function Call({channelName, appId}) {

    const client = useRTCClient(AgoraRTC.createClient({mode: "live", codec: "vp8", role: "host"}));
    const token = "007eJxTYDCMe/yNa7sc+007eJxTYOgzfrQv8pWsTe+GGs6bp09cqP3Bdk0z4En8waJZJ8yOXFqqwGCaZGCSnGaYkphiYGZiamhhmZRiZmpsnJyaZp5sZGhq0R3tkS7Ax8AgOvcuMyMDIwMLAyMDiM8EJpnBJAuUzE3MzONiMLKwMDI2MTQyNwYAZScilQ==";

    const [ localUsername, setLocalUsername ] = useState("");
    const [ localUID, setLocalUID ] = useState("");

    useEffect(() => {
        fetch('/api/auth/verifySession')
            .then((res) => res.json()) // Await the response JSON here
            .then((data) => {
                console.log(data);
                setLocalUsername(data.firstName); 
                setLocalUID(data.id);
            })
            .catch((err) => console.error('Error verifying session:', err)); // Handle any errors
    }, []);

    return (
        <AgoraRTCProvider className="call-wrapper"client={client}>
            <div className="flex">
                { token  && localUID && localUsername? 
                (
                <Videos channelName={channelName} AppID={appId} token={token} uid={localUID} username={localUsername}/>
                ) : (<p>waiting for token...</p>)
                }
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