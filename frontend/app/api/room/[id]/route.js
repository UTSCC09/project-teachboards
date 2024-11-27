import { db } from "../../../firebase.js";
import { getDoc, doc} from "firebase/firestore";

// grants access token for a room given its ID
export async function GET(req, {params}) {
    const roomID = params.id;
    if (!roomID) {
        return new Response(JSON.stringify({ message: "invalid or missing room ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const roomRef = doc(db, "rooms", roomID);
        const roomDoc = await getDoc(roomRef);

        if (!roomDoc.exists()) {
            return new Response(JSON.stringify({ message: "Room with ID " + roomID + " not found or permission denied" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // TODO
        // NEED SOMETHING HERE TO CHECK IF YOU ARE ALLOWED TO ACCESS THE ROOM (classroom stuff)
        // if ("bad user") {
        //     return new Response(JSON.stringify({ message: "Room with ID " + roomID + " not found or permission denied" }), {
        //         status: 404,
        //         headers: { "Content-Type": "application/json" },
        //     });
        // }

        // Now we need to generate a token for the user in the channel of the room
        const channelName = roomDoc.channelName;
        if (!channelName) {
            return new Response(JSON.stringify({ message: "VERY BAD ERROR roomdoc "+roomDoc.id+"IS MISSING CHANNELNAME"}), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        // TODO
        // token.js shenanigans below.
        // hardcode manual token for "main" channel ONLY for now
        const token = "007eJxTYDCMe/yNa7sc+6UNxy5KPzG88qe5Jt9qQnPsO6vXAZEfzmUoMJgmGZgkpxmmJKYYmJmYGlpYJqWYmRobJ6emmScbGZpaSM53S28IZGTYta6cmZEBAkF8FobcxMw8BgYAzsAg+A==";

        return new Response(JSON.stringify({token}), {
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