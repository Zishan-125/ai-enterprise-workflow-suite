
const prisma = require('../config/prisma');

exports.getTeam = async (req, res) => {
    try {
        // Use prisma.teamMember (or whatever your model is named in schema.prisma)
        const team = await prisma.teamMember.findMany();
        res.json(team);
    } catch (err) {
        res.status(500).json({ error: "Database retrieval failed" });
    }
};

exports.inviteMember = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        // Use prisma.teamMember.create
        const newMember = await prisma.teamMember.create({
            data: { name, email, role }
        });
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ error: "Could not sync new node" });
    }
};