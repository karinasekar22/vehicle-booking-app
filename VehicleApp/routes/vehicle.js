const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');

router.post('/', verifyToken, checkRole('admin'), vehicleController.createVehicle);

router.get('/', verifyToken, checkRole('admin'), vehicleController.getAllVehicle);

router.delete('/:id', verifyToken, checkRole('admin'), vehicleController.deleteVehicleById);

router.put('/:id', verifyToken, checkRole('admin'), vehicleController.updateVehicleById);

module.exports = router;
