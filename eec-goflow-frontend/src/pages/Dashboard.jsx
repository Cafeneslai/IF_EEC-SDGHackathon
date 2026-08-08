import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Leaf, Map, Calendar, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
