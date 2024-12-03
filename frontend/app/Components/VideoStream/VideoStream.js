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

export default function VideoStream( { videoRef, audio, name }) {
    
    const volume = useVolumeLevel(audio);

    const borderColor = volume > 0.3 ? "lime" : "grey";

    return (
        <video className="video-stream" style={{
            borderColor: borderColor, 
        }} 
        ref={videoRef} autoPlay playsInline onContextMenu={(e)=> e.preventDefault()} muted>
        </video>
    );
}