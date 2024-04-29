const express = require("express");
const router = express.Router();
const { editProfile } = require("../controller/profile");
const {upload} = require("../middleware/uploadimage")

router.put("/edit/profile/:id", upload,editProfile)

module.exports = router