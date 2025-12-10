export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Games', href: '#games' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const FEATURES: Feature[] = [
  {
    id: 'qr-campaigns',
    title: 'QR Code Campaigns',
    description: 'Create trackable QR code campaigns with one-time use validation. Monitor scans, conversions, and ROI in real-time.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    color: 'text-blue-500 bg-blue-50',
  },
  {
    id: 'games',
    title: '6 Interactive Games',
    description: 'Engage customers with Spin & Win, Color Match, Lucky Dice, Memory Match, Quick Tap, and Word Puzzle. Mix luck, skill, and puzzle challenges.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-purple-500 bg-purple-50',
  },
  {
    id: 'loyalty',
    title: 'Loyalty Points Engine',
    description: 'Reward customers with points per game. Build loyalty programs with rewards catalog, redemption tracking, and tier progression.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-pink-500 bg-pink-50',
  },
  {
    id: 'leaderboards',
    title: 'Leaderboards & Achievements',
    description: 'Drive competition with real-time leaderboards (daily/weekly/all-time). Unlock badges and challenge milestones for viral engagement.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'text-yellow-500 bg-yellow-50',
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    description: 'Track QR scans, game conversions, customer acquisition cost, and ROI. Segment customers by engagement level and behavior.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-green-500 bg-green-50',
  },
  {
    id: 'data-collection',
    title: 'First-Party Data Capture',
    description: 'Collect customer names, phones, and Instagram handles through fun gameplay. GDPR-compliant with privacy-first design.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'text-indigo-500 bg-indigo-50',
  },
];

export interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: string;
  avgEngagement: string;
}

export const GAMES: Game[] = [
  {
    id: 'spin-win',
    name: 'Spin & Win',
    description: 'Classic wheel of fortune! Spin for instant prizes and bonus points. Every spin is a chance to win big.',
    category: 'Luck',
    icon: '🎰',
    difficulty: 'Easy',
    avgEngagement: '88%'
  },
  {
    id: 'color-match',
    name: 'Color Match',
    description: 'Stroop effect game - click the color the text says, not the color it displays. 10 rounds of brain-teasing fun!',
    category: 'Skill',
    icon: '🎨',
    difficulty: 'Medium',
    avgEngagement: '85%'
  },
  {
    id: 'lucky-dice',
    name: 'Lucky Dice',
    description: 'Roll the dice for points! Land doubles for bonus multipliers. 3 rolls to maximize your score.',
    category: 'Luck',
    icon: '🎲',
    difficulty: 'Easy',
    avgEngagement: '78%'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Classic card matching with emoji pairs. Match all 8 pairs in a 4x4 grid with the fewest moves.',
    category: 'Puzzle',
    icon: '🧠',
    difficulty: 'Easy',
    avgEngagement: '72%'
  },
  {
    id: 'quick-tap',
    name: 'Quick Tap',
    description: 'Fast-paced reflex challenge! Tap targets before they disappear. 30 seconds of pure adrenaline.',
    category: 'Speed',
    icon: '👆',
    difficulty: 'Hard',
    avgEngagement: '91%'
  },
  {
    id: 'word-puzzle',
    name: 'Word Puzzle',
    description: 'Unscramble letters to form words. 3 difficulty levels, 15 puzzles, 2 minutes on the clock!',
    category: 'Puzzle',
    icon: '📚',
    difficulty: 'Medium',
    avgEngagement: '68%'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "Bloom Boutique",
    content: "We placed QR codes on receipts and saw 60% of customers scan and play. Collected 2,000+ phone numbers in the first month - our email list grew faster than any promo we've run!",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    metric: "+60% scan rate"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Owner",
    company: "Urban Cafe & Bar",
    content: "The Lucky Dice game is perfect for our happy hour crowd. Customers love competing on the leaderboard. We've seen a 40% increase in repeat visits since launching the campaign.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    metric: "+40% repeat visits"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Head of Growth",
    company: "FitZone Gym",
    content: "The analytics dashboard is incredible. We track which games drive the most sign-ups and adjust our campaigns accordingly. ROI is 3x our previous lead gen tactics.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    metric: "3x ROI"
  }
];

export interface PricingTier {
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 47,
    period: '/month',
    description: 'Perfect for small businesses testing gamification',
    features: [
      'Up to 1,000 QR scans/month',
      'All 6 games included',
      'Basic analytics dashboard',
      '3 active campaigns',
      'Customer data export',
      'Email support'
    ],
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    monthlyPrice: 149,
    annualPrice: 119,
    period: '/month',
    description: 'For growing businesses scaling engagement',
    features: [
      'Up to 10,000 QR scans/month',
      'All 6 games included',
      'Advanced analytics & reporting',
      'Unlimited campaigns',
      'Loyalty points engine',
      'Leaderboards & achievements',
      'Custom branding',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    period: '/month',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited QR scans',
      'All 6 games + custom games',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations (API)',
      'Multi-location support',
      'SLA guarantee',
      'Advanced security & compliance'
    ],
    cta: 'Contact Sales'
  }
];

export const USE_CASES = [
  {
    industry: "Retail Stores",
    description: "Place QR codes on packaging, receipts, or in-store displays. Customers scan, play, and you capture their data for loyalty programs.",
    metric: "+45% customer data collection",
    icon: "🛍️"
  },
  {
    industry: "Restaurants & Bars",
    description: "Table tents, menus, or receipts with QR codes. Gamify the dining experience and build a customer database for promotions.",
    metric: "+60% repeat customers",
    icon: "🍽️"
  },
  {
    industry: "Events & Trade Shows",
    description: "Booth QR codes for instant engagement. Collect leads through gameplay instead of boring forms. Export data to your CRM.",
    metric: "+80% booth engagement",
    icon: "🎪"
  },
  {
    industry: "E-Commerce Brands",
    description: "Include QR codes in product packaging. Drive social media follows through Instagram integration and leaderboard sharing.",
    metric: "+35% Instagram follows",
    icon: "📦"
  },
  {
    industry: "Gyms & Fitness",
    description: "QR codes on equipment or membership cards. Gamify fitness challenges and build community through leaderboards.",
    metric: "+50% member engagement",
    icon: "💪"
  },
  {
    industry: "Coffee Shops",
    description: "Cup sleeves or loyalty cards with QR codes. Replace punch cards with digital points and instant-win games.",
    metric: "+70% loyalty sign-ups",
    icon: "☕"
  }
];
