import {NextResponse} from 'next/server';

//THIS CODE HERE IS FROM CHATGPT 
//THIS WAS THE PROMPT 
//I have a next.js app how do I do the google OAUTH im really confused pls help is the best way using api calls or is the best way using the next js thing auth 
//uploaded a picture so i cannot get the prompt 

const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

const NEXTAUTH_URL = "https://petersyoo.com";

export async function GET(){
    const googleURL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = new URLSearchParams({
        client_id:GOOGLE_CLIENTID,
        redirect_uri: `https://petersyoo.com/api/auth/callback`,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
    });
    return NextResponse.redirect(`${googleURL}?${options.toString()}`);
}

























