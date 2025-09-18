const express = require('express');
const router = express.Router();
const {dailyReport,monthlyReport} = require('../controllers/reportController');

router.get('/daily', dailyReport);
router.get('/monthly',monthlyReport);

module.exports = router;