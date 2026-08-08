import React from 'react';
import { MapPin, Navigation, Clock, Sunrise, Sun, Sunset, AlertCircle, CalendarX2 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Itinerary() {
  const location = useLocation();
  let aiPlan = null;
  let parsedSuccessfully = false;
  let rawPlanOutput = null;
  
  if (location.state && location.state.plan) {
    rawPlanOutput = location.state.plan;
    try {
      let planString = location.state.plan;
      // Backup cleanup in case Python didn't catch it
      if (typeof planString === 'string') {
        planString = planString.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      
      let parsedPlan = typeof planString === 'string' ? JSON.parse(planString) : planString;
      
      // If AI returned an object instead of array, wrap it in array
      if (parsedPlan && typeof parsedPlan === 'object' && !Array.isArray(parsedPlan)) {
        if (parsedPlan.itinerary) {
          parsedPlan = [parsedPlan]; // It's a single day object
        } else if (parsedPlan.plan) {
          parsedPlan = parsedPlan.plan;
        }
      }
      
      if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
        aiPlan = parsedPlan;
        parsedSuccessfully = true;
      }
    } catch (e) {
      console.error("Failed to parse AI Plan", e);
    }
  }

  // Fallback for Empty State
  if (!aiPlan || !parsedSuccessfully) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarX2 className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">คุณยังไม่ได้สร้างแพลนการเดินทาง</h2>
        <p className="text-slate-500 mb-8">ให้ AI ช่วยจัดตารางท่องเที่ยวที่ตรงใจคุณสิ! เลือกสไตล์การเที่ยวและงบประมาณ แล้วเราจะจัดการที่เหลือให้เอง</p>
        
        {rawPlanOutput && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 text-left rounded-xl text-xs overflow-auto max-h-64 border border-red-200">
            <p className="font-bold mb-2">⚠️ AI ตอบกลับมาเป็นรูปแบบที่ไม่รองรับ (ไม่สามารถแปลงเป็น JSON ได้):</p>
            <pre className="whitespace-pre-wrap">{typeof rawPlanOutput === 'object' ? JSON.stringify(rawPlanOutput, null, 2) : rawPlanOutput}</pre>
          </div>
        )}

        <Link to="/onboarding" className="theme-btn-primary font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 max-w-sm mx-auto">
          <i className="fa-solid fa-wand-magic-sparkles"></i> เริ่มสร้างทริปด้วย AI
        </Link>
      </div>
    );
  }

  // Flatten the plan for timeline display
  const timelineItems = aiPlan.flatMap(day => day.itinerary || []);
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Timeline Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">แพลนท่องเที่ยวของคุณ</h2>
            <p className="text-slate-500">จัดสรรโดยระบบ AI อัจฉริยะจากความต้องการของคุณ</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors shadow-sm">
            <Navigation className="w-4 h-4"/> เปิด Google Maps
          </button>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {timelineItems.map((item, idx) => (
            <ItineraryCard key={idx} data={item} />
          ))}
        </div>
      </div>

      {/* Recommended Alternative Panel */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600"/> Smart Alternative
          </h3>
          <p className="text-sm text-blue-800 mb-4 leading-relaxed">
            ระบบของเราคอยมอนิเตอร์ความหนาแน่นแบบเรียลไทม์ หากสถานที่ใดคนเยอะ เรามีตัวเลือกใกล้เคียงเตรียมไว้ให้เสมอ
          </p>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50">
            <h4 className="font-bold text-slate-800 text-sm mb-1">💡 Tips สำหรับทริปนี้</h4>
            <p className="text-xs text-slate-500 mb-3">เพื่อประสบการณ์ที่ดีที่สุด ควรออกเดินทางก่อน 08:30 น. เพื่อหลีกเลี่ยงรถติดในช่วงวันหยุดยาว</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function ItineraryCard({ data }) {
  const title = data.title || data.location || data.place;
  const desc = data.desc || data.description || data.activity;
  const time = data.time || "ตามอัธยาศัย";
  
  // Try to determine icon based on time or type
  let icon = <Clock className="w-5 h-5 text-blue-500" />;
  if (time.includes('เช้า')) icon = <Sunrise className="w-5 h-5 text-amber-500" />;
  else if (time.includes('บ่าย') || time.includes('กลางวัน')) icon = <Sun className="w-5 h-5 text-orange-500" />;
  else if (time.includes('เย็น') || time.includes('ค่ำ')) icon = <Sunset className="w-5 h-5 text-indigo-500" />;

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 text-slate-500 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3"/> {time}
          </span>
          {data.crowded && (
            <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100">หนาแน่น</span>
          )}
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-1 leading-snug">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{desc}</p>
      </div>
    </div>
  );
}
