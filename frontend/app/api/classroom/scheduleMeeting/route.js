import { db } from "../../../firebase.js";
import {collection,query, where, getDoc, updateDoc, doc, arrayUnion, getDocs,limit, orderBy } from "firebase/firestore";



export async function POST(req,){
    const body = await req.json();
    const {id, classRoomID, date, sendingcode} = body;
    try{
        if (!id || !classRoomID || !sendingcode){
            return new Response(JSON.stringify({message:"ID is invalid please try again"}),{
                status:400,
                headers:{"Content-Type": "application/json"},
            });
        }
        //add secuirity check for teacher to make sure its their classroom i think here thanks 
    
        const classRoomDB = doc(db,"classRoom",classRoomID);
        await updateDoc(classRoomDB,{
            [`meetingtime.${date}`]: { code: sendingcode },
        });
        const returnValue = {key:date,code:sendingcode};

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