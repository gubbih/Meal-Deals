import React, { useEffect, useState } from "react";
import { getMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import { useAuth } from "../services/firebase";
import useFavoriteMeals from "../hooks/useFavoriteMeals";
import Toast from "../components/Toast";

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites } = useFavoriteMeals();
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteMeals();
    }
  }, [user, favorites]);

  const fetchFavoriteMeals = async () => {
    try {
      const meals = await Promise.all(favorites.map((id) => getMeal(id)));
      setFavoriteMeals(meals);
    } catch (error) {
      console.error("Error fetching favorite meals:", error);
      setToast({ type: "error", message: "Failed to fetch favorite meals." });
    }
  };

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <h1 className="text-2xl font-bold mb-4">Favorite Meals</h1>
      {favoriteMeals.length === 0 ? (
        <p>No favorite meals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {favoriteMeals.map((meal) => (
            <div key={meal.id} className="flex justify-center">
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <img
                  src={meal.imagePath}
                  alt={meal.name}
                  className="rounded-t-md h-64 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {meal.name}
                  </h2>
                </div>
                <div className="flex items-center justify-between px-2 m-2">
                  <a
                    href={`/meal/${meal.id}`}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    View Meal
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
