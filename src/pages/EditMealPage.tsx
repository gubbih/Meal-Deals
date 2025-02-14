import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import useFetchMeal from "../hooks/useFetchMeal";
import useUpdateMeal from "../hooks/useUpdateMeal";
interface SelectedOption {
  label: string;
  value: string[];
  category: string;
}

function EditMealPage() {
  const { id } = useParams<{ id: string }>() || { id: "" };
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
      setMeal(fetchedMeal);
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

  const onFoodComponentChange = (selectedOptions: SelectedOption[]) => {
    if (meal) {
      const formattedComponents = selectedOptions.map((option) => ({
        category: option.category,
        items: option.value,
      }));
      setMeal({ ...meal, foodComponents: formattedComponents });
    }
  };
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

  const categoryOptions = useMemo(() => {
    if (!foodComponents.length) return [];
    return foodComponents.flatMap((fc) =>
      fc.items.map((item) => ({
        label: `${fc.category}: ${item}`,
        value: [item],
        category: fc.category,
      })),
    );
  }, [foodComponents]);

  const isLoading = mealLoading || foodComponentsLoading || updateLoading;
  const error = mealError || foodComponentsError || updateError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!id) return <div>No meal found</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Meal</h1>
      {meal && (
        <MealForm
          meal={meal}
          categoryOptions={categoryOptions}
          foodComponentOptions={categoryOptions}
          onInputChange={onInputChange}
          onFoodComponentChange={onFoodComponentChange}
          onCuisineChange={handleSelectChange("mealCuisine")}
          onMealTypeChange={handleSelectChange("mealType")}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default EditMealPage;
