const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme' },
    block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block' },
    roomNumber: { type: String, required: true }
});

module.exports = mongoose.model('Room', RoomSchema);