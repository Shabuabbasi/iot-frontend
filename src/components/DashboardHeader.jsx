import React, { useState, useEffect } from "react";
import { Search, Bell, Settings } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const getProfileImage = (path) => {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const DashboardHeader = ({ title, subtitle }) => {
  const [user, setUser] = useState({ name: "User", initials: "U", profilePic: "" });

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const name = parsedUser.name || "User";
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          setUser({ name, initials, profilePic: parsedUser.profilePic || "" });
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
    };

    loadUser();
    window.addEventListener("user-updated", loadUser);

    return () => {
      window.removeEventListener("user-updated", loadUser);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 w-full sm:w-64 focus-within:ring-2 focus-within:ring-green-400 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            className="ml-2 outline-none text-sm bg-transparent w-full"
          />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
            {user.profilePic ? (
              <img
                src={getProfileImage(user.profilePic)}
                alt="profile"
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs uppercase">
                {user.initials}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-700 hidden sm:block whitespace-nowrap">
              {user.name}
            </span>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <div className="relative p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Settings size={18} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
