const db = require('../config/db')
const uuid = require('uuid');
const cloudinary = require('../config/cloudinary.js');

//ลงstoreสินค้าเพื่อนรอแลกของ 
exports.addstore = async (req, res, next) => {
    try {
        const { id } = req.params
        const id_store = uuid.v4()
        const { store_name, store_brand, store_color, store_detail, id_size, id_sex, id_type } = req.body
        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                res.json({ status: "error", message: err });
                console.log(err);
                return next();
            }
            const newImg = result.secure_url;
            db.query(
                `INSERT INTO store (id,id_store,store_name,store_brand,store_color,store_detail,store_img,id_size,id_sex,id_type)
                value(?,?,?,?,?,?,?,?,?,?)`,
                [id, id_store, store_name, store_brand, store_color, store_detail, newImg, id_size, id_sex, id_type],
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
            )
        })
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <addstore>", error: error })
        console.log(error);
        next();
    }
}

//ดูstoreทั้งหมดของเรา คนอื่นไม่เห็น
exports.readstore = async (req, res, next) => {
    try {
        const { id } = req.params
        db.query(
            `select store.store_name,store.store_brand,store.store_img,store.store_color,store.store_detail,size.sizes,sex.sexname,type.name as typename,
            store.id_sex,store.id_size,store.id_type,store.id_store,store.id
            FROM store
            INNER join users on store.id = users.id
            INNER join sex on store.id_sex = sex.id_sex
            INNER join size on store.id_size = size.id_size
            INNER join type on store.id_type = type.id_type
            WHERE store.id = ?
            `, [id],
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
        )

    } catch (error) {
        res.json({ status: 500, msg: "Server Error <resdstore>", error: error })
        console.log(error);
        next();
    }
}


exports.removestore = async (req, res, next) => {
    try {
        const { id_store } = req.params;
        const { id } = req.params;
        console.log(id, id_store);
        db.query(
            "SELECT id FROM store WHERE id_store = ?",
            [id_store],
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
                            "DELETE FROM store WHERE id_store = ?",
                            [id_store],
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
        res.json({ status: 500, msg: "Server Error <removestore>", error: error });
        console.log(error);
        next();
    }
};
