import { db } from "../../../firebase.js";
import {updateDoc,doc, getDoc} from "firebase/firestore";
import validator from "validator";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function PATCH(req,{params}){
    const {id} = params;
    const body = await req.json();
    const firstName = validator.escape(body.firstName);
    const lastName = validator.escape(body.lastName);
    const email = validator.escape(body.email);

    if (!id){
        return new Response(JSON.stringify({message:"Id is invalid"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        });
    }

    try{
        const userDB = doc(db, "users", id);
        await updateDoc(userDB, {
            firstName: firstName,
            lastName: lastName,
            email: email,
        });
        const token = await new SignJWT({ id, firstName, lastName }).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);

        return new Response(JSON.stringify({message:"Successfully changed data"}),{
            status:200,
            headers:{"Content-Type":"application/json",
            "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
            },
        });
    }
    
    catch(error){
        console.log("error changing user detail");
        return new Response(JSON.stringify({message:"Failed to change users"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        });
    }
}


export async function GET(req, { params }) {
    const {id} = params;
    if (!id){
        return new Response(JSON.stringify({message:"Id is invalid"}),{
            status:400,
            headers:{"Content-Type":"application/json"},
        });
    }
    try{
        const userRef = doc(db,"users",id);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()){
            return new Response(JSON.stringify({message:"Id is invalid"}),{
                status:400,
                headers:{"Content-Type":"application/json"},
            });
        }
        const userData = userDoc.data();
        const userReturn = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
        };
        return new Response(JSON.stringify(userReturn),{
            status:200,
            headers:{"Content-Type":"application/json"},
        });
    }
    catch(error){
        console.log("error getting user detail");
        return new Response(JSON.stringify({message:"Failed to get users"}),{
            status:500,
            headers:{"Content-Type":"application/json"},
        });
    }
}