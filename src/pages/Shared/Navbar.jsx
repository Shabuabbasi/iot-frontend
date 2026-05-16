import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, UserCircle } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Homepage", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Features", path: "/features" },
    { name: "Services", path: "/services" },
    { name: "Awareness", path: "/awareness" },
    { name: "Contact", path: "/contact" },
  ];

  const getDashboardPath = () => {
    if (!user) return "/login";
    return user.role === "admin" ? "/Admin-Dashboard" : "/Collector-Dashboard";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-green-100">
              S
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              SMART<span className="text-green-500">BIN</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-green-500 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Dynamic Auth Button (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                <LayoutDashboard size={14} /> Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-100 active:scale-95"
              >
                <UserCircle size={14} /> Member Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-800 hover:text-green-500 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-green-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4">
            {user ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                <LayoutDashboard size={18} /> Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full bg-green-500 text-white px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all"
              >
                <UserCircle size={18} /> Member Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
