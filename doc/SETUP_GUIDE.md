# Authentication System Setup Guide

## Prerequisites

- Node.js 16+
- MySQL 8.0+
- PHP 8.0+
- Composer (for PHP dependencies)

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE gamified_crm;
USE gamified_crm;
```

### 2. Import Schema
```bash
# Import the main database schema
mysql -u username -p gamified_crm < api/database_schema/gamified_crm_2025-12-03.sql

# Create API log table
mysql -u username -p gamified_crm < api/database_schema/create_api_log_table.sql
```

### 3. Create User Session Table
```sql
-- Create user_session table for callApi authentication
CREATE TABLE `user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `session_secret` varchar(64) NOT NULL,
  `device` varchar(100) DEFAULT 'web',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_accessed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_secret` (`session_secret`),
  FOREIGN KEY (`user_id`) REFERENCES `merchant_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
```

## Backend Setup

### 1. Configure Database Connection

Edit the following files with your database credentials:

#### `api/v1/request/modules/merchants/authenticate.php`
```php
$dbconn = new mysqli(
    'your_host',        // e.g., localhost
    'your_username',    // e.g., root
    'your_password',    // your database password
    'gamified_crm',     // database name
    3307                // port
);
```

#### `api/v1/request/core/database/my_sql.php`
Update your database configuration in the MySQL connection class.

### 2. Set Up PHP Dependencies

```bash
cd api/v1/request
composer install
```

### 3. Configure Web Server

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### Nginx
```nginx
location /api {
    try_files $uri $uri/ /api/v1/request/index.php?$query_string;
}
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create `.env.local` in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Optional: Different environments
# NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Configuration Details

### API Endpoints Structure

```
/api/v1/
├── authenticate.php          # Login/Registration (Direct Auth)
└── request/                  # Secured APIs (Hash-based Auth)
    ├── index.php            # Main router
    ├── core/                # Core classes
    │   ├── database/        # Database handlers
    │   ├── security/        # Authentication
    │   └── utils/           # Utilities
    └── modules/             # API modules
        └── merchants/
            └── authenticate.php
```

### Authentication Flow

1. **Registration**
   - POST to `/api/v1/authenticate.php` with `action: 'register'`
   - Creates merchant and merchant_user records
   - Returns success confirmation

2. **Login**
   - POST to `/api/v1/authenticate.php` with `action: 'login'`
   - Validates credentials
   - Generates JWT token and session secret
   - Stores session in `user_session` table

3. **API Calls**
   - Use `callApi()` function from frontend
   - Automatically generates hash using session secret
   - Validates hash on backend
   - Executes requested module/method

## Testing the Setup

### 1. Test Database Connection

Create a test file `api/test_db.php`:
```php
<?php
$dbconn = new mysqli('localhost', 'username', 'password', 'gamified_crm', 3307);

if ($dbconn->connect_error) {
    die("Connection failed: " . $dbconn->connect_error);
}

echo "Database connected successfully!";
?>
```

Access via browser: `http://localhost/api/test_db.php`

### 2. Test Registration

```bash
curl -X POST http://localhost/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "business_name": "Test Business",
    "contact_name": "John Doe",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "securepassword123"
  }'
```

### 3. Test Login

```bash
curl -X POST http://localhost/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

Expected response:
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "...",
    "session": {
      "user_id": "...",
      "session_secret": "..."
    }
  }
}
```

## Security Configuration

### 1. CORS Headers

The system is configured to accept requests from any origin. For production, update the headers:

#### `api/v1/authenticate.php`
```php
header("Access-Control-Allow-Origin: https://your-domain.com");
```

#### `api/v1/request/index.php`
```php
header("Access-Control-Allow-Origin: https://your-domain.com");
```

### 2. HTTPS

Always use HTTPS in production. Update your `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

### 3. Session Security

- Session secrets are generated using `random_bytes(32)`
- Hashes use MD5 with session secret for request signing
- Sessions can be revoked by deleting from `user_session` table

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Check port
netstat -tlnp | grep :3307
```

#### 2. Hash Validation Failed
- Verify session_secret is stored correctly
- Check JSON normalization between frontend and backend
- Ensure consistent data formatting

#### 3. CORS Errors
- Check Origin header configuration
- Verify preflight OPTIONS requests are handled

#### 4. Authentication Not Working
```javascript
// Debug stored credentials
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User ID:', localStorage.getItem('auth_user_id'));
console.log('Session Secret:', localStorage.getItem('auth_session_secret'));
```

### Log Files

Check PHP error logs:
```bash
# Ubuntu/Debian
tail -f /var/log/apache2/error.log

# CentOS/RHEL
tail -f /var/log/httpd/error_log

# Or check PHP error log location in php.ini
```

### Debug Mode

Enable debug mode in PHP files by uncommenting:
```php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
```

## Production Deployment

### 1. Environment Variables

Create production `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=gamified_crm
DB_USER=production_user
DB_PASS=secure_password

# API
API_BASE_URL=https://your-domain.com/api/v1
JWT_SECRET=your_jwt_secret_key
```

### 2. SSL Configuration

```apache
# Apache SSL configuration
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

### 3. Performance Optimization

- Enable OPcache in PHP
- Use Redis for session storage
- Implement API rate limiting
- Set up proper caching headers

### 4. Backup Strategy

```bash
# Database backup
mysqldump -u username -p gamified_crm > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p'password' gamified_crm | gzip > /backups/backup_$DATE.sql.gz
```

## Monitoring

### API Health Check

Create `api/health.php`:
```php
<?php
header('Content-Type: application/json');

try {
    $dbconn = new mysqli('localhost', 'username', 'password', 'gamified_crm', 3307);

    echo json_encode([
        'status' => 'healthy',
        'database' => $dbconn->connect_error ? 'error' : 'connected',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'unhealthy',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
```

### Monitoring API Usage

The system logs all API calls to the `api_log` table. Monitor with:
```sql
SELECT
    api_module,
    method,
    COUNT(*) as call_count,
    action_user_id,
    created_date
FROM api_log
WHERE created_date >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY api_module, method, action_user_id
ORDER BY call_count DESC;
```

This setup guide should help you get the authentication system running smoothly. Let me know if you encounter any issues during setup!