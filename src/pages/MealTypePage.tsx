import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useCachedMeals from "../hooks/useCachedMeals";
import { useParams, Link } from "react-router-dom";
import MealCarousel from "../components/MealCarousel";
import Toast from "../components/Toast";

const MealTypePage: React.FC = () => {
  const { t } = useTranslation();
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
          {t("mealTypePage.loading")}
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
          {t("mealTypePage.tryAgain")}
        </button>
      </div>
    );
  }

  if (mealType === undefined) {
    return (
      <div className="p-4">
        <p>{t("mealTypePage.noMealTypeSelected")}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      {meals.filter((meal) => meal.mealType === mealType).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {t("mealTypePage.noMealsYet", { mealType })}
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            {t("mealTypePage.startExploring")}
          </p>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/create"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t("mealTypePage.createYourOwn")}
            </Link>
          </div>
        </div>
      ) : (
        <MealCarousel
          meals={mealsByType}
          title={t("mealTypePage.mealsTitle", { mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1) })}
        />
      )}
    </div>
  );
};

export default MealTypePage;
