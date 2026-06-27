const Complaint = require('../models/Complaint');
const User = require('../models/User');

// CREATE - Raise a new complaint
exports.raiseComplaint = async (req, res) => {
    try {
        const { department, programme, block, blockName, roomNumber, complaintType, complaintRemarks, attachment } = req.body;
        const complaint = await Complaint.create({
            department,
            programme,
            block,
            blockName,
            roomNumber,
            complaintType,
            complaintRemarks,
            attachment,
            user: req.user.id
        });
        res.status(201).json(complaint);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ - Get all complaints (based on user role)
exports.getComplaints = async (req, res) => {
    try {
        const userRole = req.user.role;
        let complaints = [];

        if (userRole === 'SuperAdmin') {
            // SuperAdmin sees all complaints
            complaints = await Complaint.find()
                .populate('user', 'userName email')
                .populate('assignedTo', 'userName email')
                .populate('department')
                .populate('programme')
                .populate('block');
        } else if (['Plumber', 'Electrician', 'Networking Staff', 'Software Developer'].includes(userRole)) {
            // Technician/Staff see only assigned complaints
            complaints = await Complaint.find({ assignedTo: req.user.id })
                .populate('user', 'userName email')
                .populate('assignedTo', 'userName email')
                .populate('department')
                .populate('programme')
                .populate('block');
        } else {
            // Regular users see only their own complaints
            complaints = await Complaint.find({ user: req.user.id })
                .populate('user', 'userName email')
                .populate('assignedTo', 'userName email')
                .populate('department')
                .populate('programme')
                .populate('block');
        }

        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ - Get complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'userName email')
            .populate('assignedTo', 'userName email')
            .populate('department')
            .populate('programme')
            .populate('block');

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE - Assign complaint to staff (Admin only)
exports.assignComplaint = async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedTo, status: 'Assigned', updatedAt: new Date() },
            { new: true }
        ).populate('assignedTo', 'userName email');

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.json(complaint);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE - Change complaint status (Admin or assigned staff)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        // Check permissions
        const isSuperAdmin = req.user.role === 'SuperAdmin';
        const isAssignedStaff = complaint.assignedTo && complaint.assignedTo.toString() === req.user.id;

        if (!isSuperAdmin && !isAssignedStaff) {
            return res.status(403).json({ message: "You don't have permission to update this complaint" });
        }

        complaint.status = status;
        complaint.updatedAt = new Date();
        await complaint.save();

        res.json(complaint);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ - Get complaint statistics (Dashboard)
exports.getComplaintStats = async (req, res) => {
    try {
        const userRole = req.user.role;
        let filter = {};

        if (userRole === 'SuperAdmin') {
            // SuperAdmin sees all
            filter = {};
        } else if (['Plumber', 'Electrician', 'Networking Staff', 'Software Developer'].includes(userRole)) {
            // Staff sees only assigned to them
            filter = { assignedTo: req.user.id };
        } else {
            // Users see only their own
            filter = { user: req.user.id };
        }

        const total = await Complaint.countDocuments(filter);
        const pending = await Complaint.countDocuments({ ...filter, status: 'Pending' });
        const assigned = await Complaint.countDocuments({ ...filter, status: 'Assigned' });
        const inProgress = await Complaint.countDocuments({ ...filter, status: 'In-Progress' });
        const onHold = await Complaint.countDocuments({ ...filter, status: 'On-Hold' });
        const closed = await Complaint.countDocuments({ ...filter, status: 'Completed' });

        res.json({
            total,
            pending,
            assigned,
            inProgress,
            onHold,
            closed
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE - Delete complaint (Admin only)
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.json({ message: "Complaint deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// OLD FUNCTION - Kept for backward compatibility
exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
