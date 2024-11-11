import { useRef, useEffect } from 'react';
import "./VideoStream.css";

export default function VideoStream({stream}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video className="video-stream" ref={videoRef} autoPlay playsInline onContextMenu={(e)=> e.preventDefault()}></video>
    );
}