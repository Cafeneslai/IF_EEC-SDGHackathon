import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Settings2, Info } from 'lucide-react';

export default function PDPABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('eec_pdpa_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('eec_pdpa_consent', JSON.stringify({ analytics: true, marketing: true }));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('eec_pdpa_consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Settings Modal overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">จัดการการตั้งค่าคุกกี้</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                    คุกกี้ที่จำเป็น (Necessary)
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">เปิดเสมอ</span>
                  </h4>
                  <p className="text-xs text-slate-500">จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ และการรักษาความปลอดภัย</p>
                </div>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-700 mb-1">คุกกี้เพื่อการวิเคราะห์ (Analytics)</h4>
                  <p className="text-xs text-slate-500">ช่วยให้เราเข้าใจพฤติกรรมการใช้งาน เพื่อนำไปพัฒนา AI ให้จัดทริปได้ฉลาดและแม่นยำยิ่งขึ้น</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({...p, analytics: !p.analytics}))}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${preferences.analytics ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Marketing/Personalization */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-700 mb-1">คุกกี้เพื่อการปรับแต่ง (Personalization)</h4>
                  <p className="text-xs text-slate-500">ใช้เพื่อจดจำสไตล์การท่องเที่ยวของคุณ และนำเสนอสินค้า OTOP หรือสิทธิประโยชน์ที่ตรงใจ</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({...p, marketing: !p.marketing}))}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${preferences.marketing ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                onClick={handleAcceptAll}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
              >
                ยอมรับทั้งหมด
              </button>
              <button 
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Banner */}
      {!showSettings && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[450px] z-[100] animate-in slide-in-from-bottom-12 fade-in duration-700">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">นโยบายความเป็นส่วนตัว (PDPA)</h3>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-slate-400 hover:text-slate-600 transition bg-slate-100 hover:bg-slate-200 rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                เว็บไซต์นี้ใช้คุกกี้ <Cookie className="w-4 h-4 inline text-amber-500" /> เพื่อวิเคราะห์พฤติกรรมการใช้งาน และนำเสนอแผนการท่องเที่ยว AI ที่ตรงใจคุณที่สุด รวมถึงการนำเสนอสินค้าชุมชน (OTOP) ที่เกี่ยวข้อง การใช้งานเว็บไซต์ต่อถือว่าคุณยอมรับนโยบายของเรา
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-500/20"
                >
                  ยอมรับทั้งหมด
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  จัดการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
