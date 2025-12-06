const { Vendor } = require('../models');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, contact_name, email, phone, address } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const newVendor = await Vendor.create({
      name,
      contact_name,
      email,
      phone,
      address
    });

    res.status(201).json(newVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};