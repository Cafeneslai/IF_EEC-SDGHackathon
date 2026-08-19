import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { toast } from 'sonner';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const userMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/790/790101.png', // Blue dot
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const defaultCenter = {
  "ชลบุรี": [13.3611, 100.9847],
  "ระยอง": [12.6814, 101.2816],
  "ฉะเชิงเทรา": [13.6904, 101.0719]
};

// Hardcoded Dictionary for common places to avoid API rate limits
// แก้ไขพิกัดใหม่ ดันเข้าหาฝั่ง (Inland) +0.005 เพื่อป้องกันหมุดตกน้ำ (เนื่องจากพิกัดเดิมจาก seed ชิดทะเลเกินไป)
const knownLocations = {
  "จุดชมวิวเขาสามมุข (Khao Sam Muk)": [13.3079, 100.9080],
  "จุดชมวิวเขาสามมุข": [13.3079, 100.9080],
  "หาดบางแสน (Bang Saen Beach)": [13.2843, 100.9180],
  "หาดบางแสน": [13.2843, 100.9180],
  "Way Coffee House": [13.2988, 100.9120],
  "สถาบันวิทยาศาสตร์ทางทะเล ม.บูรพา": [13.2796, 100.9250],
  "วิสาหกิจชุมชนหมู่บ้านอ่างศิลา": [13.3323, 100.9250],
  "ศาลเจ้านาจาซาไท้จื้อ": [13.3218, 100.9250],
  "อุทยานเขาแหลมหญ้า-หมู่เกาะเสม็ด": [12.5600, 101.4450],
  "อุทยานแห่งชาติเขาแหลมหญ้า": [12.5600, 101.4450],
  "ทุ่งโปรงทอง": [12.7056, 101.7161],
  "หาดแม่รำพึง": [12.6150, 101.3853],
  "วัดโสธรวรารามวรวิหาร": [13.6738, 101.0673],
  "ตลาดน้ำบางคล้า": [13.7259, 101.2066]
};

async function geocodePlace(placeName, province) {
  // 1. Check strict hardcoded dictionary
  for (const [key, coords] of Object.entries(knownLocations)) {
    if (placeName.includes(key)) return coords;
  }
  
  // 2. Check localStorage cache (ใช้ v2 เพื่อล้างแคชของปลอมเก่าๆ ทิ้ง)
  const cacheKey = `geo_v2_${placeName}_${province}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  // 3. OpenStreetMap Nominatim API
  try {
    // ใส่ประเทศต่อท้าย และส่ง format ให้ชัดเจน
    const searchQuery = encodeURIComponent(`${placeName} ${province} Thailand`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1&accept-language=th`);
    const data = await res.json();
    if (data && data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      localStorage.setItem(cacheKey, JSON.stringify(coords));
      return coords;
    }
  } catch (err) {
    console.warn("Geocoding API failed, falling back to smart inland jitter.");
  }

  // 4. Smart Inland Jitter (Fallback)
  const center = defaultCenter[province] || defaultCenter["ชลบุรี"];
  let jitterLat = (placeName.length % 10 - 5) * 0.01;
  let jitterLng = (placeName.charCodeAt(0) % 10 - 5) * 0.01;
  
  // ป้องกันหมุดตกน้ำ (Prevent ocean markers)
  // ชลบุรี ทะเลอยู่ซ้าย (ตะวันตก) -> ต้องดันไปขวา (East: +Lng)
  if (province === 'ชลบุรี') jitterLng = Math.abs(jitterLng) + 0.01; 
  // ระยอง ทะเลอยู่ล่าง (ใต้) -> ต้องดันขึ้นบน (North: +Lat)
  if (province === 'ระยอง') jitterLat = Math.abs(jitterLat) + 0.01;

  const fakeCoords = [center[0] + jitterLat, center[1] + jitterLng];
  
  localStorage.setItem(cacheKey, JSON.stringify(fakeCoords));
  return fakeCoords;
}

function MapController({ positions, userLoc }) {
  const map = useMap();
  useEffect(() => {
    if (userLoc) {
      map.flyTo(userLoc, 14, { animate: true, duration: 1.5 });
    } else if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, userLoc, map]);
  return null;
}

export default function ItineraryMap({ itineraryItems, province }) {
  const [positions, setPositions] = useState([]);
  const [validItems, setValidItems] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async function loadCoordinates() {
      if (itineraryItems && itineraryItems.length > 0) {
        const p = [];
        const v = [];
        
        for (const item of itineraryItems) {
          const name = item.location || item.title || item.place;
          const coords = await geocodePlace(name, province);
          p.push(coords);
          v.push({ ...item, coord: coords, name });
        }
        
        setPositions(p);
        setValidItems(v);
      }
    }
    loadCoordinates();
  }, [itineraryItems, province]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง (GPS)');
      return;
    }
    
    toast.loading('กำลังค้นหาตำแหน่งของคุณ...', { id: 'gps' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = [position.coords.latitude, position.coords.longitude];
        setUserLocation(loc);
        toast.success('พบตำแหน่งของคุณแล้ว', { id: 'gps' });
      },
      (error) => {
        console.error(error);
        toast.error('ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาเปิด GPS', { id: 'gps' });
      }
    );
  };

  const center = defaultCenter[province] || defaultCenter["ชลบุรี"];

  return (
    <div className="relative w-full h-full">
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {validItems.map((item, idx) => (
          <Marker key={idx} position={item.coord} icon={customMarker}>
            <Popup className="font-sans">
              <p className="font-bold text-sm m-0 p-0 text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500 m-0 p-0">{item.time}</p>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation} icon={userMarker}>
            <Popup className="font-sans">
              <p className="font-bold text-sm m-0 p-0 text-blue-600">📍 ตำแหน่งของคุณ</p>
            </Popup>
          </Marker>
        )}

        {positions.length > 1 && (
          <Polyline positions={positions} color="#3b82f6" weight={4} dashArray="8, 8" className="animate-pulse opacity-70" />
        )}

        <MapController positions={positions} userLoc={userLocation} />
      </MapContainer>

      {/* GPS Button */}
      <button 
        onClick={handleGetLocation}
        className="absolute bottom-6 right-6 z-[400] bg-white text-blue-600 p-3 rounded-full shadow-xl shadow-blue-500/20 border-2 border-blue-100 hover:bg-blue-50 hover:scale-110 transition-all group"
        title="ตำแหน่งของฉัน"
      >
        <LocateFixed className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
}
