# QR Code Implementation Plan - One-Time Use Links

## Overview
This document outlines the implementation plan for creating one-time use QR codes that link to specific games in the gaming CRM platform.

## Current State Analysis

### Database Schema
- MySQL database with existing tables (see `gamified_crm_2025-12-09.sql`)
- Key tables: `qr_campaigns`, `games_catalog`, `merchant_games`, `game_sessions`, `customers`
- `qr_campaigns` already has basic campaign tracking fields
- `games_catalog` contains available games with game_code as unique identifier

### Existing QR Code Page (`/app/dashboard/qr-codes/page.tsx`)
- Built with Next.js 13+ App Router
- Uses shadcn/ui components
- Currently uses mock data for QR campaigns
- Tracks metrics: total_scans, unique_scans, conversions
- Has basic UI for CRUD operations
- Missing: Game selection, one-time use functionality, expiration after play

### Available Games (from games_catalog table)
1. **Color Match** (game_code: likely "color_match")
   - Category: skill/puzzle
   - Stroop effect game where players click the color that text says
   - Configurable difficulty levels and time limits

2. **Lucky Dice** (game_code: likely "lucky_dice")
   - Category: luck
   - Dice rolling game with combos for bonus points
   - Visual dice components with animations

3. **Memory Match** (game_code: likely "memory_match")
   - Category: puzzle/memory
   - Card matching game with emoji pairs
   - Track moves for efficiency bonus

4. **Other Games** (Quick Tap, Word Puzzle - game_codes to be verified)
   - Additional games available in games_catalog

## Implementation Requirements

### Core Features Needed
1. **Game Selection** - Allow merchants to choose from games_catalog table
2. **One-Time Use Links** - QR codes that expire after a single use
3. **Expiration After Completion** - Links become invalid once the game is completed
4. **Custom Scans Tracking** - Track when QR codes are created and used
5. **Unique Link Generation** - Each QR code gets a unique identifier

### Database Schema Updates

#### QR Campaigns Table Updates
```sql
ALTER TABLE qr_campaigns
ADD COLUMN gameId VARCHAR(36) NULL,
ADD COLUMN isOneTimeUse BOOLEAN DEFAULT FALSE,
ADD COLUMN maxUses INT DEFAULT 1,
ADD COLUMN currentUses INT DEFAULT 0;
```
Note: gameId references games_catalog.id (UUID), not game_code
Note: games_catalog.id is VARCHAR(36), merchant_games.game_id also references it
Note: qr_campaigns already has:
- `qr_url` - can store the generated QR URL
- `campaign_type` - can be used for QR type identification
- `created_by` - references merchant_users.id
- `qr_code_image` - stores QR code image path

#### New QR Usage Table
```sql
CREATE TABLE qr_usage (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  qrCampaignId VARCHAR(255) NOT NULL,
  uniqueId VARCHAR(255) NOT NULL UNIQUE,
  isUsed BOOLEAN DEFAULT FALSE,
  usedAt TIMESTAMP NULL,
  playerInfo JSON NULL,
  ipAddress VARCHAR(255) NULL,
  userAgent VARCHAR(255) NULL,
  customerId VARCHAR(255) NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (qrCampaignId) REFERENCES qr_campaigns(id),
  INDEX idx_uniqueId (uniqueId),
  INDEX idx_qrCampaignId (qrCampaignId)
);
```

#### TypeScript Interfaces
```typescript
interface QRCampaign {
  id: string
  merchant_id: string
  name: string
  description: string
  gameId: string  // games_catalog.game_code
  qrUrl: string
  status: "draft" | "active" | "paused" | "expired"
  createdAt: string
  expiresAt?: string
  location?: string
  isOneTimeUse: boolean
  maxUses: number
  currentUses: number
  game_settings?: any  // JSON from database
}

interface QRUsage {
  id: string
  qrCampaignId: string
  uniqueId: string
  isUsed: boolean
  usedAt?: string
  playerInfo?: {
    name?: string
    phone?: string
    email?: string
    pointsEarned?: number
  }
  ipAddress?: string
  userAgent?: string
}
```

### URL Structure
```
/validate/:uniqueId → redirects to → /play/qr-register/:uniqueId → redirects to → /play/:merchantId/:gameId?qr=:uniqueId
```
Example flow:
1. QR Code contains: `https://platform.com/validate/abc123xyz`
2. Validation page checks QR and redirects to: `https://platform.com/play/qr-register/abc123xyz`
3. Customer enters details and is redirected to: `https://platform.com/play/merchant123/color-match?qr=abc123xyz&customerId=cust123`

### Implementation Steps

#### Phase 1: Backend API Preparation (PHP Modules)

**Important Database Notes:**
- `games_catalog.id` is VARCHAR(36) UUID, referenced by `merchant_games.game_id`
- `games_catalog.game_code` is the unique string identifier (e.g., "memory_match")
- `customers` table has both `merchant_id` and `merchantId` fields - use `merchant_id`
- `qr_campaigns.created_by` references `merchant_users.id`
- All relationships use proper foreign key constraints

1. **Create PHP Module Structure**
   - `api/v1/request/modules/qr_campaigns/` - Main QR campaigns module
   - `api/v1/request/modules/qr_usage/` - QR usage tracking module
   - `api/v1/request/modules/customers/` - Customer management module
   - `api/v1/request/modules/games_catalog/` - Games catalog module (if not exists)

2. **QR Campaigns Module Structure**
   - `qr_campaigns/main.php` - Main class with run() method
   - `qr_campaigns/create.php` - Create new QR campaign
   - `qr_campaigns/list.php` - List QR campaigns for merchant
   - `qr_campaigns/read.php` - Get single QR campaign
   - `qr_campaigns/update.php` - Update QR campaign
   - `qr_campaigns/delete.php` - Delete QR campaign
   - `qr_campaigns/generate.php` - Generate unique QR code

3. **QR Usage Module Structure**
   - `qr_usage/main.php` - Main class
   - `qr_usage/validate.php` - Validate QR code
   - `qr_usage/mark_used.php` - Mark QR as used
   - `qr_usage/check_status.php` - Check QR usage status

4. **Profile Customer Module Enhancement** (Note: module is called `profile_customer` not `customers`)
   - `profile_customer/main.php` - Update existing module
   - `profile_customer/upsert.php` - Create/update customer (new)
   - `profile_customer/find_by_phone.php` - Find customer by phone (new)
   - Note: This module already exists with other profile_customer methods

5. **Database Setup**
   - Execute SQL schema updates (see above)
   - Update existing tables
   - Create qr_usage table
   - Test database connections

#### Phase 2: Frontend Updates (Next.js App Router)
1. **Update QR Code Creation Dialog** (`/app/dashboard/qr-codes/page.tsx`)
   - Integrate with games_catalog API for game selection
   - Add game-specific settings based on game_settings table
   - Add one-time use toggle with maxUses input
   - Add expiration date picker

2. **Update QR Codes Table**
   - Display game_name and icon from games_catalog
   - Show "currentUses/maxUses" for usage tracking
   - Add visual badges for status (active/used/expired)
   - Keep existing metrics display

3. **Create Reusable Components**
   - `components/GameSelector.tsx` - Grid of available games
   - `components/GameSettings.tsx` - Dynamic settings form
   - `components/QRStatusBadge.tsx` - Visual status indicator

#### Phase 3: Game Integration (App Router)
1. **Create Validation Route** (`/app/validate/[uniqueId]/page.tsx`)
   - Call validation API to check QR status
   - Show loading state while validating
   - Handle errors (not found, used, expired)
   - If valid, redirect to registration page with QR context

2. **Create QR Registration Route** (`/app/play/qr-register/[uniqueId]/page.tsx`)
   - Display game preview (which game they'll play)
   - Reuse the registration form from `/play/[merchantId]/page.tsx`
   - Collect: Full Name, Phone Number, Instagram (optional)
   - On submit, call `/api/customers/upsert` to create/update customer
   - Link customer to QR usage record
   - Redirect to game with both QR and customer parameters

3. **Update Game Routes**
   - Modify `/app/play/[merchantId]/game/[gameId]/page.tsx`
   - Check for QR and customerId in URL parameters
   - Validate QR before game starts
   - Load customer information for scoring
   - Pass QR and customer context to game components
   - Create game_sessions record on game start

4. **Handle QR Completion**
   - API call to mark QR as used
   - Update customer stats (games_played, total_points)
   - Create game_sessions record with final score
   - Create loyalty_transactions if points awarded
   - Handle one-time use restriction

5. **Create Status/Error Pages**
   - `/app/play/qr-used/page.tsx` - Already used QR codes
   - `/app/play/qr-expired/page.tsx` - Expired QR codes
   - `/app/play/qr-not-found/page.tsx` - Invalid QR codes

#### Phase 4: Additional Features
1. **Bulk QR Code Generation**
   - Create multiple QR codes at once
   - Download/print QR codes in bulk

2. **QR Code Analytics**
   - Track conversion rates
   - Time from creation to use
   - Geographic tracking

3. **QR Code Templates**
   - Save frequently used configurations
   - Quick create from templates

### Implementation Details

#### Frontend API Calls (using existing callApi)

```typescript
// Generate QR Code
const generateQRCode = async (campaignId: string) => {
  const response = await callApi('qr_campaigns', 'generate', {
    campaignId: campaignId
  });

  if (response.data?.status === 'SUCCESS') {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Failed to generate QR code');
};

// Get Games Catalog
const getGamesCatalog = async () => {
  const response = await callApi('games_catalog', 'list', {
    merchant_id: merchantId
  });

  if (response.data?.status === 'SUCCESS') {
    return response.data.data.games;
  }
  return [];
};

// Validate QR Code
const validateQRCode = async (uniqueId: string) => {
  const response = await callApi('qr_usage', 'validate', {
    uniqueId: uniqueId
  });

  return response.data;
};

// Create/Update Customer
const upsertCustomer = async (customerData: any) => {
  const response = await callApi('profile_customer', 'upsert', customerData);

  if (response.data?.status === 'SUCCESS') {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Failed to save customer');
};
```

#### PHP Module Examples

**qr_campaigns/generate.php**
```php
<?php
global $dbconn, $data, $user_info;

use core\utils\log;

$user_data = json_decode($user_info, true);
$merchant_id = $user_data['merchant_id'] ?? null;

if (!$merchant_id) {
    return json_encode([
        "status" => "ERROR",
        "message" => "Merchant not authenticated"
    ]);
}

$campaignId = $data['campaignId'] ?? null;
if (!$campaignId) {
    return json_encode([
        "status" => "ERROR",
        "message" => "Campaign ID required"
    ]);
}

// Generate unique ID
$uniqueId = uniqid('qr_', true);
$qrUrl = $_ENV['APP_URL'] . "/validate/" . $uniqueId;

// Insert into qr_usage table
$query = "INSERT INTO qr_usage (id, qrCampaignId, uniqueId, createdAt) VALUES (UUID(), ?, ?, NOW())";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 'ss', $campaignId, $uniqueId);

if (mysqli_stmt_execute($stmt)) {
    return json_encode([
        "status" => "SUCCESS",
        "data" => [
            "uniqueId" => $uniqueId,
            "qrUrl" => $qrUrl
        ]
    ]);
} else {
    return json_encode([
        "status" => "ERROR",
        "message" => "Failed to generate QR code"
    ]);
}
```

**qr_usage/validate.php**
```php
<?php
global $dbconn, $data;

$uniqueId = $data['uniqueId'] ?? null;

if (!$uniqueId) {
    return json_encode([
        "status" => "ERROR",
        "message" => "Unique ID required"
    ]);
}

// Query QR usage with campaign and game details
$query = "SELECT
            qu.*,
            qc.merchant_id,
            qc.gameId,
            gc.game_name,
            gc.icon,
            qc.isOneTimeUse
          FROM qr_usage qu
          JOIN qr_campaigns qc ON qu.qrCampaignId = qc.id
          LEFT JOIN games_catalog gc ON qc.gameId = gc.id
          WHERE qu.uniqueId = ?";

$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 's', $uniqueId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$usage = mysqli_fetch_assoc($result);

if (!$usage) {
    return json_encode([
        "status" => "ERROR",
        "message" => "QR not found"
    ]);
}

if ($usage['isUsed'] && $usage['isOneTimeUse']) {
    return json_encode([
        "status" => "ERROR",
        "message" => "QR already used"
    ]);
}

return json_encode([
    "status" => "SUCCESS",
    "data" => [
        "valid" => true,
        "merchantId" => $usage['merchant_id'],
        "gameId" => $usage['gameId'],
        "gameCode" => $usage['game_code'],
        "gameName" => $usage['game_name'],
        "qrUsageId" => $usage['id']
    ]
]);
```

**profile_customer/upsert.php**
```php
<?php
global $dbconn, $data, $user_info;

use core\utils\log;

$user_data = json_decode($user_info, true);
$merchant_id = $user_data['merchant_id'] ?? null;

$name = $data['name'] ?? null;
$phone = $data['phone'] ?? null;
$instagram = $data['instagram'] ?? null;
$qrUsageId = $data['qrUsageId'] ?? null;

if (!$name || !$phone || !$merchant_id) {
    return json_encode([
        "status" => "ERROR",
        "message" => "Name, phone, and merchant ID required"
    ]);
}

// Check if customer exists
$query = "SELECT * FROM customers WHERE phone = ? AND merchant_id = ?";
$stmt = mysqli_prepare($dbconn, $query);
mysqli_stmt_bind_param($stmt, 'ss', $phone, $merchant_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$existingCustomer = mysqli_fetch_assoc($result);

if ($existingCustomer) {
    // Update existing customer
    $customerId = $existingCustomer['id'];
    $updateQuery = "UPDATE customers
                    SET name = ?, instagram = ?, last_play_date = NOW()
                    WHERE id = ?";
    $updateStmt = mysqli_prepare($dbconn, $updateQuery);
    mysqli_stmt_bind_param($updateStmt, 'sss', $name, $instagram, $customerId);
    mysqli_stmt_execute($updateStmt);
    $isNew = false;
} else {
    // Create new customer
    $customerId = uniqid('cust_', true);
    $insertQuery = "INSERT INTO customers
                    (id, merchant_id, name, phone, instagram, first_play_date, last_play_date, games_played, total_points)
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 0, 0)";
    $insertStmt = mysqli_prepare($dbconn, $insertQuery);
    mysqli_stmt_bind_param($insertStmt, 'sssss', $customerId, $merchant_id, $name, $phone, $instagram);
    mysqli_stmt_execute($insertStmt);
    $isNew = true;
}

// Link customer to QR usage if provided
if ($qrUsageId) {
    $updateUsageQuery = "UPDATE qr_usage SET customerId = ? WHERE id = ?";
    $updateUsageStmt = mysqli_prepare($dbconn, $updateUsageQuery);
    mysqli_stmt_bind_param($updateUsageStmt, 'ss', $customerId, $qrUsageId);
    mysqli_stmt_execute($updateUsageStmt);
}

return json_encode([
    "status" => "SUCCESS",
    "data" => [
        "customerId" => $customerId,
        "isNew" => $isNew
    ]
]);
```

#### QR Registration Page Example (using callApi)
```typescript
// app/play/qr-register/[uniqueId]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { callApi } from "@/lib/api-client"

export default function QRRegisterPage() {
  const params = useParams()
  const router = useRouter()
  const { uniqueId } = params

  const [gameInfo, setGameInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [playerData, setPlayerData] = useState({
    name: "",
    phone: "",
    instagram: ""
  })

  useEffect(() => {
    // Validate QR and get game info using callApi
    const validateQR = async () => {
      try {
        const response = await callApi('qr_usage', 'validate', {
          uniqueId: uniqueId
        })

        if (response.data?.status === 'SUCCESS') {
          setGameInfo(response.data.data)
        } else {
          router.push('/play/qr-not-found')
        }
      } catch (error) {
        console.error('QR validation failed:', error)
        router.push('/play/qr-not-found')
      }
    }

    validateQR()
  }, [uniqueId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create/update customer using callApi
      const response = await callApi('profile_customer', 'upsert', {
        name: playerData.name,
        phone: playerData.phone,
        instagram: playerData.instagram,
        qrUsageId: gameInfo.qrUsageId
      })

      if (response.data?.status === 'SUCCESS') {
        const { customerId } = response.data.data

        // Redirect to game using game_code for URL
        router.push(`/play/${gameInfo.merchantId}/${gameInfo.gameCode}?qr=${uniqueId}&customerId=${customerId}`)
      } else {
        throw new Error(response.data?.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!gameInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Show game preview */}
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Ready to Play {gameInfo.gameName}?</CardTitle>
          <CardDescription>
            Enter your details to start playing and win prizes!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={playerData.name}
                onChange={(e) => setPlayerData({...playerData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={playerData.phone}
                onChange={(e) => setPlayerData({...playerData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram (Optional)</Label>
              <Input
                id="instagram"
                value={playerData.instagram}
                onChange={(e) => setPlayerData({...playerData, instagram: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Start Playing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Security Considerations
1. **Unique ID Generation**
   - Use Node.js crypto.randomBytes (16 bytes = 32 hex chars)
   - Store uniqueId with UNIQUE constraint in database
   - Handle potential collisions gracefully

2. **Rate Limiting**
   - Implement rate limiting on API routes (using middleware)
   - Limit QR validation attempts per IP
   - Use Redis or memory store for rate limiting

3. **Authentication & Authorization**
   - Verify merchant session for QR management
   - Validate merchant ownership of QR campaigns
   - Use JWT tokens or session cookies

4. **Data Validation**
   - Validate inputs in PHP modules
   - Sanitize all database inputs using mysqli prepared statements
   - Validate QR code format (alphanumeric string)
   - Frontend validation using HTML5 form validation and JavaScript

### Testing Strategy
1. **Unit Tests** (Jest/Vitest)
   - QR code generation functions
   - Validation logic
   - Database queries

2. **Integration Tests** (Playwright/Selenium)
   - Complete QR creation flow
   - QR scanning to game completion
   - Error scenarios

3. **Load Testing**
   - Concurrent QR validations
   - Bulk QR generation
   - Database performance under load

### Migration Strategy
```sql
-- 1. Add new columns to existing qr_campaigns
ALTER TABLE qr_campaigns
ADD COLUMN gameId VARCHAR(50) NULL,
ADD COLUMN isOneTimeUse BOOLEAN DEFAULT FALSE,
ADD COLUMN maxUses INT DEFAULT 1,
ADD COLUMN currentUses INT DEFAULT 0;

-- 2. Create qr_usage table (see schema above)

-- 3. Backfill existing campaigns
UPDATE qr_campaigns
SET gameId = (SELECT game_code FROM games_catalog LIMIT 1)
WHERE gameId IS NULL;
```

### Success Metrics
1. Number of QR codes created per day
2. Conversion rate (unique scan → game completion)
3. Average time from QR creation to first use
4. Error rate in QR validation
5. Database query performance (<100ms for validation)

### Future Enhancements
1. **QR Code Analytics**
   - Integrate with existing daily_analytics table
   - Add qr_scans tracking
   - Geographic tracking via IP

2. **Advanced Features**
   - Multi-use QR codes (using maxUses field)
   - Time-based expiration
   - Custom QR designs

3. **Performance Optimizations**
   - Cache frequently accessed QR data
   - Use CDN for QR code images
   - Implement connection pooling

## Conclusion
This refined implementation plan aligns with your existing:
- MySQL database schema (with proper field names and relationships)
- PHP-based API architecture (using modules in `/api/v1/request/modules/`)
- Next.js frontend (using App Router and existing `callApi` pattern)
- Authentication system (session-based with merchant users)

The plan leverages your current structure while adding the requested one-time use QR code functionality. The implementation uses PHP modules for backend operations, maintains security best practices with prepared statements, and integrates seamlessly with your existing games catalog and customer management systems.