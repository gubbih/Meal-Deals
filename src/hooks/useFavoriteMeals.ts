import { useState } from "react";
import { addFavoriteMeal, removeFavoriteMeal } from "../services/firebase";
import { useAuth } from "../services/firebase";

const useFavoriteMeals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const addToFavorites = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addFavoriteMeal(user.uid, mealId);
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

  const removeFromFavorites = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await removeFavoriteMeal(user.uid, mealId);
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

  return {
    addToFavorites,
    removeFromFavorites,
    loading,
    error,
    favorites: user?.preferences?.favoriteRecipes || [],
  };
};

export default useFavoriteMeals;
