// summary.tsx
import React from 'react';

const Summary = ({ queryResult }) => {
  return (
    <section className="bg-white py-10 px-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Analysis Results</h3>
        <p className="text-lg text-gray-600 mb-6">
          Below are the results based on your query.
        </p>
        {queryResult ? (
          <>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
              <pre className="text-sm text-gray-800">{queryResult}</pre>
            </div>
            <p className="text-lg text-gray-700">
              Summary: {queryResult.length > 200 ? 'Data is extensive and requires further breakdown.' : 'Data is concise and directly relevant.'}
            </p>
          </>
        ) : (
          <p className="text-lg text-gray-600">No results yet. Please enter a query above.</p>
        )}
      </div>
    </section>
  );
};

export default Summary;
