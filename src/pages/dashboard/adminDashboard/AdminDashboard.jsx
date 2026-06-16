import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../../components/DashboardHeader";
import socketService from "../../../services/socketService";
import { 
  Truck, 
  Users, 
  Database, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  CheckCircle2,
  Bell
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const AdminDashboard = () => {
  const [userName, setUserName] = useState("Admin");
  const [stats, setStats] = useState({
    totalBins: 0,
    fullBins: 0,
    collectors: 0,
    vehicles: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 65 },
    { name: "Thu", value: 45 },
    { name: "Fri", value: 90 },
    { name: "Sat", value: 55 },
    { name: "Sun", value: 70 },
  ];

  const fetchStats = async () => {
    try {
      const wasteResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/waste/all`);
      const allBins = wasteResponse.data.data;
      const fullBinsCount = allBins.filter(b => b.wasteLevel > 80).length;
      
      setStats(prev => ({
        ...prev,
        totalBins: allBins.length,
        fullBins: fullBinsCount,
        collectors: 4, 
        vehicles: 3,   
        recentActivity: allBins.slice(0, 5) 
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) setUserName(user.name);

    fetchStats();

    // Initialize Socket
    socketService.connect();
    socketService.joinRoom("admin");

    socketService.on("binUpdate", (updatedBin) => {
      fetchStats(); // Refresh stats on update
      // Optionally just update the local state for better performance
    });

    socketService.on("binFull", (binData) => {
      // Show alert or sound
      console.log("CRITICAL ALERT: Bin is full", binData);
    });

    return () => socketService.disconnect();
  }, []);

  const completionRate = stats.totalBins > 0 
    ? Math.round(((stats.totalBins - stats.fullBins) / stats.totalBins) * 100) 
    : 0;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-12 font-sans">
      <div className="px-8 pt-10 pb-8 bg-white border-b border-slate-100 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, {userName}
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-8">
        {[
          { title: "Connected Bins", value: stats.totalBins, icon: <Database />, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Full Bins", value: stats.fullBins, icon: <AlertTriangle />, color: "text-red-500", bg: "bg-red-50" },
          { title: "Active Collectors", value: stats.collectors, icon: <Users />, color: "text-green-500", bg: "bg-green-50" },
          { title: "Fleet Units", value: stats.vehicles, icon: <Truck />, color: "text-indigo-500", bg: "bg-indigo-50" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all"
          >
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{item.title}</p>
              <h2 className="text-2xl font-bold text-slate-800">{loading ? "..." : item.value}</h2>
            </div>
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              {React.cloneElement(item.icon, { size: 20 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8">
        {/* Analytics Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Task Status Summary
              </h3>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Status Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-8 self-start">Weekly Performance</h3>
          <div className="relative mb-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - completionRate / 100)}
                className="text-green-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{completionRate}%</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold">
             <span className="flex items-center gap-1.5 text-green-600">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span> Completed
             </span>
             <span className="flex items-center gap-1.5 text-red-500">
               <span className="w-2 h-2 bg-red-500 rounded-full"></span> Pending
             </span>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mt-8 px-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Recent Notifications
            </h3>
            <button className="text-green-600 text-xs font-bold hover:underline">Mark all as read</button>
          </div>

          <div className="space-y-0">
            {loading ? (
              <p className="text-center py-10 text-slate-400">Loading notifications...</p>
            ) : stats.recentActivity.length === 0 ? (
              <p className="text-center py-10 text-slate-400">No new notifications.</p>
            ) : (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={activity._id}
                  className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Bin {activity.binId} Update</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.location} • Status Updated</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">
                    2 min ago
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
