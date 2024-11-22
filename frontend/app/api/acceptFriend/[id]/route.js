import { db } from "../../../firebase.js";
import { doc, collection, updateDoc, query, where, getDocs, deleteField, getDoc} from "firebase/firestore";



export async function PATCH(req, { params }){
    const body = await req.json();
    const {id} = params;
    let otherUsername = body.username;

    try{
        otherUsername = otherUsername.toLowerCase();
        const userQuery = query((collection(db,"users")),where("username", "==", otherUsername));
        const userExist = await getDocs(userQuery);

        if (userExist.empty || !userExist.docs[0]){
            console.log("no user exist with that name");
            return new Response(JSON.stringify({ message: "User does not exist" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const otherId = userExist.docs[0].id;
        const userDoc = doc(db,"users",id);
        const userInfo = await getDoc(userDoc);
        if (!userInfo){
            return new Response(JSON.stringify({ message: "ERROR" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userData = userInfo.data();
        const username = userData.username;

        await updateDoc(userDoc, {
            [`friendsPending.${otherUsername}`]: deleteField(),
            [`friends.${otherUsername}`]:  otherUsername,
        });

        const otherdoc = doc(db,"users",otherId);
        await updateDoc(otherdoc,{
            [`friends.${username}`]:username,
        });

        return new Response(JSON.stringify({message:"accepted username"}),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });
        
    }
    catch(error){
        console.log("ERROR ACCEPING USER")
        return new Response(JSON.stringify({ message: "ERROR" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}