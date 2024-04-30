const express = require("express");
const router = express.Router();
const { editProfile } = require("../controller/profile");
const {upload} = require("../middleware/uploadimage")

router.put("/edit/profile/:id", editProfile)
router.get('/user/:id')

module.exports = router