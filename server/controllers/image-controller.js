import User from "../models/user-model.js";
import FormData from "form-data";
import axios from "axios";

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, error: message });
};

// Generate image handler
const generateImageHandler = async (req, res) => {
  const { id } = req.userInfo;
  const { prompt } = req.body;

  if (!prompt) {
    return sendErrorResponse(res, 400, "Missing prompt.");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return sendErrorResponse(res, 404, "User not found.");
    }

    if (user.creditBalance <= 0) {
      return sendErrorResponse(res, 400, "Insufficient credit balance.");
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    // Call the external API to generate the image
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    // Convert the image data to base64 and update the user’s credit balance
    const resultImage = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    await User.findByIdAndUpdate(id, {
      creditBalance: user.creditBalance - 1,
    });

    res.status(200).json({
      success: true,
      creditBalance: user.creditBalance - 1,
      resultImage,
      message: "Image generated successfully",
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return sendErrorResponse(
      res,
      500,
      "Something went wrong. Please try again."
    );
  }
};

export { generateImageHandler };
