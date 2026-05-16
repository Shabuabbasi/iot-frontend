import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardHeader from "../../../components/DashboardHeader";

const TasksManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [bins, setBins] = useState([]);
  const [collectors, setCollectors] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState("");
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [activeTab, setActiveTab] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, binsRes, collectorsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/waste/all"),
        axios.get("http://localhost:5000/api/users/collectors")
      ]);

      setTasks(tasksRes.data.tasks || []);
      setBins(binsRes.data.data || []);
      setCollectors(collectorsRes.data.collectors || []);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedBinId || !selectedCollectorId) {
      return toast.error("Please select both a bin and a collector");
    }

    setAssigning(true);
    try {
      await axios.post("http://localhost:5000/api/tasks/assign", {
        binId: selectedBinId,
        collectorId: selectedCollectorId
      });
      toast.success("Task assigned successfully");
      setIsModalOpen(false);
      setSelectedBinId("");
      setSelectedCollectorId("");
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
    } finally {
      setAssigning(false);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => ["Pending", "On the way", "In Progress"].includes(t.status)).length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;

  const filteredTasks = tasks.filter(t => {
    if (activeTab === "All") return true;
    if (activeTab === "Assigned" && t.status === "Pending") return true;
    if (activeTab === "On the way" && t.status === "On the way") return true;
    if (activeTab === "In Progress" && t.status === "In Progress") return true;
    if (activeTab === "Complete" && t.status === "Completed") return true;
    return false;
  });

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <DashboardHeader 
        title="Tasks Management" 
        subtitle="Manage and assign tasks to collectors" 
      />

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Tasks", value: totalTasks },
          { title: "Pending Tasks", value: pendingTasks },
          { title: "Complete Tasks", value: completedTasks },
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

      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Tasks List</h1>
            <p className="text-xs text-gray-500 mt-1">{filteredTasks.length} active tasks found</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex-1 sm:w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="ml-2 text-sm bg-transparent outline-none w-full"
              />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all whitespace-nowrap"
            >
              + Assign new task
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-6 mt-5 border-b overflow-x-auto">
          {["All", "Assigned", "On the way", "In Progress", "Complete"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm whitespace-nowrap ${activeTab === tab ? "font-medium text-[#80A615] border-b-2 border-[#80A615]" : "text-gray-500 hover:text-black"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TASKS TABLE */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium italic">No tasks found in this category.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b">
                  <th className="py-4 px-6">Bin ID</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Collector</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTasks.map(task => (
                  <tr key={task._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                       <span className="text-sm font-black text-slate-800">{task.binId}</span>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-500">{task.location}</td>
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                             {task.collectorId?.name?.charAt(0) || 'C'}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{task.collectorId?.name || "Unassigned"}</span>
                       </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        task.status === "Completed" ? "bg-green-50 text-green-600" :
                        task.status === "Pending" ? "bg-yellow-50 text-yellow-600" :
                        "bg-blue-50 text-blue-600"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase">
                      {new Date(task.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      {task.completedImageUrl ? (
                        <button 
                          onClick={() => setPreviewImage(task.completedImageUrl)}
                          className="text-green-500 hover:text-green-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all hover:gap-2"
                        >
                          View Proof →
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
              >
                 <X size={24} />
              </button>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                 <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Collection Proof Verification</h3>
              </div>
              <div className="relative aspect-video bg-slate-100">
                 <img 
                    src={previewImage.startsWith('http') ? previewImage : `http://localhost:5000${previewImage}`} 
                    className="w-full h-full object-contain" 
                    alt="Proof"
                    onError={(e) => {
                       e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                       toast.error("Failed to load proof image");
                    }}
                 />
              </div>
              <div className="p-6 bg-slate-50 flex justify-center">
                 <button 
                    onClick={() => setPreviewImage(null)}
                    className="px-8 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                 >
                    Close Preview
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Assign New Task</h2>
            
            <form onSubmit={handleAssignTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Bin</label>
                <select 
                  value={selectedBinId}
                  onChange={(e) => setSelectedBinId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-green-500"
                  required
                >
                  <option value="">-- Choose a Bin --</option>
                  {bins.map(bin => (
                    <option key={bin._id} value={bin.binId}>
                      {bin.binId} - {bin.location} (Level: {bin.wasteLevel}%) {bin.wasteLevel > 80 ? '🔴 FULL' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Collector</label>
                <select 
                  value={selectedCollectorId}
                  onChange={(e) => setSelectedCollectorId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-green-500"
                  required
                >
                  <option value="">-- Choose a Collector --</option>
                  {collectors.map(collector => (
                    <option key={collector._id} value={collector._id}>
                      {collector.name} ({collector.email})
                    </option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={assigning}
                className={`w-full text-white font-bold py-3 rounded-xl transition ${
                  assigning ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {assigning ? "Assigning..." : "Assign Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksManagement;
