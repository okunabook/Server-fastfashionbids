const express = require("express");
const router = express.Router();
const {addproduct,listproduct,readproduct} = require('../controller/product')

router.post('/:id/addproduct',addproduct)
router.get('/product',listproduct)
router.get('/:id/product',readproduct)

module.exports = router