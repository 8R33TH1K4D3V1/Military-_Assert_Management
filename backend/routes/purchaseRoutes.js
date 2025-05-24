const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// GET all purchases (with optional filters)
router.get('/', purchaseController.getPurchases);

// POST a new purchase
router.post('/', purchaseController.createPurchase);

module.exports = router;