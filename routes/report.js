const express = require("express");
const router = express.Router();
const {postreport,getreport} = require('../controller/report')

router.post('/report/',postreport)
router.get('/getreport/:id_user/:id_me',getreport)

module.exports = router