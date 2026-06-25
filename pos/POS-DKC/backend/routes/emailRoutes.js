import express from "express";
import { sendEmailWithPDF } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { email, orderData } = req.body; // ✅ get orderData

    // ✅ correct function + pass orderData
    await sendEmailWithPDF(email, orderData);

    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email failed" });
  }
});

export default router;