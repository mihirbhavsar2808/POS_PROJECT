// import express from "express";
// import OrderCustomer from "../models/OrderCustomer.js";

// const router = express.Router();

// router.get("/", async (req,res)=>{
//   const customers = await OrderCustomer.find().sort({createdAt:-1});
//   res.json(customers);
// });

// router.post("/", async (req,res)=>{
//   try{
//     const customer = new OrderCustomer(req.body);
//     const saved = await customer.save();
//     res.status(201).json(saved);
//   }catch(err){
//     res.status(400).json({error:err.message});
//   }
// });

// router.delete("/:id", async (req,res)=>{
//   await OrderCustomer.findByIdAndDelete(req.params.id);
//   res.json({message:"Order customer deleted"});
// });

// export default router;



import express from "express";
import OrderCustomer from "../models/OrderCustomer.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET ================= */

router.get("/", protect, async (req, res) => {
  try {
    const customers = await OrderCustomer
      .find({ userId: req.user.id }) // 🔥 FILTER
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CREATE ================= */

router.post("/", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name & phone required" });
    }

    // Optional: prevent duplicate per user
    const exist = await OrderCustomer.findOne({
      phone,
      userId: req.user.id,
    });

    if (exist) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const customer = new OrderCustomer({
      ...req.body,
      userId: req.user.id, // 🔥 IMPORTANT
    });

    const saved = await customer.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= DELETE ================= */

router.delete("/:id", protect, async (req, res) => {
  try {
    await OrderCustomer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // 🔥 SECURITY
    });

    res.json({ message: "Order customer deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;