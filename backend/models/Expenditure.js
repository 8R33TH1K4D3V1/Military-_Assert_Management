// backend/models/Expenditure.js
const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add a description for the expenditure'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount for the expenditure'],
        min: [0, 'Amount cannot be negative']
    },
    date: {
        type: Date,
        default: Date.now // Default to current date
    },
    // Optional: reference to the asset or personnel involved
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: false // Not always tied to an asset
    },
    personnel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personnel',
        required: false // Not always tied to personnel
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expenditure', expenditureSchema);