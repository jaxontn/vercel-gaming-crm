'use client';

import React from 'react';
import { FEATURES } from '@/lib/landing-constants';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-violet-600 font-bold tracking-wider uppercase text-xs bg-violet-50 px-3 py-1 rounded-full border border-violet-100">Powerful Features</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mt-6 mb-6">
            Everything You Need to <br/>Drive Engagement
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Stop relying on boring email blasts. Transform customer interactions into exciting gamified experiences that drive real revenue.
          </p>
        </div>

        {/* How it works steps - QR Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-gray-200 via-violet-200 to-gray-200 -z-10"></div>

          {[
            { step: '01', title: 'Customer Scans QR', desc: 'Place QR codes on receipts, packaging, or posters.', icon: '📱' },
            { step: '02', title: 'Register & Play', desc: 'One-time data collection, then instant game access.', icon: '🎮' },
            { step: '03', title: 'Earn Points', desc: 'Win points based on game performance and difficulty.', icon: '⭐' },
            { step: '04', title: 'You Get Data', desc: 'Capture names, phones, Instagram in real-time.', icon: '📊' },
          ].map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-center text-4xl mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative">
                {item.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-violet-100 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 rounded-bl-full transition-all duration-500"></div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
