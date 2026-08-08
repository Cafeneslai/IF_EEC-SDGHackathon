# แผนการดำเนินงานและสถาปัตยกรรมระบบ (Detailed Work Plan): โครงการ EEC GoFlow

เอกสารนี้คือแผนการพัฒนาแบบละเอียด (Blueprint) สำหรับทีมพัฒนา เพื่อใช้เป็นแนวทางในการเขียนโค้ดและตั้งค่าโปรเจกต์แบบ Step-by-step โดยอ้างอิงจากความต้องการใน `Read.md`

---

## 🏗️ 1. สถาปัตยกรรมระบบและโครงสร้างโปรเจกต์ (System Architecture & Setup)

### 1.1 โครงสร้างโฟลเดอร์ (Repository Structure)
แนะนำให้แบ่งเป็น 3 ส่วนหลัก (แยกโฟลเดอร์หรือทำเป็น Monorepo):
- `eec-goflow-frontend/` (React.js + Vite)
- `eec-goflow-backend/` (Node.js + Express)
- `eec-goflow-ai/` (Python + FastAPI หรือ Flask สำหรับรันโมเดล AI)

### 1.2 การออกแบบฐานข้อมูล (Database Schema)
แนะนำให้ใช้ **PostgreSQL** (หรือ MongoDB) โดยมีตารางหลักดังนี้:
1. **Users**: `id`, `name`, `age`, `budget_level`, `travel_style` (array), `points`
2. **Locations**: `id`, `name`, `type` (เที่ยว/กิน/พัก), `lat`, `lng`, `province` (ชลบุรี/ระยอง/ฉะเชิงเทรา), `popularity_score`, `category_tags`
3. **Trips (แผนการเดินทาง)**: `id`, `user_id`, `start_date`, `end_date`, `itinerary` (JSON data ของเส้นทาง)
4. **Checkpoints**: `id`, `location_id`, `reward_points`, `coupon_details`
5. **User_Checkpoints**: `id`, `user_id`, `checkpoint_id`, `timestamp`

---

## 💻 2. การพัฒนาส่วนหน้าบ้าน (Frontend Development)
**Tech Stack**: React (Vite), Tailwind CSS, React Router, Zustand (จัดการ State), Mapbox GL JS หรือ Google Maps API

### ขั้นตอนการทำงาน:
- [ ] **2.1 สร้างโปรเจกต์**: `npm create vite@latest eec-goflow-frontend -- --template react`
- [ ] **2.2 ติดตั้งไลบรารีที่จำเป็น**: 
  - `npm install react-router-dom axios tailwindcss lucide-react zustand mapbox-gl`
- [ ] **2.3 พัฒนาหน้า Onboarding & Questionnaire**:
  - สร้างฟอร์มให้ผู้ใช้กรอก: จำนวนคนเดินทาง, งบประมาณ (ประหยัด/ปานกลาง/หรู), สไตล์ (ธรรมชาติ/คาเฟ่/ผจญภัย)
- [ ] **2.4 พัฒนาหน้า Smart Map**:
  - ฝังแผนที่ (Mapbox/Google Maps)
  - สร้าง Component สำหรับแสดง Pin สถานที่แยกตามสี (ร้านอาหาร, ที่เที่ยว, Checkpoint)
- [ ] **2.5 พัฒนาหน้า Itinerary (แผนการเดินทาง)**:
  - แสดง Timeline ของทริป (เช้าไปไหน, เที่ยงกินอะไร)
  - มีปุ่ม "เปลี่ยนสถานที่" (Smart Alternative) ถ้ารู้สึกว่าคนเยอะเกินไป
- [ ] **2.6 พัฒนาหน้า Local Discovery & Checkpoint**:
  - แสดงรายการคูปองและ QR Code สำหรับสแกนรับสิทธิ์
  - แสดงข้อมูล OTOP และวิถีชุมชนของสถานที่นั้นๆ

---

## ⚙️ 3. การพัฒนาส่วนหลังบ้าน (Backend Development)
**Tech Stack**: Node.js, Express.js, Prisma (ORM), PostgreSQL, JWT (Authentication)

### ขั้นตอนการทำงาน:
- [ ] **3.1 สร้างโปรเจกต์**: `npm init -y` และติดตั้ง `npm install express cors dotenv prisma @prisma/client jsonwebtoken`
- [ ] **3.2 สร้าง API สำหรับ Users (Authentication & Profile)**:
  - `POST /api/auth/register` และ `POST /api/auth/login`
  - `GET /api/users/profile`
- [ ] **3.3 สร้าง API สำหรับ Locations & Checkpoints**:
  - `GET /api/locations` (รองรับ Query parameters เช่น ?province=ชลบุรี&type=cafe)
  - `GET /api/checkpoints`
- [ ] **3.4 สร้าง API สำหรับ Check-in (Location Service)**:
  - `POST /api/checkin` (รับพิกัด lat/lng ของผู้ใช้ มาเทียบกับตำแหน่ง Checkpoint ถ้าระยะห่างไม่เกินกำหนดให้ผ่าน + แจกคูปอง)
- [ ] **3.5 สร้าง API สำหรับจัดการทริป**:
  - `POST /api/trips/generate` (รับข้อมูลจาก User แล้วส่งต่อไปให้ AI Service ประมวลผล)
  - `GET /api/trips/:id` (ดึงแผนการเดินทางที่บันทึกไว้)

---

## 🧠 4. การพัฒนาปัญญาประดิษฐ์ (AI & Data Analytics)
**Tech Stack**: Python, FastAPI, Pandas, Scikit-learn, GeoPy

### ขั้นตอนการทำงาน:
- [ ] **4.1 รวบรวม Dataset เบื้องต้น**: 
  - สร้างไฟล์ CSV รวบรวมสถานที่ใน 3 จังหวัด EEC (ใส่ชื่อ, พิกัด, หมวดหมู่, คะแนนรีวิว, ความหนาแน่นเฉลี่ย)
- [ ] **4.2 พัฒนา Recommendation Engine (ระบบแนะนำสถานที่)**:
  - ใช้ **Content-based Filtering**: จับคู่ `travel_style` ของผู้ใช้ กับ `category_tags` ของสถานที่
- [ ] **4.3 พัฒนา AI Trip Planner (ระบบจัดทริป)**:
  - เขียนอัลกอริทึมจัดลำดับ (Routing): จัดเรียงสถานที่ตามระยะทาง (ใช้ `GeoPy` คำนวณพิกัด) เพื่อไม่ให้ขับรถวนไปมา
  - แบ่งสถานที่ตามช่วงเวลา (เช่น เช้าเที่ยว, เที่ยงกินข้าว, บ่ายคาเฟ่)
- [ ] **4.4 พัฒนา Smart Alternative**:
  - อัลกอริทึมหาสถานที่ทดแทน: เมื่อพิกัดหลักความหนาแน่นสูง ค้นหาสถานที่ที่ `category_tags` เหมือนกัน และอยู่ใกล้พิกัดเดิมที่สุด (Radius search)
- [ ] **4.5 สร้าง API ของ AI (FastAPI)**:
  - เปิด Endpoint: `POST /generate-plan` เพื่อให้ Node.js Backend เรียกใช้งาน

---

## 🔗 5. การบูรณาการระบบ (Integration & API Services)

### ขั้นตอนการทำงาน:
- [ ] **5.1 เชื่อมต่อ Frontend <-> Node.js <-> Python AI**:
  - ทสอบ Flow: User กดสร้างทริป -> Node.js รับเรื่อง -> ส่งต่อให้ Python คำนวณ -> ส่งกลับมา Node.js -> บันทึกลง Database -> โชว์บน Frontend
- [ ] **5.2 ดึงข้อมูล Weather API (สภาพอากาศ)**:
  - สมัคร OpenWeatherMap API
  - นำข้อมูลฝนตกมาสร้างเงื่อนไขใน AI (ถ้าฝนตก ให้สลับแพลนไปพิพิธภัณฑ์/คาเฟ่ แทนทะเล)
- [ ] **5.3 ทดสอบ Location Service (GPS)**:
  - ใช้ HTML5 Geolocation API (`navigator.geolocation`) ใน Frontend จำลองการเดินไปถึง Checkpoint

---

## 🚀 6. การทดสอบและการนำขึ้นใช้งาน (Testing & Deployment)

### ขั้นตอนการทำงาน:
- [ ] **6.1 การทดสอบจำลองข้อมูล (Mock Data Testing)**:
  - จำลอง User 3 กลุ่ม (ครอบครัว, คู่รัก, สายผจญภัยเดี่ยว) และดูว่า AI จัดแผนออกมาต่างกันจริงหรือไม่
- [ ] **6.2 ตรวจสอบ PDPA (Privacy & Consent)**:
  - เพิ่มหน้าต่าง Consent ขออนุญาตเก็บข้อมูลโลเคชั่นและพฤติกรรมใน Frontend
- [ ] **6.3 นำระบบขึ้นเซิร์ฟเวอร์ (Deployment)**:
  - **Frontend**: นำขึ้น Vercel หรือ Netlify (ฟรีและเร็ว)
  - **Backend (Node.js & Python)**: นำขึ้น Render, Railway, หรือ Heroku
  - **Database**: ใช้ Supabase หรือ MongoDB Atlas
- [ ] **6.4 นำเสนอโครงการ (Pitching Preparation)**:
  - เตรียมสไลด์เน้นจุดเด่น: 1. AI จัดทริป 2. Smart Alternative กระจายรายได้ 3. Checkpoint ดึงคนเข้าชุมชน
