import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "./socketContext";
import { useSelector } from "react-redux"

const SocketProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);

    const { isloggedIn, user } = useSelector(state=>state.auth)

    useEffect(()=>{

        if(!(isloggedIn && user)) return;

        const socketInstance = io("http://localhost:8080");

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    },[isloggedIn,user])

    return (
        <SocketContext value={socket}>
            {children}
        </SocketContext>
    )
}

export default SocketProvider;