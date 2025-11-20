import mongoose from "mongoose";

const splitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    share: { type: Number, required: true }
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: { type: Number, required: true },
    splits: [splitSchema],
    description: String,
    category: { type: String, default: "other" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
