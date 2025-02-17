# ใช้ Node.js เวอร์ชันเดียวกับที่รันบนเครื่อง
FROM node:22

# ตั้งค่าตำแหน่งทำงานเป็น /app
WORKDIR /app

# คัดลอก package.json และ package-lock.json ไปที่ container
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโฟลเดอร์ prisma เข้าไปใน container
COPY prisma ./prisma

# คัดลอกโค้ดทั้งหมดไปใน container
COPY . .

# สร้าง Prisma Client
RUN npx prisma generate

# เปิดพอร์ต 5000
EXPOSE 5000

# คำสั่งรันเซิร์ฟเวอร์
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
