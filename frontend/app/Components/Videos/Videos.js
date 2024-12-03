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
import AgoraRTM from "agora-rtm-sdk";

import React, { useRef, useEffect, useState } from "react";

import "./Videos.css"
import VideoStream from "../VideoStream/VideoStream";
import {useAuth} from "../Content/AuthContext.js";
import Drawing from "../Drawing/Drawing.mjs";


export default function Videos({classroomID, appId, channelName, token, rtmToken, rtm, handChannel, uid, username, localBoardRef}) {

    const client = useRTCClient();
    AgoraRTC.setLogLevel(4);

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
    const [b, bb] = useState(false);

    const [ focusedUser, setFocusedUser ] = useState("local"); 

    const [ compressedSaveData, setCompressedSaveData ] = useState("");
    const [ localHandRaised, setHandRaised ] = useState(false);
  
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
     }, true);
    usePublish([localMicrophoneTrack, localCameraTrack], true);
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

    const [rtmLoggedIn, setRtmLoggedIn] = useState(false);
    const [hands, setHands] = useState({});
    rtm.current.addEventListener('message', (eventArgs) => {
        const uid = eventArgs.publisher;
        const message = eventArgs.message;

        console.log(uid + ": " + message)
        setHands(prevHands => ({
            ...prevHands,
            [uid]: message==='hand up'
        }));
    })
    rtm.current.addEventListener("presence", event => {
        if (event.eventType === "SNAPSHOT") {
            sendHand();
        }
        else {
          console.log(event.publisher + " is " + event.eventType);
        }
      });
    useEffect(() => {
        rtmLogin();
    }, [])
    async function rtmLogin() {
        try { 
            const result = await rtm.current.login({token: rtmToken});
            setRtmLoggedIn(true);
            try {
                await rtm.current.subscribe(handChannel)
                console.log("subbed to hand channel: "+handChannel)
              } catch (err) {
                console.error(err);
              }
          } catch (err) {
            console.log(err, 'error occurs at login.');
        }
    }
    async function rtmLogout() {
        try {
            const result = await rtm.current.logout();
            setRtmLoggedIn(false);
            console.log("logged out")
        } catch (err) {
            console.log(err, 'error on logout')
        }
    } 
    async function handUp() {
      // Login 
        if (rtmLoggedIn) {      // Send channel message
            try { 
                const publishOptions = { channelType: 'MESSAGE' }
                await rtm.current.publish(handChannel, 'hand up', publishOptions);
                console.log('asdf');
            } catch (err) {
                console.log(err, 'error occurs at publish message');
            }
        } else {
            console.log("not logged in");
        }
    }
    async function handDown() {
        // Login 
          if (rtmLoggedIn) {      // Send channel message
              try { 
                  const publishOptions = { channelType: 'MESSAGE'}
                  await rtm.current.publish(handChannel, 'hand down', publishOptions);
              } catch (err) {
                  console.log(err, 'error occurs at publish message');
              }
          } else {
              console.log("not logged in");
          }
      }

    function toggleHand() {
        setHandRaised(!localHandRaised);
    }
    function sendHand() {
        if (localHandRaised)
            handUp();
        else {
            handDown();
        }
    }
    useEffect(() => {
        sendHand()
    }, [localHandRaised])
    

    // TODO: MOBILE VIEW
    return (
        <div className="videos-wrapper">
            <div className="hands">

            </div>
            {isConnected ? (
                <div className="video-grid-wrapper">
                    <div className="video-grid-all">
                        {remoteUsers.slice(0,3).map((user, i) => (
                            <SingleVideoWrapper key={i} focused={focusedUser === user.uid} onClick={(e) => setFocusedUser(user.uid)}>
                                <VideoStream 
                                    videoRef={el => remoteVideoRefs.current[i] = el} 
                                    audio={user.audioTrack} 
                                    onClick={() => setFocusedUser(user.uid)}
                                    whiteboard={null}
                                >
                                </VideoStream>
                                {<div className="video-name">{user.uid}</div>}
                                {hands[user.uid.toString()] && <div className="hand">✋</div>}
                            </SingleVideoWrapper>
                        ))}
                    </div>
                    <SingleVideoWrapper focused={focusedUser === "local"} onClick={(e) => setFocusedUser("local")}>
                        <VideoStream 
                            videoRef={localVideoRef}
                            audio={localMicrophoneTrack} 
                            name={username}
                        >
                        </VideoStream>
                        {<div className="video-name">{uid}</div>}
                        {localHandRaised && <div className="hand">✋</div>}
                    </SingleVideoWrapper>
                    {remoteUsers.length === 0 && <p>no remote users</p>}
                    {remoteUsers.slice(0,3).map((user, i) => (
                        <SingleVideoWrapper key={i} focused={focusedUser === user.uid} onClick={(e) => setFocusedUser(user.uid)}>
                            <VideoStream 
                                videoRef={el => remoteVideoRefs.current[i] = el} 
                                audio={user.audioTrack} 
                                onClick={() => setFocusedUser(user.uid)}
                                whiteboard={null}
                            >
                            </VideoStream>
                            {<div className="video-name">{user.uid}</div>}
                            {hands[user.uid.toString()] && <div className="hand">✋</div>}
                        </SingleVideoWrapper>
                    ))}
                    <div className="board-focused">
                        <Drawing canvasWidth={500} canvasHeight={500} ref={localBoardRef}></Drawing>
                    </div>
                </div>
            ) : (
                <div>Connecting...</div>
            )}
            <div className="video-controls">
                <p>{remoteVideoTracks.length}</p>
                <button onClick={toggleCamera}>{cameraOn ? 'camera is ON' : 'camera is OFF'}</button>
                <button onClick={toggleMic}>{micOn ? 'mic is ON' : 'mic is OFF'}</button>
                <button onClick={toggleHand}>{localHandRaised ? 'hand is UP' : 'hand is DOWN'}</button>
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