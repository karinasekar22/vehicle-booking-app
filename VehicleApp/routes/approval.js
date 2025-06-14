const express = require('express');
const router = express.Router();
const approvalController = require("../controllers/approvalController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/role");

router.get("/", verifyToken, approvalController.getAllWaitingApproval);

router.patch("/:id", verifyToken, checkRole("approver"), approvalController.approveBooking);

module.exports = router;