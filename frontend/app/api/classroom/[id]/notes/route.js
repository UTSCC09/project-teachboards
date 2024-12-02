import { db, storage, auth } from "@app/api/firebase.js";
import { doc, collection, getDoc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as cookie from "cookie";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * @abstract creates a note, saves PDF, saves note's id to classroom.notes and user.notes array
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

    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const sessionToken = cookies.session;

    if (!sessionToken) {
        return new Response(JSON.stringify({ message: "please login" }), { status: 401 });
    }

    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const { id: uid, firstName, lastName } = payload; 

    const classroomId = params.id; 
    

    const classroomRef = doc(db, "classRoom", classroomId);
    if (classroomRef === null) {
        return new Response(JSON.stringify({message:"classroom not found"}), {status: 404})
    }
    // if notes doesn't exist, then make it
    let classroomData = (await getDoc(classroomRef)).data();
    if (classroomData.notes === null) {
        await updateDoc(classroomRef, {
            notes: []
        });
        classroomData = (await getDoc(classroomRef)).data()
    }
    console.log(classroomData);

    // make sure user is in the class they adding to
    if (!classroomData.students.includes(uid) && classroomData.teacherID != uid) {
        return new Response(JSON.stringify({message:"you aren't in that class"}), {status: 401})
    }


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

    const timestamp = Date.now();


    // adding the notes to Firebase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${classroomId}-${uid}-${timestamp}.pdf`;

    const storagePath = `classroom/${classroomId}/notes/${filename}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, buffer, {
        contentType: file.type,
    });

    const fileURL = await getDownloadURL(storageRef);
    console.log(fileURL);

    const notesRef = collection(db, "notes");
    const newNote = {
      classroomId,
      authorId: uid,
      contentURL: fileURL,
      timestamp: timestamp,
    };
    const noteRef = await addDoc(notesRef, newNote);
    
    // add the note to the classroom
    await updateDoc(classroomRef, {
        notes: arrayUnion(noteRef.id) 
    });

    // add note to the user
    const userRef = doc(db, "users", uid);
    let userData = (await getDoc(userRef)).data();
    if (userData.notes === null) {
        await updateDoc(userRef, {
            notes: []
        });
        userData = (await getDoc(userRef)).data()
    }
    await updateDoc(classroomRef, {
        notes: arrayUnion(noteRef.id) 
    });
    
    return new Response(JSON.stringify({noteId: noteRef.id, fileURL: fileURL}), {status: 201});
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