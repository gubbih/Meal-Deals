import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useCachedMeals from "../hooks/useCachedMeals";
import { useAuth } from "../services/firebase";
import MealCarousel from "../components/MealCarousel";
import { useLocation } from "react-router-dom";
import { useCache } from "../contexts/CacheContext";

function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { meals, loading, error, refetch } = useCachedMeals();
  const { user } = useAuth();
  const { invalidateAll } = useCache();

  // Filter favorite meals if user is logged in
  const favoriteMeals = user
    ? meals.filter((meal) => user.favoriteRecipes?.includes(meal.id))
    : [];

  // Remove toast state after displaying
  React.useEffect(() => {
    if (location.state?.toast) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

  return (
    <div className="w-full px-4 py-6">
      {/* Dev Tool - Clear Cache (only visible in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
          <button
            onClick={() => {
              invalidateAll();
              refetch();
            }}
            className="text-xs text-yellow-800 dark:text-yellow-200 underline"
          >
            {t("homePage.clearCache")}
          </button>
        </div>
      )}

      {/* About Section */}
      <section className="mb-8 sm:mb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {t("homePage.title")}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          {t("homePage.description")}
        </p>

        {!user && (
          <div className="mt-6 sm:mt-8">
            <Link
              to="/user"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t("homePage.getStarted")}
            </Link>
          </div>
        )}
      </section>

      {/* Favorite Meals Section (for logged-in users) */}
      {user && favoriteMeals.length > 0 && (
        <MealCarousel
          meals={favoriteMeals}
          title={t("homePage.yourFavoriteMeals")}
          isFavoriteSection
        />
      )}

      {/* All Meals Section */}
      <MealCarousel meals={meals} title={t("homePage.exploreMeals")} />

      {/* Create Meal Call to Action */}
      {user && (
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/create"
            className="inline-block bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {t("homePage.createYourOwnMeal")}
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
