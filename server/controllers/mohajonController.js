const Mohajon = require('../models/mohajonModel');
const Cost = require('../models/costModel');

async function createMohajon(req, res) {
  try {
    const mohajon = new Mohajon(req.body);
    await mohajon.save();
    res.status(201).json(mohajon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllMohajons(req, res) {
  try {
    const mohajons = await Mohajon.find();
    res.status(200).json(mohajons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMohajon(req, res) {
  try {
    const { id } = req.params;
    const mohajon = await Mohajon.findById(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });

    const credit = mohajon.transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
    const debit = mohajon.transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
    const balance = credit - debit;

    res.status(200).json({ ...mohajon.toObject(), credit, debit, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addTransaction(req, res) {
  try {
    const { id } = req.params;
    const { type, amount, notes, date } = req.body;
    const mohajon = await Mohajon.findById(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });

    const transactionDate = date ? new Date(date) : new Date();
    mohajon.transactions.push({ type, amount, notes, date: transactionDate });
    await mohajon.save();

    if (type === 'debit') {
      await Cost.create({
        category: 'product',
        title: 'Product Cost',
        amount: Number(amount),
        notes: notes || `Mohajon: ${mohajon.name}`,
        date: transactionDate
      });
    }

    const credit = mohajon.transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
    const debit = mohajon.transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
    const balance = credit - debit;

    res.status(200).json({ ...mohajon.toObject(), credit, debit, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateMohajon(req, res) {
  try {
    const { id } = req.params;
    const mohajon = await Mohajon.findByIdAndUpdate(id, req.body, { new: true });
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });
    res.status(200).json(mohajon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteMohajon(req, res) {
  try {
    const { id } = req.params;
    const mohajon = await Mohajon.findByIdAndDelete(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });
    res.status(200).json({ message: 'Mohajon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id, tid } = req.params;
    const mohajon = await Mohajon.findById(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });

    const transactionIndex = mohajon.transactions.findIndex(t => t._id.toString() === tid);
    if (transactionIndex === -1) return res.status(404).json({ message: 'Transaction not found' });

    mohajon.transactions.splice(transactionIndex, 1);
    await mohajon.save();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createMohajon,
  getAllMohajons,
  getMohajon,
  addTransaction,
  updateMohajon,
  deleteMohajon,
  deleteTransaction
};