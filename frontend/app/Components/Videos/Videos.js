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
    useIsConnected,
    LocalUser
  } from "agora-rtc-react";
import React, { useRef, useEffect, useState } from "react";
import "./Videos.css"
import LocalVideo from "../LocalVideo/LocalVideo";

export default function Videos({AppID, channelName, token, uid, username}) {
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

    const remoteUsers = useRemoteUsers();
    const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers);
    const { audioTracks: remoteAudioTracks } = useRemoteAudioTracks(remoteUsers);

    const [ cameraOn, setCameraOn ] = useState(true);
    const [ micOn, setMicOn ] = useState(true);
    
    //debug 
    AgoraRTC.setLogLevel(1); 

    const [ focusedUser, setFocusedUser ] = useState(-1);

    //update the focused user
    useEffect( () => {
        
    }, [focusedUser]);

    function nextFocus() {
        setFocusedUser(focusedUser + 1);
    }

    // local video
    const localVideoRef = useRef();
    useEffect(() => {
        if (localCameraTrack && localVideoRef.current) {
            if (cameraOn) localCameraTrack.play(localVideoRef.current);
            else localCameraTrack.stop();
        }
    }, [localCameraTrack, cameraOn]);
    
    // remote videos
    const remoteVideoRefs = useRef([]);
    useEffect(() => {
        remoteUsers.forEach( (user, index) => {
            if (user && user.hasVideo && user.videoTrack && remoteVideoRefs.current[index] && index != focusedUser) {
                user.videoTrack.play(remoteVideoRefs.current[index]);
            }
        })
    }, [remoteUsers, remoteVideoTracks, focusedUser])


    remoteAudioTracks.forEach((track) => {
        track.play()
    })

    
    // connecting to agora
    const isConnected = useIsConnected();

    useJoin({
        appid: '5b04cf1dad0645189bd6533cef7c2158',
        channel: 'main',
        token: token,    
        uid: uid
    });
    usePublish([localMicrophoneTrack, localCameraTrack]);



    //controls
    function toggleCamera(e) {
        if (cameraOn) {
            // Stop publishing the video track and stop the camera
            localCameraTrack.setEnabled(false).then(() => {
                setCameraOn(false);
            });
        } else {
            // Start publishing the video track and enable the camera
            localCameraTrack.setEnabled(true).then(() => {
                setCameraOn(true);
            });
        }
    }
    function toggleMic(e) {
        if (micOn) {
            localMicrophoneTrack.setEnabled(false).then(() => {
                setMicOn(false);
            })
        } else {
            localMicrophoneTrack.setEnabled(true).then(() => {
                setMicOn(true);
            })
        }
    }
    function leaveCall(e) {
        setCalling(false);
    }

    return (
        <div className="videos-wrapper">
            {isConnected  ? (
                <div className="video-grid-wrapper">
                    <LocalVideo 
                    focused={focusedUser === 0}
                    videoRef={localVideoRef}
                    audio={localMicrophoneTrack} 
                    onClick={(e) => setFocusedUser(0)}
                    name={username}>

                    </LocalVideo>
                    {remoteUsers.map((user, i) => (
                        <LocalVideo 
                        key={i}
                        focused={focusedUser === i+1}
                        videoRef={el => remoteVideoRefs.current[i] = el} 
                        audio={user.audioTrack} 
                        onClick={(e) => setFocusedUser(i+1)}>

                        </LocalVideo>
                    ))}
                    <div>{focusedUser}</div>
                </div>
            ) : (
                <div>Not connected</div>
            )}
            <div className="video-controls">
                <button onClick={toggleCamera}>{cameraOn ? 'camera is ON' : 'camera is OFF'}</button>
                <button onClick={toggleMic}>{micOn ? 'mic is ON' : 'mic is OFF'}</button>
                <button onClick={leaveCall}>Leave call</button>
                <button onClick={nextFocus}>focus next user</button>
            </div> 
        </div>
    );
}