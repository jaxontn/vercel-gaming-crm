# Authentication System Documentation

## Overview

The Gaming CRM implements a dual authentication system that supports both modern JWT-based authentication for direct endpoints and traditional session-based hash validation for secured API calls.

## Architecture

```
Frontend → Dual Auth System → Backend APIs
         ├─ Direct Auth (JWT) → /api/v1/authenticate.php
         └─ Session Auth (Hash) → /api/v1/request/ → callApi()
```

## Authentication Methods

### 1. Direct Authentication (JWT)
Used for: Login, Registration, Password Reset

- **Endpoint**: `/api/v1/authenticate.php`
- **Method**: Direct POST with credentials
- **Response**: JWT token + Session credentials
- **No additional hashing required**

### 2. Session-Based Authentication (Hash Validation)
Used for: All other API calls

- **Endpoint**: `/api/v1/request/`
- **Method**: `callApi()` function with automatic hashing
- **Security**: MD5(data + session_secret)
- **Requirements**: Valid session credentials

## Database Schema

### Core Tables

#### `merchant_users` (User Table)
- Serves as the primary user table
- Contains authentication and profile data
- Primary key: `id` (varchar(36) - UUID)

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
  registerMerchant: (businessName: string, contactName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### Storage Strategy

#### JWT Authentication (Direct Endpoints)
```javascript
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(user));
```

#### Session Authentication (callApi)
```javascript
localStorage.setItem('auth_user_id', session.user_id);
localStorage.setItem('auth_session_secret', session.session_secret);
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
3. Returns JWT token + session credentials
4. Stores both authentication methods

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

### 3. Secured API Calls (callApi)

```typescript
import { callApi } from '@/lib/api-client';

// Automatic hashing and authentication
const result = await callApi('customers', 'list', {
  merchant_id: 'xxx',
  page: 1
});
```

**Process:**
1. Retrieves session credentials from storage
2. Creates hash: `MD5(JSON.stringify(data) + session_secret)`
3. Sends to `/api/v1/request/` with session object
4. Backend validates hash and executes module

## Backend Implementation

### Direct Authentication (`/api/v1/authenticate.php`)

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
    "token": "jwt_token_base64",
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
- Each login generates unique session secret
- Device-specific sessions possible
- Sessions can be revoked per user/device

### 2. Request Signing
- Every API call is signed with hash
- Tamper-proof data transmission
- Prevents unauthorized API access

### 3. Dual Authentication Layers
- JWT for stateless authentication
- Session hash for request validation
- Separate concerns for different use cases

### 4. Password Security
- Uses PHP's `password_hash()` with proper salt
- Validates with `password_verify()`
- No plain text password storage

## Usage Guidelines

### When to Use Direct Authentication
- User login/logout
- User registration
- Password reset
- Public endpoints

### When to Use callApi
- All business logic APIs
- Data manipulation operations
- Secured administrative functions
- Any endpoint requiring user permissions

### Error Handling
```typescript
try {
  await callApi('customers', 'create', customerData);
} catch (error) {
  // Handle authentication errors
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
   - Check session_secret storage
   - Verify JSON normalization
   - Ensure consistent data format

2. **Authentication Required**
   - Verify session credentials exist
   - Check localStorage/sessionStorage values
   - Ensure user is logged in

3. **Permission Denied**
   - Verify user role
   - Check module permissions
   - Ensure active user status

### Debug Logging
```php
// Backend logs hash calculation details
log::error("Hash calculation details", "api", "request", [
  "data_length" => strlen($normalized_data),
  "this_hash" => $this_hash,
  "received_hash" => $hash
]);
```

## Migration Notes

- Legacy `user` table replaced by `merchant_users`
- `user_session` table added for session management
- Frontend updated to store both JWT and session credentials
- Authentication flow unified for all user types

## Best Practices

1. **Always use callApi for secured operations**
2. **Store session credentials securely**
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
    expect(localStorage.getItem('auth_token')).toBeTruthy();
    expect(localStorage.getItem('auth_user_id')).toBeTruthy();
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