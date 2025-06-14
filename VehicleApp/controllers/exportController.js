const { Booking, Vehicle, Driver, User } = require("../models");
const ExcelJS = require("exceljs");

exports.exportBookingsToExcel = async (req, res) => {
    const { from, to } = req.query;
    try {
        const bookings = await Booking.findAll({
            where: {
                start_date: {
                    [require("sequelize").codePointAt.between]: [new Date(from), new Date(to)]
                }
            },
            include: [Vehicle, Driver, User],
            order: [["start_date", "ASC"]]
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
            { header: "Status", key: "status", width: 20 },
        ];

        bookings.forEach((b, index) => {
            sheet.addRow({
                no: index + 1,
                start_date: b.start_date.toISOString().split("T")[0],
                end_date: b.end_date.toISOString().split("T")[0],
                user: b.user?.name,
                vehicle: b.vehicle?.name,
                driver: b.driver?.name,
                location: b.location,
                status: b.status
            });

        });

        req.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        req.setHeader("Content-Disposition", `attachment; filename=BookingReport-${from}_to_${to}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Export error: ", err);
        res.status(500).json({ message: "Failed to export booking report" });
    }
};