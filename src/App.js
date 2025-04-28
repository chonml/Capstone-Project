// App.js
import React, { useState } from 'react';
import Prompt from './components/prompt.tsx';
import Summary from './components/summary.tsx';
import About from './components/about.tsx';

const App = () => {
  const [queryResult, setQueryResult] = useState('');

  const handleQuerySubmit = (query) => {
    setQueryResult(`Results for query: "${query}". This is a simulated response.`);
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

