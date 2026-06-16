import React, { useState, useEffect } from "react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import socketService from "../../../services/socketService";
import { UserCheck, Camera, Trash2, Activity, Zap, Radio } from "lucide-react";
import toast from "react-hot-toast";

const RealTimeMonitoring = () => {
  const [bins, setBins] = useState([]);
  const [attendanceFeed, setAttendanceFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      const binsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/waste/all`);
      setBins(binsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    socketService.connect();

    // Listen for Bin Updates (upload + heartbeat every ~30s)
    socketService.on("binUpdate", (updatedBin) => {
      setBins(prev => {
        const exists = prev.some(b => b.binId === updatedBin.binId);
        if (!exists) return [...prev, updatedBin];
        return prev.map(b => b.binId === updatedBin.binId ? updatedBin : b);
      });
      if (updatedBin.status === 'full') {
        toast.error(`⚠️ Bin ${updatedBin.binId} is FULL!`, { position: 'top-right' });
      }
    });

    // Listen for Attendance Updates
    socketService.on("attendanceUpdate", (data) => {
      setAttendanceFeed(prev => [data, ...prev].slice(0, 10)); // Keep last 10
      toast.success(`👤 Collector just checked in!`, { icon: '🚚', position: 'top-right' });
    });

    return () => socketService.disconnect();
  }, []);

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Unknown";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 0) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <DashboardHeader 
        title="Command Center" 
        subtitle="Real-time operations monitoring and live activity feeds" 
      />

      <div className="px-6 md:px-8">
        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <MetricCard icon={<Activity className="text-green-500" />} label="Live Bins" value={bins.length} />
           <MetricCard icon={<Trash2 className="text-red-500" />} label="Full Bins" value={bins.filter(b => b.status === 'full').length} />
           <MetricCard icon={<UserCheck className="text-blue-500" />} label="Active Collectors" value={attendanceFeed.length} />
           <MetricCard icon={<Zap className="text-yellow-500" />} label="System Status" value="Online" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. LIVE BIN MONITOR */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Trash2 size={18} className="text-slate-400" /> Bin Network</h3>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-green-500 bg-green-50 px-2 py-1 rounded-full animate-pulse">
                   Live Data
                </span>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {bins.map(bin => (
                  <div key={bin._id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:border-green-100 transition-all group">
                     <div className="flex justify-between items-start mb-3">
                        <div>
                           <p className="text-xs font-black text-slate-400 uppercase">{bin.binId}</p>
                           <h4 className="font-bold text-slate-700 truncate max-w-[150px]">{bin.location}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${getStatusBadge(bin.wasteLevel)}`}>
                           {bin.status}
                        </span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className={`h-full transition-all duration-1000 ${getProgressColor(bin.wasteLevel)}`} style={{width: `${bin.wasteLevel}%`}}></div>
                     </div>
                     <div className="flex items-center justify-between gap-2 mb-2 px-2 py-1.5 rounded-lg bg-white border border-slate-100">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                           <Radio size={12} className="text-green-500 animate-pulse" />
                           Live distance
                        </span>
                        <span className="text-sm font-black text-slate-800 tabular-nums">
                           {bin.distance != null ? `${bin.distance} cm` : '—'}
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>{bin.wasteLevel}% Full</span>
                        <span>{getRelativeTime(bin.updatedAt)}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* 2. SNAPSHOT VERIFICATION */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Camera size={18} className="text-slate-400" /> IoT Snapshots</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4">
                {bins.filter(b => b.imageUrl).length === 0 ? (
                  <div className="text-center py-20 text-slate-300 font-medium italic text-sm">No live snapshots...</div>
                ) : (
                  bins.filter(b => b.imageUrl).map(bin => (
                    <div key={bin._id} className="rounded-2xl border border-slate-50 overflow-hidden shadow-sm group">
                       <div className="relative h-40 overflow-hidden">
                          <img src={`${import.meta.env.VITE_API_URL}${bin.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Bin" />
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-widest">
                             {bin.binId}
                          </div>
                       </div>
                       <div className="p-4 bg-white flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{getRelativeTime(bin.updatedAt)}</span>
                          <div className="flex gap-2">
                             <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><UserCheck size={14} /></button>
                             <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
       {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       <h4 className="text-xl font-black text-slate-800">{value}</h4>
    </div>
  </div>
);

const getStatusBadge = (level) => {
  if (level > 80) return "bg-red-50 text-red-600";
  if (level > 40) return "bg-yellow-50 text-yellow-600";
  return "bg-green-50 text-green-600";
};

const getProgressColor = (level) => {
  if (level > 80) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]";
  if (level > 40) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]";
  return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]";
};

export default RealTimeMonitoring;