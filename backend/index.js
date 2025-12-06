// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { sequelize } = require('./models');

// Import Route Files
const vendorRoutes = require('./routes/vendorRoutes');
const rfpRoutes = require('./routes/rfpRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Middleware
app.use(express.json());

// --- MOUNT ROUTES ---
app.use('/api/vendors', vendorRoutes);
app.use('/api/rfps', rfpRoutes);
// --------------------

app.get('/', (req, res) => {
    res.send('API is running...');
});

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('✅ Database & Tables synced!');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();