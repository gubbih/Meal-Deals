import React, { useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";
import { cuisines, mealsTypes } from "../assets/Arrays";

interface MealFormProps {
  meal: Meal;
  foodComponentOptions: { label: string; value: string[]; category: string }[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFoodComponentChange: (selectedOptions: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCuisineChange: (selectedOption: any) => void;
  onMealTypeChange: (selectedOption: any) => void;
  onCancel: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}
const animatedComponents = makeAnimated();
const MealForm: React.FC<MealFormProps> = ({
  meal,
  foodComponentOptions,
  onInputChange,
  onFoodComponentChange,
  onSubmit,
  onCuisineChange,
  onMealTypeChange,
  onCancel,
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
        component.items.includes(option.value[0]),
      ),
    }));
  }, [foodComponentOptions, defaultMeal.foodComponents]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Navn
          </label>
          <input
            required
            type="text"
            name="name"
            value={defaultMeal.name}
            onChange={onInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Beskrivelse
          </label>
          <textarea
            name="description"
            defaultValue={defaultMeal.description}
            onChange={onInputChange}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Billed Link
          </label>
          <input
            required
            type="text"
            name="imagePath"
            value={defaultMeal.imagePath}
            onChange={onInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Køkkenstil
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              name="mealCuisine"
              required
              value={
                cuisineOptions.find(
                  (option) => option.value === defaultMeal.mealCuisine,
                ) || null
              }
              onChange={onCuisineChange}
              options={cuisineOptions}
            />
          </div>

          {/* mealType */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Måltid
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              name="mealType"
              required
              value={
                mealTypeOptions.find(
                  (option) => option.value === defaultMeal.mealType,
                ) || null
              }
              onChange={onMealTypeChange}
              options={mealTypeOptions}
            />
          </div>
        </div>

        {/* Food Components Multi-Select */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Madkomponenter
          </label>
          <Select
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            required
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={filteredFoodComponentOptions}
            isMulti
            onChange={onFoodComponentChange}
            value={defaultMeal.foodComponents.flatMap(
              (component: FoodComponent) =>
                component.items.map((item) => {
                  return {
                    label: `${item}`,
                    value: [item],
                    category: component.category,
                  };
                }),
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
                cursor: isDisabled ? "not-allowed" : "default",
              }),
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 text-center"
          >
            {defaultMeal.id ? "Update" : "Create"} Ret
          </button>
          <a
            href="/"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex-1 text-center"
          >
            Anullere
          </a>
        </div>
      </form>
    </div>
  );
};

export default MealForm;
