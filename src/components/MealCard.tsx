import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Meal } from "../models/Meal";
import { User } from "../models/User";
import FavoriteButton from "./FavoriteButton";
import useFavoriteMeals from "../hooks/useFavoriteMeals";

interface MealCardProps {
  meal: Meal;
  user: User | null;
}

const MealCard: React.FC<MealCardProps> = ({ meal, user }) => {
  const { addToFavorites, removeFromFavorites, favorites } = useFavoriteMeals();

  const handleToggleFavorite = async (
    mealId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) return;

    try {
      if (favorites.includes(mealId)) {
        await removeFromFavorites(mealId);
      } else {
        await addToFavorites(mealId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  // Group food components by category
  const groupedFoodComponents = useMemo(() => {
    if (!meal.foodComponents || meal.foodComponents.length === 0) return {};

    return meal.foodComponents.reduce(
      (acc, component) => {
        const categoryName = component.category.categoryName;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(component);
        return acc;
      },
      {} as { [key: string]: typeof meal.foodComponents }
    );
  }, [meal.foodComponents]);

  return (
    <div key={meal.id} className="relative group pb-1">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full">
        <Link
          to={`/meal/${meal.id}`}
          className="block overflow-hidden rounded-t-lg"
        >
          <img
            src={"https://api.cheapmeals.dk" + meal.imagePath}
            alt={meal.name}
            className="rounded-t-md h-40 sm:h-48 md:h-56 w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {user && (
          <FavoriteButton
            mealId={meal.id}
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
          />
        )}

        <div className="p-3 md:p-4">
          <Link to={`/meal/${meal.id}`}>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
              {meal.name}
            </h2>
          </Link>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {meal.description}
          </p>

          {/* Price display */}
          {meal.price && (
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {meal.price} {meal.priceCurrency || "DKK"}
            </p>
          )}

          {/* Meal type and cuisine */}
          <div className="mt-2 flex flex-wrap gap-2">
            {meal.mealType && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {meal.mealType}
              </span>
            )}
            {meal.mealCuisine && (
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {meal.mealCuisine}
              </span>
            )}
          </div>

          {/* Food components grouped by category */}
          {Object.keys(groupedFoodComponents).length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Ingredients:
              </h4>
              <div className="space-y-1">
                {Object.entries(groupedFoodComponents)
                  .slice(0, 3)
                  .map(([categoryName, components]) => (
                    <div key={categoryName} className="text-xs">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {categoryName}:
                      </span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400">
                        {components
                          .slice(0, 3)
                          .map((comp) => comp.componentName)
                          .join(", ")}
                        {components.length > 3 &&
                          ` (+${components.length - 3} more)`}
                      </span>
                    </div>
                  ))}
                {Object.keys(groupedFoodComponents).length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{Object.keys(groupedFoodComponents).length - 3} more
                    categories
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Creator info */}
          {meal.user && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              By {meal.user.displayName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
