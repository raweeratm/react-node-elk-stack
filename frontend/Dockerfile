# ใช้ Node.js 18 บน Alpine Linux 
FROM node:18-alpine 

# กำหนดโฟลเดอร์ทำงานใน Container
WORKDIR /app

# ก๊อปไฟล์ package.json เพื่อติดตั้ง Dependencies (ใช้ Layer Caching)
COPY package.json package-lock.json ./

# ติดตั้ง Dependencies ทั้งหมด
RUN npm install

# ก๊อปปี้โค้ด React ที่เหลือทั้งหมด
COPY . .

# กำหนด Port
EXPOSE 3000

# คำสั่งรัน (จะรัน npm start ที่อยู่ใน package.json)
CMD ["npm", "start"]