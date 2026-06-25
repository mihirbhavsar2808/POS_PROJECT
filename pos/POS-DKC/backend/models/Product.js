import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // id: Number,
  title: String,
  price: Number,
  rating: Number,
  thumbnail: String,
  description: String,
  category: String,
  quantity: { type: Number, default: 1 },
  initialStock: { type: Number, default: 1 },
});

export default mongoose.model("Product", productSchema);                           