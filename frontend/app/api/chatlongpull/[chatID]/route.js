
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.js";



export async function GET(req, {params}){
    const {chatID} = params;
    if (!chatID){
        return new Response(JSON.stringify({message:"FAILED TO CONNECT"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        });
    }

    try{
        const messagesRef = collection(db,"chatroom",chatID, "messages");
        const messagesquery = query(messagesRef, orderBy("dateSent", "asc"));
        const messages = await getDocs(messagesquery);
        const messagereturn = [];
  

        messages.forEach((doc) => {
          const data = doc.data();
          messagereturn.push({
            id: doc.id,
            dateSent: data.dateSent || "Unknown Date",
            messageText: data.messageText || "No Text",
            messageSender: data.messageSender || "Unknown Sender",
          });
        });
        if (messagereturn.length ===0){
            messagereturn.push({id:"system-welcome",dateSent: new Date().toISOString(),messageText:"Welcome",messageSender:"System"})
        }
       return new Response(JSON.stringify({messagereturn:messagereturn || []}),{
            status:200,
            headers:{"Content-Type":"application/json"},
       });
    
    }
    catch(error){
        return new Response(JSON.stringify({message:"FAILED TO CONNECT",error:error.message}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        });
    }

}