'use client';

import React, { useState, useEffect } from "react";
import "./RTCContainer.css";
import VideoStream from "../VideoStream/VideoStream.js";
import Drawing from "../Drawing/Drawing.mjs";

export default function RTCContainer({ servers }) {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        const pc = new RTCPeerConnection(servers);

        // local stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream); // Update the state to trigger re-render
                localStream.getTracks().forEach((track) => {
                    pc.addTrack(track, localStream);
                })
            })
            .catch(error => console.error('Error accessing media devices.', error));

        //remote stream
        setRemoteStream(new MediaStream());
        // adds tracks to the remote stream
        pc.ontrack = event => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            })
        }

        return () => {
            // Cleanup: Close connection and stop all tracks when component unmounts
            pc.close();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [servers]);

    return (
        <div id="videos">
            <VideoStream stream={localStream} />
            <VideoStream stream={remoteStream} />
        </div>
    );
}
