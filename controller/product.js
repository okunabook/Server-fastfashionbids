const db = require('../config/db')
const uuid = require('uuid');

//ลงproduct
exports.addproduct = async (req, res,next) => {
    try {
        const { id } = req.params
        const id_product = uuid.v4();
        const { name, brand, color, detail, want, id_size, id_sex, id_type } = req.body
        db.query(
            "INSERT INTO product (id, id_product, name, brand, color, detail, want,id_size,id_sex,id_type) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)",
            [id, id_product, name, brand, color, detail, want, id_size, id_sex, id_type],
            (err, result) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    next()
                }
                res.json({
                    message: "success",
                    data: result,
                });
            }
        );
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <addproduct>", error: error })
        console.log(error);
        next();

    }
}


// ดูproductทั้งหมด   
exports.listproduct = async(req, res,next) => {
    try {
        db.query(
            "SELECT users.username, sex.sexname, type.name, size.sizes " +
            "FROM product " +
            "INNER JOIN users ON product.id = users.id " +
            "INNER JOIN sex ON product.id_sex = sex.id_sex " +
            "INNER JOIN type ON product.id_type = type.id_type " +
            "INNER JOIN size ON product.id_size = size.id_size",
            (err, result) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    next()
                }
                res.json({
                    message: "ส่งข้อมูล",
                    data: result,
                });
            }
        );
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <listproduct>", error: error })
        console.log(error);
        next();
    }
};


