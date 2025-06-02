import React, { useState } from 'react';

const Prompt = ({ onQuerySubmit }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      await onQuerySubmit(query);
    } finally {
      setLoading(false);
    }

    onQuerySubmit(query);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center py-10 px-6">
      <div className="text-center max-w-xl pb-50px">
        <div className="flex flex-row items-center justify-center gap-x-4 mb-4">
          <h1 className="text-9xl font-bold text-white shadow-black" style={{
            fontFamily: 'Old London',
            WebkitTextStroke: '.05px black',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}>LA</h1>
          <h1 className="text-5xl font-bold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}> | Crime Database</h1>
          </div>
          <p className="text-2xl text-white mb-12 mt-12" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'}}>
            Enter an address to analyze crime data in Los Angeles with the help of AI (within a 1 mile radius).
          </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto mt-10 rounded-full bg-white/10 backdrop-blur-md overflow-hidden
             hover:shadow-xl transition-shadow duration-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your address here"
            className="flex-grow px-6 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Analyze"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Prompt;
