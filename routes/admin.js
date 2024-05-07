const express = require("express");
const router = express.Router();
const {viewuser,viewallexchange,removeexchange,removeuser} = require('../controller/admin')


router.get('/:id/admin/viewuser',viewuser)
router.delete('removeuser/:id',removeuser)
router.get('/:id/admin/viewexchange',viewallexchange)
router.delete('/:id/admin/removeexchange/:id_exchange',removeexchange)



module.exports = router