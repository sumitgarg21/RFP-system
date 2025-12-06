// backend/models/RFP.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RFP = sequelize.define('RFP', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    natural_language_input: {
        type: DataTypes.TEXT, // The original user prompt
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('DRAFT', 'SENT', 'CLOSED', 'AWARDED'),
        defaultValue: 'DRAFT'
    },
    procurement_details: {
        type: DataTypes.JSONB, // Stores the complex AI output (items, quantity, specs)
        defaultValue: {}
    },
    budget: {
        type: DataTypes.DECIMAL(10, 2) // e.g., 50000.00
    },
    delivery_deadline: {
        type: DataTypes.DATEONLY
    },
    payment_terms: {
        type: DataTypes.STRING // e.g., "Net 30"
    },
    warranty_req: {
        type: DataTypes.STRING // e.g., "1 Year"
    }
}, {
    timestamps: true
});

module.exports = RFP;