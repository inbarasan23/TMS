const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    deptName: { type: String, required: true },
    deptShortName: { type: String, required: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);