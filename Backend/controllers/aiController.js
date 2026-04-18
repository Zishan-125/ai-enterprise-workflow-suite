// Backend/controllers/aiController.js
const model = require('../config/gemini');
const prisma = require('../config/prisma');

// ─── ADVISOR ──────────────────────────────────────────────────────────────────
// POST /api/ai/advisor
// Body: { tasks: Task[] }
// Returns one-sentence dashboard insight. Auth optional (tasks sent from client).
exports.advisor = async (req, res) => {
    try {
        const { tasks = [] } = req.body;

        if (tasks.length === 0) {
            return res.status(200).json({ insight: "No active tasks detected. Initialize your workstream to begin." });
        }

        const taskSummary = tasks
            .slice(0, 15)
            .map(t => `"${t.title}" [${t.category || 'General'}] risk:${t.risk || 'N/A'} progress:${t.progress ?? 0}%`)
            .join(', ');

        const prompt = `You are a sharp AI productivity advisor for SMARTDO, a cyberpunk task management app.
Analyze this task list and give ONE concise insight sentence (max 20 words) about the user's workload or priorities.
Be direct, slightly tech-flavored. No fluff, no quotes, no markdown.

Tasks: ${taskSummary}`;

        const result = await model.generateContent(prompt);
        const insight = result.response.text().trim();

        res.status(200).json({ insight });

    } catch (error) {
        console.error("AI Advisor Error:", error);
        res.status(200).json({ insight: "Neural link unstable. System status: Nominal." });
    }
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// Body: { message: string, tasks: Task[] }
// Tasks sent from the client (AIDrawer already holds them in state).
exports.chat = async (req, res) => {
    try {
        const { message, tasks = [] } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ reply: "Message is required." });
        }

        const taskSummary = tasks.length > 0
            ? tasks.map(t => `- ${t.title} [${t.category || 'General'}]${t.risk ? ` risk:${t.risk}` : ''}${t.progress != null ? ` ${t.progress}%` : ''}`).join('\n')
            : "No active tasks in the workstream.";

        const prompt = `You are the "Neural Brain" — a sharp AI productivity assistant inside SMARTDO, a cyberpunk task management app. You are concise, confident, and slightly tech-flavored. Max 3 sentences per reply. No markdown.

User's current task matrix:
${taskSummary}

User: ${message.trim()}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();

        res.status(200).json({ reply });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ reply: "Neural Brain disconnected. Try again." });
    }
};

// ─── SUGGEST ──────────────────────────────────────────────────────────────────
// POST /api/ai/suggest
// Body: { taskTitle: string }
exports.suggestTask = async (req, res) => {
    try {
        const { taskTitle } = req.body;

        if (!taskTitle || taskTitle.trim().length === 0) {
            return res.status(400).json({ message: "Task title is required." });
        }

        const prompt = `You are a focused productivity AI for SMARTDO app.
Give ONE actionable tip (max 2 sentences) for completing this task faster: "${taskTitle.trim()}"
Be direct and practical. Slight cyberpunk tone. No markdown, no bullet points.`;

        const result = await model.generateContent(prompt);
        const suggestion = result.response.text().trim();

        res.status(200).json({ suggestion });

    } catch (error) {
        console.error("AI Suggest Error:", error);
        res.status(500).json({ message: "Neural Engine failure. Try again." });
    }
};

// ─── PRIORITIZE ───────────────────────────────────────────────────────────────
// POST /api/ai/prioritize  (requires auth — fetches tasks from DB for the user)
exports.prioritizeTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await prisma.task.findMany({
            where: { userId, completed: false },
            select: { id: true, title: true, priority: true },
        });

        if (tasks.length === 0) {
            return res.status(200).json({ message: "No active tasks to prioritize.", ranked: [] });
        }

        const taskList = tasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n');

        const prompt = `You are a productivity AI. Rank these tasks from highest to lowest priority and give a one-sentence reason for the top task only. Reply ONLY as valid JSON with no extra text or markdown fences:
{"ranked":[{"id_index":1,"reason":"string or null"}]}

Tasks:
${taskList}`;

        const result = await model.generateContent(prompt);
        let raw = result.response.text().trim().replace(/```json|```/g, '').trim();

        const parsed = JSON.parse(raw);
        const ranked = parsed.ranked.map(r => ({
            ...tasks[r.id_index - 1],
            reason: r.reason || null,
        }));

        res.status(200).json({ ranked });

    } catch (error) {
        console.error("AI Prioritize Error:", error);
        res.status(500).json({ message: "Prioritization engine offline." });
    }
};