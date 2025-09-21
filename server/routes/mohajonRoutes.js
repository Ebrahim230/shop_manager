const express = require('express');
const router = express.Router();
const {
  createMohajon,
  getAllMohajons,
  getMohajon,
  addTransaction,
  updateMohajon,
  deleteMohajon,
  deleteTransaction
} = require('../controllers/mohajonController');

router.post('/', createMohajon);
router.get('/', getAllMohajons);
router.get('/:id', getMohajon);
router.put('/:id', updateMohajon);
router.delete('/:id', deleteMohajon);

router.post('/:id/transaction', addTransaction);
router.delete('/:id/transaction/:tid', deleteTransaction);

module.exports = router;