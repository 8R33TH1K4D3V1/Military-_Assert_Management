// backend/controller/transferController.js
const Transfer = require('../models/Transfer');

exports.createTransfer = async (req, res) => {
    try {
        const { fromBase, toBase, assetId, quantity } = req.body;
        // ... (rest of your validation and saving logic)
        const newTransfer = new Transfer({
            fromBase,
            toBase,
            assetId,
            quantity,
        });
        const transfer = await newTransfer.save();
        res.status(201).json(transfer); // Make sure you're sending JSON
    } catch (error) {
        console.error('Error creating transfer:', error);
        res.status(500).json({ message: 'Server Error' }); // Always send JSON errors
    }
};

exports.getTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find().sort({ timestamp: -1 });
        res.status(200).json(transfers); // Make sure you're sending JSON
    } catch (error) {
        console.error('Error fetching transfers:', error);
        res.status(500).json({ message: 'Server Error' }); // Always send JSON errors
    }
};