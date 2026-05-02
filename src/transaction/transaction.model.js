import { model, Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    // Credit or Debit
    transactionType: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["cr", "dr"],
      required: true,
    },

    // Logged in User
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Transaction Title)P
    title: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    // Amount
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // Cash / Online / UPI / Card
    paymentMethod: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    // Optional Notes
    notes: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Optional Date (manual transaction date)
    date: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = model("Transaction", TransactionSchema);

export default TransactionModel;