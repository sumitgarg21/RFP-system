// backend/models/Vendor.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vendor = sequelize.define('Vendor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUIDs like '550e8400-e29b...'
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true // Validates email format automatically
        },
        unique: true // No duplicate emails allowed
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true // Adds created_at and updated_at automatically
});

module.exports = Vendor;