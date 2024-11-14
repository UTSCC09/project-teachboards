import { auth, signInWithEmailAndPassword } from "../../../firebase.js";
import validator from "validator";

export async function POST(req) {
    const body = await req.json();
    const email = validator.escape(body.email);
    const password = body.password;

    try {
        const userInfo = await signInWithEmailAndPassword(auth, email, password);
        return new Response(JSON.stringify({ message: "User signed in" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error signing in:", error.message);
        return new Response(JSON.stringify({ message: "User could not sign in" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
