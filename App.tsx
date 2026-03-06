import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { TeamSection } from './components/TeamSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage'; // Import the new LoginPage

const App: React.FC = () => {
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleShowLoginPage = () => {
    setShowLoginPage(true);
  };

  const handleHideLoginPage = () => {
    setShowLoginPage(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={handleShowLoginPage} /> {/* Pass the handler to Header */}
      <main className="flex-grow">
        {showLoginPage ? (
          <LoginPage onLogin={handleHideLoginPage} onGoBack={handleHideLoginPage} />
        ) : (
          <>
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <TeamSection />
            <section id="app-features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#1A202C]">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#3A4A3B]">Get Started with Splitting!</h2>
                <ExpenseSplitter />
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;