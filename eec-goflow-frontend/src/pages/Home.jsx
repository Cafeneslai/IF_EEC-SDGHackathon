import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function Home() {
  const [activeFest, setActiveFest] = useState('fruit');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#20D9E8', '#1677FF', '#FF8A3D']
    });
  };

  const festivals = {
    fruit: {
      title: 'เทศกาลผลไม้และของดีระยอง',
      time: 'พ.ค. - ก.ค. ของทุกปี',
      desc: 'ชิมทุเรียน มังคุด เงาะ สดๆ จากสวน พร้อมส่วนลดพิเศษ',
      bg: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=600&q=80',
      tag: 'ระยอง'
    },
    songkran: {
      title: 'ประเพณีวันไหลบางแสน',
      time: '16-17 เมษายน',
      desc: 'ก่อพระทรายน้ำไหล เล่นน้ำสงกรานต์ริมหาดบางแสน',
      bg: 'https://images.unsplash.com/photo-1554316124-7eb356f9b2d3?auto=format&fit=crop&w=600&q=80',
      tag: 'ชลบุรี'
    },
    buffalo: {
      title: 'ประเพณีวิ่งควาย',
      time: 'ตุลาคม',
      desc: 'หนึ่งเดียวในโลก! ชมการแข่งควายเร็วที่สุดในชลบุรี',
      bg: 'https://images.unsplash.com/photo-1598971701382-35368a2bf6cb?auto=format&fit=crop&w=600&q=80',
      tag: 'ชลบุรี'
    },
    sothon: {
      title: 'งานนมัสการหลวงพ่อโสธร',
      time: 'พฤศจิกายน',
      desc: 'ร่วมงานแห่หลวงพ่อโสธรทางน้ำที่ยิ่งใหญ่ที่สุด',
      bg: 'https://images.unsplash.com/photo-1582239454157-932d8495034c?auto=format&fit=crop&w=600&q=80',
      tag: 'ฉะเชิงเทรา'
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Banner With Interactive Search */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl text-white p-6 md:p-12 bg-cover bg-center flex flex-col justify-center min-h-[380px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="theme-bg-light border theme-border-sec theme-text-sec text-xs px-4 py-1.5 rounded-full font-bold inline-block backdrop-blur">
            ✨ AI-Powered EEC Travel Companion
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wide">
            วางแผนทริป EEC ชลบุรี ระยอง ฉะเชิงเทรา ในแบบของคุณ
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
            ระบบ AI ช่วยวางแผนตารางเวลา คำนวณเส้นทาง แนะนำสถานที่ตามเทศกาล และส่วนลดร้านค้าชุมชน
          </p>

          {/* SEARCH BAR IN HERO BANNER */}
          <div className="pt-2">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-sm"></i>
                <input type="text" placeholder="ค้นหาเทศกาล, คาเฟ่บางแสน, สวนผลไม้, ตลาดโบราณ..." className="w-full bg-slate-900/80 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <button onClick={triggerConfetti} className="theme-btn-primary font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shrink-0">
                <i className="fa-solid fa-magnifying-glass"></i> ค้นพบทันที
              </button>
            </div>
            
            {/* Quick Search Keyword Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px] text-slate-300 items-center">
              <span className="text-slate-400"><i className="fa-solid fa-fire text-amber-400 mr-1"></i>ค้นหายอดฮิต:</span>
              <button className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/10 transition">🍓 งานผลไม้ระยอง</button>
              <button className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/10 transition">🐃 ประเพณีวิ่งควาย</button>
              <button className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/10 transition">🌊 บางแสน</button>
              <button className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/10 transition">🪔 หลวงพ่อโสธร</button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/itinerary" className="theme-btn-primary font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xl flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> ให้ AI จัดทริปอัตโนมัติ
            </Link>
            <Link to="/map" className="bg-white/10 backdrop-blur text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-white/20 transition flex items-center gap-2 border border-white/20">
              <i className="fa-solid fa-map-location-dot theme-text-sec"></i> สำรวจแผนที่ EEC
            </Link>
          </div>
        </div>
      </div>

      {/* 🎉 SEASONAL & FESTIVAL RECOMMENDATION SYSTEM */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
          <div>
            <span className="theme-bg-light theme-text-sec text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">🎉 Seasonal Highlights</span>
            <h2 className="text-2xl font-black text-navy mt-1">แนะนำสถานที่ & ทริปตามเทศกาล EEC</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">เลือกดูงานประเพณีและกิจกรรมเด่นประจำแต่ละช่วงเวลาในกลุ่มจังหวัด EEC</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button onClick={() => setActiveFest('fruit')} className={`font-bold px-3.5 py-1.5 rounded-xl shadow transition ${activeFest === 'fruit' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'}`}>🍓 พ.ค.-ก.ค.</button>
            <button onClick={() => setActiveFest('songkran')} className={`font-bold px-3.5 py-1.5 rounded-xl shadow transition ${activeFest === 'songkran' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'}`}>🌊 เม.ย.</button>
            <button onClick={() => setActiveFest('buffalo')} className={`font-bold px-3.5 py-1.5 rounded-xl shadow transition ${activeFest === 'buffalo' ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'}`}>🐃 ต.ค.</button>
            <button onClick={() => setActiveFest('sothon')} className={`font-bold px-3.5 py-1.5 rounded-xl shadow transition ${activeFest === 'sothon' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'}`}>🪔 พ.ย.</button>
          </div>
        </div>

        {/* Dynamic Festival Spotlight Card */}
        <div className="ux-card glass-card p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 h-48 rounded-2xl bg-cover bg-center shrink-0 shadow-lg" style={{ backgroundImage: `url(${festivals[activeFest].bg})` }}>
            <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-2xl flex items-end p-4">
               <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] px-2 py-1 rounded-md font-bold">📍 {festivals[activeFest].tag}</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
             <span className="theme-text-sec text-xs font-bold uppercase tracking-widest"><i className="fa-regular fa-calendar-check mr-1"></i> {festivals[activeFest].time}</span>
             <h3 className="text-2xl font-black text-navy">{festivals[activeFest].title}</h3>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">{festivals[activeFest].desc}</p>
             <div className="pt-2">
               <Link to="/onboarding" className="theme-btn-primary font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 inline-flex">
                 <i className="fa-solid fa-wand-magic-sparkles"></i> ให้ AI จัดทริปนี้
               </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid (3 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Recommended Trip & Featured Places */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trip of the Week Card */}
          <div className="ux-card glass-card p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="bg-amber-500/10 text-amber-600 text-xs font-bold px-3 py-1 rounded-md">🌴 EEC Recommended Route</span>
                <h3 className="font-extrabold text-navy text-xl mt-1">ชลบุรี → ระยอง → ฉะเชิงเทรา</h3>
              </div>
              <span className="theme-bg-light theme-text-sec text-xs font-extrabold px-3 py-1.5 rounded-xl">⭐ 4.9 Rating</span>
            </div>
            <p className="text-xs text-slate-500">ทริปยอดนิยมสำหรับวันหยุดสุดสัปดาห์ (1 Day Trip: 08:30 - 18:00 น.) | งบประมาณแนะนำ ฿1,500/ท่าน</p>
            
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">09:00 น.</span>
                <p className="font-bold text-navy">🌊 หาดบางแสน</p>
                <p className="text-[10px] text-slate-500">สัมผัสรับลมทะเลชลบุรี</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">11:30 น.</span>
                <p className="font-bold text-navy">☕ XYZ Café ระยอง</p>
                <p className="text-[10px] text-slate-500">จิบกาแฟสดบรรยากาศชิลล์</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">15:00 น.</span>
                <p className="font-bold text-navy">⛩️ ตลาดคลองสวน</p>
                <p className="text-[10px] text-slate-500">ชิมของอร่อยแปดริ้ว</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <i className="fa-solid fa-car theme-text-pri"></i>
                <span>ระยะทางรวมประมาณ 68 km</span>
              </div>
              <Link to="/map" className="bg-navy hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5">
                เปิดดูแผนที่เส้นทางนี้ <i className="fa-solid fa-arrow-right theme-text-sec"></i>
              </Link>
            </div>
          </div>

          {/* Featured Places Grid */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <i className="fa-solid fa-fire text-red-500"></i> สถานที่ยอดนิยมในพื้นที่ EEC
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'หาดบางแสน & คาเฟ่ลับ', loc: 'ชลบุรี', stat: '❤️ บันทึกไว้ 1.2k คน', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
                { title: 'สวนผลไม้ชุมชนบ้านค่าย', loc: 'ระยอง', stat: '📍 ห่างจากคุณ 12 km', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
                { title: 'ตลาดโบราณคลองสวน', loc: 'ฉะเชิงเทรา', stat: '⭐ 4.8 ความนิยมสูง', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80' }
              ].map((place, idx) => (
                <Link to="/onboarding" key={idx} className="ux-card bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer block group">
                  <div className="h-32 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${place.img}')` }}>
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur">📍 {place.loc}</span>
                  </div>
                  <div className="p-3.5 space-y-1 relative bg-white dark:bg-slate-800 z-10">
                    <h4 className="font-bold text-xs text-navy group-hover:theme-text-pri transition-colors">{place.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{place.stat}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Side Widgets */}
        <div className="space-y-6">
          <div className="ux-card theme-bg-gradient rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-3">
              <span className="bg-white/20 backdrop-blur text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest"><i className="fa-solid fa-gift mr-1"></i> Special Reward</span>
              <h3 className="text-xl font-black">ส่วนลด 10%</h3>
              <p className="text-xs text-white/80">
                สแกน QR Code เช็คอินที่ "สวนผลไม้ชุมชนบ้านค่าย" ระยอง รับส่วนลดบุฟเฟ่ต์ทันที
              </p>
              <button className="w-full bg-white text-slate-800 hover:bg-slate-50 text-xs font-bold py-2.5 rounded-xl mt-2 transition shadow">
                เก็บคูปอง
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
