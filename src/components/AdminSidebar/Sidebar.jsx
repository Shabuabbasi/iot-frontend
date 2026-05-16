import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/auth/Login_Logo.png";
import {
  Menu, X, Headphones, LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  Trash2,
  Map,
  Upload,
  Trophy,
  User,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
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

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8" />
          <span className="font-bold text-green-600">Smart Waste</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🔹 Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 
        w-72 bg-white text-slate-600 border-r border-slate-100
        h-screen flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <img src={logo} alt="logo" className="h-10" />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
            >
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
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                    ? "bg-green-500 text-white shadow-lg shadow-green-100"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-600"
                  }`
                }
              >
                <span className={`transition-transform duration-200 group-hover:scale-110`}>{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6">
          <div className="bg-linear-to-br from-green-400 to-green-600 p-6 rounded-3xl text-white shadow-lg shadow-green-100">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <Headphones size={20} className="text-white" />
            </div>
            <p className="font-bold text-sm mb-1">Need Help?</p>
            <p className="text-xs text-white/80 mb-4">Our support team is available 24/7</p>
            <button className="w-full bg-white text-green-600 py-2.5 rounded-xl text-xs font-bold hover:bg-green-50 transition-all active:scale-95">
              CONTACT SUPPORT
            </button>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 py-3 mt-4 text-slate-400 hover:text-red-500 transition-colors w-full font-semibold text-sm"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
