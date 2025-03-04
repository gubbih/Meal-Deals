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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Waiting for user...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Meals
          </h1>
        </div>

        {meals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No meals found.</p>
            <Link
              to="/meal/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Meal
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-4 sm:p-6">
                  <div className=" sm:flex sm:justify-between sm:items-start">
                    {/* Meal details */}
                    <div className="flex-none">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {meal.name}
                      </h2>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {meal.mealCuisine}: Køkken
                      </p>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Måltid: {meal.mealType}
                      </p>
                    </div>
                    <div className="flex-grow  sm:space-x-0 sm:flex sm:flex-col sm:items-end">
                      <div className="mt-3 flex flex-wrap gap-2">
                        {meal.foodComponents.map((component, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200"
                          >
                            {component.items}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="mt-4 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2 sm:flex-col sm:ml-4">
                      <Link
                        to={`/meal/${meal.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full"
                      >
                        View
                      </Link>
                      <Link
                        to={`/meal/${meal.id}/edit`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors w-full"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors w-full"
                      >
                        Delete
                      </button>
                    </div>
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
