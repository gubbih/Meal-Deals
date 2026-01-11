import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMeal } from "../services/api";
import { Meal } from "../models/Meal";
import useCachedFoodComponents from "../hooks/useCachedFoodComponents";
import MealForm from "../components/MealForm";
import Modal from "../components/Modal";
import { useAuth } from "../contexts/AuthContext";
import { MealFormValues } from "../schemas/mealSchemas";
import { useToast } from "../contexts/ToastContext";
import { useCache } from "../contexts/CacheContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

function CreateMealPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    foodComponents,
    loading: foodComponentsLoading,
    error,
  } = useCachedFoodComponents();
  const { showToast } = useToast();
  const { invalidate } = useCache();

  const initialMeal: Meal = {
    id: "",
    name: "",
    description: "",
    price: 0,
    priceCurrency: "",
    imagePath: "",
    image: undefined,
    foodComponents: [],
    mealType: "",
    mealCuisine: "",
    createdBy: user?.id || "guest",
    createdAt: new Date().toISOString(),
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Only redirect if we're definitely logged out (not during loading)
  useEffect(() => {
    if (!authLoading && user === null) {
      showToast("warning", "You must be logged in to create a meal");
      navigate("/auth");
    }
  }, [user, authLoading, navigate, showToast]);

  const handleSubmit = async (formData: MealFormValues) => {
    if (!user) {
      showToast("error", "You must be logged in to create a meal");
      navigate("/auth");
      return;
    }

    try {
      setFormSubmitting(true);

      // Combine form data with additional meal properties
      const mealData: Omit<Meal, "id"> = {
        ...initialMeal,
        ...formData,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      };
      console.log("Creating meal with data:", mealData);

      await createMeal(mealData);

      // Invalidate meals cache since we've added a new meal
      invalidate("all-meals");

      showToast("success", "Meal successfully added!");

      // Add a small delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate("/MyMeals", {
          state: {
            refetch: true,
            toast: {
              type: "success",
              message: "Meal successfully added!",
            },
          },
        });
      }, 300);
    } catch (error) {
      console.error("Error adding meal:", error);
      showToast("error", "Failed to add meal!");
    } finally {
      setFormSubmitting(false);
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
    // Group food components by category for better organization
    const categorized = new Map<string, string[]>();

    foodComponents.forEach((fc) => {
      if (Array.isArray(fc.items)) {
        fc.items.forEach((item) => {
          if (!categorized.has(fc.category)) {
            categorized.set(fc.category, []);
          }
          categorized.get(fc.category)?.push(item);
        });
      }
    });

    // Convert the map to the format expected by the MealForm component
    const options: Array<{
      label: string;
      value: string;
      category: string;
    }> = [];

    categorized.forEach((items, category) => {
      items.forEach((item) => {
        options.push({
          label: `${category}: ${item}`,
          value: item,
          category: category,
        });
      });
    });

    // Sort options alphabetically by category, then by item
    return options.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.value.localeCompare(b.value);
    });
  }, [foodComponents]);

  // Show loading spinner if we're still checking auth or loading food components
  if (authLoading || foodComponentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        <p className="font-medium mb-2">Error loading food components:</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmNavigateAway}
        message="Er du sikker på at gå væk fra denne side, tingene er ikke gemt?"
      />
      <h1 className="text-xl justify-center flex font-semibold tracking-tight text-gray-900 dark:text-white mb-6 ">
        Create New Meal
      </h1>

      {formSubmitting ? (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Saving your meal...
          </p>
        </div>
      ) : (
        <MealForm
          meal={initialMeal}
          foodComponentOptions={categoryOptions}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default CreateMealPage;
