import express from "express";
import {
  registerHandler,
  loginHandler,
  loadUserHandler,
  paymentRazorpayHandler,
  verifyPaymentHandler,
} from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", registerHandler);
router.post("/login", loginHandler);

// Protected routes
router.get("/credits", authMiddleware, loadUserHandler);
router.post("/pay-razor", authMiddleware, paymentRazorpayHandler);
router.post("/verify-razor", authMiddleware, verifyPaymentHandler);

export default router;
