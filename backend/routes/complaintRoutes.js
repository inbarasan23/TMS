const express = require('express');
const router = express.Router();
const {
    raiseComplaint,
    getComplaints,
    getComplaintById,
    assignComplaint,
    updateComplaintStatus,
    getComplaintStats,
    deleteComplaint,
    getUserComplaints
} = require('../controllers/complaintController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All complaint routes require authentication
router.use(protect);

// POST - Raise a complaint (Users & SuperAdmin)
router.post('/', authorize('User', 'SuperAdmin'), raiseComplaint);

// GET - Get complaints (role-based filtering)
router.get('/', getComplaints);

// GET - Get complaint statistics
router.get('/stats', getComplaintStats);

// GET - Get specific complaint
router.get('/:id', getComplaintById);

// PUT - Assign complaint (SuperAdmin only)
router.put('/assign/:id', authorize('SuperAdmin'), assignComplaint);

// PUT - Update complaint status (SuperAdmin or Tech Staff)
router.put('/status/:id', authorize('SuperAdmin', 'Plumber', 'Electrician', 'Networking Staff', 'Software Developer'), updateComplaintStatus);

// DELETE - Delete complaint (SuperAdmin only)
router.delete('/:id', authorize('SuperAdmin'), deleteComplaint);

module.exports = router;
