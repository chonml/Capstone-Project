// about.tsx
import React from 'react';

const About = () => {
  return (
    <section className="bg-indigo-100 py-10 px-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">About Us</h3>
        <p className="text-lg text-gray-600 mb-8">Meet the team that worked on this project.</p>
        <div className="flex justify-center space-x-6">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Trisha Siva</p>
            <p className="text-gray-600">Title</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 2"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Jonathan Darius</p>
            <p className="text-gray-600">Title</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Dylan Vuong</p>
            <p className="text-gray-600">Title</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Kushal Tirupathi</p>
            <p className="text-gray-600">Title</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Joel Castillo-Pinto</p>
            <p className="text-gray-600">Title</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
