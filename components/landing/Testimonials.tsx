'use client';

import React from 'react';
import { TESTIMONIALS } from '@/lib/landing-constants';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-violet-600 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-violet-600 font-bold tracking-wider uppercase text-xs bg-violet-50 px-3 py-1 rounded-full border border-violet-100">Success Stories</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mt-6 mb-6">
            Loved by Businesses <br/>Across Industries
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            See how merchants are using gamified QR campaigns to capture leads and build loyalty.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-white hover:border-violet-100 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="text-violet-600 mb-6">
                <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>

              {/* Content */}
              <p className="text-gray-700 text-base leading-relaxed mb-6 flex-grow">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Metric Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {testimonial.metric}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-gray-400">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
