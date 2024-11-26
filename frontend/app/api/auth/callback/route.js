import { NextResponse } from "next/server.js";
import { OAuth2Client } from 'google-auth-library';
import { doc, updateDoc, setDoc, addDoc,collection, getDocs, query, where } from "firebase/firestore";
import {db } from "../../../firebase.js";
import { SignJWT } from "jose";

const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

//This code here was taken by chatgpt 
// The prompt was I have a next.js app how do I do the google OAUTH im really confused pls help is the best way using api calls or is the best way using the next js thing auth 
//However a picture was uploaded so I cannot upload the share the chat
export async function GET(request){
    try{
        const {searchParams} = new URL(request.url);
        const code = searchParams.get('code');
        if(!code) return NextResponse.json({error:"No code provided"},{status: 400});
        const client = new OAuth2Client(
            GOOGLE_CLIENTID, GOOGLE_SECRET, "https://petersyoo.com/api/auth/callback"
        );
        const {tokens} = await client.getToken(code);
        const idToken = tokens.id_token;
        const ticket = await client.verifyIdToken({idToken,audience: GOOGLE_CLIENTID, });
        const payload = ticket.getPayload();

//HERE IS THE STOP POINT 

        const firstName = payload.name.split(' ')[0];
        const lastName = payload.name.split(" ")[1];
        const email = payload.email;
        const username = email.split("@")[0];
        const classrooms = [];
        const friends = {};
        const friendsPending= {};
        const chatrooms = [];
        const role = "both";

        const userdoc = collection(db, "users");
        const userquery1 = query(userdoc, where("username", "==", username));
        const userquery2= query(userdoc, where('email',"==",email));
        const usercheck1 = await getDocs(userquery1);
        const usercheck2 = await getDocs(userquery2);

        if (!usercheck1.empty || !usercheck2.empty){
            const id = usercheck1.docs[0].id;
            const token = await new SignJWT({ id, firstName, lastName})
            .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);

            const response = NextResponse.redirect("https://petersyoo.com/home");
            response.cookies.set("session", token, {
                httpOnly: true,
                sameSite: "Strict",
                secure: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
    
            return response;
        }
        const userData = await addDoc(userdoc,{
            firstName,
            lastName,
            email,
            username,
            classrooms,
            friends,
            friendsPending,
            chatrooms,
            role,
        });
        const id = userData.id;
        await updateDoc(doc(db,"users",id),{
            uid:id,
        });

        const token = await new SignJWT({ id, firstName, lastName})
        .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);

        const response = NextResponse.redirect("https://petersyoo.com/home");
        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    }
    catch (error) {
        console.error("Error details:", error);
        return NextResponse.json(
            { error: { message: "failed doing oauth"} },
            { status: 500 }
        );
    }
}