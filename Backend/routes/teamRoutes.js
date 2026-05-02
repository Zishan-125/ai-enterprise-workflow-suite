const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/authMiddleware'); // Import your auth middleware

// Protect these routes so only logged-in "Nodes" can access them
router.get('/', auth, teamController.getTeam);
router.post('/invite', auth, teamController.inviteMember);

module.exports = router;