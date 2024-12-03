"use client";
import React, { Children, createContext, useContext, useEffect, useState } from "react";

const alldata = createContext();

export const AllCalls = ({children}) =>{
    const [friends, setFriends] = useState([]);
    const [friendsPending, setfriendsPending] = useState([]);

    return(
        <alldata.Provider value ={{friends, setFriends, friendsPending, setfriendsPending}}>
            {children}
        </alldata.Provider>
    )
}


export const getData = () => useContext(alldata);