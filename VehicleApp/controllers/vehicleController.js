const { Vehicle } = require("../models");

exports.createVehicle = async (req, res) => {
  try {
    const {
      name,
      plate_number,
      type,
      category,
      status,
      service_schedule,
      fuel_type,
      fuel_consumption,
    } = req.body;

    if (
      !name ||
      !plate_number ||
      !type ||
      !category ||
      !status ||
      !service_schedule ||
      !fuel_type ||
      !fuel_consumption
    ) {
      return res.status(400).json({
        message: "Data is not completed, please make sure to complete first!",
      });
    }

    const newVehicle = await Vehicle.create({
      name,
      plate_number,
      type,
      category,
      status,
      service_schedule,
      fuel_type,
      fuel_consumption,
    });

    res.status(201).json({
      message: "New vehicle added!",
      data: newVehicle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create vehicle" });
  }
};
