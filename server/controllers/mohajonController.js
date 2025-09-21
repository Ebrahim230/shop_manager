const Mohajon = require('../models/mohajonModel');
const Cost = require('../models/costModel');

exports.createMohajon = async (req, res) => {
  try {
    const mohajon = new Mohajon(req.body);
    await mohajon.save();
    res.status(201).json(mohajon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMohajons = async (req, res) => {
  try {
    const mohajons = await Mohajon.find();
    res.status(200).json(mohajons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMohajon = async (req, res) => {
  try {
    const { id } = req.params;
    const mohajon = await Mohajon.findById(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });
    const credit = mohajon.transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
    const debit = mohajon.transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
    const balance = credit - debit;
    res.status(200).json({ ...mohajon.toObject(), balance, credit, debit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, notes, date } = req.body;
    const mohajon = await Mohajon.findById(id);
    if (!mohajon) return res.status(404).json({ message: 'Mohajon not found' });

    mohajon.transactions.push({ type, amount, notes, date });
    await mohajon.save();

    if (type === 'debit' && date) {
      await Cost.create({
        category: 'product',
        title: 'Product Cost',
        amount: Number(amount),
        notes: notes || `Mohajon: ${mohajon.name}`,
        date
      });
    }

    const credit = mohajon.transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
    const debit = mohajon.transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
    const balance = credit - debit;
    res.status(200).json({ ...mohajon.toObject(), balance, credit, debit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};