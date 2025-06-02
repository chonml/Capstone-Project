import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapFlyTo = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 15, { duration: 2 });
    }
  }, [lat, lon, map]);
  return null;
};

const CrimeMap = ({ location, crimes }) => {
  if (!location) return null;

  return (
  <div className="flex flex-col items-center mt-20 px-4">
  <h2 className="font-bold text-gray-800 mb-6 text-center text-white text-6xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'}}>
    Crime Within The Area
  </h2>

  <div className="w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-md">
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={15}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lon]} icon={redIcon}>
        <Popup className="custom-popup">Query Location</Popup>
      </Marker>
      <MapFlyTo lat={location.lat} lon={location.lon} />
      {crimes.map((crime, idx) => (
        <Marker key={idx} position={[crime.LAT, crime.LON]}>
          <Popup>{crime.description || "Unknown crime"}</Popup>
        </Marker>
      ))}
      <Circle
        center={[location.lat, location.lon]}
        radius={1609.34}
        pathOptions={{
            color: '#3b82f6',    
            fillColor: '#3b82f6',   
            fillOpacity: 0.15        
        }}
        />
    </MapContainer>
    </div>
  </div>

  );
};

export default CrimeMap;
