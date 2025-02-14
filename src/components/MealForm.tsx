import React from "react";
import Select from "react-select";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";
import { cuisines, mealsTypes } from "../assets/Arrays";

interface MealFormProps {
  meal: Meal;
  foodComponentOptions: { value: string; category: string }[];
  categoryOptions: { label: string; value: string; category: string }[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFoodComponentChange: (selectedOptions: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MealForm: React.FC<MealFormProps> = ({
  meal,
  foodComponentOptions,
  categoryOptions,
  onInputChange,
  onFoodComponentChange,
  onSubmit,
}) => {
  console.log("meal: ", meal);

  // Filter out selected options from foodComponentOptions
  const filteredFoodComponentOptions = foodComponentOptions
    .filter(
      (option) =>
        !meal.foodComponents.some((component) =>
          component.items.includes(option.value)
        )
    )
    .map((option) => ({
      ...option,
      value: [option.value],
      label: `${option.category}: ${option.value}`,
    }));

  return (
    <div>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={meal.name}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={meal.description}
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
            value={meal.imagePath}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Cuisine Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Cuisine</label>
          <select
            name="mealCuisine" // Ensure this matches the property name in the meal object
            value={meal.mealCuisine || ""}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Meal Type</label>
          <select
            name="mealType"
            value={meal.mealType || ""}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {mealsTypes.map((mealType) => (
              <option key={mealType} value={mealType}>
                {mealType}
              </option>
            ))}
          </select>
        </div>

        {/* Food Components Multi-Select */}
        <div className="mb-4">
          <label className="block text-gray-700">Food Components</label>
          <Select
            options={filteredFoodComponentOptions}
            isMulti
            onChange={onFoodComponentChange}
            value={meal.foodComponents.map((component: FoodComponent) => ({
              label: `${component.category}: ${component.items}`,
              value: component.items,
              category: component.category,
            }))}
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
          {meal.id ? "Update" : "Create"} Meal
        </button>
      </form>
      <button className="bg-red-500 text-white p-2 rounded ml-2">
        <a href="/">Exit</a>
      </button>
    </div>
  );
};

export default MealForm;
