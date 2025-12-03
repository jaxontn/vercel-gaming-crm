# API Usage Guide

## Quick Reference

### Authentication vs API Calls

| Purpose | Method | Endpoint | Hashing |
|---------|--------|----------|---------|
| Login | Direct auth | `/api/v1/authenticate.php` | ❌ No |
| Register | Direct auth | `/api/v1/authenticate.php` | ❌ No |
| All other APIs | callApi | `/api/v1/request/` | ✅ Yes |

## Code Examples

### 1. User Authentication

#### Login
```typescript
import { useAuth } from '@/lib/auth';

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Success - redirected to dashboard
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
}
```

#### Register
```typescript
import { useAuth } from '@/lib/auth';

function RegisterComponent() {
  const { registerMerchant } = useAuth();

  const handleRegister = async (formData) => {
    try {
      await registerMerchant(
        formData.businessName,
        formData.contactName,
        formData.email,
        formData.phone,
        formData.password
      );
      // Success - redirect to login
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };
}
```

### 2. Secured API Calls

#### Using callApi
```typescript
import { callApi } from '@/lib/api-client';

// Get customers list
const customers = await callApi('customers', 'list', {
  merchant_id: 'merchant_123',
  page: 1,
  limit: 10
});

// Create new customer
const newCustomer = await callApi('customers', 'create', {
  merchant_id: 'merchant_123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Update customer
const updated = await callApi('customers', 'update', {
  customer_id: 'cust_456',
  name: 'John Smith'
});

// Delete customer
await callApi('customers', 'delete', {
  customer_id: 'cust_456'
});
```

#### Using REST API (for new endpoints)
```typescript
import { apiClient } from '@/lib/api-client';

// Health check
const health = await apiClient.restCall('/health');

// Get vessels (example)
const vessels = await apiClient.restCall('/vessels', {
  method: 'GET'
});
```

### 3. Error Handling

```typescript
import { callApi } from '@/lib/api-client';

async function safeApiCall() {
  try {
    const result = await callApi('module', 'method', data);

    if (result.session.status === 'YES') {
      // Success
      return result.data;
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    if (error.message.includes('Authentication required')) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.message.includes('permission')) {
      // Show permission error
      alert('You do not have permission for this action');
    } else {
      // Generic error
      console.error('API Error:', error);
    }
  }
}
```

### 4. React Component Integration

```typescript
import { useState, useEffect } from 'react';
import { callApi } from '@/lib/api-client';

function CustomerList({ merchantId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const result = await callApi('customers', 'list', {
          merchant_id: merchantId
        });
        setCustomers(result.data.customers || []);
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [merchantId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>
          {customer.name} - {customer.email}
        </div>
      ))}
    </div>
  );
}
```

## Module Reference

### Available Modules

#### `merchants`
- `read` - Get merchant details
- `update` - Update merchant information
- `list` - List merchants (admin only)

#### `customers`
- `list` - Get customers list
- `create` - Create new customer
- `read` - Get customer details
- `update` - Update customer
- `delete` - Delete customer

#### `fleet_assets`
- `list` - Get fleet assets
- `create` - Add new asset
- `update` - Update asset
- `delete` - Remove asset

#### `qr_campaign`
- `list` - List QR campaigns
- `create` - Create campaign
- `read` - Get campaign details
- `update` - Update campaign
- `delete` - Delete campaign

#### `game_management`
- `list` - List games
- `create` - Create game
- `update` - Update game
- `start` - Start game session
- `end` - End game session

#### `loyalty_program`
- `list` - List loyalty programs
- `create` - Create program
- `update` - Update program
- `enroll` - Enroll customer
- `redeem` - Redeem rewards

### API Response Format

```json
{
  "session": {
    "status": "YES",
    "message": "Valid Session",
    "user_data": {
      "id": "user_uuid",
      "username": "user_name",
      "fullname": "Full Name",
      "email": "user@example.com",
      "contact": "+1234567890",
      "merchant_id": "merchant_uuid",
      "role": "admin"
    }
  },
  "permission": {
    "status": "YES",
    "message": "Has Permission"
  },
  "data": {
    // Actual API response data
    "customers": [...],
    "total": 25,
    "page": 1
  }
}
```

## Best Practices

### 1. Always Handle Authentication
```typescript
// Check if authenticated before making API calls
import { isApiAuthenticated } from '@/lib/api-client';

if (!isApiAuthenticated()) {
  // Redirect to login or show error
  return;
}
```

### 2. Use Proper Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await callApi('module', 'method', data);
  } finally {
    setLoading(false);
  }
};
```

### 3. Validate Data Before API Calls
```typescript
const createCustomer = async (data) => {
  // Validate required fields
  if (!data.name || !data.email) {
    throw new Error('Name and email are required');
  }

  return await callApi('customers', 'create', data);
};
```

### 4. Implement Proper Error Boundaries
```typescript
class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the API.</h1>;
    }
    return this.props.children;
  }
}
```

### 5. Use Environment Variables
```typescript
// In your component
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// For debugging
console.log('API URL:', apiUrl);
```

## Testing API Calls

### Mocking for Testing
```typescript
// __tests__/api.test.ts
import { callApi } from '@/lib/api-client';

jest.mock('@/lib/api-client');

test('should fetch customers', async () => {
  const mockCustomers = [{ id: '1', name: 'Test Customer' }];

  callApi.mockResolvedValue({
    session: { status: 'YES' },
    data: { customers: mockCustomers }
  });

  const result = await callApi('customers', 'list');
  expect(result.data.customers).toEqual(mockCustomers);
});
```

### Integration Testing
```typescript
// Integration test with real API
test('integration: customer API', async () => {
  // Create customer
  const created = await callApi('customers', 'create', {
    name: 'Integration Test',
    email: 'test@example.com'
  });

  // Read customer
  const read = await callApi('customers', 'read', {
    customer_id: created.data.customer_id
  });

  expect(read.data.customer.name).toBe('Integration Test');

  // Clean up
  await callApi('customers', 'delete', {
    customer_id: created.data.customer_id
  });
});
```

## Common Issues & Solutions

### 1. "Authentication Required" Error
**Solution:** Ensure user is logged in and session credentials exist
```typescript
if (!localStorage.getItem('auth_user_id')) {
  // Redirect to login
}
```

### 2. Hash Validation Failed
**Solution:** Check session_secret and data format consistency
```typescript
console.log('Session exists:', !!localStorage.getItem('auth_session_secret'));
```

### 3. Permission Denied
**Solution:** Verify user role and permissions
```typescript
const userData = JSON.parse(localStorage.getItem('user_data'));
console.log('User role:', userData.role);
```

### 4. Network Errors
**Solution:** Check API URL and network connectivity
```typescript
console.log('API Endpoint:', process.env.NEXT_PUBLIC_API_URL);
```

## Performance Tips

1. **Batch Operations**
```typescript
// Instead of multiple calls, batch when possible
const results = await callApi('customers', 'batch_update', {
  customers: [
    { id: '1', name: 'Updated 1' },
    { id: '2', name: 'Updated 2' }
  ]
});
```

2. **Caching**
```typescript
// Implement local caching for frequently accessed data
const cache = new Map();

async function getCachedCustomers(merchantId) {
  const cacheKey = `customers_${merchantId}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await callApi('customers', 'list', { merchant_id: merchantId });
  cache.set(cacheKey, result.data);

  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 300000);

  return result.data;
}
```

3. **Pagination**
```typescript
async function getAllCustomers(merchantId) {
  let allCustomers = [];
  let page = 1;

  while (true) {
    const result = await callApi('customers', 'list', {
      merchant_id: merchantId,
      page,
      limit: 100
    });

    allCustomers = [...allCustomers, ...result.data.customers];

    if (result.data.customers.length < 100) break;
    page++;
  }

  return allCustomers;
}
```