const db = require('../config/db')


//i
// exports.address = async (req, res, next) => {
//     const { id_store, id_exchange } = req.params; // ตรวจสอบให้แน่ใจว่าได้ id_exchange จาก params ด้วย
//     try {
//         // คิวรีข้อมูลร้านค้า
//         db.query(
//             `SELECT users.*, store.*
//             FROM list 
//             INNER JOIN users ON list.id = users.id
//             INNER JOIN store ON store.id_store = list.id_store
//             WHERE list.id_store = ? AND list.status = "success"`,
//             [id_store],
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
//                     WHERE list.id_exchange = ? AND list.status = "success"`,
//                     [id_exchange],
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
exports.address = async (req, res, next) => {
    const { id } = req.params; // รับ id จาก params
    try {
        // คิวรีข้อมูลผู้ใช้และร้านค้า
        db.query(
            `SELECT users.*, store.*
            FROM list
            INNER JOIN users ON list.id = users.id
            LEFT JOIN store ON store.id_store = list.id_store
            WHERE list.id = ? AND list.status = "success"`,
            [id],
            (err, stored) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next();
                }

                // คิวรีข้อมูลการแลกเปลี่ยน
                db.query(
                    `SELECT users.*, exchange.*
                    FROM list
                    INNER JOIN users ON list.id = users.id
                    LEFT JOIN exchange ON exchange.id_exchange = list.id_exchange
                    WHERE list.id = ? AND list.status = "success"`,
                    [id],
                    (err, exchanged) => {
                        if (err) {
                            console.log(err);
                            res.json({ status: "error", message: err });
                            return next();
                        }

                        // รวมข้อมูลของตัวเองและฝ่ายตรงข้าม
                        const response = {
                            status: "success",
                            user: stored[0], // ข้อมูลผู้ใช้
                            store: stored[0].id_store ? stored : [], // ข้อมูลร้านค้า ถ้ามี
                            exchange: exchanged[0].id_exchange ? exchanged : [] // ข้อมูลการแลกเปลี่ยน ถ้ามี
                        };

                        // ส่งผลลัพธ์กลับ
                        return res.json(response);
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Server Error <address>", error: error });
        return next();
    }
};





exports.status = async (req, res, next) => {
    try {
        const { id_store } = req.body
        db.query(
            `UPDATE list set status = "success"
            WHERE id_store = ?
            `, [id_store],
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