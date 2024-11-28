import { db } from "../../../firebase.js";
import { getDoc, doc} from "firebase/firestore";

import {Role, RTCTokenBuilder} from "agora-token/src"

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
        const token = await generateToken();
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


// ADAPTED SAMPLE CODE FROM agora-token/src/sample/RtcTokenBuilder2Sample

function generateToken() {
    import {RtcTokenBuilder, Role: RtcRole} from 'agora-token/src/RtcTokenBuilder'
    
    const appID = '970CA35de60c44645bbae8a215061b33'
    const appCertificate = '5CFd2fd1755d40ecb72977518be15d3b'
    const channelName = '7d72365eb983485397e3e3f9d460bdda'
    const uid = 2882341273
    const account = "2882341273"
    const role = RtcRole.PUBLISHER
    const expirationInSeconds = 3600

    const tokenExpirationInSecond = 3600
    const privilegeExpirationInSecond = 3600
    // Build token with uid
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, tokenExpirationInSecond, privilegeExpirationInSecond)
    console.log("Token with int uid: " + tokenA)

    // Build token with user account
    const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(appID, appCertificate, channelName, account, role, tokenExpirationInSecond, privilegeExpirationInSecond)
    console.log("Token with user account: " + tokenB)

    const tokenC = RtcTokenBuilder.buildTokenWithUidAndPrivilege(appID, appCertificate, channelName, uid,
        expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds)
    console.log("Token with int uid and privilege:" + tokenC)

    const tokenD = RtcTokenBuilder.BuildTokenWithUserAccountAndPrivilege(appID, appCertificate, channelName, account,
        expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds)
    console.log("Token with user account and privilege:" + tokenD)

}