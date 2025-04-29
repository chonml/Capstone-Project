// prompt.tsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const MapFlyTo = ({ lat, lon }) => {
  const map = useMap();

  React.useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 15, {
        duration: 2, // 2 second smooth fly
      });
    }
  }, [lat, lon, map]);

  return null;
};

const Prompt = ({ onQuerySubmit }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);  // { lat: number, lon: number }

  const handleSubmit = async (e) => {
    e.preventDefault();
    onQuerySubmit(query);

    // Geocode the query
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.length > 0) {
      setLocation({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      });
    } else {
      alert('Location not found!');
      setLocation(null);
    }

    const response_prompt = await fetch('http://localhost:8000/summarize_area', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: query }),
    });

    const data_prompt = await response_prompt.json();

    onQuerySubmit(data_prompt.summary);  // <--- assuming you passed down a function to handle it

    setQuery('');
  };

  return (
    <section className="bg-gray-100 py-10 px-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">LA Crimes Analysis</h2>
        <p className="text-lg text-gray-600 mb-8">
          Enter a prompt to analyze crime data in Los Angeles with the help of AI.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Analyze
          </button>
        </form>

        {/* Show the map if a location is found */}
        {location && (
          <div className="mt-10">
            <MapContainer
              center={[location.lat, location.lon]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lon]}>
                <Popup>
                  {query}
                </Popup>
              </Marker>
              <MapFlyTo lat={location.lat} lon={location.lon} />
            </MapContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default Prompt;
