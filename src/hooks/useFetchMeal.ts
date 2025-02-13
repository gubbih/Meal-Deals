import { useState, useEffect } from "react";
import { Meal } from "../models/Meal";
import { getMeal } from "../services/firebase";

const useFetchMeal = (id: string) => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const data = await getMeal(id);
        setMeal(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  return { meal, loading, error };
};

export default useFetchMeal;
