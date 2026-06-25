import express from "express";
import {
  addProduct,
  deleteProducts,
  getProducts,
  updateProduct   // ADD THIS
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("thumbnail"), addProduct);
router.delete("/:id", deleteProducts);

// ADD THIS LINE
router.put("/:id", upload.single("thumbnail"), updateProduct);

export default router;
