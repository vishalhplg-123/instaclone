// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import express from "express";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";
// import { Post } from "../models/post.model.js";
   
// export const register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(401).json({
//         message: "Something is missing, please check!",
//         success: false,
//       });
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(401).json({
//         message: "Try diffferent email",
//         success: false,
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     return res.status(201).json({
//       message: "Account created successfully!",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // // export const register = async (req, res) => {
// // //   try {
// // //     console.log("📥 Register route hit");

// // //     const { username, email, password } = req.body;
// // //     console.log("➡️ Incoming data:", req.body);

// // //     if (!username || !email || !password) {
// // //       console.warn("⚠️ Missing fields");
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "All fields are required",
// // //       });
// // //     }

// // //     const existingUser = await User.findOne({ email });

// // //     if (existingUser) {
// // //       console.warn("⚠️ Email already in use");
// // //       return res.status(409).json({
// // //         success: false,
// // //         message: "Email is already registered. Try logging in.",
// // //       });
// // //     }

// // //     const hashedPassword = await bcrypt.hash(password, 10);

// // //     const newUser = await User.create({
// // //       username,
// // //       email,
// // //       password: hashedPassword,
// // //     });

// // //     console.log("✅ User registered:", newUser._id);

// // //     return res.status(201).json({
// // //       success: true,
// // //       message: "User registered successfully!",
// // //       userId: newUser._id,
// // //     });

// // //   } catch (error) {
// // //     console.error("❌ Error in register:", error.message);
// // //     return res.status(500).json({
// // //       success: false,
// // //       message: "Something went wrong. Please try again later.",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // export const login =async (req, res)=>{
// // //     try {
// // //         const {email, password} = req.body;
// // //         if( !email || !password){
// // //           return res.status(401).json({
// // //           message: "!",
// // //           success: false
// // //           });
// // //         }

// // //          const user = await User.findOne({email});
// // //          if(!user){
// // //             return res.status(401).json({
// // //             message: "Try diffferent email",
// // //             success: false
// // //             });
// // //           }

// // //           const isPasswordMatch = await bcrypt.compare(password, user.password)
// // //           if(isPasswordMatch){
// // //              return res.status(401).json({
// // //              message: "incorrect email or password",
// // //              success: false
// // //           });
// // //           }
// // //           userInfo ={
// // //             _id:user._id,
// // //             username:user.username,
// // //             profilePicture:user.profilePicture,
// // //             bio:user.bio,
// // //             followers:user.followers,
// // //             following:user.following,
// // //             posts:user.posts

// // //           }

// // //           const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
// // //           return res.cookie('token', token, {httpOnly:true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({
// // //             message: `Welcome back ${user.username}`,
// // //             success:true,
// // //             user: userInfo
// // //           });

// // //     } catch (error) {
// // //         console.log(error);
// // //     }
// // // }

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//         success: false,
//       });
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (!isPasswordMatch) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }

//     // Prepare user data to return (excluding password)
//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     //  //populate each post if in the posts array
//     // const populatedPosts = await Promise.all(
//     //   userInfo.posts.map(async (postId) =>{
//     //     const post =  await Post.findById(postId);
//     //     if(post.author.equals(user._id)){
//     //       return post;
//     //     }
//     //     return null;
//     //   })
//     // )

// //     const userInfo = {
// //       _id: user._id,
// //       username: user.username,
// //       profilePicture: user.profilePicture,
// //       bio: user.bio,
// //       followers: user.followers,
// //       following: user.following,
// //       // posts: populatedPosts
// //     };

// //     // return res
// //     //   .cookie("token", token, {
// //     //     httpOnly: true,
// //     //     sameSite: "strict",
// //     //     maxAge: 24 * 60 * 60 * 1000 // 1 day
// //     //   })
// //     return res
// //       .cookie("token", token, {
// //         httpOnly: true,
// //         secure: false, // localhost
// //         sameSite: "lax", // 🔥 FIX
// //         maxAge: 24 * 60 * 60 * 1000,
// //       })
// //       .status(200)
// //       .json({
// //         message: `Welcome back, ${user.username}`,
// //         success: true,
// //         user: userInfo,
// //       });
// //   } catch (error) {
// //     console.error("Login error:", error.message);
// //     return res.status(500).json({
// //       message: "Something went wrong",
// //       success: false,
// //       error: error.message,
// //     });
// //   }
// // };

// export const logout = async (_, res) => {
//   try {
//     return res.cookie("token", "", { maxAge: 0 }).json({
//       message: "Logged out successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     let user = await User.findById(userId).select("-password");
//     return res.status(200).json({
//       user,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // // export const editProfile = async (req, res)=>{
// // //   try {
// // //     const userId = req.id;
// // //     const {bio, gender} = req.body;
// // //     const profilePicture = req.file;
// // //     let cloudResponse;

// // //     if(profilePicture){
// // //       const fileUri = getDataUri(profilePicture);
// // //       cloudResponse = await cloudinary.uploader.upload(fileUri);
// // //     }
// // //     const user = await User.findById(userId);
// // //     if(!user){
// // //         return res.status(401).json({
// // //              message: "user not found",
// // //              success: false
// // //         });
// // //     }

// // //     if(bio) user.bio = bio;
// // //     if(gender) user.gender =gender;
// // //     if(profilePicture) user.profilePicture = cloudResponse.secure_url;

// // //     await user.save();

// // //     return res.status(200).json({
// // //          message: "Profile updated.",
// // //          success: true,
// // //          user
// // //     });

// // //   } catch (error) {
// // //     console.log(error)
// // //   }
// // // }

// export const editProfile = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { bio, gender } = req.body;
//     const profilePicture = req.file;
//     let cloudResponse;

//     // Handle profile picture upload
//     if (profilePicture) {
//       if (!profilePicture.originalname || !profilePicture.buffer) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid file upload",
//         });
//       }

//       const fileUri = getDataUri(profilePicture);
//       cloudResponse = await cloudinary.uploader.upload(fileUri);
//     }

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (bio) user.bio = bio;
//     if (gender) user.gender = gender;
//     if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("editProfile error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating profile",
//       error: error.message,
//     });
//   }
// };

// export const getSuggestedUsers = async (req, res) => {
//   try {
//     const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
//       "-password"
//     );
//     if (!suggestedUsers) {
//       return res.status(400).json({
//         message: "Currently do not have any users.",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       users: suggestedUsers,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // // export const followOrUnfollow = async (req, res) =>{
// // //   try {
// // //     const follooKrneWala = req.id;  // may
// // //     const jiskoFollowKaruga = req.params.id;
// // //     if(follooKrneWala === jiskoFollowKaruga){
// // //         return res.status(200).json({
// // //          message: "You cannot follow/unfollow yourself.",
// // //          success: false,

// // //         });
// // //     }

// // //     const user = await User.findById(follooKrneWala);
// // //     const targetUser = await User.findById(jiskoFollowKaruga);

// // //     if(!user || !targetUser){
// // //         return res.status(200).json({
// // //          message: "user not found.",
// // //          success: false,

// // //         });
// // //     }
// // //    // check karuga ki follow karna hai ya unfollow
// // //      const isFollowing = user.following.includes(jiskoFollowKaruga);
// // //      if(isFollowing){
// // //       //unfollow lofic aayega
// // //       await Promise.all([
// // //          user.updateOne({_id: follooKrneWala},{$pull: {following: jiskoFollowKaruga}}),
// // //          user.updateOne({_id: jiskoFollowKaruga},{$pull: {followers: follooKrneWala}})
// // //       ])
// // //         return res.status(200).json({
// // //          message: "Unfollow successfully.",
// // //          success: true,

// // //         });

// // //      }else{
// // //         //follow logic aayega
// // //           await Promise.all([
// // //           user.updateOne({_id: follooKrneWala},{$push: {following: jiskoFollowKaruga}}),
// // //           user.updateOne({_id: jiskoFollowKaruga},{$push: {followers: follooKrneWala}})
// // //       ])
// // //        return res.status(200).json({
// // //          message: "follow successfully.",
// // //          success: true,

// // //         });
// // //      }
// // //   } catch (error) {

// // //   }
// // // }

// export const followOrUnfollow = async (req, res) => {
//   try {
//     const follooKrneWala = req.id; // The logged-in user ID
//     const jiskoFollowKaruga = req.params.id;

//     if (follooKrneWala === jiskoFollowKaruga) {
//       return res.status(400).json({
//         message: "You cannot follow/unfollow yourself.",
//         success: false,
//       });
//     }

//     const user = await User.findById(follooKrneWala);
//     const targetUser = await User.findById(jiskoFollowKaruga);

//     if (!user || !targetUser) {
//       return res.status(404).json({
//         message: "User not found.",
//         success: false,
//       });
//     }

//     const isFollowing = user.following.includes(jiskoFollowKaruga);

//     if (isFollowing) {
//       // Unfollow logic
//       await Promise.all([
//         user.updateOne({ $pull: { following: jiskoFollowKaruga } }),
//         targetUser.updateOne({ $pull: { followers: follooKrneWala } }),
//       ]);

//       return res.status(200).json({
//         message: "Unfollowed successfully.",
//         success: true,
//       });
//     } else {
//       // Follow logic
//       await Promise.all([
//         user.updateOne({ $push: { following: jiskoFollowKaruga } }),
//         targetUser.updateOne({ $push: { followers: follooKrneWala } }),
//       ]);

//       return res.status(200).json({
//         message: "Followed successfully.",
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.error("Follow/Unfollow error:", error);
//     return res.status(500).json({
//       message: "Something went wrong.",
//       success: false,
//       error: error.message,
//     });
//   }
// };


















// export const addPost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required",
//       });
//     }

//     const fileUri = getDataUri(file);
//     const cloudRes = await cloudinary.uploader.upload(fileUri);

//     const newPost = await Post.create({
//       caption,
//       image: cloudRes.secure_url,
//       author: req.id,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error("Add post error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while creating post",
//       error: error.message,
//     });
//   }















// export const addPost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required",
//       });
//     }

//     const fileUri = getDataUri(file);
//     const cloudRes = await cloudinary.uploader.upload(fileUri);

//     const newPost = await Post.create({
//       caption,
//       image: cloudRes.secure_url,
//       author: req.id,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error("Add post error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while creating post",
//       error: error.message,
//     });
//   }
// };











































































import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}