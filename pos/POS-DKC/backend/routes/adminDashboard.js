// import express from "express";
// import Order from "../models/Order.js";
// import { protect } from "../middleware/authMiddleware.js";
// import User from "../models/User.js";

// const router = express.Router();

// // router.get("/", protect, async (req, res) => {
// //   try {
// //     if (req.user.role !== "admin") {
// //       return res.status(403).json({ message: "Not admin" });
// //     }

// //     const orders = await Order.find()
// //       .populate("customer")
// //       .populate("userId", "name");

// //     let totalRevenue = 0;
// //     const monthly = Array(12).fill(0);
// //     const productMap = {};
// //     const userMap = {};

// //     orders.forEach((o) => {
// //       totalRevenue += o.totalAmount;

// //       const month = new Date(o.createdAt).getMonth();
// //       monthly[month] += o.totalAmount;

// //       /* ================= PRODUCTS ================= */
// //       o.cartItems?.forEach((item) => {
// //         if (!productMap[item.title]) productMap[item.title] = 0;
// //         productMap[item.title] += item.quantity;
// //       });

// //       /* ================= USER SAFE FIX ================= */
// //       if (!o.userId || !o.userId._id) return; // 🔥 FIX

// //       const uid = o.userId._id.toString();

// //       if (!userMap[uid]) {
// //         userMap[uid] = {
// //           userId: uid, // ✅ ADD THIS
// //           name: o.userId.name,
// //           orders: 0,
// //           revenue: 0,
// //         };
// //       }

// //       userMap[uid].orders += 1;
// //       userMap[uid].revenue += o.totalAmount;
// //     });

// //     const topProducts = Object.entries(productMap)
// //       .map(([title, qty]) => ({ title, quantity: qty }))
// //       .sort((a, b) => b.quantity - a.quantity)
// //       .slice(0, 5);

// //     res.json({
// //       totalRevenue,
// //       totalOrders: orders.length,
// //       monthly,
// //       topProducts,
// //       userStats: Object.values(userMap),
// //       orders,
// //     });

// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// router.get("/", protect, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("customer")
//       .populate("userId", "name");

//     const userMap = {};

//     orders.forEach((o) => {
//       if (!o.userId || !o.userId._id) return;

//       const uid = o.userId._id.toString();

//       if (!userMap[uid]) {
//         userMap[uid] = {
//           userId: uid,   // ✅ REQUIRED
//           name: o.userId.name || "User",
//         };
//       }
//     });

//     res.json({
//       orders,
//       userStats: Object.values(userMap),
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });



// router.get("/", protect, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("customer")
//       .populate("userId", "name");

//     // ✅ GET ALL USERS
//     const users = await User.find({ role: "user" });

//     const userStats = users.map((u) => ({
//       userId: u._id.toString(),
//       name: u.name,
//     }));

//     res.json({
//       orders,
//       userStats,
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// export default router;





import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("userId", "name");

    // ✅ ONLY NORMAL USERS (NOT ADMIN)
    const users = await User.find({ role: "user" });

    const userStats = users.map((u) => ({
      userId: u._id.toString(),
      name: u.name,
    }));

    res.json({
      orders,
      userStats,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;