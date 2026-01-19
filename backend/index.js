// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser"
// import dotenv from "dotenv";
// import connectDb from "./utils/db.js";
// import userRoute from "./routes/user.route.js"

// dotenv.config({});
// const app = express();

// app.get("/",(req, res)=>{
//     return res.status(200).json({
//         success: true,
//         message: "I'm coming from backend",

//     })
// })

// //middleware
// app.use(express.json());
// app.use(cookieParser);
// app.use(urlencoded({extended:true}));
// const corsOptions = {
//     origin:'http://localhost:5173',
//     Credentials: true
// }
// app.use(cors(corsOptions));

// //api
// app.use("/api/v1/user", userRoute)

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, ()=>{
//     connectDb();
//     console.log(`server listen at port ${PORT}`);
// })




import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js"
import {app , server,} from './socket/socket.js';
import path from "path";

dotenv.config();

// const __dirname = path.resolve();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Test route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "I'm coming from backend",
  });
});

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser()); // ✅ FIXED
app.use(express.urlencoded({ extended: true })); // ✅ FIXED

const corsOptions = {
    origin: [
    "http://localhost:5173",
    "https://instaclone-frontend.onrender.com"
  ],
  credentials: true, // ✅ FIXED: should be lowercase 'credentials'
};
app.use(cors(corsOptions));

// ✅ Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute );
app.use("/api/v1/message",messageRoute );



app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// }); 

app.use((req, res) => {
  res.sendFile(
    path.resolve(__dirname, "frontend", "dist", "index.html")
  );
});


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  connectDb();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

