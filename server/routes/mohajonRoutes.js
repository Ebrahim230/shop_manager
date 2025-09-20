const express = require('express');
const router = express.Router();
const mohajonController = require('../controllers/mohajonController');

router.post('/', mohajonController.createMohajon);
router.get('/', mohajonController.getAllMohajons);
router.get('/:id', mohajonController.getMohajon);
router.post('/:id/transaction', mohajonController.addTransaction);

module.exports = router;