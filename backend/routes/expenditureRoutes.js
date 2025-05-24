// backend/routes/expenditureRoutes.js
const express = require('express');
const router = express.Router();
const { getExpenditures, createExpenditure, updateExpenditure, deleteExpenditure } = require('../controllers/expenditureController');

router.route('/').get(getExpenditures).post(createExpenditure);
router.route('/:id').put(updateExpenditure).delete(deleteExpenditure);

module.exports = router;