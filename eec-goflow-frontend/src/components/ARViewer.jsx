import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Store, Leaf, Navigation } from 'lucide-react';

export default function ARViewer({ onClose, province }) {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera error:", err);
        setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Video Background */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Header / Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-auto bg-gradient-to-b from-black/60 to-transparent">
          <div>
            <h2 className="text-white text-2xl font-black drop-shadow-md flex items-center gap-2">
              <span className="text-cyan-400">AR</span> Explorer
            </h2>
            <p className="text-white/80 text-sm font-medium drop-shadow-md">
              กำลังสแกนพื้นที่รอบตัวคุณใน {province || "พัทยา"}...
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/30 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Permission Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-8 backdrop-blur-sm bg-black/40 pointer-events-auto">
            <div className="bg-white p-6 rounded-2xl max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Camera Access Denied</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button 
                onClick={onClose}
                className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition"
              >
                กลับไปหน้าเดิม
              </button>
            </div>
          </div>
        )}

        {/* AR Floating Elements (Only show if camera is active) */}
        {hasPermission && (
          <>
            {/* Target 1: OTOP Restaurant */}
            <div className="absolute top-1/4 left-[10%] md:left-1/4 animate-bounce pointer-events-auto" style={{ animationDuration: '3s' }}>
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/50 w-56 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute -bottom-3 w-6 h-6 bg-white/90 rotate-45 border-r border-b border-white/50"></div>
                <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-center relative z-10">
                  <h4 className="font-bold text-slate-800 text-sm">ร้านอาหารท้องถิ่น</h4>
                  <div className="flex justify-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">OTOP ระดับ 5 ดาว</p>
                </div>
                <div className="w-full mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-emerald-500"/> 120m</span>
                  <span className="font-bold text-emerald-600">+50 SDG</span>
                </div>
              </div>
            </div>

            {/* Target 2: Eco Attraction */}
            <div className="absolute bottom-1/3 right-[5%] md:right-1/4 animate-bounce pointer-events-auto" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30 w-56 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute -bottom-3 w-6 h-6 bg-slate-900/80 rotate-45 border-r border-b border-emerald-500/30"></div>
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-2">
                  <Leaf className="w-6 h-6" />
                </div>
                <div className="text-center relative z-10">
                  <h4 className="font-bold text-white text-sm">จุดชมวิวเชิงนิเวศ</h4>
                  <p className="text-xs text-emerald-200 mt-1">แหล่งท่องเที่ยวคาร์บอนต่ำ</p>
                </div>
                <div className="w-full mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-emerald-400"/> 450m</span>
                  <span className="font-bold text-emerald-400">+100 SDG</span>
                </div>
              </div>
            </div>
            
            {/* Center Radar Scanner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-cyan-400/30 rounded-full flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
              {/* Radar Sweeper */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.4)_90deg,transparent_90deg)] animate-spin" style={{ animationDuration: '4s' }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
