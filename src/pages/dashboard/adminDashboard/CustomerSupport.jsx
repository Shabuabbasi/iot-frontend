import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../../components/DashboardHeader";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Filter,
  MoreVertical,
  Mail,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/support/all`);
      setTickets(response.data.tickets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/support/update/${id}`, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/support/delete/${id}`);
      toast.success("Ticket deleted");
      fetchTickets();
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const filteredTickets = filter === "all" 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <DashboardHeader 
        title="Support & Help Desk" 
        subtitle="Manage citizen complaints, service requests, and feedback" 
      />

      <div className="px-6 md:px-8">
        {/* STATS & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All Tickets" count={tickets.length} />
            <FilterButton active={filter === "open"} onClick={() => setFilter("open")} label="Open" count={tickets.filter(t => t.status === "open").length} color="text-red-500" />
            <FilterButton active={filter === "in-progress"} onClick={() => setFilter("in-progress")} label="In Progress" count={tickets.filter(t => t.status === "in-progress").length} color="text-yellow-500" />
            <FilterButton active={filter === "resolved"} onClick={() => setFilter("resolved")} label="Resolved" count={tickets.filter(t => t.status === "resolved").length} color="text-green-500" />
          </div>
        </div>

        {/* TICKETS LIST */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <MessageSquare size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800">No tickets found</h3>
               <p className="text-slate-400 text-sm">Everything is clear! No pending support requests.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Color Indicator */}
                  <div className={`w-2 lg:w-4 ${getStatusColor(ticket.status)}`}></div>
                  
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusBadge(ticket.status)}`}>
                             {ticket.status}
                           </span>
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                             {new Date(ticket.createdAt).toLocaleString()}
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-1">{ticket.subject}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">{ticket.message}</p>
                      </div>

                      <div className="flex gap-2">
                        <ActionButton icon={<CheckCircle2 size={18} />} label="Resolve" onClick={() => handleStatusChange(ticket._id, "resolved")} color="hover:bg-green-50 hover:text-green-600" />
                        <ActionButton icon={<Clock size={18} />} label="Process" onClick={() => handleStatusChange(ticket._id, "in-progress")} color="hover:bg-yellow-50 hover:text-yellow-600" />
                        <ActionButton icon={<Trash2 size={18} />} label="Delete" onClick={() => handleDelete(ticket._id)} color="hover:bg-red-50 hover:text-red-600" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                             {ticket.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-800">{ticket.name}</p>
                             <p className="text-[10px] font-bold text-slate-400">Citizen Request</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={14} />
                          <span className="text-xs font-medium">{ticket.email}</span>
                       </div>
                       {ticket.phone && (
                         <div className="flex items-center gap-2 text-slate-400">
                            <Phone size={14} />
                            <span className="text-xs font-medium">{ticket.phone}</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* Components */

const FilterButton = ({ active, onClick, label, count, color = "text-slate-400" }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
      active 
        ? "bg-white text-slate-800 shadow-md border border-slate-100" 
        : "text-slate-400 hover:bg-slate-200/30"
    }`}
  >
    <span className={active ? "text-green-500" : color}>{label}</span>
    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${active ? 'bg-slate-100' : 'bg-slate-200/50'}`}>{count}</span>
  </button>
);

const ActionButton = ({ icon, label, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 text-xs font-bold transition-all border border-slate-100 ${color}`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const getStatusColor = (status) => {
  switch (status) {
    case "open": return "bg-red-500";
    case "in-progress": return "bg-yellow-500";
    case "resolved": return "bg-green-500";
    default: return "bg-slate-200";
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "open": return "bg-red-50 text-red-600";
    case "in-progress": return "bg-yellow-50 text-yellow-600";
    case "resolved": return "bg-green-50 text-green-600";
    default: return "bg-slate-50 text-slate-400";
  }
};

export default CustomerSupport;
