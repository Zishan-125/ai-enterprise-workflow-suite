const TeamMember = require('../models/TeamMember'); 

exports.getTeam = async (req, res) => {
  try {
    const team = await TeamMember.findAll();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Database retrieval failed" });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newMember = await TeamMember.create({ name, email, role });
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: "Could not sync new node" });
  }
};