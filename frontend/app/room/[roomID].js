'use client'

import { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Firestore setup
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

export default function GuestPage() {
    const searchParams = useSearchParams();
    const roomID = searchParams();
    const [localStream, setLocalStream] = useState(null);

    useEffect(() => {
        console.log(roomID);
        // Get media for the guest
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                createOffer();  // Create an offer once the stream is ready
            })
            .catch(err => console.error('Error accessing media devices:', err));
    }, []);

    const createOffer = async () => {
        const roomRef = doc(firestore, 'rooms', roomID);
        const callsRef = collection(roomRef, 'calls');
        
        // Create a new call document in Firestore for the guest
        const callRef = doc(callsRef);
        const peerConnection = new RTCPeerConnection();
        
        // Add tracks to the peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Store the offer in Firestore
        await setDoc(callRef, { offer: offer });

        // Listen for the host's answer
        onSnapshot(callRef, (doc) => {
            const data = doc.data();
            if (data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                peerConnection.setRemoteDescription(answerDescription);
            }
        });
    };

    return (
        <div>
            <h2>Join Room</h2>
            {roomID && <p>Room ID: {roomID}</p>} {/* Display roomID when available */}
            <video srcObject={localStream} autoPlay />
        </div>
    );
}
