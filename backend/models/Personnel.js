// backend/models/Personnel.js
const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add a personnel ID'],
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name for the personnel'],
        trim: true
    },
    rank: {
        type: String,
        required: [true, 'Please add a rank for the personnel'],
        trim: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Personnel', personnelSchema);