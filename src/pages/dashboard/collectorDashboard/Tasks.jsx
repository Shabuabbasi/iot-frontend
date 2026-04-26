import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

import DashboardHeader from "../../../components/DashboardHeader";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 24.8607,
  lng: 67.0011,
};

const Tasks = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAP_API_KEY",
  });

  const [tasks] = useState([
    {
      id: 1,
      location: "Bin A - Clifton",
      lat: 24.8138,
      lng: 67.0305,
      level: "80%",
      status: "Pending",
    },
    {
      id: 2,
      location: "Bin B - Saddar",
      lat: 24.8562,
      lng: 67.0011,
      level: "60%",
      status: "Completed",
    },
    {
      id: 3,
      location: "Bin C - DHA",
      lat: 24.8051,
      lng: 67.0308,
      level: "90%",
      status: "Pending",
    },
  ]);

  const [selected, setSelected] = useState(null);

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      <p className="ml-3 text-gray-600 font-medium">Loading map...</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="My Tasks" 
        subtitle="Manage and view your assigned collection points" 
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task List */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Assigned Collection Points
          </h2>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <p className="text-gray-500">No Tasks Assigned 🎉</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelected(task)}
                  className={`p-4 rounded-xl cursor-pointer border transition ${
                    selected?.id === task.id
                      ? "bg-green-100 border-green-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {task.location}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "Pending"
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Waste Level: {task.level}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Section */}
        {!selected ? (
          // Empty Map State
          <div className="bg-white shadow-md rounded-2xl p-5 h-[500px] flex items-center justify-center">
            <p className="text-gray-400">
              Select a task to view location on map 📍
            </p>
          </div>
        ) : (
          // Map when task selected
          <div className="bg-white shadow-md rounded-2xl p-5 h-[500px] overflow-hidden">
            <h2 className="text-xl font-semibold mb-3 text-center">
              {selected.location}
            </h2>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={15}
              center={{ lat: selected.lat, lng: selected.lng }}
            >
              {/* Custom Marker */}
              <Marker
                position={{ lat: selected.lat, lng: selected.lng }}
                icon={{
                  url:
                    selected.status === "Pending"
                      ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              />

              {/* Info Window */}
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <h3 className="font-semibold">{selected.location}</h3>
                  <p>Level: {selected.level}</p>
                  <p
                    className={
                      selected.status === "Pending"
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {selected.status}
                  </p>
                </div>
              </InfoWindow>
            </GoogleMap>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
