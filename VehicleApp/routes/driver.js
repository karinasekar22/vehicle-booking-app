const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, driverController.createDriver);

router.get('/', verifyToken, driverController.getAllDriver);

router.put('/:id', verifyToken, driverController.updateDriverById);

router.delete('/:id', verifyToken, driverController.deletedriverById);

module.exports = router;