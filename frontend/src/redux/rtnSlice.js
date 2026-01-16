// import {createSlice} from '@reduxjs/toolkit'

// const rtnSlice = createSlice({
//     name: 'realTimeNotification',
//     initialState:{
//         likeNotification: [],
//     },
//     reducers:{
//         // setLikeNotification: (state, action)=>{
//         //     if(action.payload.type === 'like'){
//         //          state.likeNotification.push(action.payload);
//         //     }else if(action.payload.type === 'dislike'){
//         //         state.likeNotification = state.likeNotification.filter((item)=>item.userId !== action.payload.userId);
//         //     }
//             setLikeNotification: (state, action) => {
//   if (action.payload.type === "like") {
//     const exists = state.likeNotification.find(
//       n => n.userId === action.payload.userId && n.postId === action.payload.postId
//     );
//     if (!exists) {
//       state.likeNotification.unshift(action.payload);
//     }
//   }

//   if (action.payload.type === "dislike") {
//     state.likeNotification = state.likeNotification.filter(
//       n => n.userId !== action.payload.userId
//     );
//   }
// };
//   }
// });
// export const {setLikeNotification} = rtnSlice.actions;
// export default rtnSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        const exists = state.likeNotification.find(
          (n) =>
            n.userId === action.payload.userId &&
            n.postId === action.payload.postId
        );

        if (!exists) {
          state.likeNotification.unshift(action.payload);
        }
      }

      if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (n) => n.userId !== action.payload.userId
        );
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;




