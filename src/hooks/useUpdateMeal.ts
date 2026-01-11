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
      await updateMeal(mealId, updates);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { updateMealData, loading, error };
}

export default useUpdateMeal;
