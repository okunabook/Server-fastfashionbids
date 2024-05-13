const express = require("express");
const router = express.Router();
const {viewuser,viewallexchange,removeexchange,removeuser} = require('../controller/admin')


router.get('/:id/admin/viewuser',viewuser) //ดูuserทั้งหมด
router.delete('removeuser/:id',removeuser)//ลบuser และจะลบทุกอย่างที่เกี่ยวกับuser
router.get('/:id/admin/viewexchange',viewallexchange)//ดูexchange ทั้งหมด
router.delete('/:id/admin/removeexchange/:id_exchange',removeexchange) // ลบexchange



module.exports = router