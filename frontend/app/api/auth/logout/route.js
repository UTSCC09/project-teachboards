import { auth } from "../../../firebase.js";
import { signOut } from "firebase/auth";

export async function POST(req, res) {
    try {
        await signOut(auth);
        return new Response(JSON.stringify({ message: "User logged out successfully" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
            },
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return new Response(JSON.stringify({ message: "Error logging out" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
