import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { useFetchMeal } from "../hooks/useFetchMeal";
import useUpdateMeal from "../hooks/useUpdateMeal";
import Modal from "../components/Modal";
import { MealFormValues } from "../schemas/mealSchemas";
import { useToast } from "../contexts/ToastContext";

function EditMealPage() {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    foodComponents,
    loading: foodComponentsLoading,
    error: foodComponentsError,
  } = useFetchFoodComponents();

  const {
    meal: fetchedMeal,
    loading: mealLoading,
    error: mealError,
  } = useFetchMeal(id || "");

  const {
    updateMealData,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMeal();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navigateAway, setNavigateAway] = useState(false);

  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const confirmNavigateAway = () => {
    setIsModalVisible(false);
    setNavigateAway(true);
  };

  React.useEffect(() => {
    if (navigateAway) {
      navigate("/");
    }
  }, [navigateAway, navigate]);

  const handleSubmit = async (data: MealFormValues) => {
    if (fetchedMeal) {
      try {
        // Combine existing meal data with form updates
        const updatedMeal: Meal = {
          ...fetchedMeal,
          ...data,
        };

        await updateMealData(updatedMeal);
        showToast("success", "Meal successfully updated!");
        navigate("/");
      } catch (error) {
        showToast("error", "Failed to update meal!");
      }
    }
  };

  const categoryOptions = useMemo(() => {
    return foodComponents.flatMap((fc) => {
      if (Array.isArray(fc.items)) {
        return fc.items.map((item) => ({
          label: `${fc.category}: ${item}`,
          value: [item],
          category: fc.category,
        }));
      }
      return [];
    });
  }, [foodComponents]);

  const isLoading = mealLoading || foodComponentsLoading || updateLoading;
  const error = mealError || foodComponentsError || updateError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!id || !fetchedMeal) return <div>No meal found</div>;

  // Ensure meal has complete data for the form
  const mealWithDefaults: Meal = {
    ...fetchedMeal,
    mealCuisine: fetchedMeal.mealCuisine || "",
    mealType: fetchedMeal.mealType || "",
    foodComponents: fetchedMeal.foodComponents || [],
  };

  return (
    <div className="">
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmNavigateAway}
        message="Er du sikker på at gå væk fra denne side, tingene er ikke gemt?"
      />
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Edit Meal
        </h1>
        <MealForm
          meal={mealWithDefaults}
          foodComponentOptions={categoryOptions}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default EditMealPage;
