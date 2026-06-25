import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      country,
      state,
      zip,
      city,
      balance,
      loyaltyPoints,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    // const lastCustomer = await Customer.findOne().sort({ id: -1 });
    // const newId = lastCustomer ? lastCustomer.id + 1 : 1;

    const newCustomer = new Customer({
      // id: newId,
      name,
      phone,
      email,
      address,
      balance,
      loyaltyPoints,
      notes,
      country,
      state,
      zip,
      city,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: "Failed to add customer" });
  }
};
