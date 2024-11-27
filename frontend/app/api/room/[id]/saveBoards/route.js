// app/api/room/route.js
import { NextResponse } from 'next/server'; 
import { firestore } from '../firebase';
import { doc, getDoc, collection } from 'firebase/firestore';

export async function POST(req, {params}) {
    const roomID = params.id;

    await req.json();
    const boards = req.boards();
    const roomsRef = collection(firestore, 'rooms');
    const roomDoc = doc(roomsRef, roomID); // Creates a new doc reference with an ID

    const roomSnapshot = await getDoc(roomDoc);
    if (!roomSnapshot.exists()) {
        return NextResponse.json({ error: "Room does not exist" }, { status: 404 });
    }

    const boardsRef = collection(roomDoc, "boards");
    for (const [userID, userBoards] of Object.entries(boards)) {
        if (!Array.isArray(userBoards)) {
            continue; 
        }

        const userBoardsRef = doc(boardsRef, userID); 

        for (const board of userBoards) {
            // Save each board as a new document under the user's sub-collection
            await addDoc(userBoardsRef, board);
        }
    }
    
    
    return NextResponse.json({ message: "Boards successfully updated", status: 201 });
}