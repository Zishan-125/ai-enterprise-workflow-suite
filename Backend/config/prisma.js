// Backend/config/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 🚀 CRITICAL: You must export the instance!
module.exports = prisma;