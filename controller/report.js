const db = require('../config/db')


exports.postreport = async(req,res,next)=>{
    try {
       
        const {id_user,id_me} = req.params
        const {content}  = req.body
        db.query(
            `INSERT INTO getde (id_user, id_me, content) VALUES (?, ?, ?)`,
            [id_user, id_me, content],
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
        res.json({ status: 500, message: "Server Error <getreport>", error: error });
        console.log(error);
        next();
    }
}

exports.getreport = async (req, res, next) => {
    const { id_user, id_me } = req.params
    
    try {
        db.query(
            `SELECT getde.*, users.*
             FROM getde
             INNER JOIN users ON users.id = getde.id_user 
             WHERE getde.id_user = ?`, [id_user],
            (err, userReportResult) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next(err);
                }
                
                db.query(
                    `SELECT getde.*, users.*
                     FROM getde
                     INNER JOIN users ON users.id = getde.id_user 
                     WHERE getde.id_me = ?`, [id_me],
                    (err, meReportResult) => {
                        if (err) {
                            console.log(err);
                            res.json({ status: "error", message: err });
                            return next(err);
                        }
                        
                        res.json({ 
                            status: "success", 
                            userReport: userReportResult, 
                            meReport: meReportResult 
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "postreport", error: error });
        return next(error);
    }
};
