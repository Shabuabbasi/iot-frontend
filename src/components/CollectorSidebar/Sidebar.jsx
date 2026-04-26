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

const CollectorSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "" },
    { name: "Attendance", icon: <CalendarCheck size={20} />, path: "attendance" },
    { name: "My Tasks", icon: <CheckSquare size={20} />, path: "tasks" },
    { name: "Bin Collections", icon: <Trash2 size={20} />, path: "bin-collections" },
    { name: "Collectors Routes", icon: <Map size={20} />, path: "collectors-routes" },
    { name: "Upload Proof", icon: <Upload size={20} />, path: "upload-proof" },
    { name: "Reports", icon: <Upload size={20} />, path: "reports" },
    // { name: "Achievements", icon: <Trophy size={20} />, path: "achievements" },
    { name: "Profile", icon: <User size={20} />, path: "profile" },
    { name: "Logout", icon: <LogOut size={20} />, path: "logout" },
  ];

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8" />
          <span className="font-bold text-green-600">Collector Portal</span>
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
        w-64 bg-white shadow-xl md:shadow-none
        h-screen flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between mb-8">
            <img src={logo} alt="logo" className="h-10" />
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-1">
            {menu.map((item, index) => {
              if (item.name === "Logout") {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 w-full text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </button>
                );
              }
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  end
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                      ? "bg-green-500 text-white shadow-lg shadow-green-200"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl text-white shadow-lg">
            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Headphones size={20} />
            </div>
            <p className="font-bold text-sm">Need Help?</p>
            <p className="text-xs text-white/80 mb-3">Support is available 24/7</p>
            <button className="w-full bg-white text-green-600 py-2 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors">
              Contact Support
            </button>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-3 mt-4 text-gray-500 hover:text-red-500 transition-colors w-full font-semibold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default CollectorSidebar;
