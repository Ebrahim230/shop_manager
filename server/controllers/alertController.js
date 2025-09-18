const Product = require("../models/productModel");

const lowStockAlert = async (req, res) => {
  try {
    const threshold = 5;
    const products = await Product.find({ stock: { $lte: threshold } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const expiryAlert = async (req, res) => {
  try {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + 30);

    const products = await Product.find({ expiryDate: { $gte: today, $lte: soon } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {lowStockAlert,expiryAlert};