// Backend/controllers/aiController.js
const model = require('../config/gemini');
const prisma = require('../config/prisma');

// ─── ADVISOR ──────────────────────────────────────────────────────────────────
exports.advisor = async (req, res) => {
    try {
        const { tasks = [] } = req.body;

        if (tasks.length === 0) {
            return res.status(200).json({ insight: "Workstream is clear. Ready to initialize your first objective?" });
        }

        const taskSummary = tasks
            .slice(0, 15)
            .map(t => `"${t.title}" [${t.category || 'General'}] risk:${t.risk || 'Low'} progress:${t.progress ?? 0}%`)
            .join(', ');

        const prompt = `You are the Neural Brain, a helpful and sharp productivity co-pilot for the SMARTDO app.
Analyze this task list and provide ONE encouraging, actionable insight (max 20 words). 
Be supportive yet professional. Help the user feel in control of their workload. 
No fluff, no markdown.

Tasks: ${taskSummary}`;

        const result = await model.generateContent(prompt);
        const insight = result.response.text().trim();
        res.status(200).json({ insight });

    } catch (error) {
        res.status(200).json({ insight: "System stable. Standing by for your next command." });
    }
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
    try {
        const { message, tasks = [] } = req.body;

        if (!message) return res.status(400).json({ reply: "I'm listening. What's on your mind?" });

        const taskSummary = tasks.length > 0
            ? tasks.map(t => `- ${t.title} [${t.category}] ${t.progress}% complete`).join('\n')
            : "Your workstream is currently empty.";

        const prompt = `You are the "Neural Brain," the supportive AI assistant for the SMARTDO app. 
Your goal is to be helpful, clear, and encouraging. Use a "tech-savvy friend" tone. 
If the user asks about themselves, use the context provided. If they ask about features, explain how SMARTDO helps them stay organized. 
Max 3 sentences. Keep it friendly but efficient. No markdown.

Current Tasks:
${taskSummary}

User: ${message.trim()}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ reply: "I hit a connection glitch. Let's try that again." });
    }
};

// ─── SUGGEST ──────────────────────────────────────────────────────────────────
exports.suggestTask = async (req, res) => {
    try {
        const { taskTitle } = req.body;
        if (!taskTitle) return res.status(400).json({ message: "Which task shall we focus on?" });

        const prompt = `You are a supportive productivity coach. 
Give ONE friendly, actionable tip (max 2 sentences) to help the user start or finish: "${taskTitle.trim()}".
Make the goal feel achievable. No markdown.`;

        const result = await model.generateContent(prompt);
        const suggestion = result.response.text().trim();
        res.status(200).json({ suggestion });

    } catch (error) {
        res.status(500).json({ message: "Let's take it one step at a time. You've got this." });
    }
};