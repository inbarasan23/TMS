require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Programme = require('./models/Programme');
const Block = require('./models/Block');
const Room = require('./models/Room');
const Role = require('./models/Role');
const Complaint = require('./models/Complaint');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Connected for seeding');
    } catch (err) {
        console.error(' MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};

const seedDB = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Programme.deleteMany({});
        await Block.deleteMany({});
        await Room.deleteMany({});
        await Role.deleteMany({});
        await Complaint.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Seed Departments
        const depts = await Department.create([
            { deptName: 'School of Computer Studies', deptShortName: 'SCS' },
            { deptName: 'School of Commerce', deptShortName: 'SC' },
            { deptName: 'School of Management', deptShortName: 'SM' },
            { deptName: 'Science & Life Science', deptShortName: 'SLS' }
        ]);
        console.log('✅ Departments created');

        // Seed Programmes
        const progs = await Programme.create([
            // SCS
            { department: depts[0]._id, programmeName: 'Bachelor of Computer Applications', programmeShortName: 'BCA' },
            { department: depts[0]._id, programmeName: 'B.Sc. Computer Science', programmeShortName: 'B.Sc. CS' },
            { department: depts[0]._id, programmeName: 'B.Sc. Artificial Intelligence & Machine Learning', programmeShortName: 'AI&ML' },
            { department: depts[0]._id, programmeName: 'B.Sc. Information Technology', programmeShortName: 'B.Sc. IT' },
            { department: depts[0]._id, programmeName: 'M.Sc. Computer Science', programmeShortName: 'M.Sc. CS' },
            { department: depts[0]._id, programmeName: 'Master of Computer Applications', programmeShortName: 'MCA' },
            // SC
            { department: depts[1]._id, programmeName: 'Bachelor of Commerce', programmeShortName: 'B.Com' },
            { department: depts[1]._id, programmeName: 'B.Com Computer Application', programmeShortName: 'B.Com CA' },
            { department: depts[1]._id, programmeName: 'B.Com Information Technology', programmeShortName: 'B.Com IT' },
            // SM
            { department: depts[2]._id, programmeName: 'Business Administration', programmeShortName: 'BBA' },
            // SLS
            { department: depts[3]._id, programmeName: 'B.Sc. Biochemistry', programmeShortName: 'B.Sc. Biochemistry' }
        ]);
        console.log('✅ Programmes created');

        // Seed Blocks
        const blocks = await Block.create([
            { department: depts[0]._id, programme: progs[0]._id, blockName: 'Block-A' },
            { department: depts[0]._id, programme: progs[5]._id, blockName: 'Block-B' },
            { department: depts[1]._id, programme: progs[6]._id, blockName: 'Block-C' }
        ]);
        console.log('✅ Blocks created');

        // Seed Rooms
        await Room.create([
            { department: depts[0]._id, programme: progs[0]._id, block: blocks[0]._id, roomNumber: '101' },
            { department: depts[0]._id, programme: progs[0]._id, block: blocks[0]._id, roomNumber: '102' },
            { department: depts[0]._id, programme: progs[5]._id, block: blocks[1]._id, roomNumber: '201' },
            { department: depts[1]._id, programme: progs[6]._id, block: blocks[2]._id, roomNumber: '301' }
        ]);
        console.log('✅ Rooms created');

        // Seed Roles
        await Role.create([
            { roleName: 'SuperAdmin', description: 'Administrator with full access' },
            { roleName: 'User', description: 'Regular user who can raise complaints' },
            { roleName: 'Networking Staff', description: 'Network maintenance staff' },
            { roleName: 'Plumber', description: 'Plumbing maintenance' },
            { roleName: 'Electrician', description: 'Electrical maintenance' },
            { roleName: 'Software Developer', description: 'Software support' },
            { roleName: 'Cleaner', description: 'General cleaning and housekeeping' },
            { roleName: 'Carpenter', description: 'Carpentry and furniture maintenance' }
        ]);
        console.log('✅ Roles created');

        // Seed Users
        // NOTE: Do NOT hash the password here - let the User model's pre-save hook handle it
        const users = await User.create([
            {
                userName: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                phoneNumber: '8888888888',
                role: 'SuperAdmin',
                department: depts[0]._id,
                programme: progs[5]._id // MCA
            },
            {
                userName: 'HOD',
                email: 'hod@tms.com',
                password: '12345678',
                phoneNumber: '9999999998',
                role: 'User',
                department: depts[0]._id,
                programme: progs[0]._id // BCA
            },
            {
                userName: 'Network Staff',
                email: 'network@tms.com',
                password: '12345678',
                phoneNumber: '9999999997',
                role: 'Networking Staff',
                department: depts[0]._id,
                programme: progs[5]._id
            },
            {
                userName: 'Electrician',
                email: 'electrician@tms.com',
                password: '12345678',
                phoneNumber: '9999999996',
                role: 'Electrician',
                department: depts[1]._id,
                programme: progs[6]._id
            },
            {
                userName: 'Plumber',
                email: 'plumber@tms.com',
                password: '12345678',
                phoneNumber: '9999999995',
                role: 'Plumber',
                department: depts[1]._id,
                programme: progs[6]._id
            },
            {
                userName: 'Software Developer',
                email: 'developer@tms.com',
                password: '12345678',
                phoneNumber: '9999999994',
                role: 'Software Developer',
                department: depts[0]._id,
                programme: progs[5]._id
            }
        ]);
        console.log('✅ Users created');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nTest Login Credentials:');
        console.log('SuperAdmin: superadmin@tms.com / 12345678');
        console.log('HOD: hod@tms.com / 12345678');
        console.log('Network Staff: network@tms.com / 12345678');
        console.log('Electrician: electrician@tms.com / 12345678');
        console.log('Plumber: plumber@tms.com / 12345678');
        console.log('Software Developer: developer@tms.com / 12345678');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

connectDB().then(() => seedDB());
