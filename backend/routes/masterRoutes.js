const express = require('express');
const router = express.Router();
const {
    addDepartment,
    getDepartments,
    addProgramme,
    getProgrammes,
    addBlock,
    getBlocks,
    addRoom,
    getRooms,
    addRole,
    getRoles,
    getAllUsers,
    addUser,
    updateUser
} = require('../controllers/masterController');

const { protect, authorize } = require('../middleware/authMiddleware');

// --- PROTECT ALL ROUTES BELOW ---
router.use(protect);

// 01. Department Routes
// POST - Create Department
router.post('/department', authorize('SuperAdmin'), addDepartment);
router.get('/department', getDepartments);

// 02. Programme Routes
// POST - Create Programme
router.post('/programme', authorize('SuperAdmin'), addProgramme);
router.get('/programme', getProgrammes);

// 03. Block Routes
// POST - Create Block
router.post('/block', authorize('SuperAdmin'), addBlock);
router.get('/block', getBlocks);

// 04. Room Routes
// POST - Create Room
router.post('/room', authorize('SuperAdmin'), addRoom);
router.get('/room', getRooms);

// 05. Role Routes
// POST - Create Role
router.post('/role', authorize('SuperAdmin'), addRole);
router.get('/role', getRoles);

// 06. User Screen Routes
// GET & POST & PUT - Manage Users
router.get('/users', authorize('SuperAdmin'), getAllUsers);
router.post('/users', authorize('SuperAdmin'), addUser);
router.put('/users/:id', authorize('SuperAdmin'), updateUser);

module.exports = router;