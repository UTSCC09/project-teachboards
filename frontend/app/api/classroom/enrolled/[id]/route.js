import { db } from "../../../../firebase.js";
import {collection,query, where, getDocs,limit, orderBy } from "firebase/firestore";



export async function GET(req,{params}){
    const {id} = params;
    if (!id){
        return new Response(JSON.stringify({message:"ID is invalid please try again"}),{
            status:400,
            headers:{"Content-Type": "application/json"},
        });
    }
    try{   
        const classroomItem = query(collection(db,"classRoom"), where("students", "array-contains", id), orderBy("createdAt", "desc"),limit(10));
        const classReturn = await getDocs(classroomItem);
        if (classReturn.docs.length === 0){
            return new Response(JSON.stringify([]),{
                status:200,
                headers:{"Content-Type":"application/json"},
            });
        }
        let classroom = classReturn.docs.map((doc)=> ({
            id: doc.data().classRoomID,
            classRoomID: doc.data().classRoomID,
            className: doc.data().className,
            ...doc.data(),
        }));
        return new Response(JSON.stringify(classroom),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });

    }
    catch(error){
        console.log("error occured in getting classrooms");
        return new Response(JSON.stringify({message:"failed to get classrooms bro"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        })
    }
}