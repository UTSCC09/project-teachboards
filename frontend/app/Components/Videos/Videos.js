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
    useLocalUID,
    useLocalScreenTrack,
    LocalUser
  } from "agora-rtc-react";

import React, { useRef, useEffect, useState } from "react";

import "./Videos.css"
import VideoStream from "../VideoStream/VideoStream";
import {useAuth} from "../Content/AuthContext.js";
import Drawing from "../Drawing/Drawing.mjs";


export default function Videos({classroomID, appId, channelName, token, rtmToken, uid, username, localBoardRef}) {

    //const client = useRTCClient();
    //const uid = useLocalUID();


    // Video track stuff
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

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
    
    // whiteboard
    const testBoardStreamRef = useRef();

    //debug 
    AgoraRTC.setLogLevel(1); 

    const [ focusedUser, setFocusedUser ] = useState("local"); 
    
    useEffect( () => {
        if(!localBoardRef.current) return;
        const canvas = localBoardRef.current.canvas;
        const canvasStream = canvas.captureStream(30);

        const canvasTrack = AgoraRTC.createCustomVideoTrack({
            mediaStreamTrack: canvasStream.getVideoTracks()[0],
        })
        canvasTrack.play(testBoardStreamRef.current);


        client.publish([canvasTrack]);
    }, [localBoardRef])

    // useEffect( () => {
    //     if (testBoardStreamRef.current) {
    //         canvasTrack.play(testBoardStreamRef.current);
    //     }
    // }, [testBoardStreamRef])
 
    // local video
    const localVideoRef = useRef();
    useEffect(() => {
        if (!isLoadingCam && localCameraTrack && localVideoRef.current) {
            if (cameraOn) localCameraTrack.play(localVideoRef.current);
            else localCameraTrack.stop();
        }
    }, [localCameraTrack, cameraOn, isLoadingCam]);

    // local whiteboard
    
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

    // TODO: MOBILE VIEW
    return (
        <div className="videos-wrapper">
            {isConnected ? (
                <div className="video-grid-wrapper">
                    <SingleVideoWrapper focused={focusedUser === "local"} onClick={(e) => setFocusedUser("local")}
                    >
                        <VideoStream 
                            videoRef={localVideoRef}
                            audio={localMicrophoneTrack} 
                            name={username}
                        >
                        </VideoStream>
                    </SingleVideoWrapper>
                    {remoteUsers.slice(0,3).map((user, i) => (
                        <SingleVideoWrapper key={i} focused={focusedUser === user.uid} onClick={(e) => setFocusedUser(user.uid)}>
                            <VideoStream 
                                videoRef={el => remoteVideoRefs.current[i] = el} 
                                audio={user.audioTrack} 
                                onClick={() => setFocusedUser(user.uid)}
                                whiteboard={null}
                            >
                            </VideoStream>
                        </SingleVideoWrapper>
                    ))}
                    <SingleVideoWrapper>
                        <VideoStream
                            videoRef={testBoardStreamRef}
                        >

                        </VideoStream>
                    </SingleVideoWrapper>
                    <div className="board-focused">
                        <Drawing canvasWidth={500} canvasHeight={500} ref={localBoardRef}></Drawing>
                    </div>
                </div>
            ) : (
                <div>Not connected</div>
            )}
            <div className="video-controls">
                <button onClick={toggleCamera}>{cameraOn ? 'camera is ON' : 'camera is OFF'}</button>
                <button onClick={toggleMic}>{micOn ? 'mic is ON' : 'mic is OFF'}</button>
            </div> 
        </div>
    );
}

function SingleVideoWrapper({focused, children, onClick}) {
    return (
        <div className={focused ? "single-video-wrapper video-focused" : "single-video-wrapper video-v"} onClick={onClick}>
            {children}
        </div>
    )
}