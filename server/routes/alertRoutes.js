const express = require('express');
const router = express.Router();
const {lowStockAlert,expiryAlert} = require('../controllers/alertController');

router.get('/low-stock', lowStockAlert);
router.get('/expiry', expiryAlert);

module.exports = router;