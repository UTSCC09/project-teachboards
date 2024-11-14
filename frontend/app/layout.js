// app/layout.js
import React from 'react';
import './Global.css';
import Header from './Components/Header/Header'; // Adjust import if necessary

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                <main>{children}</main>
            </body>
        </html>
    );
}
