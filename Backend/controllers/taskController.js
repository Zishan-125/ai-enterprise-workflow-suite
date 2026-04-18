const prisma = require('../config/prisma');

// GET ALL TASKS
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({
            message: "Failed to retrieve tasks."
        });
    }
};

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, category, risk, progress } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title required"
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                category: category || "All",
                risk: risk || "Low",
                progress: progress || 0,
                userId
            }
        });

        res.status(201).json(task);

    } catch (error) {
        console.error("Create Error:", error);
        res.status(500).json({
            message: "Task creation failed"
        });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, category, risk, progress } = req.body;

        const result = await prisma.task.updateMany({
            where: {
                id: parseInt(id),
                userId
            },
            data: {
                title,
                category,
                risk,
                progress
            }
        });

        res.status(200).json({
            message: "Updated successfully",
            count: result.count
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            message: "Update failed"
        });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await prisma.task.deleteMany({
            where: {
                id: parseInt(id),
                userId
            }
        });

        res.status(200).json({
            message: "Deleted successfully"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            message: "Delete failed"
        });
    }
};