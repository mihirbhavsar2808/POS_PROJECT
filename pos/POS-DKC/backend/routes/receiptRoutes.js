import express from "express";
import Receipt from "../models/Receipt.js";
import { sendEmailWithPDF } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/send-receipt", async (req, res) => {
  try {
    const { email, orderData } = req.body;

    // save in MongoDB
    const receipt = new Receipt({
      orderId: orderData._id,
      email,
      customer: orderData.customer,
      cartItems: orderData.cartItems,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount,
      tax: orderData.tax,
      totalAmount: orderData.totalAmount,
    });

    await receipt.save();

    // send email
    await sendEmailWithPDF(email, orderData);

    res.json({ message: "Receipt sent & saved" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

export default router;