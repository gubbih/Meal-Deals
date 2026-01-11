import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meal } from "../models/Meal";
import useCachedFoodComponents from "../hooks/useCachedFoodComponents";
import MealForm from "../components/MealForm";
import { useCachedMeal } from "../hooks/useCachedMeal";
import useUpdateMeal from "../hooks/useUpdateMeal";
import Modal from "../components/Modal";
import { MealFormValues } from "../schemas/mealSchemas";
import { useToast } from "../contexts/ToastContext";
import { useCache } from "../contexts/CacheContext";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Helper function to transform nested food components structure to flat structure
const transformFoodComponents = (foodComponents: any[]) => {
  if (!foodComponents || foodComponents.length === 0) return [];

  return foodComponents.map((item) => {
    // Check if it's the nested structure (has a "component" property)
    if (item.component) {
      return {
        id: item.component.id,
        componentName: item.component.componentName,
        normalizedName:
          item.component.normalizedName || item.component.componentName,
        categoryId:
          item.component.category?.id || item.component.categoryId || "",
        category: {
          id: item.component.category?.id || item.component.categoryId || "",
          categoryName: item.component.category?.categoryName || "Unknown",
        },
        categoryName: item.component.category?.categoryName || "Unknown",
      };
    }

    // If it's already in the correct format, ensure it has proper structure
    return {
      id: item.id,
      componentName: item.componentName,
      normalizedName: item.normalizedName || item.componentName,
      categoryId: item.category?.id || item.categoryId || "",
      category: {
        id: item.category?.id || item.categoryId || "",
        categoryName: item.category?.categoryName || "Unknown",
      },
      categoryName: item.category?.categoryName || "Unknown",
    };
  });
};

function EditMealPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { invalidate } = useCache();
  const { user, loading: authLoading } = useAuth();

  const {
    foodComponents,
    loading: foodComponentsLoading,
    error: foodComponentsError,
  } = useCachedFoodComponents();

  const {
    meal: fetchedMeal,
    loading: mealLoading,
    error: mealError,
    refetch: refetchMeal,
  } = useCachedMeal(id || "");
  const {
    updateMealData,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMeal();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  // Check permission - only allow editing of own meals
  useEffect(() => {
    if (!mealLoading && fetchedMeal && user) {
      if (fetchedMeal.createdBy !== user.id && !user.isAdmin) {
        setPermissionError(true);
        showToast("error", "You don't have permission to edit this meal");
      }
    }
  }, [fetchedMeal, user, mealLoading, showToast]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && user === null) {
      showToast("warning", "You must be logged in to edit a meal");
      navigate("/auth");
    }
  }, [user, authLoading, navigate, showToast]);

  // Handle 404 errors
  useEffect(() => {
    if (fetchedMeal) {
      // Reset error flags when meal is successfully loaded
      setNotFoundError(false);
      setPermissionError(false);
    }
  }, [fetchedMeal]);

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

  const handleSubmit = async (data: MealFormValues) => {
    if (fetchedMeal) {
      try {
        setFormSubmitting(true);

        // Process food components to ensure proper structure before saving
        const processedFoodComponents = data.foodComponents.map(
          (component: any) => ({
            id: component.id,
            componentName: component.componentName,
            normalizedName: component.normalizedName || component.componentName,
            categoryId: component.category?.id || component.categoryId || "",
            category:
              component.category && typeof component.category === "object"
                ? {
                    id: component.category.id || 0,
                    categoryName:
                      component.category.categoryName || "Uncategorized",
                  }
                : { id: 0, categoryName: "Uncategorized" },
            categoryName:
              component.category?.categoryName ||
              component.categoryName ||
              "Uncategorized",
          })
        );

        // Combine existing meal data with form updates
        const updatedMeal: Meal = {
          ...fetchedMeal,
          ...data,
          foodComponents: processedFoodComponents,
        };

        await updateMealData(id || "", updatedMeal);

        // Invalidate both the all-meals cache and this specific meal's cache
        invalidate("all-meals");
        invalidate(`meal-${id}`);

        showToast("success", "Meal successfully updated!");

        // Add a small delay before navigation to ensure toast is visible
        setTimeout(() => {
          navigate(`/meal/${id}`, {
            state: {
              toast: {
                type: "success",
                message: "Meal successfully updated!",
              },
            },
          });
        }, 300);
      } catch (error) {
        console.error("Error updating meal:", error);
        showToast("error", "Failed to update meal!");
      } finally {
        setFormSubmitting(false);
      }
    }
  };

  const isLoading =
    authLoading || mealLoading || foodComponentsLoading || updateLoading;
  const error = mealError || foodComponentsError || updateError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFoundError) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">Meal not found</p>
        <p>The meal you're looking for doesn't exist or has been deleted.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">Permission Denied</p>
        <p>You don't have permission to edit this meal.</p>
        <button
          onClick={() => navigate(`/meal/${id}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Meal
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">Error</p>
        <p>{error}</p>
        <button
          onClick={() => {
            refetchMeal();
            window.location.reload();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!id || !fetchedMeal) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center min-h-64">
        <p className="text-lg font-medium mb-2">No meal data found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Transform food components from nested structure to flat structure for the form
  const transformedFoodComponents = transformFoodComponents(
    fetchedMeal.foodComponents || []
  );

  console.log("Original food components:", fetchedMeal.foodComponents);
  console.log("Transformed food components:", transformedFoodComponents);

  // Ensure meal has complete data for the form
  const mealWithDefaults: Meal = {
    ...fetchedMeal,
    mealCuisine: fetchedMeal.mealCuisine || "",
    mealType: fetchedMeal.mealType || "",
    foodComponents: transformedFoodComponents,
  };

  if (!id) {
    return <div>loading...</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmNavigateAway}
        message="Er du sikker på at gå væk fra denne side, tingene er ikke gemt?"
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Edit Meal: {fetchedMeal.name}
        </h1>
      </div>

      {formSubmitting ? (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Updating your meal...
          </p>
        </div>
      ) : (
        <MealForm
          meal={mealWithDefaults}
          foodComponents={foodComponents}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default EditMealPage;
