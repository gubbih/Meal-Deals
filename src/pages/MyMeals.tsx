import React, { useEffect, useState } from "react";
import { useAuth } from "../services/firebase";
import { getMeals, deleteMeal } from "../services/firebase";
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

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    const allMeals = await getMeals();
    const userMeals = allMeals.filter((meal) => meal.createdBy === user?.uid);
    setMeals(userMeals);
  };

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

  return (
    <div className="p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <h1 className="text-2xl font-bold mb-4">My Meals</h1>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold">{meal.name}</h2>
                <p className="text-gray-600">
                  {meal.price} {meal.priceCurrency}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {meal.foodComponents.map((component, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded"
                    >
                      {component.items}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/meal/${meal.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/meal/${meal.id}/edit`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
