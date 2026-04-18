const prisma = require('../config/prisma');

// READ ALL TASKS
const Task = {
    getAll: async (userId) => {
        return await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    },

    getById: async (id, userId) => {
        return await prisma.task.findFirst({
            where: {
                id: parseInt(id),
                userId
            }
        });
    },

    create: async (taskData) => {
        return await prisma.task.create({
            data: {
                title: taskData.title,
                category: taskData.category || "All",
                risk: taskData.risk || "Low",
                progress: taskData.progress || 0,
                userId: taskData.userId
            }
        });
    },

    update: async (id, userId, updateData) => {
        return await prisma.task.updateMany({
            where: {
                id: parseInt(id),
                userId
            },
            data: updateData
        });
    },

    delete: async (id, userId) => {
        return await prisma.task.deleteMany({
            where: {
                id: parseInt(id),
                userId
            }
        });
    }
};

module.exports = Task;