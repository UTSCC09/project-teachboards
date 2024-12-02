"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    const [roomId, setRoomId] = useState('');

    function joinRoom(e) {
        e.preventDefault(); // Prevent the default form submission

        // TODO rework room join flow so that this screen also checks if the room exists
        router.push(`/room/${roomId}`)
    }

    return (
        <form onSubmit={joinRoom}>
            <input 
                type="text" 
                placeholder="0123456789"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)} 
            />
            <button type="submit">Join this room</button>
        </form>
    );
}