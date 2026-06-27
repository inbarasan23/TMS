const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme' },
    blockName: { type: String, required: true }
});

module.exports = mongoose.model('Block', BlockSchema);