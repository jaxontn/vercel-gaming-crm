# Testing Checklist - Authentication System

## 🧪 Test Plan Overview

This checklist helps verify that the complete authentication system is working correctly.

## 1. Database Setup Verification

### ✅ Check Tables Exist
```sql
-- Run these commands to verify tables
SHOW TABLES LIKE 'merchant_users';
SHOW TABLES LIKE 'user_session';
SHOW TABLES LIKE 'merchants';
```

### ✅ Check Table Structure
```sql
-- Verify merchant_users structure
DESCRIBE merchant_users;

-- Verify user_session structure
DESCRIBE user_session;
```

## 2. Backend API Testing

### ✅ Test Registration Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "business_name": "Test Business LLC",
    "contact_name": "John Doe",
    "email": "john.test@example.com",
    "phone": "+1234567890",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "status": "SUCCESS",
  "message": "Registration successful",
  "data": {
    "merchant_id": "merchant_xxx",
    "user_id": "user_xxx"
  }
}
```

### ✅ Test Login Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "email": "john.test@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_xxx",
      "merchant_id": "merchant_xxx",
      "email": "john.test@example.com",
      "name": "John",
      "role": "admin",
      "is_owner": 1
    },
    "token": "jwt_token_here",
    "session": {
      "user_id": "user_xxx",
      "session_secret": "64_character_hex_string"
    }
  }
}
```

### ✅ Verify Session Created

**Check database:**
```sql
SELECT * FROM user_session WHERE user_id = 'user_xxx';
```

**Expected:** One row with the session_secret from login response

## 3. Frontend Testing

### ✅ Test Registration Page

1. Navigate to: `http://localhost:3000/register`
2. Fill out the form:
   - Business Name: "Test Company"
   - Contact Name: "Jane Smith"
   - Email: "jane@test.com"
   - Phone: "9876543210"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
3. Click "Create Account"
4. **Expected:** Success message and redirect to login

### ✅ Test Login Page

1. Navigate to: `http://localhost:3000/login`
2. Enter credentials:
   - Email: "john.test@example.com"
   - Password: "TestPassword123!"
3. Click "Login"
4. **Expected:** Redirect to dashboard

### ✅ Verify SessionStorage After Login

Open browser DevTools (F12) → Application → Session Storage:

**Should contain:**
- `user_data`: JSON with user info
- `id`: User ID string
- `session_secret`: 64-char hex string

## 4. callApi Testing (Hash Authentication)

### ✅ Create Test Module

Create file: `api/v1/request/modules/test/main.php`
```php
<?php
class test {
    public function run($method, $data, $session) {
        switch($method) {
            case 'hello':
                return json_encode([
                    'status' => 'SUCCESS',
                    'message' => 'Hello from test module!',
                    'user' => $session['id'],
                    'data_received' => $data
                ]);

            default:
                return json_encode([
                    'status' => 'ERROR',
                    'message' => 'Unknown method'
                ]);
        }
    }
}
?>
```

### ✅ Test callApi Function

Create a test component in frontend:

```typescript
// Create test page: frontend/app/test-auth/page.tsx
'use client';

import { useState } from 'react';
import { callApi } from '@/lib/api-client';

export default function TestAuth() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testCallApi = async () => {
    try {
      const response = await callApi('test', 'hello', {
        message: 'Testing callApi functionality',
        timestamp: new Date().toISOString()
      });
      setResult(response);
      setError('');
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Authentication Test</h1>

      <button onClick={testCallApi} style={{ padding: '10px 20px', margin: '10px' }}>
        Test callApi
      </button>

      {result && (
        <div style={{ background: '#e8f5e9', padding: '10px', margin: '10px' }}>
          <h3>✅ Success:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ background: '#ffebee', padding: '10px', margin: '10px' }}>
          <h3>❌ Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
```

### ✅ Run the Test

1. First login to get authentication credentials
2. Navigate to: `http://localhost:3000/test-auth`
3. Click "Test callApi"
4. **Expected:** Success response with user data

## 5. Hash Validation Testing

### ✅ Manual Hash Test

```php
// Create test script: api/test_hash.php
<?php
// Get session from database
$dbconn = new mysqli('localhost', 'username', 'password', 'gamified_crm', 3307);

$session_query = "SELECT * FROM user_session WHERE user_id = 'user_xxx' LIMIT 1";
$result = mysqli_query($dbconn, $session_query);
$session = mysqli_fetch_assoc($result);

// Test data
$data = ['message' => 'Hello World'];
$data_json = json_encode($data);

// Generate hash (same as backend)
$hash = md5($data_json . $session['session_secret']);

echo "Data: " . $data_json . "\n";
echo "Secret: " . $session['session_secret'] . "\n";
echo "Generated Hash: " . $hash . "\n";
?>
```

## 6. Error Handling Tests

### ✅ Test Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```
**Expected:** Error response with "Invalid email or password"

### ✅ Test API Without Authentication
- Clear sessionStorage
- Try to call an API
- **Expected:** Authentication required error

### ✅ Test Invalid Hash
- Modify session secret in sessionStorage
- Try callApi
- **Expected:** Hash validation failed

## 7. Frontend Integration Tests

### ✅ Test Auth Hook
```typescript
// In any component
import { useAuth } from '@/lib/auth';

function TestComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  console.log('User:', user);
  console.log('Authenticated:', isAuthenticated);

  // Should show user data if logged in
}
```

### ✅ Test Navigation Guards
1. Try accessing protected route without login
2. **Expected:** Redirect to login
3. Login and try again
4. **Expected:** Access granted

## 8. Performance Tests

### ✅ Test Session Performance
```sql
-- Check query performance
EXPLAIN SELECT * FROM user_session WHERE user_id = 'user_id';

-- Check indexes
SHOW INDEX FROM user_session;
```

### ✅ Test Multiple Sessions
- Login from multiple browsers/devices
- Verify separate sessions are created
- Check user_session table for multiple entries

## 9. Security Tests

### ✅ Test SQL Injection Protection
```bash
# Try malicious input in registration
curl -X POST http://localhost:8080/api/v1/authenticate.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "email": "test'; DROP TABLE users; --",
    "password": "test"
  }'
```
**Expected:** Error or safe handling (no SQL injection)

### ✅ Test XSS Protection
- Register with HTML/JavaScript in name field
- Verify it's escaped in UI

## 10. Logging Tests

### ✅ Verify API Logging
```sql
-- Check if API calls are logged
SELECT * FROM api_log
WHERE api_module = 'test'
ORDER BY created_date DESC
LIMIT 5;
```

## 📊 Test Results Summary

Track your test results:

| Test | Status | Notes |
|------|--------|-------|
| Database Setup | ⬜ | |
| Registration API | ⬜ | |
| Login API | ⬜ | |
| Session Creation | ⬜ | |
| Frontend Registration | ⬜ | |
| Frontend Login | ⬜ | |
| SessionStorage Storage | ⬜ | |
| callApi Function | ⬜ | |
| Hash Validation | ⬜ | |
| Error Handling | ⬜ | |
| Auth Hook | ⬜ | |
| Navigation Guards | ⬜ | |
| Security Tests | ⬜ | |
| API Logging | ⬜ | |

## 🔧 Common Issues & Solutions

1. **Hash Mismatch**
   - Clear sessionStorage and re-login
   - Check JSON normalization
   - Verify session_secret storage

2. **CORS Errors**
   - Check headers in PHP files
   - Verify frontend URL matches CORS config

3. **Database Connection**
   - Check MySQL is running
   - Verify credentials
   - Check database exists

4. **Module Not Found**
   - Verify file exists at correct path
   - Check class name matches filename
   - Ensure proper namespace

## 🚀 Next Steps

After all tests pass:
1. Remove test files
2. Set up production database
3. Configure production environment
4. Set up SSL certificates
5. Configure monitoring and alerts

Run this checklist thoroughly to ensure your authentication system is bulletproof!