import { db } from "@app/api/firebase.js";
import { doc, collection, addDoc, getDocs, query, where, getDoc } from "firebase/firestore";

// uploads notes for given user
export async function POST(req, {params}) {
  // TODO: Add authentication middleware 
  /**
   * req body:
   * uid: user id
   * noteContent: react canvas draw object WARNING: IT MIGHT BE TOO BIG. TODO
   * classroom ID given by params.id
   * date: the time of the meeting date where notes were taken
   */
  const { uid, noteContent } = await req.json();
  const classroomId = params.id

  try {
    const notesRef = collection(db, "notes");
    const newNote = {
      authorId: uid,
      classroomId: classroomId,
      content: noteContent,
      timestamp: Date.now()
    };

    const noteDoc = await addDoc(notesRef, newNote);

    return new Response(
      JSON.stringify({ noteId: noteDoc.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading notes:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}