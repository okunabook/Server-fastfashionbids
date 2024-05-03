const express = require("express");
const router = express.Router();
const {viewuser} = require('../controller/admin')


router.get('/:id/admin')
router.get('/testadmin',viewuser)


module.exports = router