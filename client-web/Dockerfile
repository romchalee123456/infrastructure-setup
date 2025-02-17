# สเตจที่ 1: ใช้ base image Node.js สำหรับการพัฒนาและ build
FROM node:18-alpine AS builder

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เพื่อ caching dependencies
COPY client-web/package*.json ./

# ติดตั้ง dependencies โดยไม่ต้องติดตั้ง devDependencies (สำหรับ production build)
RUN npm install --only=production

# คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์ client-web ไปยัง container
COPY client-web/. .

# สร้าง production build
RUN npm run build

# สเตจที่ 2: ใช้ Nginx สำหรับให้บริการ production build
FROM nginx:alpine AS production

# คัดลอก production build จากสเตจ builder ไปยัง Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกไฟล์ Nginx configuration ถ้ามี
COPY client-web/nginx.conf /etc/nginx/nginx.conf

# ตั้งค่าให้ Nginx ทำงาน
CMD ["nginx", "-g", "daemon off;"]

# สเตจที่ 3: ตั้งค่าการพัฒนา
FROM node:18-alpine AS development

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์ client-web ไปยัง container
COPY client-web/. .

# ติดตั้ง dependencies ทั้งหมด (รวม devDependencies)
RUN npm install

# เปิดพอร์ตสำหรับ Vite dev server
EXPOSE 3000

# เริ่ม Vite dev server สำหรับการพัฒนา
CMD ["npm", "run", "dev", "--", "--host"]
