// backend/controllers/expenditureController.js
const asyncHandler = require('express-async-handler');
const Expenditure = require('../models/Expenditure'); // Correct path
const Asset = require('../models/Asset'); // If linking to assets
const Personnel = require('../models/Personnel'); // If linking to personnel

// @desc    Get all expenditures
// @route   GET /api/expenditures
// @access  Public
const getExpenditures = asyncHandler(async (req, res) => {
    const expenditures = await Expenditure.find({})
        .populate('asset', 'name id') // Populate only name and id of asset
        .populate('personnel', 'name id rank') // Populate only name, id, and rank of personnel
        .sort({ date: -1 });
    res.status(200).json(expenditures);
});

// @desc    Create a new expenditure
// @route   POST /api/expenditures
// @access  Private
const createExpenditure = asyncHandler(async (req, res) => {
    const { description, amount, date, assetId, personnelId } = req.body;

    if (!description || !amount) {
        res.status(400);
        throw new Error('Please include description and amount for the expenditure.');
    }

    let assetObjectId = null;
    if (assetId) {
        const asset = await Asset.findOne({ id: assetId });
        if (!asset) {
            res.status(404);
            throw new Error(`Asset with ID '${assetId}' not found.`);
        }
        assetObjectId = asset._id;
    }

    let personnelObjectId = null;
    if (personnelId) {
        const personnel = await Personnel.findOne({ id: personnelId });
        if (!personnel) {
            res.status(404);
            throw new Error(`Personnel with ID '${personnelId}' not found.`);
        }
        personnelObjectId = personnel._id;
    }

    const expenditure = await Expenditure.create({
        description,
        amount,
        date: date ? new Date(date) : undefined, // Use provided date or default
        asset: assetObjectId,
        personnel: personnelObjectId
    });

    await expenditure.populate('asset', 'name id');
    await expenditure.populate('personnel', 'name id rank');

    res.status(201).json(expenditure);
});

// Add update/delete functions as needed
// @desc    Update an expenditure
// @route   PUT /api/expenditures/:id
// @access  Private
const updateExpenditure = asyncHandler(async (req, res) => {
    const { id } = req.params; // MongoDB _id of the expenditure
    const { description, amount, date, assetId, personnelId } = req.body;

    const expenditure = await Expenditure.findById(id);

    if (!expenditure) {
        res.status(404);
        throw new Error('Expenditure not found');
    }

    expenditure.description = description || expenditure.description;
    expenditure.amount = amount !== undefined ? amount : expenditure.amount;
    expenditure.date = date ? new Date(date) : expenditure.date;

    if (assetId) {
        const asset = await Asset.findOne({ id: assetId });
        if (!asset) {
            res.status(404);
            throw new Error(`Asset with ID '${assetId}' not found.`);
        }
        expenditure.asset = asset._id;
    } else if (assetId === null) { // Allow setting to null explicitly
        expenditure.asset = null;
    }

    if (personnelId) {
        const personnel = await Personnel.findOne({ id: personnelId });
        if (!personnel) {
            res.status(404);
            throw new Error(`Personnel with ID '${personnelId}' not found.`);
        }
        expenditure.personnel = personnel._id;
    } else if (personnelId === null) { // Allow setting to null explicitly
        expenditure.personnel = null;
    }

    const updatedExpenditure = await expenditure.save();

    await updatedExpenditure.populate('asset', 'name id');
    await updatedExpenditure.populate('personnel', 'name id rank');

    res.status(200).json(updatedExpenditure);
});

// @desc    Delete an expenditure
// @route   DELETE /api/expenditures/:id
// @access  Private
const deleteExpenditure = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const expenditure = await Expenditure.findByIdAndDelete(id);

    if (!expenditure) {
        res.status(404);
        throw new Error('Expenditure not found');
    }

    res.status(200).json({ message: 'Expenditure removed successfully', id: id });
});


module.exports = {
    getExpenditures,
    createExpenditure,
    updateExpenditure,
    deleteExpenditure
};