import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import toast from "react-hot-toast";

const Attendance = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [status, setStatus] = useState("Not checked in");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    present: 0,
    late: 0,
    halfDay: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAttendanceData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || user?._id;
      if (!userId) return;

      // Fetch status for today
      const statusRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/status/${userId}`);
      setIsClockedIn(statusRes.data.checkedIn);
      if (statusRes.data.checkedIn) {
        setStatus(statusRes.data.attendance.status.toUpperCase());
      }

      // Fetch history and stats
      const historyRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/history/${userId}`);
      setHistory(historyRes.data.history);
      setStats({
        attendanceRate: historyRes.data.stats.rate,
        present: historyRes.data.stats.present,
        late: historyRes.data.stats.late,
        halfDay: historyRes.data.stats.halfDay,
        absent: historyRes.data.stats.absent,
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleCheckIn = () => {
    if (isClockedIn) {
      toast.success("You are already checked in for today!");
      return;
    }

    setActionLoading(true);
    
    // Get GPS Location
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setActionLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          const userId = user?.id || user?._id;

          await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/check-in`, {
            userId,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

          toast.success("Check-in successful! 🟢");
          fetchAttendanceData();
        } catch (error) {
          toast.error(error.response?.data?.message || "Check-in failed.");
        } finally {
          setActionLoading(false);
        }
      },
      (error) => {
        toast.error("Unable to retrieve location. Please enable GPS.");
        setActionLoading(false);
      }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <DashboardHeader 
        title="Attendance Tracking" 
        subtitle="Manage your daily check-ins and view attendance history" 
      />

      <div className="px-6 md:px-8">
        {/* CLOCK CONTROL CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isClockedIn ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                <Clock size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Attendance Status</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                     {isClockedIn ? `Shift Started: ${status}` : 'Not checked in yet'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={isClockedIn || actionLoading}
              className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                isClockedIn
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-green-100 active:scale-95"
              }`}
            >
              {actionLoading ? <Loader2 className="animate-spin" /> : <MapPin size={20} />}
              {isClockedIn ? "Checked In" : "Check In with GPS"}
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} color="text-green-600" bg="bg-green-50" />
          <StatCard title="Present" value={stats.present} color="text-green-500" bg="bg-slate-50" />
          <StatCard title="Late" value={stats.late} color="text-yellow-500" bg="bg-slate-50" />
          <StatCard title="Half-Day" value={stats.halfDay} color="text-blue-500" bg="bg-slate-50" />
          <StatCard title="Absent" value={stats.absent} color="text-red-500" bg="bg-slate-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HISTORY LIST */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-green-500" /> Recent Activity
              </h3>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="p-10 text-center text-slate-400">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="p-10 text-center text-slate-400">No attendance records found.</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {history.map((r, i) => (
                    <li key={i} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${getStatusBg(r.status)}`}>
                            <CheckCircle2 size={18} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700">{new Date(r.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                               Time: {new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* LEGEND / GUIDE */}
          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
            <div>
               <h4 className="text-xl font-bold mb-4">Attendance Guide</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Shift starts at <span className="text-white font-bold">9:00 AM</span>. Checking in after this time will mark you as <span className="text-yellow-400 font-bold underline">Late</span>. Ensure your GPS is enabled for location verification.
               </p>
               <div className="space-y-4">
                  <LegendItem color="bg-green-500" text="Present (On Time)" />
                  <LegendItem color="bg-yellow-500" text="Late (After 9 AM)" />
                  <LegendItem color="bg-blue-500" text="Half-Day (Early Leave)" />
                  <LegendItem color="bg-red-500" text="Absent (No Record)" />
               </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700/50">
               <p className="text-xs text-slate-500 font-bold uppercase">System Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Components */

const StatCard = ({ title, value, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const LegendItem = ({ color, text }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-sm font-medium text-slate-300">{text}</span>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case "present": return "bg-green-100 text-green-600";
    case "late": return "bg-yellow-100 text-yellow-600";
    case "half-day": return "bg-blue-100 text-blue-600";
    default: return "bg-red-100 text-red-600";
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case "present": return "bg-green-50 text-green-500";
    case "late": return "bg-yellow-50 text-yellow-500";
    case "half-day": return "bg-blue-50 text-blue-500";
    default: return "bg-red-50 text-red-500";
  }
};

export default Attendance;