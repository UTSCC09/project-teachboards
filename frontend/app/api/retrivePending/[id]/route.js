import { db } from "../../../firebase.js";
import { getDoc, doc} from "firebase/firestore";

export async function GET(req, { params }) {
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ message: "ID is invalid, please try again" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const userDb = doc(db, "users", id);
        const userInfo = await getDoc(userDb);

        if (!userInfo.exists()) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const userData = userInfo.data();
        const pending = userData.friendsPending || {};
        const friendsUsername = Object.keys(pending);
        return new Response(JSON.stringify({friendsUsername}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error retrieving friends with status:", error.message);
        return new Response(JSON.stringify({ message: "Error retrieving friends with status" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
