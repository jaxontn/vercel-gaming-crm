-- =====================================================
-- Simplified Gamified CRM Database Schema
-- MySQL 8.0+ Compatible
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS gamified_crm
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gamified_crm;

-- =====================================================
-- Core User Management Tables
-- =====================================================

-- Merchants table
CREATE TABLE merchants (
    id VARCHAR(255) PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Merchant users table
CREATE TABLE merchant_users (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- =====================================================
-- Customer Management
-- =====================================================

-- Customers table
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    instagram VARCHAR(100),
    avatar_url VARCHAR(500),
    age_group VARCHAR(20) COMMENT 'demographic info',
    gender VARCHAR(20) COMMENT 'demographic info',
    location VARCHAR(100) COMMENT 'city/state for regional analytics',
    total_points INT DEFAULT 0,
    games_played INT DEFAULT 0,
    last_play_date TIMESTAMP NULL,
    first_play_date TIMESTAMP NULL,
    total_session_duration INT DEFAULT 0 COMMENT 'total time spent in seconds',
    average_session_duration DECIMAL(10,2) DEFAULT 0 COMMENT 'average session time in seconds',
    preferred_game_type VARCHAR(50) COMMENT 'most played game type',
    engagement_score DECIMAL(10,2) DEFAULT 0 COMMENT 'calculated engagement metric',
    customer_segment VARCHAR(20) DEFAULT 'new' COMMENT '"new", "active", "loyal", "at_risk"',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- =====================================================
-- QR Campaigns
-- =====================================================

-- QR Campaigns table
CREATE TABLE qr_campaigns (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100) NOT NULL,
    qr_url VARCHAR(500) NOT NULL,
    qr_code_image VARCHAR(500),
    landing_page_url VARCHAR(500),
    game_settings JSON,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    budget DECIMAL(15,2) COMMENT 'campaign budget',
    total_spent DECIMAL(15,2) DEFAULT 0,
    target_audience JSON COMMENT 'age range, gender, location targeting',
    total_scans INT DEFAULT 0,
    unique_scans INT DEFAULT 0,
    total_participants INT DEFAULT 0 COMMENT 'unique users who played games',
    data_collected INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue_generated DECIMAL(15,2) DEFAULT 0,
    target_roi DECIMAL(5,2) COMMENT 'target return on investment',
    actual_roi DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activated_at TIMESTAMP NULL,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES merchant_users(id)
);

-- =====================================================
-- Game System
-- =====================================================

-- Game sessions table
CREATE TABLE game_sessions (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    campaign_id VARCHAR(255) NULL,
    game_type VARCHAR(50) NOT NULL COMMENT '"spin-win", "memory-match", "lucky-dice", "quick-tap", "word-puzzle", "color-match"',
    points_earned INT DEFAULT 0,
    session_duration INT,
    score INT DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'medium' COMMENT '"easy", "medium", "hard"',
    was_completed BOOLEAN DEFAULT FALSE,
    prize_won VARCHAR(255) NULL COMMENT 'prize id if user won something',
    game_data JSON COMMENT 'game-specific data (moves, taps, words_found, colors_matched, etc.)',
    device_info JSON COMMENT 'device type, OS, browser for analytics',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES qr_campaigns(id) ON DELETE SET NULL
);

-- Game prizes table
CREATE TABLE game_prizes (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    prize_name VARCHAR(255) NOT NULL,
    prize_description TEXT,
    prize_type VARCHAR(50) NOT NULL COMMENT '"points", "discount", "free_item", "voucher", "badge"',
    game_type VARCHAR(50) COMMENT 'specific game this prize applies to, null for all games',
    prize_value JSON COMMENT 'points_amount, discount_percentage, item_value, etc.',
    win_probability DECIMAL(3,2) DEFAULT 0 COMMENT 'probability of winning (0-1)',
    quantity_available INT,
    quantity_won INT DEFAULT 0,
    min_score_required INT COMMENT 'minimum score to win this prize',
    difficulty_required VARCHAR(20) DEFAULT 'medium' COMMENT '"easy", "medium", "hard"',
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- Game settings table
CREATE TABLE game_settings (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    daily_play_limit INT DEFAULT 5,
    base_points INT DEFAULT 10,
    difficulty VARCHAR(20) DEFAULT 'medium',
    configuration JSON COMMENT 'game-specific configuration',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- =====================================================
-- Leaderboards
-- =====================================================

-- Leaderboards table
CREATE TABLE leaderboards (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    game_type VARCHAR(50),
    period_type VARCHAR(20) DEFAULT 'alltime' COMMENT '"daily", "weekly", "monthly", "alltime"',
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    rank_position INT NOT NULL,
    best_score INT DEFAULT 0,
    games_played INT DEFAULT 0,
    total_points INT DEFAULT 0,
    achievement VARCHAR(255),
    previous_rank INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- =====================================================
-- Analytics
-- =====================================================

-- Daily analytics table
CREATE TABLE daily_analytics (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    campaign_id VARCHAR(255) NULL,
    date DATE NOT NULL,
    total_sessions INT DEFAULT 0,
    unique_users INT DEFAULT 0,
    new_users INT DEFAULT 0,
    returning_users INT DEFAULT 0,
    qr_scans INT DEFAULT 0,
    game_sessions INT DEFAULT 0,
    games_completed INT DEFAULT 0,
    total_points_awarded INT DEFAULT 0,
    total_prizes_won INT DEFAULT 0,
    loyalty_points_earned INT DEFAULT 0,
    loyalty_points_redeemed INT DEFAULT 0,
    challenges_completed INT DEFAULT 0,
    avg_session_duration INT,
    engagement_rate DECIMAL(5,2) DEFAULT 0 COMMENT 'percentage of active users who played games',
    retention_rate DECIMAL(5,2) DEFAULT 0 COMMENT 'percentage of users who returned',
    conversion_rate DECIMAL(5,2) DEFAULT 0 COMMENT 'percentage of users who completed desired action',
    revenue_generated DECIMAL(15,2) DEFAULT 0,
    campaign_roi DECIMAL(5,2) DEFAULT 0,
    demographic_breakdown JSON COMMENT 'age, gender, location analytics',
    game_type_breakdown JSON COMMENT 'sessions per game type',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES qr_campaigns(id) ON DELETE SET NULL
);

-- =====================================================
-- Loyalty System
-- =====================================================

-- Loyalty rules table
CREATE TABLE loyalty_rules (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL COMMENT '"earn", "redeem", "milestone"',
    points_required INT DEFAULT 0,
    points_awarded INT DEFAULT 0,
    action_required VARCHAR(100) COMMENT '"game_play", "daily_login", "referral", "purchase"',
    action_data JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- Loyalty transactions table
CREATE TABLE loyalty_transactions (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    merchant_id VARCHAR(255) NOT NULL,
    rule_id VARCHAR(255) NULL,
    transaction_type VARCHAR(50) NOT NULL COMMENT '"earned", "redeemed"',
    points_change INT NOT NULL,
    current_balance INT NOT NULL,
    transaction_description VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES loyalty_rules(id) ON DELETE SET NULL
);

-- Loyalty rewards table
CREATE TABLE loyalty_rewards (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    reward_name VARCHAR(255) NOT NULL,
    reward_description TEXT,
    reward_type VARCHAR(50) NOT NULL COMMENT '"discount", "free_item", "voucher", "points_multiplier"',
    points_cost INT NOT NULL,
    reward_value JSON COMMENT 'discount_percentage, item_value, multiplier_value, etc.',
    redemption_instructions TEXT,
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT,
    usage_limit INT COMMENT 'max redemptions per customer',
    total_redemptions INT DEFAULT 0,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- =====================================================
-- Challenges System
-- =====================================================

-- Challenges table
CREATE TABLE challenges (
    id VARCHAR(255) PRIMARY KEY,
    merchant_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL COMMENT '"game_master", "points_collector", "daily_streak", "social"',
    target_value INT NOT NULL,
    reward_points INT NOT NULL,
    reward_type VARCHAR(50),
    badge_icon VARCHAR(100),
    badge_color VARCHAR(50),
    difficulty_level VARCHAR(20) DEFAULT 'medium' COMMENT '"easy", "medium", "hard"',
    max_participants INT,
    current_participants INT DEFAULT 0,
    completion_count INT DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- User challenges table
CREATE TABLE user_challenges (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    challenge_id VARCHAR(255) NOT NULL,
    current_progress INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    reward_claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

-- =====================================================
-- Indexes for Performance Optimization
-- =====================================================

-- Merchants table indexes
CREATE UNIQUE INDEX idx_merchants_email ON merchants(email);
CREATE INDEX idx_merchants_created_at ON merchants(created_at);

-- Merchant users table indexes
CREATE INDEX idx_merchant_users_merchant_id ON merchant_users(merchant_id);
CREATE INDEX idx_merchant_users_email ON merchant_users(email);

-- Customers table indexes
CREATE UNIQUE INDEX idx_customers_merchant_phone ON customers(merchant_id, phone);
CREATE INDEX idx_customers_merchant_points ON customers(merchant_id, total_points);
CREATE INDEX idx_customers_merchant_created_at ON customers(merchant_id, created_at);
CREATE INDEX idx_customers_merchant_segment ON customers(merchant_id, customer_segment);
CREATE INDEX idx_customers_merchant_engagement ON customers(merchant_id, engagement_score);
CREATE INDEX idx_customers_demographics ON customers(age_group, gender, location);

-- QR Campaigns table indexes
CREATE INDEX idx_qr_campaigns_merchant_status ON qr_campaigns(merchant_id, status);
CREATE INDEX idx_qr_campaigns_merchant_created_at ON qr_campaigns(merchant_id, created_at);
CREATE INDEX idx_qr_campaigns_merchant_scans ON qr_campaigns(merchant_id, total_scans);
CREATE INDEX idx_qr_campaigns_merchant_conversion ON qr_campaigns(merchant_id, conversion_rate);
CREATE INDEX idx_qr_campaigns_type ON qr_campaigns(campaign_type);

-- Game sessions table indexes
CREATE INDEX idx_game_sessions_customer_completed ON game_sessions(customer_id, completed_at);
CREATE INDEX idx_game_sessions_campaign_completed ON game_sessions(campaign_id, completed_at);
CREATE INDEX idx_game_sessions_type_completed ON game_sessions(game_type, completed_at);
CREATE INDEX idx_game_sessions_points ON game_sessions(points_earned);
CREATE INDEX idx_game_sessions_difficulty ON game_sessions(difficulty_level);
CREATE INDEX idx_game_sessions_prize ON game_sessions(prize_won);

-- Game prizes table indexes
CREATE INDEX idx_game_prizes_merchant_game ON game_prizes(merchant_id, game_type);
CREATE INDEX idx_game_prizes_active ON game_prizes(is_active);
CREATE INDEX idx_game_prizes_probability ON game_prizes(win_probability);
CREATE INDEX idx_game_prizes_min_score ON game_prizes(min_score_required);

-- Game settings table indexes
CREATE INDEX idx_game_settings_merchant_game ON game_settings(merchant_id, game_type);
CREATE INDEX idx_game_settings_active ON game_settings(is_active);

-- Leaderboards table indexes
CREATE INDEX idx_leaderboards_merchant_period_rank ON leaderboards(merchant_id, period_type, rank_position);
CREATE INDEX idx_leaderboards_customer_period ON leaderboards(customer_id, period_type, period_end);
CREATE INDEX idx_leaderboards_game_period_rank ON leaderboards(game_type, period_type, rank_position);
CREATE INDEX idx_leaderboards_points ON leaderboards(total_points);

-- Daily analytics table indexes
CREATE UNIQUE INDEX idx_daily_analytics_merchant_date ON daily_analytics(merchant_id, date);
CREATE UNIQUE INDEX idx_daily_analytics_campaign_date ON daily_analytics(campaign_id, date);

-- Loyalty rules table indexes
CREATE INDEX idx_loyalty_rules_merchant_type ON loyalty_rules(merchant_id, rule_type);
CREATE INDEX idx_loyalty_rules_active ON loyalty_rules(is_active);

-- Loyalty transactions table indexes
CREATE INDEX idx_loyalty_transactions_customer_created ON loyalty_transactions(customer_id, created_at);
CREATE INDEX idx_loyalty_transactions_merchant_created ON loyalty_transactions(merchant_id, created_at);
CREATE INDEX idx_loyalty_transactions_type ON loyalty_transactions(transaction_type);

-- Loyalty rewards table indexes
CREATE INDEX idx_loyalty_rewards_merchant_active ON loyalty_rewards(merchant_id, is_active);
CREATE INDEX idx_loyalty_rewards_points_cost ON loyalty_rewards(points_cost);
CREATE INDEX idx_loyalty_rewards_type ON loyalty_rewards(reward_type);

-- Challenges table indexes
CREATE INDEX idx_challenges_merchant_type ON challenges(merchant_id, challenge_type);
CREATE INDEX idx_challenges_active ON challenges(is_active);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty_level);

-- User challenges table indexes
CREATE INDEX idx_user_challenges_customer_challenge ON user_challenges(customer_id, challenge_id);
CREATE INDEX idx_user_challenges_completed ON user_challenges(is_completed);
CREATE INDEX idx_user_challenges_customer_completed ON user_challenges(customer_id, is_completed);

-- =====================================================
-- Game Sessions - Game Prizes relationship
-- =====================================================

-- Add foreign key constraint for game_sessions.prize_won
ALTER TABLE game_sessions
ADD CONSTRAINT fk_game_sessions_prize_won
FOREIGN KEY (prize_won) REFERENCES game_prizes(id) ON DELETE SET NULL;

-- =====================================================
-- Views for Common Queries
-- =====================================================

-- Customer summary view
CREATE VIEW v_customer_summary AS
SELECT
    c.id,
    c.merchant_id,
    c.name,
    c.phone,
    c.email,
    c.total_points,
    c.games_played,
    c.customer_segment,
    c.engagement_score,
    c.last_play_date,
    COUNT(DISTINCT gs.id) as recent_games,
    AVG(gs.score) as avg_score
FROM customers c
LEFT JOIN game_sessions gs ON c.id = gs.customer_id
    AND gs.completed_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY c.id, c.merchant_id, c.name, c.phone, c.email, c.total_points,
         c.games_played, c.customer_segment, c.engagement_score, c.last_play_date;

-- Campaign performance view
CREATE VIEW v_campaign_performance AS
SELECT
    qc.id,
    qc.merchant_id,
    qc.name,
    qc.campaign_type,
    qc.total_scans,
    qc.unique_scans,
    qc.total_participants,
    qc.conversion_rate,
    qc.revenue_generated,
    qc.budget,
    qc.total_spent,
    COUNT(DISTINCT gs.id) as total_game_sessions,
    COUNT(DISTINCT gs.customer_id) as unique_players,
    AVG(gs.score) as avg_game_score,
    COUNT(DISTINCT CASE WHEN gs.prize_won IS NOT NULL THEN gs.id END) as prizes_won
FROM qr_campaigns qc
LEFT JOIN game_sessions gs ON qc.id = gs.campaign_id
GROUP BY qc.id, qc.merchant_id, qc.name, qc.campaign_type,
         qc.total_scans, qc.unique_scans, qc.total_participants,
         qc.conversion_rate, qc.revenue_generated, qc.budget, qc.total_spent;

-- Daily metrics view
CREATE VIEW v_daily_metrics AS
SELECT
    da.id,
    da.merchant_id,
    da.date,
    da.total_sessions,
    da.unique_users,
    da.game_sessions,
    da.games_completed,
    da.total_points_awarded,
    da.engagement_rate,
    da.retention_rate,
    da.revenue_generated,
    CASE
        WHEN da.total_sessions > 0 THEN (da.games_completed / da.total_sessions) * 100
        ELSE 0
    END as completion_rate
FROM daily_analytics da;

-- =====================================================
-- Sample Data for Testing (Optional)
-- =====================================================

-- Insert sample merchant
-- INSERT INTO merchants (id, business_name, contact_name, email, password_hash)
-- VALUES
-- ('merchant_001', 'Bella Boutique', 'John Doe', 'john@bellaboutique.com', 'hashed_password_here');

-- =====================================================
-- Stored Procedures for Common Operations
-- =====================================================

DELIMITER //

-- Update customer engagement score
CREATE PROCEDURE UpdateCustomerEngagementScore(IN customer_id VARCHAR(255))
BEGIN
    DECLARE total_sessions INT DEFAULT 0;
    DECLARE avg_duration DECIMAL(10,2) DEFAULT 0;
    DECLARE recent_activity INT DEFAULT 0;
    DECLARE new_score DECIMAL(10,2) DEFAULT 0;

    -- Get customer statistics
    SELECT
        COUNT(*) as sessions,
        AVG(session_duration) as avg_duration,
        COUNT(CASE WHEN completed_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) THEN 1 END) as recent
    INTO total_sessions, avg_duration, recent_activity
    FROM game_sessions
    WHERE customer_id = customer_id AND was_completed = TRUE;

    -- Calculate engagement score (0-100)
    SET new_score = (
        LEAST(total_sessions * 2, 40) +
        LEAST(avg_duration / 60, 20) +
        LEAST(recent_activity * 10, 30) +
        LEAST((SELECT total_points FROM customers WHERE id = customer_id) / 100, 10)
    );

    -- Update customer
    UPDATE customers
    SET engagement_score = new_score,
        customer_segment = CASE
            WHEN new_score >= 80 THEN 'loyal'
            WHEN new_score >= 50 THEN 'active'
            WHEN new_score >= 20 THEN 'engaged'
            ELSE 'at_risk'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = customer_id;
END //

-- Generate daily analytics
CREATE PROCEDURE GenerateDailyAnalytics(IN merchant_id VARCHAR(255), IN analytics_date DATE)
BEGIN
    DECLARE existing_count INT DEFAULT 0;

    -- Check if analytics already exist
    SELECT COUNT(*) INTO existing_count
    FROM daily_analytics
    WHERE merchant_id = merchant_id AND date = analytics_date;

    IF existing_count = 0 THEN
        INSERT INTO daily_analytics (
            id, merchant_id, date, total_sessions, unique_users, new_users,
            returning_users, game_sessions, games_completed, total_points_awarded,
            avg_session_duration, engagement_rate, created_at
        )
        SELECT
            CONCAT(DATE_FORMAT(analytics_date, '%Y%m%d'), '_', merchant_id),
            merchant_id,
            analytics_date,
            COUNT(DISTINCT gs.id) as total_sessions,
            COUNT(DISTINCT gs.customer_id) as unique_users,
            COUNT(DISTINCT CASE WHEN c.first_play_date = analytics_date THEN gs.customer_id END) as new_users,
            COUNT(DISTINCT CASE WHEN c.first_play_date < analytics_date THEN gs.customer_id END) as returning_users,
            COUNT(DISTINCT CASE WHEN gs.game_type IS NOT NULL THEN gs.id END) as game_sessions,
            COUNT(DISTINCT CASE WHEN gs.was_completed = TRUE THEN gs.id END) as games_completed,
            COALESCE(SUM(gs.points_earned), 0) as total_points_awarded,
            COALESCE(AVG(gs.session_duration), 0) as avg_session_duration,
            CASE
                WHEN COUNT(DISTINCT gs.customer_id) > 0 THEN
                    (COUNT(DISTINCT CASE WHEN gs.game_type IS NOT NULL THEN gs.customer_id END) / COUNT(DISTINCT gs.customer_id)) * 100
                ELSE 0
            END as engagement_rate,
            CURRENT_TIMESTAMP
        FROM merchants m
        LEFT JOIN customers c ON m.id = c.merchant_id
        LEFT JOIN game_sessions gs ON c.id = gs.customer_id
            AND DATE(gs.started_at) = analytics_date
        WHERE m.id = merchant_id
        GROUP BY m.id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- Triggers for Data Integrity
-- =====================================================

-- Update customer game statistics
DELIMITER //
CREATE TRIGGER tr_game_session_after_insert
AFTER INSERT ON game_sessions
FOR EACH ROW
BEGIN
    -- Update customer games played
    UPDATE customers
    SET games_played = games_played + 1,
        total_points = total_points + NEW.points_earned,
        last_play_date = NEW.started_at,
        total_session_duration = total_session_duration + COALESCE(NEW.session_duration, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;

    -- Update first play date if this is the first game
    UPDATE customers
    SET first_play_date = NEW.started_at
    WHERE id = NEW.customer_id AND first_play_date IS NULL;
END //
DELIMITER ;

-- Update campaign participation statistics
DELIMITER //
CREATE TRIGGER tr_campaign_session_after_insert
AFTER INSERT ON game_sessions
FOR EACH ROW
BEGIN
    IF NEW.campaign_id IS NOT NULL THEN
        UPDATE qr_campaigns
        SET total_participants = total_participants + 1
        WHERE id = NEW.campaign_id;
    END IF;
END //
DELIMITER ;

-- Update challenge progress
DELIMITER //
CREATE TRIGGER tr_challenge_progress_update
AFTER INSERT ON game_sessions
FOR EACH ROW
BEGIN
    -- Update relevant challenges (example: game_master challenge)
    UPDATE user_challenges uc
    SET current_progress = current_progress + 1,
        is_completed = CASE
            WHEN current_progress + 1 >= (SELECT target_value FROM challenges WHERE id = uc.challenge_id)
            THEN TRUE
            ELSE uc.is_completed
        END,
        completed_at = CASE
            WHEN current_progress + 1 >= (SELECT target_value FROM challenges WHERE id = uc.challenge_id) AND uc.completed_at IS NULL
            THEN CURRENT_TIMESTAMP
            ELSE uc.completed_at
        END
    WHERE EXISTS (
        SELECT 1 FROM challenges c
        WHERE c.id = uc.challenge_id
        AND c.challenge_type = 'game_master'
        AND c.is_active = TRUE
        AND CURRENT_TIMESTAMP BETWEEN c.start_date AND c.end_date
    )
    AND uc.customer_id = NEW.customer_id
    AND uc.is_completed = FALSE;
END //
DELIMITER ;

-- =====================================================
-- Schema Version and Metadata
-- =====================================================

-- Create schema metadata table
CREATE TABLE schema_metadata (
    id INT PRIMARY KEY DEFAULT 1,
    version VARCHAR(50) DEFAULT '1.0.0',
    description TEXT DEFAULT 'Simplified Gamified CRM Database Schema',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial metadata
INSERT INTO schema_metadata (id, version, description)
VALUES (1, '1.0.0', 'Simplified Gamified CRM Database Schema - Initial Version');

-- =====================================================
-- Performance Optimization Recommendations
-- =====================================================

/*
Performance Optimization Notes:

1. Regular Maintenance:
   - Run ANALYZE TABLE on all tables weekly
   - Optimize indexes monthly
   - Archive old game sessions (> 1 year) to separate archive table

2. Monitoring:
   - Monitor slow query log for optimization opportunities
   - Track index usage and remove unused indexes
   - Monitor table sizes and consider partitioning for large tables

3. Scaling Considerations:
   - Consider partitioning game_sessions by date for very large datasets
   - Use read replicas for analytics queries
   - Implement caching for frequently accessed leaderboards

4. Backup Strategy:
   - Daily full backups
   - Binary log for point-in-time recovery
   - Regular backup restoration testing

5. Security:
   - Enable MySQL SSL/TLS
   - Regular security updates
   - Audit user access and permissions
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================