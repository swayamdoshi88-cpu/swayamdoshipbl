import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative flex flex-col md:flex-row items-center justify-center min-h-[70vh] md:min-h-screen bg-[#F8F5F1] text-[#333] overflow-hidden">
      {/* Left Text Content */}
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-[#1A202C] leading-tight">
          Trip Expense Splitter
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-4 text-[#4A5568]">
          A Project-Based Learning Initiative by BSc Computer Science Students
        </p>
        <p className="text-md md:text-lg text-[#718096]">
          Team Leader: Rushikesh Gadekar | 2025-2026
        </p>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 min-h-[30vh] md:min-h-full bg-[#1A202C] relative overflow-hidden flex items-center justify-center">
        <img
          src="https://picsum.photos/1200/800?random=1"
          alt="Illustration of friends splitting expenses"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A202C] via-transparent to-transparent opacity-80 md:opacity-0"></div>
        <div className="absolute bottom-4 right-4 text-[#F8F5F1] text-xs px-2 py-1 rounded-md bg-black bg-opacity-50">
          Made with GAMMA
        </div>
      </div>
    </section>
  );
};
