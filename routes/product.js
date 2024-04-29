const express = require("express");
const router = express.Router();
const {addproduct,listproduct} = require('../controller/product')

router.post('/:id/addproduct',addproduct)
router.get('/product',listproduct)

module.exports = router