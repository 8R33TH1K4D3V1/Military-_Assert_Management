// backend/controllers/personnelController.js
const asyncHandler = require('express-async-handler');
const Personnel = require('../models/Personnel'); // Correct path
const Assignment = require('../models/Assignment'); // Needed for deletion check

// @desc    Get all personnel
// @route   GET /api/personnel
// @access  Public
const getPersonnel = asyncHandler(async (req, res) => {
    const personnel = await Personnel.find({});
    res.status(200).json(personnel);
});

// @desc    Create new personnel
// @route   POST /api/personnel
// @access  Private
const createPersonnel = asyncHandler(async (req, res) => {
    const { id, name, rank } = req.body;

    if (!id || !name || !rank) {
        res.status(400);
        throw new Error('Please include ID, name, and rank for personnel');
    }

    const personnelExists = await Personnel.findOne({ id });
    if (personnelExists) {
        res.status(400);
        throw new Error('Personnel with this ID already exists');
    }

    const personnel = await Personnel.create({
        id,
        name,
        rank,
    });

    res.status(201).json(personnel);
});

// @desc    Update personnel
// @route   PUT /api/personnel/:id
// @access  Private
const updatePersonnel = asyncHandler(async (req, res) => {
    const { id: personnelId } = req.params; // Get personnel ID from params
    const { name, rank } = req.body;

    const personnel = await Personnel.findOne({ id: personnelId });

    if (!personnel) {
        res.status(404);
        throw new Error('Personnel not found');
    }

    personnel.name = name || personnel.name;
    personnel.rank = rank || personnel.rank;

    const updatedPersonnel = await personnel.save();

    res.status(200).json(updatedPersonnel);
});

// @desc    Delete personnel
// @route   DELETE /api/personnel/:id
// @access  Private
const deletePersonnel = asyncHandler(async (req, res) => {
    const { id: personnelId } = req.params; // Get personnel ID from params

    const personnel = await Personnel.findOneAndDelete({ id: personnelId });

    if (!personnel) {
        res.status(404);
        throw new Error('Personnel not found');
    }

    // Check if the personnel is currently assigned any assets
    const activeAssignment = await Assignment.findOne({ personnel: personnel._id, returnDate: null });
    if (activeAssignment) {
        res.status(400);
        throw new Error(`Personnel '${personnel.name}' (ID: ${personnel.id}) is currently assigned an asset and cannot be deleted.`);
    }

    res.status(200).json({ message: `Personnel ${personnel.name} (ID: ${personnel.id}) removed` });
});

module.exports = {
    getPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
};