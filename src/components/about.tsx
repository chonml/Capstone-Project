import React from 'react';

const About = () => {
  return (
    <section className="py-10 px-6">
      <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-10">
        <p className="text-2xl text-white mb-8" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Team Members</p>
        <div className="flex justify-center space-x-40">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Trisha Siva</p>
            <p className="text-white">UI/UX</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 2"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Jonathan Darius</p>
            <p className="text-white">AI/Backend Engineering</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Dylan Vuong</p>
            <p className="text-white">Data Preprocessing</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Kushal Tirupathi</p>
            <p className="text-white">Front-end Components</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold text-white" style = {{textShadow: '2px 2px 4px rgba(0, 0, 0, 6)',}}>Joel Castillo-Pinto</p>
            <p className="text-white">Data Analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
