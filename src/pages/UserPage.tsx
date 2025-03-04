import React, { useState } from "react";
import { useAuth } from "../services/firebase";
import useSignIn from "../hooks/useSignIn";
import useSignOut from "../hooks/useSignOut";
import useSignUp from "../hooks/useSignUp";
import useFetchMeals from "../hooks/useFetchMeals";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";

function UserPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    handleSignIn,
    loading: signInLoading,
    error: signInError,
  } = useSignIn();
  const { handleSignOut, loading: signOutLoading } = useSignOut();
  const {
    handleSignUp,
    loading: signUpLoading,
    error: signUpError,
  } = useSignUp();
  const { meals } = useFetchMeals();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await handleSignUp(email, password, displayName);
        setToast({ type: "success", message: "Account created successfully!" });
      } else {
        await handleSignIn(email, password);
        setToast({ type: "success", message: "Signed in successfully!" });
      }
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error) {
      setToast({ type: "error", message: "Authentication failed." });
    }
  };

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
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-2">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 font-medium rounded-lg w-full sm:w-auto ${
                !isSignUp
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 font-medium rounded-lg w-full sm:w-auto ${
                isSignUp
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSignUp ? signUpLoading : signInLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
            >
              {isSignUp
                ? signUpLoading
                  ? "Creating Account..."
                  : "Create Account"
                : signInLoading
                  ? "Signing In..."
                  : "Sign In"}
            </button>

            {(signInError || signUpError) && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {signInError || signUpError}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default UserPage;
