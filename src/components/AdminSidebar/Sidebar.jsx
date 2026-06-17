import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import {
  Menu, X, Headphones, LayoutDashboard,
  CalendarCheck, CheckSquare, Trash2, Map, Upload, Trophy, User, LogOut, Send, ChevronDown,
} from "lucide-react";

const ADMIN_CATEGORIES = [
  "Sensor / Device Issue",
  "System Bug / Error",
  "Account Management",
  "Email Alert Issue",
  "Report / Data Issue",
  "Other",
];

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    { name: "Tasks Management", icon: <CalendarCheck size={20} />, path: "tasks-management" },
    { name: "Bin Management", icon: <Map size={20} />, path: "bin-management" },
    { name: "Collect Management", icon: <CheckSquare size={20} />, path: "collectors-management" },
    { name: "Vehicle Management", icon: <Trash2 size={20} />, path: "vehicle-management" },
    { name: "Real-Time Monitoring", icon: <Headphones size={20} />, path: "real-time-monitoring" },
    { name: "Routes Map", icon: <Map size={20} />, path: "routes-map" },
    { name: "Customer Support", icon: <Headphones size={20} />, path: "customer-support" },
    { name: "Reports", icon: <Trophy size={20} />, path: "reports" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return toast.error("Please fill in all fields.");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/support/create`, {
        name: user.name || "Admin",
        email: user.email || "admin@system.com",
        phone: "N/A",
        subject,
        message,
      });
      toast.success("Support ticket submitted!");
      setShowSupport(false);
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8" />
          <span className="font-bold text-green-600">Smart Waste</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* 🔹 Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm" onClick={() => setOpen(false)}></div>}

      {/* 🔹 Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 w-72 bg-white text-slate-600 border-r border-slate-100 h-screen flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Top Section */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="h-10" />
            </div>
            <button onClick={() => setOpen(false)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-1">
            {menu.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-green-500 text-white shadow-lg shadow-green-100" : "text-slate-600 hover:bg-green-50 hover:text-green-600"}`
                }
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-3xl text-white shadow-lg shadow-green-100">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <Headphones size={20} className="text-white" />
            </div>
            <p className="font-bold text-sm mb-1">Need Help?</p>
            <p className="text-xs text-white/80 mb-4">Report a system issue or request support</p>
            <button
              onClick={() => setShowSupport(true)}
              className="w-full bg-white text-green-600 py-2.5 rounded-xl text-xs font-bold hover:bg-green-50 transition-all active:scale-95"
            >
              CONTACT SUPPORT
            </button>
          </div>

          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="flex items-center gap-3 px-4 py-3 mt-4 text-slate-400 hover:text-red-500 transition-colors w-full font-semibold text-sm"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* 🔹 Admin Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Headphones size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Admin Support</h3>
                  <p className="text-white/80 text-xs">Report a system-level issue</p>
                </div>
              </div>
              <button onClick={() => setShowSupport(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Issue Category</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 appearance-none transition-all"
                  >
                    <option value="">-- Select Issue Type --</option>
                    {ADMIN_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Describe the Issue</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the problem in detail..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-slate-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupport(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Send size={16} />
                  {sending ? "Sending..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
