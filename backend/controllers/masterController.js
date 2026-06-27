const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const Room = require('../models/Room');
const User = require('../models/User');
const Role = require('../models/Role');

// 01. Department
exports.addDepartment = async (req, res) => {
    try {
        const data = await Department.create(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getDepartments = async (req, res) => {
    const data = await Department.find();
    res.json(data);
};

// 02. Programme
exports.addProgramme = async (req, res) => {
    try {
        const data = await Programme.create(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getProgrammes = async (req, res) => {
    try {
        const data = await Programme.find().populate('department');
        res.json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// 03. Block
exports.addBlock = async (req, res) => {
    try {
        const data = await Block.create(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getBlocks = async (req, res) => {
    try {
        const data = await Block.find().populate('department').populate('programme');
        res.json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// 04. Room
exports.addRoom = async (req, res) => {
    try {
        const data = await Room.create(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getRooms = async (req, res) => {
    try {
        const data = await Room.find().populate('department').populate('programme').populate('block');
        res.json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// 05. Role
exports.addRole = async (req, res) => {
    try {
        const data = await Role.create(req.body);
        res.status(201).json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getRoles = async (req, res) => {
    try {
        const data = await Role.find();
        res.json(data);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// 06. User Screen
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
};