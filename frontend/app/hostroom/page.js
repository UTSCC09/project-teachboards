'use client'

import { useEffect, useState } from "react";
import RTCContainer from "../Components/RTCContainer/RTCContainer";
import VideoStream from "../Components/VideoStream/VideoStream";

export default function RoomPage() {
    const [roomID, setRoomID] = useState('');
    const [hostStream, setHostStream] = useState(null);

    // Function to create a room and fetch the roomID
    async function createRoom() {
        try {
            const res = await fetch('/api/room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            // Ensure the response is in JSON format
            const data = await res.json();

            // Set the roomID from the response
            if (res.ok) {
                setRoomID(data.roomID);
            } else {
                console.error('Failed to create room');
            }
        } catch (err) {
            console.error('Error creating room:', err);
        }

        const callsRef = collection(roomRef, 'calls');
        onSnapshot(callsRef, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    // A new guest has joined, handle their offer
                    const callDoc = change.doc;
                    console.log("handling new guest connection")
                    handleGuestOffer(callDoc);
                }
            });
        });
    }

    useEffect(() => {
        // Initialize media stream for the host
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setHostStream(stream);
                // Set up RTC connection for each guest later
            })
            .catch(err => console.error('Error accessing media devices:', err));
    }, []);

    useEffect(() => {
        createRoom(); // Call createRoom when the component mounts
    }, []); // Empty dependency array means this effect runs once on mount

    const handleGuestOffer = async (callDoc) => {
        // Host will respond to the guest's offer (SDP)
        const pc = new RTCPeerConnection(); // Create a new RTC connection for the guest
        const offerDescription = callDoc.data().offer;
        await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));
        
        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const callData = (await getDoc(callDoc)).data();

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

    };

    return (
        <div className="RoomPageContainer">
            <div className="HostElements">
            <button onClick={createRoom}>Create Room</button>
            {roomID && <p>Room ID: {roomID}</p>} {/* Display roomID when available */}
            <VideoStream stream={hostStream} />
            </div>
        </div>
    );
}
