import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Meal } from "../models/Meal";
import { FoodComponent } from "../models/FoodComponent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMealFormSchema,
  editMealFormSchema,
  MealFormValues,
} from "../schemas/mealSchemas";
import { useTranslation } from "react-i18next";
import {
  getTranslatedCuisines,
  getTranslatedMealTypes,
} from "../utils/translationHelpers";

interface MealFormProps {
  meal: Meal;
  foodComponents: FoodComponent[];
  onSubmit: (data: MealFormValues) => Promise<void>;
  onCancel: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const animatedComponents = makeAnimated();

const MealForm: React.FC<MealFormProps> = ({
  meal,
  foodComponents,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isEditMode = Boolean(meal.id);
  const [selectedImageName, setSelectedImageName] = useState("");

  const cuisineOptions = getTranslatedCuisines(t);
  const mealTypeOptions = getTranslatedMealTypes(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(
      isEditMode ? editMealFormSchema : createMealFormSchema,
    ),
    defaultValues: {
      name: meal.name,
      description: meal.description,
      imagePath: meal.imagePath,
      mealCuisine: meal.mealCuisine || "",
      mealType: meal.mealType || "",
      foodComponents: meal.foodComponents || [],
    },
    mode: "onChange",
  });

  const imageRegister = register("image", {
    onChange: (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setSelectedImageName(files[0].name);
        setValue("imagePath", "", {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        setSelectedImageName("");
      }
    },
  });

  // Transform food components for Select component display
  const foodComponentOptions = useMemo(() => {
    // Check if foodComponents is in the nested format (array of category objects)
    if (
      foodComponents.length > 0 &&
      foodComponents[0].category &&
      foodComponents[0].hasOwnProperty("items")
    ) {
      // Flatten the nested structure
      return foodComponents.flatMap((categoryGroup: any) =>
        categoryGroup.items.map((component: any) => ({
          value: component.id,
          label: `${categoryGroup.category}: ${component.componentName}`,
          component: {
            ...component,
            category: { categoryName: categoryGroup.category },
          },
        })),
      );
    }

    // Fallback for the original flat structure
    return foodComponents.map((component) => ({
      value: component.id,
      label: `${component.category?.categoryName || "Unknown"}: ${component.componentName}`,
      component: component,
    }));
  }, [foodComponents]);

  // Get current food components value for the Select component
  const watchedFoodComponents = watch("foodComponents");

  // Convert the current form value to the format expected by Select
  const selectedOptions = useMemo(() => {
    const selectedFoodComponents = watchedFoodComponents || [];

    return selectedFoodComponents.map((component) => ({
      value: component.id,
      label: `${component.category?.categoryName || "Unknown"}: ${component.componentName}`,
      component: component,
    }));
  }, [watchedFoodComponents]);

  // Group options by category for better display
  const groupedOptions = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    foodComponentOptions.forEach((option) => {
      const categoryName = option.component.category?.categoryName || "Unknown";
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(option);
    });

    const result = Object.entries(groups).map(([label, options]) => ({
      label,
      options,
    }));
    return result;
  }, [foodComponentOptions]);

  // Handle food component selection change
  const handleFoodComponentChange = (selectedOptions: any) => {
    const selectedComponents = selectedOptions
      ? selectedOptions.map((option: any) => option.component)
      : [];

    setValue("foodComponents", selectedComponents, {
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
  useEffect(() => {
    console.log("Form errors updated:", errors);
  }, [errors]);
  // Handle meal type selection
  const handleMealTypeChange = (option: any) => {
    setValue("mealType", option ? option.value : "", {
      shouldValidate: true,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          console.log("Form submit triggered");
          console.log("Form errors:", errors);
          console.log("Form values:", watch());
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-5"
      >
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {t("mealForm.mealName")}
          </label>
          <input
            type="text"
            {...register("name")}
            className={`bg-gray-50 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder={t("mealForm.enterMealName")}
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
            {t("mealForm.description")}
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder={t("mealForm.enterDescription")}
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

        {/* Image */}
        <div>
          <input type="hidden" {...register("imagePath")} />

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {isEditMode
              ? t("mealForm.uploadNewImage")
              : t("mealForm.uploadImage")}
          </label>
          <div
            className={`rounded-xl border-2 border-dashed p-4 sm:p-5 transition-colors ${
              errors.image || errors.imagePath
                ? "border-red-400 bg-red-50/60 dark:border-red-400 dark:bg-red-900/10"
                : "border-emerald-300 bg-emerald-50/60 dark:border-emerald-500/60 dark:bg-emerald-900/10"
            }`}
          >
            <input
              id="meal-image-upload"
              type="file"
              accept="image/*"
              {...imageRegister}
              className="sr-only"
            />
            <label
              htmlFor="meal-image-upload"
              className="inline-flex cursor-pointer items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {t("mealForm.chooseImage")}
            </label>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
              {selectedImageName ||
                (isEditMode
                  ? t("mealForm.keepCurrentImage")
                  : t("mealForm.noFileSelected"))}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("mealForm.imageFileHint")}
            </p>
          </div>
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
              {t("mealForm.cuisine")}
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={cuisineOptions}
              value={
                cuisineOptions.find(
                  (option) => option.value === watch("mealCuisine"),
                ) || null
              }
              onChange={handleCuisineChange}
              placeholder={t("mealForm.selectCuisine")}
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
              {t("mealForm.mealType")}
            </label>
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={mealTypeOptions}
              value={
                mealTypeOptions.find(
                  (option) => option.value === watch("mealType"),
                ) || null
              }
              onChange={handleMealTypeChange}
              placeholder={t("mealForm.selectMealType")}
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
            {t("mealForm.foodComponents")}
          </label>

          {/* Debug information 
          {import.meta.env.DEV && (
            <div className="mb-2 p-2 bg-yellow-100 text-xs">
              <p>Food components count: {foodComponents.length}</p>
              <p>Options count: {foodComponentOptions.length}</p>
              <p>Grouped options count: {groupedOptions.length}</p>
            </div>
          )}*/}

          <Select
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={groupedOptions}
            isMulti
            value={selectedOptions}
            onChange={handleFoodComponentChange}
            placeholder={t("mealForm.selectFoodComponents")}
            noOptionsMessage={() => t("mealForm.noMatchingFoodComponents")}
            isLoading={foodComponents.length === 0}
            loadingMessage={() => t("mealForm.loadingFoodComponents")}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="top"
            maxMenuHeight={280}
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
              group: (base) => ({
                ...base,
                paddingTop: 8,
                paddingBottom: 8,
              }),
              groupHeading: (base) => ({
                ...base,
                fontSize: 12,
                fontWeight: 600,
                color: "rgb(156 163 175)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 4,
              }),
            }}
            formatOptionLabel={(option) => (
              <div className="flex items-center justify-between w-full">
                <div>
                  <span>{option.component.componentName}</span>
                  <div className="text-xs text-gray-400">
                    {option.component.category?.categoryName || "Unknown"}
                  </div>
                </div>
              </div>
            )}
          />
          {errors.foodComponents && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.foodComponents.message}
            </p>
          )}

          {/* Display selected components grouped by category 
          {selectedFoodComponents.length > 0 && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Components ({selectedFoodComponents.length}):
              </h4>
              <div className="space-y-2">
                {Object.entries(
                  selectedFoodComponents.reduce(
                    (acc, component) => {
                      const categoryName =
                        component.category?.categoryName || "Unknown";
                      if (!acc[categoryName]) acc[categoryName] = [];
                      acc[categoryName].push(component);
                      return acc;
                    },
                    {} as { [key: string]: typeof selectedFoodComponents }
                  )
                ).map(([categoryName, components]) => (
                  <div key={categoryName}>
                    <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {categoryName}
                    </h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {components.map((component) => (
                        <span
                          key={component.id}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        >
                          {component.componentName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}*/}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 text-center disabled:bg-green-300"
          >
            {isSubmitting
              ? t("editMealPage.updatingMeal")
              : meal.id
                ? t("editMealPage.updateMeal")
                : t("mealForm.createMeal")}
          </button>
          <a
            href="/"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex-1 text-center"
          >
            {t("editMealPage.cancel")}
          </a>
        </div>
      </form>
    </div>
  );
};

export default MealForm;
