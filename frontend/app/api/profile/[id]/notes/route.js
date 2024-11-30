import { db, auth } from "@app/api/firebase.js"
import { doc, getDoc, getDocs, query, collection, where, orderBy, limit, startAfter} from "firebase/firestore";
import validator from "validator";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// GETS ALL PAST NOTES FOR A STUDENT IN ALL CLASSROOMS

export async function GET(req, { params }) {
    const {id} = params;
 
    if (!id){
        return new Response(JSON.stringify({message:"Id is invalid"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        });
    }
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const lastDocID = searchParams.get('lastDocID') || null;
    const numLimit = Math.min(30, parseInt(searchParams.get("numLimit")) || 30);

    try{

        // if last doc ID isn't provided just get the first 'count'
        let notesQuery = query(
            collection(db,"notes"),
            where("authorId", "==", id),
            orderBy("timestamp"),
            limit(numLimit)
        ) 
        // if last doc ID IS provided then get the first
        if (lastDocID != null) {
            console.log("lastDoc provided")
            const lastDocSnap = await getDoc(doc(db, "notes", lastDocID));
            noteQuery = query(
                collection(db,"notes"),
                where("authorId", "==", id),
                orderBy("timestamp"),
                startAfter(lastDocSnap),
                limit(numLimit)
            )
        }
        const notesSnapshot = await getDocs(notesQuery);
        const notes = notesSnapshot.docs.map((n) => (n.data()));

        return new Response(JSON.stringify({
            notes,
            hasMore: (notesSnapshot.docs.length === numLimit),
            lastDocID: notesSnapshot.docs[notes.length - 1].id,
        }),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });
    }
    catch(error){
        console.log("error getting user detail");
        console.log(error);
        return new Response(JSON.stringify({message:"Failed to get notes"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        });
    }
}