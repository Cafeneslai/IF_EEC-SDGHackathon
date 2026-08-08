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
  const { name, age, budget_level, travel_style } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        age,
        budget_level,
        travel_style: JSON.stringify(travel_style)
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
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

// --- 4. Trips API ---
// This endpoint will receive data and ideally call the Python FastAPI AI service
app.post('/api/trips/generate', async (req, res) => {
  const { userId, days, budget, travel_style, province } = req.body;
  
  try {
    // 1. Call AI Service (Python)
    const aiResponse = await fetch('http://127.0.0.1:8000/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, budget, travel_style, province })
    });
    const aiPlan = await aiResponse.json();

    // 2. Save to database
    const trip = await prisma.trip.create({
      data: {
        userId,
        startDate: new Date(),
        endDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000)),
        itinerary: aiPlan.plan
      }
    });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate trip', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
