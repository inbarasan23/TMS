require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Programme = require('./models/Programme');

const usersToEnsure = [
    {
        email: 'admin@tms.com',
        userName: 'Admin',
        password: '12345678',
        role: 'SuperAdmin', // Fixed from Admin to SuperAdmin
        phoneNumber: '9999999999'
    },
    {
        userName: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'SuperAdmin',
        phoneNumber: '8888888888'
    },
    {
        email: 'hod@tms.com',
        userName: 'HOD',
        password: '12345678',
        role: 'User',
        phoneNumber: '9999999998'
    },
    {
        email: 'network@tms.com',
        userName: 'Network Staff',
        password: '12345678',
        role: 'Networking Staff',
        phoneNumber: '9999999997'
    },
    {
        email: 'electrician@tms.com',
        userName: 'Electrician',
        password: '12345678',
        role: 'Electrician',
        phoneNumber: '9999999996'
    }
];

const ensureAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dept = await Department.findOne({ deptName: 'School of Computer Studies' });
        const prog = await Programme.findOne({ programmeShortName: 'MCA' });

        if (!dept || !prog) {
            console.log('❌ Error: Departments or Programmes missing. Please run "npm run seed" first.');
            process.exit(1);
        }

        for (const u of usersToEnsure) {
            const existing = await User.findOne({ email: u.email });
            if (existing) {
                console.log(`Updating password for ${u.userName} (${u.role})...`);
                existing.password = u.password; // Will be hashed by pre-save
                existing.role = u.role; // Ensure role is correct
                await existing.save();
                console.log(`✅ ${u.userName} updated.`);
            } else {
                console.log(`Creating ${u.userName} (${u.role})...`);
                await User.create({
                    ...u,
                    department: dept._id,
                    programme: prog._id
                });
                console.log(`✅ ${u.userName} created.`);
            }
        }

        console.log('\n🎉 All default users verified and updated!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

ensureAll();
