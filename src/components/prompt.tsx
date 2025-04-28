// prompt.tsx
import React, { useState } from 'react';

const Prompt = ({ onQuerySubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onQuerySubmit(query);  // Send query up to parent
    setQuery('');  // Clear input field
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
      </div>
    </section>
  );
};

export default Prompt;
