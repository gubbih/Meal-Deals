import React from "react";
import { useTranslation } from "react-i18next";
import useCachedMeals from "../hooks/useCachedMeals";
import { Link, useParams } from "react-router-dom";
import MealCarousel from "../components/MealCarousel";

const CuisinePage: React.FC = () => {
  const { t } = useTranslation();
  const { cuisine } = useParams<{ cuisine: string }>();
  const { meals, loading, error, refetch } = useCachedMeals();

  const mealsByCuisine = meals
    ? meals.filter((meal) => meal.mealCuisine === cuisine)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          {t("cuisinePage.loading")}
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
          {t("cuisinePage.tryAgain")}
        </button>
      </div>
    );
  }
  if (cuisine === undefined) {
    return (
      <div className="p-4">
        <p>{t("cuisinePage.noCuisineSelected")}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {meals.filter((meal) => meal.mealCuisine === cuisine).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {t("cuisinePage.noMealsYet", { cuisine })}
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            {t("cuisinePage.startExploring")}
          </p>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/create"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t("cuisinePage.createYourOwn")}
            </Link>
          </div>
        </div>
      ) : (
        <MealCarousel
          meals={mealsByCuisine}
          title={t("cuisinePage.cuisineTitle", {
            cuisine: cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
          })}
        />
      )}
    </div>
  );
};

export default CuisinePage;
