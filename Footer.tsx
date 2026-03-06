import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A202C] text-[#F8F5F1] py-8 text-center text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} Trip Expense Splitter. All rights reserved.</p>
        <p className="mt-2">Made with <span className="text-red-500">♥</span> by BSc Computer Science Students | Project-Based Learning Initiative</p>
        <p className="mt-1">Team Leader: Rushikesh Gadekar | 2025-2026</p>
      </div>
    </footer>
  );
};
