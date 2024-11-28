import { db } from "../../firebase.js";
import {updateDoc,doc} from "firebase/firestore";


export async function POST(req){
    const body = await req.json();
    const id = body.id;
    const status = body.status;
    const statusactual = status.statusactual;
    const statusPriority = status.statusPriority;
    try{
        const userDB = doc(db, "users", id);
        await updateDoc(userDB,{
            status:{
                statusactual:statusactual,
                statusPriority:statusPriority
            },
        });

        return new Response(JSON.stringify({message:"Succesfull status"}),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });
    }
    catch(error){
        return new Response(JSON.stringify({message:"no status"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        });
    }
}