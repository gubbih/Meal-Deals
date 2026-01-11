import { FoodComponent } from "../models/FoodComponent";
import { getFoodComponents } from "../services/api";
import { useCachedFetch, CACHE_DURATIONS } from "../contexts/CacheContext";

// Cache key for food components
const FOOD_COMPONENTS_CACHE_KEY = "food-components";

const useCachedFoodComponents = () => {
  const { data, loading, error, refetch } = useCachedFetch<FoodComponent[]>(
    FOOD_COMPONENTS_CACHE_KEY,
    getFoodComponents,
    {
      maxAge: CACHE_DURATIONS.FOOD_COMPONENTS,
      enabled: true,
    }
  );

  return {
    foodComponents: data || [],
    loading,
    error: error?.message || null,
    refetch,
  };
};

export default useCachedFoodComponents;
