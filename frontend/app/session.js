import session from "express-session";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const sessionMiddlewear = session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
});