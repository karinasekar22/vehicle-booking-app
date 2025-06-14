const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');

router.post('/', verifyToken, checkRole('admin'), driverController.createDriver);

module.exports = router;