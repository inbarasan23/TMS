const mongoose = require('mongoose');

const ProgrammeSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    programmeName: { type: String, required: true },
    programmeShortName: { type: String, required: true }
});

module.exports = mongoose.model('Programme', ProgrammeSchema);