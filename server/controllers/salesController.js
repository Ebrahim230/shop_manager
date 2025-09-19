const Sale = require("../models/salesModel");
const Product = require("../models/productModel");

const createSale = async (req, res) => {
  try {
    const { customerName, items } = req.body;
    let total = 0;
    let profit = 0;

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const itemTotal = item.quantity * item.sellingPrice;
        const itemProfit =
          (item.sellingPrice - product.buyingPrice) * item.quantity;
          const stockAfterSale = product.stock - item.quantity;

        total += itemTotal;
        profit += itemProfit;
        product.stock = stockAfterSale;
        await product.save()
        return {
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          buyingPrice: product.buyingPrice,
          stock: stockAfterSale
        };
      })
    );

    const newSale = new Sale({
      customerName,
      items: populatedItems,
      total,
      profit,
    });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSale, getSales };