const { Booking, Vehicle, Driver, User, Sequelize, Approval } = require("../models");
const ExcelJS = require("exceljs");
const { Op } = Sequelize;

exports.exportBookingsToExcel = async (req, res) => {
  const { from, to } = req.query;
  try {
    const bookings = await Booking.findAll({
      where: {
        start_date: {
          [Op.between]: [new Date(from), new Date(to)],
        },
      },
      include: [
        { model: Vehicle },
        { model: Driver },
        { model: User },
        {
          model: Approval,
          include: [{ model: User }],
        },
      ],
      order: [["start_date", "ASC"]],
    });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Booking Report");

    sheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Tanggal Mulai", key: "start_date", width: 15 },
      { header: "Tanggal Selesai", key: "end_date", width: 15 },
      { header: "Pemesanan", key: "user", width: 20 },
      { header: "Kendaraan", key: "vehicle", width: 20 },
      { header: "Driver", key: "driver", width: 20 },
      { header: "Lokasi", key: "location", width: 20 },
      { header: "Approver 1", key: "approver1", width: 20 },
      { header: "Approver 2", key: "approver2", width: 20 },
      { header: "Status", key: "status", width: 20 },
    ];

    bookings.forEach((b, index) => {
      const approver1 =
        b.Approvals?.find((a) => a.level === 1)?.User?.name || "-";
      const approver2 =
        b.Approvals?.find((a) => a.level === 2)?.User?.name || "-";
      sheet.addRow({
        no: index + 1,
        start_date: b.start_date.toISOString().split("T")[0],
        end_date: b.end_date.toISOString().split("T")[0],
        user: b.User?.name,
        vehicle: b.Vehicle?.name,
        driver: b.Driver?.name,
        location: b.location,
        approver1,
        approver2,
        status: b.status,
      });
    });

    
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=BookingReport-${from}_to_${to}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error: ", err);
    res.status(500).json({ message: "Failed to export booking report" });
  }
};
