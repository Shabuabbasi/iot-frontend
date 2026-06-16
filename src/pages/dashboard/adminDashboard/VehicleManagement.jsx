import React, { useState, useEffect } from "react";
import { Search, Truck, Edit, Trash2, Plus, X } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import toast from "react-hot-toast";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    vehicleNumber: "",
    type: "Garbage Truck",
    fuelType: "Diesel",
    capacity: "",
    status: "Active",
    assignedCollector: ""
  });

  const fetchData = async () => {
    try {
      const [vRes, cRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/vehicles/all`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/collectors`)
      ]);
      setVehicles(vRes.data.vehicles);
      setCollectors(cRes.data.data || cRes.data.collectors || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vehicles/add`, formData);
      toast.success("Vehicle registered and collector assigned! 🚛");
      setShowModal(false);
      setFormData({
        name: "",
        vehicleNumber: "",
        type: "Garbage Truck",
        fuelType: "Diesel",
        capacity: "",
        status: "Active",
        assignedCollector: ""
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add vehicle");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/vehicles/delete/${id}`);
      toast.success("Vehicle removed from fleet");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-12">
      <DashboardHeader 
        title="Fleet Operations" 
        subtitle="Manage vehicles and assigned collection teams" 
      />

      <div className="px-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Fleet" value={vehicles.length} icon={<Truck className="text-blue-500" />} />
          <StatCard title="Active Units" value={vehicles.filter(v => v.status === 'Active').length} icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />} />
          <StatCard title="Maintenance" value={vehicles.filter(v => v.status === 'Maintenance').length} icon={<div className="w-2 h-2 bg-red-500 rounded-full" />} />
          <StatCard title="Team Coverage" value={`${Math.round((vehicles.filter(v => v.assignedCollector).length / (vehicles.length || 1)) * 100)}%`} icon={<div className="w-2 h-2 bg-blue-500 rounded-full" />} />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Plate Number or Model..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 transition-all text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <Plus size={18} /> New Assignment
          </button>
        </div>

        {/* VEHICLE LIST */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Info</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Driver</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuel</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-medium">Loading fleet data...</td></tr>
                ) : vehicles.length === 0 ? (
                   <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-medium italic">No vehicles in fleet.</td></tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <Truck size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{vehicle.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{vehicle.vehicleNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         {vehicle.assignedCollector ? (
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">
                               {vehicle.assignedCollector.name?.charAt(0)}
                             </div>
                             <span className="text-sm font-bold text-slate-700">{vehicle.assignedCollector.name}</span>
                           </div>
                         ) : (
                           <span className="text-xs font-bold text-slate-300 italic tracking-tight">Unassigned</span>
                         )}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">{vehicle.type}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {vehicle.fuelType}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusStyle(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle._id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
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

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800">New Assignment</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Link vehicle to collection team</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Model" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Mitsubishi LXR" />
                <InputGroup label="Plate No" name="vehicleNumber" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} placeholder="ABC-1234" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <SelectGroup label="Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} options={["Garbage Truck", "Delivery Car", "Rickshaw", "Van"]} />
                <SelectGroup label="Fuel" value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} options={["Diesel", "Petrol", "Electric", "Gas"]} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Collector</label>
                <select 
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white transition-all text-sm font-bold appearance-none"
                  value={formData.assignedCollector}
                  onChange={(e) => setFormData({...formData, assignedCollector: e.target.value})}
                  required
                >
                  <option value="">Select a Collector...</option>
                  {collectors.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <InputGroup label="Capacity" name="capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 5 Tons" />
              
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-slate-200 mt-4">
                Confirm Assignment →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* UI COMPONENTS */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-3xl font-black text-slate-800">{value}</h2>
    </div>
    <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white transition-all text-sm font-bold"
      {...props}
      required
    />
  </div>
);

const SelectGroup = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white transition-all text-sm font-bold appearance-none"
      {...props}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const getStatusStyle = (status) => {
  switch (status) {
    case "Active": return "bg-green-50 text-green-600";
    case "Maintenance": return "bg-red-50 text-red-600";
    case "Stopped": return "bg-slate-100 text-slate-400";
    case "Idle": return "bg-yellow-50 text-yellow-600";
    default: return "bg-slate-50 text-slate-400";
  }
};

export default VehicleManagement;