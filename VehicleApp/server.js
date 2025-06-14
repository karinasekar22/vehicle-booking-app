const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const vehicleRoutes = require('./routes/vehicle');
const driverRoutes = require('./routes/driver');
const approvalRoutes = require("./routes/approval");
const exportRoutes = require("./routes/export");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

db.sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Connected to database PostgreSQL!');
  })
  .catch((err) => {
    console.error('DB Error:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/exports', exportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server nyala di http://localhost:${PORT}`);
});