import { doc, collection, getDoc, addDoc, updateDoc, query, where, arrayUnion, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebase.js";


export async function POST(req,{params}){
    const {id} = params;
    const body = await req.json();
    const chatName = body.chatName;
    const usernames = body.usernames; 
    const usernameList = usernames.split(" "); 
    if (!id || !usernameList.length === 0){
        return new Response(JSON.stringify({message:"bad id"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        })
    }
    try{
        const chatroomDoc = collection(db,"chatroom");
        const newChat = await addDoc(chatroomDoc,{
            chatName: chatName,
        })
        const chatID = newChat.id;
        const newchatDoc = doc(db,"chatroom",chatID);
        await updateDoc(newchatDoc,{
            chatID:chatID,
        })

        const userDoc = doc(db,"users",id);
        const userRes = await updateDoc(userDoc,{
            chatrooms: arrayUnion({chatID:chatID, chatName:chatName})
        });

        const updatePromises = usernameList.map(async (username) => {
            try{
            const name = username.toLowerCase();
            const userDoc = query(collection(db, "users"), where("username", "==", name));
            const userReturn = await getDocs(userDoc);
      
            if (!userReturn.empty) {
              const userDocRef = userReturn.docs[0].ref; 
              return updateDoc(userDocRef, {
                chatrooms: arrayUnion({chatID:chatID, chatName:chatName}),
              });
            } else {
              console.log(`User with username "${username}" not found.`);
              return Promise.resolve(); 
            }
            }catch (error) {
            console.error(`Error updating chatrooms for ${username}:`, error);
            }
          });
          await Promise.all(updatePromises);
          const returndata = [{chatID:chatID, chatName:chatName}];
          return new Response(JSON.stringify({returndata}),{
            status:200,
            headers:{"Content-Type":"application/json"},
        })
    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({message:"cannot create classrooms"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        })
    }
}