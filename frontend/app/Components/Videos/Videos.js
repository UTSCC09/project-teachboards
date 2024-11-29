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
import {useAuth} from "../Content/AuthContext.js";
import Drawing from "../Drawing/Drawing.mjs";


export default function Videos({classroomID, appId, channelName, token, uid, username, localBoardRef}) {

    const client = useRTCClient();
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const [testVar, toggleVar] = useState(false);

    useEffect(() => {
        console.log("Camera track loading:", isLoadingCam);
        console.log("Local camera track:", localCameraTrack);
    }, [isLoadingCam, localCameraTrack]);

    const {user} = useAuth();

    const remoteUsers = useRemoteUsers();
    const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers);
    const { audioTracks: remoteAudioTracks } = useRemoteAudioTracks(remoteUsers);

    const [ cameraOn, setCameraOn ] = useState(true);
    const [ micOn, setMicOn ] = useState(true);

    // NOTES UPLOAD STATE
    const [notesUploadState, setNotesUploadState] = useState(0);

    //debug 
    AgoraRTC.setLogLevel(1); 

    const [ focusedUser, setFocusedUser ] = useState("local");

    //update the focused user
    useEffect( () => {
        
    }, [focusedUser]);

    function nextFocus() {
        setFocusedUser(focusedUser + 1);
    }
 
    // local video
    const localVideoRef = useRef();
    useEffect(() => {
        if (!isLoadingCam && localCameraTrack && localVideoRef.current) {
            if (cameraOn) localCameraTrack.play(localVideoRef.current);
            else localCameraTrack.stop();
        }
    }, [localCameraTrack, cameraOn, isLoadingCam]);
    
    // remote videos
    const remoteVideoRefs = useRef([]);
    useEffect(() => {
        remoteUsers.forEach( (usr, index) => {
            if (usr && usr.hasVideo && usr.videoTrack && remoteVideoRefs.current[index] && index != focusedUser) {
                usr.videoTrack.play(remoteVideoRefs.current[index]);
            }
        })
    }, [remoteUsers, remoteVideoTracks, focusedUser])


    remoteAudioTracks.forEach((track) => {
        track.play()
    })

    // connecting to agora
    const isConnected = useIsConnected();

    useJoin({
        appid: "5b04cf1dad0645189bd6533cef7c2158",
        channel: channelName,
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
            {isConnected ? (
                <div className="video-grid-wrapper">
                    <LocalVideo 
                    focused={focusedUser === "local"}
                    videoRef={localVideoRef}
                    audio={localMicrophoneTrack} 
                    onClick={(e) => setFocusedUser("local")}
                    name={username}>

                    </LocalVideo>
                    {remoteUsers.slice(0,3).map((user, i) => (
                        <LocalVideo 
                        key={i}
                        focused={focusedUser === user.uid}
                        videoRef={el => remoteVideoRefs.current[i] = el} 
                        audio={user.audioTrack} 
                        onClick={() => setFocusedUser(user.uid)}>

                        </LocalVideo>
                    ))}
                    <div>{focusedUser}</div>
                </div>
            ) : (
                <div>Not connected</div>
            )}
            <Drawing ref={localBoardRef}></Drawing>
            <div className="video-controls">
                <button onClick={toggleCamera}>{cameraOn ? 'camera is ON' : 'camera is OFF'}</button>
                <button onClick={toggleMic}>{micOn ? 'mic is ON' : 'mic is OFF'}</button>
                <button onClick={() => toggleVar(!testVar)}>debug</button> 
            </div> 
        </div>
    );
}