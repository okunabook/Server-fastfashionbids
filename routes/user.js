const express = require("express");
const router = express.Router();
const { editProfile } = require("../controller/profile");

router.put("/edit/profile/:id", editProfile)

module.exports = router