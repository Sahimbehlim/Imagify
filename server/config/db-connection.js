import mongoose from "mongoose";

const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;

  if (!dbURI) {
    console.error("MongoDB URI is missing in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
