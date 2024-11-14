// app/api/room/route.js
import { NextResponse } from 'next/server'; 
import { firestore } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

export async function POST(request) {
    await request.json();
    const roomsRef = collection(firestore, 'rooms');
    const roomDoc = doc(roomsRef); // Creates a new doc reference with an ID
    const roomData = {
        createdAt: new Date(),
        hostID: '1'
    };
    await setDoc(roomDoc, roomData);
    return NextResponse.json({ roomID: roomDoc.id, status: 201});
}
