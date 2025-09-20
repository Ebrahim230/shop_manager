const mongoose = require('mongoose');

const MohajonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  address: { type: String },
  transactions: [
    {
      type: { type: String, enum: ['credit', 'debit'], required: true }, 
      amount: { type: Number, required: true },
      notes: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mohajon', MohajonSchema);