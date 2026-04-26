import React from 'react'
import { Search } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
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
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Collectors Management" 
        subtitle="Monitor and manage waste collector staff" 
      />


      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Collectors", value: 128 },
          { title: "Present Collectors", value: 42 },
          { title: "Absent Collectors", value: 86 },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              ✓
            </div>
          </div>
        ))}
      </div>

{/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

  {/* Line Chart */}
  <div className="bg-white p-4 rounded-xl shadow col-span-2">
    <div className="flex justify-between mb-3">
      <h3 className="font-semibold">Attendance Comparison</h3>
      <div className="text-sm text-gray-400">Daily</div>
    </div>

    <Line
      data={{
        labels: ["1 Aug","2","3","4","5","6","7","8","9"],
        datasets: [
          {
            label: "Attendance",
            data: [60,70,65,80,90,75,85,70,60],
            borderColor: "#80A615",
            backgroundColor: "rgba(128,166,21,0.2)",
            tension: 0.4,
            fill: true
          }
        ]
      }}
      options={{ responsive: true }}
    />
  </div>

  {/* Bar Chart */}
  <div className="bg-white p-4 rounded-xl shadow">
    <h3 className="font-semibold mb-3">Weekly Attendance</h3>

    <Bar
      data={{
        labels: ["Mon","Tue","Wed","Thu","Fri"],
        datasets: [
          {
            data: [50,60,85,70,55],
            backgroundColor: [
              "#E5E7EB",
              "#E5E7EB",
              "#111827",
              "#E5E7EB",
              "#E5E7EB"
            ]
          }
        ]
      }}
    />
  </div>

</div>

<div className="bg-white p-6 rounded-xl">

  {/* TOP ROW */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* LEFT */}
    <div>
      <h1 className="text-xl font-bold text-gray-800">Collectors List</h1>
      <p className="text-xs text-gray-500 mt-1">32 active collectors found</p>
    </div>

    {/* RIGHT */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Search */}
      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex-1 sm:w-64">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search collectors..."
          className="ml-2 text-sm bg-transparent outline-none w-full"
        />
      </div>

      {/* Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all whitespace-nowrap">
        + Add new Collector
      </button>
    </div>
  </div>

  {/* TABS */}
  <div className="flex gap-6 mt-5 border-b overflow-x-auto">
    <button className="pb-2 text-sm font-medium text-green-600 border-b-2 border-green-600 whitespace-nowrap">
      All Collectors
    </button>
    <button className="pb-2 text-sm text-gray-500 hover:text-black whitespace-nowrap">
      Flow
    </button>
    <button className="pb-2 text-sm text-gray-500 hover:text-black whitespace-nowrap">
      Reports
    </button>
  </div>

  {/* Employees Table */}
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 overflow-x-auto">
    <h3 className="font-bold text-gray-800 mb-4">All Employees</h3>
    <table className="w-full text-sm min-w-[800px]">
      <thead>
        <tr className="text-gray-400 text-left border-b">
          <th className="py-3 font-semibold">Name</th>
          <th className="py-3 font-semibold">Type</th>
          <th className="py-3 font-semibold">Role</th>
          <th className="py-3 font-semibold">Contact</th>
          <th className="py-3 font-semibold">Department</th>
          <th className="py-3 font-semibold">Phone</th>
          <th className="py-3 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        <tr className="border-b hover:bg-gray-50 transition-colors">
          <td className="py-3">Muhammad Ahsan</td>
          <td><span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">Permanent</span></td>
          <td>Driver</td>
          <td><div className="flex gap-2 text-green-600 font-medium">Call | Email</div></td>
          <td>Administration</td>
          <td>0311-1234567</td>
          <td><span className="flex items-center gap-1.5 text-green-600 font-medium"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Working</span></td>
        </tr>
        <tr className="border-b hover:bg-gray-50 transition-colors">
          <td className="py-3">Ahmed Nawaz</td>
          <td><span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">Permanent</span></td>
          <td>Driver</td>
          <td><div className="flex gap-2 text-green-600 font-medium">Call | Email</div></td>
          <td>Management</td>
          <td>0322-9876543</td>
          <td><span className="flex items-center gap-1.5 text-yellow-500 font-medium"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Break</span></td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="py-3">Imran Ali</td>
          <td><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">Part-time</span></td>
          <td>Sweeper</td>
          <td><div className="flex gap-2 text-green-600 font-medium">Call | Email</div></td>
          <td>Cleaning</td>
          <td>0300-5558888</td>
          <td><span className="flex items-center gap-1.5 text-red-500 font-medium"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Off Duty</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      </div>
  )
}

export default CollectorsManagement
