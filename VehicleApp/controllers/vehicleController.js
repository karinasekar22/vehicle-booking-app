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

exports.getAllVehicle = async (req, res) => {

  try {
    const vehicles = await Vehicle.findAll({
      order: [['name', 'ASC']]
    });
    res.status(200).json({ message: "Fetch success", data: vehicles });
  } catch (err) {
    console.error("Failed to get vehicles");
    res.status(500).json({ message: "Failed to fecth vehicles" });
  }
};

exports.deleteVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found!" });

    await vehicle.destroy();
    res.status(200).json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error("Failed to deleted vehicle", err);
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

exports.updateVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const updatedVehicle = req.body;
    await vehicle.update(updatedVehicle);
    res.status(200).json({ message: "Vehicle updated", vehicle });
  } catch (err) {
    console.error("Failed to update", err);
    res.status(500).json({ message: "Failed to update vehicle!" });
  }
};