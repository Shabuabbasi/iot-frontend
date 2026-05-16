import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons
const getIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = getIcon('red');
const yellowIcon = getIcon('yellow');
const greenIcon = getIcon('green');

const containerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: '1rem'
};

// Default center (Islamabad, Pakistan)
const center = [33.6844, 73.0479];

// Component to handle map center updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const RoutesMap = () => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/waste/all");
        // Filter only bins that have coordinates
        const locatedBins = response.data.data.filter(bin => bin.lat && bin.lng);
        setBins(locatedBins);
      } catch (error) {
        console.error("Error fetching map bins:", error);
      }
    };

    fetchBins();
    const interval = setInterval(fetchBins, 10000); // Refresh map every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="Routes Map"
        subtitle="Track live bin locations and status across the city (Powered by OpenStreetMap)"
      />

      <div className="p-4">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <MapContainer 
            center={bins.length > 0 ? [bins[0].lat, bins[0].lng] : center} 
            zoom={12} 
            style={containerStyle}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {bins.length > 0 && (
               <ChangeView center={[bins[0].lat, bins[0].lng]} zoom={12} />
            )}

            {bins.map((bin) => (
              <Marker
                key={bin._id}
                position={[bin.lat, bin.lng]}
                icon={bin.wasteLevel > 80 ? redIcon : bin.wasteLevel > 40 ? yellowIcon : greenIcon}
                eventHandlers={{
                  click: () => setSelectedBin(bin),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-gray-800">{bin.binId}</h3>
                    <p className="text-xs text-gray-600 mb-2">{bin.location}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bin.wasteLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${bin.wasteLevel}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{bin.wasteLevel}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="mt-4 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase font-bold">Operational Bins</p>
          <h3 className="text-xl font-bold">{bins.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-xs text-gray-500 uppercase font-bold">Critical (Full)</p>
          <h3 className="text-xl font-bold">{bins.filter(b => b.wasteLevel > 80).length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase font-bold">Latest Update</p>
          <h3 className="text-sm font-medium">{bins.length > 0 ? new Date(bins[0].updatedAt).toLocaleTimeString() : 'N/A'}</h3>
        </div>
      </div>
    </div>
  );
};

export default RoutesMap;
