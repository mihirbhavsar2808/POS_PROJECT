// import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema({
//   _id: String,
//   id: Number,
//   title: String,
//   price: Number,
//   thumbnail: String,
//   category: String,
//   quantity: Number,
// });

// const holdOrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       unique: true,
//     },
//     cartItems: [cartItemSchema],
//     subtotal: Number,
//     discountPercent: Number,
//     discountReason: String,
//     discountAmount: Number,
//     tax: Number,
//     totalAmount: Number,
//     customer: {
//       name: String,
//       phone: String,
//     },
//   },
//   { timestamps: true }
// );
// export default mongoose.model("HoldOrder", holdOrderSchema);







import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  _id: String,
  id: Number,
  title: String,
  price: Number,
  thumbnail: String,
  category: String,
  quantity: Number,
});

const holdOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
    },

    cartItems: [cartItemSchema],
    subtotal: Number,
    discountPercent: Number,
    discountReason: String,
    discountAmount: Number,
    tax: Number,
    totalAmount: Number,
    customer: {
      name: String,
      phone: String,
    },
  },
  { timestamps: true }
);

/* ✅ UNIQUE PER USER */
holdOrderSchema.index({ userId: 1, orderId: 1 }, { unique: true });

export default mongoose.model("HoldOrder", holdOrderSchema);