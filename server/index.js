import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db-connection.js";
import userRouter from "./routes/user-routes.js";
import imageRouter from "./routes/image-routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// DB Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
