/**
 * Legacy API export file
 *
 * This file is maintained for backward compatibility.
 * All API functions have been organized into separate files in the api/ directory.
 *
 * New structure:
 * - api/client.ts - Axios instance, interceptors, circuit breaker, token management
 * - api/auth.ts - Authentication functions
 * - api/users.ts - User management functions
 * - api/meals.ts - Meal CRUD operations
 * - api/offers.ts - Offers functions
 * - api/foodComponents.ts - Food components functions
 * - api/favorites.ts - Favorites management functions
 * - api/index.ts - Central export point
 */

export * from "./api/index";
export { default } from "./api/index";
