import React from 'react';
import { TEAM_MEMBERS } from '../constants';

interface TeamMemberProps {
  id: string;
  name: string;
  prn?: string;
  role?: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, prn, role }) => (
  <div className="bg-[#FFFDF9] p-6 rounded-lg shadow-md flex items-center space-x-4 md:space-x-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-[#F6AD55] text-white rounded-full flex items-center justify-center text-lg md:text-xl font-bold">
      {name.charAt(0)}
    </div>
    <div>
      <h3 className="text-xl md:text-2xl font-semibold text-[#1A202C]">{name}</h3>
      {role && <p className="text-[#4A5568] text-sm md:text-base">{role}</p>}
      {prn && <p className="text-[#718096] text-xs md:text-sm">PRN: {prn}</p>}
    </div>
  </div>
);

export const TeamSection: React.FC = () => {
  // Hardcoded PRN and roles for demo purposes, extending from constants
  const fullTeamDetails = [
    { id: 'rushikesh-gadekar', name: 'Rushikesh Gadekar', prn: '1132230783', role: 'Team Leader' },
    { id: 'swayam-doshi', name: 'Swayam Doshi', prn: '1132230931' },
    { id: 'sony-suthar', name: 'Sony Suthar', prn: '1132231323' },
    { id: 'anusha-shete', name: 'Anusha Shete', prn: '1132230814' },
    { id: 'soham-kango', name: 'Soham Kango', prn: '1132230036' },
    { id: 'vivek-gaikwad', name: 'Vivek Gaikwad', prn: '1132231241' },
  ];

  return (
    <section id="team" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5F1] text-[#333]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#1A202C]">The Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fullTeamDetails.map((member) => (
            <TeamMemberCard key={member.id} {...member} />
          ))}
        </div>

        <p className="mt-12 text-center text-lg text-[#4A5568]">
          Third Year BSc Computer Science | School of Computer Science & Engineering
        </p>
        <div className="mt-8 text-right text-xs text-[#718096]">
          Made with GAMMA
        </div>
      </div>
    </section>
  );
};
