import { useState, useEffect } from "react";
import { addFavoriteMeal, removeFavoriteMeal } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const useFavoriteMeals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Update favorites when user changes
  useEffect(() => {
    if (user?.favoriteRecipes) {
      setFavorites(user.favoriteRecipes);
    } else {
      setFavorites([]);
    }
  }, [user?.favoriteRecipes]);

  const addToFavorites = async (mealId: string) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addFavoriteMeal(user.id, mealId);
      // Optimistically update local state
      setFavorites((prev) => [...prev, mealId]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      // Revert local state on error
      setFavorites((prev) => prev.filter((id) => id !== mealId));
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
      await removeFavoriteMeal(user.id, mealId);
      // Optimistically update local state
      setFavorites((prev) => prev.filter((id) => id !== mealId));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      // Revert local state on error
      setFavorites((prev) => [...prev, mealId]);
    } finally {
      setLoading(false);
    }
  };

  return {
    addToFavorites,
    removeFromFavorites,
    loading,
    error,
    favorites,
  };
};

export default useFavoriteMeals;
