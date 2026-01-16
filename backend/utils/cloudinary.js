import {v2 as cloudinary} from "cloudinary";
import  dotenv from "dotenv";
dotenv.config({});

// cloudinary.config({
//   CLOUD_NAME: process.env.CLOUD_NAME,
//   API_KEY:   process.env.API_KEY,
//   API_SECRET:   process.env.API_SECRET
// });
// export default cloudinary;


// utils/cloudinary.js
// cloudinaryConfig.js or wherever you configure Cloudinary
// const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary;