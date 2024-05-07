const connection = require("../config/db");
const cloudinary = require('../config/cloudinary.js');

exports.editProfile = async (req, res, next) => {
    try {
        const { fname, lname, address, tel } = req.body
        const { id } = req.params
        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                res.json({ status: "error", message: err });
                console.log(err);
                return next();
            }
            const newImg = result.secure_url;
            connection.query(
                "UPDATE users SET fname = ?, lname = ?, address = ?, tel = ?, img = ? WHERE id = ?",
                [fname, lname, address, tel, newImg, id],
                (err, result) => {
                    if (err) {
                        res.json({ status: "error", message: err });
                        console.log(err);
                        return next();
                    }
                    res.json({
                        message: "success",
                        data: result,
                    });
                }
            );
        })

    } catch (error) {
        res.json({ status: 500, msg: "Server Error <editProfile>", error: error });
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
                    console.log(err);
                    return next();
                }
                res.json({ msg: "ok", data: result });

            }

        )
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <readuser>", error: error });
        console.log(error);
        next();
    }
}



