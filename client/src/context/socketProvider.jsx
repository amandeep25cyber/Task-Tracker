import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "./socketContext";

const SocketProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);

    useEffect(()=>{
        const socketInstance = io("http:localhost:8080");

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    },[])

    return (
        <SocketContext value={socket}>
            {children}
        </SocketContext>
    )
}

export default SocketProvider;