const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/auth");
const { Log, User } = require("../models");

router.post(
    "/",
    verifyToken,
    bookingController.createBooking
);

router.get("/logs", verifyToken, async (req, res) => {
    try {
        const logs = await Log.findAll({
            include: {
                model: User,
                attributes: ['id', 'name', 'email', 'role'],

            },
            order: [["timestamp", "DESC"]],

        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch logs" });
    }
});

router.get('/', verifyToken, bookingController.getAllBookings);

router.get('/usage', verifyToken, bookingController.getBookingUsageStats);

module.exports = router;
