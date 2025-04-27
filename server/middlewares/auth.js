import { getUser } from "../utils/auth.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No or invalid authorization header.",
      });
    }

    const token = authHeader.split(" ")[1];
    const user = getUser(token);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }

    req.userInfo = user;
    next();
  } catch (error) {
    console.error("❌ Authentication Middleware Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export default authMiddleware;
