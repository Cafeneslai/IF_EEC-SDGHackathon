import React, { useState } from 'react';
import { Map as MapIcon, QrCode, ScanFace, Gift, MapPin } from 'lucide-react';

export default function SmartMap() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col h-[800px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Smart Map & Checkpoints 🗺️</h2>
          <p className="text-slate-500 mt-1">เช็คอินตามจุดต่างๆ เพื่อรับพอยท์และคูปองส่วนลด</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MapIcon className="w-4 h-4"/> แผนที่
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${activeTab === 'rewards' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Gift className="w-4 h-4"/> ของรางวัล
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")' }}></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-blue-200/50">
              <MapPin className="w-10 h-10 text-blue-500"/>
            </div>
            <h3 className="text-xl font-bold text-slate-700">จำลองการแสดงผลแผนที่</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              ในเวอร์ชันจริง ตรงนี้จะเชื่อมต่อกับ Mapbox GL JS หรือ Google Maps API 
              เพื่อแสดงพิกัดสถานที่ท่องเที่ยวและจุด Checkpoint แบบ Interactive
            </p>
            <button className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors inline-flex items-center gap-2">
              <ScanFace className="w-5 h-5"/> จำลองการเช็คอินจุดที่ใกล้ที่สุด
            </button>
          </div>
          
          {/* Mock Map Pins */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-bounce"></div>
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse"></div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
          <RewardCard 
            title="ส่วนลดร้านคาเฟ่ Way Coffee 20%" 
            points={500} 
            desc="ใช้เป็นส่วนลดเครื่องดื่มและเบเกอรี่ภายในร้าน"
            color="emerald"
          />
          <RewardCard 
            title="ของที่ระลึก OTOP ชุมชนอ่างศิลา" 
            points={1200} 
            desc="ครกหินจิ๋ว หรือ ผลิตภัณฑ์แปรรูปทะเล"
            color="amber"
          />
          <RewardCard 
            title="บัตรเข้าชมพิพิธภัณฑ์สัตว์น้ำ ฟรี" 
            points={2000} 
            desc="เข้าชมสถาบันวิทยาศาสตร์ทางทะเล ม.บูรพา"
            color="blue"
          />
        </div>
      )}

    </div>
  );
}

function RewardCard({ title, points, desc, color }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  const btnColorMap = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
  };

  return (
    <div className={`rounded-2xl p-6 border transition-all hover:shadow-md ${colorMap[color]} flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-4">
        <Gift className="w-8 h-8 opacity-80" />
        <span className="font-bold text-lg bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm">
          {points} <span className="text-sm font-medium">pts</span>
        </span>
      </div>
      <h3 className="font-bold text-lg mb-2 leading-tight">{title}</h3>
      <p className="text-sm opacity-80 mb-6 flex-1">{desc}</p>
      <button className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2 ${btnColorMap[color]}`}>
        <QrCode className="w-4 h-4"/> แลกรางวัล
      </button>
    </div>
  );
}
