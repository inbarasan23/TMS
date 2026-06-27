require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Programme = require('./models/Programme');

const ensure = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const existing = await User.findOne({ email: 'superadmin@tms.com' });
        if (existing) {
            console.log('SuperAdmin already exists. Updating password...');
            existing.password = '12345678';
            await existing.save();
            console.log('SuperAdmin password updated to 12345678');
        } else {
            console.log('SuperAdmin not found. Creating...');
            const dept = await Department.findOne({ deptName: 'School of Computer Studies' });
            const prog = await Programme.findOne({ programmeShortName: 'MCA' });

            if (!dept || !prog) {
                console.log('Error: No departments or programmes found. Please run full seed.');
                process.exit(1);
            }

            await User.create({
                userName: 'Super Admin',
                email: 'superadmin@tms.com',
                password: '12345678',
                phoneNumber: '8888888888',
                role: 'SuperAdmin',
                department: dept._id,
                programme: prog._id
            });
            console.log('SuperAdmin created successfully.');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

ensure();
