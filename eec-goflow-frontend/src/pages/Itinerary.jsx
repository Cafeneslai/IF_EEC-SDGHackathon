import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, AlertCircle, CalendarX2, CloudSun, Wallet, Leaf, RefreshCw, Loader2 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Itinerary() {
  const location = useLocation();
  const currentProvince = location.state?.province || "ชลบุรี";
  const [activeDay, setActiveDay] = useState(1);
  const [planData, setPlanData] = useState(null);
  const [errorPlan, setErrorPlan] = useState(null);
  
  useEffect(() => {
    if (location.state && location.state.plan) {
      try {
        let planString = location.state.plan;
        if (typeof planString === 'string') {
          planString = planString.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        let parsed = typeof planString === 'string' ? JSON.parse(planString) : planString;
        
        // Handle new structure {summary, plan}
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.plan) {
          setPlanData(parsed);
        } else if (Array.isArray(parsed)) {
          // Fallback old array structure
          setPlanData({ plan: parsed, summary: { total_budget_estimate: 1500, eco_score_percentage: 60 } });
        } else if (parsed && parsed.itinerary) {
          setPlanData({ plan: [parsed], summary: { total_budget_estimate: 1500, eco_score_percentage: 60 } });
        } else {
          setErrorPlan(parsed);
        }
      } catch (e) {
        console.error("Parse Error", e);
        setErrorPlan(location.state.plan);
      }
    }
  }, [location.state]);

  // ฟังก์ชันสุ่มสถานที่ (AI ของจริง)
  const handleRegenerate = async (index, currentItem) => {
    try {
      const response = await fetch('http://localhost:3000/api/trips/regenerate-place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: currentProvince,
          current_place: currentItem.location,
          time: currentItem.time || "กลางวัน"
        })
      });
      const data = await response.json();
      
      let newPlace = data.place;
      if (typeof newPlace === 'string') {
        newPlace = JSON.parse(newPlace);
      }
      
      if (newPlace && newPlace.location) {
        setPlanData(prev => {
          const newPlan = [...prev.plan];
          // Find which day we are on based on index
          // For simplicity, we assume we're replacing in the active day
          const dayIndex = newPlan.findIndex(d => d.day === activeDay);
          if (dayIndex !== -1) {
            const originalTime = newPlan[dayIndex].itinerary[index].time || "ตามอัธยาศัย";
            newPlan[dayIndex].itinerary[index] = { ...newPlace, time: originalTime };
          }
          return { ...prev, plan: newPlan };
        });
      } else {
         console.error("AI returned invalid format for replacement", data);
      }
    } catch (error) {
      console.error("Failed to regenerate place from AI", error);
    }
  };

  if (!planData || planData.plan.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarX2 className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">คุณยังไม่ได้สร้างแพลนการเดินทาง</h2>
        <p className="text-slate-500 mb-8">ให้ AI ช่วยจัดตารางท่องเที่ยวที่ตรงใจคุณสิ! เลือกสไตล์การเที่ยวและงบประมาณ แล้วเราจะจัดการที่เหลือให้เอง</p>
        
        {errorPlan && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 text-left rounded-xl text-xs overflow-auto max-h-64 border border-red-200">
            <p className="font-bold mb-2">⚠️ AI ตอบกลับมาเป็นรูปแบบที่ไม่รองรับ (ไม่สามารถแปลงเป็น JSON ได้):</p>
            <pre className="whitespace-pre-wrap">{typeof errorPlan === 'object' ? JSON.stringify(errorPlan, null, 2) : errorPlan}</pre>
          </div>
        )}

        <Link to="/onboarding" className="theme-btn-primary font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 max-w-sm mx-auto">
          <i className="fa-solid fa-wand-magic-sparkles"></i> เริ่มสร้างทริปด้วย AI
        </Link>
      </div>
    );
  }
  
  // Use AI summary
  const estBudget = planData.summary?.total_budget_estimate || 1500;
  const ecoScore = planData.summary?.eco_score_percentage || 60;
  
  // Get active day items
  const activeDayData = planData.plan.find(d => d.day === activeDay) || planData.plan[0];
  const activeTimelineItems = activeDayData?.itinerary || [];
  
  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Timeline Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">แพลนท่องเที่ยวของคุณ</h2>
            <p className="text-slate-500">จัดสรรโดยระบบ AI อัจฉริยะจากความต้องการของคุณ</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors shadow-sm">
            <Navigation className="w-4 h-4"/> นำทางทั้งหมด
          </button>
        </div>

          {/* Multi-Day Tabs */}
          {planData.plan.length > 1 && (
            <div className="flex gap-2 mb-6 mt-4">
              {planData.plan.map((d) => (
                <button 
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${activeDay === d.day ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                  วันที่ {d.day}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8 relative pb-10 mt-4">
            <div className="timeline-glow-line"></div>
            {activeTimelineItems.map((item, idx) => (
              <ItineraryCard 
                key={idx + item.location} 
                data={item} 
                onRegenerate={() => handleRegenerate(idx, item)} 
              />
            ))}
          </div>
      </div>

      {/* Right Sidebar Enhancements */}
      <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
        
        {/* 1. Weather Widget */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">วันนี้ • {currentProvince}</p>
              <h3 className="text-3xl font-black">28°C</h3>
              <p className="text-sm text-blue-50 mt-1">เมฆเป็นส่วนมาก (เหมาะกับการเที่ยว)</p>
            </div>
            <CloudSun className="w-12 h-12 text-yellow-300 drop-shadow-md"/>
          </div>
        </div>

        {/* 2. SDG Eco-Meter */}
        <div className="glass-card-premium rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500"/> SDG Eco-Meter
            </h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{ecoScore}%</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">คะแนนความเป็นมิตรต่อสิ่งแวดล้อมของทริปนี้ อิงจากสถานที่ประเภทธรรมชาติ</p>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${ecoScore}%` }}></div>
          </div>
        </div>

        {/* 3. Budget Estimator */}
        <div className="glass-card-premium rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-indigo-500"/> สรุปค่าใช้จ่ายโดยประมาณ
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">ค่าอาหาร & เครื่องดื่ม</span>
              <span className="font-semibold text-slate-700">฿{(estBudget * 0.6).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">ค่าเข้าสถานที่ / กิจกรรม</span>
              <span className="font-semibold text-slate-700">฿{(estBudget * 0.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">ค่าเดินทางสำรอง</span>
              <span className="font-semibold text-slate-700">฿{(estBudget * 0.2).toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-800">รวมทั้งหมด</span>
            <span className="text-xl font-black text-indigo-600">฿{estBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* 4. Map Embed */}
        <div className="glass-card-premium p-2 rounded-2xl overflow-hidden h-64 relative group">
          <div className="rounded-xl overflow-hidden w-full h-full relative">
          <iframe 
            title="Chonburi Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=100.80383300781251%2C13.207865188899884%2C101.12106323242189%2C13.435775791732688&layer=mapnik" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale group-hover:grayscale-0 transition-all duration-500"
          ></iframe>
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2 border border-slate-200">
            <MapPin className="w-3 h-3 text-red-500 animate-bounce"/> พิกัดจำลองโซน EEC
          </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ItineraryCard({ data, onRegenerate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const title = data.title || data.location || data.place || "สถานที่ท่องเที่ยว";
  const desc = data.desc || data.description || data.activity || "";
  const time = data.time || "ตามอัธยาศัย";
  
  const handleSwap = async () => {
    setIsSpinning(true);
    await onRegenerate(); // รอ AI ประมวลผลเสร็จค่อยหยุดหมุน
    setIsSpinning(false);
  };
  
  let icon = <Clock className="w-5 h-5 text-blue-500" />;
  if (time.includes('เช้า')) icon = <Sunrise className="w-5 h-5 text-amber-500" />;
  else if (time.includes('บ่าย') || time.includes('กลางวัน')) icon = <Sun className="w-5 h-5 text-orange-500" />;
  else if (time.includes('เย็น') || time.includes('ค่ำ')) icon = <Sunset className="w-5 h-5 text-indigo-500" />;

  return (
    <div 
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/80 bg-white shadow-lg shadow-blue-500/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:shadow-blue-400/40">
        <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
      </div>
      
      <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] relative">
        <div className={`glass-card-premium p-6 rounded-2xl ${isSpinning ? 'opacity-50 blur-[2px] scale-[0.98]' : 'opacity-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3"/> {time}
              </span>
              {(data.type || data.tag) && (
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md border border-emerald-100">
                  {data.type || data.tag}
                </span>
              )}
            </div>
            
            {/* AI Regenerate Button */}
            <button 
              onClick={handleSwap}
              disabled={isSpinning}
              className={`text-slate-400 hover:text-blue-500 transition-opacity p-1.5 rounded-md hover:bg-blue-50 ${isHovered || isSpinning ? 'opacity-100' : 'opacity-0 md:opacity-0 opacity-100'}`}
              title="สุ่มสถานที่ใหม่"
            >
              {isSpinning ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <RefreshCw className="w-4 h-4" />}
            </button>
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-1 leading-snug">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{desc}</p>
          
          {/* Eco-Routing AI Information */}
          {data.travel_to_next && (
            <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl flex items-start gap-3">
              <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 mb-0.5">Eco-Routing คำแนะนำจาก AI</p>
                <p className="text-xs text-emerald-600">
                  <span className="font-semibold">{data.travel_to_next.mode}</span> • ใช้เวลาประมาณ {data.travel_to_next.duration}
                  {data.travel_to_next.eco_tip && <span className="block mt-0.5 text-emerald-700/80 italic">"{data.travel_to_next.eco_tip}"</span>}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
