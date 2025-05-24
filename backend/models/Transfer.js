// backend/model/Transfer.js
const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    fromBase: {
        type: String,
        required: true,
        trim: true,
    },
    toBase: {
        type: String,
        required: true,
        trim: true,
    },
    assetId: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;