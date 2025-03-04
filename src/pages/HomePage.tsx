import React from "react";
import { Link } from "react-router-dom";
import useFetchMeals from "../hooks/useFetchMeals";
import { useAuth } from "../services/firebase";
import MealCarousel from "../components/MealCarousel";
import Toast from "../components/Toast";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const { meals, loading, error } = useFetchMeals();
  const { user } = useAuth();

  // Check for toast from navigation state
  const [toast, setToast] = React.useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(location.state?.toast || null);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && <Toast type={toast.type} message={toast.message} />}

      {/* About Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Cheap Meals: Delicious Cooking Made Affordable
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam
          nisl nisl sit amet nisl. Sed euismod, nulla sit amet aliquam lacinia,
          nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.
        </p>

        {!user && (
          <div className="mt-8">
            <Link
              to="/user"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
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
        <div className="text-center mt-12">
          <Link
            to="/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Create Your Own Meal
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
