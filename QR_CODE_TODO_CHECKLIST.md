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
  - [ ] `list.php` - List QR campaigns (GET via POST)
  - [ ] `read.php` - Get single QR campaign
  - [ ] `update.php` - Update QR campaign
  - [ ] `delete.php` - Delete QR campaign (soft delete)
  - [x] `generate.php` - Generate unique QR code

- [x] Create `api/v1/request/modules/qr_usage/` module
  - [x] `main.php` - Main class with run() method
  - [x] `validate.php` - Validate QR code before use
  - [x] `mark_used.php` - Mark QR as used after game
  - [ ] `check_status.php` - Check QR status

- [ ] Update `api/v1/request/modules/profile_customer/` module (existing)
  - [ ] Add `upsert.php` - Create/update customer record
  - [ ] Add `find_by_phone.php` - Find customer by phone number
  - [ ] Note: profile_customer module already exists

- [ ] Create `api/v1/request/modules/games_catalog/` module (if not exists)
  - [ ] `list.php` - List available games for merchant
  - [ ] `read.php` - Get game details

### Frontend API Integration
- [x] Update `lib/api-client.ts` to include QR code functions
  - [x] `generateQRCode(campaignId)` function
  - [x] `validateQRCode(uniqueId)` function
  - [x] `upsertCustomer(customerData)` function
  - [x] `getQRCampaigns()` function
  - [x] `createQRCampaign(campaignData)` function

## Phase 2: Frontend Updates (Next.js App Router)

### QR Code Creation Dialog Enhancement
- [ ] Update `app/dashboard/qr-codes/page.tsx` dialog
  - [ ] Replace mock data with real API calls
  - [ ] Fetch available games using `callApi('merchant_games', 'list')`
  - [ ] Display games from games_catalog table
  - [ ] Show game icons (emoji from icon field)

- [ ] Add game-specific settings panel
  - [ ] Use game_settings from database for defaults
  - [ ] Difficulty selector (easy/medium/hard)
  - [ ] Time limit input for applicable games
  - [ ] Custom reward points multiplier

- [ ] Add one-time use toggle
  - [ ] Checkbox component for isOneTimeUse
  - [ ] Conditional maxUses input field
  - [ ] Update form validation

- [ ] Add expiration date picker
  - [ ] Use existing UI date picker
  - [ ] Optional field with clear button
  - [ ] Min date validation (today)

- [ ] Update create QR code function
  - [ ] Use `callApi('qr_campaigns', 'create')`
  - [ ] After successful creation, call `callApi('qr_campaigns', 'generate')`
  - [ ] Display generated QR code URL

### QR Codes Table Updates
- [ ] Add game column to table
  - [ ] Display game_name from games_catalog
  - [ ] Show game icon from icon field
  - [ ] Use game badge colors based on category

- [ ] Add usage status column
  - [ ] Show "currentUses/maxUses" for multi-use
  - [ ] Show "Used/Unused" for one-time codes
  - [ ] Progress bar component for usage

- [ ] Add visual indicators
  - [ ] Badge for unused (green)
  - [ ] Badge for used (red)
  - [ ] Badge for expired (gray)

- [ ] Update actions menu
  - [ ] Add "View Analytics" navigation
  - [ ] Add "Duplicate QR Code" feature
  - [ ] Keep existing download/copy features

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
- [ ] Create `app/validate/[uniqueId]/page.tsx`
  - [ ] Call `/api/qr-codes/validate/[uniqueId]`
  - [ ] Loading spinner while checking
  - [ ] Show error page if invalid (not found, used, expired)
  - [ ] If valid, redirect to player registration page with QR context

- [ ] Create `app/play/qr-register/[uniqueId]/page.tsx`
  - [ ] Create new registration page specifically for QR codes
  - [ ] Reuse existing player form design from `/play/[merchantId]/page.tsx`
  - [ ] Include fields: Full Name, Phone Number, Instagram (optional)
  - [ ] Add QR code context display (show which game they'll play)
  - [ ] Store QR uniqueId in form state
  - [ ] On submit, create/update customer record with QR association
  - [ ] Redirect to `/play/[merchantId]/[gameId]?qr=[uniqueId]`

- [ ] Update player info collection API
  - [ ] Use existing `callApi('profile_customer', 'upsert')`
  - [ ] Pass QR usage ID to link customer
  - [ ] Handle new vs existing customer logic

- [ ] Create QR game preview component
  - [ ] Show game data from games_catalog
  - [ ] Display instructions field
  - [ ] Show potential rewards from game_prizes
  - [ ] "Start Game" button to game page

### Game Play Page Updates
- [ ] Update `app/play/[merchantId]/game/[gameId]/page.tsx`
  - [ ] Check for QR code in query params
  - [ ] If QR present, verify customer is registered
  - [ ] Pass game_settings from qr_campaigns
  - [ ] Pass customer info from registration
  - [ ] Handle one-time use restriction

- [ ] Add QR code middleware check
  - [ ] Create middleware.ts to check QR status
  - [ ] Verify QR is not already used
  - [ ] Ensure customer is registered for this QR
  - [ ] Redirect to registration if missing customer info
  - [ ] Create game_sessions record on game start

- [ ] Mark QR code after completion
  - [ ] Call `callApi('qr_usage', 'mark_used')`
  - [ ] Include final score and customer ID
  - [ ] Update qr_campaigns.currentUses
  - [ ] Update customer.games_played and total_points
  - [ ] Create loyalty_transactions entry if points awarded

### QR Code Status Pages
- [ ] Create `app/play/qr-used/page.tsx`
  - [ ] Friendly message for used codes
  - [ ] Show usage timestamp
  - [ ] Option to contact merchant
  - [ ] Link to store front

- [ ] Create `app/play/qr-expired/page.tsx`
  - [ ] Show expiration details
  - [ ] Display merchant contact info
  - [ ] Promotional message for new codes

- [ ] Create `app/play/qr-not-found/page.tsx`
  - [ ] 404 page for invalid QR codes
  - [ ] Helpful error message
  - [ ] Option to try again

### Error Handling
- [ ] Create error components
  - [ ] QRNotFound component
  - [ ] QRExpired component
  - [ ] QRAlreadyUsed component
  - [ ] ServerError component

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

### Minimum Viable Product (MVP)
- [ ] Basic QR code creation with game selection
- [ ] One-time use functionality
- [ ] Simple validation flow
- [ ] Basic tracking and analytics

### Post-MVP
- [ ] Bulk operations
- [ ] Advanced analytics
- [ ] Templates
- [ ] A/B testing
- [ ] Geographic/time restrictions

---

Remember to update this checklist as you progress through implementation!