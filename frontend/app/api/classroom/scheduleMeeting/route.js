import {setDoc, collection, query, where, getDocs, updateDoc, doc, arrayUnion,limit, orderBy } from "firebase/firestore";
import { NextResponse } from 'next/server'; 
import { db } from '@app/api/firebase';
import { getRandomValues } from "crypto";

import * as cookie from "cookie";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);


export async function POST(req,){
    const body = await req.json();
    const {id, classRoomID, date} = body;

    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const sessionToken = cookies.session;

    if (!sessionToken) {
        return new Response(JSON.stringify({ message: "please login" }), { status: 401 });
    }

    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const { id: uid, firstName, lastName } = payload; 

    // firs tmake the room
    const roomsRef = collection(db, 'rooms');
    const roomDoc = doc(roomsRef); // Creates a new doc reference with an ID

    //then we need to set up a document to store the whiteboards in
    // const boardsRef = collection(db, 'boards'); 
    // const boardsDoc = doc(boardsRef); //this is a docref

    let channelName = null;

    let tries = 10;

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
        teacherID: uid,
        channelName: channelName
    };
    await setDoc(roomDoc, roomData);

    try{
        if (!id || !classRoomID || !channelName){
            return new Response(JSON.stringify({message:"ID is invalid please try again"}),{
                status:400,
                headers:{"Content-Type": "application/json"},
            });
        }
        //add secuirity check for teacher to make sure its their classroom i think here thanks 
    
        const classRoomDB = doc(db,"classRoom",classRoomID);
        await updateDoc(classRoomDB,{
            [`meetingtime.${date}`]: { code: channelName },
        });
        const returnValue = {key:date,code:channelName};

        return new Response(JSON.stringify( returnValue ),{
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ message: "could not make meeting" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
