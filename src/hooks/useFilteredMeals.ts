import { useState, useMemo } from "react";
import { Meal } from "../models/Meal";

export const useFilteredMeals = (meals: Meal[]) => {
  const [filters, setFilters] = useState<{
    cuisine?: string;
    mealType?: string;
    searchTerm?: string;
    foodComponent?: string;
    limit?: number;
  }>({});

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Filter by cuisine
      if (filters.cuisine && meal.mealCuisine !== filters.cuisine) {
        return false;
      }

      // Filter by meal type
      if (filters.mealType && meal.mealType !== filters.mealType) {
        return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesName = meal.name.toLowerCase().includes(searchTerm);
        const matchesDescription = meal.description
          .toLowerCase()
          .includes(searchTerm);

        if (!matchesName && !matchesDescription) {
          return false;
        }
      }
      // Filter by limit
      if (filters.limit && filters.limit > 0) {
        return meals.slice(0, filters.limit);
      }
      // Filter by food component
      if (filters.foodComponent) {
        const hasFoodComponent = meal.foodComponents.some((fc) =>
          fc.items.some((item) =>
            item.toLowerCase().includes(filters.foodComponent!.toLowerCase()),
          ),
        );

        if (!hasFoodComponent) {
          return false;
        }
      }

      return true;
    });
  }, [meals, filters]);

  return {
    filteredMeals,
    setFilters,
    filters,
  };
};
