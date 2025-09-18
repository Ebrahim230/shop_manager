const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    buyingPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);