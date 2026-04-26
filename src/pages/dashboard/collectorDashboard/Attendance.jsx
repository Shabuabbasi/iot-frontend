import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";

const Attendance = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [status, setStatus] = useState("Not checked in");

  const handleClock = () => {
    if (isClockedIn) {
      setStatus("Checked Out");
      setIsClockedIn(false);
    } else {
      setStatus("Present");
      setIsClockedIn(true);
    }
  };

  const stats = {
    attendanceRate: 85,
    present: 18,
    late: 2,
    halfDay: 1,
    absent: 3,
  };

  const recent = [
    { date: "2025-03-01", status: "present" },
    { date: "2025-03-02", status: "late" },
    { date: "2025-03-03", status: "absent" },
    { date: "2025-03-04", status: "half-day" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Attendance Tracking" 
        subtitle="Manage your daily check-ins and view attendance history" 
      />

      {/* CLOCK CONTROL */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isClockedIn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              <Clock size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Attendance Control</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <p className="text-sm font-medium text-gray-500">Today's Status: <span className={isClockedIn ? 'text-green-600' : 'text-gray-400'}>{status}</span></p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClock}
            className={`w-full md:w-auto px-10 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
              isClockedIn
                ? "bg-red-500 hover:bg-red-600 shadow-red-100"
                : "bg-green-500 hover:bg-green-600 shadow-green-100"
            }`}
          >
            {isClockedIn ? "Check Out Now" : "Check In Now"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Attendance Rate" value={`${stats.attendanceRate}%`} color="text-[#80A615]" />
        <Card title="Present" value={stats.present} color="text-green-600" />
        <Card title="Late" value={stats.late} color="text-yellow-500" />
        <Card title="Half-Day" value={stats.halfDay} color="text-blue-500" />
        <Card title="Absent" value={stats.absent} color="text-red-500" />
      </div>

      {/* CALENDAR + RECENT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CALENDAR */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold flex items-center gap-2 text-gray-700 mb-4">
            <Calendar className="text-[#80A615]" /> Calendar View
          </h3>

          <p className="text-gray-500 text-sm mb-4">March 2025</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <Legend color="bg-green-500" text="Present" />
            <Legend color="bg-yellow-500" text="Late" />
            <Legend color="bg-blue-500" text="Half-Day" />
            <Legend color="bg-red-500" text="Absent" />
          </div>
        </div>

        {/* RECENT */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Records
          </h3>

          <ul className="space-y-2 text-sm">
            {recent.map((r, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <span>{r.date}</span>
                <span className={`font-semibold ${getColor(r.status)}`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

/* Small Components */

const Card = ({ title, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Legend = ({ color, text }) => (
  <span className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${color}`}></span>
    {text}
  </span>
);

const getColor = (status) => {
  switch (status) {
    case "present":
      return "text-green-600";
    case "late":
      return "text-yellow-500";
    case "half-day":
      return "text-blue-500";
    default:
      return "text-red-500";
  }
};

export default Attendance;