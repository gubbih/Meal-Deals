import { useState, useEffect } from "react";
import { getMeal } from "../services/firebase";
import { Meal } from "../models/Meal";

export function useFetchMeal(id: string) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealData = await getMeal(id);
        console.log("Fetched meal data:", mealData);

        setMeal(mealData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching meal:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  return { meal, loading, error };
}
