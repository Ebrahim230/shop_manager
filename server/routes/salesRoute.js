const express = require('express');
const {createSale, getSales} = require('../controllers/salesController');
const router = express.Router();

router.post('/',createSale);
router.get('/',getSales);

module.exports = router;