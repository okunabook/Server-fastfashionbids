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


// ดูรายละเอียดสินค้าแบบloginแล้ว
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

// ดูรายละเอียดสินค้าแบบloginแล้ว
exports.nologvie = async(req,res,next)=>{
    try {
        const {id_exchange} = req.params
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
                    exchange: exchangeResult
                });
            }
        )

    } catch (error) {
        res.json({ status: 500, message: "Server Error <nologvie>", error: error });
        console.log(error);
        next();
    }
}

////////////test///////////////////////////////////////////////////////////////////////////////////////
exports.postname = async(req,res,next) =>{
    const id_list = uuid.v4();
    const {id,id_exchange} = req.params
    try {
        db.query(
            `INSERT INTO exchangelistname (id_list,id, id_exchange) value (?,?,?) `,
            [id_list,id,id_exchange],
            (err,result)=>{
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }
                
                res.json({
                    status: "success",
                    data: result
                });
            }
        )
        
    } catch (error) {
        res.json({ status: 500, message: "Server Error <postname>", error: error });
        console.log(error);
        next();
    }
}

///////////// userดูuser เห็นแค่ชื่อ
exports.getname = async(req,res,next)=>{
    const {id_exchange} = req.params
    try {
        db.query(
            `select users.username
            from exchangelistname
            inner join users on exchangelistname.id = users.id
            where exchangelistname.id_exchange = ?`,[id_exchange],
            (err,result)=>{
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }
                
                res.json({
                    status: "success",
                    data: result
                });
            }
        )
    } catch (error) {
        res.json({ status: 500, message: "Server Error <getname>", error: error });
        console.log(error);
        next();
    }
}

//////////////exchange view จะเห็นชื่อ และstoreทั้งหมดของuserที่ลงแลกเปลี่ยนสินค้า
exports.exchangegetname = async(req,res,next)=>{
    const {id_exchange} = req.params
    try {
        db.query(
            `select users.username,store.*
            from exchangelistname
            inner join users on exchangelistname.id = users.id
            inner join store on exchangelistname.id = store.id
            where exchangelistname.id_exchange = ?`,[id_exchange],
            (err,result)=>{
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }
                
                res.json({
                    status: "success",
                    data: result
                });
            }
        )
    } catch (error) {
        res.json({ status: 500, message: "Server Error <getname>", error: error });
        console.log(error);
        next();
    }
}

////////////test///////////////////////////////////////////////////////////////////////////////////////


///////////////test2///////////////////////


exports.poststore = async (req, res, next) => {
    const id_alllist = uuid.v4();
    const { id,id_exchange} = req.params;
    const { id_store } = req.body;

    try {
        // ขั้นตอนที่ 1: ดึงข้อมูลร้านค้าที่เป็นของผู้ใช้
        db.query(
            `SELECT id_store FROM store WHERE id = ?`,
            [id],
            (err, results) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return next();
                }

                // ขั้นตอนที่ 2: ตรวจสอบว่า id_store ที่ให้มานั้นอยู่ในร้านค้าของผู้ใช้หรือไม่
                const userStores = results.map(store => store.id_store);
                if (!userStores.includes(id_store)) {
                    res.json({ status: "error", message: "Unauthorized store ID" });
                    return next();
                }

                // ขั้นตอนที่ 3: เพิ่มข้อมูลลงใน list ถ้าร้านค้านั้นถูกต้อง
                db.query(
                    `INSERT INTO list (id_alllist, id, id_exchange, id_store) VALUES (?, ?, ?, ?)`,
                    [id_alllist, id, id_exchange, id_store],
                    (err, result) => {
                        if (err) {
                            res.json({ status: "error", message: err });
                            console.log(err);
                            return next();
                        }
                        res.json({ status: "success", message: "Store added successfully", result });
                    }
                );
            }
        );
    } catch (error) {
        res.json({ status: 500, message: "Server Error <poststore>", error: error });
        console.log(error);
        next();
    }
};
