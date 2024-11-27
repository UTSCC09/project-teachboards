// app/api/room/route.js
import { NextResponse } from 'next/server'; 
import { firestore } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

export async function POST(req) {
    // firs tmake the room
    await req.json();
    const roomsRef = collection(firestore, 'rooms');
    const roomDoc = doc(roomsRef); // Creates a new doc reference with an ID

    //then we need to set up a document to store the whiteboards in
    const boardsRef = collection(firestore, 'boards'); 
    const boardsDoc = doc(boardsRef); //this is a docref

    // CURRENT CHANNEL IS ONLY NAMED 'main'. WILL LIKELY USE ROOM ID AS CHANNEL NAME IN FUTURE
    const roomData = {
        createdAt: new Date(),
        teacherID: '1',
        channelName: 'main',
        active: false,
        boardsDoc: boardsDoc
    };
    await setDoc(roomDoc, roomData);
    return NextResponse.json({ roomID: roomDoc.id, status: 201});
}