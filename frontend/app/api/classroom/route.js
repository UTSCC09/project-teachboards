import { db } from "../../firebase.js";
import { doc, collection, addDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import validator from "validator";
//add check to see if user id is holds or exist in the database
export async function POST(req) {
    const body = await req.json();
    const className = validator.escape(body.className);
    const id = body.id;

    if (!id) {
        console.error("Error  ID is missing or invalid.");
        return new Response(JSON.stringify({ message: "ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        //just adding the new classroom
        const classroomDB = collection(db, "classRoom");
        const newClassroom = await addDoc(classroomDB, {
            className,
            teacherID: id,
            students: [], 
            notes: {}, 
            createdAt:serverTimestamp(),

        });
        //adding the classRoomID thing
        const classRoomId = newClassroom.id; 
        const classroomDOC = doc(db, "classRoom", classRoomId);
        await updateDoc(classroomDOC,{
            classRoomID: classRoomId,
        });
        //saving classroom to user 
        const userDB = doc(db, "users", id); 
        await updateDoc(userDB, {
            classrooms: arrayUnion(classRoomId)
        });

        const classroomReturn = {
            id:classRoomId,
            classroomID: classRoomId,
            className: className,
        }
        return new Response(JSON.stringify(classroomReturn ), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ message: "could not make class" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
