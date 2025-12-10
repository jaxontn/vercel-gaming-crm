'use client';

import React from 'react';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-violet-500/30">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Gamify Your Growth?
          </h2>
          <p className="text-violet-100 text-lg md:text-xl mb-10">
            Start your free 14-day trial today. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-violet-900 hover:bg-gray-100 hover:shadow-xl shadow-lg"
            >
              Get Started for Free
            </Link>
            <button className="px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-violet-400 text-white hover:bg-violet-700 hover:border-violet-500">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
