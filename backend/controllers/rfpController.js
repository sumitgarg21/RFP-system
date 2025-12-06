const { RFP, Vendor } = require('../models');
const emailService = require('../services/emailService');
const aiService = require('../services/aiService');
const imapService = require('../services/imapService');

// Get all RFPs
exports.getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(rfps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new RFP (Manual/Basic for now)
exports.createRFP = async (req, res) => {
  try {
    const { title, natural_language_input } = req.body;

    if (!title || !natural_language_input) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // placeholder: We will add AI parsing logic here later
    const newRFP = await RFP.create({
      title,
      natural_language_input,
      status: 'DRAFT'
    });

    res.status(201).json(newRFP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRFPById = async (req, res) => {
  try {
    const { id } = req.params;
    const rfp = await RFP.findByPk(id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRFP = async (req, res) => {
  try {
    const { title, natural_language_input } = req.body;

    if (!title || !natural_language_input) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    console.log("🤖 Asking AI to parse requirements...");

    // 1. Call AI Service
    const aiData = await aiService.parseRFPRequirements(natural_language_input);
    console.log("✅ AI Parsed Data:", aiData);

    // 2. Create RFP with merged data
    const newRFP = await RFP.create({
      title,
      natural_language_input,
      status: 'DRAFT',
      procurement_details: aiData, // Save the full JSON structure
      budget: aiData.budget || null,
      delivery_deadline: aiData.delivery_deadline || null,
      payment_terms: aiData.payment_terms || null,
      warranty_req: aiData.warranty_req || null
    });

    res.status(201).json(newRFP);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendRFPToVendors = async (req, res) => {
  try {
    const { rfpId } = req.params;
    const { vendorIds } = req.body; // Array of vendor UUIDs

    // 1. Fetch the RFP
    const rfp = await RFP.findByPk(rfpId);
    if (!rfp) return res.status(404).json({ error: 'RFP not found' });

    // 2. Fetch all selected Vendors
    const vendors = await Vendor.findAll({
      where: {
        id: vendorIds
      }
    });

    if (vendors.length === 0) {
      return res.status(400).json({ error: 'No valid vendors selected' });
    }

    // 3. Send Email to each Vendor (in parallel)
    const emailPromises = vendors.map(vendor =>
      emailService.sendRFPEmail(vendor, rfp)
    );

    await Promise.all(emailPromises);

    // 4. Update RFP Status
    rfp.status = 'SENT';
    await rfp.save();

    res.json({ message: `RFP sent successfully to ${vendors.length} vendors.` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkReplies = async (req, res) => {
  try {
    const proposals = await imapService.fetchAndParseReplies();
    res.json({
      message: `Checked inbox. Found ${proposals.length} new proposals.`,
      new_proposals: proposals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProposalsByRFP = async (req, res) => {
  try {
    const { rfpId } = req.params;
    // We need to include Vendor data to show names
    const { Proposal, Vendor } = require('../models');

    const proposals = await Proposal.findAll({
      where: { rfp_id: rfpId },
      include: [{ model: Vendor, attributes: ['name', 'email'] }]
    });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};