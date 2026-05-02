const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamController');


router.post('/invite', teamController.inviteMember);
router.get('/', teamController.getTeam);

module.exports = router;