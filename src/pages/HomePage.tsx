import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useCachedMeals from "../hooks/useCachedMeals";
import { useAuth } from "../contexts/AuthContext";
import MealCarousel from "../components/MealCarousel";
import { useLocation } from "react-router-dom";
import { useCache } from "../contexts/CacheContext";
import { resetCircuitBreaker, getCircuitBreakerStatus } from "../services/api";
import { getAuthToken } from "../services/api/client";

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
    const isRateLimit =
      error.toLowerCase().includes("too many") ||
      error.toLowerCase().includes("rate limit");
    const isConnectionError =
      error.toLowerCase().includes("connect") ||
      error.toLowerCase().includes("network");

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div
          className={`p-4 rounded-lg ${isRateLimit ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isRateLimit ? (
                <svg
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3
                className={`text-sm font-medium ${isRateLimit ? "text-yellow-800 dark:text-yellow-200" : "text-red-800 dark:text-red-200"}`}
              >
                {isRateLimit
                  ? t("errors.rateLimitTitle", "Too Many Requests")
                  : t("errors.errorTitle", "Error Loading Meals")}
              </h3>
              <div
                className={`mt-2 text-sm ${isRateLimit ? "text-yellow-700 dark:text-yellow-300" : "text-red-700 dark:text-red-300"}`}
              >
                <p>{error}</p>
                {isRateLimit && (
                  <p className="mt-2 text-xs">
                    {" "}
                    {t(
                      "errors.rateLimitHint",
                      "The API has a limit of 100 requests per 15 minutes. Please wait a few minutes before trying again."
                    )}
                  </p>
                )}
                {isConnectionError && (
                  <p className="mt-2 text-xs">
                    💡{" "}
                    {t(
                      "errors.connectionHint",
                      "This might be due to CORS restrictions or the server being rate-limited. Please wait and try again."
                    )}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => refetch()}
                  className={`px-4 py-2 rounded-md text-white font-medium ${isRateLimit ? "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"} transition-colors`}
                >
                  {t("mealTypePage.tryAgain")}
                </button>
                {process.env.NODE_ENV === "development" && (
                  <button
                    onClick={() => {
                      resetCircuitBreaker();
                      console.log(
                        "Circuit breaker status:",
                        getCircuitBreakerStatus()
                      );
                      refetch();
                    }}
                    className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                    title="Reset circuit breaker and retry"
                  >
                    Reset & Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
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
          <button
            onClick={() => {
              getAuthToken();
            }}
            className="ml-4 text-xs text-yellow-800 dark:text-yellow-200 underline"
          >
            {t("homePage.logAuthToken")}
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
