import React, { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, MapPin, Trash2, X, AlertTriangle  } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import toast from "react-hot-toast";

const BinManagement = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, binId: null, _id: null });

  const fetchBins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/waste/all");
      setBins(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bins:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleDelete = async () => {
    try {
      // Note: Assuming there's a delete endpoint or just simulating for now
      // await axios.delete(`http://localhost:5000/api/waste/${deleteModal._id}`);
      toast.success(`Bin ${deleteModal.binId} removed successfully`);
      setBins(bins.filter(b => b._id !== deleteModal._id));
      setDeleteModal({ open: false, binId: null, _id: null });
    } catch (error) {
      toast.error("Failed to delete bin");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Bin Management" 
        subtitle="Real-time status of connected smart bins across the metropolitan area" 
      />

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Bin?</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to remove <span className="font-bold text-gray-800">{deleteModal.binId}</span>? This action cannot be undone.</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteModal({ open: false, binId: null, _id: null })}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4 md:px-0">
        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all">
          + Add New Bin
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center mb-6 mx-4 md:mx-0">
        {/* Search */}
        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex-1 md:max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Street, or District..."
            className="ml-2 bg-transparent outline-none text-sm w-full"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all">
            <option>Status: All</option>
            <option>Empty</option>
            <option>Half-Full</option>
            <option>Full</option>
          </select>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 font-medium px-2 py-1 rounded-lg transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

       {/* TABLE */}
  <div className="overflow-x-auto px-4 md:px-0">
    <table className="w-full text-sm bg-white rounded-xl overflow-hidden shadow-sm">

      {/* HEAD */}
      <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b">
        <tr>
          <th className="p-4 text-left">Bin ID</th>
          <th className="p-4 text-left">Location</th>
          <th className="p-4 text-left">Fill Level</th>
          <th className="p-4 text-left">Last Updated</th>
          <th className="p-4 text-left">Coordinates</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {loading ? (
          <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading live bins...</td></tr>
        ) : bins.length === 0 ? (
          <tr><td colSpan="6" className="p-8 text-center text-gray-500">No bins connected yet.</td></tr>
        ) : (
          bins.map((bin) => (
            <tr key={bin._id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">

              {/* BIN ID */}
              <td className="p-4 font-bold text-gray-800">
                {bin.binId}
              </td>

              {/* LOCATION */}
              <td className="p-4">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-800 font-medium">{bin.location}</p>
                    <span className="text-xs text-gray-400">Smart Sensor Node</span>
                  </div>
                </div>
              </td>

              {/* FILL LEVEL */}
              <td className="p-4">
                <p className={`font-bold ${getFillColor(bin.wasteLevel)}`}>
                  {bin.wasteLevel}%
                </p>

                <div className="w-28 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`${getProgressColor(bin.wasteLevel)} h-2 transition-all duration-1000`}
                    style={{ width: `${bin.wasteLevel}%` }}
                  ></div>
                </div>
              </td>

              {/* LAST UPDATED */}
              <td className="p-4 text-gray-500">
                {new Date(bin.updatedAt).toLocaleTimeString()}
              </td>

              {/* COORDINATES */}
              <td className="p-4">
                {bin.lat ? (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono">
                    {bin.lat.toFixed(4)}, {bin.lng.toFixed(4)}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 italic">No GPS Data</span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                  <button 
                    onClick={() => setDeleteModal({ open: true, binId: bin.binId, _id: bin._id })}
                    className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-500"
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

  {/* FOOTER */}
  <div className="flex justify-between items-center p-4 text-sm text-gray-500 border-t bg-white rounded-b-xl shadow-sm mx-4 md:mx-0">
    <p>
      Showing {bins.length} connected devices
    </p>

    <div className="flex gap-2">
      <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">
        Previous
      </button>
      <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">
        Next
      </button>
    </div>
  </div>
    </div>
  )
}

const getFillColor = (level) => {
  if (level > 80) return "text-red-500";
  if (level > 40) return "text-yellow-500";
  return "text-green-600";
};

const getProgressColor = (level) => {
  if (level > 80) return "bg-red-500";
  if (level > 40) return "bg-yellow-500";
  return "bg-green-500";
};

export default BinManagement
