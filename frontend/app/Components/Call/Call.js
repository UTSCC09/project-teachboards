"use client" 

import './Call.css'
import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
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
import AgoraRTM from "agora-rtm-sdk";
import Link from "next/link";
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf";
import Videos from "../Videos/Videos";
import Drawing from '../Drawing/Drawing.mjs';

export default function Call({channelName, appId, token, rtmToken, uid, endCall}) {

    const client = useRTCClient(AgoraRTC.createClient({mode: "live", codec: "vp8", role: "host"}));

    

    const [ localUsername, setLocalUsername ] = useState("");
    const [ readyEndCall, setReadyEndCall ]  = useState(false);

    const [ viewState, setViewState ] = useState(0);
    // 0 - default view
    // 1 - viewing participants
    // 2 - whiteboard

    const localBoardRef = useRef();
    const [boardUploadState, setBoardUploadState] = useState(0);

    const saveToFirestore = async () => {
        setBoardUploadState(1);
        const saveData = localBoardRef.current.getSaveData();
        

        async function uploadPDF(pdfBlob) {
            setBoardUploadState(1); // Start upload state
    
            const formData = new FormData();
            formData.append('file', pdfBlob, 'drawing.pdf');
            formData.append('uid', 1);

            //TODO: REMOVE HARDCODE
            const classroomId = "76cdCVK4beEE8Ik74613"
            try {
                const response = await fetch(`/api/classroom/${classroomId}/notes`, {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    console.error("bad classroom upload")
                }
                console.log(response.json())

                setBoardUploadState(2); // Upload complete
                setReadyEndCall(true);
            } catch (error) {
                console.error(error);
                setBoardUploadState(0); // Reset upload state
            }
        };

        const generatePDF = () => {
            const canvas = localBoardRef.current.canvas;
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height],
            });
            const imageData = canvas.getDataURL("image/png");
    
            // You can customize this PDF generation
            pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
    
            const pdfBlob = pdf.output('blob');  // Output as a Blobh
            
            return pdfBlob;
        };
        const pdfBlob = generatePDF();
        uploadPDF(pdfBlob);
    }
    function handleLeaveCall() {
        rtm.current.logout();
        saveToFirestore();
    }
    useEffect( ()=> {
        if (readyEndCall) {
            endCall();
        }
    },[readyEndCall])

    //RTM STUFF
    const rtmConfig = {

    };
    const rtm = useRef(new AgoraRTM.RTM(appId, uid.toString(), rtmConfig));

    
    rtm.current.addEventListener("status", event => {
        // The current connection state.
        const currentState = event.state;
        // The reason why the connection state changes.
        const changeReason = event.reason;
        console.log(event);
    });
    const handChannel = "hand_"+channelName;

    return (
        <AgoraRTCProvider className="call-wrapper" client={client}>
            <div className={"flex"}>
                {/* <p>{token}</p>
                <p>{uid}</p> */}
                { token && uid ? 
                (
                <Videos 
                    className={"call-videos"}
                    channelName={channelName}
                    appId={appId}
                    token={token}
                    rtmToken={rtmToken}
                    rtm={rtm}
                    handChannel={handChannel}
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

function TEMPBOI({appId, uid, rtmToken, localBoardRef}) {

    const handChannel = `hand${+uid}`;
    const rtmConfig = {
        
    }
    

    return (
        <div>
            <span>{uid}</span>
            <button onClick={rtmLoggedIn ? rtmLogout : rtmLogin}>{rtmLoggedIn ? "LOG OUT" : "LOG IN" }</button>
            <button onClick={rtmPublish}>PUBLISH</button>
            <Drawing ref={localBoardRef}>
                
            </Drawing>
        </div>
    );
}

function Sidebar() {

    const remoteUsers = useRemoteUsers();

    return (
        <div>
            participants: 
            <ul>
            {remoteUsers.map(user => (
                <li key={user.uid}>{user.uid}</li>
            ))}
            </ul>
        </div>
    )
}