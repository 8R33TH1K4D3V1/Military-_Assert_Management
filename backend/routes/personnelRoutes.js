// backend/routes/personnelRoutes.js
const express = require('express');
const router = express.Router();
const { getPersonnel, createPersonnel, updatePersonnel, deletePersonnel } = require('../controllers/personnelController');

router.route('/').get(getPersonnel).post(createPersonnel);
router.route('/:id').put(updatePersonnel).delete(deletePersonnel); // Routes for update and delete by personnel's custom ID

module.exports = router;