# QR Code Implementation Todo Checklist

## Completed Tasks ✅
### Phase 1: Database Schema Updates
- [x] qr_campaigns table updated with new fields
- [x] qr_usage table created
- [x] Foreign key relationships established

## Remaining Tasks

## Phase 1: Backend API Preparation (PHP Modules)

### Database Schema Updates
- [x] Execute SQL to add QR code fields to qr_campaigns table
  ```sql
  ALTER TABLE qr_campaigns
  ADD COLUMN gameId VARCHAR(36) NULL,
  ADD COLUMN isOneTimeUse BOOLEAN DEFAULT FALSE,
  ADD COLUMN maxUses INT DEFAULT 1,
  ADD COLUMN currentUses INT DEFAULT 0;
  ```
  Note: gameId references games_catalog.id (not game_code)

- [x] Note: qr_campaigns already has `qr_url`, `campaign_type`, `created_by`, `qr_code_image` fields
- [x] Note: customers table has both merchant_id and merchantId fields (use merchant_id)
- [x] Fixed table name issue: Changed `profile_customer` to `customers` in public PHP endpoints

- [x] Create QR usage tracking table
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

### PHP Module Creation
- [x] Create `api/v1/request/modules/qr_campaigns/` module
  - [x] `main.php` - Main class with run() method
  - [x] `create.php` - Create new QR campaign (POST)
  - [x] `list.php` - List QR campaigns (GET via POST)
  - [x] `read.php` - Get single QR campaign
  - [x] `update.php` - Update QR campaign
  - [x] `delete.php` - Delete QR campaign (soft delete)
  - [x] `generate.php` - Generate unique QR code

- [x] Create `api/v1/request/modules/qr_usage/` module
  - [x] `main.php` - Main class with run() method
  - [x] `validate.php` - Validate QR code before use
  - [x] `mark_used.php` - Mark QR as used after game
  - [x] `check_status.php` - Check QR status

- [x] Update `api/v1/request/modules/profile_customer/` module (existing)
  - [x] Add `upsert.php` - Create/update customer record
  - [x] Add `find_by_phone.php` - Find customer by phone number
  - [x] Note: profile_customer module already exists

- [x] Create `api/v1/request/modules/games_catalog/` module (if not exists)
  - [x] `list.php` - List available games for merchant
  - [x] `read.php` - Get game details

### Public API Endpoints (No Authentication Required)
- [x] Create `api/v1/qr-validate.php` - Public QR validation endpoint
- [x] Create `api/v1/customer-find-by-phone-public.php` - Public customer lookup
- [x] Create `api/v1/customer-upsert-public.php` - Public customer creation/update
- [x] Create `api/v1/qr-check-status.php` - Check QR usage status
- [x] Create `api/v1/qr-mark-used.php` - Mark QR as used

### Frontend API Integration
- [x] Update `lib/api-client.ts` to include QR code functions
  - [x] `generateQRCode(campaignId)` function
  - [x] `validateQRCode(uniqueId)` function
  - [x] `upsertCustomer(customerData)` function
  - [x] `getQRCampaigns()` function
  - [x] `createQRCampaign(campaignData)` function
  - [x] `publicValidateQRCode(uniqueId)` - Public QR validation
  - [x] `publicFindCustomerByPhone(phone, merchantId)` - Public customer lookup
  - [x] `publicUpsertCustomer(customerData)` - Public customer creation
  - [x] `publicMarkQRUsed(data)` - Public QR mark as used
  - [x] `publicCheckQRStatus(uniqueId)` - Public QR status check

## Phase 2: Frontend Updates (Next.js App Router)

### QR Code Creation Dialog Enhancement
- [x] Update `app/dashboard/qr-codes/page.tsx` dialog
  - [x] Replace mock data with real API calls
  - [x] Fetch available games using `callApi('merchant_games', 'list')`
  - [x] Display games from games_catalog table
  - [x] Show game icons (emoji from icon field)

- [ ] Add game-specific settings panel
  - [ ] Use game_settings from database for defaults
  - [ ] Difficulty selector (easy/medium/hard)
  - [ ] Time limit input for applicable games
  - [ ] Custom reward points multiplier

- [x] Add one-time use toggle
  - [x] Button toggle for isOneTimeUse
  - [x] Conditional maxUses input field
  - [x] Update form validation

- [x] Add expiration date picker
  - [x] Use existing UI date picker
  - [x] Optional field with clear button
  - [x] Min date validation (today)

- [x] Update create QR code function
  - [x] Use `callApi('qr_campaigns', 'create')`
  - [x] After successful creation, call `callApi('qr_campaigns', 'generate')`
  - [x] Display generated QR code URL

### QR Codes Table Updates
- [x] Add game column to table
  - [x] Display game_name from games_catalog
  - [x] Show game icon from icon field
  - [ ] Use game badge colors based on category

- [x] Add usage status column
  - [x] Show "currentUses/maxUses" for multi-use
  - [x] Show "Used/Unused" for one-time codes
  - [x] Badge component for usage type

- [x] Add visual indicators
  - [x] Badge for status (active/paused/expired)
  - [x] Usage count display

- [ ] Update actions menu
  - [ ] Add "View Analytics" navigation
  - [ ] Add "Duplicate QR Code" feature
  - [x] Keep existing download/copy features

### Game Selection Component
- [ ] Create `components/GameSelector.tsx`
  - [ ] Grid layout for game cards
  - [ ] Fetch from games_catalog API
  - [ ] Filter by merchant_games.enabled

- [ ] Create `components/GameCard.tsx`
  - [ ] Display game data from games_catalog
  - [ ] Show category badges
  - [ ] Handle selection state

- [ ] Create `components/GameSettings.tsx`
  - [ ] Dynamic form based on game_code
  - [ ] Use merchant_games.custom_config
  - [ ] Form integration with react-hook-form

### QR Code List Updates
- [ ] Add filtering options
  - [ ] Filter by game_type (games_catalog)
  - [ ] Filter by usage status
  - [ ] Filter by date range

- [ ] Add sorting options
  - [ ] Sort by creation date
  - [ ] Sort by total_scans
  - [ ] Sort by conversion_rate

## Phase 3: Game Integration (App Router)

### QR Code Validation Flow
- [x] Create `app/validate/[uniqueId]/page.tsx` (Redirects to qr-register)
- [x] Create `app/play/qr-register/[uniqueId]/page.tsx`
  - [x] Create new registration page specifically for QR codes
  - [x] Use public API endpoints for QR validation and customer operations
  - [x] Include fields: Full Name, Phone Number, Instagram (optional), Email
  - [x] Add QR code context display (show which game they'll play)
  - [x] Direct redirect to specific game attached to QR code
  - [x] Map database game codes to frontend routes
  - [x] Store customer info in localStorage for game

- [x] Update player info collection API
  - [x] Use public API endpoints (no authentication required)
  - [x] Pass QR usage ID to link customer
  - [x] Handle new vs existing customer logic
  - [x] Fixed table name issue (customers vs profile_customer)

- [x] Create QR game preview component
  - [x] Show game data from games_catalog
  - [x] Display game icons using emoji mapping
  - [x] Show game preview in registration form

### Game Play Page Updates
- [x] Update `app/play/[merchantId]/game/[gameId]/page.tsx`
  - [x] Check for QR code in query params
  - [x] Load customer info from localStorage
  - [x] Handle QR status check on page load
  - [x] Show "Thank You for Playing" if QR already used
  - [x] Mark QR as used immediately when page loads
  - [x] Use public API for QR operations
  - [x] Added "Scan Another QR Code" button with camera scanner

- [x] QR Code Scanner Implementation
  - [x] Create `components/qr-scanner.tsx` component
  - [x] Create `app/play/[merchantId]/scan/page.tsx` page
  - [x] Request camera permissions
  - [x] Handle Safari-specific camera requirements
  - [x] Add manual QR entry fallback
  - [x] Redirect to game after successful scan

- [x] Mark QR code after page load (not after completion)
  - [x] Use `publicMarkQRUsed` API
  - [x] Mark immediately when game page loads
  - [x] Prevents QR code reuse
  - [x] Includes customer info in QR usage record

### QR Code Status Pages
- [x] Create `app/play/qr-used/page.tsx`
  - [x] Friendly message for used codes
  - [x] Show usage timestamp
  - [x] Option to contact merchant
  - [x] Link to store front

- [x] Create `app/play/qr-expired/page.tsx`
  - [x] Show expiration details
  - [x] Display merchant contact info
  - [x] Promotional message for new codes

- [x] Create `app/play/qr-not-found/page.tsx`
  - [x] 404 page for invalid QR codes
  - [x] Helpful error message
  - [x] Option to try again

### Error Handling
- [x] Create error components
  - [x] QRNotFound component
  - [x] QRExpired component
  - [x] QRAlreadyUsed component (integrated into game page)
  - [x] ServerError component

### Additional Implementation Notes
- [x] Fixed API port issue (was calling localhost:3000 instead of localhost:8080)
- [x] Added game code mapping between database and frontend
  - Database: `spin-win`, `memory-match` → Frontend: `spin-wheel`, `memory-cards`
- [x] Added QR code scanning feature with camera access
- [x] Implemented QR reuse protection
- [x] Added games catalog entries
  ```sql
  INSERT INTO games_catalog (game_code, game_name, icon) VALUES
    ('spin-win', 'Spin & Win', 'spinner'),
    ('memory-match', 'Memory Match', 'brain'),
    ('lucky-dice', 'Lucky Dice', 'dice'),
    ('quick-tap', 'Quick Tap Challenge', 'hand-pointer'),
    ('word-puzzle', 'Word Puzzle', 'book'),
    ('color-match', 'Color Match', 'palette');
  ```

## Phase 4: Additional Features

### Bulk QR Code Generation
- [ ] Create bulk creation dialog
  - [ ] Number input for quantity
  - [ ] Prefix/suffix options
  - [ ] Progress bar during creation
  - [ ] Preview before generation

- [ ] Add bulk download functionality
  - [ ] PDF generation
  - [ ] ZIP file with all QR codes
  - [ ] CSV with QR code details
  - [ ] Email download link

- [ ] Create bulk management interface
  - [ ] Select multiple QR codes
  - [ ] Bulk status changes
  - [ ] Bulk export
  - [ ] Bulk deletion

### QR Code Analytics Dashboard
- [ ] Create analytics page
  - [ ] Total QR codes created
  - [ ] Usage statistics
  - [ ] Conversion rates
  - [ ] Time to first use

- [ ] Add visual charts
  - [ ] Line chart for usage over time
  - [ ] Pie chart for game distribution
  - [ ] Bar chart for success rates
  - [ ] Heat map for usage times

- [ ] Create detailed analytics per QR code
  - [ ] Individual QR code page
  - [ ] Full usage history
  - [ ] Player information
  - [ ] Export option

### QR Code Templates
- [ ] Create template management
  - [ ] Save current configuration
  - [ ] List saved templates
  - [ ] Quick create from template
  - [ ] Edit/delete templates

- [ ] Add preset templates
  - [ ] "Weekend Special" template
  - [ ] "Store Launch" template
  - [ ] "Loyalty Reward" template
  - [ ] Custom template creation

### Advanced Features
- [ ] Multi-use QR codes
  - [ ] Configurable usage limit
  - [ ] Usage countdown display
  - [ ] Different expiration rules
  - [ ] Bulk usage tracking

- [ ] Geographic restrictions
  - [ ] Country/region limits
  - [ ] IP-based detection
  - [ ] GPS location check (mobile)
  - [ ] Whitelist/blacklist

- [ ] Time-based usage windows
  - [ ] Start/end times
  - [ ] Recurring windows
  - [ ] Time zone handling
  - [ ] Usage caps per hour/day

- [ ] A/B Testing for QR codes
  - [ ] Create test groups
  - [ ] Split traffic automatically
  - [ ] Compare performance metrics
  - [ ] Statistical significance

## Testing

### Unit Tests
- [ ] QR code generation logic
- [ ] Unique ID collision detection
- [ ] Validation functions
- [ ] API endpoint responses
- [ ] Game selection logic

### Integration Tests
- [ ] Full QR code creation flow
- [ ] QR code scanning to game completion
- [ ] Database operations
- [ ] Error handling scenarios
- [ ] Rate limiting functionality

### End-to-End Tests
- [ ] Merchant creates QR code
- [ ] Customer scans QR code
- [ ] Customer plays and completes game
- [ ] QR code becomes unusable
- [ ] Analytics reflect usage

### Performance Tests
- [ ] Bulk QR code generation
- [ ] Concurrent validation requests
- [ ] Database query optimization
- [ ] API response times

## Documentation

### API Documentation
- [ ] Document all new endpoints
- [ ] Include request/response examples
- [ ] Add error code definitions
- [ ] Create OpenAPI spec

### User Documentation
- [ ] Merchant guide for QR codes
- [ ] Game descriptions and settings
- [ ] Analytics interpretation guide
- [ ] Troubleshooting section

### Developer Documentation
- [ ] Code architecture explanation
- [ ] Database schema documentation
- [ ] Deployment instructions
- [ ] Security considerations

## Security

### Security Implementation
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] HTTPS enforcement

### Security Testing
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Access control testing
- [ ] Data validation testing

## Deployment

### Deployment Tasks
- [ ] Database migration scripts
- [ ] Environment variables setup
- [ ] CI/CD pipeline updates
- [ ] Monitoring setup
- [ ] Log aggregation
- [ ] Backup procedures

### Rollout Plan
- [ ] Feature flags implementation
- [ ] Staged rollout strategy
- [ ] Rollback procedures
- [ ] User communication plan

---

## Quick Start Checklist

### Minimum Viable Product (MVP) ✅ COMPLETED
- [x] Basic QR code creation with game selection
- [x] One-time use functionality
- [x] Simple validation flow
- [x] Basic tracking and analytics
- [x] QR code scanning feature
- [x] Customer registration flow
- [x] Direct game access from QR
- [x] QR reuse prevention

### Completed Features ✅
- [x] Full QR code campaign management
- [x] Public API endpoints for QR operations
- [x] Customer data collection and tracking
- [x] Game integration with QR codes
- [x] Camera-based QR scanner
- [x] QR status checking (used/unused)
- [x] Error handling for invalid QRs
- [x] Thank you pages for used QRs

### Post-MVP (Future Enhancements)
- [ ] Bulk operations
- [ ] Advanced analytics
- [ ] Templates
- [ ] A/B testing
- [ ] Geographic/time restrictions
- [ ] QR code expiry dates
- [ ] Multi-use QR codes
- [ ] QR code analytics dashboard

---

**✨ MVP Status: COMPLETED! The core QR code functionality is fully implemented and working.**