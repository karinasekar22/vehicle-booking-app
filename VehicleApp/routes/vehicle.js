const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');

router.post('/', verifyToken, checkRole('admin'), vehicleController.createVehicle);

module.exports = router;
