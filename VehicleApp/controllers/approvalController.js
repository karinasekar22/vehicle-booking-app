const { Approval, Booking } = require('../models');
const logAction = require('../utils/logAction');

exports.approveBooking = async (req, res) => {
    const approvalId = req.params.id;
    const { status } = req.body;

    try {
        const approval = await Approval.findByPk(approvalId);
        if (!approval) {
            return res.status(404).json({ message: "Approval not found" });
        }

        approval.status = status;
        approval.approved_at = new Date();
        await approval.save();

        await logAction(req.user.id, `APPROVAL_${status.toUpperCase()}`, approval.booking_id);

        const allApprovals = await Approval.findAll({
            where: { booking_id: approval.booking_id }
        });
        const allApproved = allApprovals.every((a) => a.status === "approved");
        const anyRejected = allApprovals.some((a) => a.status === "rejected");

        const booking = await Booking.findByPk(approval.booking_id);

        if (anyRejected) {
            booking.status = "rejected";
        } else if (allApproved) {
            booking.status = "approved";
        } else {
            booking.status = "waiting";
        }

        await booking.save();

        res.json({ message: `Approval ${status} successfully`, data: approval });
    } catch (err) {
        console.error("Approval error: ", err);
        res.status(500).json({ message: 'Failed to approve booking' });
    }
};

exports.getAllWaitingApproval = async (req, res) => {

    const userId = req.user.id;

    try {
        const all = await Approval.findAll({
            where: {
                approver_id: userId,
                status: "pending"
            },
            include: ["Booking"],
            order: [["level", "ASC"]]
        });

        res.json({ data: all });
    } catch (err) {
        console.error("Get Pending Approvals Error: ", err);
        res.status(500).json({ message: "Failed to fetch approvals" });
    }
};