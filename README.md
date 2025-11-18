# 🎮 Gamified QR Scanning CRM Platform

A Next.js-based platform that transforms customer data collection into engaging gamified experiences through QR codes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd gaming_crm_nextjs
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Open in Browser**
- **Main Dashboard**: http://localhost:3000/dashboard
- **QR Demo Pages**: http://localhost:3000/play/bella-boutique

## 📱 **Platform Overview**

### For Customers (End Users)
- **Scan QR Code** → **Enter Details** → **Play Games** → **Win Points** → **Climb Leaderboard**

### For Merchants (Business Users)
- **Create QR Campaigns** → **Track Analytics** → **Manage Customer Data** → **Drive Sales**

## 🛠️ **Technical Stack**

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Tabler Icons React
- **Styling**: Tailwind CSS with responsive design
- **TypeScript**: Full type safety throughout

### Key Dependencies
```json
{
  "next": "^16.0.1",
  "@tabler/icons-react": "^3.19.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "UI component library",
  "recharts": "Chart library",
  "@tanstack/react-table": "Data tables"
}
```

## 📁 **Project Structure**

```
├── app/
│   ├── dashboard/                 # Merchant dashboard
│   │   ├── page.tsx              # Main dashboard
│   │   └── qr-codes/             # QR code management
│   └── play/                     # Customer experience
│       └── [merchantId]/         # Dynamic merchant routes
│           ├── page.tsx          # Data collection form
│           ├── games/            # Game gallery
│           │   └── page.tsx
│           ├── game/             # Individual games
│           │   └── [gameId]/
│           └── leaderboard/       # Leaderboards
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── app-sidebar.tsx          # Dashboard navigation
│   ├── crm-data-table.tsx      # Campaign data table
│   └── section-cards.tsx        # Dashboard metrics
├── lib/                        # Utilities and helpers
└── public/                     # Static assets
```

## 🎮 **Games Implemented**

### 1. Spin & Wheel (Fully Functional)
- **Interactive spinning wheel** with smooth animations
- **6 prize segments** with varying probabilities
- **Daily limit**: 3 spins per day
- **Real points awarding** and level progression

### 2. Game Gallery Features
- **6 different game types**: Spin & Win, Memory Match, Lucky Dice, Quick Tap, Word Puzzle, Color Match
- **Difficulty levels**: Easy (10-25 pts), Medium (25-35 pts), Hard (40-50 pts)
- **Level progression**: 100 points per level
- **Achievement tracking** and badges

### 3. Leaderboard System
- **Privacy-first**: Phone numbers masked (XXX-XXX-1234)
- **Real-time ranking** updates
- **Top 3 players** highlighted with special badges
- **Motivational messaging** based on performance

## 🔧 **Key Features**

### Customer Experience
- **Mobile-first responsive design**
- **Progressive data collection** (name → phone → social)
- **Gamified onboarding** with rewards
- **Social sharing capabilities**
- **Daily engagement loops**

### Merchant Management
- **QR code generation** with custom branding
- **Real-time analytics** and performance tracking
- **Campaign management** (active/paused/expired)
- **Customer data export** and insights
- **Conversion rate tracking**

### Data & Privacy
- **Privacy-compliant** phone number masking
- **Optional social media** fields
- **GDPR-ready** data handling
- **Secure local storage** (demo) / Database (production)

## 🎯 **API Routes & Data Flow**

### Customer Journey
```
1. QR Scan → /play/[merchantId]
2. Form Submit → localStorage → /play/[merchantId]/games?player=
3. Game Select → /play/[merchantId]/game/[gameId]?player=
4. Points Earn → Update localStorage → Refresh UI
5. Leaderboard View → Mock data + player position
```

### Merchant Analytics
```
1. Dashboard Load → Mock campaign data
2. QR Code Creation → Generate campaign entry
3. Performance Tracking → Aggregate user statistics
4. Data Export → Format for business use
```

## 🚀 **Development Workflow**

### Adding New Games

1. **Create Game Component**
```typescript
// components/games/new-game.tsx
export function NewGame({ playerId, onPointsEarned }: GameProps) {
  // Game implementation
  const handleWin = (points: number) => {
    onPointsEarned(points)
  }
  return <div>{/* Game UI */}</div>
}
```

2. **Add to Game Gallery**
```typescript
// app/play/[merchantId]/games/page.tsx
const games: Game[] = [
  // ...existing games
  {
    id: "new-game",
    name: "New Game",
    // ...game properties
  }
]
```

3. **Create Game Route**
```typescript
// app/play/[merchantId]/game/new-game/page.tsx
export default function NewGamePage() {
  // Game-specific implementation
}
```

### Customizing Merchant Experience

1. **Update Merchant Data**
```typescript
// app/play/[merchantId]/page.tsx
const merchantData: Record<string, Merchant> = {
  "new-merchant": {
    name: "New Merchant",
    logo: "🏪",
    brandColor: "bg-blue-500"
  }
}
```

2. **Add Custom Styling**
```css
/* Custom merchant branding */
.merchant-theme-new-merchant {
  --brand-primary: #brandColor;
  --brand-secondary: #secondaryColor;
}
```

## 📊 **Analytics & Tracking**

### Customer Metrics
- **QR Scan Rates**: Track campaign effectiveness
- **Game Completion**: Measure engagement depth
- **Point Distribution**: Reward system effectiveness
- **Return Visits**: Daily/monthly active users

### Business Metrics
- **Conversion Rates**: Scan → Game → Data collection
- **Customer Lifetime Value**: Long-term engagement
- **ROI Tracking**: Campaign profitability
- **Retention Rates**: Merchant and customer retention

## 🔧 **Configuration**

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:password@localhost:5432/gaming_crm
REDIS_URL=redis://localhost:6379
```

### Database Schema (Production)
```sql
-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  instagram VARCHAR(255),
  merchant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  game_type VARCHAR(100) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  played_at TIMESTAMP DEFAULT NOW()
);

-- QR campaigns table
CREATE TABLE qr_campaigns (
  id SERIAL PRIMARY KEY,
  merchant_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  qr_url TEXT NOT NULL,
  total_scans INTEGER DEFAULT 0,
  unique_scans INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚨 **Troubleshooting**

### Common Issues

1. **Build Errors**: Clear cache and restart
```bash
rm -rf .next
npm run dev
```

2. **Missing Components**: Install shadcn/ui components
```bash
npx shadcn@latest add [component-name]
```

3. **Icon Issues**: Check Tabler Icons documentation
```bash
# Find correct icon names
npm search @tabler/icons-react
```

4. **Route Errors**: Verify dynamic routing structure
```typescript
// Check params and searchParams
console.log(params.merchantId, searchParams.get('player'))
```

## 🧪 **Testing**

### Manual Testing Checklist
- [ ] QR code pages load correctly
- [ ] Form submission redirects to games
- [ ] Games award points properly
- [ ] Leaderboard shows correct rankings
- [ ] Dashboard displays analytics
- [ ] QR code management works
- [ ] Mobile responsive design

### Automated Testing (Future)
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Component tests
npm run test:components
```

## 📈 **Performance Optimization**

### Current Optimizations
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js image component
- **Font Optimization**: Local font loading
- **Static Generation**: ISR for static pages

### Future Improvements
- **Service Workers**: PWA offline support
- **Database Indexing**: Query optimization
- **CDN Integration**: Global content delivery
- **Caching Strategy**: Redis for frequent data

## 📄 **License**

MIT License - feel free to use this project for commercial or personal use.

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 **Support**

For questions, support, or business inquiries:
- **Email**: support@dataharvest-crm.com
- **Documentation**: [Full Project Documentation](./PROJECT_DOCUMENTATION.md)
- **Demo**: Try the live demo at http://localhost:3000

---

**🎮 Ready to transform customer engagement through gamified data collection!**