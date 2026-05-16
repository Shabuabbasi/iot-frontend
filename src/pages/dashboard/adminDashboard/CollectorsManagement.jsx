import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Phone, MapPin, X, Trash2, ShieldCheck } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Line,
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const CollectorsManagement = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "Permanent",
    phone: "",
    department: "Field Operations"
  });

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users/collectors");
      setCollectors(res.data.collectors || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collectors:", error);
      toast.error("Failed to load collectors list");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        ...formData,
        role: "collector"
      });
      toast.success("New collector registered successfully! 👷‍♂️");
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        type: "Permanent",
        phone: "",
        department: "Field Operations"
      });
      fetchCollectors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this collector?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${id}`); // Assuming delete exists
      toast.success("Collector removed");
      fetchCollectors();
    } catch (error) {
      toast.error("Failed to remove collector");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-12">
      <DashboardHeader 
        title="Staff Intelligence" 
        subtitle="Manage and monitor your waste collection workforce" 
      />

      <div className="px-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Staff" value={collectors.length} color="blue" />
          <StatCard title="Active Duty" value={Math.ceil(collectors.length * 0.7)} color="green" />
          <StatCard title="On Leave" value={Math.floor(collectors.length * 0.1)} color="yellow" />
          <StatCard title="New Joinees" value="4" color="purple" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 col-span-2">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Attendance Velocity</h3>
            <Line
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                  label: "Staff Presence",
                  data: [45, 52, 48, 61, 55, 40, 35],
                  borderColor: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  tension: 0.5,
                  fill: true,
                  pointRadius: 4,
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 2
                }]
              }}
              options={{ 
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { display: false }, x: { grid: { display: false } } }
              }}
            />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Department Split</h3>
            <Bar
              data={{
                labels: ["Field", "Admin", "Logistics"],
                datasets: [{
                  data: [70, 15, 15],
                  backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
                  borderRadius: 12
                }]
              }}
              options={{ 
                responsive: true,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or department..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 transition-all text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-100"
          >
            <UserPlus size={18} /> + Add New Collector
          </button>
        </div>

        {/* COLLECTORS TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Collector Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan="6" className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing with HR Database...</td></tr>
                ) : collectors.length === 0 ? (
                   <tr><td colSpan="6" className="text-center py-24 text-slate-400 italic">No collectors found.</td></tr>
                ) : (
                  collectors.map((collector) => (
                    <tr key={collector._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                             <ShieldCheck size={22} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{collector.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{collector.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                           {collector.type || "Permanent"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-green-500 transition-all"><Phone size={14} /></button>
                           <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-500 transition-all"><Mail size={14} /></button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">
                        {collector.department || "Field Ops"}
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          On Duty
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                             <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD COLLECTOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-800">Recruit Staff</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Onboard a new waste collector</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white rounded-2xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <InputGroup label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Muhammad Ahsan" />
                 <InputGroup label="Email ID" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="ahsan@smartwaste.com" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <InputGroup label="Temporary Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
                    <select 
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white transition-all text-sm font-bold appearance-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                       <option value="Permanent">Permanent</option>
                       <option value="Contract">Contract</option>
                       <option value="Part-time">Part-time</option>
                    </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <InputGroup label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="03xx-xxxxxxx" />
                 <InputGroup label="Assigned Sector" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} placeholder="Sector G-10" />
              </div>
              
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-slate-200 mt-6 uppercase tracking-widest text-xs">
                 <UserPlus size={18} /> Finalize Recruitment →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* UI COMPONENTS */
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    yellow: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50"
  };
  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col items-start gap-2 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>{title}</span>
      <h2 className="text-4xl font-black text-slate-800 group-hover:scale-110 transition-transform origin-left">{value}</h2>
    </div>
  );
};

const InputGroup = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white transition-all text-sm font-bold"
      {...props}
      required
    />
  </div>
);

export default CollectorsManagement;
