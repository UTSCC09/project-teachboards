"use client";
import {useEffect} from "react";
import { useAuth } from "../Content/AuthContext";

export default function Status(){
    const {user} = useAuth();
    useEffect(()=>{
        if (!user || !user.id) return;
        const id = user.id;

        const sendStatus = async (status) =>{
            try{
                await fetch(`/api/status`,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id: id, status: status}), });
            } 
            catch(error){
                console.log("fail to send status check");
            }
        };
        let statusLoop;
        statusLoop = setInterval(()=> sendStatus("online"), 60000);
        sendStatus("online");
        const removeAll = () =>{
            clearInterval(statusLoop);
            sendStatus("offline");
        }
        const onTab = () => {
            if (document.visibilityState === "visible") {
                sendStatus("online");
            } else {
                sendStatus("busy");
            }
        };
        window.addEventListener("beforeunload", removeAll);
        document.addEventListener("visibilitychange", onTab);
        return () =>{
            clearInterval(statusLoop);
            sendStatus("offline");
            window.removeEventListener("beforeunload",removeAll);
            document.removeEventListener("visibilitychange", onTab);
        }
    },[user]);
}