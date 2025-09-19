const express = require('express');
const router = express.Router();
const {addCost,getAllCosts,getNetSummary} = require('../controllers/costController');

router.post('/',addCost);
router.get('/',getAllCosts);
router.get('/summary',getNetSummary);

module.exports = router;