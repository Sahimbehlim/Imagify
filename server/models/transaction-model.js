import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    plan: {
      type: String,
      required: [true, "Plan name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
    },
    payment: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
