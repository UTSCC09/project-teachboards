'use client'

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
    useRemoteVideoTracks,
    useRemoteUsers,
    useVolumeLevel,
    useIsConnected,
    LocalUser
  } from "agora-rtc-react";
import React, { useRef, useEffect, useState } from "react";
import Drawing from "../Drawing/Drawing"

export default function LocalVideo( { videoRef, audio, onClick, focused, name }) {
    const volume = useVolumeLevel(audio);

    const borderColor = volume > 0.3 ? "lime" : "grey";

    return (
        <div className={focused ? "single-video-wrapper video-focused" : "single-video-wrapper video-v"} onClick={onClick}>
            <video className="video-stream" style={{
            borderColor: borderColor, // Dynamic border color
            }} 
            ref={videoRef} autoPlay playsInline onContextMenu={(e)=> e.preventDefault()} muted></video>
            <p>{name} {volume}</p>
            <Drawing canvasWidth={400} noControls/>
        </div>
    );
}