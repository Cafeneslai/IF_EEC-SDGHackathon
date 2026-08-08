import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Coffee, Trees, Wallet, MapPin, Loader2, Users, CalendarDays } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});

  const [formData, setFormData] = useState({
    province: 'ชลบุรี',
    days: 1,
    budget: 'ปานกลาง',
    travelers: 2,
    age: '20-30',
    travel_style: []
  });

  const quizQuestions = [
    {
      q: "เช้าวันหยุด คุณมักจะ...",
      options: [
        { text: "จิบกาแฟชิลๆ ถ่ายรูปอัปโซเชียล", value: { style: "คาเฟ่ถ่ายรูป" } },
        { text: "ออกไปสูดอากาศ ลุยป่าเขาธรรมชาติ", value: { style: "ธรรมชาติดูเขา" } }
      ]
    },
    {
      q: "ถ้ามีทริปพิเศษ คุณจะให้ความสำคัญกับ...",
      options: [
        { text: "กินหรูอยู่สบาย ให้รางวัลตัวเองขั้นสุด", value: { budget: "หรูหรา" } },
        { text: "กินง่ายอยู่ง่าย เน้นประสบการณ์แบบ Local", value: { budget: "ประหยัด" } }
      ]
    },
    {
      q: "จุดหมายปลายทางในฝันของคุณคือ...",
      options: [
        { text: "ปล่อยใจริมหาด ฟังเสียงคลื่นรับลมทะเล", value: { style: "ทะเลพักใจ" } },
        { text: "ไหว้พระทำบุญ หาความสงบทางจิตใจ", value: { style: "ไหว้พระสายมู" } }
      ]
    }
  ];

  const handleQuizAnswer = (value) => {
    const newAnswers = { ...quizAnswers, ...value };
    if (value.style) {
      newAnswers.styles = [...(quizAnswers.styles || []), value.style];
    }
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Finish Quiz
      setFormData(prev => ({
        ...prev,
        budget: newAnswers.budget || 'ปานกลาง',
        travel_style: newAnswers.styles || ['ทะเลพักใจ']
      }));
      setShowQuiz(false);
      setQuizStep(0);
      setQuizAnswers({});
      alert("AI วิเคราะห์ตัวตนของคุณเสร็จแล้ว! เราได้ทำการตั้งค่าฟอร์มให้คุณอัตโนมัติ 🪄");
    }
  };

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
          travelers: formData.travelers,
          age: formData.age,
          travel_style: formData.travel_style,
          province: formData.province
        })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
      }
      
      setLoading(false);
      // ส่งต่อข้อมูลไปหน้า Itinerary พร้อมกับ province
      navigate('/itinerary', { state: { plan: data.plan || data.fullPlan || data.itinerary, province: formData.province } });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('เกิดข้อผิดพลาด: ' + error.message + '\n\nกรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend (3000) และ AI (8000) รันอยู่ และคุณได้ Seed Database แล้ว');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowQuiz(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                🔮
              </div>
              <h3 className="text-xl font-bold text-slate-800">ค้นหา Travel Persona</h3>
              <p className="text-sm text-slate-500 mt-1">คำถามที่ {quizStep + 1} จาก {quizQuestions.length}</p>
            </div>
            
            <h4 className="text-lg font-bold text-slate-700 text-center mb-6">
              {quizQuestions[quizStep].q}
            </h4>
            
            <div className="space-y-3">
              {quizQuestions[quizStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(opt.value)}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-bold transition-all shadow-sm group"
                >
                  <span className="inline-block w-8 h-8 bg-slate-100 group-hover:bg-blue-200 text-center leading-8 rounded-full mr-3 text-slate-500 group-hover:text-blue-700 transition">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">ออกแบบทริปของคุณ 🏖️</h2>
          <p className="text-slate-500">บอกเราว่าคุณชอบเที่ยวแบบไหน แล้วให้ AI จัดการที่เหลือ</p>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 transition flex items-center gap-2 animate-bounce hover:animate-none"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> AI แบบทดสอบ
        </button>
      </div>

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

        {/* ผู้เดินทาง & อายุ */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500"/> จำนวนผู้เดินทาง
            </label>
            <input 
              type="number" 
              min="1" max="20" 
              value={formData.travelers}
              onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-500"/> ช่วงอายุ
            </label>
            <select 
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 transition-colors text-slate-700 font-medium bg-white"
            >
              <option value="วัยรุ่น (15-25)">วัยรุ่น (15-25 ปี)</option>
              <option value="วัยทำงาน (26-40)">วัยทำงาน (26-40 ปี)</option>
              <option value="ผู้ใหญ่ (41-60)">ผู้ใหญ่ (41-60 ปี)</option>
              <option value="ผู้สูงอายุ (60+)">ผู้สูงอายุ (60+ ปี)</option>
              <option value="ครอบครัวที่มีเด็ก">ครอบครัวที่มีเด็ก</option>
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
