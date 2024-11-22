import { db } from "../../../firebase.js";
import { getDoc, doc,getDocs, query, collection, where } from "firebase/firestore";

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
        const friends = userData.friends || {};
        const friendsUsername = Object.keys(friends);

            //THIS MIDDLE SECTION HERE IS A CHATGPT, again this chat has included images so i cant share my log, however the prompt i used was 
            // How do i now given the username of my friends query through them and retrived their status...

        const friendsWithStatus = await Promise.all(
            friendsUsername.map(async (username) => {
                const friendQuery = query(collection(db, "users"), where("username", "==", username));
                const friendSnapshot = await getDocs(friendQuery);

                if (!friendSnapshot.empty) {
                    const friendData = friendSnapshot.docs[0].data();
                    return { username, status: friendData.status };
                }
                return { username, status: "offline" };
            })
        );
        return new Response(JSON.stringify({ friendsWithStatus }), {
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
