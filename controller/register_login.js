const connection = require("../config/db");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");
const secret = "okbook14247";
const uuid = require('uuid');

exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        console.log(username,password,email);


        // สร้าง UUID สำหรับ ID
        const id = uuid.v4();

        // Check ชื่อซ้ำ
        connection.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, results) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }
                if (results.length > 0) {
                    res.json({ status: "error", message: "haved username" });
                    return;
                }

                // Check อีเมลซ้ำ
                connection.query(
                    "SELECT * FROM users WHERE email = ?",
                    [email],
                    async (err, emailResults) => {
                        if (err) {
                            res.json({ status: "error", message: err });
                            console.log(err);
                            return next();
                        }
                        if (emailResults.length > 0) {
                            res.json({ status: "error", message: "haved email" });
                            console.log(err);
                            return next();
                        }

                        //ใส่เกลือ
                        bcrypt.hash(password, saltRound, (err, hash) => {
                            connection.query(
                                "INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)",
                                [id, username, hash, email],
                                (err, result) => {
                                    if (err) {
                                        res.json({ status: "error", message: err });
                                        next();
                                    }
                                    res.json({
                                        message: "success",
                                        id: id,
                                    });
                                }
                            );
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "register error" });
        next()
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        connection.query(
            "SELECT * FROM users WHERE username=?",
            [username],
            (err, users) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
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
                        // เพิ่มการตรวจสอบ role ก่อนส่งข้อมูลกลับ
                        if (users[0].role === 'user') {
                            res.json({ status: "ok", message: "userlogin success", token, id: users[0].id });
                        } else if (users[0].role === 'admin') {
                            res.json({ status: "ok", message: "adminlogin success", token, id: users[0].id });
                        } else {
                            res.json({ status: "error", message: "unknown role" });
                        }
                    } else {
                        res.json({ status: "error", message: "login failed" });
                        return;
                    }
                });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "login error" });
        next();
    }
};

