import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  orderId: String,
  email: String,
  customer: Object,
  cartItems: Array,
  subtotal: Number,
  discountAmount: Number,
  tax: Number,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Receipt", receiptSchema);