const Mohajon = require('../models/mohajonModel');

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
    const credit = mohajon.transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
    const debit = mohajon.transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
    const balance = credit - debit;
    res.status(200).json({ ...mohajon.toObject(), balance, credit, debit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};