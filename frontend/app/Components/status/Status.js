"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "../Content/AuthContext";

export default function Status() {
    const { user } = useAuth();
    const statusLoopRef = useRef(null); 
    const tabActiveRef = useRef(true);
    useEffect(() => {
        if (!user || !user.id) return;
        const id = user.id;

        const sendStatus = async (status) => {
            try {
                await fetch(`/api/status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: id, status: status }),
                });
            } catch (error) {
                console.log("Failed to send status check");
            }
        };
        const startloop = () => {
            if (!statusLoopRef.current) {
                sendStatus("online");
                statusLoopRef.current = setInterval(() => sendStatus("online"), 60000);
            }
        };
        const stopLoop = () => {
            if (statusLoopRef.current) {
                clearInterval(statusLoopRef.current);
                statusLoopRef.current = null;
            }
        };
        const onTab = () => {
            if (document.visibilityState === "visible") {
                if (!tabActiveRef.current) {
                    tabActiveRef.current = true; 
                    startloop();
                }
            } else if (document.visibilityState === "hidden") {
                if (tabActiveRef.current) {
                    tabActiveRef.current = false; 
                    stopLoop();
                    sendStatus("busy");
                }
            }
        };
        const removeAll = () =>{
            stopLoop();
            statusLoopRef.current = null;
            sendStatus("offline");
        }
        startloop();
        window.addEventListener("beforeunload", removeAll);
        document.addEventListener("visibilitychange", onTab);

        return () => {
            stopLoop();
            removeAll();
            sendStatus("offline");
            window.removeEventListener("beforeunload", removeAll);
            document.removeEventListener("visibilitychange", onTab);
        };
    }, [user]);
}
