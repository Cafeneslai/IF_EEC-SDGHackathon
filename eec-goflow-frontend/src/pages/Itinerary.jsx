import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, AlertCircle, CalendarX2, CloudSun, Wallet, Leaf, RefreshCw, Loader2, Share2, CheckCircle2, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import ItineraryMap from '../components/ItineraryMap';

export default function Itinerary() {
  const location = useLocation();
  const currentProvince = location.state?.province || "ชลบุรี";
  const [activeDay, setActiveDay] = useState(1);
  const [planData, setPlanData] = useState(null);
  const [errorPlan, setErrorPlan] = useState(null);
  const [weatherData, setWeatherData] = useState({ temp: '28°C', desc: 'กำลังโหลด...', icon: 'CloudSun' });
  const [isExporting, setIsExporting] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  
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

  useEffect(() => {
    const coords = {
      "ชลบุรี": { lat: 13.3611, lng: 100.9847 },
      "ระยอง": { lat: 12.6814, lng: 101.2816 },
      "ฉะเชิงเทรา": { lat: 13.6904, lng: 101.0719 }
    };
    const target = coords[currentProvince] || coords["ชลบุรี"];
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lng}&current=temperature_2m,weather_code`)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let desc = "แจ่มใส";
          if (code >= 1 && code <= 3) { desc = "มีเมฆบางส่วน"; }
          if (code >= 45) { desc = "มีหมอก"; }
          if (code >= 51) { desc = "มีฝนตก"; }
          setWeatherData({ temp: `${temp}°C`, desc, icon: 'CloudSun' });
        }
      })
      .catch(e => console.error(e));

    // Fetch AQI and PM2.5
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${target.lat}&longitude=${target.lng}&current=european_aqi,pm2_5`)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setAqiData({ pm2_5: data.current.pm2_5, aqi: data.current.european_aqi });
        }
      })
      .catch(console.error);
  }, [currentProvince]);

  const handleShare = async () => {
    const element = document.getElementById('itinerary-export-area');
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#f0fdf4' });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `EEC_Trip_${currentProvince}.png`;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
    setIsExporting(false);
  };

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

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    setPlanData(prev => {
      const newPlan = [...prev.plan];
      const dayIndex = newPlan.findIndex(d => d.day === activeDay);
      if (dayIndex !== -1) {
        const items = [...newPlan[dayIndex].itinerary];
        const draggedItem = items[draggedIdx];
        
        // Reorder array
        items.splice(draggedIdx, 1);
        items.splice(targetIdx, 0, draggedItem);
        
        newPlan[dayIndex].itinerary = items;
      }
      return { ...prev, plan: newPlan };
    });
    setDraggedIdx(null);
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
      <div className="flex-1" id="itinerary-export-area" style={{ padding: isExporting ? '20px' : '0' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">แพลนท่องเที่ยวของคุณ</h2>
            <p className="text-slate-500">จัดสรรโดยระบบ AI อัจฉริยะจากความต้องการของคุณ</p>
          </div>
          {!isExporting && (
            <button onClick={handleShare} disabled={isExporting} className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-sm">
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Share2 className="w-4 h-4"/>} 
              บันทึก & แชร์ทริป
            </button>
          )}
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

          {/* AQI Alert Banner */}
          {aqiData && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
                <i className="fa-solid fa-mask-ventilator text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">แจ้งเตือนคุณภาพอากาศ (AQI Alert)</h4>
                <p className="text-sm">ค่าฝุ่น PM2.5 ปัจจุบันอยู่ที่ <strong>{aqiData.pm2_5} µg/m³</strong> {aqiData.pm2_5 > 35 ? '(เกินมาตรฐาน) AI แนะนำให้ใส่หน้ากากอนามัย หรือสลับไปเที่ยวสถานที่ในร่ม (Indoor) แทนครับ' : 'อากาศดี เหมาะแก่การทำกิจกรรมกลางแจ้ง!'}</p>
              </div>
            </div>
          )}

          <div className="space-y-8 relative pb-10 mt-4">
            <div className="timeline-glow-line"></div>
            {activeTimelineItems.map((item, idx) => (
              <ItineraryCard 
                key={idx + item.location} 
                data={item} 
                onRegenerate={() => handleRegenerate(idx, item)}
                index={idx}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
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
              <h3 className="text-3xl font-black">{weatherData.temp}</h3>
              <p className="text-sm text-blue-50 mt-1">{weatherData.desc}</p>
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
            <ItineraryMap itineraryItems={activeTimelineItems} province={currentProvince} />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2 border border-slate-200 z-[1000]">
              <MapPin className="w-3 h-3 text-red-500 animate-bounce"/> Eco-Route Map
            </div>
          </div>
        </div>

        {/* 5. Gamification Reward */}
        {ecoScore >= 70 && (
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            <h3 className="font-bold flex items-center gap-2 mb-2 relative z-10">
              <i className="fa-solid fa-gift text-xl"></i> SDG Rewards
            </h3>
            <p className="text-sm font-medium text-amber-50 mb-4 relative z-10">ทริปนี้รักษ์โลกสุดๆ! รับคูปองส่วนลด 10% ร้านกาแฟ Local ใน {currentProvince}</p>
            <button className="w-full bg-white/20 hover:bg-white/30 border border-white/40 font-bold py-2 rounded-xl transition text-sm relative z-10 backdrop-blur-sm">
              กดรับสิทธิ์
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function ItineraryCard({ data, onRegenerate, index, onDragStart, onDragOver, onDrop }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const title = data.title || data.location || data.place || "สถานที่ท่องเที่ยว";
  const desc = data.desc || data.description || data.activity || "";
  const time = data.time || "ตามอัธยาศัย";
  const crowdedLevel = data.crowded_level || "ปานกลาง";
  const isOtop = data.is_otop || false;
  
  const handleSwap = async () => {
    setIsSpinning(true);
    await onRegenerate(); // รอ AI ประมวลผลเสร็จค่อยหยุดหมุน
    setIsSpinning(false);
    setIsCheckedIn(false);
  };
  
  let icon = <Clock className="w-5 h-5 text-blue-500" />;
  if (time.includes('เช้า')) icon = <Sunrise className="w-5 h-5 text-amber-500" />;
  else if (time.includes('บ่าย') || time.includes('กลางวัน')) icon = <Sun className="w-5 h-5 text-orange-500" />;
  else if (time.includes('เย็น') || time.includes('ค่ำ')) icon = <Sunset className="w-5 h-5 text-indigo-500" />;

  const isCrowded = crowdedLevel.includes('สูง');
  const cardBorderClass = isOtop 
    ? "border-2 border-amber-300 shadow-amber-500/20 bg-gradient-to-br from-amber-50/80 to-white" 
    : "border border-slate-100 bg-white/70";

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
        {/* OTOP Badge */}
        {isOtop && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 border-2 border-white">
            <i className="fa-solid fa-store"></i> Local Discovery
          </div>
        )}

        <div className={`backdrop-blur-xl p-6 rounded-2xl ${cardBorderClass} ${isSpinning ? 'opacity-50 blur-[2px] scale-[0.98]' : 'opacity-100'} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3"/> {time}
              </span>
              {(data.type || data.tag) && (
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md border border-emerald-100">
                  {data.type || data.tag}
                </span>
              )}
              {/* Crowded Level Badge */}
              <span className={`px-2 py-1 text-[10px] font-bold rounded-md border flex items-center gap-1 ${
                isCrowded 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : crowdedLevel.includes('ปานกลาง') 
                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                    : 'bg-green-50 text-green-600 border-green-100'
              }`}>
                <Users className="w-3 h-3"/> คน{crowdedLevel}
              </span>
            </div>
            
            {/* AI Regenerate (Smart Alternative) Button */}
            <button 
              onClick={handleSwap}
              disabled={isSpinning}
              className={`flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-all px-2 py-1.5 rounded-lg hover:bg-blue-50 border hover:border-blue-200 border-transparent ${isHovered || isSpinning || isCrowded ? 'opacity-100' : 'opacity-0 md:opacity-0 opacity-100'}`}
              title="Smart Alternative: หาที่ใหม่"
            >
              {isSpinning ? <Loader2 className="w-3 h-3 animate-spin text-blue-500" /> : <RefreshCw className={`w-3 h-3 ${isCrowded ? 'text-red-500 animate-pulse' : ''}`} />}
              {isCrowded && !isSpinning && <span className="text-[10px] font-bold text-red-500">Smart Alt</span>}
            </button>
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-1 leading-snug pr-4">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{desc}</p>
          
          {/* Location Service: Check-in & Benefit */}
          <div className="mt-3">
            {!isCheckedIn ? (
              <button 
                onClick={() => setIsCheckedIn(true)}
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3" /> Check-in รับสิทธิ์
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center justify-between">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> เช็คอินสำเร็จ! รับฟรี SDG Coupon</span>
              </div>
            )}
          </div>
          
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
