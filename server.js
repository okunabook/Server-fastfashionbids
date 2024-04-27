const express = require('express')
const cors =  require('cors')
const morgan = require('morgan')
const port = 4000

const app = express()

app.use(cors())
app.use(morgan('dev'))

app.get('/test',(req,res,next)=>{
    try {
        res.json({m:"ok"})
    } catch (error) {
        console.log(error);
        next()
    }
})



app.listen(port, () => {
    try {
        console.log(`server started on localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
})