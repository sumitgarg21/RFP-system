// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with the connection string
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see the raw SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Supabase/Heroku connections
        }
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };