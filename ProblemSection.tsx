import React from 'react';

interface ProblemCardProps {
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ title, description }) => (
  <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg text-left flex flex-col items-start space-y-4">
    <div className="w-10 h-10 bg-[#ECC94B] rounded-full flex items-center justify-center text-white font-bold text-xl">
      &#x2713; {/* Checkmark icon */}
    </div>
    <h3 className="text-2xl font-bold text-[#1A202C]">{title}</h3>
    <p className="text-lg text-[#4A5568]">{description}</p>
  </div>
);

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: 'Manual expense tracking leads to disputes and errors',
      description:
        'Traditional methods using notes or spreadsheets are time-consuming and prone to human error.',
    },
    {
      title: 'Existing apps are feature-heavy and complex',
      description:
        'Most solutions require account creation, constant connectivity, or include advertisements and premium subscriptions.',
    },
    {
      title: 'Need for simplicity in short-term travel',
      description:
        'Students and casual travelers need a quick, reliable tool without a steep learning curve.',
    },
  ];

  const currentSolutionsFallShort = [
    'Overloaded with irrelevant features',
    'Complex and time-consuming setup',
    'Require constant connectivity',
    'Include advertisements',
    'Often need paid upgrades',
    'May require sharing personal banking details',
  ];

  return (
    <section id="problems" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6AD55] text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#1A202C]">The Problem</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between bg-white rounded-lg shadow-xl p-8 md:p-12">
          <div className="md:w-1/2 text-left text-[#1A202C] mb-8 md:mb-0 md:pr-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Current Solutions Fall Short</h3>
            <ul className="list-disc list-inside space-y-3 text-lg">
              {currentSolutionsFallShort.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p className="mt-6 text-xl text-[#4A5568]">
              Many users abandon these tools and return to manual methods, reintroducing the same problems of inaccuracy and inefficiency.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <img
              src="https://picsum.photos/400/400?random=2"
              alt="Person frustrated with phone app"
              className="w-full max-w-sm h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="mt-8 text-right text-xs text-[#1A202C]">
          Made with GAMMA
        </div>
      </div>
    </section>
  );
};
