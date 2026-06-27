const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        enum: ['Admin', 'SuperAdmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Cleaner', 'Carpenter', 'panitiya', 'Other']
    },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema);
