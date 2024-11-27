"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
// go the idea as well as some of the code from CHATGPT using the prompt,"" what does use AuthContext do and why is it important"
//sorry uploaded a picture earlier so I do not have access to sharing the logs 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 

    const checkAuthStatus = async () => {
        const response = await fetch("/api/auth/verifySession", { method: "GET" });
        if (response.ok) {
            const data = await response.json();
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
        <AuthContext.Provider value={{ user, setUser, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
