const db = require('../config/db')
const uuid = require('uuid');
const cloudinary = require('../config/cloudinary.js');
//ลงexchange
exports.addexchange = async (req, res, next) => {
    try {
        const { id } = req.params
        const id_exchange = uuid.v4();
        const { exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want, id_size, id_sex, id_type } = req.body
        console.log(exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want, id_size, id_sex, id_type);
        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                res.json({ status: "error", message: err });
                console.log(err);
                return next();
            }
            const newImg = result.secure_url;
            db.query(
                "INSERT INTO exchange (id, id_exchange, exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want,exchange_img,id_size,id_sex,id_type) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
                [id, id_exchange, exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want, newImg, id_size, id_sex, id_type],
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
        res.json({ status: 500, message: "Server Error <addexchange>", error: error })
        console.log(error);
        next();

    }
}


// ดูexchangeทั้งหมดแบบไม่มีuserid   
exports.listexchange = async (req, res, next) => {
    try {
        db.query(
            "SELECT exchange.exchange_name, exchange.exchange_img,size.sizes,exchange.exchange_brand,exchange.exchange_want,type.name as typename,sex.sexname,exchange.id_sex,exchange.id_type,exchange.id_size,id_exchange " +
            "FROM exchange " +
            "INNER JOIN users ON exchange.id = users.id " +
            "INNER JOIN sex ON exchange.id_sex = sex.id_sex " +
            "INNER JOIN type ON exchange.id_type = type.id_type " +
            "INNER JOIN size ON exchange.id_size = size.id_size",
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

    } catch (error) {
        res.json({ status: 500, message: "Server Error <listexchange>", error: error });
        console.log(error);
        next();
    }
};

//ค้นหาด้วยoption
exports.option = async(req,res,next)=>{
    try {
        const {id_size,id_sex,id_type,option} = req.body
        if(option == "true"){
            db.query(
                `select * from exchnage where id_size = ? or id_sez = ? or id_type =?`,
                [id_size,id_sex,id_type],
                (err,result)=>{
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
            )
        }else{
            db.query(
                "SELECT exchange.exchange_name, exchange.exchange_img,size.sizes,exchange.exchange_brand,exchange.exchange_want,type.name as typename,sex.sexname,exchange.id_sex,exchange.id_type,exchange.id_size " +
                "FROM exchange " +
                "INNER JOIN users ON exchange.id = users.id " +
                "INNER JOIN sex ON exchange.id_sex = sex.id_sex " +
                "INNER JOIN type ON exchange.id_type = type.id_type " +
                "INNER JOIN size ON exchange.id_size = size.id_size",
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
        }
    } catch (error) {
        
    }

}













//ดูexchangeของหมดของuseridตัวเอง
exports.readexchange = async (req, res, next) => {
    try {
        const { id } = req.params
        db.query(
            "SELECT exchange.exchange_name,exchange.exchange_brand,exchange.exchange_color,exchange.exchange_detail,exchange.exchange_want,exchange.exchange_img,size.sizes,sex.sexname,type.name as typename,exchange.id_sex,exchange.id_type,exchange.id_size,exchange.id_exchange " +
            "FROM exchange " +
            "INNER JOIN users ON exchange.id = users.id " +
            "INNER JOIN sex ON exchange.id_sex = sex.id_sex " +
            "INNER JOIN type ON exchange.id_type = type.id_type " +
            "INNER JOIN size ON exchange.id_size = size.id_size " +
            "WHERE exchange.id = ?", [id],
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
    } catch (error) {
        res.json({ status: 500, message: "Server Error <readexchange>", error: error });
        console.log(error);
        next();
    }
};

// ดูรายละเอียดสินค้านั้นๆ
exports.detailexchange = async (req, res, next) => {
    try {
        const { id, id_exchange } = req.params;

        // ค้นหาข้อมูลผู้ใช้
        db.query(
            `SELECT users.img
            FROM users
            WHERE users.id = ?`, [id],
            (err, userResult) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }
                
                // ค้นหาข้อมูลการแลกเปลี่ยน
                db.query(
                    `SELECT users.username, exchange.id_exchange, exchange.exchange_name, exchange.exchange_brand, exchange.exchange_color, exchange.exchange_detail, exchange.exchange_want,
                    exchange.exchange_img, sex.sexname, size.sizes, type.name AS typename, exchange.id_size, exchange.id_sex, exchange.id_type
                    FROM exchange
                    INNER JOIN users ON exchange.id = users.id
                    INNER JOIN sex ON exchange.id_sex = sex.id_sex
                    INNER JOIN size ON exchange.id_size = size.id_size
                    INNER JOIN type ON exchange.id_type = type.id_type
                    WHERE id_exchange = ?`, [id_exchange],
                    (err, exchangeResult) => {
                        if (err) {
                            res.json({ status: "error", message: err });
                            console.log(err);
                            return next();
                        }
                        
                        // ส่งข้อมูลผู้ใช้และข้อมูลการแลกเปลี่ยนกลับไปยังไคลเอนต์
                        res.json({
                            status: "success",
                            user: userResult,
                            exchange: exchangeResult
                        });
                    }
                );
            }
        );

    } catch (error) {
        res.json({ status: 500, message: "Server Error <detailexchange>", error: error });
        console.log(error);
        next();
    }
}



