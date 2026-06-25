import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: String,
    percent: Number,
    reason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);