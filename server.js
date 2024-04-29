const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const fs = require('fs');
const path = require("path");
const port = 2000;

require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use('/api', express.static(path.join(__dirname, 'public')));

// เพิ่มเส้นทาง API เพื่อเข้าถึงภาพที่อยู่ในโฟลเดอร์ public/image
app.get('/api/image/:imageName', (req, res) => {
    // ดึงชื่อไฟล์ภาพจากพารามิเตอร์ URL
    const imageName = req.params.imageName;
    // สร้างตำแหน่งของไฟล์ภาพ
    const imagePath = path.join(__dirname, 'public', 'image', imageName);
    
    // ส่งไฟล์ภาพกลับไปยังผู้ใช้
    res.sendFile(imagePath);
});

readdirSync("./routes")
    .map((prefix) => {
        const filepath = path.join(__dirname, "routes", prefix)
        app.use('/api', require(filepath))
    })

app.listen(port, () => {
    try {
        console.log(`Server started on http://localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
})