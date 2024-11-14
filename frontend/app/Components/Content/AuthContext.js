"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const router = useRouter();

    const checkAuthStatus = async () => {
        const response = await fetch("/api/auth/verifySession", { method: "GET" });
        if (response.ok) {
            const data = await response.json();
            router.push("/home");
            setUser(data);
        } else {
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
        <AuthContext.Provider value={{ user, setUser, logout,checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
