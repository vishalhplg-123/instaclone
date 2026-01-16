// import {createSlice} from "@reduxjs/toolkit";


// const chatSlice = createSlice({
//     name: "chat",
//     initialState:{
//         onlineUsers: [],
//         messages:[]
//     },
//     reducers:{
//         //action
//         setOnlineUsers:(state, action)=>{
//             state.onlineUsers = action.payload;
//         },
//         setMessages:(state, action)=>{
//             state.messages = action.payload;
//         },
        

//     }
// })
// export const {setOnlineUsers, setMessages} = chatSlice.actions
// export default chatSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    onlineUsers: []
  },
  reducers: {
    setMessages: (state, action) => {
      if (typeof action.payload === "function") {
        state.messages = action.payload(state.messages);
      } else {
        state.messages = action.payload;
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    }
  }
});

export const { setMessages, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;