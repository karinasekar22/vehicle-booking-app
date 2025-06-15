const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth");

router.get("/approvers", verifyToken, userController.getApproversByLevel);

module.exports = router;
