// backend/services/imapService.js
const imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const { RFP, Vendor, Proposal } = require('../models');
const aiService = require('./aiService');
require('dotenv').config();

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000
    }
};

exports.fetchAndParseReplies = async () => {
    let connection;
    const newProposals = [];

    try {
        connection = await imap.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN', ['HEADER', 'SUBJECT', 'Ref:']];
        const fetchOptions = { bodies: [''], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("📭 No new vendor replies found.");
            return [];
        }

        console.log(`📬 Found ${messages.length} new replies. Processing...`);

        for (const item of messages) {

            const part = item.parts.find(p => p.which === '');
            const rawEmail = part.body;

            const mail = await simpleParser(rawEmail);

            if (!mail.from?.value?.[0]) {
                console.warn("⚠️ Email missing FROM address, skipping.");
                continue;
            }

            const subject = mail.subject || "";
            const fromEmail = mail.from.value[0].address;
            const body = mail.text || "";

            if (!fromEmail) {
                console.warn("⚠️ Email missing FROM address, skipping.");
                continue;
            }

            // Extract RFP ID from subject: "Ref:xxxxx"
            const match = subject.match(/Ref:([a-zA-Z0-9-]+)/);
            if (!match) {
                console.warn(`⚠️ Unable to find RFP ID in subject: ${subject}`);
                continue;
            }

            const rfpId = match[1].replace("]", "");

            // Vendor Lookup
            const vendor = await Vendor.findOne({ where: { email: fromEmail } });

            if (!vendor) {
                console.warn(`⚠️ Received mail from unknown vendor: ${fromEmail}`);
                continue;
            }

            // AI Extract
            let aiData = {};
            try {
                aiData = await aiService.parseVendorProposal(body);
            } catch (err) {
                console.error("❌ AI parsing error:", err);
                aiData = {};
            }

            // Save proposal
            const proposal = await Proposal.create({
                rfp_id: rfpId,
                vendor_id: vendor.id,
                raw_email_body: body,
                ai_extracted_data: aiData,
                received_at: new Date()
            });

            newProposals.push(proposal);

            console.log(`✅ Processed proposal from ${vendor.name} for RFP ${rfpId}`);
        }

        return newProposals;

    } catch (error) {
        console.error("❌ IMAP Error:", error);
        throw error;
    } finally {
        if (connection) {
            connection.end();
        }
    }
};
