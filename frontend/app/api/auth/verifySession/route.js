import * as cookie from "cookie";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const sessionToken = cookies.session;
    if (!sessionToken) {
        return new Response({status: 200});
    }
    try {
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
        return new Response(JSON.stringify(payload), { status: 200 });
    } catch (error) {
        console.error("Invalid session:", error);
        return new Response(JSON.stringify({ message: "Invalid session" }), { status: 403 });
    }
}
