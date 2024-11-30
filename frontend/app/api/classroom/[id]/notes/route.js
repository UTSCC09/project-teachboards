import { db, storage, auth } from "@app/api/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * 
 * @param {*} req 
 * @param {*} param1 
 * @returns const newNote = {
      classroomId: ID OF CLASSROOM
      uid: USER ID
      contentURL: fileURL LINK TO FILE
      timestamp: Date.now()
    };
 */
export async function POST(req, { params }) {

    if (!params || !params.id) {
        return new Response(JSON.stringify({message:"missing file"}, {status: 400}));
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
        return new Response(JSON.stringify({message:"missing file"}, {status: 400}));
    }

    console.log(file.type);

    if (file.type !== "application/pdf") {
        return new Response(JSON.stringify({message:"must be PDF"}), {status: 422});
    }

    const classroomId = params.id; 
    const uid = 1;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${classroomId}-${uid}-${Date.now()}.pdf`;

    const storagePath = `classroom/${classroomId}/session/${uid}`;
    const storageRef = ref(storage, storagePath);


    await uploadBytes(storageRef, buffer, {
        contentType: file.type,
    });

    const fileURL = await getDownloadURL(storageRef);

    const notesRef = collection(db, "notes");
    const newNote = {
      classroomId,
      authorId: uid,
      contentURL: fileURL,
      timestamp: Date.now(),
    };
    const docRef = await addDoc(notesRef, newNote);

    return new Response(JSON.stringify({fileURL}));
}

// GET NOTGES FOR ALL STUDENTS IN THE CLASS
// TODO this is not fully working

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