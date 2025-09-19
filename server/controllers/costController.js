const Cost = require('../models/costModel');
const Sales = require('../models/salesModel');

const addCost = async (req, res) => {
  try {
    const cost = new Cost(req.body);
    await cost.save();
    return res.status(201).json(cost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllCosts = async (req, res) => {
  try {
    const costs = await Cost.find().sort({ date: -1 });
    res.json(costs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const calcSummary = async (match = {}) => {
  const salesAgg = await Sales.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalProfit: { $sum: '$profit' },
      },
    },
  ]);
  const totalRevenue = salesAgg[0]?.totalRevenue || 0;
  const totalProfit = salesAgg[0]?.totalProfit || 0;

  const costAgg = await Cost.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);
  const costs = { product: 0, utility: 0, family: 0 };
  costAgg.forEach((c) => (costs[c._id] = c.total));

  const remainingAmount = totalRevenue - totalProfit - costs.product - costs.utility;
  const netProfit = totalProfit - costs.family;

  return {
    totalRevenue,
    totalProfit,
    productCost: costs.product,
    utilityCost: costs.utility,
    familyExpenses: costs.family,
    remainingAmount,
    netProfit,
  };
};

const getNetSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [overall, monthly, daily] = await Promise.all([
      calcSummary(),
      calcSummary({ date: { $gte: startOfMonth } }),
      calcSummary({ date: { $gte: startOfDay } }),
    ]);

    res.json({ overall, monthly, daily });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCost, getAllCosts, getNetSummary };