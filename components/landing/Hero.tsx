'use client';

import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-50/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wide mb-8 shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Trusted by 10,000+ Merchants
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Turn QR Scans <br/>
              Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600">Customer Data</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Gamified QR campaigns that customers <span className="text-gray-900 font-semibold">love to scan</span>. Collect names, phones, and Instagram handles through <span className="text-gray-900 font-semibold underline decoration-violet-300 decoration-2 underline-offset-2">6 addictive games</span>. Build loyalty with points and leaderboards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/50 hover:-translate-y-1"
              >
                Start Free Trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <button className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 hover:border-violet-200 shadow-md hover:bg-gray-50">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Watch 2 min Demo
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200/60 pt-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-gray-900">25M+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Games Played</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg Conversion</p>
              </div>
            </div>
          </div>

          {/* Visual Content - Floating Elements */}
          <div className="flex-1 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000">

             {/* Main Dashboard Card */}
             <div className="relative z-20 w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-float transform rotate-y-12">
               <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                 {/* Header */}
                 <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="text-xs font-mono text-gray-400">levelup-dashboard.com</div>
                 </div>
                 {/* Body */}
                 <div className="p-6">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$124,592</p>
                      </div>
                      <span className="text-green-500 bg-green-50 px-2 py-1 rounded text-xs font-bold">+12.5%</span>
                    </div>
                    {/* Graph Simulation */}
                    <div className="h-24 flex items-end justify-between gap-1 mb-6">
                      {[40, 60, 45, 70, 65, 85, 80, 95, 75, 90].map((h, i) => (
                        <div key={i} className="w-full bg-violet-100 rounded-t-sm relative group">
                          <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t-sm transition-all duration-1000 group-hover:opacity-80"></div>
                        </div>
                      ))}
                    </div>
                    {/* Active Campaign Row */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">🎡</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Summer Spin</p>
                        <p className="text-xs text-gray-500">1,204 Players Active</p>
                      </div>
                      <button className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-md">View</button>
                    </div>
                 </div>
               </div>
             </div>

             {/* Phone Overlay */}
             <div className="absolute -right-4 bottom-12 z-30 w-48 rounded-[2rem] bg-gray-900 border-4 border-gray-800 shadow-2xl overflow-hidden animate-float-delayed">
               <div className="relative h-80 bg-gradient-to-br from-violet-600 to-indigo-700 p-4 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-1 bg-gray-700 rounded-full absolute top-3"></div>
                 <div className="w-20 h-20 bg-white/20 rounded-full backdrop-blur-md mb-4 flex items-center justify-center text-4xl shadow-lg border border-white/30">
                   🎁
                 </div>
                 <h4 className="text-white font-bold text-lg mb-1">You Won!</h4>
                 <p className="text-violet-200 text-xs mb-4">20% Off Coupon</p>
                 <button className="w-full bg-white text-violet-900 text-xs font-bold py-2 rounded-full shadow-lg">Redeem Now</button>

                 {/* Confetti particles */}
                 <div className="absolute top-10 left-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
                 <div className="absolute top-20 right-4 w-2 h-2 bg-pink-400 rounded-full"></div>
                 <div className="absolute bottom-20 left-10 w-2 h-2 bg-cyan-400 rounded-full"></div>
               </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
