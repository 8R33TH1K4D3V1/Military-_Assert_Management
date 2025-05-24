// backend/controllers/assignmentController.js
const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const Personnel = require('../models/Personnel');
const Assignment = require('../models/Assignment');

// --- Helper function to seed initial data (optional, for development) ---
// Call this once at application startup (e.g., in server.js)
const seedInitialData = async () => {
    try {
        const [assetCount, personnelCount] = await Promise.all([
            Asset.countDocuments(),
            Personnel.countDocuments()
        ]);

        if (assetCount === 0 || personnelCount === 0) {
            console.log('Seeding initial assets and personnel for assignments...');
            const dummyAssets = [
                { id: 'AST001', name: 'M16 Rifle', status: 'Available' },
                { id: 'AST002', name: 'Humvee', status: 'Available' },
                { id: 'AST003', name: 'Night Vision Goggles', status: 'Available' },
                { id: 'AST004', name: 'First Aid Kit', status: 'Available' },
            ];
            const dummyPersonnel = [
                { id: 'P001', name: 'John Doe', rank: 'Captain' },
                { id: 'P002', name: 'Jane Smith', rank: 'Sergeant' },
                { id: 'P003', name: 'Mike Johnson', rank: 'Specialist' },
            ];

            await Promise.allSettled([
                Asset.insertMany(dummyAssets, { ordered: false }),
                Personnel.insertMany(dummyPersonnel, { ordered: false })
            ]).then(results => {
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        const err = result.reason;
                        if (err.writeErrors) {
                            err.writeErrors.forEach(e => {
                                if (e.err.code !== 11000) console.error(`Seeding error (${index === 0 ? 'Asset' : 'Personnel'}):`, e.message);
                            });
                        } else {
                            console.error(`General seeding error (${index === 0 ? 'Asset' : 'Personnel'}):`, err.message);
                        }
                    }
                });
            });
            console.log('Dummy assets and personnel ensured for assignment seeding.');
        } else {
            console.log('Assets and personnel collections already contain data, skipping initial seeding.');
        }
    } catch (error) {
        console.error('Error during initial data seeding check:', error.message);
    }
};


// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
const getAssignments = asyncHandler(async (req, res) => {
    const assignments = await Assignment.find({})
        .populate('asset')    // Populate the asset details
        .populate('personnel') // Populate the personnel details
        .sort({ assignmentDate: -1 });

    res.status(200).json(assignments);
});

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Public
const createAssignment = asyncHandler(async (req, res) => {
    const { assetId, personnelId, assignmentDate } = req.body;

    if (!assetId || !personnelId || !assignmentDate) {
        res.status(400);
        throw new Error('Please provide asset ID, personnel ID, and assignment date.');
    }

    // Find asset and personnel by their custom 'id' fields
    const asset = await Asset.findOne({ id: assetId });
    const personnel = await Personnel.findOne({ id: personnelId });

    if (!asset) {
        res.status(404);
        throw new Error(`Asset with ID '${assetId}' not found.`);
    }
    if (!personnel) {
        res.status(404);
        throw new Error(`Personnel with ID '${personnelId}' not found.`);
    }

    if (asset.status === 'Assigned') {
        res.status(400);
        throw new Error(`Asset '${asset.name}' (ID: ${asset.id}) is already assigned. Please return it first.`);
    }

    const newAssignment = new Assignment({
        asset: asset._id,       // Use Mongoose ObjectId from the found asset
        personnel: personnel._id, // Use Mongoose ObjectId from the found personnel
        assignmentDate: new Date(assignmentDate),
    });

    await newAssignment.save();

    // Update asset status to 'Assigned'
    asset.status = 'Assigned';
    await asset.save();

    // Populate the newly created assignment for the response
    await newAssignment.populate('asset');
    await newAssignment.populate('personnel');

    res.status(201).json({
        message: 'Asset assigned successfully!',
        assignment: newAssignment
    });
});

// @desc    Mark an assignment as returned (and update asset status)
// @route   PUT /api/assignments/:id/return
// @access  Public
const returnAssignment = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assignment ID (MongoDB _id)

    const assignment = await Assignment.findById(id).populate('asset'); // Populate asset to update its status

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found.');
    }

    if (assignment.returnDate) {
        res.status(400);
        throw new Error('This assignment has already been returned.');
    }

    assignment.returnDate = new Date(); // Set return date to now
    await assignment.save();

    // Update asset status to 'Available' if the asset exists
    if (assignment.asset) {
        assignment.asset.status = 'Available';
        await assignment.asset.save();
    }

    await assignment.populate('personnel'); // Re-populate personnel for the response

    res.status(200).json({
        message: 'Asset successfully returned!',
        assignment: assignment
    });
});

module.exports = {
    getAssignments,
    createAssignment,
    returnAssignment,
    seedInitialData // Export this so it can be called from server.js
};