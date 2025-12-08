const express = require('express');
const net = require('net'); // Library สำหรับ TCP Socket
const cors = require('cors'); // Library สำหรับ CORS

const app = express();
const API_PORT = 4000;
const LOGSTASH_HOST = 'logstash'; // 🟢 ชื่อ Service ใน Docker Compose
const LOGSTASH_PORT = 5000; // 🟢 Port ที่ Logstash กำลังฟังอยู่

// Middleware Setup
app.use(cors()); // อนุญาตให้ React (จาก Port 8080) ส่ง Request มาได้
app.use(express.json()); // รับค่า JSON ที่ React ส่งมา

// ----------------------------------------------------
// API Endpoint: /log (รับ Log จาก React)
// ----------------------------------------------------
app.post('/log', (req, res) => {
    const logData = req.body;
    
    // 1. จับ IP Address ที่แท้จริงของผู้ใช้
    logData.client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // 2. แปลงข้อมูล JSON เป็น String และเพิ่ม \n (Line Break) ให้ Logstash รู้ว่าจบหนึ่งบรรทัด
    const logMessage = JSON.stringify(logData) + '\n'; 
    
    // 3. ส่งข้อมูลผ่าน TCP Socket ไปหา Logstash
    const client = net.connect(LOGSTASH_PORT, LOGSTASH_HOST, () => {
        console.log(`[API] Sending log to Logstash: ${logData.event_type}`);
        client.write(logMessage);
        client.end(); // ปิดการเชื่อมต่อ Socket
    });

    client.on('error', (err) => {
        console.error(`[API ERROR] Could not connect to Logstash: ${err.message}`);
    });

    res.status(200).send({ status: 'Log received and forwarded' });
});

// Start Server
app.listen(API_PORT, () => {
    console.log(`API Gateway running on port ${API_PORT}`);
});