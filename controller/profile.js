const path = require('path')
const fs = require('fs');

const connection = require("../config/db");


exports.editProfile = async (req, res, next) => {
    try {
        const { fname, lname, address, tel ,Img} = req.body;
        const { id } = req.params;
        console.log(fname, lname, address, tel ,Img);
        



        connection.query(
            `SELECT img FROM users 
             WHERE users.id = ?`, id, (err, data) => {
            if (err) {
                res.json({ status: "Error edit", msg: err });
                next();
            }

            // const oldImg = data[0].img;

            // if (oldImg) {
            //     if (fs.existsSync(path.join(__dirname, "../public/image", oldImg))) {
            //         fs.unlink(path.join(__dirname, "../public/image", oldImg), (err) => {
            //             if (err) {
            //                 console.log(err);
            //                 res.json({ status: "Error delete img" });
            //                 next();
            //             }
            //             console.log("delete img successfully");
            //         });
            //     } else {
            //         console.log("edit img successfully");
            //     }
            // }

            connection.query(
                `UPDATE users 
                 SET users.fname = ?, users.lname = ?, 
                 users.address = ?, users.tel = ?,
                 users.img = ?
                 WHERE users.id = ?`, [fname, lname, address, tel, Img, id], (err, data) => {
                if (err) {
                    res.json({ status: "Error update profile", msg: err });
                    next();
                }

                res.json({ msg: "Edit successfully" });
            }
            )
        }
        )
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <editprofile>", error: error })
        console.log(error);
        next();
    }
}


exports.readuser = async (req, res, next) => {
    try {
        const { id } = req.params
        connection.query(
            `select * from users where id = ?`,
            [id],
            (err, result) => {
                if (err) {
                    res.json({ status: "error register readuser", msg: err });
                    next();
                }
                res.json({ msg: "ok", data: result });

            }

        )
    } catch (error) {

    }
}