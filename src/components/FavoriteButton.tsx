import React, { useEffect, useState } from "react";
import { useAuth } from "../services/firebase";

interface FavoriteButtonProps {
  mealId: string;
  favorites: string[];
  handleToggleFavorite: (
    mealId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  mealId,
  favorites,
  handleToggleFavorite,
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(favorites.includes(mealId));

  useEffect(() => {
    setIsFavorite(favorites.includes(mealId));
  }, [favorites, mealId]);

  return (
    <div
      onClick={(e) => handleToggleFavorite(mealId, e)}
      className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition cursor-pointer"
    >
      <svg
        className={`w-6 h-6 ${isFavorite ? "text-red-600" : "text-gray-600"}`}
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
  );
};

export default FavoriteButton;
