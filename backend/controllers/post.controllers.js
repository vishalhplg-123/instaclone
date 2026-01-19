import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import DatauriParser from "datauri/parser.js";
import { Comment } from "../models/comments.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 89 })
      .toBuffer();

    //buffer to data uri
    // const fileuri = `data:image/jpeg:base64, ${optimizedImageBuffer.toString('base64')}`;
    // const cloudResponse = await cloudinary.uploader.upload(fileuri);

    const parser = new DatauriParser();
    const fileUri = parser.format(".jpeg", optimizedImageBuffer).content;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "New post addded",
      post,
      success: true,
    });
  } catch (error) {
    console.error("Add post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username  profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {}
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {}
};

// export const likePost = async (req, res) => {
//   try {
//     const likekrneWalaUserKiId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post)
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });

//     //like logic stared
//     await post.updateOne({ $addToSet: { likes: likekrneWalaUserKiId } });
//     await post.save();

//     //implement socket io  for real time notifaication
//     const user = await User.findById(likekrneWalaUserKiId).select('username profilePicture')
//     const postOwnerId = post.author.toString();
//     if(postOwnerId !== likekrneWalaUserKiId){
//       // emit a notification event
//       const notification ={
//         type: 'like',
//         userId: likekrneWalaUserKiId,
//         userDetails:user,
//         postId,
//         message: "Your post was liked"
//       }

//       const postOwnerSocketId = getReceiverSocketId(postOwnerId);
//       io.to(postOwnerSocketId).emit('notification' , notification)
//     }

//     return res.status(200).json({ message: "Post liked", success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await post.updateOne({ $addToSet: { likes: userId } });

    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {
      const user = await User.findById(userId).select(
        "username profilePicture"
      );

      const notification = {
        type: "like",
        userId,
        userDetails: user,
        postId,
        message: "Your post was liked",
    
      };

      const receiverSocketId = getReceiverSocketId(postOwnerId);

      // const postOwnerSocketId = getReceiverSocketId(postOwnerId);

      // if (postOwnerSocketId) {
      //   io.to(postOwnerSocketId).emit("notification", notification);
      // } else {
      //   console.log("Post owner offline, socket not found");
      // }

      console.log("Notification:", notification);
      console.log("Receiver socket:", receiverSocketId);

      if(receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification);
      }
    }

    return res.status(200).json({ success: true, message: "Post liked" });
  } catch (error) {
    console.log("Like post error:", error);
    return res.status(500).json({ success: false });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likekrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    //like logic stared
    await post.updateOne({ $pull: { likes: likekrneWalaUserKiId } });
    await post.save();

    //omplement socket io  for real time notifaication
    const user = await User.findById(likekrneWalaUserKiId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likekrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likekrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was disLiked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      // io.to(postOwnerSocketId).emit("notification", notification);
      if(postOwnerSocketId) {
             io.to(postOwnerSocketId).emit("notification", notification);
       }
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

// export const addComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const commentkrneWalaUserkiId = req.id;
//     const { text } = req.body;

//     const post = await Post.findById(postId);
//     if (!text)
//       return res
//         .status(400)
//         .json({ message: "text is required", success: false });

//     const comment = await Comment.create({
//       text,
//       author: commentkrneWalaUserkiId,
//       post: postId,
//     })
//     await comment.populate({
//       path: "author",
//       select: "username profilePicture",
//     });
//     post.comments.push(comment._id);
//     await post.save();

//     return res.status(200).json({
//       message: "Comment Added",
//       comment,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const addComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const commentkrneWalaUserkiId = req.id;
//     const { text } = req.body;

//     if (!text)
//       return res.status(400).json({ message: "Text is required", success: false });

//     const post = await Post.findById(postId);
//     if (!post)
//       return res.status(404).json({ message: "Post not found", success: false });

//     // Comment create karo
//     const comment = await Comment.create({
//       text,
//       author: commentkrneWalaUserkiId,
//       post: postId,
//     });

//     // Author populate karo
//     await comment.populate("author", "username profilePicture");

//     // Comment id post ke comments array me push karo
//     post.comments.push(comment._id);
//     await post.save();

//     // Latest post populate kar ke bhejo
//     const updatedPost = await Post.findById(postId)
//       .populate("author", "username profilePicture")
//       .populate({
//         path: "comments",
//         populate: { path: "author", select: "username profilePicture" },
//       });

//     return res.status(200).json({
//       message: "Comment Added",
//       comment: updatedPost.comments[updatedPost.comments.length - 1], // latest comment
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server error", success: false });
//   }
// };

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentedOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username  profilePicture"
    );
    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorid = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not fopund", success: false });

    //check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorid)
      return res.status(403).json({ message: "Unauthorized" });

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user's post
    let user = await User.findById(authorid);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post delete",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const autherId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found ", success: false });

    const user = await User.findById(autherId);
    if (user.bookmarks.includes(post._id)) {
      //already boookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "post removed from bookmark",
        success: true,
      });
    } else {
      //bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "post bookmark", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;

    console.log("FILE:", file);
    console.log("USER ID:", req.id);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const fileUri = getDataUri(file);

    const cloudRes = await cloudinary.uploader.upload(fileUri);

    const newPost = await Post.create({
      caption,
      image: cloudRes.secure_url,
      author: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Add post error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: error.message,
    });
  }
};
