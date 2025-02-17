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
    >,
  ) => {
    const { name, value } = e.target;
    setMeal({ ...meal, [name]: value });
  };

  const handleFoodComponentChange = (selectedOptions: any) => {
    console.log("selectedOptions", selectedOptions);
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
      })),
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
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Create New Meal
      </h1>
      <MealForm
        meal={meal}
        foodComponentOptions={categoryOptions}
        onInputChange={handleChange}
        onFoodComponentChange={handleFoodComponentChange}
        onCuisineChange={handleCuisineChange}
        onMealTypeChange={handleMealTypeChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CreateMealPage;
