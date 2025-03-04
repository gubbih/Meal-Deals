import { useState, useMemo } from "react";
import { Meal } from "../models/Meal";

export const useSortedMeals = (meals: Meal[]) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Meal;
    direction: "ascending" | "descending";
  }>({
    key: "name",
    direction: "ascending",
  });

  const sortedMeals = useMemo(() => {
    const sortableItems = [...meals];
    sortableItems.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      // Handle potential undefined values
      if (valueA == null) return sortConfig.direction === "ascending" ? 1 : -1;
      if (valueB == null) return sortConfig.direction === "ascending" ? -1 : 1;

      // Compare strings or numbers
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.direction === "ascending"
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });

    return sortableItems;
  }, [meals, sortConfig]);

  const requestSort = (key: keyof Meal) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return {
    sortedMeals,
    requestSort,
    sortConfig,
  };
};
