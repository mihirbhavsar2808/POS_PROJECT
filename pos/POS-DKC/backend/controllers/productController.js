import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, price, category, quantity } = req.body;
    const thumbnail = req.file?.filename;

    if (!title || !price || !thumbnail || !category || !quantity) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const newProduct = new Product({
      title,
      price,
      thumbnail,
      category,
      quantity: Number(quantity),
      initialStock: Number(quantity), // 🔥 ADD THIS
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, action, title, price, category } = req.body;

    const updateData = {};

    // ✅ NORMAL FIELD UPDATE
    if (title) updateData.title = title;
    if (price) updateData.price = price;
    if (category) updateData.category = category;

    // ✅ STOCK FIX (ATOMIC)
    if (quantity !== undefined) {
      const qty = Number(quantity);

      if (!qty || qty <= 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      if (action === "add") {
        updateData.$inc = { quantity: qty };
      } 
      
      else if (action === "remove") {
        updateData.$inc = { quantity: -qty };
      } 
      
      else if (action === "set") {
        updateData.quantity = qty;
        updateData.initialStock = qty;
      }
    }

    // ✅ IMAGE UPDATE
    if (req.file) {
      updateData.thumbnail = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};