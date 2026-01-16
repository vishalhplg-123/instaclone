// import axios from "axios";
// import {useEffect} from "react"
// import { useDispatch, useSelector } from "react-redux";

// import { setMessages } from "../redux/chatSlice";



// const useGetAllMessage = ()=>{
//     const dispatch = useDispatch();
//     const {selectedUser} = useSelector(store=>store.auth)
//     useEffect(()=>{
//         const fetchAllMessage = async () =>{
//             try {
//                 const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
//                 if(res.data.success){
//                     dispatch(setMessages(res.data.messages))
//                 }
                
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//          fetchAllMessage();
//     }, [selectedUser?._id])
// }

// export default useGetAllMessage;





import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/message/all/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data.messages));
    };

    fetchMessages();
  }, [selectedUser?._id]);
};

export default useGetAllMessage;