import { Meal } from "../models/Meal";
import { getMeal } from "../services/firebase";
import { useCachedFetch } from "../contexts/CacheContext";

// Create a cache key for a specific meal
const createMealCacheKey = (id: string) => `meal-${id}`;

// Cache timeout - 5 minutes
const CACHE_MAX_AGE = 5 * 60 * 1000;

export function useCachedMeal(id: string) {
  const { data, loading, error, refetch } = useCachedFetch<Meal>(
    createMealCacheKey(id),
    () => getMeal(id),
    {
      maxAge: CACHE_MAX_AGE,
      enabled: !!id, // Only fetch if an ID is provided
    },
  );
  return {
    meal: data,
    loading,
    error: error?.message || null,
    refetch,
  };
}
