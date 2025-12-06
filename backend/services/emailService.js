// backend/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to generate HTML Table from items
const generateItemsTable = (items) => {
    if (!items || items.length === 0) return '';

    const rows = items.map(item => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.specs}</td>
    </tr>
  `).join('');

    return `
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px; font-family: Arial, sans-serif;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Specifications</th>
      </tr>
      ${rows}
    </table>
  `;
};

exports.sendRFPEmail = async (vendor, rfp) => {
    try {
        const details = rfp.procurement_details || {};
        const itemsTable = generateItemsTable(details.items);

        // Construct the HTML Body
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
        <h2>RFP Invitation: ${rfp.title}</h2>
        <p>Dear ${vendor.contact_name},</p>
        
        <p>We are inviting ${vendor.name} to submit a proposal for the following requirements:</p>
        
        ${itemsTable ? `<h3>📋 Required Items</h3>${itemsTable}` : ''}

        <h3>📅 Key Terms & Constraints</h3>
        <ul>
          <li><strong>Budget:</strong> ${rfp.budget ? `$${rfp.budget}` : 'Not specified'}</li>
          <li><strong>Delivery Deadline:</strong> ${rfp.delivery_deadline || 'Open'}</li>
          <li><strong>Warranty Required:</strong> ${rfp.warranty_req || 'Standard'}</li>
          <li><strong>Payment Terms:</strong> ${rfp.payment_terms || 'Standard'}</li>
        </ul>

        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3B82F6; margin-top: 20px;">
          <strong>Original Request Context:</strong><br/>
          <em>"${rfp.natural_language_input}"</em>
        </div>

        <p>Please reply to this email with your proposal attached (PDF format preferred).</p>
        
        <p>Best regards,<br/>Procurement Team</p>
      </div>
    `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: vendor.email,
            subject: `RFP Invitation: ${rfp.title} [Ref:${rfp.id}]`,
            html: htmlContent // Send HTML instead of plain text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${vendor.email}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};