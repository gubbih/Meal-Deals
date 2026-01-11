# Cheapmeal API Integration Guide

## Overview

This application has been successfully integrated with the Cheapmeal Production API.

## API Configuration

### Production API

- **Base URL**: `https://api.cheapmeals.dk`
- **Environment Variable**: `REACT_APP_API_BASE_URL`

### Authentication

- **Method**: JWT (JSON Web Tokens)
- **Storage**: localStorage (`authToken`)
- **Header**: `Authorization: Bearer <token>`

## Architecture Changes

### 1. Authentication System

- **New Context**: `AuthContext` (`src/contexts/AuthContext.tsx`)
  - Replaces Firebase authentication
  - Manages user state and authentication flow
  - Handles token storage and refresh

### 2. API Service

- **Location**: `src/services/api.ts`
- **Features**:
  - Axios-based HTTP client
  - Automatic token injection
  - 401 error handling with auto-redirect
  - 10-second request timeout
  - Comprehensive error handling

### 3. Available Endpoints

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/:id/favorites` - Get user favorites
- `POST /api/users/:id/favorites` - Add favorite meal
- `DELETE /api/users/:id/favorites/:mealId` - Remove favorite meal

#### Meals

- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get meal by ID
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

#### Offers

- `GET /api/offers` - Get all offers

#### Food Components

- `GET /api/food-components` - Get all food components

## Updated Components

### Hooks

All custom hooks have been updated to use the new API:

- `useSignIn` - Authentication
- `useSignUp` - Registration
- `useSignOut` - Logout
- `useFetchMeals` - Fetch meals
- `useFetchMeal` - Fetch single meal
- `useFetchOffers` - Fetch offers
- `useFetchFoodComponents` - Fetch food components
- `useUpdateMeal` - Update meal
- `useDeleteMeal` - Delete meal
- `useFavoriteMeals` - Manage favorites
- `useUpdateUser` - Update user profile

### Cached Hooks

All cached data hooks remain functional with the new API:

- `useCachedMeals`
- `useCachedMeal`
- `useCachedOffers`
- `useCachedFoodComponents`

### Pages

- `AuthPage` - Login/Register
- `HomePage` - Meal listings
- `MealPage` - Meal details
- `CreateMealPage` - Create meal
- `EditMealPage` - Edit meal
- `MyMeals` - User's meals
- `FavoritesPage` - Favorite meals
- `UserPage` - User profile

### Components

- `Navigation` - Updated to use AuthContext
- `ProtectedRoute` - Route protection with new auth
- `AuthForm` - Login/register form

## Security Features

### Token Management

- Tokens stored in localStorage
- Automatic token injection in API requests
- Token cleared on 401 responses
- Secure token transmission via HTTPS

### Error Handling

- Automatic redirect to login on 401
- User-friendly error messages
- Network error handling
- Request timeout (10 seconds)

### CORS

- Production API configured with proper CORS headers
- Credentials included in requests when needed

## Environment Variables

Required in `.env` file:

```env
REACT_APP_API_BASE_URL=https://api.cheapmeals.dk
```

## Development vs Production

### Development

- Local API: `http://localhost:3001`
- Set `REACT_APP_API_BASE_URL=http://localhost:3001`

### Production

- Production API: `https://api.cheapmeals.dk`
- Set `REACT_APP_API_BASE_URL=https://api.cheapmeals.dk`

## Testing the Integration

### 1. Health Check

```typescript
import { checkAPIHealth } from "./utils/apiHealthCheck";

const health = await checkAPIHealth();
console.log(health.status); // 'healthy' or 'unhealthy'
```

### 2. Authentication Flow

```typescript
// Login
const { user, signIn } = useAuth();
await signIn("user@example.com", "password");

// Check user state
console.log(user); // User object or null

// Logout
await signOut();
```

### 3. Data Fetching

```typescript
// Fetch meals
const { meals, loading, error } = useCachedMeals();

// Create meal
const { createMeal } = require("./services/api");
await createMeal(mealData);
```

## Migration Notes

### From Firebase to Custom API

1. **Authentication**: JWT tokens replace Firebase Auth
2. **Database**: REST API replaces Firebase Realtime Database
3. **User IDs**: Continue using `uid` field for compatibility
4. **Timestamps**: ISO 8601 strings (e.g., `2026-01-10T12:00:00Z`)

### Breaking Changes

- Firebase imports removed from all files
- `getMealByUser()` replaced with filtered `getMeals()`
- `addMeal()` renamed to `createMeal()`

## Troubleshooting

### Common Issues

#### 1. 401 Unauthorized

- **Cause**: Invalid or expired token
- **Solution**: User automatically redirected to login

#### 2. Network Error

- **Cause**: API server unreachable
- **Solution**: Check API_BASE_URL and network connection

#### 3. CORS Error

- **Cause**: Missing CORS headers
- **Solution**: Verify API CORS configuration

#### 4. Timeout

- **Cause**: Slow API response (>10s)
- **Solution**: Check API performance or increase timeout

### Debug Tools

- **React DevTools**: Inspect AuthContext state
- **Network Tab**: View API requests/responses
- **Console**: Check for error messages

## Performance Optimizations

### Caching

- 5-minute default cache duration
- localStorage persistence
- Automatic cache invalidation on updates

### Request Management

- Single token refresh mechanism
- Debounced search queries
- Optimistic UI updates

## Next Steps

### Recommended Improvements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Offline Support**: Add service worker for offline functionality
3. **Error Boundaries**: Wrap components in error boundaries
4. **Loading States**: Enhanced loading indicators
5. **Retry Logic**: Automatic retry for failed requests

### Monitoring

1. **API Health**: Regular health check polling
2. **Error Tracking**: Integrate Sentry or similar
3. **Performance**: Monitor API response times
4. **Usage Analytics**: Track API endpoint usage

## Support

For issues or questions:

1. Check API documentation
2. Review error logs in console
3. Test with API health check utility
4. Verify environment variables

## Version History

### v1.0.0 (January 10, 2026)

- Initial integration with Cheapmeal API
- Migrated from Firebase to custom REST API
- Implemented JWT authentication
- Updated all data fetching hooks
- Added comprehensive error handling
