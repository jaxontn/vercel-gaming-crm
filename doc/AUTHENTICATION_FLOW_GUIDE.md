# Authentication System Architecture Guide

## Overview
This document explains the complete authentication system for the Gaming CRM application, including all files and their roles in the authentication flow.

## 📁 File Structure

### Frontend Files (`/frontend/`)

#### 1. `lib/auth.tsx` - Main Authentication Context
**Purpose**: React Context that manages authentication state throughout the app

**Key Functions**:
- `login(email, password)` - Standard merchant login
- `loginPublic(email, password)` - Public login (same as login now)
- `registerMerchant(businessName, contactName, email, phone, password)` - New merchant registration
- `checkAuth()` - Verifies session on app load using authenticate.php
- `logout()` - Clears all auth data from sessionStorage

**Storage**: Uses `sessionStorage` for:
- `user_data` - User information object
- `id` - User ID for API calls
- `session_secret` - Session secret for API authentication

**Usage Example**:
```tsx
const { user, login, logout, isLoading } = useAuth();
```

---

#### 2. `lib/api-client.ts` - API Request Handler
**Purpose**: Makes authenticated API calls to the backend

**Key Functions**:
- `callApi(module, method, data)` - Legacy API calls for `/v1/request/` endpoints
- `restCall(endpoint, options)` - Modern REST API calls
- `isAuthenticated()` - Checks if user has session credentials
- `setAuth(userId, secret)` - Sets authentication credentials
- `clearAuth()` - Clears authentication credentials

**Authentication Method**:
- Uses `user_id` + `session_secret` with MD5 hashing
- Hash is calculated as: `MD5(JSON.stringify(data) + session_secret)`

**Usage Example**:
```tsx
import { callApi } from '@/lib/api-client';
const result = await callApi('merchants', 'read', { id: 'merchant_123' });
```

---

#### 3. `components/auth-guard.tsx` - Route Protection Component
**Purpose**: Protects pages based on authentication status

**Props**:
- `children` - Components to render if auth check passes
- `redirectTo` - Path to redirect if auth fails (default: '/login')
- `requireAuth` - true = require auth, false = require NOT auth (default: true)

**Logic**:
- If `requireAuth=true` and not authenticated → redirect to login
- If `requireAuth=false` and authenticated → redirect to dashboard
- Checks for `session_secret` and `user_id` in sessionStorage

**Usage Example**:
```tsx
// Protect authenticated routes
<AuthGuard requireAuth={true}>
  <DashboardPage />
</AuthGuard>

// Protect public routes (login/register)
<AuthGuard requireAuth={false}>
  <LoginPage />
</AuthGuard>
```

---

### Backend Files (`/api/`)

#### 4. `v1/authenticate.php` - Authentication Router
**Purpose**: Simple router that forwards authentication requests

**Function**: Just includes the actual authenticate.php file
**Why exists**: Provides clean `/v1/authenticate.php` endpoint for frontend

---

#### 5. `v1/request/modules/merchants/authenticate.php` - Main Auth Handler
**Purpose**: Handles all authentication operations for merchants

**Actions Supported**:
- `login` - Validates credentials, creates session, returns user + session data
- `register` - Creates new merchant account and user
- `verify_session` - Checks if session is still valid

**Database Tables**:
- `merchants` - Business information
- `merchant_users` - User accounts linked to merchants
- `user_session` - Active sessions for API calls

**Session Creation**:
- Generates random 64-character hex string as session_secret
- Stores in `user_session` table with user_id and device
- Session expires after 30 days

**Example Request**:
```json
{
  "action": "verify_session",
  "user_id": "user_123",
  "session_secret": "abc123..."
}
```

---

#### 6. `v1/request/core/security/auth.php` - Security Layer
**Purpose**: Validates session for all `/v1/request/` API calls

**Key Functions**:
- `check(dbconn, id, hash, data)` - Verifies hash using session secret
- `permission(dbconn, id, module, method)` - Checks user permissions (always returns true for now)
- `get_user_info()` - Returns authenticated user data
- `hash_data(dbconn, id, device, data)` - Creates hash for API requests

**Authentication Flow**:
1. Receives user_id and hash from frontend
2. Looks up session_secret from user_session table
3. Calculates expected hash: `MD5(normalized_data + session_secret)`
4. Compares with received hash
5. Returns true if hashes match

**Used By**: All API modules that extend the base API class

---

## 🔄 Complete Authentication Flow

### 1. User Login
```
1. User enters credentials in login form
2. auth.tsx → login() function called
3. POST to /v1/authenticate.php with action: 'login'
4. merchants/authenticate.php → handle_login()
5. Validates email/password against merchants table
6. Creates session in user_session table
7. Returns user data + session credentials
8. Frontend stores in sessionStorage
9. Redirects to /dashboard
```

### 2. App Load / Auth Check
```
1. App starts → AuthProvider → checkAuth()
2. Gets user_id, session_secret from sessionStorage
3. POST to /v1/authenticate.php with action: 'verify_session'
4. merchants/authenticate.php → handle_verify_session()
5. Validates session exists and not expired
6. Returns SUCCESS if valid
7. Frontend sets user state from stored data
```

### 3. API Call
```
1. Component needs data → api-client.ts → callApi()
2. Creates hash: MD5(JSON.stringify(data) + session_secret)
3. POST to /v1/request/ with session object + data
4. Security/auth.php → check() validates hash
5. If valid, API module processes request
6. Returns response to frontend
```

### 4. Route Protection
```
1. User navigates to page
2. auth-guard.tsx checks sessionStorage
3. If requireAuth=true and no session → redirect to /login
4. If requireAuth=false and has session → redirect to /dashboard
5. Otherwise, renders children components
```

## 📚 Quick Reference

| Task | Which File/Function to Use |
|------|---------------------------|
| **Login User** | `auth.tsx` → `login(email, password)` |
| **Register Merchant** | `auth.tsx` → `registerMerchant(...)` |
| **Check Auth Status** | `auth.tsx` → `checkAuth()` (runs automatically) |
| **Logout User** | `auth.tsx` → `logout()` |
| **Protect a Page** | `auth-guard.tsx` component wrapper |
| **Make Authenticated API Call** | `api-client.ts` → `callApi(module, method, data)` |
| **Check if API Authenticated** | `api-client.ts` → `isAuthenticated()` |
| **Add New Auth Action** | Edit `merchants/authenticate.php` |
| **Secure an API Endpoint** | Inherits protection from `core/security/auth.php` |

## 🔐 Security Considerations

1. **Session Storage**: Using sessionStorage (cleared when browser closes)
2. **Hash Verification**: MD5 hash of data + session_secret for API calls
3. **Session Expiration**: 30 days from creation
4. **SQL Injection Protection**: Using mysqli_real_escape_string
5. **Password Storage**: Hashed using PHP's password_hash()

## 🚨 Common Issues & Solutions

1. **"Missing required field: email" during verify_session**
   - Fixed: Validation now checks different fields based on action

2. **Hash mismatch errors**
   - Ensure JSON.stringify format matches between frontend and PHP
   - PHP uses JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES to match JS

3. **Authentication lost on refresh**
   - Check that sessionStorage is being set and retrieved correctly
   - Ensure verify_session is returning SUCCESS

## 📝 Development Notes

- All authentication now uses the unified `/v1/authenticate.php` endpoint
- The old `public_login.php` and `public_verify.php` are no longer needed
- Session-based authentication (user_id + session_secret) is used instead of JWT tokens
- The API client maintains compatibility with the legacy callApi pattern

---

**Last Updated**: 2025-12-04
**System Version**: Unified Authentication System