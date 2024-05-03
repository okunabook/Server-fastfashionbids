const db = require('../config/db')


exports.viewuser = async(req,res,next)=>{
    try {
        
        db.query(
            `SELECT users.username,users.fname,users.lname,users.img,users.id 
            FROM users where role = "user"`,
            
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
    } catch (error) {
        res.json({ status: 500, msg: "Server Error <viewsererror>", error: error });
        console.log(error);
        return next();
    }
}