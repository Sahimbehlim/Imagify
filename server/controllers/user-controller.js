import User from "../models/user-model.js";
import Transaction from "../models/transaction-model.js";
import bcrypt from "bcryptjs";
import razorpay from "razorpay";
import { setUser } from "../utils/auth.js";

// Razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Utility function for sending error responses
const sendErrorResponse = (res, status, error) => {
  return res.status(status).json({ success: false, error });
};

// Register handler
const registerHandler = async (req, res) => {
  const { name, email, password } = req.body.formData;

  if (!name || !email || !password) {
    return sendErrorResponse(res, 400, "All fields are required");
  }

  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = setUser(newUser);
    res.status(201).json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    sendErrorResponse(res, 500, "Something went wrong. Please try again.");
  }
};

// Login handler
const loginHandler = async (req, res) => {
  const { email, password } = req.body.formData;

  if (!email || !password) {
    return sendErrorResponse(res, 400, "All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, "User doesn't exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, 401, "Invalid credentials");
    }

    const token = setUser(user);
    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    sendErrorResponse(res, 500, "Something went wrong. Please try again.");
  }
};

// Load user handler
const loadUserHandler = async (req, res) => {
  const { id } = req.userInfo;

  try {
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        credits: user.creditBalance,
      },
    });
  } catch (error) {
    console.error("Error getting user credits:", error);
    sendErrorResponse(res, 500, "Something went wrong. Please try again.");
  }
};

// Payment handler with Razorpay
const paymentRazorpayHandler = async (req, res) => {
  const { id } = req.userInfo;
  const { planId } = req.body;

  if (!planId) {
    return sendErrorResponse(res, 400, "Missing plan details");
  }

  try {
    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return sendErrorResponse(res, 404, "Plan not found");
    }

    const newTransaction = await Transaction.create({
      plan,
      amount,
      credits,
      userId: id,
    });

    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return sendErrorResponse(res, 400, error);
      }
      res.status(200).json({ success: true, order });
    });
  } catch (error) {
    console.error("Error during payment creation:", error);
    sendErrorResponse(res, 500, "Something went wrong. Please try again.");
  }
};

// Verify payment handler
const verifyPaymentHandler = async (req, res) => {
  const { razorpay_order_id } = req.body;

  try {
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await Transaction.findById(orderInfo.receipt);

      if (transactionData.payment) {
        return sendErrorResponse(res, 401, "Payment already processed");
      }

      const user = await User.findById(transactionData.userId);
      const creditBalance = user.creditBalance + transactionData.credits;

      await User.findByIdAndUpdate(user._id, { creditBalance });
      await Transaction.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });

      res.status(201).json({ sucess: true, message: "Credits added!" });
    }
  } catch (error) {
    console.error("Error verifying payments:", error);
    sendErrorResponse(res, 500, "Something went wrong. Please try again.");
  }
};

export {
  registerHandler,
  loginHandler,
  loadUserHandler,
  paymentRazorpayHandler,
  verifyPaymentHandler,
};
