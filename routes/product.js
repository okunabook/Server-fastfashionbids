const express = require("express");
const router = express.Router();
const {addexchange,listexchange,readexchange,detailexchange} = require('../controller/exchange')
const {removeexchange} = require('../controller/admin')
const {addstore,readstore,removestore} = require('../controller/store')
const upload = require("../middleware/uploadimage")

//     All router Exchange
router.post('/:id/addexchange',upload.single('exchange_img'),addexchange)
router.post('/exchange',listexchange)
router.get('/:id/exchange',readexchange)
router.get('/exchange/:id_exchange',detailexchange)
router.delete('/:id/removeexchange/:id_exchange',removeexchange)



//     All router Store
router.post('/:id/addstore',upload.single('store_img'),addstore)
router.get('/:id/store',readstore)
router.delete('/:id/removestore/:id_store',removestore)





module.exports = router