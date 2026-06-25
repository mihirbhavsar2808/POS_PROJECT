import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generatePDFBuffer } from "./generatePDF.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWithPDF = async (to, orderData) => {
  const pdfBuffer = await generatePDFBuffer(orderData);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Thank You for Your Purchase",
    html: `
      <h2>Thank You for Your Purchase!</h2>
      <p>We appreciate your business.</p>
      <p>Your receipt is attached.</p>
    `,
    attachments: [
      {
        filename: "receipt.pdf",
        content: pdfBuffer,
      },
    ],
  });
};