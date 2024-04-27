const express = require('express')
const cors =  require('cors')
const morgan = require('morgan')
const port = 4000
const {readdirSync} = require('fs')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

readdirSync('./routes').map((filename)=>{
    const filepath = path.join(__dirname,'routes',filename)
    app.use('/api',require(filepath))
})


app.listen(port, () => {
    try {
        console.log(`server started on localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
})