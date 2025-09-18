const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.use(authenticate, authorize('SYSTEM_ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.post('/users', adminController.createUser);
router.get('/stores', adminController.listStores);
router.post('/stores', adminController.createStore);

module.exports = router;
