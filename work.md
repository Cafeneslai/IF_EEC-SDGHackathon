# แผนการดำเนินงานและสถาปัตยกรรมระบบ (Detailed Work Plan): โครงการ EEC GoFlow

เอกสารนี้คือแผนการพัฒนาแบบละเอียด (Blueprint) สำหรับทีมพัฒนา เพื่อใช้เป็นแนวทางในการเขียนโค้ดและตั้งค่าโปรเจกต์แบบ Step-by-step โดยอ้างอิงจากความต้องการใน `Read.md`

---

## 🏗️ 1. สถาปัตยกรรมระบบและโครงสร้างโปรเจกต์ (System Architecture & Setup)

### 1.1 โครงสร้างโฟลเดอร์ (Repository Structure)
แบ่งเป็น 3 ส่วนหลัก (Monorepo):
- `eec-goflow-frontend/` — React.js + Vite (Responsive Web App)
- `eec-goflow-backend/` — Node.js + Express + Prisma ORM
- `eec-goflow-ai/` — Python + FastAPI + Ollama (LLM-based AI)

### 1.2 การออกแบบฐานข้อมูล (Database Schema — SQLite via Prisma)
- [x] **Users**: `id`, `email` (unique), `password`, `name`, `age`, `budget_level`, `travel_style` (JSON), `points`
- [x] **Locations**: `id`, `name`, `type` (เที่ยว/กิน/พัก), `lat`, `lng`, `province`, `popularity_score`, `category_tags` (JSON)
- [x] **Trips**: `id`, `userId`, `startDate`, `endDate`, `itinerary` (JSON)
- [x] **Checkpoints**: `id`, `locationId`, `reward_points`, `coupon_details`
- [x] **UserCheckpoints**: `id`, `userId`, `checkpointId`, `timestamp`

### 1.3 Seed Data
- [x] Mock User 1 คน (email: test@example.com)
- [x] Location 21+ แห่ง (ชลบุรี 7, ระยอง 7, ฉะเชิงเทรา 7) พร้อมพิกัด lat/lng จริง
- [x] Checkpoint 3 จุด พร้อมคูปอง

---

## 💻 2. การพัฒนาส่วนหน้าบ้าน (Frontend Development)
**Tech Stack**: React 18 (Vite), Vanilla CSS + Tailwind utilities, React Router v6, Lucide React Icons, Leaflet (แผนที่), html2canvas (แชร์ภาพ)

### หน้าจอที่พัฒนาแล้ว:
- [x] **2.1 Home (หน้าแรก)** — หน้า Landing Page แสดงจุดเด่นของแอป พร้อมปุ่ม CTA "เริ่มจัดทริป" และ Hero Section
- [x] **2.2 Onboarding (แบบสอบถาม)** — ฟอร์มให้ผู้ใช้กรอกข้อมูล:
  - จังหวัดปลายทาง (ชลบุรี/ระยอง/ฉะเชิงเทรา)
  - จำนวนวัน (1-7), งบประมาณ (ประหยัด/ปานกลาง/หรู)
  - จำนวนผู้เดินทาง (1-20 คน), ช่วงอายุ (วัยรุ่น/วัยทำงาน/ผู้ใหญ่/ผู้สูงอายุ/ครอบครัว)
  - สไตล์การท่องเที่ยว (ธรรมชาติ/ทะเล/คาเฟ่ — เลือกได้หลายข้อ)
- [x] **2.3 Itinerary (แผนการเดินทาง AI)** — หน้าแสดงผลลัพธ์จาก AI:
  - Timeline แสดงกิจกรรมแต่ละช่วงเวลา (เช้า/กลางวัน/บ่าย/เย็น)
  - ปุ่ม "Smart Alternative" สุ่มสถานที่ใหม่ (เรียก AI ทีละจุด)
  - ระบบแสดงความหนาแน่นนักท่องเที่ยว (คนต่ำ/ปานกลาง/สูง) พร้อมสีเตือน
  - การ์ดพิเศษ "Local Discovery" สีทอง สำหรับสถานที่ OTOP/วิสาหกิจชุมชน
  - ปุ่ม Check-in (Location Service จำลอง) รับ SDG Coupon
  - Eco-Routing คำแนะนำการเดินทางรักษ์โลกระหว่างจุด
  - แผนที่ Leaflet ปักหมุดจากพิกัดจริงในฐานข้อมูล
  - สภาพอากาศ Real-time (Open-Meteo API)
  - Budget Summary + Eco Score
  - ปุ่มแชร์ทริป (Export เป็นรูปภาพผ่าน html2canvas)
  - Gamification: รวม SDG Points จากการ Check-in
- [x] **2.4 SmartMap (แผนที่ดิจิทัล)** — แผนที่ Leaflet แสดง Pin ตำแหน่งสถานที่ทั้งหมดจาก DB แยกตามจังหวัด
- [x] **2.5 Login (เข้าสู่ระบบ)** — หน้า Login ดีไซน์ Glassmorphism, เก็บ session ใน localStorage
- [x] **2.6 Register (สมัครสมาชิก)** — หน้าสมัครสมาชิก (ชื่อ, email, password, อายุ)

### UI/UX Features:
- [x] Dark Mode / Light Mode Toggle
- [x] Theme Color Switcher (Cyan, Sunset, Emerald, Violet)
- [x] Responsive Design (Desktop Navbar + Mobile Bottom Nav)
- [x] Search Bar ใน Header
- [x] User Profile Badge + SDG Points ด้านบนขวา (เมื่อ Login แล้ว)
- [x] Glassmorphism UI + Gradient Backgrounds + Micro-animations

---

## ⚙️ 3. การพัฒนาส่วนหลังบ้าน (Backend Development)
**Tech Stack**: Node.js 20, Express.js, Prisma (ORM), SQLite, CORS

### API Endpoints ที่พัฒนาแล้ว:
- [x] **3.1 Authentication**
  - `POST /api/auth/register` — สมัครสมาชิก (email, password, name, age)
  - `POST /api/auth/login` — เข้าสู่ระบบ (email, password)
- [x] **3.2 Locations**
  - `GET /api/locations` — ดึงรายชื่อสถานที่ (รองรับ query ?province=xxx&type=xxx)
- [x] **3.3 Check-in (Location Service)**
  - `POST /api/checkin` — Endpoint สำหรับเช็คอินจุด Checkpoint (Placeholder — พร้อมขยายรองรับ GPS)
- [x] **3.4 Trips (AI Integration)**
  - `POST /api/trips/generate` — รับข้อมูลจาก Frontend → ดึง Location จาก DB → ดึง Weather Real-time → ส่งทั้งหมดให้ Python AI → Enrich พิกัดจาก DB → บันทึกลง DB → ส่งกลับ Frontend
  - `POST /api/trips/regenerate` — สุ่มสถานที่ใหม่ทีละจุด (Smart Alternative)

### Backend Logic ที่น่าสนใจ:
- [x] **Weather Context Fetch**: ดึงพยากรณ์อากาศ Real-time จาก Open-Meteo API ก่อนส่งให้ AI
- [x] **Season Detection**: คำนวณฤดูกาลอัตโนมัติ (ร้อน/ฝน/หนาว) จากเดือนปัจจุบัน
- [x] **Coordinate Enrichment**: จับคู่ชื่อสถานที่จาก AI กับพิกัด lat/lng จริงในฐานข้อมูล

---

## 🧠 4. การพัฒนาปัญญาประดิษฐ์ (AI & Data Analytics)
**Tech Stack**: Python 3.11, FastAPI, Ollama (llama3.1 Local LLM), Pydantic

### AI Capabilities ที่พัฒนาแล้ว:
- [x] **4.1 AI Trip Planner** — สร้างแผนเดินทางเฉพาะบุคคลจากข้อมูล:
  - จำนวนวัน, งบประมาณ, จำนวนผู้เดินทาง, ช่วงอายุ
  - สไตล์การท่องเที่ยว, จังหวัด
  - รายชื่อสถานที่จริงจากฐานข้อมูล (Grounded AI)
  - สภาพอากาศและฤดูกาล Real-time
- [x] **4.2 Eco-Routing** — AI แนะนำวิธีเดินทางระหว่างจุดที่ลดคาร์บอน (EV Bus, เดิน, จักรยาน) พร้อม eco_tip
- [x] **4.3 Local Discovery** — AI บังคับแทรกสถานที่ OTOP/วิสาหกิจชุมชนอย่างน้อย 1 แห่ง/วัน พร้อมเล่าเรื่องราวอัตลักษณ์ท้องถิ่น
- [x] **4.4 Smart Alternative** — API สุ่มสถานที่ทดแทน เมื่อจุดเดิมคนเยอะ/ไม่ถูกใจ โดยเน้นสถานที่คนน้อยกว่า
- [x] **4.5 Crowded Level Assessment** — AI ประเมินระดับความหนาแน่นนักท่องเที่ยว (สูง/ปานกลาง/ต่ำ) ของแต่ละสถานที่
- [x] **4.6 Weather-Aware Planning** — AI ปรับแผนตามสภาพอากาศ (ฝนตก → เน้นสถานที่ในร่ม)

### AI Output Structure (JSON):
```json
{
  "summary": { "total_budget_estimate": 1500, "eco_score_percentage": 85, "theme": "ธีม" },
  "plan": [{
    "day": 1,
    "itinerary": [{
      "time": "เช้า",
      "location": "ชื่อสถานที่",
      "type": "ประเภท",
      "description": "คำอธิบาย + อัตลักษณ์ท้องถิ่น",
      "cost_estimate": 200,
      "crowded_level": "ต่ำ",
      "is_otop": true,
      "travel_to_next": { "mode": "EV Bus", "duration": "15 นาที", "eco_tip": "..." }
    }]
  }]
}
```

---

## 🔗 5. การบูรณาการระบบ (Integration & API Services)

- [x] **5.1 Full-Stack Flow**: User กดสร้างทริป → Frontend → Node.js Backend → ดึง Location DB + ดึง Weather API → ส่ง Python AI → AI ตอบ JSON → Backend Enrich พิกัด → บันทึก DB → ส่งกลับ Frontend แสดงผล
- [x] **5.2 Weather API (Open-Meteo)**: ดึงพยากรณ์อากาศ Real-time ก่อนส่งให้ AI
- [x] **5.3 Map Integration (Leaflet + OpenStreetMap)**: ปักหมุดจากพิกัดจริงใน DB
- [x] **5.4 Share Feature (html2canvas)**: Export ทริปเป็นรูปภาพพร้อมแชร์

---

## 🚀 6. การทดสอบและการนำขึ้นใช้งาน (Testing & Deployment)

- [x] **6.1 Mock Data Testing**: จำลอง User หลายกลุ่ม (ครอบครัว, วัยรุ่น, ผู้สูงอายุ) เพื่อทดสอบว่า AI จัดแผนต่างกัน
- [ ] **6.2 ตรวจสอบ PDPA**: เพิ่มหน้าต่าง Consent ขออนุญาตเก็บข้อมูล
- [ ] **6.3 Deployment**:
  - Frontend: Vercel / Netlify
  - Backend: Render / Railway
  - AI: Docker Container
- [x] **6.4 นำเสนอโครงการ**: เตรียมสไลด์เน้นจุดเด่น

---

# 🔮 7. แผนพัฒนาในอนาคต (Future Roadmap)

## Phase 1: ปรับปรุงประสบการณ์ผู้ใช้ (UX Enhancement) — ระยะสั้น 1-2 เดือน

### 7.1 🌐 ระบบรองรับหลายภาษา (Multi-language Support)
- เพิ่มภาษาอังกฤษ, จีน, ญี่ปุ่น, เกาหลี เพื่อรองรับนักท่องเที่ยวต่างชาติ
- ใช้ i18n Library (react-i18next) จัดการ Translation
- AI สามารถตอบแผนเดินทางเป็นภาษาอังกฤษได้เมื่อเลือกภาษา

### 7.2 📱 Progressive Web App (PWA)
- แปลงเว็บเป็น PWA ที่ใช้ Offline ได้
- เก็บแผนเดินทางไว้ใน Cache เพื่อดูได้แม้ไม่มีเน็ต
- Push Notification แจ้งเตือนเมื่อใกล้ถึง Checkpoint

### 7.3 🎙️ Voice Input (คำสั่งเสียง)
- ให้ผู้ใช้พูด "อยากไปทะเลระยอง 2 วัน งบ 3000" แล้ว AI เข้าใจ
- ใช้ Web Speech API ของ Browser
- เหมาะกับผู้ใช้ที่ไม่ถนัดพิมพ์ หรือผู้สูงอายุ

### 7.4 📊 Trip History & Dashboard
- หน้า "ประวัติทริป" ให้ผู้ใช้ดูทริปเก่าที่เคยสร้างทั้งหมด
- Dashboard สถิติ: จำนวนทริป, SDG Points สะสม, จังหวัดที่ไปบ่อย, Eco Score เฉลี่ย
- กราฟแสดงแนวโน้มการเดินทาง (Chart.js / Recharts)

---

## Phase 2: AI ขั้นสูง (Advanced AI) — ระยะกลาง 3-6 เดือน

### 7.5 🧠 AI เรียนรู้จากพฤติกรรม (Collaborative Filtering + Learning)
- เก็บข้อมูลว่าผู้ใช้เลือก/ไม่เลือกสถานที่ไหน กด Smart Alternative บ่อยแค่ไหน
- ใช้ Collaborative Filtering: "คนที่ชอบที่เดียวกับคุณ ยังชอบที่เหล่านี้ด้วย"
- AI ปรับ Prompt อัตโนมัติตามประวัติเพื่อ Recommend ได้แม่นขึ้น

### 7.6 🔄 Dynamic Re-planning (ปรับแผนระหว่างทาง)
- เมื่อผู้ใช้กำลังเดินทางจริง ถ้าฝนตกกะทันหัน หรือร้านปิด
- ระบบ Re-plan อัตโนมัติ: เปลี่ยนสถานที่ถัดไปทั้งหมดให้เหมาะกับสถานการณ์ใหม่
- Push Notification: "ฝนตกหนัก! เราเปลี่ยนจุดถัดไปจากชายหาดเป็นคาเฟ่ในร่มให้แล้ว"

### 7.7 📸 AI Image Recognition (รู้จำรูปภาพ)
- ถ่ายรูปสถานที่ แล้ว AI บอกว่าเป็นที่ไหน + ข้อมูลเพิ่มเติม
- ถ่ายรูปเมนูอาหาร → AI แปลเป็นภาษาอังกฤษพร้อมราคา
- ถ่ายรูปสินค้า OTOP → AI เล่าที่มาและเรื่องราวของสินค้า

### 7.8 💬 AI Chatbot (ผู้ช่วยสนทนา)
- เพิ่มปุ่มแชทลอยมุมขวาล่าง ถามคำถามเกี่ยวกับทริปได้ตลอด
- ตัวอย่าง: "ร้านอาหารใกล้ที่นี่ที่เปิดอยู่ตอนนี้?" "เปลี่ยนทริปพรุ่งนี้ให้เน้นวัดได้มั้ย?"
- ใช้ Ollama + RAG (Retrieval Augmented Generation) เพื่อตอบจากข้อมูลสถานที่จริง

---

## Phase 3: ขยายระบบนิเวศ (Ecosystem Expansion) — ระยะยาว 6-12 เดือน

### 7.9 🏪 ระบบสำหรับผู้ประกอบการ (Merchant Portal)
- Dashboard สำหรับร้านค้า/ร้านอาหาร/โรงแรม:
  - ดูจำนวนนักท่องเที่ยวที่ถูก AI แนะนำมา
  - สร้าง/จัดการคูปองและโปรโมชันเอง
  - ดูสถิติ Check-in และ Redemption
  - อัปเดตข้อมูลร้าน (เวลาเปิดปิด, เมนูพิเศษ, ภาพถ่าย)
- ระบบยืนยันตัวตนร้านค้า (Verified Merchant)

### 7.10 🗺️ ระบบแผนที่ขั้นสูง (Advanced Smart Map)
- แสดง Heatmap ความหนาแน่นนักท่องเที่ยว Real-time (เชื่อมกับข้อมูล Check-in ของผู้ใช้ทุกคน)
- Navigation แบบ Turn-by-turn ระหว่างจุด (Google Directions API / OSRM)
- แสดงเส้นทางรถ EV Bus / เรือ / จักรยานสาธารณะ
- AR (Augmented Reality) ซ้อนข้อมูลสถานที่บนกล้อง

### 7.11 🎮 Gamification ขั้นสูง (SDG Leaderboard & Badges)
- **Leaderboard**: อันดับนักท่องเที่ยวรักษ์โลก (SDG Points สูงสุดประจำเดือน)
- **Badge System**: เหรียญสะสมจากความสำเร็จ เช่น:
  - 🏅 "EEC Explorer" — เช็คอินครบทั้ง 3 จังหวัด
  - 🌿 "Eco Warrior" — Eco Score เฉลี่ยเกิน 80%
  - 🛍️ "Local Champion" — เยี่ยมชม OTOP ครบ 10 แห่ง
  - ⚡ "Smart Traveler" — ใช้ Smart Alternative 5 ครั้ง
- **แลกรางวัล**: ใช้ SDG Points แลกส่วนลดร้านค้าจริง
- **Social Sharing**: แชร์ Badge ลง Facebook/Line

### 7.12 📈 Analytics Dashboard สำหรับหน่วยงานภาครัฐ
- Dashboard แสดงภาพรวมการท่องเที่ยว EEC:
  - จำนวนนักท่องเที่ยวแต่ละจังหวัด (รายวัน/สัปดาห์/เดือน)
  - สถานที่ยอดนิยม vs สถานที่ที่ได้รับ Smart Alternative มากที่สุด
  - อัตราการกระจายตัว (Dispersal Rate) ก่อน/หลังใช้ระบบ
  - มูลค่าการใช้จ่ายที่ชุมชนได้รับจากระบบ Checkpoint
  - แผนที่ Heatmap เปรียบเทียบการกระจุกตัวก่อน/หลัง

### 7.13 🤝 Social Features (ชุมชนนักเดินทาง)
- แชร์ทริปสาธารณะให้คนอื่นก็อปแผนไปใช้ได้
- รีวิวและให้คะแนนสถานที่หลังไปเยือน (พร้อมรูปภาพ)
- ฟีด "ทริปยอดนิยมประจำสัปดาห์"
- กลุ่มชุมชนตามสไตล์ (สายคาเฟ่, สายธรรมชาติ, สายครอบครัว)

### 7.14 🔔 Notification & Reminder System
- แจ้งเตือนก่อนวันเดินทาง: "ทริปพรุ่งนี้! เช็คสภาพอากาศ: แจ่มใส ☀️"
- แจ้งเตือนเมื่อใกล้ Checkpoint: "คุณอยู่ใกล้ร้านวิสาหกิจชุมชนเพียง 200 เมตร!"
- สรุปทริปหลังเดินทาง: "คุณเดินทาง 3 วัน ประหยัด CO₂ ได้ 5.2 kg!"

---

## Phase 4: โครงสร้างพื้นฐานระดับ Production — ระยะยาว 12+ เดือน

### 7.15 🔒 Security & PDPA Compliance
- Hash password ด้วย bcrypt
- ใช้ JWT Token สำหรับ Authentication
- PDPA Consent Banner: ขอความยินยอมก่อนเก็บข้อมูลตำแหน่งและพฤติกรรม
- Data Retention Policy: กำหนดระยะเวลาเก็บข้อมูล
- Data Export / Delete: ผู้ใช้สามารถขอดาวน์โหลดหรือลบข้อมูลตัวเองได้

### 7.16 🐳 Containerization & CI/CD
- Docker Compose สำหรับรัน Frontend + Backend + AI + DB ด้วยคำสั่งเดียว
- GitHub Actions: Auto Test + Build + Deploy เมื่อ Push ขึ้น main branch
- Staging Environment สำหรับทดสอบก่อน Deploy จริง

### 7.17 🌍 ขยายพื้นที่ให้บริการ (Scalability)
- ขยายจาก 3 จังหวัด EEC → ทุกจังหวัดในภาคตะวันออก → ทั่วประเทศไทย
- ระบบ Admin สำหรับเพิ่มจังหวัดและสถานที่ใหม่โดยไม่ต้องแก้โค้ด
- รองรับ AI Model อื่น (GPT-4o, Gemini, Claude) เป็น Fallback หรือ Upgrade

### 7.18 📊 A/B Testing Framework
- ทดสอบว่า AI Prompt รูปแบบไหนให้ผลลัพธ์ดีกว่า
- เปรียบเทียบ Layout UI ที่ทำให้ผู้ใช้กด Smart Alternative มากขึ้น
- วัดผลว่าระบบทำให้นักท่องเที่ยวกระจายตัวจริงหรือไม่ (Controlled Experiment)
