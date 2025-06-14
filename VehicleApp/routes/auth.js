const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {verifyToken} = require('../middlewares/auth');
const {checkRole} = require('../middlewares/role');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/profile', verifyToken, authController.getProfile);

// Akses khusus: hanya admin
router.get('/admin/dashboard', verifyToken, checkRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, be ready to manage your booking!' });
});

// Akses khusus: hanya approver
router.get('/approver/dashboard', verifyToken, checkRole('approver'), (req, res) => {
  res.json({ message: 'welcome, please check your waiting list!' });
});

module.exports = router;
