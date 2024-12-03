import { db } from "../../../../../firebase.js";
import {collection,query, where,getDoc, doc,updateDoc, arrayUnion, getDocs,limit, orderBy } from "firebase/firestore";


export async function GET(req,{params}){
    const {classroomID, date} = params;
    try{
        const classroomDB = doc(db, "classRoom", classroomID);
        const classroom = await getDoc(classroomDB);
        const data = classroom.data();
        if(data.notes.length === 0){
            return new Response(JSON.stringify({message:"sorry there is no message for that date"}),{
                status:401,
                headers:{"Content-Type":"application/json"},
            })
        }
        const inputDate = new Date(date);
        const startOfDay = new Date(inputDate.getFullYear(),inputDate.getMonth(),inputDate.getDate()).getTime();
        const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(),inputDate.getDate() + 1).getTime() - 1;

        const notesDB = query(
            collection(db, "notes"),
            where("timestamp", ">=", startOfDay),
            where("timestamp", "<=", endOfDay)
        );

        const notesData = await getDocs(notesDB);
        const notes = [];
        notesData.forEach((note) =>{
            if(data.notes.includes(note.id)){
                notes.push(note.data().contentURL);
            }
        });
        if (notes.length === 0){
            return new Response(JSON.stringify({message:"sorry there is no message for that date"}),{
                status:401,
                headers:{"Content-Type":"application/json"},
            })
        }
        return new Response(JSON.stringify(notes),{
            status:200,
            headers:{"Content-Type":"application/json"},
        })
    }
    catch(error){
        return new Response(JSON.stringify({message:"cannot retrived notes for that date"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        })
    }

}
