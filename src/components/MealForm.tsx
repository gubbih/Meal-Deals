import React, { useEffect, useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Meal } from "../models/Meal";
import { cuisines, mealsTypes } from "../assets/Arrays";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mealFormSchema, MealFormValues } from "../schemas/mealSchemas";
import { useTranslation } from "react-i18next";
import {
  getTranslatedCuisines,
  getTranslatedMealTypes,
} from "../utils/translationHelpers";

interface MealFormProps {
  meal: Meal;
  foodComponentOptions: { label: string; value: string; category: string }[];
  onSubmit: (data: MealFormValues) => Promise<void>;
  onCancel: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const animatedComponents = makeAnimated();

const MealForm: React.FC<MealFormProps> = ({
  meal,
  foodComponentOptions,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const cuisineOptions = getTranslatedCuisines(t);
  const mealTypeOptions = getTranslatedMealTypes(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: meal.name,
      description: meal.description,
      imagePath: meal.imagePath,
      mealCuisine: meal.mealCuisine,
      mealType: meal.mealType,
      foodComponents: meal.foodComponents,
    },
    mode: "onChange",
  });

  // Get current food components value for the Select component
  const foodComponents = watch("foodComponents") || [];

  // Convert the current form value to the format expected by Select
  const selectedFoodComponents = useMemo(() => {
    return foodComponents.flatMap((component) =>
      component.items.map((item) => ({
        label: `${component.category}: ${item}`,
        value: item,
        category: component.category,
      }))
    );
  }, [foodComponents]);

  // Handle food component selection change
  const handleFoodComponentChange = (selectedOptions: any) => {
    // Group selected options by category
    const categoryMap = new Map<string, string[]>();

    selectedOptions.forEach((option: any) => {
      if (!categoryMap.has(option.category)) {
        categoryMap.set(option.category, []);
      }
      categoryMap.get(option.category)?.push(option.value);
    });

    // Convert map to array format
    const formattedComponents = Array.from(categoryMap.entries()).map(
      ([category, items]) => ({
        category,
        items,
      })
    );

    setValue("foodComponents", formattedComponents, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Handle cuisine selection
  const handleCuisineChange = (option: any) => {
    setValue("mealCuisine", option ? option.value : "", {
      shouldValidate: true,
    });
  };

  // Handle meal type selection
  const handleMealTypeChange = (option: any) => {
    setValue("mealType", option ? option.value : "", {
      shouldValidate: true,
    });
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
    }
  }, [errors]);
  const filteredFoodComponentOptions = React.useMemo(() => {
    // Create a map of existing components for easier lookup
    const existingComponents = new Map();
    foodComponents.forEach((component) => {
      component.items.forEach((item) => {
        existingComponents.set(`${component.category}:${item}`, true);
      });
    });

    // Map all food component options and mark those already selected as disabled
    return foodComponentOptions.map((option) => {
      const isSelected = existingComponents.has(
        `${option.category}:${option.value}`
      );
      return {
        ...option,
        isDisabled: isSelected,
      };
    });
  }, [foodComponentOptions, foodComponents]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Navn
          </label>
          <input
            type="text"
            {...register("name")}
            className={`bg-gray-50 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="Enter meal name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Beskrivelse
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Enter meal description"
            className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Billed Link
          </label>
          <input
            type="text"
            {...register("imagePath")}
            placeholder="https://example.com/image.jpg"
            className={`bg-gray-50 border ${
              errors.imagePath ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          />

          <br />
          {/* image button*/}
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className={`bg-gray-50 border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          />
          {errors.image?.message && (
            <p className="text-red-500 text-sm">
              {String(errors.image.message)}
            </p>
          )}
          {errors.imagePath && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.imagePath.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Køkkenstil
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={cuisineOptions}
              value={
                cuisineOptions.find(
                  (option) => option.value === watch("mealCuisine")
                ) || null
              }
              onChange={handleCuisineChange}
              placeholder="Select cuisine style"
              isSearchable={true}
            />
            {errors.mealCuisine && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.mealCuisine.message}
              </p>
            )}
          </div>

          {/* mealType */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Måltid
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={mealTypeOptions}
              value={
                mealTypeOptions.find(
                  (option) => option.value === watch("mealType")
                ) || null
              }
              onChange={handleMealTypeChange}
              placeholder="Select meal type"
              isSearchable={true}
            />
            {errors.mealType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.mealType.message}
              </p>
            )}
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
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={filteredFoodComponentOptions}
            isMulti
            value={selectedFoodComponents}
            onChange={handleFoodComponentChange}
            placeholder="Vælg madkomponenter..."
            noOptionsMessage={() => "No matching food components"}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({
                ...base,
                backgroundColor:
                  "var(--tw-bg-opacity, 1) rgb(55 65 81 / var(--tw-bg-opacity))",
              }),
              menuList: (base) => ({
                ...base,
                backgroundColor: "transparent",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "rgb(75 85 99)"
                  : state.isFocused
                    ? "rgb(55 65 81)"
                    : "transparent",
                color: "rgb(229 231 235)",
                "&:hover": {
                  backgroundColor: "rgb(75 85 99)",
                },
              }),
            }}
            formatOptionLabel={(option) => (
              <div className="flex items-center justify-between w-full">
                <div>
                  <span>{option.label}</span>
                </div>
              </div>
            )}
          />
          {errors.foodComponents && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.foodComponents.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 text-center disabled:bg-green-300"
          >
            {isSubmitting ? "Gemmer..." : meal.id ? "Opdater Ret" : "Opret Ret"}
          </button>
          <a
            href="/"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex-1 text-center"
          >
            Annuller
          </a>
        </div>
      </form>
    </div>
  );
};

export default MealForm;
