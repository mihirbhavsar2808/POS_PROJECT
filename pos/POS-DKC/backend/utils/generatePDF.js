import puppeteer from "puppeteer";
import { generateReceiptHTML } from "./receiptTemplate.js";

export const generatePDFBuffer = async (orderData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = await generateReceiptHTML(orderData);

  await page.setContent(html, { waitUntil: "load" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
};