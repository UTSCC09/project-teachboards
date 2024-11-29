import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../../firebase.js";
import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import validator from "validator";
import { SignJWT } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req){
    const body = await req.json();
    const firstName = validator.escape(body.firstName);
    const lastName = validator.escape(body.lastName);
    const email = validator.escape(body.email);
    const password = body.password;
    const classrooms = [];
    const friends = {};
    const friendsPending= {};
    const chatrooms = [];
    const role = body.role;
    let username = validator.escape(body.username);
    console.log(username);
    const status = {statusactual:"online",statusPriority:1};

    
    try{
        username = username.toLowerCase();
        const userQuery = query((collection(db, "users")), where("username", "==", username));
        const existingUser = await getDocs(userQuery);

        if (!existingUser.empty){
            console.log("Username bad");
            return new Response(JSON.stringify({ message: "User exist" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        let userInfo = await createUserWithEmailAndPassword(auth,email,password);
        userInfo = await signInWithEmailAndPassword(auth, email, password);
        const id = userInfo.user.uid;
        await setDoc(doc(db,"users",id), {
            firstName,
            lastName,
            username,
            email,
            role,
            friends,
            friendsPending,
            status,
            classrooms,
            chatrooms,
            uid: id
        });
        const token = await new SignJWT({id, firstName, lastName})
        .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);
        return new Response(JSON.stringify({ message: "User signed in" }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                 "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
            },

        });
    }
    catch (error){
        console.error("Error signing in:", error.message);
        return new Response(JSON.stringify({ message: "User could not sign in" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

