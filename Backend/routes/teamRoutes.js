const express = require('express');
const router = express.Router();
// Assuming you are using the controller logic from earlier
const teamController = require('../controllers/teamController');

// This matches the POST request from your frontend
router.post('/invite', teamController.inviteMember);
router.get('/', teamController.getTeam);

module.exports = router;