# DataHarvest Gamified CRM - Complete Page Documentation

## Table of Contents
1. [Public-Facing Pages](#public-facing-pages)
2. [Merchant Dashboard Pages](#merchant-dashboard-pages)
3. [Customer Gaming Experience](#customer-gaming-experience)
4. [Game Components](#game-components)
5. [Technical Architecture](#technical-architecture)
6. [Data Flow](#data-flow)

---

## Public-Facing Pages

### 1. Landing Page (`/`)
**File:** `/app/page.tsx`
**Purpose:** Main entry point for the application
**Features:**
- Clean, modern design with dark mode support
- Call-to-action button directing users to dashboard
- Next.js branding and template information
- Responsive layout optimized for all devices

**Key Elements:**
- Header with Next.js logo
- Main title and description
- "📊 View Dashboard" button (primary CTA)
- "Documentation" link (secondary)
- Minimalist design with proper spacing

**User Flow:**
1. User lands on `/`
2. Clicks "View Dashboard"
3. Redirected to `/dashboard`

---

## Merchant Dashboard Pages

### 2. Dashboard Main (`/dashboard`)
**File:** `/app/dashboard/page.tsx`
**Purpose:** Main analytics dashboard for merchants
**Layout:** `/app/dashboard/layout.tsx`
**Features:**
- Key metrics display with SectionCards component
- Interactive charts using ChartAreaInteractive
- Campaign data table with DataTable component
- Responsive grid layout

**Components Used:**
- `SectionCards` - Key performance indicators
- `ChartAreaInteractive` - Interactive analytics charts
- `DataTable` - Campaign performance table

**Data Sources:**
- Mock campaign data from `./data.json`
- CampaignData interface with fields:
  - Campaign name, type, status
  - Data collected, conversion rate
  - Revenue generated, dates

### 3. Analytics Dashboard (`/dashboard/analytics`)
**File:** `/app/dashboard/analytics/page.tsx`
**Purpose:** Comprehensive analytics with multiple data views
**Features:**

#### Overview Tab
- **6 Key Metrics Cards:**
  - Total QR Scans: 5,347 (+28.4%)
  - Active Players: 1,247 (+15.6%)
  - Games Played: 8,923 (+42.1%)
  - Conversion Rate: 23.8% (+5.2%)
  - Revenue Generated: $24,567 (+32.7%)
  - Avg. Session Duration: 4m 23s (-8.3%)
- **Performance Chart:** Interactive area chart showing trends
- **Top Performers:** Best campaigns, games, locations, and channels

#### Engagement Tab
- **Daily Active Users:** 342 (+12.5% from last week)
- **Avg. Session Length:** 4m 23s (-8.3% from last week)
- **Retention Rate:** 67.8% (+5.2% from last week)
- **Hourly Activity:** User engagement patterns throughout the day

#### Games Tab
- **Game Performance Table:**
  - Spin & Win: 3,247 plays, 89% completion, 2m 15s avg time
  - Memory Match: 1,234 plays, 76% completion, 3m 42s avg time
  - Lucky Dice: 2,156 plays, 82% completion, 1m 58s avg time
  - Quick Tap: 987 plays, 91% completion, 45s avg time
  - Word Puzzle: 543 plays, 68% completion, 5m 12s avg time
  - Color Match: 1,456 plays, 85% completion, 2m 34s avg time
- Revenue tracking per game

#### Demographics Tab
- **Age Distribution:**
  - 18-24: 23% (287 users)
  - 25-34: 38% (474 users)
  - 35-44: 25% (312 users)
  - 45-54: 10% (125 users)
  - 55+: 4% (50 users)
- **Device Types:**
  - Mobile: 68%
  - Desktop: 24%
  - Tablet: 8%

**UI Components:**
- Time range selector (7d, 30d, 90d, 1y)
- Export report functionality
- Tabbed navigation for different analytics views
- Interactive charts with hover effects
- Responsive metric cards with trend indicators

### 4. Campaign Management (`/dashboard/campaigns`)
**File:** `/app/dashboard/campaigns/page.tsx`
**Purpose:** Create and manage marketing campaigns
**Features:**
- Campaign creation wizard
- Performance tracking dashboard
- ROI calculations
- QR code generation and management
- Budget allocation tools

### 5. Customer Data Management (`/dashboard/customer-data`)
**File:** `/app/dashboard/customer-data/page.tsx`
**Purpose:** Manage customer database and relationships
**Features:**
- Customer search and filtering
- Contact information management
- Data export capabilities
- Customer segmentation tools
- Communication history

### 6. QR Code Management (`/dashboard/qr-codes`)
**File:** `/app/dashboard/qr-codes/page.tsx`
**Purpose:** Manage QR code campaigns and tracking
**Features:**
- QR code generation
- Campaign assignment
- Performance tracking
- Location-based analytics
- Bulk QR code operations

### 7. Gamification Settings

#### Challenges (`/dashboard/gamification/challenges`)
**File:** `/app/dashboard/gamification/challenges/page.tsx`
**Purpose:** Configure game challenges and difficulty settings
**Features:**
- Challenge creation and configuration
- Difficulty level management
- Reward structure setup
- Progress tracking rules

#### Loyalty Points (`/dashboard/gamification/loyalty-points`)
**File:** `/app/dashboard/gamification/loyalty-points/page.tsx`
**Purpose:** Configure loyalty points system
**Features:**
- Point allocation rules
- Level progression settings
- Bonus point configurations
- Redemption options

#### Spin & Win (`/dashboard/gamification/spin-win`)
**File:** `/app/dashboard/gamification/spin-win/page.tsx`
**Purpose:** Manage spin-to-win game settings
**Features:**
- Prize configuration
- Probability settings
- Daily limits management
- Theme customization

### 8. Promotion Management

#### Flash Sales (`/dashboard/promotions/flash-sales`)
**File:** `/app/dashboard/promotions/flash-sales/page.tsx`
**Purpose:** Configure time-limited promotional offers
**Features:**
- Sale creation wizard
- Time scheduling
- Discount management
- Inventory integration

#### Mystery Offers (`/dashboard/promotions/mystery-offers`)
**File:** `/app/dashboard/promotions/mystery-offers/page.tsx`
**Purpose:** Manage mystery box promotions
**Features:**
- Mystery prize configuration
- Probability settings
- Customer engagement tracking
- Reveal mechanics

#### VIP Access (`/dashboard/promotions/vip-access`)
**File:** `/app/dashboard/promotions/vip-access/page.tsx`
**Purpose:** Configure exclusive VIP promotions
**Features:**
- VIP customer management
- Exclusive offer creation
- Access level controls
- Premium reward systems

### 9. Lead Generation

#### Email Capture (`/dashboard/lead-generation/email-capture`)
**File:** `/app/dashboard/lead-generation/email-capture/page.tsx`
**Purpose:** Manage email collection campaigns
**Features:**
- Form customization
- Integration with email marketing
- A/B testing capabilities
- Conversion tracking

#### Social Sharing (`/dashboard/lead-generation/social-sharing`)
**File:** `/app/dashboard/lead-generation/social-sharing/page.tsx`
**Purpose:** Social media sharing campaigns
**Features:**
- Social media integration
- Share tracking
- Viral coefficient measurement
- Referral monitoring

#### Referral Program (`/dashboard/lead-generation/referral-program`)
**File:** `/app/dashboard/lead-generation/referral-program/page.tsx`
**Purpose:** Customer referral system management
**Features:**
- Referral link generation
- Reward structure setup
- Tracking dashboard
- Performance analytics

### 10. Settings (`/dashboard/settings`)
**File:** `/app/dashboard/settings/page.tsx`
**Purpose:** Complete system configuration and management
**Features:**

#### Store Information Tab
- **Basic Details:**
  - Store name, description, logo
  - Contact information (phone, email, address)
  - Website URL
- **Branding:**
  - Brand color picker (#8B5CF6 default)
  - Logo upload/emoji support
  - Visual customization options

#### Notifications Tab
- **Notification Channels:**
  - Email notifications (enabled)
  - SMS notifications (disabled)
  - Push notifications (enabled)
- **Notification Types:**
  - Weekly reports (enabled)
  - New customer alerts (enabled)
  - Campaign alerts (enabled)
  - Low balance alerts (disabled)

#### Gamification Tab
- **Point System:**
  - Daily spin limit: 3 spins
  - Points per level: 100 points
  - Welcome bonus: 50 points
  - Referral bonus: 25 points
  - Share bonus: 10 points
- **Feature Toggles:**
  - Leaderboard (enabled)
  - Achievements (enabled)
  - Social sharing (enabled)

#### Integrations Tab
- **Payment Processors:**
  - Stripe (connect button)
  - PayPal (connect button)
- **Social Media:**
  - Instagram (connected)
  - Facebook (connect button)
  - Twitter/X (connect button)
- **Messaging:**
  - WhatsApp Business (connect button)
  - Email Service (connected)

#### Security Tab
- **Password Management:**
  - Current password verification
  - New password setting
  - Password confirmation
- **Two-Factor Authentication:**
  - 2FA enable/disable toggle
  - QR code setup for authenticator apps
- **API Access:**
  - API key generation and management
  - Key regeneration capability
  - Download API credentials
- **Data & Privacy:**
  - Export all data functionality
  - Account deletion option

---

## Customer Gaming Experience

### 11. Player Entry (`/play/[merchantId]`)
**File:** `/app/play/[merchantId]/page.tsx`
**Purpose:** Customer data collection and game entry point
**Dynamic Route:** `merchantId` parameter for multi-tenant support

**UI Design:**
- **Header:** Merchant branding with logo, name, and "Play & Win Rewards!" tagline
- **Main Form:**
  - Gift icon with gradient background
  - "Ready to Play?" headline
  - Player information collection form
- **Form Fields:**
  - Full Name (required)
  - Phone Number (required, format: +1 (555) 123-4567)
  - Instagram Handle (optional, format: @username)
- **Features Section:**
  - 🎮 Fun Games
  - 🏆 Leaderboard
  - 🎁 Prizes
- **Compliance:** Terms agreement and privacy notice

**Functionality:**
- Form validation and submission
- LocalStorage data persistence
- Player ID generation (`${phone}_${timestamp}`)
- Automatic redirect to game gallery
- Mobile-optimized responsive design

**Data Storage:**
```typescript
interface PlayerData {
  name: string
  phone: string
  instagram?: string
  merchantId: string
  timestamp: string
}
```

### 12. Game Gallery (`/play/[merchantId]/games`)
**File:** `/app/play/[merchantId]/games/page.tsx`
**Purpose:** Game selection and player profile display
**Features:**
- Player statistics and level progression
- Game grid with difficulty indicators
- Leaderboard preview
- Points tracking display
- Achievement showcase

### 13. Individual Games (`/play/[merchantId]/game/[gameId]`)
**File:** `/app/play/[merchantId]/game/[gameId]/page.tsx`
**Purpose:** Individual game interfaces for different game types
**Dynamic Routes:** `merchantId` and `gameId` parameters

**Available Games:**

#### Spin & Win
- **Type:** Interactive spinning wheel
- **Features:** Daily limits, prize tiers, animation effects
- **Win Rate:** Configurable probability settings
- **Prizes:** Points, discounts, physical items

#### Memory Match
- **Type:** Card matching game
- **Features:** Grid sizes, timer, move counter
- **Difficulty:** Progressive levels
- **Scoring:** Time and move-based bonuses

#### Lucky Dice
- **Type:** Dice rolling game
- **Features:** Multiple dice types, betting system
- **Gameplay:** Roll combinations for prizes
- **Rewards:** Multipliers, bonus rounds

#### Quick Tap
- **Type:** Speed/reaction game
- **Features:** Tap targets, time limits, precision scoring
- **Gameplay:** Rapid-fire tapping challenges
- **Metrics:** CPS (clicks per second), accuracy

#### Word Puzzle
- **Type:** Vocabulary/word game
- **Features:** Anagrams, word searches, crosswords
- **Difficulty:** Multiple complexity levels
- **Hints:** Help system with point cost

#### Color Match
- **Type:** Pattern recognition game
- **Features:** Color sequences, speed challenges
- **Gameplay:** Match colors under time pressure
- **Scoring:** Speed and accuracy bonuses

### 14. Leaderboard (`/play/[merchantId]/leaderboard`)
**File:** `/app/play/[merchantId]/leaderboard/page.tsx`
**Purpose:** Competitive rankings and player achievements
**Features:**
- **Top 3 Players:** Special badges and highlighting
- **Complete Rankings:** Full player list with positions
- **Player Position:** Current user's ranking highlighted
- **Motivational Messaging:** Encouragement for improvement
- **Time Filters:** Daily, weekly, monthly, all-time rankings
- **Social Sharing:** Share achievements on social media

**Ranking System:**
- Points-based ranking
- Tie-breaking by completion time
- Level progression indicators
- Achievement badges display

---

## Game Components Library

**Location:** `/components/games/`

### 15. Memory Match Component (`/components/games/memory-match.tsx`)
**Purpose:** Reusable memory card game implementation
**Features:**
- Card flipping animations
- Match detection logic
- Score tracking
- Timer functionality
- Difficulty levels

### 16. Lucky Dice Component (`/components/games/lucky-dice.tsx`)
**Purpose:** Dice rolling game with physics simulation
**Features:**
- 3D dice animations
- Rolling physics
- Combination detection
- Betting system
- Sound effects

### 17. Quick Tap Component (`/components/games/quick-tap.tsx`)
**Purpose:** Speed-based tapping challenge game
**Features:**
- Target generation
- Timing precision tracking
- Combo system
- Progressive difficulty
- High score tracking

### 18. Word Puzzle Component (`/components/games/word-puzzle.tsx`)
**Purpose:** Word-based puzzle games
**Features:**
- Multiple game modes
- Dictionary integration
- Hint system
- Word validation
- Progressive difficulty

### 19. Color Match Component (`/components/games/color-match.tsx`)
**Purpose:** Color recognition and matching games
**Features:**
- Color palette generation
- Pattern matching logic
- Speed challenges
- Accuracy tracking
- Visual feedback systems

---

## Technical Architecture

### Technology Stack
- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS with shadcn/ui components
- **Icons:** Tabler Icons React
- **Data:** Mock data with localStorage persistence
- **State Management:** React hooks (useState, useEffect)
- **Routing:** Next.js dynamic routes
- **UI Components:** Custom component library

### Key Patterns
- **Component Composition:** Reusable game components
- **Responsive Design:** Mobile-first approach
- **Dark Mode:** Full theme support
- **Type Safety:** TypeScript interfaces throughout
- **Performance:** Optimized charts and animations

### Data Models

#### Player Data
```typescript
interface PlayerData {
  name: string
  phone: string
  instagram?: string
  merchantId: string
  timestamp: string
}
```

#### Campaign Data
```typescript
interface CampaignData {
  id: number
  campaignName: string
  campaignType: string
  status: "Active" | "Completed" | "Planning"
  dataCollected: string
  conversionRate: string
  revenueGenerated: string
  startDate: string
  endDate: string
}
```

#### Store Settings
```typescript
interface StoreSettings {
  name: string
  description: string
  logo: string
  brandColor: string
  website: string
  phone: string
  email: string
  address: string
}
```

---

## Data Flow

### Customer Journey
1. **QR Scan** → Player Entry Page
2. **Data Collection** → Form submission
3. **Game Selection** → Game Gallery
4. **Gameplay** → Individual Games
5. **Competition** → Leaderboard
6. **Retention** → Return visits

### Merchant Workflow
1. **Dashboard** → Overview of metrics
2. **Campaign Setup** → Create new campaigns
3. **Gamification Config** → Set up games and rewards
4. **Analytics** → Monitor performance
5. **Settings** → Configure platform
6. **Customer Management** → View and export data

### Data Storage
- **Player Data:** LocalStorage (demo)
- **Settings:** React state
- **Analytics:** Mock data arrays
- **Campaigns:** JSON configuration files
- **Game State:** Component-level state management

---

## Security Considerations

### Current Implementation
- No authentication system (demo/prototype)
- Client-side data storage
- No backend API endpoints
- Mock data for demonstration

### Production Requirements
- Authentication and authorization
- Server-side data storage
- API security (rate limiting, validation)
- Data encryption at rest and in transit
- GDPR and privacy compliance
- Payment processing security

---

## Performance Optimizations

### Implemented Features
- Responsive image loading
- Optimized chart rendering
- Efficient state management
- Code splitting by routes
- Minimal bundle size

### Future Enhancements
- Service worker for offline support
- Image lazy loading
- Database query optimization
- CDN integration
- Caching strategies

---

## Accessibility Features

### Current Support
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Improvements Needed
- Focus management in games
- Voice control support
- Braille display optimization
- Alternative text for game elements
- Color-blind friendly design

---

This documentation provides a comprehensive overview of all 19 pages and components in the DataHarvest Gamified CRM platform, covering functionality, user flows, technical implementation, and future development considerations.