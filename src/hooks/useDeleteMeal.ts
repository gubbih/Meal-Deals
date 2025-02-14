import { useState } from "react";
import { deleteMeal } from "../services/firebase";

const useDeleteMeal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteMeal = async (mealId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMeal(mealId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteMeal, loading, error };
};

export default useDeleteMeal;
