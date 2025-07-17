import { io,Socket } from "socket.io-client";
import env from "./env";

let socket: Socket | null = null;
export const getSocket=()=>{
    if(!socket){
        socket=io(env.BACKEND_URL,{autoConnect:false})
    }
    return socket;
}