'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/landing-constants';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const formatPrice = (tier: typeof PRICING_TIERS[0]) => {
    if (tier.monthlyPrice === null) {
      return { price: 'Custom', savings: null };
    }

    const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
    const originalPrice = isAnnual ? tier.monthlyPrice : null;

    // Ensure price is not null before calculation
    if (price === null) {
      return { price: 'Custom', savings: null };
    }

    const savings = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

    return { price: `$${price}`, savings };
  };

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-violet-400 to-fuchsia-600 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-violet-600 font-bold tracking-wider uppercase text-xs bg-violet-50 px-3 py-1 rounded-full border border-violet-100">Transparent Pricing</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mt-6 mb-6">
            Simple Pricing <br/>for Every Business Size
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Start with a 14-day free trial. No credit card required. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                !isAnnual
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => {
            const { price, savings } = formatPrice(tier);

            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/30 scale-105 border-2 border-violet-400'
                    : 'bg-gray-50 border border-gray-200 hover:border-violet-200 hover:shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-end gap-3 mb-4">
                    <span className={`text-5xl font-black ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                      {price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {savings && (
                      <span className={`px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full ${tier.popular ? 'bg-opacity-90' : ''}`}>
                        Save {savings}%
                      </span>
                    )}
                    <span className={tier.popular ? 'text-violet-100' : 'text-gray-500'}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={tier.popular ? 'text-violet-100' : 'text-gray-600'}>
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          tier.popular ? 'text-green-300' : 'text-violet-600'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${tier.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.cta === 'Contact Sales' ? '/contact' : '/register'}
                  className={`block w-full py-3 px-6 rounded-full font-semibold text-center transition-all duration-300 ${
                    tier.popular
                      ? 'bg-white text-violet-900 hover:bg-gray-100 shadow-lg'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-xl hover:-translate-y-1 shadow-lg shadow-violet-500/30'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-4">
            All plans include 14-day free trial • Cancel anytime • No credit card required
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              SOC 2 Certified
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;