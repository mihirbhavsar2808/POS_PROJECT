// import express from "express";
// import Order from "../models/Order.js";
// import Customer from "../models/Customer.js";

// const router = express.Router();

// // CREATE ORDER
// router.post("/", async (req, res) => {
//   try {
//     const { customer, cartItems, totalAmount, paymentMethod, status } = req.body;

//     const order = new Order({
//       customer,
//       cartItems,
//       totalAmount,
//       paymentMethod,
//       status,
//     });

//     const savedOrder = await order.save();

//     // update loyalty points
//     await Customer.findByIdAndUpdate(customer, {
//       $inc: { loyaltyPoints: Math.floor(totalAmount / 100) },
//     });

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // GET ALL ORDERS WITH CUSTOMER
// router.get("/", async (req, res) => {
//   const orders = await Order.find().populate("customer");
//   res.json(orders);
// });

// export default router;


// import express from "express";
// import Order from "../models/Order.js";
// import Customer from "../models/Customer.js";

// const router = express.Router();

// // CREATE ORDER
// router.post("/", async (req, res) => {
//   try {
//     const { customer, cartItems, totalAmount, paymentMethod, status } = req.body;

//     if (!customer) {
//       return res.status(400).json({ error: "Customer required" });
//     }

//     const order = new Order({
//       customer,
//       cartItems: cartItems || [],
//       totalAmount: totalAmount || 0,
//       paymentMethod,
//       status,
//     });

//     const savedOrder = await order.save();

//     if (totalAmount) {
//       await Customer.findByIdAndUpdate(customer, {
//         $inc: { loyaltyPoints: Math.floor(totalAmount / 100) },
//       });
//     }

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // GET ALL ORDERS
// router.get("/", async (req, res) => {
//   const orders = await Order.find().populate("customer");
//   res.json(orders);
// });

// // DELETE ORDER
// router.delete("/:id", async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//     res.json({ message: "Order deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;




// import express from "express";
// import Order from "../models/Order.js";
// import Customer from "../models/Customer.js";

// const router = express.Router();

// /* ================= CREATE ORDER ================= */

// router.post("/", async (req, res) => {
//   try {

//     const {
//       customer,
//       cartItems,
//       subtotal,
//       discountPercent,
//       discountReason,
//       discountAmount,
//       tax,
//       totalAmount,
//       paymentMethod,
//       status
//     } = req.body;
//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart cannot be empty" });
//     }
//     const order = new Order({
//       customer: customer || null,
//       cartItems: cartItems || [],

//       subtotal: subtotal || 0,
//       discountPercent: discountPercent || 0,
//       discountReason: discountReason || "",
//       discountAmount: discountAmount || 0,
//       tax: tax || 0,

//       totalAmount: totalAmount || 0,
//       paymentMethod: paymentMethod || null,
//       status: status || "Ongoing"
//     });

//     const savedOrder = await order.save();

//     /* Loyalty points only if customer exists */

//     if (customer && totalAmount) {

//       await Customer.findByIdAndUpdate(customer, {
//         $inc: { loyaltyPoints: Math.floor(totalAmount / 100) }
//       });

//     }

//     res.status(201).json(savedOrder);

//   } catch (err) {

//     res.status(400).json({ error: err.message });

//   }
// });


// /* ================= GET ALL ORDERS ================= */

// router.get("/", async (req, res) => {

//   try {

//     const orders = await Order
//       .find()
//       .populate("customer", "name phone email")
//       .sort({ createdAt: -1 });

//     res.json(orders);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

// });


// /* ================= GET SINGLE ORDER ================= */

// router.get("/:id", async (req, res) => {

//   try {

//     const order = await Order
//       .findById(req.params.id)
//       .populate("customer");

//     res.json(order);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

// });


// /* ================= UPDATE ORDER STATUS ================= */

// router.patch("/:id", async (req, res) => {
//   try {

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     Object.assign(order, req.body);

//     const updated = await order.save();

//     const populated = await updated.populate("customer", "name phone");

//     res.json(populated);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });


// /* ================= DELETE ORDER ================= */

// router.delete("/:id", async (req, res) => {

//   try {

//     await Order.findByIdAndDelete(req.params.id);

//     res.json({ message: "Order deleted" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }

// });

// export default router;





import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
const router = express.Router();

/* ================= CREATE ORDER ================= */

router.post("/", protect, async (req, res) => {
  try {
    const {
      customer,
      cartItems,
      subtotal,
      discountPercent,
      discountReason,
      discountAmount,
      tax,
      totalAmount,
      paymentMethod,
      status
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty" });
    }

    const order = new Order({
      userId: req.user.id, // 🔥 ADD THIS
      customer: customer || null,
      cartItems: cartItems || [],
      subtotal: subtotal || 0,
      discountPercent: discountPercent || 0,
      discountReason: discountReason || "",
      discountAmount: discountAmount || 0,
      tax: tax || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || null,
      status: status || "Ongoing"
    });

    const savedOrder = await order.save();

    /* Loyalty points */
    if (customer && totalAmount) {
      await Customer.findOneAndUpdate(
        { _id: customer, userId: req.user.id }, // 🔥 SECURE
        {
          $inc: { loyaltyPoints: Math.floor(totalAmount / 100) }
        }
      );
    }

    res.status(201).json(savedOrder);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/* ================= GET ALL ORDERS ================= */

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order
      .find({ userId: req.user.id }) // 🔥 FILTER
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= GET SINGLE ORDER ================= */

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order
      .findOne({
        _id: req.params.id,
        userId: req.user.id // 🔥 SECURITY
      })
      .populate("customer");

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= UPDATE ORDER ================= */
router.patch("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🚫 PREVENT DOUBLE STOCK REDUCTION
    if (order.status === "Paid" && req.body.status === "Paid") {
      return res.json(order); // already processed
    }

    const isBecomingPaid =
      req.body.status === "Paid" && order.status !== "Paid";

    // update fields
    Object.assign(order, req.body);

    const updatedOrder = await order.save();

    // 🔥 REDUCE STOCK ONLY ONCE
    if (isBecomingPaid) {
      for (const item of order.cartItems) {

        const product = await Product.findById(item._id);

        if (!product) continue;

        if (product.quantity < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for ${product.title}`
          });
        }

        await Product.findByIdAndUpdate(item._id, {
          $inc: { quantity: -item.quantity }
        });
      }
    }

    const populated = await updatedOrder.populate("customer", "name phone");

    res.json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


/* ================= DELETE ORDER ================= */

// router.delete("/:id", protect, async (req, res) => {
//   try {
//     await Order.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id // 🔥 SECURITY
//     });

//     res.json({ message: "Order deleted" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


router.delete("/:id", protect, async (req, res) => {
  try {
    console.log("DELETE REQUEST ID:", req.params.id);
    console.log("USER:", req.user);

    // 🔒 only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete orders"
      });
    }

    // ✅ find first
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // ✅ delete using deleteOne (more reliable)
    await Order.deleteOne({ _id: req.params.id });

    res.json({
      message: "Order deleted successfully",
      deletedId: req.params.id
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;