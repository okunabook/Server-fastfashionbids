const db = require('../config/db')
const cloudinary = require('../config/cloudinary.js');
// adminดูuserทั้งหมด
exports.viewuser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // ตรวจว่าเป็นrole adminป่าว
        db.query(
            `SELECT role FROM users WHERE id = ?`,
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next();
                }

                if (result.length === 0 || result[0].role !== "admin") {
                    res.json({ status: "error", message: "User is not an admin" });
                    return next();
                }

                // กรณีเป้ฯadmin จะใช้ฟังชั่นด้านล่างได้
                db.query(
                    `SELECT username, fname, lname, img, id FROM users WHERE role = "user"`,
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ status: "error", message: err });
                            return next();
                        }
                        res.json({
                            message: "success",
                            data: result,
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <viewusererror>", error: error });
        return next();
    }
};


//ลบuser
exports.removeuser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ลบ exchange ของ user ด้วย id ของ user
        db.query(
            "DELETE FROM exchange WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    return next();
                }

                // ลบ store ของ user ด้วย id ของ user
                db.query(
                    "DELETE FROM store WHERE id = ?",
                    [id],
                    (err, result) => {
                        if (err) {
                            res.json({ status: "error", message: err });
                            return next();
                        }

                        // ลบรูปภาพที่อยู่ใน cloudinary ด้วย id ของ user
                        cloudinary.api.delete_resources_by_prefix(id, (err, result) => {
                            if (err) {
                                res.json({ status: "error", message: err });
                                return next();
                            }

                            // ลบ user ด้วย id ของ user
                            db.query(
                                "DELETE FROM users WHERE id = ?",
                                [id],
                                (err, result) => {
                                    if (err) {
                                        res.json({ status: "error", message: err });
                                        return next();
                                    }

                                    res.json({
                                        message: "success",
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
        res.json({ status: 500, message: "Server Error <removeuser>", error: error });
        return next();
    }
};






//ดูexchange ทั้งหมด
exports.viewallexchange = async (req, res, next) => {
    try {
        const { id } = req.params;
        // ตรวจว่าเป็นrole adminป่าว
        db.query(
            `SELECT role FROM users WHERE id = ?`,
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next();
                }
                
                if (result.length === 0 || result[0].role !== "admin") {
                    res.json({ status: "error", message: "User is not an admin" });
                    return next();
                }
                // กรณีเป้ฯadmin จะใช้ฟังชั่นด้านล่างได้
                db.query(
                    `select *
                    from exchange`,
                    (err,result)=>{
                        if(err){
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
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <viewallexchange>", error: error });
        return next();
    }
};


// ลบexchange
exports.removeexchange = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_exchange } = req.params;

        // ตรวจสอบ role ของผู้ใช้
        db.query(
            `SELECT role FROM users WHERE id = ?`,
            [id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next(); 
                }

                if (result.length === 0 || result[0].role !== "admin") {
                    // กรณีไม่ใช่ admin
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
                                return next(); 
                            } else {
                                const exchangeOwnerId = result[0].id;
                                if (exchangeOwnerId !== id) {
                                    res.status(403).json({ status: "error", message: "You are not authorized to delete this exchange" });
                                    return next(); 
                                } else {
                                    db.query(
                                        "DELETE FROM exchange WHERE id_exchange = ?",
                                        [id_exchange],
                                        (err, result) => {
                                            if (err) {
                                                res.json({ status: "error", message: err });
                                                return next(); 
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
                } else {
                    // กรณีเป็น admin
                    db.query(
                        "DELETE FROM exchange WHERE id_exchange = ?",
                        [id_exchange],
                        (err, result) => {
                            if (err) {
                                res.json({ status: "error", message: err });
                                return next(); // ควรเรียก next() เพื่อส่งการทำงานต่อไป
                            }
                            res.json({
                                message: "success",
                            });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <removeexchange>", error: error });
        return next(); 
    }
}




