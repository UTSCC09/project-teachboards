import React from 'react';
import './Global.css';
import Header from './Components/Header/Header'; 
import {AuthProvider} from "./Components/Content/AuthContext.js";
import Status from "./Components/status/Status.js";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Status></Status>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
