import React, { useState } from "react";
import { useAuth } from "../services/firebase";
import useSignIn from "../hooks/useSignIn";
import useSignOut from "../hooks/useSignOut";
import useSignUp from "../hooks/useSignUp";
import useFetchMeals from "../hooks/useFetchMeals";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";

//import useUpdateUserProfile from "../hooks/useUpdateUser";

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
  //const { updateUserProfile, loading: updateLoading } = useUpdateUserProfile();
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
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Display Name</p>
                <p className="font-medium">{user.displayName || "Not set"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="font-medium">
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

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Favorite Meals</h2>
            {favoriteMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteMeals.map((meal) => (
                  <Link
                    key={meal.id}
                    to={`/meal/${meal.id}`}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <img
                      src={meal.imagePath}
                      alt={meal.name}
                      className="h-12 w-12 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 font-medium rounded-lg ${
                !isSignUp
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 font-medium rounded-lg ${
                isSignUp
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-4">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSignUp ? signUpLoading : signInLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
