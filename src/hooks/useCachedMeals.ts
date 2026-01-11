import { Meal } from "../models/Meal";
import { getMeals } from "../services/api";
import { useCachedFetch, CACHE_DURATIONS } from "../contexts/CacheContext";

// Cache key for all meals
const ALL_MEALS_CACHE_KEY = "all-meals";

interface GetMealsParams {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  mealType?: string;
  createdBy?: string;
}

interface UseCachedMealsResult {
  meals: Meal[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useCachedMeals = (params?: GetMealsParams): UseCachedMealsResult => {
  // Create a cache key that includes the parameters
  const cacheKey = params
    ? `${ALL_MEALS_CACHE_KEY}-${JSON.stringify(params)}`
    : ALL_MEALS_CACHE_KEY;

  const fetchMeals = () => getMeals(params);

  const { data, loading, error, refetch } = useCachedFetch<{
    meals: Meal[];
    pagination?: any;
  }>(cacheKey, fetchMeals, {
    maxAge: CACHE_DURATIONS.MEALS,
    enabled: true,
  });

  return {
    meals: data?.meals || [],
    pagination: data?.pagination,
    loading,
    error: error?.message || null,
    refetch,
  };
};

export default useCachedMeals;
