import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import DashboardHeader from "../../../components/DashboardHeader";
import axios from "axios";

const containerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479
};

const RoutesMap = () => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/waste/all`);
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

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getMarkerIcon = (wasteLevel) => {
    let color = wasteLevel > 80 ? 'red' : wasteLevel > 40 ? 'yellow' : 'green';
    return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="Routes Map"
        subtitle="Track live bin locations and status across the city (Powered by Google Maps)"
      />

      <div className="p-4">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={bins.length > 0 ? { lat: bins[0].lat, lng: bins[0].lng } : defaultCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{ disableDefaultUI: false }}
            >
              {bins.map((bin) => (
                <MarkerF
                  key={bin._id}
                  position={{ lat: bin.lat, lng: bin.lng }}
                  icon={getMarkerIcon(bin.wasteLevel)}
                  onClick={() => setSelectedBin(bin)}
                />
              ))}

              {selectedBin && (
                <InfoWindowF
                  position={{ lat: selectedBin.lat, lng: selectedBin.lng }}
                  onCloseClick={() => setSelectedBin(null)}
                >
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-gray-800">{selectedBin.binId}</h3>
                    <p className="text-xs text-gray-600 mb-2">{selectedBin.location}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${selectedBin.wasteLevel > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${selectedBin.wasteLevel}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{selectedBin.wasteLevel}%</span>
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center w-full" style={{ height: '70vh' }}>
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 bg-green-500 rounded-full mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Google Maps...</p>
              </div>
            </div>
          )}
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
