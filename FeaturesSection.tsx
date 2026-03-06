import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-[#1A202C]">{title}</h3>
    <p className="text-lg text-[#4A5568]">{description}</p>
  </div>
);

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: '"Settle via UPI/PayPal" Button',
      description:
        'After calculating balances, provide a one-tap settlement link to UPI or PayPal. This makes the app actually usable for real-world travel expense splitting, as it allows users to quickly and easily pay each other back.',
    },
    {
      title: 'Shared To-Do / Packing List (Mini Add-on)',
      description:
        'Along with tracking expenses, allow users to create a simple group checklist for packing, tickets, and other travel tasks. This small but impactful feature helps ensure travelers are prepared and have everything they need.',
    },
    {
      title: 'AI-powered Spending Tips (Tiny ML/AI Touch)',
      description:
        'If a category like "Food" is getting too high compared to the overall trip budget, show a helpful tip: "You\'ve spent 70% of your trip budget on food already. Consider cutting back a bit to stay on track." This adds a "smart app" angle with simple logic to provide intelligent spending guidance.',
    },
    {
      title: 'Integrated Currency Converter',
      description:
        'For international trips, enable automatic currency conversion based on real-time exchange rates, simplifying expense tracking across different currencies and avoiding manual calculations.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5F1] text-[#333]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#1A202C]">Additional Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
          {/* Basic Expense Categorization, spanning full width */}
          <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-[#1A202C]">Basic Expense Categorization</h3>
            <p className="text-lg text-[#4A5568] mt-4">
              Introduce simple categories like "Food," "Transport," "Accommodation," and "Activities" to help users understand spending patterns and identify areas for potential savings during their trip.
            </p>
          </div>
        </div>

        <div className="mt-8 text-right text-xs text-[#718096]">
          Made with GAMMA
        </div>
      </div>
    </section>
  );
};
