
import { collection, query, where, orderBy, doc, getDocs,addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.js";

export async function POST(req){
    const body = await req.json();
    const { chatID, messageText, messageSender, dateSent } = body;
    
    if (!chatID || !messageText || !messageSender) {
        return new Response(JSON.stringify({ message: "Invalid data" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const messageDoc = collection(db,'chatroom',chatID, "messages");
        await addDoc(messageDoc,{
            messageText,
            messageSender,
            dateSent: dateSent || serverTimestamp(),
        });

        return new Response(JSON.stringify({ message: "Message sent" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({ message: "failed to send message" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
} 