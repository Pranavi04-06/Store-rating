// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin); // 👈 Add this line

module.exports = router;