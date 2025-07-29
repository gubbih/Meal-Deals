import React, { useEffect, useState } from "react";
import { Meal } from "../models/Meal";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import Toast from "../components/Toast";
import MealCard from "../components/MealCard";
import useCachedMeals from "../hooks/useCachedMeals";
import { useAuth } from "../services/firebase";

const FavoritesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { error } = useFavoriteMeals();
  const { meals, loading: mealsLoading } = useCachedMeals();
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      // Still checking auth state, keep loading
      return;
    }

    if (user && meals.length > 0) {
      // Filter meals to only include those in user's favoriteRecipes
      const favoriteIds = user.favoriteRecipes || [];
      const filteredFavoriteMeals = meals.filter((meal) =>
        favoriteIds.includes(meal.id)
      );
      setFavoriteMeals(filteredFavoriteMeals);
      setLoading(false);
    } else if (!user) {
      setFavoriteMeals([]);
      setLoading(false);
    } else if (!mealsLoading && meals.length === 0) {
      setLoading(false);
    }
  }, [user, meals, mealsLoading, authLoading]);

  if (!user && !authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorite Meals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your favorite meals.
          </p>
        </div>
      </div>
    );
  }

  if (loading || mealsLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Favorite Meals
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        My Favorite Meals
      </h1>

      {error && <Toast message={error} type="error" />}

      {favoriteMeals.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No favorite meals yet
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            Start exploring meals and add some to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
