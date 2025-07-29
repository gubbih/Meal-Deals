import React, { useState } from "react";
import useCachedMeals from "../hooks/useCachedMeals";
import { useParams } from "react-router-dom";
import MealCarousel from "../components/MealCarousel";
import Toast from "../components/Toast";

const MealTypePage: React.FC = () => {
  const { mealType } = useParams<{ mealType: string }>();
  const [toast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const { meals, loading, error, refetch } = useCachedMeals();

  const mealsByType = meals
    ? meals.filter((meal) => meal.mealType === mealType)
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

  if (mealType === undefined) {
    return (
      <div className="p-4">
        <p>No meal type selected.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      {meals.filter((meal) => meal.mealType === mealType).length === 0 ? (
        <p>No meals of this type were found.</p>
      ) : (
        <MealCarousel
          meals={mealsByType}
          title={
            mealType.charAt(0).toUpperCase() + mealType.slice(1) + " Meals"
          }
        />
      )}
    </div>
  );
};

export default MealTypePage;
