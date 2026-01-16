// import {createSlice} from "@reduxjs/toolkit"


// const authSlice = createSlice({
//     name : "auth",
//     initialistate:{
//         user: null

//     },
//     reducers:{
//         setAuthUser: (state, action)  =>{
//             state.user  = action.payload
//         }
//     }
// })
// export const {setAuthUser} = authSlice.actions
// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {     // MUST be initialState (correct spelling)
        user: null,
        suggestedUsers:[],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        }
        ,
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
       
    }
});

export const { setAuthUser, setSuggestedUsers , setUserProfile, setSelectedUser} = authSlice.actions;
export default authSlice.reducer;
