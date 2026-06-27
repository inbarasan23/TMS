const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
    blockName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    complaintType: { 
        type: String, 
        enum: ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'],
        required: true 
    },
    complaintRemarks: { type: String, required: true },
    attachment: { type: String }, // Store URL or file path
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned Staff/Technician
    status: { 
        type: String, 
        enum: ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed'],
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);