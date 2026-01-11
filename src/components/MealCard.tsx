import React from "react";
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
  return (
    <div key={meal.id} className="relative group pb-1">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full">
        <Link
          to={`/meal/${meal.id}`}
          className="block overflow-hidden rounded-t-lg"
        >
          <img
            src={meal.imagePath}
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
        </div>
      </div>
    </div>
  );
};

export default MealCard;
