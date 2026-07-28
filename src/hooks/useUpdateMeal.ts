import { useState } from "react";
import { updateMeal } from "../services/api";
import { Meal } from "../models/Meal";

function useUpdateMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMealData = async (mealId: string, updates: Partial<Meal>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMeal = await updateMeal(mealId, updates);
      return updatedMeal;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateMealData, loading, error };
}

export default useUpdateMeal;
