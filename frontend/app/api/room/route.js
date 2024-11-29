// app/api/room/route.js
import { NextResponse } from 'next/server'; 
import { db } from '@app/api/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

import { getRandomValues } from "crypto";

export async function GET(req) {
    // firs tmake the room
    const roomsRef = collection(db, 'rooms');
    const roomDoc = doc(roomsRef); // Creates a new doc reference with an ID

    //then we need to set up a document to store the whiteboards in
    const boardsRef = collection(db, 'boards'); 
    const boardsDoc = doc(boardsRef); //this is a docref

    let channelName = null;

    let tries = 5;

    const generateChannelName = () => {
        const array = new Uint32Array(1);
        getRandomValues(array);
        const code = array[0] % 10000000000; 
        return code.toString().padStart(10, '0'); 
    };


    while (tries > 0) {
        channelName = generateChannelName();
        
        // Query Firestore to check if the channelName already exists
        const q = query(roomsRef, where("channelName", "==", channelName));
        const querySnapshot = await getDocs(q);
        console.log(tries)
        // If no document with this channelName exists, break the loop
        if (querySnapshot.empty) {
            break;
        }
        --tries;
    }


    // TODO: add classroom stuff to room (might need to move to different route for this)
    const roomData = {
        createdAt: new Date(),
        teacherID: '1',
        channelName: channelName,
        active: false,
        boardsId: boardsRef.id
    };
    await setDoc(roomDoc, roomData);
    return NextResponse.json({ roomID: roomData.channelName, status: 201});
}