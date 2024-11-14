"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const checkAuthStatus = async () => {
        const response = await fetch("/api/auth/verifySession", { method: "GET" });
        if (response.ok) {
            const data = await response.json();
            setUser(data);
        } else {
            console.log("No session");
            setUser(null); 
        }
    };
    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
    };
    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
