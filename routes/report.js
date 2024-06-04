const express = require("express");
const router = express.Router();
const {postreport,getreport} = require('../controller/report')

router.post('/report/:id_user/:id_me',postreport)
router.get('/getreport/:id_me',getreport)

module.exports = router