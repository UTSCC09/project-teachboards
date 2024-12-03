import {collection,query, where, getDoc, updateDoc, doc, arrayUnion, getDocs,limit, orderBy } from "firebase/firestore";
import { NextResponse } from 'next/server'; 
import { db } from '@app/api/firebase';

import * as cookie from "cookie";
import { jwtVerify } from "jose";


export async function GET(req, {params}) {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const sessionToken = cookies.session;

    console.log("iuwahef")

    // if (!sessionToken) {
    //     return new Response(JSON.stringify({ message: "please login" }), { status: 401 });
    // }
    
    // const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    // const { id: uid } = payload;

    try {
        const classroomId = params.id;

        const classroomRef = doc(db, "classRoom", classroomId);
        const classroomSnap = await getDoc(classroomRef);

        const meetings = classroomSnap.data().meetingtime || {};

        return new Response(JSON.stringify({ meetings: meetings }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("error:", error.message);
        return new Response(JSON.stringify({ message: "error retrieving meetings" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}