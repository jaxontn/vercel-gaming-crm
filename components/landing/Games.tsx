'use client';

import React from 'react';
import { GAMES } from '@/lib/landing-constants';

const Games: React.FC = () => {
  return (
    <section id="games" className="py-24 bg-gradient-to-br from-violet-50 to-fuchsia-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400 to-fuchsia-600 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-violet-600 font-bold tracking-wider uppercase text-xs bg-white px-3 py-1 rounded-full border border-violet-100 shadow-sm">6 Addictive Games</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mt-6 mb-6">
            Choose Your <br/>Customer&apos;s Adventure
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            From wheel-spinning luck to brain-teasing puzzles. Every game captures customer data while delivering pure entertainment.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GAMES.map((game, idx) => (
            <div
              key={game.id}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 h-full flex flex-col">

                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-6xl">{game.icon}</div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700">
                      {game.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{game.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {game.description}
                </p>

                {/* Engagement Metric */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Avg Engagement</span>
                  <span className="text-2xl font-bold text-violet-600">{game.avgEngagement}</span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 rounded-3xl transition-all duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">
            Mix and match games for different campaigns. Track which games drive the most conversions.
          </p>
          <button className="px-8 py-4 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transform">
            See Games in Action
          </button>
        </div>
      </div>
    </section>
  );
};

export default Games;
