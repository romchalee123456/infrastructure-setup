# ใช้ Node.js เวอร์ชันเดียวกับที่รันบนเครื่อง
FROM node:22

# ตั้งค่าตำแหน่งทำงานเป็น /app
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package.json package-lock.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดไปใน container
COPY . .

# เปิดพอร์ต 5000
EXPOSE 5000

# คำสั่งรันเซิร์ฟเวอร์
CMD ["node", "index.js"]

RUN npx prisma generate  # ✅ สร้าง Prisma Client