import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useSignOut from "../hooks/useSignOut";
import useFetchMeals from "../hooks/useFetchMeals";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import AuthForm from "../components/AuthForm";
import { useTranslation } from "react-i18next";
import { loadFavoritesForUser } from "../hooks/useFavoriteMeals";
import MealCard from "../components/MealCard";

function UserPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { handleSignOut, loading: signOutLoading } = useSignOut();
  const { meals } = useFetchMeals();
  const [favoriteMeals, setFavoriteMeals] = useState<typeof meals>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleUserSignOut = async () => {
    await handleSignOut();
    setToast({ type: "success", message: t("mealPage.toast.signedOut") });
  };
  const fetchFavoriteMeals = async () => {
    if (user) {
      try {
        const favoriteIds = await loadFavoritesForUser(user.id);
        const favoriteMealsList = meals.filter((meal) =>
          favoriteIds.includes(meal.id),
        );
        setFavoriteMeals(favoriteMealsList);
      } catch (error) {
        console.error("Failed to load favorite meals:", error);
        setToast({
          type: "error",
          message: t("mealPage.toast.failedToLoadFavorites"),
        });
      }
    }
  };

  React.useEffect(() => {
    fetchFavoriteMeals();
  }, [user, meals]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center dark:text-white">
        {t("userPage.userProfile")}
      </h1>

      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {t("userPage.profileInformation")}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("userPage.displayName")}
                </p>
                <p className="font-medium dark:text-white">
                  {user.displayName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("userPage.email")}
                </p>
                <p className="font-medium dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("userPage.accountCreated")}
                </p>
                <p className="font-medium dark:text-white">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : t("userPage.unknown")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("userPage.lastLogin")}
                </p>
                <p className="font-medium dark:text-white">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : t("userPage.unknown")}
                </p>
              </div>
            </div>
            <br />
            <button
              onClick={handleUserSignOut}
              disabled={signOutLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {signOutLoading
                ? t("userPage.signingOut")
                : t("userPage.signOut")}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-2 sm:p-6 lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {t("userPage.favoriteMeals")}
            </h2>
            {favoriteMeals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {favoriteMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t("favoritesPage.noFavoritesYet")}</p>
                <Link
                  to="/"
                  className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("favoritesPage.startExploring")}
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

export default UserPage;
