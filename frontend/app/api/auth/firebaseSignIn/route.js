import { auth, db, signInWithEmailAndPassword } from "../../../firebase.js";
import validator from "validator";
import { doc, getDoc } from "firebase/firestore";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);


export async function POST(req,res ) {

    const body = await req.json();
    const email = validator.escape(body.email);
    const password = body.password;

    try {
        if (password.length < 8){
            return new Response(JSON.stringify({ message: "Password must be at least 8 symbols long with a special symbol and capital letter"}), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userInfo = await signInWithEmailAndPassword(auth, email, password);
        const id = userInfo.user.uid;
        const userDoc = await getDoc(doc(db, "users", id));
        if (!userDoc.exists()) {
            throw new Error("User not found in the database");
        }
        const { firstName, lastName } = userDoc.data();
        const token = await new SignJWT({id, firstName, lastName })
        .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);

        return new Response(JSON.stringify({ message: "User signed in" }), {
            status: 201,
            headers: { 
                "Content-Type": "application/json" ,
                "Set-Cookie": `session=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=604800`
            },
        });
    } catch (error) {
        console.error("Error signing in:", error.message);
        return new Response(JSON.stringify({ message: error.message}), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
