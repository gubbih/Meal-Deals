import { useState } from "react";
import { updateMeal } from "../services/firebase";
import { Meal } from "../models/Meal";

function useUpdateMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMealData = async (meal: Meal) => {
    setLoading(true);
    setError(null);
    try {
      await updateMeal(meal);
      setLoading(false);
      alert("Meal successfully updated!");
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { updateMealData, loading, error };
}

export default useUpdateMeal;
