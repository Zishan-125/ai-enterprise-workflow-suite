const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-1.5-flash for speed or gemini-1.5-pro for complex reasoning
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 200, // Slightly more room for "Cyberpunk" flair
    },
});

module.exports = model;