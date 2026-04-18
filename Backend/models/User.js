// Backend/models/User.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const User = {
    findByEmail: async (email) => {
        // Now 'prisma.user' will NOT be undefined!
        return await prisma.user.findUnique({
            where: { email: email }
        });
    }
};

module.exports = User;