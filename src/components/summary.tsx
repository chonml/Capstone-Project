import React from 'react';

const Summary = ({ queryResult }) => {
  return (
    <section className="flex items-center justify-center mt-10">
      <div className="mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg max-w-4xl p-10">
        <h3 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-md">
          AI Location Summary
        </h3>

        {queryResult ? (
          <div className="space-y-2 text-white text-lg leading-relaxed font-sans">
            {queryResult.split('\n').map((line, idx) => (
              <p key={idx} className="drop-shadow-md ">{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-300 text-center">No results yet. Please enter a query above.</p>
        )}
      </div>
    </section>

  );
};

export default Summary;
