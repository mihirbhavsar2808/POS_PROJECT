import mongoose from "mongoose";

const orderCustomerSchema = new mongoose.Schema(
{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: String,
  country: String,
  state: String,
  city: String,
  zip: Number
},
{ timestamps: true }
);

export default mongoose.model("OrderCustomer", orderCustomerSchema);