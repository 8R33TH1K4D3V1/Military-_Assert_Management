// backend/routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, returnAssignment } = require('../controllers/assignmentController');

router.route('/').get(getAssignments).post(createAssignment);
router.route('/:id/return').put(returnAssignment); // Specific route to mark an assignment as returned

module.exports = router;