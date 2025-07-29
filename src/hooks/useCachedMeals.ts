import { Meal } from "../models/Meal";
import { getMeals } from "../services/firebase";
import { useCachedFetch, CACHE_DURATIONS } from "../contexts/CacheContext";

// Cache key for all meals
const ALL_MEALS_CACHE_KEY = "all-meals";

const useCachedMeals = () => {
  const { data, loading, error, refetch } = useCachedFetch<Meal[]>(
    ALL_MEALS_CACHE_KEY,
    getMeals,
    {
      maxAge: CACHE_DURATIONS.MEALS,
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
