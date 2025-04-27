import express from "express";
import { generateImageHandler } from "../controllers/image-controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateImageHandler);

export default router;
