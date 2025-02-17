import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import { useFetchMeal } from "../hooks/useFetchMeal";
import useUpdateMeal from "../hooks/useUpdateMeal";

function EditMealPage() {
  const { id } = useParams<{ id: string }>() || { id: "" };
  console.log("id", id);
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

  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (fetchedMeal) {
      setMeal({
        ...fetchedMeal,
        mealCuisine: fetchedMeal.mealCuisine || "",
        mealType: fetchedMeal.mealType || "",
        foodComponents: fetchedMeal.foodComponents
          ? fetchedMeal.foodComponents
          : [],
      });
    }
  }, [fetchedMeal]);

  const onInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (meal) {
      const { name, value } = e.target;
      setMeal({ ...meal, [name]: value });
    }
  };

  const onFoodComponentChange = (selectedOptions: any) => {
    if (meal) {
      console.log("selectedOptions", selectedOptions);
      const formattedComponents = selectedOptions.map((option: any) => ({
        category: option.category,
        items: option.value,
      }));
      setMeal({ ...meal, foodComponents: formattedComponents });
    }
  };

  // Handle Select Changes (for Meal Type and Cuisine)
  const handleSelectChange = (key: keyof Meal) => (selectedOption: any) => {
    if (meal) {
      setMeal({ ...meal, [key]: selectedOption.value });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (meal) {
      await updateMealData(meal);
    }
  };

  // Transform Food Components to Category Options for Select
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

  // Check if Loading or Error States are Present
  const isLoading = mealLoading || foodComponentsLoading || updateLoading;
  const error = mealError || foodComponentsError || updateError;
  console.log("meal", meal);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!id) return <div>No meal found</div>;

  return (
    <div className="">
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Edit Meal
        </h1>
        {meal && (
          <MealForm
            meal={meal}
            foodComponentOptions={categoryOptions}
            onInputChange={onInputChange}
            onFoodComponentChange={onFoodComponentChange}
            onCuisineChange={handleSelectChange("mealCuisine")}
            onMealTypeChange={handleSelectChange("mealType")}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default EditMealPage;
