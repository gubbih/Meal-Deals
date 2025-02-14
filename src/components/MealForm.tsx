import React, { useMemo } from "react";
import Select from "react-select";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";
import { cuisines, mealsTypes } from "../assets/Arrays";

interface MealFormProps {
  meal: Meal;
  foodComponentOptions: { label: string; value: string[]; category: string }[];
  categoryOptions: { label: string; value: string[]; category: string }[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFoodComponentChange: (selectedOptions: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCuisineChange: (selectedOption: any) => void;
  onMealTypeChange: (selectedOption: any) => void;
}

const MealForm: React.FC<MealFormProps> = ({
  meal,
  foodComponentOptions,
  categoryOptions,
  onInputChange,
  onFoodComponentChange,
  onSubmit,
  onCuisineChange,
  onMealTypeChange,
}) => {
  console.log("meal: ", meal);

  // Ensure meal object has default values
  const defaultMeal = {
    mealCuisine: meal.mealCuisine || "",
    mealType: meal.mealType || "",
    ...meal,
  };

  // Convert cuisines and mealsTypes to react-select format
  const cuisineOptions = cuisines.map((cuisine) => ({
    value: cuisine,
    label: cuisine,
  }));

  const mealTypeOptions = mealsTypes.map((mealType) => ({
    value: mealType,
    label: mealType,
  }));

  // Filter out selected options from foodComponentOptions
  const selectedItems = useMemo(() => {
    return new Set(
      defaultMeal.foodComponents.flatMap((component) => component.items)
    );
  }, [defaultMeal.foodComponents]);

  const filteredFoodComponentOptions = useMemo(() => {
    return foodComponentOptions
      .filter(
        (option) =>
          !defaultMeal.foodComponents.some(
            (component) => component.items.includes(option.value[0]) // Access the first element
          )
      )
      .map((option) => ({
        ...option,
        value: option.value, // Already an array
        label: `${option.category}: ${option.value[0]}`, // Use the first value for display
      }));
  }, [foodComponentOptions, defaultMeal.foodComponents]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={defaultMeal.name}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={defaultMeal.description}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="imagePath"
            value={defaultMeal.imagePath}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Cuisine Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Cuisine</label>
          <Select
            name="mealCuisine"
            value={cuisineOptions.find(
              (option) => option.value === defaultMeal.mealCuisine
            )}
            onChange={onCuisineChange} // This stays the same
            options={cuisineOptions}
            className="w-full"
          />
        </div>

        {/* Meal Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Meal Type</label>
          <Select
            name="mealType"
            value={mealTypeOptions.find(
              (option) => option.value === defaultMeal.mealType
            )}
            onChange={onMealTypeChange} // This stays the same
            options={mealTypeOptions}
            className="w-full"
          />
        </div>

        {/* Food Components Multi-Select */}
        <div className="mb-4">
          <label className="block text-gray-700">Food Components</label>
          <Select
            options={filteredFoodComponentOptions}
            isMulti
            onChange={onFoodComponentChange}
            value={defaultMeal.foodComponents.flatMap(
              (component: FoodComponent) =>
                component.items.map((item) => ({
                  label: `${component.category}: ${item}`,
                  value: [item], // Now as an array
                  category: component.category,
                }))
            )}
            placeholder="Vælg madkomponenter..."
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "8px",
                padding: "5px",
              }),
            }}
          />
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {defaultMeal.id ? "Update" : "Create"} Meal
        </button>
      </form>
      <button className="bg-red-500 text-white p-2 rounded ml-2">
        <a href="/">Exit</a>
      </button>
    </div>
  );
};

export default MealForm;
