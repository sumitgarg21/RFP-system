// backend/models/Proposal.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proposal = sequelize.define('Proposal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // We don't manually define rfp_id or vendor_id here. 
    // Sequelize adds them automatically when we define associations below.

    raw_email_body: {
        type: DataTypes.TEXT // The full email content
    },
    attachment_info: {
        type: DataTypes.JSONB // Metadata about attached PDFs
    },
    ai_extracted_data: {
        type: DataTypes.JSONB, // The structured data parsed by AI
        defaultValue: {}
    },
    ai_evaluation_score: {
        type: DataTypes.INTEGER, // e.g., 85 out of 100
        defaultValue: 0
    },
    ai_evaluation_reasoning: {
        type: DataTypes.TEXT // "Selected because price is lowest..."
    }
}, {
    timestamps: true
});

module.exports = Proposal;