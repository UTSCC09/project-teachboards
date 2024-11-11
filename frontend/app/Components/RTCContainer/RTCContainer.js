'use client'

import { useState, useEffect, useRef } from "react";
import "./RTCContainer.css";
import VideoStream from "../VideoStream/VideoStream.js";
import Drawing from "../Drawing/Drawing.mjs"
import { useFirestore } from "../../firebase.js"; // Assuming a custom hook for Firestore
import { doc, collection, getDoc, setDoc, updateDoc, onSnapshot, addDoc } from "firebase/firestore"; 

export default function RTCContainer({ servers }) {
    const [localStream, setLocalStream] = useState(null);
    const remoteStream = useRef(new MediaStream());  // Use ref to store remote stream
    const pc = useRef(null);
    const callInput = useRef(null);
    const remoteDrawing = useRef(null);
    const drawingChannel = useRef(null);

    const { firestore } = useFirestore(); // Custom hook to interact with Firestore

    useEffect(() => {
        const peerConnection = new RTCPeerConnection(servers);
        pc.current = peerConnection;

        // Setup local stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });
                console.log('displaying local stream');
            })
            .catch((error) => console.error('Error accessing media devices.', error));

        // Setup remote stream handling
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.current.addTrack(track);
            });
        };

        // Set up drawing channel
        drawingChannel.current = pc.current.createDataChannel('drawingData');
        drawingChannel.current.onopen = () => {
            console.log("Data channel is open and ready to send data");
        };
        drawingChannel.current.onmessage = (event) => {
            // When the drawing data is received, update the remote display
            const drawingData = JSON.parse(event.data);
            updateDrawingOnCanvas(drawingData);
        };

    }, [servers]);

    // Handle signaling in another useEffect
    async function createCall(e){
        if (!callInput.current || !pc.current) return;

        const callsCollectionRef = collection(firestore, 'calls');

        const callDoc = doc(callsCollectionRef); // Creates a new doc reference with an ID
        callInput.current.value = callDoc.id;

        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        // ICE candidate handling
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const setupOffer = async () => {
            const offerDescription = await pc.current.createOffer();
            await pc.current.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await setDoc(callDoc, { offer });

            // Listen for remote answer
            onSnapshot(callDoc, (snapshot) => {
                const data = snapshot.data();
                if (!pc.current.currentRemoteDescription && data?.answer) {
                    const answerDescription = new RTCSessionDescription(data.answer);
                    pc.current.setRemoteDescription(answerDescription);
                }
            });

            // Handle incoming candidates
            onSnapshot(answerCandidates, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.current.addIceCandidate(candidate);
                    }
                });
            });
        }

        setupOffer();
        remoteDrawing.setCanvas(localStorage.getItem("drawing"));
    }

    const answerCall = async () => {
        console.log("answerCall");
        const callId = callInput.current.value;
        const callDoc = doc(firestore, 'calls', callId);
        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const callData = (await getDoc(callDoc)).data();

        const offerDescription = callData.offer;
        await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await updateDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current.addIceCandidate(candidate);
                }
            });
        });
    }

    return (
        <div id="videos">
            <VideoStream stream={localStream} />
            <VideoStream stream={remoteStream.current} />
            <Drawing ref={remoteDrawing}/>
            <div id="call-controls">
                <input type="text" ref={callInput} />
                <button onClick={createCall}>Create call</button>
                <button onClick={answerCall}>Join call</button>
            </div>
        </div>
    );
}
