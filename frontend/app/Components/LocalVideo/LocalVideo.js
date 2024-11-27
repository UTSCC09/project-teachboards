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

export default function LocalVideo( { videoRef, audio, onClick, focused, name }) {
    const volume = useVolumeLevel(audio);

    const borderColor = volume > 0.3 ? "lime" : "grey";

    return (
        <div className="single-video-wrapper" onClick={onClick}>
            <video className={focused ? "video-stream video-focused" : "video-stream video-v"} style={{
            borderColor: borderColor, // Dynamic border color
            }} 
            ref={videoRef} autoPlay playsInline onContextMenu={(e)=> e.preventDefault()} muted></video>
            <p>{name} {volume}</p>

        </div>
    );
}