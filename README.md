# 🌴 EEC Journey : Smart AI Travel Companion
**IF_EEC-SDGHackathon Project**

EEC Journey คือแอปพลิเคชันวางแผนการท่องเที่ยวอัจฉริยะแบบ 100% AI-Driven ที่ถูกออกแบบมาเพื่อส่งเสริมการท่องเที่ยวในเขตพัฒนาพิเศษภาคตะวันออก (EEC: ชลบุรี, ระยอง, ฉะเชิงเทรา) โดยมุ่งเน้นความยั่งยืน (SDG) และการลดคาร์บอน

แอปพลิเคชันนี้ใช้ **Ollama (Llama 3.1)** ในการประมวลผลข้อมูลทั้งหมด ไม่ว่าจะเป็นการจัดทริป, ประเมินงบประมาณ, คำนวณคะแนนรักษ์โลก (Eco-Score), และแนะนำวิธีการเดินทาง (Eco-Routing) 

---

## ✨ Features (จุดเด่นของระบบ)

- 🤖 **100% AI-Driven Itinerary:** วางแผนทริปแบบละเอียด (เช้า-เย็น) โดย AI 
- 🌿 **Eco-Routing (SDG Focus):** AI แนะนำเส้นทางและวิธีการเดินทางที่ลดคาร์บอน (เช่น EV Bus, เดินเท้า) พร้อมบอกเวลา
- 📊 **Real-time AI Eco-Meter & Budget:** ประเมินคะแนนรักษ์โลกและงบประมาณจากแผนที่จัดขึ้นจริง
- 🔄 **AI Regenerate Place:** หากไม่ชอบสถานที่ที่จัดให้ สามารถกดปุ่มสุ่มใหม่ AI จะหาสถานที่ใหม่ในบริบทเดิมมาสับเปลี่ยนให้ทันที
- 🎨 **Premium Glassmorphism UI:** ดีไซน์หน้าเว็บล้ำสมัย สไตล์กระจกฝ้า พร้อม Animated Mesh Gradient

---

## 🏗️ Architecture (โครงสร้างโปรเจกต์)

โปรเจกต์นี้แบ่งออกเป็น 3 ส่วนหลัก (Microservices Architecture):

1. **`eec-goflow-frontend/`** (React + Vite + TailwindCSS)
   - หน้าบ้านแสดงผล UI สวยงาม จัดการ State และดึงข้อมูลจาก Backend
2. **`eec-goflow-backend/`** (Node.js + Express + Prisma + SQLite)
   - หลังบ้านทำหน้าที่จัดการฐานข้อมูล (Database) และเป็นตัวกลางเชื่อมต่อกับ AI Service
3. **`eec-goflow-ai/`** (Python + FastAPI + Ollama)
   - สมองกล AI รันแบบ Local ดึงข้อมูลและประมวลผล Prompt คืนค่ากลับมาเป็น JSON

---

## 🚀 Getting Started (วิธีติดตั้งและรันโปรเจกต์)

### 📋 Prerequisites (สิ่งที่ต้องมี)
- Node.js (v18+)
- Python (3.10+)
- [Ollama](https://ollama.com/) ติดตั้งบนเครื่อง (และต้อง pull model `llama3.1` ไว้แล้ว คำสั่ง: `ollama run llama3.1`)

---

### Step 1: รัน AI Service (Python)
เปิด Terminal ใหม่แล้วรันคำสั่งต่อไปนี้:
```bash
cd eec-goflow-ai
pip install fastapi uvicorn pydantic ollama
python main.py
```
> เซิร์ฟเวอร์ AI จะรันอยู่ที่: `http://localhost:8000`

---

### Step 2: รัน Backend Service (Node.js)
เปิด Terminal ใหม่แล้วรันคำสั่งต่อไปนี้:
```bash
cd eec-goflow-backend
npm install

# สร้างฐานข้อมูล (ถ้ายังไม่มี)
npx prisma db push

# สุ่มข้อมูลสถานที่ลง Database (สำคัญมาก เพื่อให้ AI มีบริบท)
node seed.js

# รันเซิร์ฟเวอร์
node index.js
```
> เซิร์ฟเวอร์ Backend จะรันอยู่ที่: `http://localhost:3000`

---

### Step 3: รัน Frontend (React)
เปิด Terminal ใหม่แล้วรันคำสั่งต่อไปนี้:
```bash
cd eec-goflow-frontend
npm install
npm run dev
```
> หน้าเว็บแอปพลิเคชันจะเปิดขึ้นมาที่: `http://localhost:5173` (หรือพอร์ตที่ Vite กำหนด)

---

## 💡 How to use (วิธีใช้งานเพื่อพรีเซนต์)
1. เปิดหน้าเว็บไปที่หน้า **เริ่มสร้างทริป (Onboarding)**
2. เลือกจังหวัด (ชลบุรี, ระยอง, หรือ ฉะเชิงเทรา)
3. เลือกระยะเวลา (แนะนำ 2-3 วัน เพื่อโชว์ฟีเจอร์ Multi-day Tab)
4. เลือกสไตล์การเที่ยวและงบประมาณ แล้วกด "สร้างทริป"
5. **รอสักครู่** ให้ Ollama ประมวลผลข้อมูลระดับลึก
6. ในหน้าแพลน คุณสามารถกดปุ่ม 🔄 ข้างๆ ชื่อสถานที่ เพื่อโชว์ฟีเจอร์ **AI Regenerate** ให้กรรมการดูได้เลย!
