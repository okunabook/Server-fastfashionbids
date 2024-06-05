const db = require('../config/db')

////////////////post////////////////////////////////////
exports.status = async (req, res, next) => {
    try {
        const { id_user} = req.params
        const {h_fname,h_lname,h_store_name,h_address,tel,id_me} = req.body
        console.log(h_fname,h_lname,h_store_name,h_address,tel);
        db.query(
            `insert into history(h_fname,h_lname,h_store_name,h_address,tel,id_user,id_me) value(?,?,?,?,?,?,?)
            `, [h_fname,h_lname,h_store_name,h_address,tel,id_user,id_me],
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
        )
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <status>", error: error });
        return next();
    }
}
///////////get ///////////////

exports.address = async (req, res, next) => {
    const { id_user } = req.params; // รับ id จาก params
    try {
        // คิวรีข้อมูลผู้ใช้และร้านค้า
        db.query(
            `SELECT *
            FROM history
            WHERE id_user = ?` ,
            [id_user],
            (err,result) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next();
                }
                
                if(result.length == 0){
                    db.query(
                        `SELECT *
                        FROM history
                        WHERE id_me = ?` ,
                        [id_user],
                        (err,result) => {
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
                res.json({
                    message: "success",
                    data: result,
                });
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <address>", error: error });
        return next();
    }
};

/////////////////////ลบ exchange store
exports.delid_ex_st = async (req, res) => {
    const { id_store, id_exchange } = req.params;
    try {
        // ลบข้อมูลจาก list ที่อ้างอิงถึง exchange ก่อน
        db.query(
            `DELETE FROM list WHERE id_exchange = ?`,
            [id_exchange],
            (err, result) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }
                
                // ถ้าการลบจาก list สำเร็จ ให้ลบจาก exchange
                db.query(
                    `DELETE FROM exchange WHERE id_exchange = ?`,
                    [id_exchange],
                    (err, result) => {
                        if (err) {
                            res.json({ status: "error", message: err });
                            return;
                        }
                        
                        // ถ้าการลบจาก exchange สำเร็จ ให้ลบจาก store
                        db.query(
                            `DELETE FROM store WHERE id_store = ?`,
                            [id_store],
                            (err, result) => {
                                if (err) {
                                    res.json({ status: "error", message: err });
                                    return;
                                }
                                res.json({
                                    message: "success",
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <getid_ex_st>", error: error });
    }
}
