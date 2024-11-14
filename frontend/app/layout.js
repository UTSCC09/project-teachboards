// app/layout.js
import React from 'react';
import './Global.css';
import Header from './Components/Header/Header'; // Adjust import if necessary
import {AuthProvider} from "./Components/Content/AuthContext.js";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
