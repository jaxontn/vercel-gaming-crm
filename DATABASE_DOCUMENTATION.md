# Gamified CRM Database Documentation

## Overview

This document provides comprehensive documentation for the Gamified CRM database architecture, aligned with `simplified_database_schema.sql` and `simplified_database_architecture.dbml`. All table definitions, relationships, and features reflect the actual implemented schema.

## Database Architecture

### Project Details
- **Project Name**: Gamified_CRM
- **Database Type**: MySQL 8.0+
- **Architecture Pattern**: Relational with JSON flexibility for game-specific data
- **Schema Files**:
  - `simplified_database_schema.sql` - Complete SQL schema with indexes, triggers, and procedures
  - `simplified_database_architecture.dbml` - Visual database model with relationships

---

## Table-by-Table Documentation

### 1. Core User Management Tables

#### `merchants`
**Purpose**: Stores business/merchant account information
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique merchant identifier
- `business_name` - Business name (required)
- `contact_name` - Primary contact person (required)
- `email` - Business email (unique, required)
- `phone` - Contact phone number
- `password_hash` - Encrypted password (required)
- `logo_url` - Company logo URL
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Dashboard**: Merchant profile and settings
- **Campaigns**: Campaign ownership and permissions
- **Analytics**: Business-level metrics and reporting

---

#### `merchant_users`
**Purpose**: Individual user accounts within merchant organizations
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique user identifier
- `merchant_id` - Reference to merchants table (required)
- `name` - User full name (required)
- `email` - User email (required)
- `role` - User role (default: 'admin')
- `created_at` - Account creation timestamp

**Used by Pages**:
- **Dashboard**: User authentication and permissions
- **Campaigns**: User access control and audit trails

---

### 2. Customer Management

#### `customers`
**Purpose**: Complete customer profile with engagement tracking
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique customer identifier
- `merchant_id` - Reference to merchants table (required)
- `name` - Customer name (required)
- `phone` - Phone number (required, unique per merchant)
- `email` - Customer email
- `instagram` - Instagram handle
- `avatar_url` - Profile picture URL
- `age_group` - Demographic information
- `gender` - Demographic information
- `location` - City/state for regional analytics
- `total_points` - Current loyalty points balance
- `games_played` - Total games played count
- `last_play_date` - Last game session timestamp
- `first_play_date` - First game session timestamp
- `total_session_duration` - Cumulative time spent (seconds)
- `average_session_duration` - Average session time (seconds)
- `preferred_game_type` - Most played game
- `engagement_score` - Calculated engagement metric
- `customer_segment` - Segment: "new", "active", "loyal", "at_risk"
- `is_active` - Account status
- `created_at` - Customer creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Dashboard**: Customer engagement metrics and segmentation
- **Customer Data**: Complete customer profiles and demographics
- **Analytics**: Customer behavior and demographic analysis
- **Gamification Pages**: Player data and leaderboards

---

### 3. Campaign Management

#### `qr_campaigns`
**Purpose**: QR code campaigns with comprehensive tracking
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique campaign identifier
- `merchant_id` - Reference to merchants table (required)
- `name` - Campaign name (required)
- `description` - Campaign description
- `campaign_type` - Type of campaign (required)
- `qr_url` - QR code destination URL (required)
- `qr_code_image` - QR code image file
- `landing_page_url` - Custom landing page
- `game_settings` - JSON configuration for games
- `start_date` - Campaign start (required)
- `end_date` - Campaign end (optional)
- `budget` - Campaign budget
- `total_spent` - Amount spent so far
- `target_audience` - JSON: age range, gender, location targeting
- `total_scans` - Total QR code scans
- `unique_scans` - Unique user scans
- `total_participants` - Users who played games
- `data_collected` - Amount of data collected
- `conversion_rate` - Campaign conversion percentage
- `revenue_generated` - Revenue from campaign
- `target_roi` - Target return on investment
- `actual_roi` - Actual ROI achieved
- `status` - Campaign status (default: 'draft')
- `created_by` - Reference to merchant_users table (required)
- `created_at` - Campaign creation timestamp
- `updated_at` - Last update timestamp
- `activated_at` - Campaign activation timestamp

**Used by Pages**:
- **Campaigns**: Complete campaign management and performance tracking
- **Dashboard**: Active campaign overview and ROI metrics
- **Analytics**: Campaign performance and ROI analysis

---

### 4. Game System

#### `game_sessions`
**Purpose**: Individual game session tracking
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique session identifier
- `customer_id` - Reference to customers table (required)
- `campaign_id` - Reference to qr_campaigns table (optional)
- `game_type` - Game type (required): "spin-win", "memory-match", "lucky-dice", "quick-tap", "word-puzzle", "color-match"
- `points_earned` - Points earned in session
- `session_duration` - Session time in seconds
- `score` - Game-specific score
- `difficulty_level` - Difficulty: "easy", "medium", "hard"
- `was_completed` - Session completion status
- `prize_won` - Reference to game_prizes table
- `game_data` - JSON: game-specific data (moves, taps, words_found, colors_matched, etc.)
- `device_info` - JSON: device type, OS, browser
- `started_at` - Session start timestamp
- `completed_at` - Session completion timestamp

**Used by Pages**:
- **Gamification Pages**: User game data tables and performance analytics
- **Dashboard**: Real-time gaming activity
- **Analytics**: Game performance and user engagement metrics

#### `game_prizes`
**Purpose**: Prize configuration for games
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique prize identifier
- `merchant_id` - Reference to merchants table (required)
- `prize_name` - Prize name (required)
- `prize_description` - Prize description
- `prize_type` - Type (required): "points", "discount", "free_item", "voucher", "badge"
- `game_type` - Specific game (null for all games)
- `prize_value` - JSON: points_amount, discount_percentage, item_value
- `win_probability` - Probability of winning (0-1)
- `quantity_available` - Available quantity
- `quantity_won` - Total quantity won
- `min_score_required` - Minimum score to win
- `difficulty_required` - Required difficulty (default: 'medium')
- `is_active` - Prize status
- `start_date` - Prize availability start
- `end_date` - Prize availability end
- `created_at` - Prize creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Gamification Pages**: Prize management and win tracking
- **Dashboard**: Prize distribution analytics
- **Analytics**: Prize performance and cost analysis

#### `game_settings`
**Purpose**: Game configuration per merchant
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique settings identifier
- `merchant_id` - Reference to merchants table (required)
- `game_type` - Game type (required)
- `is_active` - Game enabled status
- `daily_play_limit` - Daily plays per user (default: 5)
- `base_points` - Base points for playing (default: 10)
- `difficulty` - Default difficulty (default: 'medium')
- `configuration` - JSON: game-specific settings
- `created_at` - Settings creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Gamification Pages**: Game configuration and settings management
- **Dashboard**: Game availability and rules

---

### 5. Leaderboards

#### `leaderboards`
**Purpose**: Player rankings and achievements
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique leaderboard entry
- `merchant_id` - Reference to merchants table (required)
- `customer_id` - Reference to customers table (required)
- `game_type` - Specific game or null for overall
- `period_type` - Time period (default: 'alltime'): "daily", "weekly", "monthly", "alltime"
- `period_start` - Period start timestamp (required)
- `period_end` - Period end timestamp (required)
- `rank_position` - Current rank (required)
- `best_score` - Best score achieved
- `games_played` - Games played in period
- `total_points` - Points earned in period
- `achievement` - Achievement description
- `previous_rank` - Previous period rank
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Gamification Pages**: Leaderboard displays and rank tracking
- **Dashboard**: Top performers and competitive insights
- **Analytics**: Competitive engagement metrics

---

### 6. Analytics

#### `daily_analytics`
**Purpose**: Comprehensive daily analytics
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique analytics entry
- `merchant_id` - Reference to merchants table (required)
- `campaign_id` - Reference to qr_campaigns table (optional)
- `date` - Analytics date (required)
- `total_sessions` - Total user sessions
- `unique_users` - Unique users count
- `new_users` - New user registrations
- `returning_users` - Returning user count
- `qr_scans` - QR code scans
- `game_sessions` - Game sessions played
- `games_completed` - Completed games
- `total_points_awarded` - Points given to users
- `total_prizes_won` - Total prizes won
- `loyalty_points_earned` - Loyalty points earned
- `loyalty_points_redeemed` - Loyalty points redeemed
- `challenges_completed` - Completed challenges
- `avg_session_duration` - Average session time
- `engagement_rate` - Active users who played games (percentage)
- `retention_rate` - Users who returned (percentage)
- `conversion_rate` - Users who completed desired action (percentage)
- `revenue_generated` - Revenue from activities
- `campaign_roi` - Campaign return on investment
- `demographic_breakdown` - JSON: age, gender, location analytics
- `game_type_breakdown` - JSON: sessions per game type
- `created_at` - Analytics creation timestamp

**Used by Pages**:
- **Analytics**: Complete business intelligence and reporting
- **Dashboard**: Real-time metrics and KPIs
- **Campaigns**: Campaign performance tracking

---

### 7. Loyalty System

#### `loyalty_rules`
**Purpose**: Rules for earning and redeeming points
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique rule identifier
- `merchant_id` - Reference to merchants table (required)
- `rule_name` - Rule name (required)
- `rule_type` - Rule type (required): "earn", "redeem", "milestone"
- `points_required` - Points needed for action
- `points_awarded` - Points given for action
- `action_required` - Trigger action: "game_play", "daily_login", "referral", "purchase"
- `action_data` - JSON: additional action parameters
- `is_active` - Rule status
- `created_at` - Rule creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Loyalty Points**: Rule management and configuration
- **Dashboard**: Loyalty program performance
- **Analytics**: Loyalty program effectiveness

#### `loyalty_transactions`
**Purpose**: Individual loyalty point transactions
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique transaction identifier
- `customer_id` - Reference to customers table (required)
- `merchant_id` - Reference to merchants table (required)
- `rule_id` - Reference to loyalty_rules table
- `transaction_type` - Type (required): "earned", "redeemed"
- `points_change` - Points added/removed (required)
- `current_balance` - Balance after transaction (required)
- `transaction_description` - Human-readable description
- `metadata` - JSON: additional transaction data
- `created_at` - Transaction timestamp

**Used by Pages**:
- **Loyalty Points**: Transaction history and point balances
- **Customer Data**: Customer loyalty activity
- **Analytics**: Loyalty program analytics

#### `loyalty_rewards`
**Purpose**: Rewards catalog for point redemption
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique reward identifier
- `merchant_id` - Reference to merchants table (required)
- `reward_name` - Reward name (required)
- `reward_description` - Reward description
- `reward_type` - Type (required): "discount", "free_item", "voucher", "points_multiplier"
- `points_cost` - Points needed to redeem (required)
- `reward_value` - JSON: discount_percentage, item_value, multiplier_value
- `redemption_instructions` - How to claim reward
- `terms_conditions` - Reward terms and conditions
- `is_active` - Reward availability
- `stock_quantity` - Available stock
- `usage_limit` - Max redemptions per customer
- `total_redemptions` - Total times redeemed
- `start_date` - Reward availability start
- `end_date` - Reward availability end
- `created_at` - Reward creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Loyalty Points**: Rewards catalog and redemption management
- **Dashboard**: Popular rewards and redemption trends
- **Analytics**: Reward performance and cost analysis

---

### 8. Challenges System

#### `challenges`
**Purpose**: Gamified challenges for engagement
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique challenge identifier
- `merchant_id` - Reference to merchants table (required)
- `title` - Challenge title (required)
- `description` - Challenge description
- `challenge_type` - Type (required): "game_master", "points_collector", "daily_streak", "social"
- `target_value` - Goal to achieve (required)
- `reward_points` - Points awarded (required)
- `reward_type` - Type of reward
- `badge_icon` - Badge icon identifier
- `badge_color` - Badge color theme
- `difficulty_level` - Difficulty (default: 'medium'): "easy", "medium", "hard"
- `max_participants` - Maximum participants
- `current_participants` - Current participant count
- `completion_count` - Times challenge completed
- `start_date` - Challenge start (required)
- `end_date` - Challenge end (required)
- `is_active` - Challenge status
- `created_at` - Challenge creation timestamp
- `updated_at` - Last update timestamp

**Used by Pages**:
- **Challenges**: Challenge management and configuration
- **Dashboard**: Active challenges and participation
- **Analytics**: Challenge effectiveness and engagement

#### `user_challenges`
**Purpose**: Individual user challenge progress
**Primary Key**: id (varchar)

**Fields**:
- `id` - Unique user challenge entry
- `customer_id` - Reference to customers table (required)
- `challenge_id` - Reference to challenges table (required)
- `current_progress` - Progress towards goal (default: 0)
- `is_completed` - Completion status (default: false)
- `completed_at` - Completion timestamp
- `reward_claimed` - Reward claimed status (default: false)
- `claimed_at` - Reward claim timestamp
- `started_at` - Challenge start timestamp

**Used by Pages**:
- **Challenges**: User progress tracking and leaderboards
- **Customer Data**: Individual challenge participation
- **Dashboard**: Challenge completion statistics

---

## Page-to-Table Mapping Summary

### Dashboard
**Primary Tables**:
- `merchants` - Business profile
- `daily_analytics` - Real-time KPIs and metrics
- `customers` - Engagement overview
- `qr_campaigns` - Active campaign status
- `game_sessions` - Gaming activity
- `leaderboards` - Top performers
- `loyalty_transactions` - Loyalty activity
- `challenges` - Active challenges

### Campaigns
**Primary Tables**:
- `qr_campaigns` - Complete campaign management
- `daily_analytics` - Campaign performance
- `merchants` - Campaign ownership
- `merchant_users` - Created by tracking
- `customers` - Participant data
- `game_sessions` - Campaign gaming activity

### Customer Data
**Primary Tables**:
- `customers` - Complete customer profiles
- `game_sessions` - Gaming behavior
- `loyalty_transactions` - Loyalty activity
- `user_challenges` - Challenge participation
- `leaderboards` - Competitive performance

### Analytics
**Primary Tables**:
- `daily_analytics` - Comprehensive analytics
- `customers` - Demographic analysis
- `qr_campaigns` - Campaign ROI
- `game_sessions` - Game performance
- `loyalty_transactions` - Loyalty metrics
- `game_prizes` - Prize analytics

### Gamification Pages
**Primary Tables**:
- `game_sessions` - User game data and performance
- `game_settings` - Game configuration
- `game_prizes` - Prize management
- `leaderboards` - Rankings and achievements
- `customers` - Player profiles
- `daily_analytics` - Game-specific analytics

### Loyalty Points
**Primary Tables**:
- `loyalty_rules` - Point earning rules
- `loyalty_transactions` - Transaction history
- `loyalty_rewards` - Rewards catalog
- `customers` - Point balances
- `daily_analytics` - Loyalty program metrics

### Challenges
**Primary Tables**:
- `challenges` - Challenge management
- `user_challenges` - Progress tracking
- `customers` - Participant data
- `daily_analytics` - Challenge performance
- `leaderboards` - Challenge rankings

---

## JSON Field Usage

### Flexible Data Storage

Several tables use JSON fields for flexible data storage:

**game_sessions.game_data**:
- Spin & Win: `{"spin_results": ["red", "blue", "green"], "multiplier": 2}`
- Memory Match: `{"moves": 25, "matches_found": 8, "accuracy": 85}`
- Lucky Dice: `{"dice_rolls": [6, 4, 5], "total": 15}`
- Quick Tap: `{"taps": 45, "accuracy": 92, "time_limit": 30}`
- Word Puzzle: `{"words_found": ["game", "play", "win"], "hints_used": 1}`
- Color Match: `{"colors_matched": 12, "accuracy": 88, "level": 3}`

**qr_campaigns.game_settings**:
- Game-specific configurations
- Prize distributions
- Difficulty settings

**qr_campaigns.target_audience**:
- Age range targeting
- Gender preferences
- Geographic targeting

**daily_analytics.demographic_breakdown**:
- Age group participation
- Gender distribution
- Regional analytics

**daily_analytics.game_type_breakdown**:
- Sessions per game type
- Average scores per game
- Popular times for each game

---

## Indexes and Performance

The database includes strategic indexes for optimal performance:

- **Unique indexes** for data integrity (merchant emails, customer phones)
- **Composite indexes** for common query patterns (merchant + date, customer + created_at)
- **Performance indexes** for sorting and filtering (points, scores, timestamps)

These indexes ensure fast response times for:
- Leaderboard queries
- Analytics reporting
- Customer searches
- Campaign performance tracking

---

## Advanced Database Features

### Views

The schema includes three pre-defined views for common queries:

#### `v_customer_summary`
**Purpose**: Customer profiles with recent game activity and performance metrics
**Access**: `SELECT * FROM v_customer_summary WHERE merchant_id = ?`
**Fields**: Customer profile + recent games count + average score
**Used by**: Customer data pages and analytics dashboards

#### `v_campaign_performance`
**Purpose**: Campaign metrics with game session data and prize statistics
**Access**: `SELECT * FROM v_campaign_performance WHERE merchant_id = ?`
**Fields**: Campaign details + total game sessions + unique players + average score + prizes won
**Used by**: Campaign management and performance analytics

#### `v_daily_metrics`
**Purpose**: Daily analytics with calculated completion rates and performance metrics
**Access**: `SELECT * FROM v_daily_metrics WHERE merchant_id = ? AND date >= ?`
**Fields**: Daily analytics + calculated completion rate + engagement metrics
**Used by**: Analytics and reporting dashboards

### Stored Procedures

#### `UpdateCustomerEngagementScore(customer_id)`
**Purpose**: Automatically calculates and updates customer engagement scores
**Triggers**: Called via database triggers after game sessions
**Logic**:
- Engagement score = (sessions × 2, max 40) + (avg_duration ÷ 60, max 20) + (recent_activity × 10, max 30) + (points ÷ 100, max 10)
- Updates customer_segment: 'loyal' (80+), 'active' (50+), 'engaged' (20+), 'at_risk' (below)

#### `GenerateDailyAnalytics(merchant_id, analytics_date)`
**Purpose**: Aggregates daily analytics from raw game session data
**Usage**: Scheduled job or manual execution for daily reporting
**Features**: Prevents duplicate analytics, calculates all daily metrics automatically

### Triggers

#### `tr_game_session_after_insert`
**Purpose**: Updates customer statistics after each game session
**Actions**: Increments games_played, adds points, updates last_play_date, adds session duration, sets first_play_date

#### `tr_campaign_session_after_insert`
**Purpose**: Tracks campaign participation when game sessions are linked to campaigns
**Actions**: Increments total_participants in qr_campaigns table

#### `tr_challenge_progress_update`
**Purpose**: Updates challenge progress for game_master type challenges
**Actions**: Increments current_progress, marks completion when target reached, records completion timestamp

---

## Data Relationships

The database maintains referential integrity through foreign key relationships with specific delete behaviors:

- **Customers** → `merchants.id` (ON DELETE CASCADE) - Customer data removed when merchant deleted
- **Game Sessions** → `customers.id` (ON DELETE CASCADE) - Game sessions removed with customer
- **Game Sessions** → `qr_campaigns.id` (ON DELETE SET NULL) - Campaign reference nullified, sessions preserved
- **All Tables** → merchant-specific foreign keys with appropriate cascade behaviors
- **Challenge Progress** → `challenges.id` (ON DELETE CASCADE) - Progress removed with challenge

This design ensures data consistency while maintaining audit trails for analytics.

---

## Security & Performance

### Security Features
- Passwords stored as encrypted hashes in `merchants.password_hash`
- Phone numbers are unique per merchant (`(merchant_id, phone)` unique index)
- Personal data (email, demographics) are optional fields
- Audit trails via `created_by` fields and automatic timestamps
- JSON fields allow flexible data without schema changes

### Performance Optimization
- **Strategic Indexes**: 50+ indexes optimized for common query patterns
- **Composite Indexes**: Multi-column indexes for frequent filter combinations
- **Unique Indexes**: Data integrity for emails and phone numbers
- **Query Performance**: Optimized for leaderboard queries, analytics reporting, and customer searches

---

## Foreign Key Behaviors

| Relationship | Delete Behavior | Purpose |
|-------------|---------------|---------|
| `merchant_users.merchant_id` → `merchants.id` | CASCADE | Remove users when merchant deleted |
| `customers.merchant_id` → `merchants.id` | CASCADE | Remove customers when merchant deleted |
| `qr_campaigns.merchant_id` → `merchants.id` | CASCADE | Remove campaigns when merchant deleted |
| `qr_campaigns.created_by` → `merchant_users.id` | CASCADE | Handle user deletion |
| `game_sessions.customer_id` → `customers.id` | CASCADE | Remove sessions when customer deleted |
| `game_sessions.campaign_id` → `qr_campaigns.id` | SET NULL | Preserve sessions, nullify campaign reference |
| `game_sessions.prize_won` → `game_prizes.id` | SET NULL | Preserve session data, remove prize reference |

---

## Schema Version & Maintenance

### Version Control
- **Current Version**: 1.0.0 (stored in `schema_metadata` table)
- **Migration Strategy**: Use TypeORM migrations or custom migration scripts
- **Change Tracking**: All tables include `created_at` and `updated_at` timestamps

### Maintenance Recommendations
1. **Weekly**: Run `ANALYZE TABLE` on all tables for query optimization
2. **Monthly**: Review index usage and remove unused indexes
3. **Quarterly**: Archive old game sessions (>1 year) to archive tables
4. **Monitoring**: Track slow query logs, table sizes, and connection performance

---

## Data Integrity Features

### Automatic Calculations
- **Engagement Scores**: Automatically calculated and updated via triggers
- **Customer Segmentation**: Dynamic categorization based on activity patterns
- **Session Statistics**: Real-time aggregation of game performance metrics
- **Campaign ROI**: Automatic calculation of return on investment metrics

### Validation & Constraints
- **Unique Constraints**: Prevent duplicate emails and phone numbers per merchant
- **Foreign Key Constraints**: Ensure data relationships are maintained
- **Check Constraints**: Automatic updates ensure consistent data across related tables
- **Trigger-based Updates**: Maintain consistency between related data points

---

## JSON Field Implementation

All JSON fields support structured data storage with specific formats:

- **`qr_campaigns.game_settings`**: Game configurations and prize distributions
- **`qr_campaigns.target_audience`**: Age range, gender, location targeting parameters
- **`game_sessions.game_data`**: Game-specific metrics (moves, taps, scores, etc.)
- **`game_sessions.device_info`**: Device type, OS, browser for analytics
- **`daily_analytics.demographic_breakdown`**: Age, gender, location analytics breakdown
- **`daily_analytics.game_type_breakdown`**: Sessions and metrics per game type
- **Loyalty JSON fields**: Rules, transactions, and rewards with structured metadata
