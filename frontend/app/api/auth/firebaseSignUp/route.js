import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import validator from "validator";

export async function POST(req){
    const body = await req.json();
    const firstName = validator.escape(body.firstName);
    const lastName = validator.escape(body.lastName);
    const email = validator.escape(body.email);
    const password = body.password;
    const role = body.role;
    
    try{
        const userInfo = await createUserWithEmailAndPassword(auth,email,password);
        const id = userInfo.user.uid;
        await setDoc(doc(db,"users",id), {
            firstName,
            lastName,
            email,
            role,
            uid: id
        });
        return new Response(JSON.stringify({ message: "User signed in" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
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

