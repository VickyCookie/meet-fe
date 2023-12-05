import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuid } from 'uuid'
import { Peer } from "peerjs";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = io('https://meet-app-be-zmj4.onrender.com/'); // Replace with your server URL
    const [me, setMe] = useState()
    useEffect(() => {
        // Cleanup the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        const newID = uuid()
        const peer = new Peer(newID)
        setMe(peer)
    }, [])



    return (
        <SocketContext.Provider value={{ socket, me }}>
            {children}
        </SocketContext.Provider>
    );
};
