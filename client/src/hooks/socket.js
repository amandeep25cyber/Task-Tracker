import { useContext } from "react"
import { SocketContext } from "../context/socketContext"

const useSocket = ()=>{
    return useContext(SocketContext);
}

export { useSocket }