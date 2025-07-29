import React, { useState } from "react";
import useCachedMeals from "../hooks/useCachedMeals";
import { Link, useParams } from "react-router-dom";
import MealCarousel from "../components/MealCarousel";
import Toast from "../components/Toast";

const CuisinePage: React.FC = () => {
  const { cuisine } = useParams<{ cuisine: string }>();
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const { meals, loading, error, refetch } = useCachedMeals();

  const mealsByCuisine = meals
    ? meals.filter((meal) => meal.mealCuisine === cuisine)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (cuisine === undefined) {
    return (
      <div className="p-4">
        <p>No cuisine selected.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      {meals.filter((meal) => meal.mealCuisine === cuisine).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No {cuisine} meals yet, sadly. :(
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            Start exploring meals and add some to your favorites!
          </p>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/create"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your Own Meal
            </Link>
          </div>
        </div>
      ) : (
        <MealCarousel
          meals={mealsByCuisine}
          title={
            cuisine.charAt(0).toUpperCase() + cuisine.slice(1) + " Cuisine"
          }
        />
      )}
    </div>
  );
};

export default CuisinePage;
