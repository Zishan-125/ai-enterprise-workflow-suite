const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Incoming Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Neural Link Missing." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // This will now PASS because it's receiving a real JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT VERIFICATION FAIL:", error.message);
        return res.status(401).json({ message: "Neural Signature Corrupted." });
    }
};

module.exports = authMiddleware;