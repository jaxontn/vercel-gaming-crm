'use client';

import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Merchants', value: '10,000+', icon: '👥' },
    { label: 'QR Scans', value: '50M+', icon: '📱' },
    { label: 'Games Played', value: '25M+', icon: '🎮' },
    { label: 'Avg Boost', value: '15%', icon: '📈', highlight: true },
  ];

  return (
    <section className="relative -mt-10 z-20 container mx-auto px-6">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-8 shadow-2xl shadow-violet-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`text-center ${idx !== stats.length - 1 ? 'md:border-r border-white/20' : ''}`}>
               <div className="text-3xl mb-2">{stat.icon}</div>
               <div className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
               <div className={`text-sm md:text-base font-medium ${stat.highlight ? 'text-green-300' : 'text-purple-100'}`}>
                 {stat.label}
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
