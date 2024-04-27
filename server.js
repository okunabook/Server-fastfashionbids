const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const path = require("path");
const port = 2000;

require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api', express.static('public'))

readdirSync("./routes")
    .map((prefix) => {
        const filepath = path.join(__dirname, "routers", prefix)
        app.use('/api', require(filepath))
    })

app.listen(port, () => {
    try {
        console.log(`Server started on http://localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
})