const express = require('express');
const cors = require('cors'); // Library สำหรับ CORS

const app = express();
const API_PORT = 4000;
const LOGSTASH_HOST = 'logstash'; // 🟢 ชื่อ Service ใน Docker Compose
const LOGSTASH_PORT = 5000; // 🟢 Port ที่ Logstash กำลังฟังอยู่

// Middleware Setup
app.use(cors()); // อนุญาตให้ React (จาก Port 8080) ส่ง Request มาได้
app.use(express.json()); // รับค่า JSON ที่ React ส่งมา

// เปลี่ยนปลายทางเป็น Logstash HTTP API (ใช้ชื่อ Service ใน Docker: 'logstash')
const LOGSTASH_API_ENDPOINT = 'http://logstash:8080';

// ----------------------------------------------------
/// Endpoint สำหรับรับ Log จาก React
// ----------------------------------------------------
app.post('/log', async (req, res) => { // ต้องเป็น async function
    const logData = req.body;
    logData.client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
      // ใช้ fetch เพื่อยิง HTTP POST ไปที่ Logstash
      const logstashResponse = await fetch(LOGSTASH_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData) // ส่ง JSON Body
      });

      if (logstashResponse.ok || logstashResponse.status === 200) {
        console.log(`[API] Log sent successfully to Logstash via HTTP: ${logData.event_type}`);
        res.status(200).send({ status: 'Log received and forwarded via HTTP' });
      } else {
         console.error(`[API ERROR] Logstash returned status: ${logstashResponse.status}`);
         res.status(500).send({ status: 'Failed to forward log to Logstash' });
      }

    } catch (err) {
      console.error(`[API ERROR] Failed to connect to Logstash HTTP API: ${err.message}`);
      res.status(500).send({ status: 'Logstash connection failed' });
    }
});

// Start Server
app.listen(API_PORT, () => {
    console.log(`API Gateway running on port ${API_PORT}`);
});