
import { doc, collection, getDoc, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebase.js";


export async function GET(req, {params}){
    const {id} = params;
    if (!id){
        return new Response(JSON.stringify({message:"bad id"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        })
    }
    try{
        const userdoc = doc(db,"users",id);
        const userrec = await getDoc(userdoc);
        if (!userrec.exists()){
            return new Response(JSON.stringify({message:"bad id"}),{
                status:400,
                headers:{"Content-Type":"application/json"},
            })
        } 

        const userdata = userrec.data();
        const output = userdata.chatrooms || [];
        return new Response(JSON.stringify({output}),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });
    }
    catch(error){
        console.error("Error",error);
        return new Response(JSON.stringify({message:"could not get chat rooms"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        })
    }
}

