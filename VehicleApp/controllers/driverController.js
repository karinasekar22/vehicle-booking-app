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
