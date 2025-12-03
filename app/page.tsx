import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="flex min-h-[calc(100vh-5rem)]">
          <div className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
              {/* Hero Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <Image
                    src="/next.svg"
                    alt="Gamified CRM"
                    width={120}
                    height={120}
                    className="mx-auto mb-6"
                  />
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    Welcome to{' '}
                    <span className="text-blue-600 dark:text-blue-400">Gamified</span>
                    {' '}CRM
                  </h1>
                  <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                    Transform your customer engagement with gamified marketing campaigns
                  </p>
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-green-700 transition-colors"
                    >
                      Register Business
                    </Link>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L13 21h8a1 1 0 011-1h-4a1 1 0 011-1z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4v5a1 1 0 00-4H5a2 2 0 00-2h-3a2 2 0 002-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">QR Code Campaigns</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Create gamified marketing experiences with QR codes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 7l7 7 4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11v2a3 3 0 00-6h-2a3 3 0 00-6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 16v-7a2 2 0 00-2h-4a2 2 0 00-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Customer Analytics</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Track engagement, conversions, and ROI
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-2a2 2 0 00-2H7a2 2 0 00-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h2a2 2 0 00-2h-2a2 2 0 00-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Loyalty Programs</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Reward customer loyalty with points and prizes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Join thousands of businesses already using gamified marketing to increase customer engagement and drive growth.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/demo"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      View Demo
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-6 py-3 text-base font-medium text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Platform Statistics
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                      <p className="text-gray-600 dark:text-gray-300">Active Merchants</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">50M+</div>
                      <p className="text-gray-600 dark:text-gray-300">QR Scans</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">25M+</div>
                      <p className="text-gray-600 dark:text-gray-300">Customer Interactions</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">15%</div>
                      <p className="text-gray-600 dark:text-gray-300">Avg Engagement Increase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="lg:col-span-1 lg:col-start-2 mt-12">
              <div className="rounded-lg bg-blue-600 dark:bg-blue-800 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Start Your Gamified Marketing Journey
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Join thousands of businesses leveraging gamification to drive customer engagement and increase revenue.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 px-6 py-3 text-base font-medium text-blue-600 dark:text-white shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="https://github.com/your-repo/gaming-crm"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-md border border border-transparent bg-white dark:bg-gray-800 px-6 py-3 text-base font-medium text-blue-600 dark:text-white shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}