// Backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { advisor, chat, suggestTask, prioritizeTasks } = require('../controllers/aiController');

// POST /api/ai/advisor  — dashboard insight (tasks sent in body)
router.post('/advisor', auth, advisor);

// POST /api/ai/chat     — Neural Brain conversation (tasks sent in body)
router.post('/chat', auth, chat);

// POST /api/ai/suggest  — tip for a single task
router.post('/suggest', auth, suggestTask);

// POST /api/ai/prioritize — AI ranks active tasks fetched from DB
router.post('/prioritize', auth, prioritizeTasks);

module.exports = router;