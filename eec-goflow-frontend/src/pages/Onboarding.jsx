import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Coffee, Trees, Wallet, MapPin, Loader2 } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    province: 'ชลบุรี',
    days: 1,
    budget: 'ปานกลาง',
    travel_style: []
  });

  const toggleStyle = (style) => {
    setFormData(prev => ({
      ...prev,
      travel_style: prev.travel_style.includes(style)
        ? prev.travel_style.filter(s => s !== style)
        : [...prev.travel_style, style]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // อ้างอิง ID จาก User จำลองที่สร้างไว้
          days: formData.days,
          budget: formData.budget,
          travel_style: formData.travel_style,
          province: formData.province
        })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
      }
      
      setLoading(false);
      // ส่งต่อข้อมูลไปหน้า Itinerary
      navigate('/itinerary', { state: { plan: data.itinerary } });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('เกิดข้อผิดพลาด: ' + error.message + '\n\nกรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend (3000) และ AI (8000) รันอยู่ และคุณได้ Seed Database แล้ว');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">ออกแบบทริปของคุณ 🏖️</h2>
      <p className="text-slate-500 mb-8">บอกเราว่าคุณชอบเที่ยวแบบไหน แล้วให้ AI จัดการที่เหลือ</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* จังหวัด */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500"/> ไปเที่ยวจังหวัดไหนดี?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['ชลบุรี', 'ระยอง', 'ฉะเชิงเทรา'].map(prov => (
              <button
                key={prov}
                type="button"
                onClick={() => setFormData({...formData, province: prov})}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  formData.province === prov 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* ระยะเวลา & งบประมาณ */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">จำนวนวัน</label>
            <input 
              type="number" 
              min="1" max="7" 
              value={formData.days}
              onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500"/> งบประมาณ
            </label>
            <select 
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 font-medium bg-white"
            >
              <option value="ประหยัด">ประหยัดเน้นคุ้มค่า</option>
              <option value="ปานกลาง">ปานกลางสบายๆ</option>
              <option value="หรู">หรูหราจัดเต็ม</option>
            </select>
          </div>
        </div>

        {/* สไตล์การท่องเที่ยว */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">สไตล์ที่ชอบ (เลือกได้หลายข้อ)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'nature', label: 'ธรรมชาติภูเขา', icon: <Trees className="w-5 h-5"/> },
              { id: 'beach', label: 'ทะเลพักใจ', icon: <Plane className="w-5 h-5"/> },
              { id: 'cafe', label: 'คาเฟ่ถ่ายรูป', icon: <Coffee className="w-5 h-5"/> },
            ].map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.label)}
                className={`py-4 px-4 flex flex-col items-center gap-2 rounded-xl border-2 font-medium transition-all ${
                  formData.travel_style.includes(style.label)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {style.icon}
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || formData.travel_style.length === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin"/> AI กำลังจัดทริปให้คุณ...</>
          ) : '🚀 สร้างแพลนการเดินทาง'}
        </button>

      </form>
    </div>
  );
}
