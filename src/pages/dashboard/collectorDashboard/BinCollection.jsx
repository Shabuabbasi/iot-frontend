import React, { useState, useEffect } from 'react';
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";
import { CheckCircle, Clock, MapPin, BarChart3, TrendingUp } from "lucide-react";

const BinCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTodayCollections = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/tasks/collector/${user.id}`);
        
        // Filter for completed tasks from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const filtered = (res.data.tasks || []).filter(task => {
          if (task.status !== "Completed" || !task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate >= today;
        });

        setCollections(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setLoading(false);
      }
    };

    if (user.id) fetchTodayCollections();
  }, [user.id]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-12">
      <DashboardHeader 
        title="Operation Tracking" 
        subtitle="Monitor your real-time waste collection efficiency" 
      />
      
      <div className="px-8 -mt-6">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                 <CheckCircle size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bins Collected</p>
                 <h2 className="text-3xl font-black text-slate-800">{collections.length}</h2>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                 <Clock size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Time/Bin</p>
                 <h2 className="text-3xl font-black text-slate-800">14 min</h2>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                 <TrendingUp size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Status</p>
                 <h2 className="text-3xl font-black text-slate-800">{collections.length >= 5 ? "Achieved" : "On Track"}</h2>
              </div>
           </div>
        </div>

        {/* LIST SECTION */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest text-sm">Today's Journey Log</h3>
               <p className="text-xs text-slate-400 font-medium mt-1">Verified collections for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
               <BarChart3 size={14} /> Performance Sync: Live
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-green-500 rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retrieving Logs...</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-200">
                  <CheckCircle size={40} />
               </div>
               <h4 className="text-slate-800 font-black uppercase tracking-widest text-sm">No Collections Yet</h4>
               <p className="text-slate-400 text-xs mt-2">Finish your first task to see your progress here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-6 rounded-3xl border border-slate-50 bg-white hover:border-green-100 hover:shadow-lg hover:shadow-green-50/50 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center group-hover:bg-green-50 transition-colors">
                         <span className="text-[10px] font-black text-slate-400 group-hover:text-green-500 uppercase">Bin</span>
                         <span className="text-sm font-black text-slate-800 uppercase">{task.binId}</span>
                      </div>
                      <div>
                         <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
                            <MapPin size={14} className="text-slate-400" />
                            {task.location}
                         </div>
                         <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                               <Clock size={12} /> {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-black uppercase">Verified</span>
                         </div>
                      </div>
                   </div>
                   <div className="hidden md:block text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                         Completed
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinCollection;
