require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');

const rolesToEnsure = [
    { roleName: 'SuperAdmin', description: 'Administrator with full access' },
    { roleName: 'User', description: 'Regular user who can raise complaints' },
    { roleName: 'Networking Staff', description: 'Network maintenance staff' },
    { roleName: 'Plumber', description: 'Plumbing maintenance' },
    { roleName: 'Electrician', description: 'Electrical maintenance' },
    { roleName: 'Software Developer', description: 'Software support' },
    { roleName: 'Cleaner', description: 'General cleaning and housekeeping' },
    { roleName: 'Carpenter', description: 'Carpentry and furniture maintenance' },
    { roleName: 'panitiya', description: 'Water and sanitation maintenance' },
    { roleName: 'Other', description: 'Other maintenance or miscellaneous role' }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for role ensuring');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};

const ensureRoles = async () => {
    try {
        for (const roleData of rolesToEnsure) {
            const existingRole = await Role.findOne({ roleName: roleData.roleName });
            if (!existingRole) {
                await Role.create(roleData);
                console.log(`✅ Role added: ${roleData.roleName}`);
            } else {
                console.log(`ℹ️ Role already exists: ${roleData.roleName}`);
            }
        }
        console.log('\n✅ All roles verified/added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Role ensuring failed:', err.message);
        process.exit(1);
    }
};

connectDB().then(() => ensureRoles());
