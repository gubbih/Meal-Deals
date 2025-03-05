import { Meal } from "../models/Meal";
import { getMeals } from "../services/firebase";
import { useCachedFetch } from "../contexts/CacheContext";

// Cache key for all meals
const MEALS_CACHE_KEY = "all-meals";

// Cache timeout - 5 minutes (meals might change moderately often)
const CACHE_MAX_AGE = 5 * 60 * 1000;

const useCachedMeals = () => {
  const { data, loading, error, refetch } = useCachedFetch<Meal[]>(
    MEALS_CACHE_KEY,
    getMeals,
    {
      maxAge: CACHE_MAX_AGE,
      enabled: true,
    }
  );

  return {
    meals: data || [],
    loading,
    error: error?.message || null,
    refetch,
  };
};

export default useCachedMeals;
