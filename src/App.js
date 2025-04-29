// App.js
import React, { useState } from 'react';
import Prompt from './components/prompt.tsx';
import Summary from './components/summary.tsx';
import About from './components/about.tsx';

const App = () => {
  const [queryResult, setQueryResult] = useState('');

  const handleQuerySubmit = async (query) => {
    try {
      const response = await fetch('http://localhost:8000/summarize_area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: query }),
      });

      const data = await response.json();
      setQueryResult(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setQueryResult('Failed to fetch summary. Please try again.');
    }
  };

  return (
    <div className="font-sans text-gray-900">
      <Prompt onQuerySubmit={handleQuerySubmit} />
      <Summary queryResult={queryResult} />
      <About />
    </div>
  );
};

export default App;

