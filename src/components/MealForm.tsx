import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";
import { cuisines, mealsTypes } from "../assets/Arrays";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mealFormSchema, MealFormValues } from "../schemas/mealSchemas";

interface MealFormProps {
  meal: Meal;
  foodComponentOptions: { label: string; value: string[]; category: string }[];
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: defaultMeal.name,
      description: defaultMeal.description,
      imagePath: defaultMeal.imagePath,
      mealCuisine: defaultMeal.mealCuisine,
      mealType: defaultMeal.mealType,
      foodComponents: defaultMeal.foodComponents,
    },
    mode: "onBlur",
  });

  const filteredFoodComponentOptions = React.useMemo(() => {
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Navn
          </label>
          <input
            type="text"
            {...register("name")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
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
            <Controller
              name="mealCuisine"
              control={control}
              render={({ field }) => (
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  options={cuisineOptions}
                  value={
                    cuisineOptions.find(
                      (option) => option.value === field.value,
                    ) || null
                  }
                  onChange={(option) =>
                    field.onChange(option ? option.value : "")
                  }
                  onBlur={field.onBlur}
                />
              )}
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
            <Controller
              name="mealType"
              control={control}
              render={({ field }) => (
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  options={mealTypeOptions}
                  value={
                    mealTypeOptions.find(
                      (option) => option.value === field.value,
                    ) || null
                  }
                  onChange={(option) =>
                    field.onChange(option ? option.value : "")
                  }
                  onBlur={field.onBlur}
                />
              )}
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
          <Controller
            name="foodComponents"
            control={control}
            render={({ field }) => (
              <Select
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={filteredFoodComponentOptions}
                isMulti
                value={field.value?.flatMap((component: FoodComponent) =>
                  component.items.map((item) => ({
                    label: `${component.category}: ${item}`,
                    value: [item],
                    category: component.category,
                  })),
                )}
                onChange={(selectedOptions) => {
                  const formattedComponents = selectedOptions.map(
                    (option: any) => ({
                      category: option.category,
                      items: option.value,
                    }),
                  );
                  field.onChange(formattedComponents);
                }}
                onBlur={field.onBlur}
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
            {isSubmitting
              ? "Gemmer..."
              : defaultMeal.id
                ? "Opdater Ret"
                : "Opret Ret"}
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
