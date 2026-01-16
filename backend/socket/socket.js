// import {Server} from 'socket.io';
// import express from 'express';
// import http from 'http';    
// import { disconnect } from 'cluster';



// const app= express();
// const server = http.createServer(app);


// const io = new Server(server, {                    // server object
//     cors:{
//         origin:'http://localhost:5173',
//         methods:['GET', 'POST']
//     }
// })

// const userSocketMap = {}; // this map stores id corresponding the user id; userId -> socketIo

// export const  getReceiverSocketId =(receiverId)=>userSocketMap[receiverId];

// io.on('connection', (socket)=>{
//     const userId = socket.handshake.query.userId;
//     console.log("Socket connected")
//     console.log("Handsake userid", userId)
//     if(userId){
//         userSocketMap[userId] = socket.id
      
//     }
//     console.log("current socket map", userSocketMap)
//     io.emit('getOnlineUsers', Object.keys(userSocketMap)) //getOnlineUsers ye event ka name dediya  or return sare onlineuser ko userSocketMap

//     socket.on('disconnect', ()=>{
//         if(userId){
//             console.log("socket disconnected", userId)
//             delete userSocketMap[userId];
//             console.log("Socket map after disconnect", userSocketMap)
//         }
//          io.emit('getOnlineUsers', Object.keys(userSocketMap))   //update kararana hai afyer delete ke bad
//     });

// })

// export {app, server, io}





import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };