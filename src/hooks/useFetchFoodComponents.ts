import { useState, useEffect } from "react";
import { getFoodComponents } from "../services/firebase";
import { FoodComponent } from "../models/FoodComponent";

const useFetchFoodComponents = () => {
  const [foodComponents, setFoodComponents] = useState<FoodComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodComponents = async () => {
      try {
        const data = await getFoodComponents();
        setFoodComponents(data);
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

    fetchFoodComponents();
  }, []);

  return { foodComponents, loading, error };
};

export default useFetchFoodComponents;
