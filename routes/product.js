const express = require("express");
const router = express.Router();
const {addexchange,listexchange,readexchange,removeexchange} = require('../controller/exchange')
const {addstore,readstore,removestore} = require('../controller/store')

//     All router Exchange
router.post('/:id/addexchange',addexchange)
router.get('/exchange',listexchange)
router.get('/:id/exchange',readexchange)
router.delete('/:id/removeexchange/:id_exchange',removeexchange)

//     All router Store
router.post('/:id/addstore',addstore)
router.get('/:id/store',readstore)
router.delete('/:id/removestore/:id_store',removestore)





module.exports = router