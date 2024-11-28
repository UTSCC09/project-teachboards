import { db } from "../../../../firebase.js";
import {collection,query, where,getDoc, doc,updateDoc, arrayUnion, getDocs,limit, orderBy } from "firebase/firestore";
import validator from "validator";


export async function POST(req,{params}){
    const {id} = params;
    const body = await req.json();
    const code = validator.escape(body.code);

    if (!id || !code){
        return new Response(JSON.stringify({message:"ID or Code is invalid please try again"}),{
            status:400,
            headers:{"Content-Type": "application/json"},
        });
    }
    try{   
        const crd = doc(db, "classRoom", code);
        const classRoomDoc = await getDoc(crd);
        if (!classRoomDoc.exists()) {
            return new Response(JSON.stringify({ message: "bad code" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        if (classRoomDoc.data().teacherID === id){
            return new Response(JSON.stringify({ message: "teacher cannot join their own class" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        await updateDoc(crd, {
            students: arrayUnion(id),
        });

        const updatedClassRoom = await getDoc(crd);
        const classroomReturn = {
            id: code,
            classroomID: code,
            className: updatedClassRoom.data().className, 
        };
        return new Response(JSON.stringify(classroomReturn), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        return new Response(JSON.stringify({message:"failed to join classrooms bro"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        })
    }
}