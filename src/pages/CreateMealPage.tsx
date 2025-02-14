import React, { useState, useMemo } from "react";
import { addMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";

function CreateMealPage() {
  const { foodComponents, loading, error } = useFetchFoodComponents();
  const [meal, setMeal] = useState<Meal>({
    id: "",
    name: "",
    description: "",
    price: 0,
    priceCurrency: "",
    imagePath: "",
    foodComponents: [],
    mealType: "",
    mealCuisine: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleFoodComponentChange = (selectedOptions: any) => {
    const formattedComponents = selectedOptions.map((option: any) => {
      const { label, value, ...rest } = option;
      return { ...rest, items: value };
    });
    setMeal({ ...meal, foodComponents: formattedComponents });
  };

  const handleCuisineChange = (selectedOption: any) => {
    setMeal({ ...meal, mealCuisine: selectedOption.value });
  };

  const handleMealTypeChange = (selectedOption: any) => {
    setMeal({ ...meal, mealType: selectedOption.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addMeal(meal);
    alert("Meal successfully added!");
  };

  // Moved categoryOptions to useMemo for optimization
  const categoryOptions = useMemo(() => {
    return foodComponents.flatMap((fc) =>
      fc.items.map((item) => ({
        label: `${fc.category}: ${item}`,
        value: [item],
        category: fc.category,
      }))
    );
  }, [foodComponents]);

  // Memoize selectedItems to avoid unnecessary re-renders
  const selectedItems = useMemo(() => {
    return new Set(meal.foodComponents.flatMap((component) => component.items));
  }, [meal.foodComponents]);

  // Memoize filteredFoodComponentOptions
  const filteredFoodComponentOptions = useMemo(() => {
    return categoryOptions
      .filter((option) => !selectedItems.has(option.value[0]))
      .map((option) => ({
        ...option,
        label: `${option.category}: ${option.value}`,
      }));
  }, [categoryOptions, selectedItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Meal</h1>
      <MealForm
        meal={meal}
        foodComponentOptions={filteredFoodComponentOptions}
        categoryOptions={categoryOptions}
        onInputChange={handleChange}
        onFoodComponentChange={handleFoodComponentChange}
        onSubmit={handleSubmit}
        onCuisineChange={handleCuisineChange}
        onMealTypeChange={handleMealTypeChange}
      />
    </div>
  );
}

export default CreateMealPage;
