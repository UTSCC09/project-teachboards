'use client'

import { useState, useEffect, useRef } from "react";
import "./RTCContainer.css";
import VideoStream from "../VideoStream/VideoStream.js";
import { useFirestore } from "../../firebase.js"; // Assuming a custom hook for Firestore
import { doc, collection, getDoc, setDoc, updateDoc, onSnapshot, addDoc } from "firebase/firestore"; // import necessary functions

export default function RTCContainer({ servers }) {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const pc = useRef(null);
    const callInput = useRef(null);

    const { firestore } = useFirestore(); // Custom hook to interact with Firestore

    useEffect(() => {
        const peerConnection = new RTCPeerConnection(servers);
        pc.current = peerConnection;

        // Setup local stream
        console.log('displaying local stream');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                console.log(stream);
                setLocalStream(stream);
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });
            })
            .catch((error) => console.error('Error accessing media devices.', error));

        // Setup remote stream
        setRemoteStream(new MediaStream());
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

    }, [servers]);


    // Handle signaling in another useEffect
    async function createCall(e){
        if (!callInput.current || !pc.current) return;

        const callsCollectionRef = collection(firestore, 'calls');

        // Step 2: Create a new document with an auto-generated ID in the 'calls' collection
        const callDoc = doc(callsCollectionRef); // Creates a new doc reference with an ID

        // Step 3: Set data on the new call document
        await setDoc(callDoc, { createdAt: new Date() });

        // Step 4: Assign the document ID to the input field
        callInput.current.value = callDoc.id;

        // Step 5: Get references to the 'answerCandidates' and 'offerCandidates' sub-collections
        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        // Setup the Ice candidate handling and listen for real-time updates
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

            await setDoc(callDoc, {offer});
            console.log(offer);

            // listen for remote answer
            onSnapshot(callDoc, (snapshot) => {
                const data = snapshot.data();
                if (!pc.current.currentRemoteDescription && data?.answer) {
                    // answer is recieved
                    const answerDescription = new RTCSessionDescription(data.answer);
                    pc.current.setRemoteDescription(answerDescription);
                }
            })

            // when answered, add candidate
            onSnapshot(answerCandidates, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.current.addIceCandidate(candidate);
                    }
                });
            })
        }

        setupOffer();
    };

    const answerCall = async () => {
        console.log("answerCAll")
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
            sdp: answerDescription.sdp
        };

        await updateDoc(callDoc, {answer});

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.current.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        })
    };

    return (
        <div id="videos">
            <VideoStream stream={localStream} />
            <VideoStream stream={remoteStream} />
            <input type="text" ref={callInput} />
            <button onClick={createCall}>call</button>
            <button onClick={answerCall}>answer</button>
        </div>
    );
}

