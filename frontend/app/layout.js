import React from 'react';
import './Global.css';
import Header from './Components/Header/Header'; 
import {AuthProvider} from "./Components/Content/AuthContext.js";
import {AllCalls} from "./Components/Content/AllCalls.js";
import Status from "./Components/status/Status.js";
import creditPage from "./credits/page.js";
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <AllCalls>
                        <Status></Status>
                        <Header />
                        {children}
                    </AllCalls>
                </AuthProvider>
            </body>
        </html>
    );
}
