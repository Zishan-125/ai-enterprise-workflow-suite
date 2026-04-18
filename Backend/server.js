require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 1. IMPORT ROUTES ---
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 3. API ROUTES ---
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// --- 4. START ENGINE ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log("🔄 Initializing Neural Engine...");

        app.listen(PORT, () => {
            console.log("------------------------------------------");
            console.log(`🚀 NEURAL ENGINE ONLINE | Port: ${PORT}`);
            console.log(`🧠 AI ADVISOR: Gemini Active`);
            console.log("------------------------------------------");
        });

    } catch (err) {
        console.error("❌ CRITICAL SYSTEM FAILURE:");
        console.error("Error Message:", err.message);
        process.exit(1);
    }
};

startServer();