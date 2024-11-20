import { db } from "../../firebase.js";
import { doc, collection, updateDoc, query, where, getDocs, getDoc} from "firebase/firestore";



export async function PATCH(req, { params }){
    const body = await req.json();
    const {id} = params;

    try{

    }
    catch(error){
        
    }
}