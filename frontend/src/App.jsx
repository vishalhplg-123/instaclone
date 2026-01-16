
import Signup from "./components/Signup"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from "./components/Login"
import MainLayout from "./components/MainLayout"
import Home from "./components/Home"
import Profile from "./components/Profile"
import EditProfile from "./components/EditProfile"
import ChatPage from "./components/ChatPage"
import {io} from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { connectSocket , disconnectSocket} from "./socket";



const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes> ,
    children: [
       {
           path:'/',
           element:<ProtectedRoutes><Home/></ProtectedRoutes> 
       },
       {
           path:'/profile/:id',
           element: <ProtectedRoutes><Profile/></ProtectedRoutes>  
       },
       {
           path:'/account/edit',
           element: <ProtectedRoutes><EditProfile/></ProtectedRoutes> 
       
       },
       {
           path:'/chat',
           element: <ProtectedRoutes><ChatPage/></ProtectedRoutes> 
       }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
])

function App() {
  const {user} = useSelector(store=>store.auth)
 // const { socket} = useSelector(store=>store.socketio)
  const dispatch = useDispatch()
  
  // useEffect(()=>{
  //   if(user){
  //     const socketio = io('http://localhost:8000', {           // backend socketio se connect horaha hai
  //       query:{                              // query me userId send horaha hai
  //         userId: user?._id
  //       },
  //       transports:['websocket', 'polling']    //multiple api call ko stop karegi
  //       ,
  //       withCredentials:true
  //     });
  //     dispatch(setSocket(socketio)); 
  //     console.log("Socket connected", socketio.connected)

  //     //listen all the events
  //     socketio.on('getOnlineUsers', (onlineUsers)=>{
  //       dispatch(setOnlineUsers(onlineUsers));
  //     });

  //     socketio.on('notification', (notification)=>{
  //       console.log("Notification received", notification)
  //       dispatch(setLikeNotification(notification));
  //     })
      
  //     //clean karana hai jab user cut kare app page ko ya chor ke chala gaye
  //     return () =>{
  //       socketio.close();
  //       dispatch(setSocket(null))
  //     }

  //   }else if(socket){
  //       socket.close();
  //       dispatch(setSocket(null))
  //   }
  // },[user, dispatch]);

  //   useEffect(() => {
  //   if (user) {
  //     const socketio = io('http://localhost:8000', {
  //       query: {
  //         userId: user?._id
  //       },
  //       transports: ['websocket']
  //     });
  //     dispatch(setSocket(socketio));
  //     console.log("Socket connected", socketio.connected)

  //     // listen all the events
  //     socketio.on('getOnlineUsers', (onlineUsers) => {
  //       dispatch(setOnlineUsers(onlineUsers));
  //     });

  //     socketio.on('notification', (notification) => {
  //       dispatch(setLikeNotification(notification));
  //     });

  //     return () => {
  //       socketio.close();
  //       dispatch(setSocket(null));
  //     }
  //   } else if (socket) {
  //     socket.close();
  //     dispatch(setSocket(null));
  //   }
  // }, [user, dispatch]);

    
// useEffect(() => {
//   if (!user?._id) return;

//   const socket = connectSocket(user._id);

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//   });

//   socket.on("getOnlineUsers", (users) => {
//     dispatch(setOnlineUsers(users));
//   });

//   socket.on("notification", (notification) => {
//     console.log("Notification received:", notification);
//     dispatch(setLikeNotification(notification));
//   });

//   return () => {
//     socket.off("getOnlineUsers");
//     socket.off("notification");
//     disconnectSocket();
//   };
      
// }, [user?._id]);


useEffect(() => {
  if (!user?._id) return;

  const socket = connectSocket(user._id);

  // 🔥 THIS LINE WAS MISSING
  dispatch(setSocket(socket));

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("getOnlineUsers", (users) => {
    dispatch(setOnlineUsers(users));
  });

  socket.on("notification", (notification) => {
    dispatch(setLikeNotification(notification));
  });

  return () => {
    socket.off("getOnlineUsers");
    socket.off("notification");
    socket.disconnect();
    dispatch(setSocket(null));
  };
}, [user?._id, dispatch]);
 

  return (
   <>
     <RouterProvider router={browserRouter}/>
   </>
  )
}

export default App