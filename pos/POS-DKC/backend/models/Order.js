// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "OrderCustomer",
//       default: null
//     },

//     cartItems: [
//       {
//         title: String,
//         price: Number,
//         quantity: Number,
//         thumbnail: String
//       }
//     ],

//     totalAmount: {
//       type: Number,
//       required: true
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["cash", "card"],
//     },

//     status: {
//       type: String,
//       enum: ["Paid", "Failed", "Ongoing", "Unpaid"],
//       default: "Unpaid"
//     }

//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);








// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "OrderCustomer",
//       default: null
//     },

//     cartItems: [
//       {
//         title: String,
//         price: Number,
//         quantity: Number,
//         thumbnail: String
//       }
//     ],

//     /* ✅ ADD THESE */
//     subtotal: {
//       type: Number,
//       default: 0
//     },

//     discountPercent: {
//       type: Number,
//       default: 0
//     },

//     discountReason: {
//       type: String,
//       default: ""
//     },

//     discountAmount: {
//       type: Number,
//       default: 0
//     },

//     tax: {
//       type: Number,
//       default: 0
//     },

//     totalAmount: {
//       type: Number,
//       required: true
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["cash", "card"],
//     },

//     status: {
//       type: String,
//       enum: ["Paid", "Failed", "Ongoing", "Unpaid"],
//       default: "Unpaid"
//     }

//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);



import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderCustomer",
      default: null,
    },

    cartItems: [
      {
        title: String,
        price: Number,
        quantity: Number,
        thumbnail: String,
      },
    ],

    subtotal: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountReason: { type: String, default: "" },
    discountAmount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
    },

    status: {
      type: String,
      enum: ["Paid", "Failed", "Ongoing", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderSchema);
