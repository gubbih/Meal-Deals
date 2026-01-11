// Re-export everything for backward compatibility and clean imports
export {
  api,
  setAuthToken,
  resetCircuitBreaker,
  getCircuitBreakerStatus,
} from "./client";
export { signIn, signUp, signOut, getCurrentUser } from "./auth";
export { updateUser } from "./users";
export { getMeals, getMeal, createMeal, updateMeal, deleteMeal } from "./meals";
export { getOffers } from "./offers";
export { getFoodComponents } from "./foodComponents";
export {
  getFavoriteMeals,
  addFavoriteMeal,
  removeFavoriteMeal,
} from "./favorites";

// Default export for compatibility
export { default } from "./client";
