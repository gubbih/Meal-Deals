import React from "react";
import Select from "react-select";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";

interface MealFormProps {
  meal: Meal;
  cuisines: string[];
  meals: string[];
  categoryOptions: { label: string; value: string[]; category: string }[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFoodComponentChange: (selectedOptions: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MealForm: React.FC<MealFormProps> = ({
  meal,
  cuisines,
  meals,
  categoryOptions,
  handleChange,
  handleFoodComponentChange,
  handleSubmit,
}) => {
  console.log("meal: ", meal);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={meal.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={meal.description}
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Cuisine Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Cuisine</label>
          <select
            name="cuisine"
            value={meal.cuisine || ""}
            onChange={handleChange}
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
            name="meal"
            value={meal.meal || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {meals.map((mealType) => (
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
            options={categoryOptions}
            isMulti
            onChange={handleFoodComponentChange}
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
