const db = require('../config/db')
const uuid = require('uuid');

//ลงexchange
exports.addexchange = async (req, res,next) => {
    try {
        const { id } = req.params
        const id_exchange = uuid.v4();
        const { exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want, exchange_img,id_size, id_sex, id_type } = req.body
        console.log(exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want,exchange_img, id_size, id_sex, id_type);
        db.query(
            "INSERT INTO exchange (id, id_exchange, exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want,exchange_img,id_size,id_sex,id_type) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
            [id, id_exchange,exchange_name, exchange_brand, exchange_color, exchange_detail, exchange_want,exchange_img, id_size, id_sex, id_type],
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
        res.json({ status: 500, msg: "Server Error <addexchange>", error: error })
        console.log(error);
        next();

    }
}


// ดูexchangeทั้งหมดแบบไม่มีuserid   
exports.listexchange = async(req, res,next) => {
    try {
        db.query(
            "SELECT exchange.exchange_name, exchange.exchange_img,size.sizes,exchange.exchange_brand,exchange.exchange_want,type.name as typename,exchange.id_sex,exchange.id_type,exchange.id_size " +
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
        res.json({ status: 500, msg: "Server Error <listexchange>", error: error });
        console.log(error);
        next();
    }
};


//ดูexchangeของหมดของuseridตัวเอง
exports.readexchange = async (req, res, next) => {
    try {
        const {id} = req.params 
        db.query(
            "SELECT exchange.exchange_name,exchange.exchange_brand,exchange.exchange_color,exchange.exchange_detail,exchange.exchange_want,exchange.exchange_img,sizes,sex.sexname,type.name as typename,exchange.id_sex,exchange.id_type,exchange.id_size,exchange.id_exchange " +
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
        res.json({ status: 500, msg: "Server Error <listexchange>", error: error });
        console.log(error);
        next();
    }
};


//ลบexchange
exports.removeexchange = async (req, res, next) => {
    try {
        const { id_exchange } = req.params;
        const { id } = req.params; 
        console.log(id,id_exchange);
        db.query(
            "SELECT id FROM exchange WHERE id_exchange = ?",
            [id_exchange],
            (err, result) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }

                if (result.length === 0) {
                    res.status(404).json({ status: "error", message: "Exchange not found" });
                    next();
                } else {
                    const exchangeOwnerId = result[0].id;
                    if (exchangeOwnerId !== id) {
                        res.status(403).json({ status: "error", message: "You are not authorized to delete this exchange" });
                        next();
                    } else {
                        db.query(
                            "DELETE FROM exchange WHERE id_exchange = ?",
                            [id_exchange],
                            (err, result) => {
                                if (err) {
                                    res.json({ status: "error", message: err });
                                    next();
                                }
                                res.json({
                                    message: "success",
                                });
                            }
                        );
                    }
                }
            }
        );
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <removeexchange>", error: error });
        console.log(error);
        next();
    }
};

