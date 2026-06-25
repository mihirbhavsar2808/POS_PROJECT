// import express from "express";
// import HoldOrder from "../models/HoldOrder.js";

// const router = express.Router();

// /* =========================
//    CREATE HOLD ORDER
// ========================= */
// router.post("/", async (req, res) => {
//   try {
//     const { cartItems, totalAmount, customer } = req.body;

//     const lastOrder = await HoldOrder.findOne().sort({ createdAt: -1 });

//     let newOrderId = "001";
//     if (lastOrder) {
//       const lastId = parseInt(lastOrder.orderId);
//       newOrderId = (lastId + 1).toString().padStart(3, "0");
//     }

//     const newOrder = new HoldOrder({
//       orderId: newOrderId,
//       cartItems,
//       totalAmount,
//       customer,
//     });

//     await newOrder.save();

//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /* =========================
//    GET ALL HOLD ORDERS
// ========================= */
// router.get("/", async (req, res) => {
//   try {
//     const orders = await HoldOrder.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /* =========================
//    GET SINGLE HOLD ORDER
// ========================= */
// router.get("/:id", async (req, res) => {
//   try {
//     const order = await HoldOrder.findById(req.params.id);
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// /* =========================
//    DELETE HOLD ORDER
// ========================= */
// router.delete("/:id", async (req, res) => {
//   try {
//     await HoldOrder.findByIdAndDelete(req.params.id);
//     res.json({ message: "Hold order deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;







import express from "express";
import HoldOrder from "../models/HoldOrder.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CREATE HOLD ORDER
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const {
      cartItems,
      subtotal,
      discountPercent,
      discountReason,
      discountAmount,
      tax,
      totalAmount,
      customer,
    } = req.body;

    /* ✅ USER-SPECIFIC LAST ORDER */
    const lastOrder = await HoldOrder.findOne({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    let newOrderId = "001";

    if (lastOrder) {
      const lastId = parseInt(lastOrder.orderId);
      newOrderId = (lastId + 1).toString().padStart(3, "0");
    }

    const newOrder = new HoldOrder({
      userId: req.user.id, // 🔥 IMPORTANT

      orderId: newOrderId,
      cartItems,
      subtotal,
      discountPercent,
      discountReason,
      discountAmount,
      tax,
      totalAmount,
      customer,
    });

    await newOrder.save();

    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET ALL HOLD ORDERS
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const orders = await HoldOrder
      .find({ userId: req.user.id }) // 🔥 FILTER
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET SINGLE HOLD ORDER
========================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await HoldOrder.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔥 SECURITY
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DELETE HOLD ORDER
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await HoldOrder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // 🔥 SECURITY
    });

    res.json({ message: "Hold order deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;