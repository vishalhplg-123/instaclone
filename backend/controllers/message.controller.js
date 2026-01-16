// import { Conversatiom } from "../models/conversation.model.js";
// import { Message } from "../models/message.models.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";

// //for chating
// export const sendMessage = async (req, res)=>{
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;
//         const {textMessage:message} =req.body;

//         let conversation = await Conversatiom.findOne({
//             participants: {$all:[senderId, receiverId]}
//         });
//         //establish the conversation if not started yet.
//         if(!conversation){
//             conversation = await Conversatiom.create({
//                participants: [senderId, receiverId]
//             })
//         }
//         const newMessage = await Message.create({
//             senderId,
//             receiverId,
//             message
//         });
//         if(newMessage) conversation.messages.push(newMessage._id);

//         await Promise.all([conversation.save(), newMessage.save()])

//         //implement socket io for real time data transfer
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit('newMessage', newMessage);
//         }

//         return res.status(201).json({
//             success: true,
//             newMessage
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// export const getMessage = async (req, res)=>{
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;
//         const conversation = await Conversatiom.findOne({
//             participants:{$all: [senderId, receiverId]}
//         }).populate('messages');
//         if(!conversation) return res.status(200).json({success:true, messages:[]});

//         return res.status(200).json({success:true, messages:conversation?.messages});

//     } catch (error) {
//         console.log(error);
//     }
// }



import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: []
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: textMessage
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    res.json({
      success: true,
      messages: conversation ? conversation.messages : []
    });
  } catch (error) {
    console.log(error);
  }
};
