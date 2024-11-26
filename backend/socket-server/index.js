import { Server } from "socket.io";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, getDocs, where, orderBy, collection, query, serverTimestamp} from 'firebase/firestore';
import validator from "validator";

const apiKey = process.env.apiKey;

const firebaseConfig = {
    apiKey: `${apiKey}`,
    authDomain: "teachboards.firebaseapp.com",
    projectId: "teachboards",
    storageBucket: "teachboards.firebasestorage.app",
    messagingSenderId: "592752228990",
    appId: "1:592752228990:web:c666b6733e5ff8d1ccb62f",
    measurementId: "G-7Z7449S4Z5"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = getFirestore(app);

//
export function socketStuff(io){
  io.on("connection",(socket)=>{
    console.log("Users just connected");
    //this is for initializing the message
    socket.on("retrived-message", async(data)=>{
      try{
        const chatID= data;
        const messageRef = collection(db, "chatroom", chatID, "messages");
        const messageQuery = query(messageRef, orderBy("dateSent", "asc"));
        const messages = await getDocs(messageQuery);
        const messageReturn = [];
        messages.forEach((doc) =>{
          const data = doc.data();
          messageReturn.push({
            id: doc.id,
            dateSent: data.dateSent || "",
            messageText: data.messageText || "",
            messageSender: data.messageSender || "Unknown Sender",
          });
        });
        socket.emit("retrived-messages",{messageReturn});
        socket.join(chatID);
      }
      catch(error){
        socket.emit("retrived-error",{message:"Bad id"});
      }
    });


    //this is for storing message back into the database 
    socket.on("send-message", async(data) =>{
      const {chatID} = data;
      if(!chatID || !data.messageSender || !data.messageText){
        socket.emit("send-error",{message:"Cannot save message"});
        return;
      }
      const messageText = validator.escape(data.messageText);
      try{
        const messageRef = collection(db,"chatroom", chatID, "messages");
        await addDoc(messageRef,{
          dateSent: new Date(),
          messageText: messageText,
          messageSender: data.messageSender,
        });
        console.log("sending message to ", chatID);
        socket.to(chatID).emit("receive-message", { messageText:messageText, messageSender: data.messageSender});
      }
      catch(error){
        console.error(error);
        socket.emit("send-error",{message:"Cannot save message"});
      }
    });
    //disconnecting 
    socket.on("disconnect", () =>{
      console.log("user disconnected", socket.id);
    });
  });
} 
// Function to start the server
export function createServer(port, corsOptions) {
    return new Server(port, {
      cors: corsOptions,
    });
}

export function startServer() {
  const PORT = 4000;
  const corsOptions = {
    origin: "https://petersyoo.com", 
    methods: ["GET", "POST"],
  };

  const io = createServer(PORT, corsOptions);
  socketStuff(io);

  console.log(`Socket.IO server running on http://localhost:${PORT}`);
}

startServer();
