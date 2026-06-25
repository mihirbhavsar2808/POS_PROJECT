import Order from "../models/orderModel.js";

/* ================= CREATE ORDER ================= */

export const createOrder = async (req, res) => {
  try {

    const { customer, cartItems, totalAmount, paymentMethod } = req.body;

    const order = new Order({
      customer,
      cartItems,
      totalAmount,
      paymentMethod,
      status: "Unpaid"
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ORDERS ================= */

export const getOrders = async (req, res) => {
  try {

    const orders = await Order
      .find()
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ORDER ================= */

export const getSingleOrder = async (req, res) => {

  try {

    const order = await Order
      .findById(req.params.id)
      .populate("customer");

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

/* ================= UPDATE ORDER STATUS ================= */

export const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};