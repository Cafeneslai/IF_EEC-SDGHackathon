import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Itinerary from './pages/Itinerary';
import SmartMap from './pages/SmartMap';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chatbot from './components/Chatbot';

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans mesh-bg transition-colors duration-500">
      {/* DESKTOP TOP NAVBAR WITH SEARCH, DARK MODE & THEME SWITCHER */}
      <header className="bg-navy text-white sticky top-0 z-50 shadow-xl border-b border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group shrink-0">
            <div className="theme-bg-gradient p-2.5 rounded-2xl text-white text-lg flex items-center justify-center w-10 h-10 shadow-lg group-hover:scale-105 transition">
              <i className="fa-solid fa-compass"></i>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold tracking-wide text-white">EEC <span className="theme-text-sec">Journey</span></span>
              <p className="text-[11px] theme-text-sec font-light -mt-1 opacity-90">Smart AI Travel Companion</p>
            </div>
          </Link>

          {/* SEARCH BAR IN HEADER */}
          <div className="relative flex-1 max-w-xs md:max-w-sm hidden md:block">
            <div className="relative">
              <input type="text" placeholder="🔍 ค้นหาสถานที่, เทศกาล, คาเฟ่, คูปอง..." className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2 border border-slate-700 focus:outline-none focus:border-cyan-400 transition" />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
              <button className="absolute right-2 top-1.5 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-slate-300">ค้นหา</button>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <Link to="/" className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${isCurrentPage('/') ? 'theme-text-sec bg-navy' : 'text-slate-300 hover:text-white'}`}>
              <i className="fa-solid fa-house mr-1"></i> หน้าแรก
            </Link>
            <Link to="/itinerary" className={`px-4 py-2 rounded-xl text-xs font-bold transition ${isCurrentPage('/itinerary') ? 'theme-text-sec bg-navy shadow' : 'text-slate-300 hover:text-white'}`}>
              <i className="fa-solid fa-wand-magic-sparkles mr-1 theme-text-sec"></i> AI จัดทริป
            </Link>
            <Link to="/map" className={`px-4 py-2 rounded-xl text-xs font-bold transition ${isCurrentPage('/map') ? 'theme-text-sec bg-navy shadow' : 'text-slate-300 hover:text-white'}`}>
              <i className="fa-solid fa-map-location-dot mr-1 text-amber-400"></i> แผนที่
            </Link>
          </nav>

          {/* UX FEATURE: DARK MODE & THEME SWITCHER */}
          <div className="flex items-center space-x-2.5 shrink-0">
            
            {/* Dark / Light Mode Toggle Button */}
            <button onClick={toggleDarkMode} title="สลับโหมดมืด/สว่าง" className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold transition flex items-center gap-1.5">
              <i className={`fa-solid ${isDarkMode ? 'fa-moon text-blue-400' : 'fa-sun text-amber-400'}`}></i>
              <span className="hidden md:inline text-white text-[11px]">{isDarkMode ? 'โหมดมืด' : 'โหมดสว่าง'}</span>
            </button>

            {/* Theme Color Selector */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1.5 rounded-2xl border border-slate-700">
              <button onClick={() => setTheme('cyan')} title="Cyan Ocean" className="w-4 h-4 rounded-full bg-cyan-400 hover:scale-125 transition border border-white/30"></button>
              <button onClick={() => setTheme('sunset')} title="Sunset Orange" className="w-4 h-4 rounded-full bg-orange-500 hover:scale-125 transition border border-white/30"></button>
              <button onClick={() => setTheme('emerald')} title="Emerald Eco" className="w-4 h-4 rounded-full bg-emerald-500 hover:scale-125 transition border border-white/30"></button>
              <button onClick={() => setTheme('violet')} title="Neon Violet" className="w-4 h-4 rounded-full bg-purple-500 hover:scale-125 transition border border-white/30"></button>
            </div>

            {/* User Profile / Login */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700 ml-2">
                <Link to="/dashboard" className="flex items-center gap-2 hover:bg-slate-700 p-1 rounded-xl transition cursor-pointer">
                  <i className="fa-solid fa-user-circle text-emerald-400 text-lg"></i>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white leading-tight">{user.name}</span>
                    <span className="text-[9px] text-amber-400 leading-tight">{user.points} SDG Points</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="ml-2 text-[10px] text-red-400 hover:text-red-300">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 ml-2 border border-blue-400/30">
                <i className="fa-solid fa-arrow-right-to-bracket"></i> เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-navy border-t border-slate-800 z-50 flex justify-around p-3 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition ${isCurrentPage('/') ? 'theme-text-sec bg-slate-800/50' : 'text-slate-400'}`}>
          <i className="fa-solid fa-house mb-1 text-lg"></i>
          <span className="text-[10px] font-medium">หน้าแรก</span>
        </Link>
        <Link to="/itinerary" className={`flex flex-col items-center p-2 rounded-xl transition ${isCurrentPage('/itinerary') ? 'theme-text-sec bg-slate-800/50' : 'text-slate-400'}`}>
          <i className="fa-solid fa-wand-magic-sparkles mb-1 text-lg theme-text-sec"></i>
          <span className="text-[10px] font-medium">AI ทริป</span>
        </Link>
        <Link to="/map" className={`flex flex-col items-center p-2 rounded-xl transition ${isCurrentPage('/map') ? 'theme-text-sec bg-slate-800/50' : 'text-slate-400'}`}>
          <i className="fa-solid fa-map-location-dot mb-1 text-lg text-amber-400"></i>
          <span className="text-[10px] font-medium">แผนที่</span>
        </Link>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/map" element={<SmartMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Floating AI Chatbot */}
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
