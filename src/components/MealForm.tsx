import React, { useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
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
const animatedComponents = makeAnimated();
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
  const defaultMeal = {
    mealCuisine: meal.mealCuisine || "",
    mealType: meal.mealType || "",
    ...meal,
  };
  const cuisineOptions = cuisines.map((cuisine) => ({
    value: cuisine,
    label: cuisine,
  }));

  const mealTypeOptions = mealsTypes.map((mealType) => ({
    value: mealType,
    label: mealType,
  }));

  const filteredFoodComponentOptions = useMemo(() => {
    return foodComponentOptions.map((option) => ({
      ...option,
      value: option.value,
      label: `${option.category}: ${option.value[0]}`,
      isDisabled: defaultMeal.foodComponents.some((component) =>
        component.items.includes(option.value[0])
      ),
    }));
  }, [foodComponentOptions, defaultMeal.foodComponents]);

  return (
    <div className="p-4 bg-white shadow-md rounded w-full">
      <form onSubmit={onSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Navn</label>
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
          <label className="block text-gray-700">Beskrivelse</label>
          <textarea
            name="description"
            value={defaultMeal.description}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-gray-700">Billed Link</label>
          <input
            type="text"
            name="imagePath"
            value={defaultMeal.imagePath}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Køkkenstil</label>
          <Select
            name="mealCuisine"
            value={
              cuisineOptions.find(
                (option) => option.value === defaultMeal.mealCuisine
              ) || null
            }
            onChange={onCuisineChange}
            options={cuisineOptions}
            className="w-full"
          />
        </div>
        {/* mealType */}
        <div className="mb-4">
          <label className="block text-gray-700">Måltid</label>
          <Select
            name="mealType"
            value={
              mealTypeOptions.find(
                (option) => option.value === defaultMeal.mealType
              ) || null
            }
            onChange={onMealTypeChange}
            options={mealTypeOptions}
            className="w-full"
          />
        </div>
        {/* Food Components Multi-Select */}
        <div className="mb-4">
          <label className="block text-gray-700">Madkomponenter</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={filteredFoodComponentOptions}
            isMulti
            onChange={onFoodComponentChange}
            value={defaultMeal.foodComponents.flatMap(
              (component: FoodComponent) =>
                (Array.isArray(component.items) ? component.items : []).map(
                  (item) => {
                    /*removes selected from list
                    const matchedOption = filteredFoodComponentOptions.find(
                      (option) => option.value[0] === item
                    );*/
                    return /*matchedOption ||*/ {
                      label: `${component.category}: ${item}`,
                      value: [item],
                      category: component.category,
                    };
                  }
                )
            )}
            placeholder="Vælg madkomponenter..."
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "8px",
                padding: "5px",
              }),
              option: (styles, { isDisabled, isFocused, isSelected }) => ({
                ...styles,
                backgroundColor: isDisabled
                  ? undefined
                  : isSelected
                    ? "#ccc"
                    : isFocused
                      ? "#eee"
                      : undefined,
                color: isDisabled ? "#ccc" : isSelected ? "#fff" : "#000",
                cursor: isDisabled ? "not-allowed" : "default",
              }),
            }}
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {defaultMeal.id ? "Update" : "Create"} Ret
        </button>
        <a href="/" className="bg-red-500 text-white p-2 rounded ml-2 mt-2 ">
          Anullere
        </a>
      </form>
    </div>
  );
};

export default MealForm;
