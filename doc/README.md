# Gaming CRM Documentation

Welcome to the Gaming CRM documentation. This system implements a comprehensive authentication and API framework for managing gamified customer relationships.

## 📚 Documentation Files

### Core Documentation

1. **[Authentication System](./AUTHENTICATION_SYSTEM.md)**
   - Complete overview of the dual authentication system
   - JWT and session-based authentication
   - Security features and implementation details

2. **[API Usage Guide](./API_GUIDE.md)**
   - How to use the API system
   - Code examples and best practices
   - Module reference and response formats

3. **[Setup Guide](./SETUP_GUIDE.md)**
   - Step-by-step installation instructions
   - Database configuration
   - Environment setup and troubleshooting

## 🚀 Quick Start

```bash
# 1. Setup Database
mysql -u root -p gamified_crm < api/database_schema/gamified_crm_2025-12-03.sql

# 2. Create session table
# See SETUP_GUIDE.md for SQL

# 3. Configure environment
cd frontend
cp .env.example .env.local
# Edit .env.local with your API URL

# 4. Install dependencies
npm install

# 5. Start development
npm run dev
```

## 🔐 Authentication Overview

The system uses two authentication methods:

### Direct Authentication (No Hashing)
- **Login**: `/api/v1/authenticate.php?action=login`
- **Register**: `/api/v1/authenticate.php?action=register`

### Secured API Calls (With Hashing)
- **All APIs**: Use `callApi()` from `/lib/api-client.ts`
- **Endpoint**: `/api/v1/request/`
- **Security**: MD5(data + session_secret)

## 📖 How to Use

### Frontend Developer
1. Read [API Guide](./API_GUIDE.md) for integration examples
2. Use `useAuth()` hook for authentication
3. Use `callApi()` for secured operations

### Backend Developer
1. Read [Authentication System](./AUTHENTICATION_SYSTEM.md) for architecture
2. Create new modules in `api/v1/request/modules/`
3. Follow the module pattern with `run()` method

### Database Administrator
1. Read [Setup Guide](./SETUP_GUIDE.md) for database setup
2. Monitor `api_log` table for usage analytics
3. Manage sessions through `user_session` table

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Backend       │
│                 │    │                  │    │                 │
│ React/Next.js   │◄──►│  /api/v1/        │◄──►│  PHP Modules    │
│                 │    │                  │    │                 │
│ • JWT Auth      │    │ • Direct Auth    │    │ • Business Logic│
│ • Session Auth  │    │ • Hash Validation│    │ • Database      │
│ • callApi()     │    │ • Routing        │    │ • Security      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Key Features

### Security
- ✅ Dual authentication layers
- ✅ Request signing with MD5 hash
- ✅ Session-based API security
- ✅ Password hashing with PHP's `password_hash()`

### Developer Experience
- ✅ TypeScript support
- ✅ React hooks for auth
- ✅ Comprehensive error handling
- ✅ Detailed logging system

### Performance
- ✅ Efficient database queries
- ✅ Session management
- ✅ API request logging
- ✅ Optimized frontend bundles

## 📊 Database Schema

### Core Tables
- `merchants` - Business accounts
- `merchant_users` - User accounts (serves as user table)
- `user_session` - Session management
- `api_log` - API request logging

### Business Tables
- `customers` - Customer management
- `qr_campaigns` - QR code campaigns
- `games` - Gamification elements
- `loyalty_programs` - Customer loyalty

## 🛠️ Development Workflow

### 1. Feature Development
```bash
# Create new module
mkdir api/v1/request/modules/new_feature
touch api/v1/request/modules/new_feature/main.php

# Implement module class
class new_feature {
    public function run($method, $data, $session) {
        // Implementation
    }
}
```

### 2. Frontend Integration
```typescript
// Use the new module
import { callApi } from '@/lib/api-client';

const result = await callApi('new_feature', 'method', {
    parameter: 'value'
});
```

### 3. Testing
```bash
# Run tests
npm test

# Test API endpoint
curl -X POST http://localhost/api/v1/request/ \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "module": "new_feature",
      "method": "method",
      "id": "user_id",
      "hash": "generated_hash"
    },
    "data": {
      "parameter": "value"
    }
  }'
```

## 🚨 Important Notes

1. **Never hardcode credentials** - Always use environment variables
2. **Always validate input** - Both frontend and backend
3. **Use HTTPS in production** - Never use HTTP for sensitive data
4. **Regular session cleanup** - Implement session expiration
5. **Monitor API usage** - Check `api_log` table regularly

## 🤝 Contributing

When contributing:
1. Follow the existing code patterns
2. Add comprehensive error handling
3. Update documentation
4. Test thoroughly
5. Ensure security best practices

## 📞 Support

For issues:
1. Check the troubleshooting section in [Setup Guide](./SETUP_GUIDE.md)
2. Review the [API Guide](./API_GUIDE.md) for proper usage
3. Check logs in `api_log` table
4. Verify authentication flow

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Framework**: Next.js + PHP

For the most up-to-date information, always refer to the specific documentation files listed above.