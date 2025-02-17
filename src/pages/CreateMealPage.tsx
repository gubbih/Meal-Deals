import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addMeal } from "../services/firebase";
import { Meal } from "../models/Meal";
import useFetchFoodComponents from "../hooks/useFetchFoodComponents";
import MealForm from "../components/MealForm";
import Toast from "../components/Toast";

function CreateMealPage() {
  const navigate = useNavigate();
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
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

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
    try {
      await addMeal(meal);
      setToast({ type: "success", message: "Meal successfully added!" });
      navigate("/", {
        state: {
          toast: { type: "success", message: "Meal successfully added!" },
        },
      });
    } catch (error) {
      setToast({ type: "error", message: "Failed to add meal!" });
    }
  };

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
      {toast && <Toast type={toast.type} message={toast.message} />}
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
