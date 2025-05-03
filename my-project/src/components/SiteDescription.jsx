import React from 'react';

const SiteDescription = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
            Explore the World's Nations
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Discover detailed information about countries worldwide. Compare populations, 
            explore regions, and learn about different cultures - all in one place.
          </p>
          <div className="flex justify-center space-x-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-pulse">
              <h3 className="font-bold text-lg">200+ Countries</h3>
              <p className="text-sm">Comprehensive data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-pulse">
              <h3 className="font-bold text-lg">Real-time Info</h3>
              <p className="text-sm">Up-to-date statistics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-pulse">
              <h3 className="font-bold text-lg">Easy Comparison</h3>
              <p className="text-sm">Compare countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDescription; 