import React, { useState, useEffect } from "react";
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import { CheckCircle2, Clock, Trash2, TrendingUp } from "lucide-react";

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const collectorId = user?.id || user?._id;
        if (!collectorId) return;

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/collector/${collectorId}`);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.length - completed;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <DashboardHeader 
        title="Reports & Analytics" 
        subtitle="View your performance reports and collection stats" 
      />
      
      <div className="px-6 md:px-8 mt-6">
        {loading ? (
          <p className="text-gray-500 font-medium">Loading your stats...</p>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard icon={<Trash2 className="text-blue-500" />} label="Total Assignments" value={tasks.length} />
              <MetricCard icon={<CheckCircle2 className="text-green-500" />} label="Completed" value={completed} />
              <MetricCard icon={<Clock className="text-yellow-500" />} label="Pending" value={pending} />
              <MetricCard icon={<TrendingUp className="text-purple-500" />} label="Completion Rate" value={`${completionRate}%`} />
            </div>

            {/* Recent Collections List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Recent Collections</h3>
              {completed === 0 ? (
                <div className="text-center py-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Trash2 size={24} />
                   </div>
                   <p className="text-slate-500 text-sm font-medium">No collections completed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.filter(t => t.status === "Completed").slice(0, 5).map(task => (
                    <div key={task._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:border-green-200 transition-colors">
                       <div>
                          <p className="text-sm font-bold text-slate-800">{task.location}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{task.binId}</p>
                       </div>
                       <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                          Completed
                       </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
       {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       <h4 className="text-3xl font-black text-slate-800">{value}</h4>
    </div>
  </div>
);

export default Reports;
