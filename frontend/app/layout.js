import "./Global.css";
import Header from "./Components/Header/Header.js";

export default function RootLayout({ children }) {
    return (
        <>
            <Header /> 
            <main>{children}</main>
        </>
    );
}