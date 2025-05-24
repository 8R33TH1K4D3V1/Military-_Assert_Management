// backend/controllers/assetController.js
const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset'); // Correct path to your Asset model

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public (or Private, depending on your auth setup)
const getAssets = asyncHandler(async (req, res) => {
    const assets = await Asset.find({});
    res.status(200).json(assets);
});

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private (e.g., admin only)
const createAsset = asyncHandler(async (req, res) => {
    const { id, name, status } = req.body;

    if (!id || !name) {
        res.status(400);
        throw new Error('Please include an ID and name for the asset');
    }

    // Check if asset ID already exists
    const assetExists = await Asset.findOne({ id });
    if (assetExists) {
        res.status(400);
        throw new Error('Asset with this ID already exists');
    }

    const asset = await Asset.create({
        id,
        name,
        status: status || 'Available', // Default to Available if not provided
    });

    res.status(201).json(asset);
});

// @desc    Update an asset
// @route   PUT /api/assets/:id
// @access  Private (e.g., admin only)
const updateAsset = asyncHandler(async (req, res) => {
    const { id: assetId } = req.params; // Get the asset ID from params
    const { name, status } = req.body;

    // Find the asset by its custom 'id' field
    const asset = await Asset.findOne({ id: assetId });

    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    // Update fields
    asset.name = name || asset.name;
    asset.status = status || asset.status;

    const updatedAsset = await asset.save(); // Save the changes

    res.status(200).json(updatedAsset);
});


// @desc    Delete an asset
// @route   DELETE /api/assets/:id
// @access  Private (e.g., admin only)
const deleteAsset = asyncHandler(async (req, res) => {
    const { id: assetId } = req.params; // Get the asset ID from params

    // Find and delete the asset by its custom 'id' field
    const asset = await Asset.findOneAndDelete({ id: assetId });

    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    // Check if the asset is currently assigned before deleting
    // (This is a good practice to prevent orphaned assignments)
    const activeAssignment = await Assignment.findOne({ asset: asset._id, returnDate: null });
    if (activeAssignment) {
        res.status(400);
        throw new Error(`Asset '${asset.name}' (ID: ${asset.id}) is currently assigned and cannot be deleted.`);
    }

    res.status(200).json({ message: `Asset ${asset.name} (ID: ${asset.id}) removed` });
});


module.exports = {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
};