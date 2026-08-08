import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const defaultCenter = {
  "ชลบุรี": [13.3611, 100.9847],
  "ระยอง": [12.6814, 101.2816],
  "ฉะเชิงเทรา": [13.6904, 101.0719]
};

function MapBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, map]);
  return null;
}

export default function ItineraryMap({ itineraryItems, province }) {
  const [positions, setPositions] = useState([]);
  const [validItems, setValidItems] = useState([]);

  useEffect(() => {
    if (itineraryItems) {
      const p = [];
      const v = [];
      const center = defaultCenter[province] || defaultCenter["ชลบุรี"];
      
      itineraryItems.forEach(item => {
        // Read precise coordinates from AI Plan (injected by backend)
        let foundCoord = item.coord;
        
        // If not found in DB, fallback to province center
        if (!foundCoord) {
           foundCoord = center;
        }

        p.push(foundCoord);
        v.push({ ...item, coord: foundCoord });
      });
      setPositions(p);
      setValidItems(v);
    }
  }, [itineraryItems, province]);

  const center = defaultCenter[province] || defaultCenter["ชลบุรี"];

  return (
    <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {validItems.map((item, idx) => (
        <Marker key={idx} position={item.coord} icon={customMarker}>
          <Popup className="font-sans">
            <p className="font-bold text-sm m-0 p-0 text-slate-800">{item.location}</p>
            <p className="text-xs text-slate-500 m-0 p-0">{item.time}</p>
          </Popup>
        </Marker>
      ))}

      {positions.length > 1 && (
        <Polyline positions={positions} color="#3b82f6" weight={3} dashArray="5, 10" className="animate-pulse" />
      )}

      <MapBounds positions={positions} />
    </MapContainer>
  );
}
