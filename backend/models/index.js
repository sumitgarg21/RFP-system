// backend/models/index.js
const Vendor = require('./Vendor');
const RFP = require('./RFP');
const Proposal = require('./Proposal');

// --- Define Relationships ---

// 1. A Vendor can submit many Proposals
Vendor.hasMany(Proposal, { foreignKey: 'vendor_id' });
Proposal.belongsTo(Vendor, { foreignKey: 'vendor_id' });

// 2. An RFP can have many Proposals
RFP.hasMany(Proposal, { foreignKey: 'rfp_id' });
Proposal.belongsTo(RFP, { foreignKey: 'rfp_id' });

// Export everything
module.exports = {
    Vendor,
    RFP,
    Proposal
};