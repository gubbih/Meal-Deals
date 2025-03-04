import React, { useEffect, useState } from "react";
import { useAuth, getMealByUser, deleteMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

const MyMeals = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);

  const fetchMeals = async () => {
    if (!user) return;
    const usersMeal = await getMealByUser(user.uid);
    setMeals(usersMeal);
  };

  useEffect(() => {
    fetchMeals();
  });

  const handleDelete = (mealId: string) => {
    setMealToDelete(mealId);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (mealToDelete) {
      try {
        await deleteMeal(mealToDelete);
        setToast({ type: "success", message: "Meal deleted successfully!" });
        fetchMeals();
      } catch (error) {
        setToast({ type: "error", message: "Failed to delete meal." });
      } finally {
        setIsModalVisible(false);
        setMealToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setMealToDelete(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Waiting for user...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Meals
          </h1>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Add Meal
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No meals found.</p>
            <Link
              to="/create"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Meal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={meal.imagePath}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {meal.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {meal.mealType && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {meal.mealType}
                      </span>
                    )}
                    {meal.mealCuisine && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                        {meal.mealCuisine}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/meal/${meal.id}`}
                      className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      View
                    </Link>
                    <Link
                      to={`/meal/${meal.id}/edit`}
                      className="flex-1 text-center px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="flex-1 px-3 py-2 text-white text-sm font-medium rounded-md bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this meal?"
      />
    </div>
  );
};

export default MyMeals;
