const db = require('../config/db')


exports.postreport = async(req,res,next)=>{
    // const {id_user,id_me} = req.params
    const {content} = req.body
    console.log(content);
    try {
        db.query`
        insert into report (content) value(?)
        `,[content],
        (err,result)=>{
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
        

        
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "postreport", error: error });
        return next();
    }
}

exports.getreport = async (req, res, next) => {
    const { id_user, id_me } = req.params
    
    try {
        db.query(
            `SELECT report.*, users.*
             FROM report
             INNER JOIN users ON users.id = report.id_user 
             WHERE report.id_user = ?`, [id_user],
            (err, userReportResult) => {
                if (err) {
                    console.log(err);
                    res.json({ status: "error", message: err });
                    return next(err);
                }
                
                db.query(
                    `SELECT report.*, users.*
                     FROM report
                     INNER JOIN users ON users.id = report.id_user 
                     WHERE report.id_me = ?`, [id_me],
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
