# 📦 EEC GoFlow - Version Info & Changelog

## 🛡️ Version 6.0 (Smart GPS & System Stabilizer)
*Date: August 2026*

**Major Enhancements:**
- 🌍 **Real-time Geocoding:** Replaced hardcoded fallback center points with a live OpenStreetMap (Nominatim) Geocoding integration, placing AI-generated locations precisely on the map.
- 🎯 **Smart Inland Jitter Algorithm:** Developed a mathematical deterministic offset function for unknown AI locations, specifically tuned to prevent map markers from stacking or landing in the ocean.
- 📍 **Geolocation GPS:** Added "My Location" feature to physically zoom into the user's actual latitude and longitude upon consent.
- 🐞 **Critical Bug Hunt (Phase 6):** Conducted a codebase-wide audit using `oxlint`. Fixed the HTML5 Drag & Drop event bindings in `ItineraryCard` to restore functionality. Cleaned up unused imports to optimize bundle size.

---## 🚀 Version 5.0 (Pitching Ready - The WOW Update)
*Date: August 2026*

**Major Features Added (The WOW Factors):**
- 📸 **IG Story Exporter:** Added one-click export feature allowing users to render their trip plan into a beautiful 9:16 vertical poster for social media viral growth (`html-to-image`).
- 👁️ **AR Local Explorer:** Implemented WebRTC to access the device's camera for a simulated Augmented Reality view, showing floating 3D markers for OTOP and local attractions.
- 🎖️ **Gamification Leveling System:** Upgraded the Dashboard with an EXP progress bar and dynamic badges (Seedling 🌱 -> Forest Guardian 🌳) to boost customer retention.
- 🎙️ **AI Voice Visualizer:** Added an animated soundwave effect to the Chatbot that reacts when the Web Speech API is actively listening to the user's voice.
- 💎 **Ultra-Premium UI/UX Polish:** Replaced all native browser alerts with beautiful modern toast notifications using `sonner`. Added a subtle animated Aurora gradient mesh background and a custom glass-like scrollbar.
- ⚙️ **AI Fail-Safe & Reliability:** Increased Ollama generation timeouts and implemented a seamless auto-switch to beautiful mock data if the AI server becomes unreachable, ensuring the live demo never fails.

---

## 🌟 Version 4.0 (Hackathon Ultimate Edition)
*Date: August 2026*

**Major Features Added:**
- 🎁 **SDG Rewards Store:** Added a fully functional rewards system in the Dashboard where users can redeem SDG points for OTOP coupons and EV Bus tickets.
- 🧩 **Drag & Drop Itinerary:** Transformed the static itinerary timeline into an interactive HTML5 Drag & Drop interface. Users can now reorder their trip locations freely.
- 😷 **Live AQI Alert:** Integrated Open-Meteo Air Quality API to fetch real-time PM2.5 levels. Displays an alert banner advising users to wear masks or choose indoor locations if the air quality is poor.
- 🎭 **AI Travel Persona Quiz:** Replaced the boring traditional form with an interactive 3-question psychological quiz. The system analyzes the user's persona and auto-fills the onboarding form dynamically.
- 🎨 **Premium UI/UX Polish:** Upgraded the glassmorphism effects, added smooth page transitions, and fixed responsive navbar routing.
- 🍪 **Cookie Settings Modal:** Implemented a beautiful modal for users to manage their data tracking preferences (Analytics & Personalization).

---

## 🛠️ Version 1.5 (AI & Integration)
- Integrated Ollama (Llama 3.1) for generating personalized trip plans.
- Added a floating AI Chatbot with the "Nong GoFlow" persona.
- Implemented real-time weather API integration.
- Added OTOP Local Discovery algorithm to enforce at least 1 community enterprise per day.

---

## 🌱 Version 1.0 (MVP)
- Initial release with basic frontend routing (React, Vite, Tailwind).
- Backend boilerplate with Express and Prisma (SQLite).
- Basic Itinerary Map rendering using Leaflet.
