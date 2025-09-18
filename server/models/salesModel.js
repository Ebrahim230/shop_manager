const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerName: { type: String, default: "Random" },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            quantity: Number,
            sellingPrice: Number,
            buyingPrice: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Sale", saleSchema);