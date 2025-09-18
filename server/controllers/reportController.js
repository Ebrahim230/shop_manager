const Sale = require('../models/salesModel');

const dailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } });
    const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    res.json({ sales, totalRevenue, totalProfit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const monthlyReport = async (req, res) => {
  try {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } });
    const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    res.json({ sales, totalRevenue, totalProfit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { dailyReport, monthlyReport };