const {Driver} = require("../models");

exports.createDriver = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Please complete the information!" });
    }

    const newDriver = await Driver.create({
      name,
      phone,
    });
    res.status(200).json({ message: "New driver added!", data: newDriver });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Can not create new driver" });
  }
};

exports.getAllDriver = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [['name', 'ASC']]
    });
    res.json({ data: drivers });
  } catch (err) {
    console.error("Get driver error");
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

exports.deletedriverById = async (req, res) => {

  const { id } = req.params;

  try {
    const drivers = await Driver.findByPk(id);
    if (!drivers) return res.status(404).json({ message: "Driver tidak ditemukan!" });

    await drivers.destroy();
    res.json({ message: "Driver deleted" });
  } catch (err) {
    console.error("Failed to delete");
    res.status(500).json({ message: "Failed to delete driver" });
  }
};

exports.updateDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const drivers = await Driver.findByPk(id);
    if (!drivers) return res.status(404).json({ message: "Driver not found" });

    const updatedDriver = req.body;
    await drivers.update(updatedDriver);
    res.json({ message: "Driver updated", drivers });
  } catch (err) {
    console.error("Failed to update driver", err);
    res.status(500).json({ message: "Failed to update driver" });
  }
};
