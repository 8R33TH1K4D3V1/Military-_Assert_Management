// backend/models/Asset.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add an asset ID'], // More descriptive error message
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name for the asset'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Under Maintenance', 'Retired'], // Explicit list of valid statuses
        default: 'Available'
    },
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('Asset', assetSchema);