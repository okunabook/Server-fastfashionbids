const express = require("express");
const router = express.Router();
const { addexchange, listexchange, readexchange, detailexchange, option, nologvie, postname, getname, exchangegetname, poststore, getlist, viewstore, comment, getcomment, getdetail } = require('../controller/exchange')
const { removeexchange } = require('../controller/admin')
const { addstore, readstore, removestore } = require('../controller/store')
const { address, status, delid_ex_st } = require('../controller/end')  ///////controller end
const upload = require("../middleware/uploadimage")

//     All router Exchange
router.post('/:id/addexchange', upload.single('exchange_img'), addexchange)  //เพิ่มสินค้าexchange 
router.get('/exchange', listexchange)  //แสดงสินค้าexchange ทั้งหมด
router.post('/options', option)
router.get('/:id/exchange', readexchange)  //ดูสินค้าexchange ของตัวเอง
router.get('/exchange/:id_exchange/:id', detailexchange)  //ดูรายระเอียดสินค้าแบบloginแล้ว
router.get('/exchange/:id_exchange', nologvie) //ดูรายละเอียดสินค้าแบบไม่ได้login
router.delete('/:id/removeexchange/:id_exchange', removeexchange)  //ลบสินค้า
router.post('/comment/:id_exchange/:id', comment) //comment หน้าดูสินค้าชิ้นเดี่ยว
router.get('/getcomment/:id_exchange', getcomment)// ดู commentทัังหมด หน้าดูสินค้าชิ้นเดี่ยว
router.get('/detail/:id', getdetail) // detail เจ้าของexchange ดู สินค้าที่คนอื่นเอามาแลก

///test1///
router.post('/:id/name/:id_exchange', postname) //ลงชื่อแลกชินค้านั้นๆ   ///idต้องเป็นคนอื่น 
router.get('/user/view/:id_exchange', getname) /// แสดงข้อมูลชื่อ และ ของ
router.get('/view/:id_exchange', exchangegetname)

///test2//
router.post('/:id/poststore/:id_exchange', poststore)
router.get('/getstore/:id_exchange', getlist)
router.get('/viewstore/:id_store', viewstore)

////////ยืนยัน
router.post('/success/:id_user/:id_me', status)
///ส่งaddress
router.get('/address/:id_user', address)
/////ลบ store exchange /////////
router.delete('/delid/:id_exchange/:id_store',delid_ex_st)




//     All router Store
router.post('/:id/addstore', upload.single('store_img'), addstore)
router.get('/:id/store', readstore)
router.delete('/:id/removestore/:id_store', removestore)





module.exports = router