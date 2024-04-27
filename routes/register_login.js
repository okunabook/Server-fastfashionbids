const express = require("express");
const router = express.Router();
const connection = require("../config/db"); //connect database
const bcrypt = require("bcrypt");
const saltRound = 10;
const uuid = require('uuid');
var jwt = require("jsonwebtoken");
const secret = "okbook14247";

//register

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  
  // สร้าง UUID สำหรับ ID
  const id = uuid.v4();

  // Check ชื่อซ้ำ
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (results.length > 0) {
        res.json({ status: "error", message: "Usarnameมีผู้ใช้งานแล้ว" });
        return;
      }

      // Check อีเมลซ้ำ
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, emailResults) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          if (emailResults.length > 0) {
            res.json({ status: "error", message: "Emailนี้มีผู้ใช้งานแล้ว" });
            return;
          }

          //ใส่เกลือ
          bcrypt.hash(password, saltRound, (err, hash) => {
            connection.query(
              "INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)",
              [id, username, hash, email],
              (err, result) => {
                if (err) {
                  res.json({ status: "error", message: err });
                  return;
                }
                res.json({
                  message: "success",
                  data: result,
                });
              }
            );
          });
        }
      );
    }
  );
});

const verifyJwt = (req,res,next)=>{
  const token = req.headers['okbook'];
  if(!token){
    return res.json("ขอtokenหน่อย")
  }else{
    jwt.verify(token,secret,(err,decode)=>{
      if(err){
        res.json("tokenหมดเวลาแล้ว")
        return
      }else{
        next()
      }

    })
  }
}
//list
router.get("/doo",(req, res) => {


  connection.execute(
    "select * from users",

    (err, result, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({
        massage: "ส่งข้อมูล",
        data: result,
      });
    }
  );
});

//read
router.get("/register/:id", async (req, res) => {
  const {id} = req.params
  try {
    connection.query(
      "select * from users where id =?",
      [id],
      (err, result, file) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({status:"ok",result});
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});



router.post("/login", (req, res) => {
  const { username, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    (err, users) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no user found" });
        return;
      } //กรณีไม่เจอuser
      bcrypt.compare(password, users[0].password, async (err, islogin) => {
        if (islogin) {
          var token = jwt.sign({ username: users[0].username, id: users[0].id }, secret, {
            expiresIn: "1m",
          });
          res.json({ status: "ok", message: "login succes", token, id: users[0].id });
        } else {
          res.json({ status: "error", message: "login failed" });
          return;
        }
      });
    }
  );
});


router.get('/cheackauth',verifyJwt,(req,res)=>{
  
  res.json({massage:"okdee"})
})

router.get('/test',(req,res,next)=>{
    try {
        res.json({massage:"ok"})
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
