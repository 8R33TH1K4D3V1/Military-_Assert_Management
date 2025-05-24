// backend/routes/transferRoutes.js
const express = require('express');
const { createTransfer, getTransfers } = require('../controllers/transferController'); // Ensure paths are correct

const router = express.Router();

router.post('/', createTransfer); // Handles POST requests to /api/transfers
router.get('/', getTransfers);   // Handles GET requests to /api/transfers

module.exports = router; // Correctly exports the router