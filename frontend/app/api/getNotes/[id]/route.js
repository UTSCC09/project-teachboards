import { db } from "../../../firebase.js";
import {collection,query, where,getDoc, doc,updateDoc, arrayUnion, getDocs,limit, orderBy } from "firebase/firestore";


export async function GET(req,{params}){
    const {id} = params;
    try{

        const notesDB = query(
            collection(db, "notes"),
            where("authorId", "==", id)
        );
        const notesData = await getDocs(notesDB);
        const notes = [];
        notesData.forEach((note) =>{
                notes.push(note.data().contentURL);
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
