const express = require('express');
const { authenticate } = require('../middleware/auth');
const { listStores, getStore, submitOrUpdateRating } = require('../controllers/storeController');
const router = express.Router();

// TO THIS (for now):
// backend/routes/stores.js
router.get('/', authenticate, listStores); // Make sure 'authenticate' is backrouter.get('/:id', authenticate, getStore);
router.post('/:id/rating', authenticate, submitOrUpdateRating);

module.exports = router;
