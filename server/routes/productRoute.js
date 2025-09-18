const express = require('express');
const router = express.Router();
const {addProduct,getAllProducts,updateProduct,deleteProduct} = require('../controllers/productController');

router.post('/',addProduct);
router.get('/',getAllProducts);
router.put('/:id',updateProduct);
router.delete('/:id',deleteProduct);

module.exports = router;