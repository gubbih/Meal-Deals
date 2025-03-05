import { FoodComponent } from "../models/FoodComponent";
import { getFoodComponents } from "../services/firebase";
import { useCachedFetch } from "../contexts/CacheContext";

// Cache key for food components
const FOOD_COMPONENTS_CACHE_KEY = "food-components";

// Cache timeout - 1 hour (food components don't change often)
const CACHE_MAX_AGE = 60 * 60 * 1000;

const useCachedFoodComponents = () => {
  const { data, loading, error, refetch } = useCachedFetch<FoodComponent[]>(
    FOOD_COMPONENTS_CACHE_KEY,
    getFoodComponents,
    {
      maxAge: CACHE_MAX_AGE,
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
