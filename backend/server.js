require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Another process is listening on this port.`);
        console.error('Tip: stop the other process or change the PORT environment variable.');
        process.exit(1);
    }console.error('Server error:', err);
    process.exit(1);
});process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    setTimeout(() => process.exit(1), 100);
});process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    setTimeout(() => process.exit(1), 100);
});