import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import socketService from "../../../services/socketService";
import toast from "react-hot-toast";
import { 
  Navigation, Camera, CheckCircle2, MapPin, Clock, ChevronRight,
  Map as MapIcon, List as ListIcon, Activity, AlertCircle
} from "lucide-react";

const mapContainerStyle = { width: "100%", height: "100%", borderRadius: "1.5rem" };
const defaultCenter = { lat: 33.6844, lng: 73.0479 };

const CollectorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const fileInputRef = useRef(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const collectorLocation = { lat: 33.6844, lng: 73.0479 }; // Hardcoded for now

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const collectorId = user?.id || user?._id;
      if (!collectorId) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/collector/${collectorId}`);
      setTasks(response.data.tasks.map(t => ({
        ...t,
        id: t._id,
        lat: t.lat || defaultCenter.lat,
        lng: t.lng || defaultCenter.lng
      })));
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    socketService.connect();
    socketService.joinRoom("collector");
    socketService.on("taskAssigned", (task) => {
      toast.success("New task assigned! 🚚", { duration: 5000, position: "top-center" });
      fetchTasks();
    });
    return () => socketService.disconnect();
  }, []);

  // When a task is selected, clear existing directions so it recalculates
  useEffect(() => {
    setDirectionsResponse(null);
  }, [selected]);

  const handleComplete = async (event) => {
    const file = event.target.files[0];
    if (!file || !selected) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setCompleting(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${selected.id}/complete`, formData);
      toast.success("Bin cleared! Great job.");
      fetchTasks();
      setSelected(null);
    } catch (error) {
      toast.error("Upload failed. Try again.");
    } finally {
      setCompleting(false);
    }
  };

  const openInGoogleMaps = (task) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const activeTasksCount = tasks.filter(t => t.status !== "Completed").length;

  const directionsCallback = useCallback((response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirectionsResponse(response);
      } else {
        console.log('Directions request failed due to ' + response.status);
      }
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-slate-800 flex flex-col font-sans">
      
      {/* Header Section */}
      <div className="px-6 py-8 md:px-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Missions</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-2 h-2 rounded-full ${activeTasksCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
             <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
               {activeTasksCount} Active Assignments
             </p>
          </div>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 self-start md:self-auto">
           <button 
             onClick={() => setViewMode("list")} 
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "list" ? "bg-green-500 text-white shadow-md shadow-green-100" : "text-slate-500 hover:bg-slate-50"}`}
           >
             <ListIcon size={18} /> List
           </button>
           <button 
             onClick={() => setViewMode("map")} 
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "map" ? "bg-green-500 text-white shadow-md shadow-green-100" : "text-slate-500 hover:bg-slate-50"}`}
           >
             <MapIcon size={18} /> Map
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 md:px-8 pb-32">
        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>)
            ) : tasks.length === 0 ? (
              <div className="col-span-full h-[50vh] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                    <CheckCircle2 size={40} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900">All Done!</h2>
                 <p className="text-slate-500 text-sm mt-2 max-w-xs">No pending assignments. You can enjoy your break or check back later.</p>
              </div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => { setSelected(task); setViewMode("map"); }}
                  className={`group relative overflow-hidden p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-lg active:scale-[0.98] ${
                    task.status === "Completed" 
                    ? "bg-slate-50 border-slate-100 opacity-80" 
                    : "bg-white border-slate-100 shadow-sm hover:border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${task.status === "Completed" ? "bg-slate-200 text-slate-500" : "bg-green-50 text-green-600"}`}>
                       <MapPin size={20} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      task.status === "Completed" ? "bg-slate-200 text-slate-500" : "bg-green-100 text-green-700"
                    }`}>
                      {task.status}
                    </div>
                  </div>

                  <div>
                     <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1 block">
                        {task.binId}
                     </span>
                     <h3 className="text-lg font-bold text-slate-800 leading-tight truncate">{task.location}</h3>
                     <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                           <Activity size={14} className="text-green-500" />
                           {task.level} Full
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold ml-auto group-hover:text-green-600 transition-colors">
                           Details <ChevronRight size={14} />
                        </div>
                     </div>
                  </div>
                  
                  {task.status === "Completed" && (
                    <div className="absolute top-2 right-2">
                       <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="h-[70vh] w-full relative bg-white rounded-3xl p-2 shadow-sm border border-slate-100 overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selected ? { lat: selected.lat, lng: selected.lng } : defaultCenter}
                zoom={14}
                options={{ disableDefaultUI: false }}
              >
                 {selected && !directionsResponse && (
                   <DirectionsService
                     options={{
                       destination: { lat: selected.lat, lng: selected.lng },
                       origin: collectorLocation,
                       travelMode: 'DRIVING'
                     }}
                     callback={directionsCallback}
                   />
                 )}
                 
                 {directionsResponse && (
                   <DirectionsRenderer
                     options={{
                       directions: directionsResponse,
                       polylineOptions: { strokeColor: "#22c55e", strokeWeight: 6 }
                     }}
                   />
                 )}
                 
                 {!selected && tasks.map(task => (
                   <MarkerF 
                     key={task.id} 
                     position={{ lat: task.lat, lng: task.lng }} 
                     onClick={() => setSelected(task)} 
                   />
                 ))}
              </GoogleMap>
            ) : (
               <div className="flex items-center justify-center w-full h-full">
                 <div className="animate-pulse flex flex-col items-center">
                   <div className="h-8 w-8 bg-green-500 rounded-full mb-4"></div>
                   <p className="text-gray-500 font-medium">Loading Map...</p>
                 </div>
               </div>
            )}
            
            {/* Overlay UI for Map */}
            {selected && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                          <MapPin size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900">{selected.location}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selected.binId} • {selected.level}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelected(null)} 
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                    >
                       <X size={20} />
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => openInGoogleMaps(selected)}
                      className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all active:scale-95"
                    >
                       <Navigation size={18} /> Navigate
                    </button>
                    {selected.status !== "Completed" && (
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-95"
                      >
                         <Camera size={18} /> {completing ? "..." : "Complete"}
                      </button>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
        {viewMode === "list" && !selected && (
          <button className="pointer-events-auto bg-green-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-3 hover:bg-green-600 transition-all active:scale-95">
             <Activity size={24} /> Go Online
          </button>
        )}
      </div>

      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleComplete} />
    </div>
  );
};

const X = ({size}) => <AlertCircle size={size} className="rotate-45" />;

export default CollectorTasks;
