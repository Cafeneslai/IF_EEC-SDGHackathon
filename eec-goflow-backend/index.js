const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- 1. User & Auth API ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, age, budget_level, travel_style } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password, // ในงาน Production ควรใช้ bcrypt เพื่อแฮชรหัสผ่าน
        name,
        age,
        budget_level,
        travel_style: JSON.stringify(travel_style)
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'Failed to register user: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// --- 2. Locations API ---
app.get('/api/locations', async (req, res) => {
  const { province, type } = req.query;
  try {
    const filters = {};
    if (province) filters.province = province;
    if (type) filters.type = type;
    
    const locations = await prisma.location.findMany({ where: filters });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// --- 3. Check-in API (Location Service) ---
app.post('/api/checkin', async (req, res) => {
  const { userId, lat, lng } = req.body;
  // TODO: Calculate distance between (lat, lng) and checkpoints
  res.json({ success: true, message: "Check-in logic not fully implemented yet" });
});

async function getWeatherContext(province) {
  const coords = {
    "ชลบุรี": { lat: 13.3611, lng: 100.9847 },
    "ระยอง": { lat: 12.6814, lng: 101.2816 },
    "ฉะเชิงเทรา": { lat: 13.6904, lng: 101.0719 }
  };
  const target = coords[province] || coords["ชลบุรี"];
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lng}&current_weather=true`);
    const data = await res.json();
    const temp = data.current_weather.temperature;
    const weathercode = data.current_weather.weathercode;
    const month = new Date().getMonth() + 1;
    let season = "ฤดูร้อน";
    if (month >= 5 && month <= 10) season = "ฤดูฝน";
    else if (month >= 11 && month <= 2) season = "ฤดูหนาว";
    let weatherDesc = "ท้องฟ้าแจ่มใส";
    if (weathercode >= 51 && weathercode <= 67) weatherDesc = "มีฝนตก";
    else if (weathercode >= 95) weatherDesc = "ฝนฟ้าคะนอง";
    else if (weathercode >= 3) weatherDesc = "มีเมฆมาก";
    return `ฤดูกาล: ${season}, สภาพอากาศวันนี้: ${weatherDesc} (อุณหภูมิ ${temp}°C)`;
  } catch(e) {
    return "ฤดูกาล: ฤดูร้อน, สภาพอากาศวันนี้: แจ่มใส";
  }
}

// --- 4. Trips API ---
// This endpoint will receive data and ideally call the Python FastAPI AI service
app.post('/api/trips/generate', async (req, res) => {
  const { userId, days, budget, travel_style, province, travelers, age } = req.body;
  
  try {
    // 1. Fetch available locations from DB to ground the AI
    const locations = await prisma.location.findMany({
      where: { province: province }
    });
    const locationNames = locations.map(loc => `${loc.name} (${loc.type})`).join(', ');

    // 1.5 Fetch Weather Context
    const weather_context = await getWeatherContext(province);

    // 2. Call AI Service (Python)
    const aiResponse = await fetch('http://127.0.0.1:8000/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        days, 
        budget, 
        travelers,
        age,
        travel_style, 
        province,
        available_locations: locationNames,
        weather_context
      })
    });
    const aiPlan = await aiResponse.json();

    // 2.5 Enrich with exact coordinates from Database
    if (aiPlan && aiPlan.plan) {
      aiPlan.plan.forEach(day => {
        if (day.itinerary) {
          day.itinerary.forEach(item => {
            const matchedLoc = locations.find(loc => 
              item.location.includes(loc.name) || loc.name.includes(item.location)
            );
            if (matchedLoc) {
              item.coord = [matchedLoc.lat, matchedLoc.lng];
            }
          });
        }
      });
    }

    // 3. Save to database
    const trip = await prisma.trip.create({
      data: {
        userId,
        startDate: new Date(),
        endDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)),
        itinerary: JSON.stringify(aiPlan)
      }
    });

    res.json({ ...trip, fullPlan: aiPlan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate trip', details: error.message });
  }
});

// --- 5. Regenerate Single Place API ---
app.post('/api/trips/regenerate-place', async (req, res) => {
  const { province, current_place, time } = req.body;
  try {
    const locations = await prisma.location.findMany({
      where: { province: province }
    });
    const locationNames = locations.map(loc => `${loc.name} (${loc.type})`).join(', ');

    const aiResponse = await fetch('http://127.0.0.1:8000/regenerate-place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        province, 
        current_place, 
        time, 
        available_locations: locationNames 
      })
    });
    const aiData = await aiResponse.json();
    
    // Enrich regenerated place with exact coordinate
    let placeData = aiData.place;
    if (typeof placeData === 'string') {
      try { placeData = JSON.parse(placeData); } catch(e) {}
    }
    
    if (placeData && placeData.location) {
      const matchedLoc = locations.find(loc => 
        placeData.location.includes(loc.name) || loc.name.includes(placeData.location)
      );
      if (matchedLoc) {
        placeData.coord = [matchedLoc.lat, matchedLoc.lng];
        aiData.place = placeData; // Ensure it's updated in the response
      }
    }
    
    res.json(aiData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to regenerate place', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
