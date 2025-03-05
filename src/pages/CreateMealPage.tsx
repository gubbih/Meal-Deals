import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useCachedFoodComponents from "../hooks/useCachedFoodComponents";
import MealForm from "../components/MealForm";
import Modal from "../components/Modal";
import { useAuth } from "../services/firebase";
import { MealFormValues } from "../schemas/mealSchemas";
import { useToast } from "../contexts/ToastContext";
import { useCache } from "../contexts/CacheContext";

function CreateMealPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { foodComponents, loading, error } = useCachedFoodComponents();
  const { showToast } = useToast();
  const { invalidate } = useCache();

  const initialMeal: Meal = {
    id: "",
    name: "",
    description: "",
    price: 0,
    priceCurrency: "",
    imagePath: "",
    foodComponents: [],
    mealType: "",
    mealCuisine: "",
    createdBy: user?.uid || "guest",
    createdAt: new Date().toISOString(),
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);

  const handleSubmit = async (formData: MealFormValues) => {
    try {
      // Combine form data with additional meal properties
      const mealData: Meal = {
        ...initialMeal,
        ...formData,
        createdBy: user?.uid || "guest",
        createdAt: new Date().toISOString(),
      };

      await addMeal(mealData);

      // Invalidate meals cache since we've added a new meal
      invalidate("all-meals");

      showToast("success", "Meal successfully added!");
      navigate("/");
    } catch (error) {
      showToast("error", "Failed to add meal!");
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const confirmNavigateAway = () => {
    setIsModalVisible(false);
    setNavigateAway(true);
  };

  useEffect(() => {
    if (navigateAway) {
      navigate("/");
    }
  }, [navigateAway, navigate]);

  const categoryOptions = useMemo(() => {
    return foodComponents.flatMap((fc) =>
      fc.items.map((item) => ({
        label: `${fc.category}: ${item}`,
        value: [item],
        category: fc.category,
      }))
    );
  }, [foodComponents]);

  if (loading)
    return (
      <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
          Loading...
        </div>
      </div>
    );
  if (error)
    return (
      <p
        id="standard_error_help"
        className="mt-2 text-xs text-red-600 dark:text-red-400"
      >
        <span className="font-medium">Oh, snapp!</span> {error}
      </p>
    );

  return (
    <div className="p-4 bg-white dark:bg-black dark:bg-gray-900">
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmNavigateAway}
        message="Er du sikker på at gå væk fra denne side, tingene er ikke gemt?"
      />
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Create New Meal
      </h1>
      <MealForm
        meal={initialMeal}
        foodComponentOptions={categoryOptions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default CreateMealPage;
