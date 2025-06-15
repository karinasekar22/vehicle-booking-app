require('dotenv').config();
const { sequelize, User, Driver, Vehicle } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    // Hash password
    const passwordHash = await bcrypt.hash("password123", 10);

    // Seed users
    const users = await User.bulkCreate([
      {
        name: "Admin One",
        email: "admin1@example.com",
        password: passwordHash,
        role: "admin",
        level: 0,
      },
      {
        name: "Approver Lvl 1",
        email: "approver1@example.com",
        password: passwordHash,
        role: "approver",
        level: 1,
      },
      {
        name: "Approver Lvl 2",
        email: "approver2@example.com",
        password: passwordHash,
        role: "approver",
        level: 2,
      },
    ]);

    const drivers = await Driver.bulkCreate([
      {
        name: "Driver One",
        phone: "081234567890",
      },
      {
        name: "Driver Two",
        phone: "082345678901",
      },
    ]);

    // Seed vehicles
    const vehicles = await Vehicle.bulkCreate([
      {
        name: "Pickup A",
        plate_number: "AB1234XY",
        type: "angkutan barang",
        category: "owned",
        status: "available",
        service_schedule: new Date(),
        fuel_type: "diesel",
        fuel_consumption: 9.5,
      },
      {
        name: "SUV B",
        plate_number: "AB5678CD",
        type: "angkutan orang",
        category: "rented",
        status: "in service",
        service_schedule: new Date(),
        fuel_type: "bensin",
        fuel_consumption: 12,
      },
    ]);

    console.log("Seeding success 🎉");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
