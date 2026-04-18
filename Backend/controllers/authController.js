const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- LOGIN FUNCTION ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid Neural Signature (User not found)." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Secret Key." });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("❌ CRITICAL: JWT_SECRET missing from .env");
            return res.status(500).json({ message: "Auth Engine Config Error" });
        }

        const token = jwt.sign(
            { id: user.id, isPro: user.is_pro },
            secret,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: { 
                name: user.name, 
                isPro: user.is_pro === 1 || user.is_pro === true 
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Authentication Engine Error." });
    }
};

// --- SIGNUP FUNCTION (Add this now!) ---
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if the node (user) already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Node already initialized with this email." });
        }

        // 2. Create the new user in MySQL
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // Note: Use bcrypt.hash() for production security!
                is_pro: false
            }
        });

        // 3. Generate a token immediately so they don't have to log in twice
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: newUser.id, isPro: false },
            secret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Neural Profile Created",
            token,
            user: { name: newUser.name, isPro: false }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Initialization Failed: Neural Engine Error." });
    }
};