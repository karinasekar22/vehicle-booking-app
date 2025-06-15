const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");
const {verifyToken} = require("../middlewares/auth");

router.get("/bookings", verifyToken, exportController.exportBookingsToExcel);

module.exports = router;
