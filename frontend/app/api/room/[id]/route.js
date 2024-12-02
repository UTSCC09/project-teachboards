import { db } from "@app/api/firebase.js";
import { getDoc, doc, collection, query, where, getDocs} from "firebase/firestore";

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

        
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("channelName", "==", roomID));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return new Response(JSON.stringify({ message: "could not find room with that ID" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }); 
        }
        // NOW WE KNOW THE ROOM EXISTS
        const roomDoc = querySnapshot.docs[0];
        const roomData = roomDoc.data();

        if(roomData.active === false) {
            // TODO set it to true n stuff 
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

        // token.js shenanigans below.
        // hardcode manual token for "main" channel ONLY for now
        const {token, rtmToken, uid} = await generateToken({
            channelName: roomID,
        });
        return new Response(JSON.stringify({token, rtmToken, uid}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        

    } catch (error) {
        console.error("error in the tkoen things:", error.message);
        return new Response(JSON.stringify({ message: "Error somewhere" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}


// ADAPTED SAMPLE CODE FROM agora-token/src/sample/RtcTokenBuilderSample2.js

// const expirationInSeconds = 3600

// const tokenExpirationInSecond = 3600
// const privilegeExpirationInSecond = 3600
// // Build token with uid
// const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, tokenExpirationInSecond, privilegeExpirationInSecond)
// console.log("Token with int uid: " + tokenA)

// // Build token with user account
// const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(appId, appCertificate, channelName, account, role, tokenExpirationInSecond, privilegeExpirationInSecond)
// console.log("Token with user account: " + tokenB)

// const tokenC = RtcTokenBuilder.buildTokenWithUidAndPrivilege(appId, appCertificate, channelName, uid,
//     expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds)
// console.log("Token with int uid and privilege:" + tokenC)

// const tokenD = RtcTokenBuilder.BuildTokenWithUserAccountAndPrivilege(appId, appCertificate, channelName, account,
//     expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds, expirationInSeconds)
// console.log("Token with user account and privilege:" + tokenD)


import {RtcTokenBuilder, Role} from 'agora-token/src/RtcTokenBuilder2'
import { RtmTokenBuilder } from "agora-token/src/RtmTokenBuilder2";
import {randomBytes} from 'crypto';


async function generateToken({channelName}) {

    if (!channelName) return console.log("no channel name provided");
    console.log(channelName);
    
    const appId = '5b04cf1dad0645189bd6533cef7c2158';
    const appCertificate = 'bbfcf7ddf67e4644a8e2da2ae7f5a452';
    const role = Role.PUBLISHER;

    // randomly generate a UID for this token
    const byteArray = randomBytes(4);
    const uid = byteArray.readUInt32BE(0);

    const tokenExpirationInSecond = 3600
    const privilegeExpirationInSecond = 3600
    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, tokenExpirationInSecond, privilegeExpirationInSecond)
    console.log("RTC Token With Integer Number Uid and privilege: " + token);
    console.log("uid:"+uid);
    console.log("channelname: "+channelName)

    const stringUid = uid.toString();
    const expirationInSeconds = 3600;

    const rtmToken = RtmTokenBuilder.buildToken(appId, appCertificate, stringUid, expirationInSeconds);
    console.log("Rtm Token: " + rtmToken);
    console.log("stringUid: "+stringUid)

    return {token, rtmToken, uid};
}