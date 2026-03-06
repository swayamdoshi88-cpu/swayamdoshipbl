import React from 'react';

interface SolutionPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SolutionPoint: React.FC<SolutionPointProps> = ({ icon, title, description }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="text-4xl text-[#F6AD55] flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-2xl font-bold mb-2 text-[#1A202C]">{title}</h3>
      <p className="text-lg text-[#4A5568]">{description}</p>
    </div>
  </div>
);

export const SolutionSection: React.FC = () => {
  return (
    <section id="solution" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5F1] text-[#333]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#1A202C]">Our Solution: Trip Expense Splitter</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Solution Points */}
          <div className="space-y-8">
            <SolutionPoint
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              }
              title="Accessible"
              description="Mobile-friendly web interface compatible across devices without requiring installations."
            />
            <SolutionPoint
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              }
              title="Minimal"
              description="Clean, intuitive layout focused exclusively on essential functions of expense tracking."
            />
            <SolutionPoint
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v4m0-4a2 2 0 100-4m0 4h-6m6 0h6m6 0a2 2 0 100-4m0 4h-6M9 17L3 9m2 9l4-4"></path>
                </svg>
              }
              title="Accurate"
              description="Instant calculation of individual balances showing exactly who owes what."
            />
          </div>

          {/* Right: App Mockup Image */}
          <div className="flex justify-center items-center p-8 bg-[#1A202C] rounded-lg shadow-xl md:p-12">
            <div className="relative w-full max-w-md h-[600px] bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border-[10px] border-gray-900">
              {/* Phone notch/camera */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
              {/* Screen content */}
              <div className="absolute inset-[10px] rounded-[2rem] bg-orange-600 flex flex-col p-4 text-white">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17 9.5a.5.5 0 00-.5-.5h-13a.5.5 0 000 1h13a.5.5 0 00.5-.5zM17 12a.5.5 0 00-.5-.5H3a.5.5 0 000 1h13a.5.5 0 00.5-.5zM17 14.5a.5.5 0 00-.5-.5H3a.5.5 0 000 1h13a.5.5 0 00.5-.5z"></path></svg>
                    <span>&#128246;</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <button className="p-2 rounded-full bg-orange-500 hover:bg-orange-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <span className="text-xl font-bold">Total Expenses</span>
                  <button className="p-2 rounded-full bg-orange-500 hover:bg-orange-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                </div>

                <div className="flex items-baseline justify-center text-6xl font-bold mb-2">
                  <span>£</span>10,5.00
                </div>
                <div className="text-center text-lg mb-8">
                  <span>$</span>145.00
                </div>

                <div className="flex-grow flex flex-col space-y-4">
                  <div className="bg-orange-500 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">100</div>
                      <div>
                        <p className="text-sm font-semibold">Fapm Date</p>
                        <p className="text-xs text-gray-200">Nowave to Path sa</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">074</span>
                  </div>
                  <div className="bg-orange-500 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-sm font-bold">€4.00</div>
                      <div>
                        <p className="text-sm font-semibold">Expense expense.</p>
                        <p className="text-xs text-gray-200">Splirieed Diatrcit,</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-right text-xs text-[#718096]">
          Made with GAMMA
        </div>
      </div>
    </section>
  );
};
