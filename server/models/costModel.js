const mongoose = require('mongoose');

const costSchema = new mongoose.Schema(
    {
        category:{
            type: String,
            enum: ['product','utility', 'family'],
            required: true
        },
        title:{
            type: String,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        date:{
            type: Date,
            default: Date.now()
        },
        notes:{
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Cost', costSchema);