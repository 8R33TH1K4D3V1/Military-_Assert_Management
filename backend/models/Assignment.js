// backend/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset', // This must match the string name given to mongoose.model('Asset', assetSchema)
        required: [true, 'Please select an asset for the assignment']
    },
    personnel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personnel', // This must match the string name given to mongoose.model('Personnel', personnelSchema)
        required: [true, 'Please select personnel for the assignment']
    },
    assignmentDate: {
        type: Date,
        required: [true, 'Please provide an assignment date']
    },
    returnDate: {
        type: Date,
        default: null // Default to null, means not returned yet
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);