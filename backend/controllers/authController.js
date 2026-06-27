const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        // Generate userName from email if not provided
        const userData = {
            ...req.body,
            userName: req.body.userName || email.split('@')[0]
        };
        
        const user = await User.create(userData);
        res.status(201).json({ message: "User registered successfully", user: { id: user._id, email: user.email } });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            token, 
            role: user.role, 
            userName: user.userName,
            userId: user._id,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};