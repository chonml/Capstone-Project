// App.js
import React, { useRef, useState } from 'react';
import Prompt from './components/prompt.tsx';
import Summary from './components/summary.tsx';
import Overall from './components/overall.tsx';
import CrimeMap from './components/CrimeMap.tsx';
import About from './components/about.tsx';

const App = () => {
  const [queryResult, setQueryResult] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbyCrimes, setNearbyCrimes] = useState([]);
  const resultsRef = useRef(null);

  const handleQuery = async (query) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const geoData = await geoRes.json();
      if (!geoData.length) return;

      const coords = {
        lat: parseFloat(geoData[0].lat),
        lon: parseFloat(geoData[0].lon),
      };
      setLocation(coords);

    const crimesRes = await fetch('http://localhost:8000/nearby_crimes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coords),
    });
    const crimesData = await crimesRes.json();
    const crimes = crimesData.crimes || [];
    setNearbyCrimes(crimes);

    const summaryRes = await fetch('http://localhost:8000/summarize_area', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: query,
        crimes: crimes.map((c) => ({
          description: c.description || c.CRM_CD_DESC || "Unknown",
          date: c.date || c.DATE || "Unknown",
        })),
      }),
    });

    const summaryData = await summaryRes.json();
    setQueryResult(summaryData.summary);

      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err) {
      console.error("Error in handleQuery:", err);
    }
  };

  // const handleQuerySubmit = async (query) => {
  //   try {
  //     const response = await fetch('http://localhost:8000/summarize_area', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ address: query }),
  //     });

  //     const data = await response.json();
  //     setQueryResult(data.summary);
  //     setShowResults(true); // Show results after fetch

  //     // Smooth scroll to results section
  //     setTimeout(() => {
  //       resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     }, 200); // slight delay to ensure render
  //   } catch (error) {
  //     console.error('Error fetching summary:', error);
  //     setQueryResult('Failed to fetch summary. Please try again.');
  //   }
  // };

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/294041-3840x2160-desktop-4k-los-angeles-wallpaper.jpg')" }}
    >
      <div className="min-h-screen">
        <Prompt onQuerySubmit={handleQuery} />
        {showResults && (
          <div ref={resultsRef}>
            <CrimeMap location={location} crimes={nearbyCrimes} />
            <Summary queryResult={queryResult} />
            <About />
            <Overall />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

