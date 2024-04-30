const express = require("express");
const router = express.Router();
const { editProfile ,readuser} = require("../controller/profile");
const {upload} = require("../middleware/uploadimage")

router.put("/edit/profile/:id", editProfile)
router.get('/user/:id',readuser)

module.exports = router