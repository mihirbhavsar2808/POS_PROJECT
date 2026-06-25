// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const router = express.Router();

// // REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     console.log("REGISTER ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ✅ TOKEN WITHOUT EXPIRY
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET
//     );

//     res.json({
//       token,
//       role: user.role,
//       name: user.name,
//     });
//   } catch (error) {
//     console.log("LOGIN ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;









// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const router = express.Router();

// // ✅ TOKEN
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET
//   );
// };

// // ✅ ADMIN REGISTER
// router.post("/admin-register", async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;

//     const exist = await User.findOne({ email });
//     if (exist) return res.status(400).json({ message: "Admin already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await User.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       role: "admin",
//     });

//     res.status(201).json({ message: "Admin created", admin });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = generateToken(user);

//     res.json({
//       token,
//       role: user.role,
//       name: user.name,
//       userId: user._id, // 🔥 IMPORTANT
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ CREATE USER
// router.post("/create-user", async (req, res) => {
//   try {
//     const { name, email, password, pin } = req.body;

//     const exist = await User.findOne({ email });
//     if (exist) return res.status(400).json({ message: "User exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const hashedPin = await bcrypt.hash(pin, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       pin: hashedPin,
//       role: "user",
//     });

//     res.status(201).json({ message: "User created", user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ VERIFY PIN
// router.post("/verify-pin", async (req, res) => {
//   try {
//     const { userId, pin } = req.body;

//     if (!userId || !pin) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const user = await User.findById(userId);

//     if (!user || !user.pin) {
//       return res.status(404).json({ message: "User or PIN not found" });
//     }

//     const isMatch = await bcrypt.compare(String(pin), user.pin);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Incorrect PIN" });
//     }

//     res.json({ message: "Unlocked" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// const protect = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "No token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // { id, role }

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // ✅ GET CURRENT USER
// router.get("/me", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password -pin");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;













import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ================= TOKEN ================= */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
};

/* ================= PROTECT ================= */
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ADMIN REGISTER ================= */
router.post("/admin-register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id,
      isAdmin: user.role === "admin",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE USER ================= */
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, password, pin } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pin: hashedPin,
      role: "user",
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ✅ GET ALL USERS (FIX) ================= */
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password -pin");

    res.json(users); // 👈 IMPORTANT: return array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE USER ================= */
router.delete("/users/:id", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= VERIFY PIN ================= */
router.post("/verify-pin", async (req, res) => {
  try {
    const { userId, pin } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.pin) {
      return res.status(404).json({ message: "User or PIN not found" });
    }

    const isMatch = await bcrypt.compare(String(pin), user.pin);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect PIN" });
    }

    res.json({ message: "Unlocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET CURRENT USER ================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -pin");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


// 🔥 VERIFY ADMIN PASSWORD
router.post("/verify-admin", protect, async (req, res) => {
  try {
    const { password } = req.body;

    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Not admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/update-user/:id", protect, async (req, res) => {
  try {
    const { pin, adminPassword } = req.body;

    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Not admin" });
    }

    const isMatch = await bcrypt.compare(adminPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong admin password" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(req.params.id, {
      pin: hashedPin,
    });

    res.json({ message: "PIN updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});