# Authentication System Documentation

## Overview

The Gaming CRM implements a **unified session-based authentication system** that handles user authentication and secures API calls through session validation and hash verification.

## Architecture

```
Frontend → Session-Based Auth → Backend APIs
         ├─ Login/Register → /api/v1/authenticate.php
         └─ API Calls → /api/v1/request/ → callApi() → Hash Validation
```

## Authentication Method

### Session-Based Authentication with Hash Validation
Used for: All operations (Login, Registration, API Calls)

- **Endpoint**: `/api/v1/authenticate.php` for auth, `/api/v1/request/` for APIs
- **Storage**: `sessionStorage` (cleared when browser closes)
- **Security**: Session-based with user_id + session_secret
- **API Security**: MD5 hash of request data + session_secret

## Database Schema

### Core Tables

#### `merchants` (Business Information)
- Primary key: `id` (varchar(36) - UUID with 'merchant_' prefix)
- Stores business details and password hash

#### `merchant_users` (User Table)
- Serves as the primary user table
- Contains authentication and profile data
- Primary key: `id` (varchar(36) - UUID with 'user_' prefix)
- Linked to merchants via `merchant_id`

#### `user_session` (Session Table)
```sql
CREATE TABLE `user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,          -- FK to merchant_users.id
  `session_secret` varchar(64) NOT NULL,   -- 64-char hex string
  `device` varchar(100) DEFAULT 'web',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_accessed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_secret` (`session_secret`),
  FOREIGN KEY (`user_id`) REFERENCES `merchant_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
```

## Frontend Implementation

### Authentication Context (`/lib/auth.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginPublic: (email: string, password: string) => Promise<void>;
  registerMerchant: (businessName: string, contactName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### Storage Strategy

**Session Storage** (all data in sessionStorage):
```javascript
// User data
sessionStorage.setItem('user_data', JSON.stringify(user));

// Session credentials for API calls
sessionStorage.setItem('id', session.user_id);
sessionStorage.setItem('session_secret', session.session_secret);
```

## API Usage Patterns

### 1. Login Flow

```typescript
import { useAuth } from '@/lib/auth';

const { login } = useAuth();
await login(email, password);
```

**Process:**
1. Validates credentials against `merchants` table
2. Creates/updates session in `user_session` table
3. Returns user data + session credentials
4. Stores in sessionStorage
5. Redirects to dashboard

### 2. Registration Flow

```typescript
import { useAuth } from '@/lib/auth';

const { registerMerchant } = useAuth();
await registerMerchant(businessName, contactName, email, phone, password);
```

**Process:**
1. Creates merchant and merchant_user records
2. Hashes password using `password_hash()`
3. Returns success confirmation

### 3. Auth Check Flow (On App Load)

```typescript
// Automatically called by AuthProvider
const checkAuth = async () => {
  // Gets user_id and session_secret from sessionStorage
  // Calls verify_session action
  // Validates session exists and not expired
  // Sets user state if valid
}
```

### 4. Secured API Calls (callApi)

```typescript
import { callApi } from '@/lib/api-client';

// Automatic hashing and authentication
const result = await callApi('customers', 'list', {
  merchant_id: 'xxx',
  page: 1
});
```

**Process:**
1. Retrieves session credentials from sessionStorage
2. Creates hash: `MD5(JSON.stringify(data) + session_secret)`
3. Sends to `/api/v1/request/` with session object
4. Backend validates hash in `core/security/auth.php`
5. Executes module if valid

## Backend Implementation

### Authentication Endpoint (`/api/v1/authenticate.php`)
Routes to `/api/v1/request/modules/merchants/authenticate.php`

**Actions Supported:**
- `login` - Validate credentials, return user + session
- `register` - Create new merchant
- `verify_session` - Check session validity

**Login Response:**
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_uuid",
      "merchant_id": "merchant_uuid",
      "email": "user@example.com",
      "name": "Full Name",
      "role": "admin",
      "is_owner": 1
    },
    "session": {
      "user_id": "user_uuid",
      "session_secret": "64_character_hex_string"
    }
  }
}
```

### Session Validation (`/core/security/auth.php`)

**Hash Validation Process:**
```php
// Frontend generates:
hash = MD5(json_stringify(data) + session_secret);

// Backend validates:
$normalized_data = json_encode($decoded_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$this_hash = md5($normalized_data.$this_secret);
$valid = hash_equals($this_hash, $received_hash);
```

## Security Features

### 1. Session-Based Security
- Each login generates unique 64-character hex session secret
- Device-specific sessions tracked
- Sessions expire after 30 days
- Sessions can be revoked per user

### 2. Request Signing
- Every API call is signed with MD5 hash
- Tamper-proof data transmission
- Prevents unauthorized API access

### 3. Input Validation
- SQL injection protection via `mysqli_real_escape_string`
- Action-based field validation
- Password hashing with PHP's `password_hash()`

### 4. Session Storage
- Uses sessionStorage (cleared on browser close)
- No persistent auth tokens stored
- Session verification on app load

## Usage Guidelines

### When to Use Direct Auth Endpoint
- User login/logout
- User registration
- Session verification

### When to Use callApi
- All business logic APIs
- Data manipulation operations
- Secured administrative functions

### Error Handling
```typescript
try {
  await callApi('customers', 'create', customerData);
} catch (error) {
  if (error.message.includes('Authentication required')) {
    // Redirect to login
  }
}
```

## Environment Configuration

```javascript
// Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Debugging

### Common Issues

1. **Hash Mismatch**
   - Check session_secret in sessionStorage
   - Verify JSON normalization between frontend/backend
   - Ensure consistent data format

2. **Authentication Required**
   - Verify session credentials exist in sessionStorage
   - Check user is logged in
   - Run checkAuth() to verify session

3. **"Missing required field: email" during verify_session**
   - Fixed: Validation now checks different fields based on action

### Debug Logging
```php
// Backend logs hash calculation details
log::error("Hash calculation details", "api", "request", [
  "data_length" => strlen($normalized_data),
  "this_hash" => $this_hash,
  "received_hash" => $hash
]);
```

## Recent Updates (December 2024)

### Major Changes:
1. **Unified Authentication**: All auth operations now use `/api/v1/authenticate.php`
2. **Session-Based System**: Moved from JWT tokens to session-based authentication
3. **verify_session Action**: Added session verification for app load checks
4. **Fixed Validation**: Action-based field validation (login needs email/password, verify_session needs user_id/session_secret)
5. **Removed Files**: No longer using `public_login.php` and `public_verify.php`

### Storage Changes:
- Removed `auth_token` storage
- Only storing `user_data`, `id`, and `session_secret` in sessionStorage
- No localStorage usage for authentication

## Best Practices

1. **Always use callApi for secured operations**
2. **Store session credentials in sessionStorage only**
3. **Implement proper error handling**
4. **Log authentication events for security**
5. **Regular session cleanup for inactive users**
6. **Use HTTPS in production**

## Testing

### Unit Tests
```typescript
// Test authentication flow
describe('Authentication', () => {
  test('should login and store credentials', async () => {
    const result = await login(email, password);
    expect(sessionStorage.getItem('user_data')).toBeTruthy();
    expect(sessionStorage.getItem('id')).toBeTruthy();
  });
});
```

### Integration Tests
```typescript
// Test API call with authentication
test('should make authenticated API call', async () => {
  const result = await callApi('customers', 'list');
  expect(result.session.status).toBe('YES');
});
```

## Support

For authentication-related issues:
1. Check browser console for JavaScript errors
2. Verify backend logs for authentication errors
3. Ensure database tables are properly configured
4. Validate environment variables
5. Check sessionStorage for proper data storage