import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Leaf, Map, Calendar, Loader2, Gift, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(savedUser);
    
    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/dashboard?userId=${parsedUser.id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          // Update local storage points just in case
          const updatedUser = { ...parsedUser, points: data.user.points };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  const handleRedeem = (cost, itemName) => {
    if (user.points >= cost) {
      const newPoints = user.points - cost;
      setUser({ ...user, points: newPoints });
      
      // Update local storage so it persists slightly
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...savedUser, points: newPoints }));
      
      setRedeemSuccess(`แลกรับ ${itemName} สำเร็จ!`);
      setTimeout(() => setRedeemSuccess(null), 3000);
    } else {
      alert('คะแนนสะสมของคุณไม่เพียงพอสำหรับการแลกรับสิทธิ์นี้');
    }
  };

  if (!user) return null;

  // Calculate stats
  const totalTrips = user.trips?.length || 0;
  
  let totalEcoScore = 0;
  let validEcoScores = 0;
  
  user.trips?.forEach(trip => {
    try {
      const plan = JSON.parse(trip.itinerary);
      if (plan.summary && plan.summary.eco_score_percentage) {
        totalEcoScore += plan.summary.eco_score_percentage;
        validEcoScores++;
      }
    } catch(e) {}
  });

  const avgEcoScore = validEcoScores > 0 ? Math.round(totalEcoScore / validEcoScores) : 0;

  // Chart data
  const chartData = [
    { name: 'Eco Score', value: avgEcoScore, color: '#10b981' },
    { name: 'Remaining', value: 100 - avgEcoScore, color: '#e2e8f0' }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-12">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-black text-slate-800 mb-2">My Dashboard 📊</h1>
        <p className="text-slate-500">ยินดีต้อนรับกลับมา, {user.name} โลกนี้ดีขึ้นได้ด้วยการเดินทางของคุณ!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Points Card */}
        <div className="glass-card-premium p-6 rounded-3xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <Award className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-2 z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-700">SDG Points</h3>
          </div>
          <p className="text-4xl font-black text-amber-500 z-10">{user.points} <span className="text-base text-slate-400 font-normal">pts</span></p>
        </div>

        {/* Trips Card */}
        <div className="glass-card-premium p-6 rounded-3xl relative overflow-hidden flex flex-col justify-center">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500">
            <Map className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-2 z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-700">Total Trips</h3>
          </div>
          <p className="text-4xl font-black text-blue-600 z-10">{totalTrips} <span className="text-base text-slate-400 font-normal">trips</span></p>
        </div>

        {/* Eco Score Chart Card */}
        <div className="glass-card-premium p-6 rounded-3xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-700">Avg Eco-Score</h3>
            </div>
            <p className="text-4xl font-black text-emerald-500">{avgEcoScore}%</p>
          </div>
          
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rewards Store */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" /> SDG Rewards Store (แลกของรางวัล)
          </h2>
          <button 
            onClick={() => {
              const newPoints = (user.points || 0) + 1000;
              setUser({ ...user, points: newPoints });
              const savedUser = JSON.parse(localStorage.getItem('user'));
              localStorage.setItem('user', JSON.stringify({ ...savedUser, points: newPoints }));
            }}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-lg transition"
            title="ปุ่มสำหรับกรรมการกดเทสระบบ"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> เสกคะแนน 1,000 pts (สำหรับเทส)
          </button>
        </div>
        
        {redeemSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{redeemSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reward 1 */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-amber-300 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl">🛍️</div>
              <div>
                <h4 className="font-bold text-slate-700">คูปองส่วนลด 10% ร้าน OTOP</h4>
                <p className="text-xs text-slate-500">สนับสนุนวิสาหกิจชุมชนใน EEC</p>
              </div>
            </div>
            <button 
              onClick={() => handleRedeem(200, 'คูปองส่วนลด OTOP')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition ${user.points >= 200 ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              200 pts
            </button>
          </div>
          
          {/* Reward 2 */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-blue-300 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">🚌</div>
              <div>
                <h4 className="font-bold text-slate-700">ตั๋วโดยสาร EV Bus 1 วัน</h4>
                <p className="text-xs text-slate-500">ลดคาร์บอนฟุตพริ้นท์จากการเดินทาง</p>
              </div>
            </div>
            <button 
              onClick={() => handleRedeem(500, 'ตั๋วโดยสาร EV Bus')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition ${user.points >= 500 ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              500 pts
            </button>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-500" /> ประวัติการสร้างทริป (Trip History)
      </h2>
      
      {totalTrips === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
          คุณยังไม่ได้สร้างแผนการเดินทาง เริ่มให้ AI จัดทริปเลย!
        </div>
      ) : (
        <div className="space-y-4">
          {user.trips.map(trip => {
            let planTheme = "Trip";
            let days = 1;
            let budget = 0;
            try {
              const plan = JSON.parse(trip.itinerary);
              if (plan.summary) {
                planTheme = plan.summary.theme || "Trip";
                budget = plan.summary.total_budget_estimate || 0;
              }
              if (plan.plan) {
                days = plan.plan.length;
              }
            } catch(e) {}

            return (
              <div key={trip.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{planTheme}</h3>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span>📅 {new Date(trip.startDate).toLocaleDateString()}</span>
                    <span>⏱️ {days} วัน</span>
                    <span>💰 ~{budget} THB</span>
                  </div>
                </div>
                <button className="bg-slate-100 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm transition">
                  ดูรายละเอียด
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
