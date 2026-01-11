# Quick Start Guide - Cheapmeal API Integration

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Make sure your `.env` file contains:

```env
REACT_APP_API_BASE_URL=https://api.cheapmeals.dk
```

### 3. Start the Application

```bash
npm start
```

## 📋 What Changed

### ✅ Completed Updates

- [x] Replaced Firebase with Cheapmeal API
- [x] Implemented JWT authentication
- [x] Updated all API endpoints
- [x] Created AuthContext for state management
- [x] Updated all hooks to use new API
- [x] Updated all pages and components
- [x] Added error handling and loading states
- [x] Maintained caching functionality

### 🔐 Authentication Flow

#### Login

1. User enters email and password
2. API returns JWT token and user data
3. Token stored in localStorage
4. Token automatically included in all requests

#### Protected Routes

- Automatically redirect to `/auth` if not logged in
- User state managed by AuthContext
- Token validation on every request

### 📡 API Integration

#### Making API Calls

```typescript
// Import from api service
import { getMeals, createMeal, updateMeal, deleteMeal } from "./services/api";

// Use in your components
const meals = await getMeals();
const newMeal = await createMeal(mealData);
```

#### Using Authentication

```typescript
// Import the hook
import { useAuth } from "./contexts/AuthContext";

// In your component
const { user, loading, signIn, signOut } = useAuth();

// Login
await signIn("email@example.com", "password");

// Check if user is logged in
if (user) {
  console.log("User is logged in:", user.email);
}

// Logout
await signOut();
```

## 🧪 Testing

### 1. Test Health Endpoint

```bash
curl https://api.cheapmeals.dk/health
```

### 2. Test Login

```typescript
// In browser console
const response = await fetch("https://api.cheapmeals.dk/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    password: "password123",
  }),
});
const data = await response.json();
console.log(data);
```

### 3. Test with Application

1. Navigate to `/auth`
2. Register a new account or login
3. Try creating a new meal
4. Verify meal appears in your meals list

## 🔧 Troubleshooting

### Issue: "Cannot connect to API"

**Solution**:

- Check if API is running: `curl https://api.cheapmeals.dk/health`
- Verify REACT_APP_API_BASE_URL in .env
- Check network connection

### Issue: "401 Unauthorized"

**Solution**:

- Clear localStorage: `localStorage.clear()`
- Login again
- Check if token is expired

### Issue: "CORS Error"

**Solution**:

- Verify API has correct CORS configuration
- Check if production API allows your domain
- Try accessing from allowed origin

### Issue: "Network timeout"

**Solution**:

- Check API response time
- Increase timeout in api.ts if needed
- Verify API server is not overloaded

## 📚 Key Files

### Core Files

- `src/services/api.ts` - API client and endpoints
- `src/contexts/AuthContext.tsx` - Authentication state management
- `.env` - Environment configuration

### Hooks

- `src/hooks/useSignIn.ts` - Login hook
- `src/hooks/useSignUp.ts` - Registration hook
- `src/hooks/useSignOut.ts` - Logout hook
- `src/hooks/useFetchMeals.ts` - Fetch meals
- `src/hooks/useUpdateMeal.ts` - Update meals
- `src/hooks/useDeleteMeal.ts` - Delete meals

### Pages

- `src/pages/AuthPage.tsx` - Login/Register page
- `src/pages/HomePage.tsx` - Meal listings
- `src/pages/CreateMealPage.tsx` - Create new meal
- `src/pages/MyMeals.tsx` - User's created meals

## 🎯 Next Steps

### Immediate Actions

1. ✅ Update .env with production API URL
2. ✅ Test login/registration flow
3. ✅ Verify meal CRUD operations
4. ✅ Test favorite meals functionality

### Future Enhancements

- [ ] Implement token refresh mechanism
- [ ] Add request retry logic
- [ ] Implement offline mode
- [ ] Add loading skeletons
- [ ] Enhance error messages
- [ ] Add API response caching optimization

## 💡 Best Practices

### 1. Always Check Auth State

```typescript
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <Navigate to="/auth" />;
```

### 2. Handle Errors Gracefully

```typescript
try {
  await createMeal(mealData);
  showToast("success", "Meal created!");
} catch (error) {
  showToast("error", error.message);
}
```

### 3. Use Cached Hooks for Performance

```typescript
// Instead of useFetchMeals
import useCachedMeals from "./hooks/useCachedMeals";

const { meals, loading } = useCachedMeals();
```

### 4. Invalidate Cache After Mutations

```typescript
import { useCache } from "./contexts/CacheContext";

const { invalidate } = useCache();

await createMeal(mealData);
invalidate("all-meals"); // Refresh meals cache
```

## 📞 Support

- API Documentation: Check API_INTEGRATION.md
- API Base URL: https://api.cheapmeals.dk
- Health Check: https://api.cheapmeals.dk/health

## ✨ Features Maintained

All existing features are fully functional:

- ✅ User authentication (login/register/logout)
- ✅ Meal CRUD operations
- ✅ Favorite meals management
- ✅ Food components browsing
- ✅ Offers viewing
- ✅ Caching with localStorage
- ✅ Multi-language support (i18n)
- ✅ Dark mode
- ✅ Responsive design
- ✅ Protected routes

---

**Ready to go! Your application is now integrated with the Cheapmeal Production API. 🎉**
