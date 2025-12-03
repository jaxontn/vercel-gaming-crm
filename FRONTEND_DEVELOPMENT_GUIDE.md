# Frontend Development Guide - Gamified CRM Platform

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Folder Structure](#folder-structure)
4. [Development Workflow](#development-workflow)
5. [Component Architecture](#component-architecture)
6. [Page Structure & Routing](#page-structure--routing)
7. [State Management](#state-management)
8. [Data Fetching Patterns](#data-fetching-patterns)
9. [Styling & Themes](#styling--themes)
10. [Game Development](#game-development)
11. [Merchant Dashboard](#merchant-dashboard)
12. [Testing Guidelines](#testing-guidelines)
13. [Build & Deployment](#build--deployment)
14. [Best Practices](#best-practices)
15. [Common Patterns](#common-patterns)

---

## Project Overview

This is a **Next.js 16 React application** for a gamified CRM platform with two main experiences:

### **Two Sides of the Platform**
1. **Customer Experience** (`/play/[merchantId]`) - Gamified customer interactions
2. **Merchant Dashboard** (`/dashboard/[merchantId]`) - Business management and analytics

### **Key Features**
- **QR Code Scanning** → Customer data collection
- **Progressive Forms** → Name → Phone → Social media (optional)
- **Game Gallery** → Interactive mini-games for points
- **Leaderboards** → Customer rankings and achievements
- **Real-time Analytics** → Merchant performance dashboard
- **Theme Customization** → Dynamic merchant branding
- **Loyalty Program** → Points, rewards, and challenges

### **Demo vs Production**
- **Demo Mode**: Uses localStorage for data persistence
- **Production Mode**: Connects to NestJS API at `http://localhost:3001`

---

## Tech Stack & Architecture

### **Core Technologies**
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Radix UI components
- **Styling**: Tailwind CSS + CSS Variables
- **Icons**: Tabler Icons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand (planned), localStorage currently
- **Theme**: next-themes for dark/light mode

### **Architecture Patterns**
- **App Router**: Next.js 13+ app directory structure
- **Dynamic Routes**: `[merchantId]` and `[gameId]` parameters
- **Server Components**: Mixed with Client Components as needed
- **Component Composition**: Reusable component architecture
- **Responsive Design**: Mobile-first approach

### **Data Flow Architecture**

```
Customer Journey:
QR Scan → Landing Page → Data Form → Game Gallery → Individual Games → Leaderboard → Rewards

Merchant Journey:
Dashboard Login → Analytics Overview → QR Campaigns → Customer Management → Game Settings → Reports
```

---

## Folder Structure

```
gaming_crm_nextjs/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Auth route groups (if needed)
│   ├── dashboard/                 # Merchant dashboard routes
│   │   ├── [merchantId]/         # Dynamic merchant dashboard
│   │   │   ├── analytics/        # Analytics pages
│   │   │   ├── customers/        # Customer management
│   │   │   ├── games/           # Game configuration
│   │   │   ├── qr-campaigns/    # QR campaign management
│   │   │   ├── loyalty/          # Loyalty program
│   │   │   ├── challenges/       # Challenges management
│   │   │   ├── reports/          # Reports and exports
│   │   │   ├── settings/         # Merchant settings
│   │   │   └── layout.tsx       # Dashboard layout
│   │   └── layout.tsx           # Dashboard group layout
│   ├── play/                     # Customer-facing routes
│   │   └── [merchantId]/         # Dynamic merchant pages
│   │       ├── games/             # Game gallery
│   │       ├── game/[gameId]/     # Individual games
│   │       ├── leaderboard/       # Leaderboard display
│   │       ├── rewards/           # Rewards catalog
│   │       ├── challenges/        # Customer challenges
│   │       └── layout.tsx        # Play area layout
│   ├── api/                      # API routes (if needed)
│   │   └── auth/                # Next.js API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Root loading
│   └── page.tsx                # Home page
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   └── ... (other UI components)
│   ├── games/                   # Game components
│   │   ├── SpinWheel.tsx
│   │   ├── MemoryMatch.tsx
│   │   ├── LuckyDice.tsx
│   │   ├── QuickTap.tsx
│   │   ├── WordPuzzle.tsx
│   │   └── ColorMatch.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── analytics/           # Analytics components
│   │   ├── customers/           # Customer management
│   │   ├── campaigns/           # QR campaign components
│   │   ├── loyalty/             # Loyalty components
│   │   └── reports/             # Report components
│   ├── forms/                   # Form components
│   │   ├── CustomerDataForm.tsx  # Customer data collection
│   │   ├── LoginForm.tsx         # Login form
│   │   └── GameSettingsForm.tsx  # Game configuration
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # App header
│   │   ├── Sidebar.tsx          # Dashboard sidebar
│   │   ├── Footer.tsx           # App footer
│   │   └── Navigation.tsx       # Navigation components
│   └── crm-data-table.tsx      # CRM data table component
├── lib/                         # Utility libraries
│   ├── utils.ts                 # General utilities
│   ├── api.ts                   # API client functions
│   ├── validations.ts            # Form validations
│   ├── constants.ts             # App constants
│   ├── hooks.ts                 # Custom React hooks
│   └── db.ts                   # Local storage functions
├── types/                       # TypeScript definitions
│   ├── customer.ts              # Customer types
│   ├── game.ts                 # Game types
│   ├── merchant.ts              # Merchant types
│   └── api.ts                  # API response types
├── public/                      # Static assets
│   ├── icons/                   # App icons
│   ├── images/                  # Images
│   └── demo-merchant/           # Demo merchant assets
├── hooks/                       # Next.js 13+ hooks
│   └── performance.ts           # Performance monitoring
├── styles/                      # Style files
│   └── globals.css             # Global styles (merged with app/globals.css)
├── components.json              # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## Development Workflow

### **1. Environment Setup**

```bash
# Navigate to frontend directory
cd "/Users/jasontan/Desktop/AIOT POC/Game_Campaign_NextJS/gaming_crm_nextjs"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

### **2. Available Scripts**

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
npm run lint:fix          # Run ESLint with auto-fix

# If using Prettier
npm run format            # Format code with Prettier
npm run type-check        # Run TypeScript check

# Testing (when implemented)
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
```

### **3. Environment Variables**

Create a `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_DEMO_MODE=true

# Theme Configuration
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### **4. Development Workflow**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Start development
npm run dev

# 3. Make changes following patterns
# 4. Test thoroughly
npm run lint

# 5. Commit changes
git add .
git commit -m "feat: add new feature"

# 6. Push and create PR
git push origin feature/new-feature
```

---

## Component Architecture

### **1. Component Types**

```typescript
// 1. Server Components (Default in Next.js 13+)
async function ServerComponent() {
  const data = await fetch('...');
  return <div>{data}</div>;
}

// 2. Client Components (with 'use client')
'use client';
import { useState } from 'react';

export function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// 3. Shared Components (Can be both)
export function SharedComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="shared-component">
      {children}
    </div>
  );
}
```

### **2. Component Structure Pattern**

```typescript
// components/ExampleComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExampleComponentProps {
  title: string;
  data?: any[];
  onUpdate?: (data: any) => void;
}

export function ExampleComponent({
  title,
  data = [],
  onUpdate
}: ExampleComponentProps) {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    // Component initialization
  }, []);

  // Event handlers
  const handleUpdate = async (newData: any) => {
    setLoading(true);
    try {
      await onUpdate?.(newData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* Component content */}
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **3. Reusable UI Components (shadcn/ui)**

```typescript
// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

---

## Page Structure & Routing

### **1. App Router Structure**

```typescript
// app/layout.tsx - Root Layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gamified CRM Platform',
  description: 'Interactive CRM with gamification',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### **2. Dynamic Routes**

```typescript
// app/play/[merchantId]/page.tsx - Merchant Play Area
import { notFound } from 'next/navigation';
import { MerchantPlayArea } from '@/components/play/MerchantPlayArea';

interface PageProps {
  params: {
    merchantId: string;
  };
}

async function getMerchantData(merchantId: string) {
  // Fetch merchant data from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function MerchantPlayPage({ params }: PageProps) {
  const merchant = await getMerchantData(params.merchantId);

  if (!merchant) {
    notFound();
  }

  return (
    <MerchantPlayArea merchant={merchant} />
  );
}
```

### **3. Layout Hierarchy**

```typescript
// app/dashboard/[merchantId]/layout.tsx - Dashboard Layout
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { merchantId: string };
}) {
  return (
    <div className="flex h-screen">
      <Sidebar merchantId={params.merchantId} />
      <div className="flex-1 flex flex-col">
        <Header merchantId={params.merchantId} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### **4. Loading States**

```typescript
// app/dashboard/[merchantId]/loading.tsx - Loading State
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-96 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
```

### **5. Error Handling**

```typescript
// app/dashboard/[merchantId]/error.tsx - Error Boundary
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {error.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## State Management

### **1. Current Implementation (localStorage)**

```typescript
// lib/db.ts - Local Storage Utilities
interface StorageKeys {
  customers: 'customers';
  gameSessions: 'game_sessions';
  merchants: 'merchants';
  campaigns: 'campaigns';
}

class LocalStorageDB {
  private getFromStorage<T>(key: StorageKeys[keyof StorageKeys]): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: StorageKeys[keyof StorageKeys], data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Customer operations
  getCustomers(merchantId?: string): Customer[] {
    const customers = this.getFromStorage<Customer[]>('customers');
    return merchantId
      ? customers.filter(c => c.merchantId === merchantId)
      : customers;
  }

  saveCustomer(customer: Customer): void {
    const customers = this.getFromStorage<Customer[]>('customers');
    const index = customers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      customers[index] = { ...customer, updatedAt: new Date() };
    } else {
      customers.push({ ...customer, id: generateId(), createdAt: new Date() });
    }
    this.saveToStorage('customers', customers);
  }

  // Game session operations
  saveGameSession(session: GameSession): void {
    const sessions = this.getFromStorage<GameSession[]>('game_sessions');
    sessions.push({ ...session, id: generateId(), createdAt: new Date() });
    this.saveToStorage('game_sessions', sessions);
  }

  getGameSessions(customerId: string): GameSession[] {
    return this.getFromStorage<GameSession[]>('game_sessions')
      .filter(s => s.customerId === customerId);
  }
}

export const db = new LocalStorageDB();
```

### **2. Future Implementation (Zustand)**

```typescript
// lib/store/index.ts - Zustand Store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Auth store
interface AuthStore {
  user: User | null;
  merchant: Merchant | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setMerchant: (merchant: Merchant) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      merchant: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, merchant: null, isAuthenticated: false }),
      setMerchant: (merchant) => set({ merchant }),
    }),
    { name: 'auth-store' }
  )
);

// Game store
interface GameStore {
  currentSession: GameSession | null;
  playerScore: number;
  isPlaying: boolean;
  startSession: (session: GameSession) => void;
  endSession: (score: number) => void;
  updateScore: (points: number) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      currentSession: null,
      playerScore: 0,
      isPlaying: false,
      startSession: (session) => set({ currentSession: session, isPlaying: true }),
      endSession: (score) => set({
        playerScore: score,
        isPlaying: false,
        currentSession: null
      }),
      updateScore: (points) => set((state) => ({
        playerScore: state.playerScore + points
      })),
    }),
    { name: 'game-store' }
  )
);
```

### **3. Using State in Components**

```typescript
// components/example/PlayerStats.tsx
'use client';

import { useGameStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PlayerStats() {
  const { playerScore, currentSession, isPlaying } = useGameStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Score: {playerScore}</p>
          <p>Status: {isPlaying ? 'Playing' : 'Not Playing'}</p>
          {currentSession && (
            <p>Game: {currentSession.gameType}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Data Fetching Patterns

### **1. API Client Setup**

```typescript
// lib/api.ts - API Client
import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Response schema
const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  timestamp: z.string(),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Generic fetch function
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse & { data?: T }> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);
  const data = await response.json();

  const validated = ApiResponseSchema.parse(data);
  if (!validated.success) {
    throw new Error(validated.message);
  }

  return validated as ApiResponse & { data?: T };
}

// API methods
export const api = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint),
  post: <T>(endpoint: string, data: any) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, {
      method: 'DELETE',
    }),
};
```

### **2. Server Component Data Fetching**

```typescript
// app/dashboard/[merchantId]/page.tsx
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

async function getDashboardData(merchantId: string) {
  const [stats, activity] = await Promise.all([
    api.get<any>(`/analytics/dashboard/${merchantId}`),
    api.get<any>(`/analytics/activity/${merchantId}?limit=10`),
  ]);

  return {
    stats: stats.data,
    activity: activity.data,
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const data = await getDashboardData(params.merchantId);

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats stats={data.stats} />
      </Suspense>

      <Suspense fallback={<div>Loading activity...</div>}>
        <RecentActivity activities={data.activity} />
      </Suspense>
    </div>
  );
}
```

### **3. Client Component Data Fetching**

```typescript
// components/dashboard/CustomerList.tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Customer } from '@/types/customer';
import { DataTable } from '@/components/ui/data-table';

export function CustomerList({ merchantId }: { merchantId: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const response = await api.get<Customer[]>(
          `/customers?merchant_id=${merchantId}`
        );
        setCustomers(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [merchantId]);

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DataTable
      data={customers}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'points', label: 'Points' },
        { key: 'lastPlayed', label: 'Last Played' },
      ]}
    />
  );
}
```

### **4. SWR Pattern (Future Implementation)**

```typescript
// hooks/useApi.ts - Custom SWR Hook
import useSWR from 'swr';
import { api } from '@/lib/api';

export function useApi<T>(endpoint: string, options?: any) {
  const { data, error, mutate } = useSWR<T>(
    endpoint,
    () => api.get<T>(endpoint).then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options,
    }
  );

  return {
    data,
    error,
    loading: !error && !data,
    mutate,
  };
}

// Usage
function CustomerList({ merchantId }: { merchantId: string }) {
  const { data: customers, error, loading } = useApi<Customer[]>(
    `/customers?merchant_id=${merchantId}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <CustomerTable customers={customers || []} />;
}
```

---

## Styling & Themes

### **1. Tailwind CSS Configuration**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### **2. CSS Variables (Themes)**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### **3. Theme Provider**

```typescript
// components/theme-provider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Update app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### **4. Dynamic Theming for Merchants**

```typescript
// lib/merchant-theme.ts
interface MerchantTheme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  fontFamily: string;
}

// Apply merchant-specific theme
export function applyMerchantTheme(theme: MerchantTheme) {
  const root = document.documentElement;

  // Update CSS variables
  root.style.setProperty('--merchant-primary', theme.primaryColor);
  root.style.setProperty('--merchant-secondary', theme.secondaryColor);

  // Update font
  if (theme.fontFamily) {
    root.style.setProperty('--font-merchant', theme.fontFamily);
  }
}

// Component to apply merchant theme
'use client';
import { useEffect } from 'react';

export function MerchantThemeProvider({
  merchantId,
  children,
}: {
  merchantId: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function loadTheme() {
      // Fetch merchant theme from API or config
      const response = await fetch(`/api/merchants/${merchantId}/theme`);
      const theme = await response.json();
      applyMerchantTheme(theme);
    }

    loadTheme();
  }, [merchantId]);

  return <>{children}</>;
}
```

---

## Game Development

### **1. Game Component Structure**

```typescript
// components/games/SpinWheel.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameProps {
  gameId: string;
  playerId: string;
  merchantId: string;
  onPointsEarned: (points: number, gameData: any) => void;
  settings?: GameSettings;
}

export function SpinWheel({
  gameId,
  playerId,
  merchantId,
  onPointsEarned,
  settings
}: GameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [score, setScore] = useState(0);

  // Game configuration
  const segments = settings?.segments || [
    { label: '10 Points', value: 10, color: '#FF6B6B' },
    { label: '25 Points', value: 25, color: '#4ECDC4' },
    { label: '50 Points', value: 50, color: '#45B7D1' },
    { label: 'Try Again', value: 0, color: '#96CEB4' },
  ];

  // Spin the wheel
  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Calculate random spin
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;

    setRotation(totalRotation);

    // Calculate result
    setTimeout(() => {
      const normalizedAngle = (360 - (finalAngle % 360) + 90) % 360;
      const segmentAngle = 360 / segments.length;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const segment = segments[segmentIndex];

      setScore(segment.value);
      setIsSpinning(false);

      if (segment.value > 0) {
        onPointsEarned(segment.value, {
          gameType: 'spin-win',
          result: segment.label,
          spins: 1,
        });
      }
    }, 4000);
  }, [isSpinning, rotation, segments, onPointsEarned]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spin & Win</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-64 h-64 mx-auto mb-4">
          {/* Wheel SVG */}
          <svg
            className="w-full h-full transition-transform duration-4000"
            style={{ transform: `rotate(${rotation}deg)` }}
            viewBox="0 0 200 200"
          >
            {segments.map((segment, index) => {
              const angle = (360 / segments.length) * index;
              const nextAngle = (360 / segments.length) * (index + 1);
              const startAngleRad = (angle * Math.PI) / 180;
              const endAngleRad = (nextAngle * Math.PI) / 180;

              const x1 = 100 + 90 * Math.cos(startAngleRad);
              const y1 = 100 + 90 * Math.sin(startAngleRad);
              const x2 = 100 + 90 * Math.cos(endAngleRad);
              const y2 = 100 + 90 * Math.sin(endAngleRad);

              return (
                <g key={index}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={100 + 50 * Math.cos((startAngleRad + endAngleRad) / 2)}
                    y={100 + 50 * Math.sin((startAngleRad + endAngleRad) / 2)}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="10" fill="white" />
          </svg>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500"></div>
          </div>
        </div>

        <div className="text-center space-y-4">
          {score > 0 && (
            <div className="text-2xl font-bold text-green-600">
              You won {score} points!
            </div>
          )}

          <Button
            onClick={spin}
            disabled={isSpinning}
            size="lg"
            className="w-full"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **2. Game Interface**

```typescript
// types/game.ts
export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  basePoints: number;
  timeLimit?: number;
  maxAttempts?: number;
  [key: string]: any; // Game-specific settings
}

export interface GameSession {
  id: string;
  playerId: string;
  gameId: string;
  gameType: string;
  score: number;
  pointsEarned: number;
  startedAt: Date;
  completedAt?: Date;
  gameData: any;
}

export interface GameComponentProps {
  gameId: string;
  playerId: string;
  merchantId: string;
  onPointsEarned: (points: number, gameData: any) => void;
  settings?: GameSettings;
}
```

### **3. Game Gallery**

```typescript
// app/play/[merchantId]/games/page.tsx
import { GameGallery } from '@/components/games/GameGallery';

interface PageProps {
  params: { merchantId: string };
}

const games = [
  {
    id: 'spin-win',
    name: 'Spin & Win',
    description: 'Spin the wheel to win points!',
    difficulty: 'Easy',
    minPoints: 10,
    maxPoints: 50,
    icon: '🎡',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match the pairs to earn points',
    difficulty: 'Medium',
    minPoints: 25,
    maxPoints: 35,
    icon: '🃏',
  },
  // ... other games
];

export default function GamesPage({ params }: PageProps) {
  return (
    <GameGallery
      games={games}
      merchantId={params.merchantId}
      baseUrl={`/play/${params.merchantId}/game`}
    />
  );
}

// components/games/GameGallery.tsx
export function GameGallery({
  games,
  merchantId,
  baseUrl,
}: {
  games: Game[];
  merchantId: string;
  baseUrl: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{game.icon}</div>
              <div>
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {game.difficulty}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{game.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">
                {game.minPoints} - {game.maxPoints} points
              </span>
              <Badge variant="secondary">{game.difficulty}</Badge>
            </div>
            <Button asChild className="w-full">
              <Link href={`${baseUrl}/${game.id}`}>
                Play Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## Merchant Dashboard

### **1. Dashboard Layout Structure**

```typescript
// app/dashboard/[merchantId]/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { merchantId: string };
}) {
  const menuItems = [
    {
      title: 'Dashboard',
      href: `/dashboard/${params.merchantId}`,
      icon: LayoutDashboard,
    },
    {
      title: 'Analytics',
      href: `/dashboard/${params.merchantId}/analytics`,
      icon: BarChart3,
    },
    {
      title: 'Customers',
      href: `/dashboard/${params.merchantId}/customers`,
      icon: Users,
    },
    {
      title: 'QR Campaigns',
      href: `/dashboard/${params.merchantId}/qr-campaigns`,
      icon: QrCode,
    },
    {
      title: 'Games',
      href: `/dashboard/${params.merchantId}/games`,
      icon: Gamepad2,
    },
    {
      title: 'Loyalty',
      href: `/dashboard/${params.merchantId}/loyalty`,
      icon: Gift,
    },
    {
      title: 'Reports',
      href: `/dashboard/${params.merchantId}/reports`,
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        merchantId={params.merchantId}
        menuItems={menuItems}
        className="w-64 bg-white dark:bg-gray-800 border-r"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          merchantId={params.merchantId}
          className="h-16 bg-white dark:bg-gray-800 border-b px-6"
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### **2. Analytics Dashboard**

```typescript
// app/dashboard/[merchantId]/analytics/page.tsx
import { AnalyticsOverview } from '@/components/dashboard/analytics/AnalyticsOverview';
import { MetricsCards } from '@/components/dashboard/analytics/MetricsCards';
import { CustomerGrowthChart } from '@/components/dashboard/analytics/CustomerGrowthChart';
import { GamePerformanceChart } from '@/components/dashboard/analytics/GamePerformanceChart';
import { TopCustomersTable } from '@/components/dashboard/analytics/TopCustomersTable';

async function getAnalyticsData(merchantId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard/${merchantId}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return res.json();
}

export default async function AnalyticsPage({ params }: PageProps) {
  const data = await getAnalyticsData(params.merchantId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Track your business performance and customer engagement
        </p>
      </div>

      <MetricsCards data={data.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerGrowthChart data={data.customerGrowth} />
        <GamePerformanceChart data={data.gamePerformance} />
      </div>

      <TopCustomersTable customers={data.topCustomers} />
    </div>
  );
}

// components/dashboard/analytics/MetricsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, PlayCircle, Award } from 'lucide-react';

export function MetricsCards({ data }: { data: AnalyticsMetrics }) {
  const cards = [
    {
      title: 'Total Customers',
      value: data.totalCustomers.toLocaleString(),
      change: data.customerGrowth,
      icon: Users,
    },
    {
      title: 'Games Played',
      value: data.totalGames.toLocaleString(),
      change: data.gameGrowth,
      icon: PlayCircle,
    },
    {
      title: 'Points Awarded',
      value: data.totalPoints.toLocaleString(),
      change: data.pointsGrowth,
      icon: Award,
    },
    {
      title: 'Engagement Rate',
      value: `${data.engagementRate}%`,
      change: data.engagementGrowth,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {card.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              {Math.abs(card.change)}% from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### **3. Customer Management Table**

```typescript
// components/dashboard/customers/CustomerTable.tsx
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types/customer';
import { formatDistanceToNow } from 'date-fns';

export function CustomerTable({
  customers,
  onExport
}: {
  customers: Customer[];
  onExport: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  // Filter customers based on search
  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const getSegmentBadge = (segment: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      new: 'default',
      active: 'secondary',
      loyal: 'default',
      'at-risk': 'destructive',
    };
    return variants[segment] || 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={onExport} variant="outline">
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.name}
                </TableCell>
                <TableCell>
                  {customer.phone.replace(/(\d{3})\d{3}(\d{4})/, 'XXX-XXX-$3')}
                </TableCell>
                <TableCell>{customer.email || '-'}</TableCell>
                <TableCell>{customer.points?.toLocaleString() || 0}</TableCell>
                <TableCell>
                  <Badge variant={getSegmentBadge(customer.segment)}>
                    {customer.segment}
                  </Badge>
                </TableCell>
                <TableCell>
                  {customer.lastActive
                    ? formatDistanceToNow(new Date(customer.lastActive), {
                        addSuffix: true,
                      })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

### **4. QR Campaign Management**

```typescript
// components/dashboard/qr-campaigns/QRCampaignForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Campaign } from '@/types/campaign';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  campaignType: z.enum(['standard', 'single_use_qr', 'game_specific']),
  targetAudience: z.enum(['all', 'new_customers', 'loyal_customers']),
  gameType: z.string().optional(),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export function QRCampaignForm({
  campaign,
  onSubmit,
  isLoading,
}: {
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData) => void;
  isLoading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign || {
      isActive: true,
      campaignType: 'standard',
    },
  });

  const campaignType = watch('campaignType');
  const isSingleUse = campaignType === 'single_use_qr';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Weekend Special Offer"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your campaign..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="campaignType">Campaign Type</Label>
        <Select
          value={campaignType}
          onValueChange={(value) => setValue('campaignType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select campaign type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard QR Campaign</SelectItem>
            <SelectItem value="single_use_qr">One-Time Use QR</SelectItem>
            <SelectItem value="game_specific">Game-Specific QR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Select
          {...register('targetAudience')}
          onValueChange={(value) => setValue('targetAudience', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select target audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="new_customers">New Customers Only</SelectItem>
            <SelectItem value="loyal_customers">Loyal Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {campaignType === 'game_specific' && (
        <div>
          <Label htmlFor="gameType">Game Type</Label>
          <Select
            {...register('gameType')}
            onValueChange={(value) => setValue('gameType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spin-win">Spin & Win</SelectItem>
              <SelectItem value="memory-match">Memory Match</SelectItem>
              <SelectItem value="lucky-dice">Lucky Dice</SelectItem>
              <SelectItem value="quick-tap">Quick Tap</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={watch('isActive')}
          onCheckedChange={(checked) => setValue('isActive', checked)}
        />
        <Label htmlFor="isActive">Campaign Active</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isSingleUse ? 'Generate QR Code' : 'Save Campaign'}
        </Button>
      </div>
    </form>
  );
}
```

---

## Testing Guidelines

### **1. Unit Testing with Jest**

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-destructive');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});
```

### **2. Component Testing**

```typescript
// __tests__/components/GameCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameCard } from '@/components/games/GameCard';

describe('GameCard', () => {
  const mockGame = {
    id: 'test-game',
    name: 'Test Game',
    description: 'A test game for testing',
    difficulty: 'Easy' as const,
    minPoints: 10,
    maxPoints: 50,
  };

  it('renders game information correctly', () => {
    render(<GameCard game={mockGame} onPlay={jest.fn()} />);

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('A test game for testing')).toBeInTheDocument();
    expect(screen.getByText('10 - 50 points')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', async () => {
    const mockOnPlay = jest.fn();
    const user = userEvent.setup();

    render(<GameCard game={mockGame} onPlay={mockOnPlay} />);

    await user.click(screen.getByRole('button', { name: /play now/i }));
    expect(mockOnPlay).toHaveBeenCalledWith(mockGame.id);
  });
});
```

### **3. Integration Testing with Playwright**

```typescript
// e2e/merchant-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Merchant Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as merchant
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'merchant@example.com');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard/merchant-123');
  });

  test('should display analytics dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Analytics Overview');

    // Check metrics cards
    await expect(page.locator('[data-testid=total-customers]')).toBeVisible();
    await expect(page.locator('[data-testid=games-played]')).toBeVisible();
    await expect(page.locator('[data-testid=points-awarded]')).toBeVisible();
  });

  test('should navigate to customer management', async ({ page }) => {
    await page.click('[data-testid=nav-customers]');
    await page.waitForURL('**/customers');

    await expect(page.locator('h1')).toContainText('Customer Management');
    await expect(page.locator('[data-testid=customer-table]')).toBeVisible();
  });

  test('should create new QR campaign', async ({ page }) => {
    await page.click('[data-testid=nav-qr-campaigns]');
    await page.click('[data-testid=create-campaign]');

    await page.fill('[data-testid=campaign-name]', 'Test Campaign');
    await page.selectOption('[data-testid=campaign-type]', 'Standard QR Campaign');
    await page.click('[data-testid=save-campaign]');

    await expect(page.locator('[data-testid=success-message]')).toBeVisible();
  });
});
```

### **4. Testing Configuration**

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);

// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));
```

---

## Build & Deployment

### **1. Production Build**

```bash
# Build the application
npm run build

# The build output will be in /.next directory
```

### **2. Environment-Specific Builds**

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:production": "NODE_ENV=production next build",
    "build:staging": "NODE_ENV=staging next build",
    "start": "next start",
    "start:production": "NODE_ENV=production next start",
    "analyze": "ANALYZE=true next build",
    "export": "next export"
  }
}
```

### **3. Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **4. Docker Compose for Development**

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./gaming_crm_nextjs
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://api:3001
    volumes:
      - ./gaming_crm_nextjs:/app
      - /app/node_modules
    depends_on:
      - api

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=mysql
      - DB_PASSWORD=password
      - DB_DATABASE=gamified_crm
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=gamified_crm
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### **5. Deployment to Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Environment variables for Vercel
# Set in Vercel dashboard:
# - NEXT_PUBLIC_API_URL
# - DATABASE_URL (if using Vercel Postgres)
# - AUTH_SECRET
```

---

## Best Practices

### **1. Code Organization**
- Follow Next.js 13+ App Router conventions
- Use TypeScript for all components and functions
- Keep components small and focused
- Use absolute imports with `@/` prefix
- Separate business logic from UI components

### **2. Performance Optimization**
- Use Next.js Image component for images
- Implement code splitting with dynamic imports
- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Implement lazy loading for heavy components

### **3. SEO & Accessibility**
- Use proper semantic HTML elements
- Implement meta tags for all pages
- Add ARIA labels for screen readers
- Ensure keyboard navigation
- Test with Lighthouse

### **4. Security**
- Validate all user inputs
- Sanitize data before display
- Use HTTPS in production
- Implement CSRF protection
- Never expose sensitive data in client-side code

### **5. Error Handling**
- Implement error boundaries
- Provide meaningful error messages
- Log errors for debugging
- Graceful degradation for features
- User-friendly error pages

---

## Common Patterns

### **1. Loading Pattern**

```typescript
// components/ui/LoadingSpinner.tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]}`} />
  );
}

// Usage in components
function Component() {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>Content</div>
      )}
    </div>
  );
}
```

### **2. Error Boundary Pattern**

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### **3. API Hook Pattern**

```typescript
// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute };
}

// Usage
function CustomerList() {
  const { data: customers, loading, error } = useApi(
    () => api.get<Customer[]>('/customers'),
    {
      immediate: true,
      onError: (err) => console.error('Failed to load customers:', err),
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return <CustomerTable customers={customers || []} />;
}
```

### **4. Form Pattern with React Hook Form**

```typescript
// components/forms/CustomerForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
}

export function CustomerForm({ defaultValues, onSubmit, isLoading }: CustomerFormProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Customer'}
        </Button>
      </form>
    </Form>
  );
}
```

### **5. Responsive Design Pattern**

```typescript
// components/layout/ResponsiveGrid.tsx
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

// Usage
function ProductList({ products }: { products: Product[] }) {
  return (
    <ResponsiveGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ResponsiveGrid>
  );
}
```

### **6. Modal/Dialog Pattern**

```typescript
// components/ui/ConfirmDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  children,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Usage
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <ConfirmDialog
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      onConfirm={onDelete}
      confirmText="Delete"
      variant="destructive"
    >
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    </ConfirmDialog>
  );
}
```

---

## Quick Reference

### **Common Commands**

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix          # Fix ESLint issues

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage

# Type checking
npm run type-check       # TypeScript check

# Utils
npm run analyze          # Bundle analyzer
```

### **File Locations**

- **Pages**: `app/` (Next.js 13+ App Router)
- **Components**: `components/`
- **UI Components**: `components/ui/` (shadcn/ui)
- **Games**: `components/games/`
- **Utilities**: `lib/`
- **Types**: `types/`
- **Public Assets**: `public/`
- **Styles**: `app/globals.css`, `styles/`

### **Import Patterns**

```typescript
// Components
import { Button } from '@/components/ui/button';
import { SpinWheel } from '@/components/games/SpinWheel';

// Utilities
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// Types
import { Customer } from '@/types/customer';
import { GameSession } from '@/types/game';

// Hooks
import { useAuth } from '@/lib/hooks';
```

### **Environment Variables**

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_DEMO_MODE=true

# Theme
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

---

## Conclusion

This guide provides comprehensive documentation for frontend development in this gamified CRM platform. Key takeaways:

1. **Architecture**: Next.js 13+ with App Router, TypeScript, and shadcn/ui
2. **Structure**: Modular component organization with clear separation of concerns
3. **Development**: Hot reload, ESLint, TypeScript, and testing support
4. **Styling**: Tailwind CSS with design system components
5. **State**: Currently localStorage, planned Zustand for complex state
6. **Performance**: Optimized builds, code splitting, and lazy loading

For additional information:
- Next.js documentation (https://nextjs.org/docs)
- shadcn/ui documentation (https://ui.shadcn.com/)
- Tailwind CSS documentation (https://tailwindcss.com/docs)
- React documentation (https://react.dev)

Remember to follow established patterns, test thoroughly, and maintain consistency across the codebase!