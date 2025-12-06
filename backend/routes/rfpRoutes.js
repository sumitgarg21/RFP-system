const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

router.get('/', rfpController.getAllRFPs);
router.post('/', rfpController.createRFP);
router.get('/:id', rfpController.getRFPById);
router.post('/:rfpId/send', rfpController.sendRFPToVendors);
router.post('/check-replies', rfpController.checkReplies);
router.get('/:rfpId/proposals', rfpController.getProposalsByRFP);

module.exports = router;