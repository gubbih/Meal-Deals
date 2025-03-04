import React from "react";
import { Link } from "react-router-dom";
import useFetchMeals from "../hooks/useFetchMeals";
import { useAuth } from "../services/firebase";
import MealCarousel from "../components/MealCarousel";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const { meals, loading, error } = useFetchMeals();
  const { user } = useAuth();

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
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      {/* About Section */}
      <section className="mb-8 sm:mb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Cheap Meals: Delicious Cooking Made Affordable
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
          nisl nisl sit amet nisl.
        </p>

        {!user && (
          <div className="mt-6 sm:mt-8">
            <Link
              to="/user"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </section>

      {/* Favorite Meals Section (for logged-in users) */}
      {user && favoriteMeals.length > 0 && (
        <MealCarousel
          meals={favoriteMeals}
          title="Your Favorite Meals"
          isFavoriteSection
        />
      )}

      {/* All Meals Section */}
      <MealCarousel meals={meals} title="Explore Meals" />

      {/* Create Meal Call to Action */}
      {user && (
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/create"
            className="inline-block bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Create Your Own Meal
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
