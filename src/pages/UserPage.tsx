import React, { useState } from "react";
import { useAuth } from "../services/firebase";
import useSignOut from "../hooks/useSignOut";
import useFetchMeals from "../hooks/useFetchMeals";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import AuthForm from "../components/AuthForm";

function UserPage() {
  const { user, loading: authLoading } = useAuth();
  const { handleSignOut, loading: signOutLoading } = useSignOut();
  const { meals } = useFetchMeals();
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleUserSignOut = async () => {
    await handleSignOut();
    setToast({ type: "success", message: "Signed out successfully!" });
  };

  // Filter favorite meals
  const favoriteMeals = user?.favoriteRecipes
    ? meals.filter((meal) => user.favoriteRecipes?.includes(meal.id))
    : [];

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
    <div className="w-full max-w-4xl1 mx-auto p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center dark:text-white">
        User Profile
      </h1>

      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Display Name
                </p>
                <p className="font-medium dark:text-white">
                  {user.displayName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="font-medium dark:text-white">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Login
                </p>
                <p className="font-medium dark:text-white">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>

              <button
                onClick={handleUserSignOut}
                disabled={signOutLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                {signOutLoading ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Favorite Meals
            </h2>
            {favoriteMeals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {favoriteMeals.map((meal) => (
                  <Link
                    key={meal.id}
                    to={`/meal/${meal.id}`}
                    className="flex flex-col p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition h-full"
                  >
                    <div className="w-full h-36 rounded-md overflow-hidden mb-3">
                      <img
                        src={meal.imagePath}
                        alt={meal.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base text-gray-900 dark:text-white line-clamp-2">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {meal.mealType}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>You haven't added any favorites yet.</p>
                <Link
                  to="/"
                  className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Browse meals to add favorites
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
