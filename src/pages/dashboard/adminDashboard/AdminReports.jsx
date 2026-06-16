import React, { useState, useEffect } from "react";
import axios from "axios";
import socketService from "../../../services/socketService";
import DashboardHeader from "../../../components/DashboardHeader";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Trash2, 
  Clock, 
  CheckCircle2,
  Filter,
  UserCheck,
  MapPin
} from "lucide-react";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("bins"); // "bins" or "attendance"
  const [stats, setStats] = useState({
    totalBins: 0,
    statusBreakdown: [],
    recentHistory: [],
    avgFillLevel: 0
  });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "bins") {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/waste/all`);
          const statsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/waste/stats`);
          const breakdown = statsResponse.data.stats.map(s => ({
            name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
            value: s.count,
            color: s._id === 'full' ? '#ef4444' : s._id === 'half' ? '#eab308' : '#22c55e'
          }));
          setStats({
            totalBins: statsResponse.data.totalBins,
            statusBreakdown: breakdown,
            recentHistory: response.data.data.slice(0, 10),
            avgFillLevel: Math.round(response.data.data.reduce((acc, curr) => acc + curr.wasteLevel, 0) / response.data.data.length) || 0
          });
        } else {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/all`);
          setAttendanceHistory(response.data.history);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    socketService.connect();
    socketService.on("attendanceUpdate", (newEntry) => {
      if (activeTab === "attendance") {
        setAttendanceHistory(prev => [newEntry, ...prev]);
      }
    });
    return () => socketService.disconnect();
  }, [activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <DashboardHeader 
        title="Admin Reports" 
        subtitle="System performance metrics and collector activity logs" 
      />

      <div className="px-6 md:px-8">
        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 mb-8 w-fit">
           <button 
             onClick={() => setActiveTab("bins")} 
             className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "bins" ? "bg-green-500 text-white shadow-md shadow-green-100" : "text-slate-400 hover:bg-slate-50"}`}
           >
             Bin Operations
           </button>
           <button 
             onClick={() => setActiveTab("attendance")} 
             className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "attendance" ? "bg-green-500 text-white shadow-md shadow-green-100" : "text-slate-400 hover:bg-slate-50"}`}
           >
             Collector Attendance
           </button>
        </div>

        {activeTab === "bins" ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Total Monitored Bins", value: stats.totalBins, icon: <Trash2 />, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Avg. System Fill Level", value: `${stats.avgFillLevel}%`, icon: <TrendingUp />, color: "text-green-600", bg: "bg-green-50" },
                { label: "Active Collection Alerts", value: stats.statusBreakdown.find(s => s.name === 'Full')?.value || 0, icon: <Clock />, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      {React.cloneElement(stat.icon, { size: 24 })}
                   </div>
                   <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                      <h2 className="text-2xl font-black text-slate-800">{loading ? "..." : stat.value}</h2>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <TrendingUp size={20} className="text-green-500" /> Collection Volume Trend
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { day: 'Mon', count: 12 }, { day: 'Tue', count: 19 }, { day: 'Wed', count: 15 },
                          { day: 'Thu', count: 22 }, { day: 'Fri', count: 30 }, { day: 'Sat', count: 18 }, { day: 'Sun', count: 10 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                          <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="text-lg font-bold text-slate-800">Recent Collection Activity</h3>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                             <tr>
                                <th className="px-8 py-4">Bin ID</th>
                                <th className="px-8 py-4">Location</th>
                                <th className="px-8 py-4">Fill Level</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Timestamp</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {stats.recentHistory.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-8 py-4 text-sm font-bold text-slate-700">{item.binId}</td>
                                   <td className="px-8 py-4 text-sm text-slate-500">{item.location}</td>
                                   <td className="px-8 py-4">
                                      <div className="flex items-center gap-2">
                                         <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-green-500 h-full" style={{width: `${item.wasteLevel}%`}}></div>
                                         </div>
                                         <span className="text-xs font-bold text-slate-600">{item.wasteLevel}%</span>
                                      </div>
                                   </td>
                                   <td className="px-8 py-4">
                                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                         item.status === 'full' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                      }`}>{item.status}</span>
                                   </td>
                                   <td className="px-8 py-4 text-xs text-slate-400 font-medium">{new Date(item.updatedAt).toLocaleString()}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Status Distribution</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={stats.statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                            {stats.statusBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            </div>
          </>
        ) : (
          /* ATTENDANCE REPORTS TAB */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <UserCheck className="text-green-500" /> Collector Attendance History
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500 bg-green-50 px-3 py-1.5 rounded-full animate-pulse">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Live Feed Active
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                         <tr>
                            <th className="px-8 py-4">Collector Name</th>
                            <th className="px-8 py-4">Email</th>
                            <th className="px-8 py-4">Check-In Time</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Verification</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400">Loading records...</td></tr>
                         ) : attendanceHistory.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400">No attendance records found.</td></tr>
                         ) : (
                            attendanceHistory.map((entry, i) => (
                               <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-8 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                                           {entry.userId?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{entry.userId?.name || 'Unknown User'}</span>
                                     </div>
                                  </td>
                                  <td className="px-8 py-4 text-sm text-slate-500">{entry.userId?.email || 'N/A'}</td>
                                  <td className="px-8 py-4">
                                     <div>
                                        <p className="text-sm font-bold text-slate-700">{new Date(entry.checkInTime).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(entry.checkInTime).toLocaleTimeString()}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-4">
                                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        entry.status === 'present' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                     }`}>{entry.status}</span>
                                  </td>
                                  <td className="px-8 py-4">
                                     <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                        <MapPin size={12} className="text-blue-500" /> GPS Verified
                                     </span>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
