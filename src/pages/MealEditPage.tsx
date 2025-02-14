import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { updateMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import useFetchMeal from "../hooks/useFetchMeal";

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
  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<
    { label: string; value: string; category: string }[]
  >([]);

  useEffect(() => {
    if (fetchedMeal) {
      setMeal(fetchedMeal);
      console.log("fetchedMeal: ", fetchedMeal);
      setSelectedComponents(
        fetchedMeal.foodComponents.map((fc) => ({
          label: `${fc.category}: ${Array.isArray(fc.items) ? fc.items.join(", ") : fc.items}`,
          value: Array.isArray(fc.items) ? fc.items.join(", ") : fc.items,
          category: fc.category,
        }))
      );
    }
  }, [fetchedMeal]);

  const onInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (meal) {
      const { name, value } = e.target;
      setMeal({ ...meal, [name]: value });
    }
  };

  const onFoodComponentChange = (selectedOptions: any) => {
    console.log("selectedOptions: ", selectedOptions);
    setSelectedComponents(selectedOptions);
    if (meal) {
      const formattedComponents = selectedOptions.map((option: any) => {
        const { label, value, ...rest } = option;
        return { ...rest, items: value };
      });
      setMeal({ ...meal, foodComponents: formattedComponents });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (meal) {
      await updateMeal(meal);
      alert("Meal successfully updated!");
    }
  };

  const categoryOptions = useMemo(() => {
    return foodComponents.flatMap((fc) =>
      fc.items.map((item) => ({
        label: `${fc.category}: ${item}`,
        value: item,
        category: fc.category,
      }))
    );
  }, [foodComponents]);

  if (!id) return <div>No meal found</div>;
  if (mealError || foodComponentsError)
    return <div>Error: {mealError || foodComponentsError}</div>;
  if (mealLoading || foodComponentsLoading) return <div>Loading...</div>;

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
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default EditMealPage;
