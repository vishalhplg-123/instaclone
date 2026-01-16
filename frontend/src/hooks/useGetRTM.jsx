// import {useEffect} from "react"
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../redux/chatSlice";



// const useGetRTM = ()=>{
//     const dispatch = useDispatch();
//     const {socket} = useSelector(store=>store.socketio)
//     const {messages} = useSelector(store=>store.chat)
//     useEffect(()=>{
//         socket?.on('newMessage', (newMessage)=>{
//             dispatch(setMessages([...messages, newMessage]))
//         })
//         //agar koi chorke  jaye to naya message add na ho
//         return ()=>{
//             socket?.off('newMessage')
//         }
//     }, [messages,  setMessages, socket])
// }

// export default useGetRTM;




import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((s) => s.socketio);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      dispatch(setMessages((prev) => [...prev, msg]));
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [socket, dispatch]);
};

export default useGetRTM;

