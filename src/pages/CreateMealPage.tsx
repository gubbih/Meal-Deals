import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    mealType: null,
    mealCuisine: null,
    createdBy: user?.id || "guest",
    createdAt: new Date().toISOString(),
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Only redirect if we're definitely logged out (not during loading)
  useEffect(() => {
    if (!authLoading && user === null) {
      showToast("warning", t("createMealPage.mustBeLoggedIn"));
      navigate("/auth");
    }
  }, [user, authLoading, navigate, showToast, t]);

  const handleSubmit = async (formData: MealFormValues) => {
    console.log("handleSubmit called with:", formData);
    if (!user) {
      showToast("error", t("createMealPage.mustBeLoggedIn"));
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
      await createMeal(mealData);

      // Invalidate meals cache since we've added a new meal
      invalidate("all-meals");

      showToast("success", t("createMealPage.mealSuccessfullyAdded"));

      // Add a small delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate("/", {
          state: {
            refetch: true,
            toast: {
              type: "success",
              message: t("createMealPage.mealSuccessfullyAdded"),
            },
          },
        });
      }, 300);
    } catch (error) {
      console.error("Error adding meal:", error);
      showToast("error", t("createMealPage.failedToAddMeal"));
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
        <p className="font-medium mb-2">
          {t("createMealPage.errorLoadingData")}:
        </p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t("createMealPage.tryAgain")}
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
        message={t("createMealPage.confirmLeave")}
      />
      <h1 className="text-xl justify-center flex font-semibold tracking-tight text-gray-900 dark:text-white mb-6 ">
        {t("createMealPage.createNewMeal")}
      </h1>

      {formSubmitting ? (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("createMealPage.savingMeal")}
          </p>
        </div>
      ) : (
        <MealForm
          meal={initialMeal}
          foodComponents={foodComponents}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default CreateMealPage;
