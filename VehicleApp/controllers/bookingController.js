const { Booking, Approval, User, Vehicle, Driver, Sequelize } = require("../models");
const {Op} = Sequelize;
const logAction = require("../utils/logAction");

exports.createBooking = async (req, res) => {
  try {
    const {
      vehicle_id,
      driver_id,
      start_date,
      end_date,
      purpose,
      location,
      approvers,
    } = req.body;

    if (
      !vehicle_id ||
      !driver_id ||
      !start_date ||
      !end_date ||
      !purpose ||
      !location ||
      !Array.isArray(approvers) ||
      approvers.length !== 2
    ) {
      return res.status(400).json({
        message:
          "Data is not completed, please make sure to input 2 approvers!",
      });
    }

    const booking = await Booking.create({
      user_id: req.user.id,
      vehicle_id,
      driver_id,
      start_date,
      end_date,
      purpose,
      location,
      status: "waiting",
    });

    await logAction(req.user.id, "CREATE_BOOKING", booking.id);

    const approvalData = approvers.map((appr) => ({
      booking_id: booking.id,
      approver_id: appr.approver_id,
      level: appr.level,
      status: "pending",
    }));

    await Approval.bulkCreate(approvalData);
    for (const appr of approvers) {
      await logAction(req.user.id, "ASSIGN_APPROVER", appr.approver_id);
    }

    res.status(200).json({
      message: "Booking created!",
      data: booking,
    });
  } catch (err) {
    console.error("Create Booking Error: ", err);
    res.status(500).json({ message: "Cannot create booking!" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Vehicle,
          attributes: ['id', 'name', 'plate_number', 'type', 'status']
        },
        {
          model: Driver,
          attributes: ['id', 'name', 'phone']
        },
        {
          model: Approval,
          include: {
            model: User,
            attributes: ['id', 'name', 'email', 'role']
          }
        }
      ],
    });
    res.json({ data: bookings });
  } catch (err) {
    console.error('Get All Bookings Error: ', err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.getBookingUsageStats = async (req, res) => {
  try {
    const usage = await Booking.findAll({
      attributes: [
        'vehicle_id',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'total']
      ],
      include: {
        model: Vehicle,
        attributes: ['name']
      },
      group: ['vehicle_id', 'Vehicle.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'DESC']]
    });
    const result = usage.map(item => ({
      vehicle: item.Vehicle.name,
      total: parseInt(item.dataValues.total),
    }));
    res.json({ data: result });
  } catch (err) {
    console.error("Dashboard usage error: ", err);
    res.status(500).json({ message: "Failed to fetch vehicle usage!" });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking)
      return res.status(404).json({ message: "Booking id not found" });

    await booking.destroy();
    res.status(200).json({ message: "Booking deleted!" });
  } catch (err) {
    console.error("Failed to delete", err);
    res.status(500).json({ message: "Failed to delete booking date" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking)
      return res.status(404).json({ message: "Booking id not found" });

    const updatedBooking = req.body;
    await booking.update(updatedBooking);
    res.status(200).json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("Failed to update", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
};