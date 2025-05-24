
// backend/routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const { getAssets, createAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

router.route('/').get(getAssets).post(createAsset);
router.route('/:id').put(updateAsset).delete(deleteAsset); // Routes for update and delete by asset's custom ID

module.exports = router;