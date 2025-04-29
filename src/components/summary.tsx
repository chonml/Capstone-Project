// summary.tsx
import React from 'react';

const Summary = ({ queryResult }) => {
  return (
    <section className="bg-white py-10 px-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Location Summary</h3>
        {queryResult ? (
          <>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
              <pre className="text-md font-arial text-gray-800 whitespace-pre-wrap break-words">{queryResult}</pre>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">No results yet. Please enter a query above.</p>
        )}
      </div>
    </section>
  );
};

export default Summary;
