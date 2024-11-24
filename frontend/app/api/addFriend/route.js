import { db } from "../../firebase.js";
import { doc, collection, updateDoc, query, where, getDocs, getDoc} from "firebase/firestore";
import validator from "validator";

export async function POST(req){
    const body = await req.json();
    const id = body.id;
    let username = validator.escape(body.newfriend);
    // still need to retrive the status from this 
    try {
        username = username.toLowerCase();
        const userQuery = query((collection(db,"users")),where("username", "==",username));
        const userExist = await getDocs(userQuery);
        if (userExist.empty){
            console.log("no user exist with that name");
            return new Response(JSON.stringify({ message: "User does not exist" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const otherId = userExist.docs[0].id;

        const myDb = doc(db, "users", id);
        const myInfo = await getDoc(myDb);
        const myData = myInfo.data();
        const myusername = myData.username;

        const otherDb = doc(db,"users",otherId);
        const otherInfo = await getDoc(otherDb);

        if (!otherInfo.exists()) {
            return new Response(JSON.stringify({ message: "Target user not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const otherData = otherInfo.data();
        const friendsPending = otherData.friendsPending || {};

        if (friendsPending[myusername]) {
            console.log("Friend request already sent");
            return new Response(JSON.stringify({ message: "Friend request already sent" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await updateDoc(otherDb, {
            [`friendsPending.${myusername}`]: myusername, 
        });
        return new Response(JSON.stringify({ message: "User added" }), {
            status: 201,
            headers: { "Content-Type": "application/json",   },
        });
    }
    catch(error){
        console.error("Error adding:", error.message);
        return new Response(JSON.stringify({ message: "User could not add" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}