import React, { useState } from 'react';

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "#app-features", label: "Home" }, // Changed href to point to the main app section
  ];

  const handleLoginClick = () => {
    onLoginClick(); // Call the prop function to show the login page
    closeMobileMenu(); // Close mobile menu if open
  };

  return (
    <header className="bg-[#1A202C] text-[#F8F5F1] shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#app-features" className="text-2xl font-bold text-gradient-to-r from-[#9F7AEA] to-[#ED64A6]" onClick={closeMobileMenu}>
          Trip Expense Splitter
        </a>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#F6AD55] transition duration-300">
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 bg-[#6B46C1] text-white rounded-md hover:bg-[#553C9A] transition duration-300"
            aria-label="Login"
          >
            Login
          </button>
        </div>
        {/* Mobile menu icon (hamburger) */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={handleLoginClick}
            className="px-3 py-1 bg-[#6B46C1] text-white text-sm rounded-md hover:bg-[#553C9A] transition duration-300"
            aria-label="Login"
          >
            Login
          </button>
          <button
            onClick={toggleMobileMenu}
            className="text-[#F8F5F1] hover:text-[#F6AD55] focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#1A202C] bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="main-menu-button"
        >
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 text-[#F8F5F1] hover:text-[#F6AD55] focus:outline-none"
            aria-label="Close navigation menu"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => { closeMobileMenu(); /* For Home link, scroll is handled by href */ }}
              className="text-3xl font-bold text-[#F8F5F1] hover:text-[#F6AD55] transition duration-300 py-2"
              role="menuitem"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLoginClick}
            className="text-3xl font-bold px-6 py-3 bg-[#6B46C1] text-white rounded-md hover:bg-[#553C9A] transition duration-300"
            role="menuitem"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
};