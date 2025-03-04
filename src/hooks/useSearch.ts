import { useState, useMemo } from "react";
import { Meal } from "../models/Meal";

export const useSearch = (meals: Meal[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    if (!searchTerm) return meals;

    const lowercaseSearchTerm = searchTerm.toLowerCase();

    return meals.filter((meal) => {
      // Search in meal name
      const nameMatch = meal.name.toLowerCase().includes(lowercaseSearchTerm);

      // Search in description
      const descriptionMatch = meal.description
        .toLowerCase()
        .includes(lowercaseSearchTerm);

      // Search in food components
      const foodComponentMatch = meal.foodComponents.some((fc) =>
        fc.items.some((item) =>
          item.toLowerCase().includes(lowercaseSearchTerm),
        ),
      );

      // Search in meal type and cuisine
      const mealTypeMatch = meal.mealType
        ?.toLowerCase()
        .includes(lowercaseSearchTerm);
      const cuisineMatch = meal.mealCuisine
        ?.toLowerCase()
        .includes(lowercaseSearchTerm);

      return (
        nameMatch ||
        descriptionMatch ||
        foodComponentMatch ||
        mealTypeMatch ||
        cuisineMatch
      );
    });
  }, [meals, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
  };
};
