const { User } = require("../models");

exports.getApproversByLevel = async (req, res) => {
  const { level } = req.query;

  try {
    const approvers = await User.findAll({
      where: {
        role: "approver",
        ...(level && { level: Number(level) }),
      },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.status(200).json({ data: approvers });
  } catch (err) {
    console.error("Failed to fetch approvers:", err);
    res.status(500).json({ message: "Failed to fetch approvers" });
  }
};
