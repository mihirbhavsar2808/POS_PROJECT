// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import productRoutes from "./routes/productRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;


// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// app.use("/api/products", productRoutes);
// app.use("/api/customers", customerRoutes);

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("connected");
//     app.listen(port, () => console.log("Server running on port"));
//   })
//   .catch((err) => console.log(err));




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";   // ✅ ADD THIS
import holdOrderRoutes from "./routes/holdOrderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderCustomerRoutes from "./routes/orderCustomerRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import emailRoutes from "./routes/emailRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);  // ✅ ADD THIS
app.use("/api/hold-orders", holdOrderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/ordercustomers", orderCustomerRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api", emailRoutes);
app.use("/api", receiptRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.log(err));