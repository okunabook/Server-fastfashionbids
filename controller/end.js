const db = require('../config/db')


//ใช้id_alllist
// exports.address = async (req, res, next) => {
//     const { id_alllist } = req.params; // ตรวจสอบให้แน่ใจว่าได้ id_exchange จาก params ด้วย
//     try {
//         // คิวรีข้อมูลร้านค้า
//         db.query(
//             `SELECT users.*, store.*
//             FROM list 
//             INNER JOIN users ON list.id = users.id
//             INNER JOIN store ON store.id_store = list.id_store
//             WHERE list.id_alllist = ? AND list.status = "success"`,
//             [id_alllist],
//             (err, stored) => {
//                 if (err) {
//                     console.log(err);
//                     res.json({ status: "error", message: err });
//                     return next();
//                 }

//                 // คิวรีข้อมูลการแลกเปลี่ยน
//                 db.query(
//                     `SELECT users.*, exchange.*
//                     FROM list 
//                     INNER JOIN users ON list.id = users.id
//                     INNER JOIN exchange ON exchange.id_exchange = list.id_exchange
//                     WHERE list.id_alllist = ? AND list.status = "success"`,
//                     [id_alllist],
//                     (err, exchanged) => {
//                         if (err) {
//                             console.log(err);
//                             res.json({ status: "error", message: err });
//                             return next();
//                         }

//                         // ส่งผลลัพธ์กลับ
//                         return res.json({
//                             status: "success",
//                             exchange: exchanged,
//                             store: stored
//                         });
//                     }
//                 );
//             }
//         );
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 500, message: "Server Error <address>", error: error });
//         return next();
//     }
// };

// exports.address = async (req, res, next) => {
//     const { id } = req.params; // รับ id จาก params
//     try {
//         // คิวรีข้อมูลผู้ใช้และร้านค้า
//         db.query(
//             `SELECT users.*, store.*
//             FROM list
//             INNER JOIN users ON list.id = users.id
//             LEFT JOIN store ON store.id_store = list.id_store
//             WHERE list.id = ? AND list.status = "success"`,
//             [id],
//             (err, stored) => {
//                 if (err) {
//                     console.log(err);
//                     res.json({ status: "error", message: err });
//                     return next();
//                 }

//                 // คิวรีข้อมูลการแลกเปลี่ยน
//                 db.query(
//                     `SELECT users.*, exchange.*
//                     FROM list
//                     INNER JOIN users ON list.id = users.id
//                     LEFT JOIN exchange ON exchange.id_exchange = list.id_exchange
//                     WHERE list.id = ? AND list.status = "success"`,
//                     [id],
//                     (err, exchanged) => {
//                         if (err) {
//                             console.log(err);
//                             res.json({ status: "error", message: err });
//                             return next();
//                         }
//                         console.log({status: "success",user:stored[0],exchange: exchanged[0] });
//                         return res.json({status: "success",user:stored[0],exchange: exchanged[0] });
//                     }
//                 );
//             }
//         );
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 500, message: "Server Error <address>", error: error });
//         return next();
//     }
// };
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


// exports.address = async (req, res, next) => {
//     const { id } = req.params; // รับ id จาก params
//     try {
//         // คิวรีข้อมูลผู้ใช้และร้านค้า
//         db.query(
           
//             `select users.*,exchange.id_exchange
//             from users 
//             inner join exchange on users.id = exchange.id
//             where users.id = ? `,[id],
//             (err,result)=>{
//                 if (err) {
//                     console.log(err);
//                     res.json({ status: "error", message: err });
//                     return next();
//                 }
//                 if (result[0].id_exchange.length === 0) {
//                     db.query(
//                         `select *
//                         from list 
//                         inner join users on list.id= users.id
//                         where id_exchange = ?`,[result[0].id_exchange],
//                         (err,data)=>{
//                             if (err) {
//                                 console.log(err);
//                                 res.json({ status: "error", message: err });
//                                 return next();
//                             }
//                             res.json({
//                                 message: "success",
//                                 data: data,
//                                 result:result
//                             });
//                         }
//                     )    
//                 }
//                 db.query(
//                     `select *
//                     from list 
//                     inner join users on list.id= users.id
//                     where id_exchange = ?`,[result[0].id_exchange],
//                     (err,data)=>{
//                         if (err) {
//                             console.log(err);
//                             res.json({ status: "error", message: err });
//                             return next();
//                         }
//                         res.json({
//                             message: "success",
//                             data: data,
//                             result:result
//                         });
//                     }
//                 )
//             }

            
//         );
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 500, message: "Server Error <address>", error: error });
//         return next();
//     }
// };




exports.status = async (req, res, next) => {
    try {
        const { id_user } = req.params
        const {h_fname,h_lname,h_store_name,h_address,tel} = req.body
        db.query(
            `insert into history(h_fname,h_lname,h_store_name,h_address,tel,id_user) value(?,?,?,?,?,?)
            `, [h_fname,h_lname,h_store_name,h_address,tel,id_user],
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
