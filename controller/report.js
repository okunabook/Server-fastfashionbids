const db = require('../config/db')


exports.postreport = async(req,res,next)=>{
    try {
       
        const {id_user,id_me} = req.params
        console.log(req.body);
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
    const { id_me } = req.params
    
    try {
        db.query(
            `SELECT getde.*, users.*
             FROM getde
             INNER JOIN users ON users.id = getde.id_me
             WHERE getde.id_me = ?`, [id_me],
            (err, userReportResult) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next(err);
                }
                console.log(userReportResult.length);
                if(userReportResult.length > 0 ){
                    db.query(
                        `SELECT users.*
                         FROM users
                         
                         WHERE users.id = ?`, [userReportResult[0].id_user],
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
                else{
                    return next()
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "postreport", error: error });
        return next(error);
    }
};
