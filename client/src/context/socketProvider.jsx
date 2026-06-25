import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "./socketContext";
import { useSelector } from "react-redux"

const SocketProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);

    const { isLoggedIn, user } = useSelector(state=>state.auth)

    useEffect(()=>{

        if(!(isLoggedIn && user)) return;

        const socketInstance = io("http://localhost:8080");

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    },[isLoggedIn,user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;