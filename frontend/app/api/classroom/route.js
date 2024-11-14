import { db } from "../../firebase.js";
import { doc, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import validator from "validator";

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
        const classroomDB = collection(db, "classRoom");
        const newClassroom = await addDoc(classroomDB, {
            className,
            teacherID: id,
            students: {}, 
            notes: {}, 
        });
        const classRoomId = newClassroom.id; 
        const userDB = doc(db, "users", id); 
        await updateDoc(userDB, {
            classrooms: arrayUnion(classRoomId)
        });
        return new Response(JSON.stringify({ classRoomId }), {
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
